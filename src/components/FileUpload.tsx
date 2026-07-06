"use client";

import React from 'react';
import { FileText, Database, CheckCircle2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  type: 'data' | 'config';
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

  const getIcon = () => {
    if (isLoaded) return <CheckCircle2 size={32} />;
    return type === 'data' ? <Database size={32} /> : <UploadCloud size={32} />;
  };

  const getTitle = () => {
    if (isLoaded) return fileName;
    return type === 'data' ? "Upload Dataset (CSV/JSON)" : "Upload Configuration";
  };

  return (
    <div className={cn(
      "relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
      isLoaded 
        ? "border-emerald-500 bg-emerald-50/50" 
        : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30"
    )}>
      <input
        type="file"
        accept={type === 'data' ? ".csv,.json" : "*"}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-colors",
          isLoaded ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
        )}>
          {getIcon()}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {getTitle()}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isLoaded 
              ? "File processed successfully" 
              : `Drag and drop your ${type === 'data' ? 'data file' : 'settings'} here`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;