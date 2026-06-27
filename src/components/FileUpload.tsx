"use client";

import React, { useCallback } from 'react';
import { Upload, FileText, Database, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  type: 'curriculum' | 'dataset';
  fileName?: string;
  isLoaded?: boolean;
}

const FileUpload = ({ onFileSelect, type, fileName, isLoaded }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={cn(
      "relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
      isLoaded 
        ? "border-green-500 bg-green-50/50" 
        : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30"
    )}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept={type === 'dataset' ? ".csv,.json" : ".txt,.pdf,.json"}
      />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-colors",
          isLoaded ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600"
        )}>
          {isLoaded ? (
            <CheckCircle2 size={32} />
          ) : type === 'curriculum' ? (
            <FileText size={32} />
          ) : (
            <Database size={32} />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {isLoaded ? fileName : `Upload ${type === 'curriculum' ? 'Curriculum' : 'Dataset'}`}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isLoaded 
              ? "File ready for analysis" 
              : `Drag and drop or click to select your ${type} file`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;