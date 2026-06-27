"use client";

import React from 'react';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  status: 'locked' | 'current' | 'completed';
}

interface LearningPathProps {
  lessons: Lesson[];
  onSelectLesson: (id: string) => void;
  currentLessonId: string;
}

const LearningPath = ({ lessons, onSelectLesson, currentLessonId }: LearningPathProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Your Learning Journey</h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
        
        <div className="space-y-6">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id}
              className={cn(
                "relative flex items-start gap-4 cursor-pointer group",
                lesson.status === 'locked' && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => lesson.status !== 'locked' && onSelectLesson(lesson.id)}
            >
              <div className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white transition-colors",
                lesson.status === 'completed' ? "border-green-500 text-green-500" :
                lesson.status === 'current' ? "border-indigo-500 text-indigo-500" :
                "border-slate-200 text-slate-300"
              )}>
                {lesson.status === 'completed' ? (
                  <CheckCircle2 size={18} />
                ) : lesson.status === 'current' ? (
                  <PlayCircle size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              
              <div className={cn(
                "flex-1 p-4 rounded-xl border transition-all",
                lesson.id === currentLessonId 
                  ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}>
                <h4 className={cn(
                  "font-medium",
                  lesson.id === currentLessonId ? "text-indigo-900" : "text-slate-700"
                )}>
                  {lesson.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;