"use client";

import React from 'react';
import { Table as TableIcon, BarChart3, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPreviewProps {
  data: any[];
  columns: string[];
}

const DataPreview = ({ data, columns }: DataPreviewProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TableIcon size={16} /> Total Rows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <BarChart3 size={16} /> Columns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{columns.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Info size={16} /> Data Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-slate-700">Mixed Types Detected</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Dataset Preview (First 5 rows)</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="font-bold text-slate-700">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={`${i}-${col}`} className="text-slate-600">
                      {String(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DataPreview;