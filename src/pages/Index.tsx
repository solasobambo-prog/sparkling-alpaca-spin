"use client";

import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  FileText, 
  Database,
  ChevronRight
} from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import LearningPath from '@/components/LearningPath';
import DataPreview from '@/components/DataPreview';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";
import Papa from 'papaparse';
import { cn } from '@/lib/utils';

const Index = () => {
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState("1");

  const lessons = [
    { id: "1", title: "Introduction to Data Analysis", status: 'current' as const },
    { id: "2", title: "Data Cleaning & Preprocessing", status: 'locked' as const },
    { id: "3", title: "Exploratory Data Analysis (EDA)", status: 'locked' as const },
    { id: "4", title: "Statistical Foundations", status: 'locked' as const },
    { id: "5", title: "Advanced Visualization", status: 'locked' as const },
  ];

  const handleCurriculumUpload = (file: File) => {
    setCurriculumFile(file);
    toast.success("Curriculum uploaded!");
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
          toast.success("Dataset processed!");
        }
      }
    });
  };

  const startLearning = () => {
    if (curriculumFile && datasetFile) {
      setIsReady(true);
    } else {
      toast.error("Please upload both a curriculum and a dataset.");
    }
  };

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
          <Button variant="ghost" className="w-full justify-start gap-3 text-indigo-600 bg-indigo-50/50">
            <LayoutDashboard size={20} /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:bg-slate-50">
            <BookOpen size={20} /> My Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:bg-slate-50">
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
        <header className="bg-white border-b border-slate-100 p-6 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, Analyst!</h1>
              <p className="text-slate-500">Ready to master your data today?</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Progress</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700">20% Completed</span>
                  <div className="w-24">
                    <Progress value={20} className="h-1.5" />
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Learning Journey */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <LearningPath 
                  lessons={lessons} 
                  onSelectLesson={setCurrentLessonId}
                  currentLessonId={currentLessonId}
                />
              </div>
            </div>

            {/* Right Column: Lesson & Explorer */}
            <div className="lg:col-span-8 space-y-8">
              {/* Current Lesson Card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-indigo-100 mb-6 inline-block">
                    Current Lesson
                  </span>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    {lessons.find(l => l.id === currentLessonId)?.title}
                  </h2>
                  <p className="text-slate-500 text-lg leading-relaxed mb-8">
                    In this lesson, we'll explore the fundamentals of your dataset: <span className="font-bold text-slate-700">{datasetFile?.name}</span>. 
                    We'll look at the structure, identify key variables, and understand the story your data is trying to tell.
                  </p>
                  <div className="flex gap-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl shadow-lg shadow-indigo-100">
                      Start Lesson
                    </Button>
                    <Button variant="outline" className="px-8 h-12 rounded-xl border-slate-200">
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              </div>

              {/* Data Explorer Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Database size={20} className="text-indigo-600" /> Data Explorer
                </h3>
                <DataPreview data={data} columns={columns} />
              </div>
            </div>
          </div>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default Index;