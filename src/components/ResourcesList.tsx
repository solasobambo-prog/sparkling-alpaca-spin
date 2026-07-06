"use client";

import React from 'react';
import { FileText, ExternalLink, Download, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'link' | 'video';
  description: string;
}

interface ResourcesListProps {
  onClose: () => void;
}

const ResourcesList = ({ onClose }: ResourcesListProps) => {
  const resources: Resource[] = [
    {
      id: 1,
      title: "Foundational Concepts Guide",
      type: 'pdf',
      description: "A comprehensive PDF covering the core terminology discussed in this module."
    },
    {
      id: 2,
      title: "Industry Standards Overview",
      type: 'link',
      description: "External documentation on the latest industry standards and frameworks."
    },
    {
      id: 3,
      title: "Case Study: Practical Implementation",
      type: 'pdf',
      description: "Real-world examples of how these principles are applied in professional settings."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Module Resources</h3>
        <Button variant="ghost" onClick={onClose} className="text-slate-500">Close</Button>
      </div>

      <div className="grid gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                {resource.type === 'pdf' ? <FileText size={24} /> : <ExternalLink size={24} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">{resource.title}</h4>
                <p className="text-sm text-slate-500 mb-4">{resource.description}</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    {resource.type === 'pdf' ? <Download size={14} /> : <ExternalLink size={14} />}
                    {resource.type === 'pdf' ? 'Download' : 'Open Link'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-indigo-600" size={20} />
          <h4 className="font-bold text-indigo-900">AI Recommended Reading</h4>
        </div>
        <p className="text-sm text-indigo-700">
          Based on your progress, we recommend reviewing the "Industry Standards Overview" to better prepare for the next module.
        </p>
      </div>
    </div>
  );
};

export default ResourcesList;