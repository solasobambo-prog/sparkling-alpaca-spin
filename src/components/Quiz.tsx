"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  moduleTitle: string;
  onClose: () => void;
}

const Quiz = ({ moduleTitle, onClose }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "What is the primary objective of this foundational module?",
      options: [
        "To master advanced practical applications",
        "To establish core terminology and context",
        "To complete the final assessment",
        "To skip to the next module"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Which framework is most commonly used for this subject matter?",
      options: [
        "The Linear Progression Model",
        "The Iterative Feedback Loop",
        "The Core Principles Framework",
        "The Advanced Methodology Suite"
      ],
      correctAnswer: 2
    }
  ];

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h3>
        <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={resetQuiz} variant="outline" className="gap-2">
            <RotateCcw size={18} /> Try Again
          </Button>
          <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700">
            Back to Module
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Quiz: {moduleTitle}</h3>
        <span className="text-sm font-medium text-slate-500">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="space-y-6">
        <p className="text-lg text-slate-700 font-medium">{question.text}</p>
        
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all",
                selectedOption === index 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-slate-100 hover:border-slate-200 bg-white",
                isSubmitted && index === question.correctAnswer && "border-emerald-500 bg-emerald-50",
                isSubmitted && selectedOption === index && index !== question.correctAnswer && "border-red-500 bg-red-50"
              )}
              disabled={isSubmitted}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSubmitted && index === question.correctAnswer && <CheckCircle2 className="text-emerald-500" size={20} />}
                {isSubmitted && selectedOption === index && index !== question.correctAnswer && <XCircle className="text-red-500" size={20} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-100">
        {!isSubmitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedOption === null}
            className="bg-indigo-600 hover:bg-indigo-700 px-8"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 px-8 gap-2">
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;