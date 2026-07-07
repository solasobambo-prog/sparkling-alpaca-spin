"use client";

import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Database,
  Sparkles,
  ArrowLeft,
  PlayCircle,
  BrainCircuit,
  Wrench,
  TrendingUp,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import LearningPath from '@/components/LearningPath';
import DataPreview from '@/components/DataPreview';
import Quiz from '@/components/Quiz';
import ResourcesList from '@/components/ResourcesList';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";
import Papa from 'papaparse';
import { cn } from '@/lib/utils';
import { 
  parseSyllabus, 
  generateLessonContent, 
  generateQuizQuestions, 
  GeneratedLesson, 
  QuizQuestion 
} from '@/utils/aiGenerator';

type ViewState = 'dashboard' | 'lesson' | 'quiz' | 'resources';

interface LessonItem {
  id: string;
  title: string;
  status: 'locked' | 'current' | 'completed';
}

const Index = () => {
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState("1");
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");

  // Dynamic content states
  const [activeLessonContent, setActiveLessonContent] = useState<GeneratedLesson | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);

  const handleCurriculumUpload = (file: File) => {
    setCurriculumFile(file);
    toast.success("Curriculum uploaded successfully!");
  };

  const handleDatasetUpload = (file: File) => {
    setDatasetFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setData(results.data);
          setColumns(Object.keys(results.data[0]));
          toast.success("Dataset processed successfully!");
        }
      }
    });
  };

  const startLearning = () => {
    if (!curriculumFile || !datasetFile) {
      toast.error("Please upload both a curriculum and a dataset.");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("Reading syllabus file...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      setTimeout(() => {
        setGenerationStatus("Parsing modules and topics...");
        const parsedLessons = parseSyllabus(content, curriculumFile.name);
        setLessons(parsedLessons);
        setCurrentLessonId(parsedLessons[0]?.id || "1");
      }, 800);

      setTimeout(() => {
        setGenerationStatus("Analyzing dataset structure and columns...");
      }, 1600);

      setTimeout(() => {
        setGenerationStatus("Mapping syllabus to dataset variables...");
      }, 2400);

      setTimeout(() => {
        setIsGenerating(false);
        setIsReady(true);
        toast.success("Course generated successfully!");
      }, 3200);
    };

    reader.readAsText(curriculumFile);
  };

  const handleStartLesson = () => {
    const currentLesson = lessons.find(l => l.id === currentLessonId);
    if (!currentLesson) return;

    setIsGenerating(true);
    setGenerationStatus(`Formulating lesson: "${currentLesson.title}"...`);

    setTimeout(() => {
      setGenerationStatus("Injecting dataset context and variables...");
    }, 1000);

    setTimeout(() => {
      // Generate custom lesson content and quiz questions
      const content = generateLessonContent(currentLesson.title, datasetFile?.name || "Dataset", columns, data);
      const quiz = generateQuizQuestions(currentLesson.title, columns);
      
      setActiveLessonContent(content);
      setActiveQuizQuestions(quiz);
      setIsGenerating(false);
      setActiveView('lesson');
    }, 2000);
  };

  const handleCompleteLesson = () => {
    setLessons(prev => prev.map(lesson => {
      if (lesson.id === currentLessonId) {
        return { ...lesson, status: 'completed' };
      }
      // Unlock the next lesson
      const nextId = String(Number(currentLessonId) + 1);
      if (lesson.id === nextId && lesson.status === 'locked') {
        return { ...lesson, status: 'current' };
      }
      return lesson;
    }));
    toast.success("Module marked as completed!");
    setActiveView('dashboard');
  };

  const currentLesson = lessons.find(l => l.id === currentLessonId) || lessons[0];

  // Calculate overall progress percentage
  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  if (isGenerating && !isReady) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={36} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Generating Your Course</h3>
            <p className="text-slate-500 font-medium animate-pulse">{generationStatus}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 mb-4">
              <GraduationCap className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Welcome to DataTutor</h1>
            <p className="text-slate-500 text-lg">Upload your curriculum and dataset to generate your personalized course.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload 
              type="config" 
              onFileSelect={handleCurriculumUpload}
              fileName={curriculumFile?.name}
              isLoaded={!!curriculumFile}
            />
            <FileUpload 
              type="data" 
              onFileSelect={handleDatasetUpload}
              fileName={datasetFile?.name}
              isLoaded={!!datasetFile}
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 px-12 h-14 text-lg rounded-2xl shadow-lg shadow-indigo-100"
              onClick={startLearning}
              disabled={!curriculumFile || !datasetFile}
            >
              Generate My Course
            </Button>
          </div>
        </div>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900">DataTutor</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-3", activeView === 'dashboard' ? "text-indigo-600 bg-indigo-50/50" : "text-slate-500 hover:bg-slate-50")}
            onClick={() => setActiveView('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:bg-slate-50" onClick={() => setActiveView('resources')}>
            <BookOpen size={20} /> Resources
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:bg-slate-50">
            <Settings size={20} /> Settings
          </Button>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-red-500" onClick={() => setIsReady(false)}>
            <LogOut size={20} /> Reset Course
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-100 p-6 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              {activeView !== 'dashboard' && (
                <Button variant="ghost" size="icon" onClick={() => setActiveView('dashboard')} className="rounded-full">
                  <ArrowLeft size={20} />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {activeView === 'dashboard' ? "Welcome back, Analyst!" : currentLesson?.title}
                </h1>
                <p className="text-slate-500">
                  {activeView === 'dashboard' ? "Ready to master your data today?" : `Module Progress: ${progressPercentage}%`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Progress</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700">{progressPercentage}%</span>
                  <div className="w-24">
                    <Progress value={progressPercentage} className="h-1.5" />
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">AI is formulating your lesson...</h3>
                <p className="text-slate-500 mt-2">{generationStatus}</p>
              </div>
            </div>
          ) : activeView === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                  <LearningPath 
                    lessons={lessons} 
                    onSelectLesson={setCurrentLessonId}
                    currentLessonId={currentLessonId}
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-indigo-100 mb-6 inline-block">
                      Current Lesson
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      {currentLesson?.title}
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                      In this lesson, we'll explore the fundamentals of your dataset: <span className="font-bold text-slate-700">{datasetFile?.name}</span>. 
                      We'll look at the structure, identify key variables, and understand the story your data is trying to tell.
                    </p>
                    <div className="flex gap-4">
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl shadow-lg shadow-indigo-100 gap-2"
                        onClick={handleStartLesson}
                      >
                        <PlayCircle size={18} /> Start Lesson
                      </Button>
                      {currentLesson?.status !== 'completed' && (
                        <Button 
                          variant="outline" 
                          className="px-8 h-12 rounded-xl border-slate-200"
                          onClick={handleCompleteLesson}
                        >
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Database size={20} className="text-indigo-600" /> Data Explorer
                  </h3>
                  <DataPreview data={data} columns={columns} />
                </div>
              </div>
            </div>
          ) : activeView === 'lesson' && activeLessonContent ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm">
                <div className="prose prose-slate max-w-none">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">{activeLessonContent.title}</h2>
                  
                  <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Lightbulb size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 m-0">The Definition</h3>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {activeLessonContent.definition}
                    </p>
                  </section>

                  <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <CheckCircle2 size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 m-0">What Does It Do?</h3>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {activeLessonContent.utility}
                    </p>
                  </section>

                  <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 mb-10">
                    <h4 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                      <Sparkles size={20} /> Practical Application: Your Dataset
                    </h4>
                    <p className="text-indigo-800 text-sm leading-relaxed">
                      {activeLessonContent.practicalApplication}
                    </p>
                  </div>

                  <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Wrench size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 m-0">Essential Tools</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeLessonContent.tools.map((tool, idx) => (
                        <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                          <h4 className="font-bold text-slate-900 mb-1">{tool.name}</h4>
                          <p className="text-sm text-slate-500">{tool.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <TrendingUp size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 m-0">Business Benefits</h3>
                    </div>
                    <ul className="space-y-4 list-none p-0">
                      {activeLessonContent.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 font-bold text-xs">✓</div>
                          <div>
                            <h4 className="font-bold text-slate-900 m-0">{benefit.title}</h4>
                            <p className="text-slate-500 m-0">{benefit.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                  <Button variant="ghost" onClick={() => setActiveView('dashboard')}>Save & Exit</Button>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl shadow-lg shadow-indigo-100"
                    onClick={() => setActiveView('quiz')}
                  >
                    Take Module Quiz
                  </Button>
                </div>
              </div>
            </div>
          ) : activeView === 'quiz' ? (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 p-10 shadow-sm animate-in zoom-in-95 duration-300">
              <Quiz 
                moduleTitle={currentLesson?.title} 
                questions={activeQuizQuestions}
                onClose={() => setActiveView('lesson')} 
                onComplete={handleCompleteLesson}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
              <ResourcesList onClose={() => setActiveView('dashboard')} />
            </div>
          )}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default Index;