import React, { useState, useEffect } from 'react';
import { Layers, BookOpen, Award, Sparkles, Smartphone, Network, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { calculateCourseProgress } from './utils/aiProgress';

// Import components
import Dashboard, { InterviewSim } from './components/Dashboard';
import CourseList from './components/CourseList';
import Settings from './components/Settings';
import CourseModal from './components/CourseModal';
import KnowledgeGraph from './components/KnowledgeGraph';
import ThesisReview from './components/ThesisReview';
import Toast from './components/ui/Toast';
import useFavicon from './hooks/useFavicon';
import { useCourseData } from './hooks/useCourseData';

const DEMO_USER_ID = 'demo-user-1';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [history, setHistory] = useState([]); // Navigation history stack
  const [toast, setToast] = useState(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false); // Main menu collapse state

  // AI Config State
  const [aiConfig, setAiConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_config');
      return saved ? JSON.parse(saved) : {
        model: 'gemini-2.5-flash-preview-09-2025',
        apiKey: '',
        provider: 'google'
      };
    } catch {
      return {
        model: 'gemini-2.5-flash-preview-09-2025',
        apiKey: '',
        provider: 'google'
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  useFavicon();

  // 1. Get base course data
  const { data: baseCoursesData } = useCourseData();
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    if (baseCoursesData) {
      setCoursesData(baseCoursesData);
    }
  }, [baseCoursesData]);

  // 2. Load Firestore notes and merge
  useEffect(() => {
    const loadNotesFromFirestore = async () => {
      if (!baseCoursesData || baseCoursesData.length === 0) return;

      try {
        const q = query(collection(db, 'notes'), where('userId', '==', DEMO_USER_ID));
        const snapshot = await getDocs(q);
        const remoteNotes = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const progressSnap = await getDocs(collection(db, 'course_progress'));
        const progressMap = {};
        progressSnap.forEach(doc => {
          if (doc.data().userId === DEMO_USER_ID) {
            progressMap[doc.data().courseId] = {
              percentage: doc.data().percentage,
              suggestion: doc.data().suggestion || ""
            };
          }
        });

        setCoursesData(prev =>
          prev.map(cat => ({
            ...cat,
            courses: cat.courses.map(course => {
              const notesForCourse = remoteNotes.filter(n => n.courseId === course.id);
              if (!notesForCourse.length) return course;

              const formatted = notesForCourse
                .map(n => ({
                  id: n.id,
                  question: n.question,
                  answer: n.answer,
                  date: n.createdAt
                    ? new Date(n.createdAt.seconds * 1000).toLocaleDateString()
                    : new Date().toLocaleDateString(),
                }))
                .sort((a, b) => (a.date < b.date ? 1 : -1));

              const pData = progressMap[course.id] || { percentage: 0, suggestion: "" };

              return {
                ...course,
                notes: formatted,
                progress: pData.percentage,
                suggestion: pData.suggestion
              };
            }),
          }))
        );
      } catch (e) {
        console.error('加载 Firestore 笔记失败:', e);
      }
    };

    loadNotesFromFirestore();
  }, [baseCoursesData]);

  const selectedCourse = selectedCourseId
    ? coursesData.flatMap(c => c.courses).find(c => c.id === selectedCourseId)
    : null;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const saveNote = async (courseId, question, answer) => {
    try {
      const createdAt = new Date();
      const docRef = await addDoc(collection(db, 'notes'), {
        userId: DEMO_USER_ID,
        courseId,
        question,
        answer,
        createdAt,
      });

      const newNote = {
        id: docRef.id,
        question,
        answer,
        date: createdAt.toLocaleDateString(),
      };

      setCoursesData(prevData =>
        prevData.map(cat => ({
          ...cat,
          courses: cat.courses.map(c => {
            if (c.id === courseId) {
              const existingNotes = c.notes || [];
              const updatedNotes = [newNote, ...existingNotes];

              (async () => {
                try {
                  const currentCourse = coursesData.flatMap(cat => cat.courses).find(co => co.id === courseId);
                  const goals = currentCourse?.goals?.cn || "";
                  const name = currentCourse?.name || "";
                  const currentProgress = c.progress || 0;

                  const { progress: newProgress, suggestion } = await calculateCourseProgress(name, goals, updatedNotes, currentProgress, aiConfig);

                  if (newProgress !== currentProgress || suggestion) {
                    await setDoc(doc(db, 'course_progress', `${DEMO_USER_ID}_${courseId}`), {
                      userId: DEMO_USER_ID,
                      courseId,
                      percentage: newProgress,
                      suggestion,
                      lastUpdated: new Date(),
                      noteCount: updatedNotes.length
                    });

                    setCoursesData(latest => latest.map(category => ({
                      ...category,
                      courses: category.courses.map(co =>
                        co.id === courseId ? { ...co, progress: newProgress, suggestion } : co
                      )
                    })));

                    if (newProgress > currentProgress) {
                      showToast(`AI 评估：当前掌握度提升至 ${newProgress}%`);
                    } else if (newProgress < currentProgress) {
                      showToast(`AI 评估：当前掌握度调整为 ${newProgress}%`);
                    }
                  }
                } catch (err) {
                  console.error("Auto progress update failed", err);
                }
              })();

              return { ...c, notes: updatedNotes };
            }
            return c;
          }),
        }))
      );

      showToast('笔记已保存（已同步到云端）');
    } catch (e) {
      console.error('保存笔记到 Firestore 失败:', e);
      showToast('笔记保存失败，请稍后重试');
    }
  };

  const deleteNote = async (courseId, noteId) => {
    if (!window.confirm('确定要删除这条笔记吗？')) return;

    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (e) {
      console.warn('删除 Firestore 笔记时出现问题:', e);
    }

    setCoursesData(prevData =>
      prevData.map(cat => ({
        ...cat,
        courses: cat.courses.map(c => {
          if (c.id === courseId) {
            const updatedNotes = (c.notes || []).filter(n => n.id !== noteId);

            (async () => {
              try {
                const currentCourse = coursesData.flatMap(cat => cat.courses).find(co => co.id === courseId);
                const goals = currentCourse?.goals?.cn || "";
                const name = currentCourse?.name || "";
                const currentProgress = c.progress || 0;

                const { progress: newProgress, suggestion } = await calculateCourseProgress(name, goals, updatedNotes, currentProgress, aiConfig);

                if (newProgress !== currentProgress || suggestion) {
                  await setDoc(doc(db, 'course_progress', `${DEMO_USER_ID}_${courseId}`), {
                    userId: DEMO_USER_ID,
                    courseId,
                    percentage: newProgress,
                    suggestion,
                    lastUpdated: new Date(),
                    noteCount: updatedNotes.length
                  });

                  setCoursesData(latest => latest.map(category => ({
                    ...category,
                    courses: category.courses.map(co =>
                      co.id === courseId ? { ...co, progress: newProgress, suggestion } : co
                    )
                  })));

                  if (newProgress < currentProgress) {
                    showToast(`笔记删除，掌握度调整为 ${newProgress}%`);
                  }
                }
              } catch (e) {
                console.error("Progress recalc on delete failed", e);
              }
            })();

            return { ...c, notes: updatedNotes };
          }
          return c;
        }),
      }))
    );
    showToast('笔记已删除');
  };

  const handleUpdateAllProgress = async (onProgress) => {
    if (!aiConfig.apiKey) {
      showToast('❌ 请先配置 API Key');
      return;
    }

    if (!window.confirm('这将使用 AI 重新评估所有有笔记的课程进度，可能需要一些时间。\n\n确定要继续吗？')) return;

    showToast('🚀 开始更新所有课程进度...');
    let updatedCount = 0;

    const coursesWithNotes = coursesData.flatMap(cat => cat.courses).filter(c => c.notes && c.notes.length > 0);
    const total = coursesWithNotes.length;

    const progressSnapshot = await getDocs(collection(db, 'course_progress'));
    const progressDataMap = {};
    progressSnapshot.forEach(doc => {
      if (doc.data().userId === DEMO_USER_ID) {
        progressDataMap[doc.data().courseId] = doc.data();
      }
    });

    for (let i = 0; i < total; i++) {
      const course = coursesWithNotes[i];
      const currentNoteCount = course.notes ? course.notes.length : 0;
      const lastProgressData = progressDataMap[course.id];
      const lastNoteCount = lastProgressData?.noteCount || 0;

      if (lastProgressData && lastNoteCount === currentNoteCount && lastProgressData.suggestion) {
        if (onProgress) onProgress(i + 1, total);
        continue;
      }

      if (onProgress) onProgress(i + 1, total);

      try {
        const goals = course.goals?.cn || "";
        const name = course.name || "";
        const currentProgress = course.progress || 0;

        const { progress: newProgress, suggestion } = await calculateCourseProgress(name, goals, course.notes, currentProgress, aiConfig);

        if (newProgress !== currentProgress || suggestion) {
          await setDoc(doc(db, 'course_progress', `${DEMO_USER_ID}_${course.id}`), {
            userId: DEMO_USER_ID,
            courseId: course.id,
            percentage: newProgress,
            suggestion,
            lastUpdated: new Date(),
            noteCount: course.notes ? course.notes.length : 0
          });
          updatedCount++;
        }
      } catch (err) {
        console.error(`Failed to update progress for ${course.name}:`, err);
      }
    }

    if (updatedCount > 0) {
      showToast(`✅ 更新完成！${updatedCount} 个课程进度已变更。即将刷新...`);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToast('✅ 更新完成！所有课程进度暂无变化。');
    }
  };

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [highlightTerm, setHighlightTerm] = useState(null);

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard setActiveTab={setTab} aiConfig={aiConfig} />;
      case 'courses': return (
        <CourseList
          courses={coursesData}
          setSelectedCourse={(c, noteId, term) => {
            setSelectedCourseId(c.id);
            setHistory([]); // Reset history on new selection from list
            setSelectedNoteId(noteId || null);
            setHighlightTerm(term || null);
          }}
        />
      );
      case 'graph': return <KnowledgeGraph
        onCourseClick={(courseId) => {
          setSelectedCourseId(courseId);
          setSelectedNoteId(null);
          setHighlightTerm(null);
        }}
      />;
      case 'thesis': return <ThesisReview />;
      case 'interview': return <InterviewSim aiConfig={aiConfig} />;
      case 'settings': return <Settings aiConfig={aiConfig} setAiConfig={setAiConfig} showToast={showToast} onUpdateAllProgress={handleUpdateAllProgress} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 h-full p-3 z-20 flex-shrink-0 transition-all duration-300 ease-in-out relative ${isMenuCollapsed ? 'w-20 items-center' : 'w-64'}`}>
        <div className={`flex items-center space-x-3 px-2 py-4 mb-2 ${isMenuCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">RS</div>
          {!isMenuCollapsed && <span className="font-bold text-slate-800 text-lg tracking-tight whitespace-nowrap overflow-hidden">Logic Prep</span>}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          className="absolute top-8 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-slate-600 hover:scale-110 transition-all z-30"
          title={isMenuCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isMenuCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <nav className="space-y-2 flex-1 w-full mt-4">
          {[
            { id: 'dashboard', label: '概览 Dashboard', icon: Layers },
            { id: 'courses', label: '课程 Courses', icon: BookOpen },
            { id: 'graph', label: '图谱 Graph', icon: Network },
            { id: 'thesis', label: '毕业论文 Thesis', icon: GraduationCap },
            { id: 'interview', label: '模拟 Interview', icon: Award },
            { id: 'settings', label: '设置 Settings', icon: Sparkles }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center ${isMenuCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'} py-3 rounded-xl transition-all font-medium text-sm ${tab === item.id ? 'bg-teal-50 text-teal-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              title={isMenuCollapsed ? item.label : ""}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isMenuCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
            </button>
          ))}
        </nav>

        {!isMenuCollapsed && <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 px-4 whitespace-nowrap overflow-hidden">APS Prep Assistant v2.9</div>}
      </aside>

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30">
          <div className="flex items-center space-x-3" onClick={() => setTab('dashboard')}>
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">RS</div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">Logic Prep</span>
          </div>
          <Smartphone className="w-5 h-5 text-slate-400" />
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>

        <nav className="md:hidden bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-30 pb-safe sm:pb-3">
          {['dashboard', 'courses', 'graph', 'thesis', 'settings'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex flex-col items-center w-16 space-y-1.5 ${tab === t ? 'text-teal-600 scale-105' : 'text-slate-400'}`}>
              {t === 'dashboard' ? <Layers className="w-6 h-6" /> :
                t === 'courses' ? <BookOpen className="w-6 h-6" /> :
                  t === 'graph' ? <Network className="w-6 h-6" /> :
                    t === 'thesis' ? <GraduationCap className="w-6 h-6" /> :
                      t === 'interview' ? <Award className="w-6 h-6" /> :
                        <Sparkles className="w-6 h-6" />}
              <span className="text-[10px] font-bold uppercase">{t}</span>
            </button>
          ))}
        </nav>
      </div>

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => { setSelectedCourseId(null); setSelectedNoteId(null); setHighlightTerm(null); setHistory([]); }}
          onSaveNote={saveNote}
          onDeleteNote={deleteNote}
          // Navigation Props
          onNavigate={(targetId) => {
            if (targetId === selectedCourseId) return;
            setHistory(prev => [...prev, selectedCourseId]);
            setSelectedCourseId(targetId);
          }}
          onBack={() => {
            if (history.length === 0) return;
            const prevId = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            setSelectedCourseId(prevId);
          }}
          canGoBack={history.length > 0}
          aiConfig={aiConfig}
          setTab={setTab}
          initialNoteId={selectedNoteId}
          highlightTerm={highlightTerm}
        />
      )}
    </div>
  );
}