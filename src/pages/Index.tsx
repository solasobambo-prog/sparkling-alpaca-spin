"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { GraduationCap, BookOpen, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import LearningPath from '@/components/LearningPath';
import DataPreview from '@/components/DataPreview';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [curriculum, setCurriculum] = useState<any>(null);
  const [dataset, setDataset] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [datasetName, setDatasetName] = useState("");
  const [curriculumName, setCurriculumName] = useState("");
  const [currentLessonId, setCurrentLessonId] = useState("1");

  // Mock lessons based on a typical data analysis curriculum
  const [lessons, setLessons] = useState([
    { id: "1", title: "Introduction to Data Analysis", status: 'current' as const },
    { id: "2", title: "Data Cleaning & Preprocessing", status: 'locked' as const },
    { id: "3", title: "Exploratory Data Analysis (EDA)", status: 'locked' as const },
    { id: "4", title: "Statistical Foundations", status: 'locked' as const },
    { id: "5", title: "Data Visualization Techniques", status: 'locked' as const },
  ]);

  const handleCurriculumUpload = (file: File) => {
    setCurriculumName(file.name);
    // In a real app, we'd parse the curriculum text/PDF
    // For now, we'll just unlock the first lesson
    setCurriculum(true);
  };

  const handleDatasetUpload = (file: File) => {
    setDatasetName(file.name);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setDataset(results.data);
        if (results.data.length > 0) {
          setColumns(Object.keys(results.data[0]));
        }
      },
    });
  };

  const handleLessonSelect = (id: string) => {
    setCurrentLessonId(id);
  };

  const isReady = curriculum && dataset.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">DataTutor</span>
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
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-red-500">
            <LogOut size={20} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-6 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, Analyst!</h1>
              <p className="text-slate-500">Ready to master your data today?</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900">Progress</div>
                <div className="text-xs text-slate-500">20% Completed</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
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
                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10 max-w-lg">
                    <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey</h2>
                    <p className="text-indigo-100 mb-6">
                      Upload your curriculum and dataset to generate a personalized learning path tailored to your specific data.
                    </p>
                  </div>
                  <div className="absolute right-[-50px] bottom-[-50px] opacity-10">
                    <GraduationCap size={300} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload 
                    type="curriculum" 
                    onFileSelect={handleCurriculumUpload}
                    fileName={curriculumName}
                    isLoaded={!!curriculum}
                  />
                  <FileUpload 
                    type="dataset" 
                    onFileSelect={handleDatasetUpload}
                    fileName={datasetName}
                    isLoaded={dataset.length > 0}
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-32">
                    <LearningPath 
                      lessons={lessons} 
                      onSelectLesson={handleLessonSelect}
                      currentLessonId={currentLessonId}
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                        Current Lesson
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      {lessons.find(l => l.id === currentLessonId)?.title}
                    </h2>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed">
                        In this lesson, we'll explore the fundamentals of your dataset: <strong>{datasetName}</strong>. 
                        We'll look at the structure, identify key variables, and understand the story your data is trying to tell.
                      </p>
                    </div>
                    <div className="mt-8 flex gap-4">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 px-8">Start Lesson</Button>
                      <Button variant="outline">Mark as Complete</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Data Explorer</h3>
                    <DataPreview data={dataset} columns={columns} />
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