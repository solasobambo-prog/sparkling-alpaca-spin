"use client";

import React, { useState } from 'react';
import { Database, BarChart3, LayoutDashboard, Settings, LogOut, Sparkles, FileSpreadsheet, Search, Filter } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";
import Papa from 'papaparse';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDataUpload = (file: File) => {
    setFileName(file.name);
    setIsAnalyzing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setData(results.data);
          setColumns(Object.keys(results.data[0]));
          toast.success("Data parsed successfully!");
        } else {
          toast.error("The file appears to be empty.");
        }
        setIsAnalyzing(false);
      },
      error: (error) => {
        toast.error("Error parsing CSV: " + error.message);
        setIsAnalyzing(false);
      }
    });
  };

  const resetData = () => {
    setData([]);
    setColumns([]);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <BarChart3 className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">DataPulse AI</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-indigo-600 bg-indigo-50">
            <LayoutDashboard size={20} /> Explorer
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-50" onClick={() => toast.info("Insights coming soon")}>
            <Sparkles size={20} /> AI Insights
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-50" onClick={() => toast.info("Settings coming soon")}>
            <Settings size={20} /> Settings
          </Button>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-500"
            onClick={() => toast.info("Signed out")}
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
              <h1 className="text-2xl font-bold text-slate-900">Data Analysis</h1>
              <p className="text-slate-500">
                {data.length > 0 ? `Analyzing ${fileName}` : "Upload a dataset to begin exploration."}
              </p>
            </div>
            {data.length > 0 && (
              <Button variant="outline" onClick={resetData} className="text-slate-500">
                Clear Data
              </Button>
            )}
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-6 lg:p-10">
          {data.length === 0 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-4xl font-bold mb-4">Instant Data Insights</h2>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Upload your CSV or JSON files. Our AI will automatically detect patterns, generate summaries, and help you visualize your data in seconds.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <FileSpreadsheet size={16} /> CSV Support
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Database size={16} /> JSON Support
                    </div>
                  </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-40px] opacity-10 rotate-12">
                  <BarChart3 size={400} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUpload 
                  type="data" 
                  onFileSelect={handleDataUpload}
                  isLoaded={isAnalyzing}
                />
                <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 mb-2">How it works</h3>
                  <ul className="space-y-3 text-sm text-slate-500">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</div>
                      Upload your raw data file
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">2</div>
                      AI parses and cleans the structure
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">3</div>
                      Explore interactive tables and charts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search data..." 
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                  </div>
                  <Button variant="outline" className="gap-2 text-slate-600">
                    <Filter size={18} /> Filter
                  </Button>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  <Sparkles size={18} /> Generate AI Report
                </Button>
              </div>

              <DataPreview data={data} columns={columns} />
            </div>
          )}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default Index;