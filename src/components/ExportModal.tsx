import React, { useState } from 'react';
import { Share2, Copy, Check, Download, FileText, Table } from 'lucide-react';
import { BenchmarkSummary, Competitor } from '../types/benchmark';
import { generateMarkdownTable, generateCsv } from '../utils/benchmarkEngine';

interface ExportModalProps {
  summary: BenchmarkSummary | null;
  competitors: Competitor[];
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  summary,
  competitors,
  isOpen,
  onClose,
  lang,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'csv' | 'json'>('markdown');

  if (!isOpen) return null;

  const markdownContent = summary ? generateMarkdownTable(summary, competitors) : '';
  const csvContent = summary ? generateCsv(summary) : '';
  const jsonContent = summary ? JSON.stringify(summary, null, 2) : '';

  const activeContent =
    exportFormat === 'markdown'
      ? markdownContent
      : exportFormat === 'csv'
      ? csvContent
      : jsonContent;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = () => {
    const ext = exportFormat === 'markdown' ? 'md' : exportFormat;
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `python_arena_benchmark_${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              {lang === 'th' ? 'ส่งออกผลการประลอง (Export Benchmark Results)' : 'Export Benchmark Results'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => setExportFormat('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              exportFormat === 'markdown'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Markdown Table (Lab Report / README)</span>
          </button>

          <button
            onClick={() => setExportFormat('csv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              exportFormat === 'csv'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CSV (Excel / Sheets)</span>
          </button>

          <button
            onClick={() => setExportFormat('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              exportFormat === 'json'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="font-mono text-xs">{'{ }'}</span>
            <span>JSON</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 h-64 overflow-y-auto selection:bg-indigo-500/40">
            {activeContent || (
              <span className="text-slate-500">
                {lang === 'th'
                  ? 'ยังไม่มีผลลัพธ์ กรุณากด "ประลองโค้ด" ก่อน'
                  : 'No benchmark results yet. Run the benchmark first.'}
              </span>
            )}
          </pre>

          {/* Floating Copy Button */}
          {activeContent && (
            <button
              onClick={() => handleCopy(activeContent, exportFormat)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
            >
              {copiedType === exportFormat ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'คัดลอกตาราง' : 'Copy'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            {lang === 'th'
              ? 'นำตาราง Markdown ไปแปะในรายงานแล็บวิชา Data Structures & Algorithms ได้ทันที'
              : 'Paste directly into laboratory assignments or homework documentation'}
          </p>

          <div className="flex items-center gap-2">
            {activeContent && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'ดาวน์โหลดไฟล์' : 'Download File'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
            >
              {lang === 'th' ? 'ปิด' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
