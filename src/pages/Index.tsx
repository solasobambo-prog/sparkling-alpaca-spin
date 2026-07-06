"use client";

import React, { useState } from 'react';
import { GraduationCap, BookOpen, LayoutDashboard, Settings, LogOut, Sparkles, ChevronRight } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import LearningPath from '@/components/LearningPath';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState<boolean>(false);
  const [materials, setMaterials] = useState<boolean>(false);
  const [syllabusName, setSyllabusName] = useState("");
  const [materialsName, setMaterialsName] = useState("");
  const [currentLessonId, setCurrentLessonId] = useState("1");

  // Mock dynamic lessons that would be generated from the syllabus
  const [lessons, setLessons] = useState([
    { id: "1", title: "Foundational Concepts", status: 'current' as const },
    { id: "2", title: "Core Principles & Frameworks", status: 'locked' as const },
    { id: "3", title: "Advanced Methodologies", status: 'locked' as const },
    { id: "4", title: "Practical Applications", status: 'locked' as const },
    { id: "5", title: "Final Assessment & Review", status: 'locked' as const },
  ]);

  const handleSyllabusUpload = (file: File) => {
    setSyllabusName(file.name);
    setSyllabus(true);
  };

  const handleMaterialsUpload = (file: File) => {
    setMaterialsName(file.name);
    setMaterials(true);
  };

  const handleLessonSelect = (id: string) => {
    setCurrentLessonId(id);
  };

  const isReady = syllabus; // Syllabus is the minimum requirement

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">LMSGen AI</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-indigo-600 bg-indigo-50">
            <LayoutDashboard size={20} /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-50">
            <BookOpen size={20} /> My Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-50">
            <Settings size={20} /> Settings
          </Button>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-500"
            onClick={() => navigate('/login')}
          >
            <LogOut size={20} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-6 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Personalized Learning</h1>
              <p className="text-slate-500">Your AI-generated curriculum is ready.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                  <div className="relative z-10 max-w-xl">
                    <h2 className="text-4xl font-bold mb-4">Turn any Syllabus into a Course</h2>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                      Upload your curriculum or syllabus, and our AI will generate a structured, interactive learning path with modules, quizzes, and study guides.
                    </p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <Sparkles size={16} /> AI-Powered
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <BookOpen size={16} /> Any Subject
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-40px] opacity-10 rotate-12">
                    <GraduationCap size={400} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FileUpload 
                    type="syllabus" 
                    onFileSelect={handleSyllabusUpload}
                    fileName={syllabusName}
                    isLoaded={syllabus}
                  />
                  <FileUpload 
                    type="materials" 
                    onFileSelect={handleMaterialsUpload}
                    fileName={materialsName}
                    isLoaded={materials}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-32 shadow-sm">
                    <LearningPath 
                      lessons={lessons} 
                      onSelectLesson={handleLessonSelect}
                      currentLessonId={currentLessonId}
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest border border-indigo-100">
                        Module {currentLessonId}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <BookOpen size={16} /> 15 min read
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                      {lessons.find(l => l.id === currentLessonId)?.title}
                    </h2>
                    
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 text-lg leading-relaxed mb-6">
                        Welcome to the first module of your custom course based on <strong>{syllabusName}</strong>. 
                        This section covers the foundational elements required to master the subject matter.
                      </p>
                      
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Sparkles size={18} className="text-indigo-500" /> Key Learning Objectives
                        </h4>
                        <ul className="space-y-2 text-slate-600">
                          <li className="flex items-start gap-2">
                            <ChevronRight size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                            Understand the core terminology and historical context.
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                            Identify the primary frameworks used in this field.
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                            Establish a baseline for advanced practical application.
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 px-10 h-12 text-lg shadow-lg shadow-indigo-100">
                        Start Learning
                      </Button>
                      <Button variant="outline" className="h-12 px-8">
                        Download Study Guide
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                        <Sparkles size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">AI Quiz</h4>
                      <p className="text-sm text-slate-500">Test your knowledge on this module.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <Library size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">Resources</h4>
                      <p className="text-sm text-slate-500">Access related papers and links.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default Index;