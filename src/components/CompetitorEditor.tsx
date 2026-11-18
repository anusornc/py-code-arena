import React, { useState } from 'react';
import {
  Code,
  User,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Columns,
  Square,
  FileCode2,
} from 'lucide-react';
import { Competitor } from '../types/benchmark';

interface CompetitorEditorProps {
  competitors: Competitor[];
  onChangeCompetitor: (index: number, updated: Competitor) => void;
  onAddCompetitor: () => void;
  onRemoveCompetitor: (index: number) => void;
  onResetCompetitor: (index: number) => void;
  selectedCompId?: string;
  lang: 'th' | 'en';
}

const PALETTE = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'];

export const CompetitorEditor: React.FC<CompetitorEditorProps> = ({
  competitors,
  onChangeCompetitor,
  onAddCompetitor,
  onRemoveCompetitor,
  onResetCompetitor,
  selectedCompId,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'tabs' | 'split'>('split');

  // If a competitor was selected from the table, switch active tab to it
  React.useEffect(() => {
    if (selectedCompId) {
      const idx = competitors.findIndex((c) => c.id === selectedCompId);
      if (idx !== -1) setActiveTab(idx);
    }
  }, [selectedCompId, competitors]);

  const renderSingleEditor = (comp: Competitor, index: number, isSplit = false) => {
    const lineCount = (comp.code.match(/\n/g) || []).length + 1;
    const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

    return (
      <div
        key={comp.id}
        className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col ${
          isSplit ? 'h-[440px]' : 'h-[500px]'
        }`}
      >
        {/* Editor Card Header */}
        <div className="bg-slate-950/80 p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: comp.color || PALETTE[index % PALETTE.length] }}
            />
            <input
              type="text"
              aria-label={lang === 'th' ? 'ชื่ออัลกอริทึม' : 'Algorithm Name'}
              value={comp.name}
              onChange={(e) => onChangeCompetitor(index, { ...comp, name: e.target.value })}
              className="bg-transparent font-bold text-sm text-slate-100 hover:bg-slate-900/60 focus:bg-slate-900 px-2 py-0.5 rounded border border-transparent focus:border-slate-700 outline-none flex-1 truncate"
              placeholder="ชื่ออัลกอริทึม (Algorithm Name)"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Student Name */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800 text-xs text-slate-300">
              <User className="w-3 h-3 text-slate-500" />
              <input
                type="text"
                aria-label={lang === 'th' ? 'ชื่อผู้เขียน/นักศึกษา' : 'Author or Student Name'}
                value={comp.author}
                onChange={(e) => onChangeCompetitor(index, { ...comp, author: e.target.value })}
                className="bg-transparent text-xs text-slate-300 focus:outline-none w-28 truncate"
                placeholder={lang === 'th' ? 'ชื่อนักศึกษา' : 'Student name'}
              />
            </div>

            {/* Entry function name */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">def</span>
              <input
                type="text"
                aria-label={lang === 'th' ? 'ชื่อฟังก์ชันที่เรียก' : 'Function Name'}
                value={comp.entryFunction}
                onChange={(e) =>
                  onChangeCompetitor(index, { ...comp, entryFunction: e.target.value })
                }
                className="bg-transparent text-xs text-emerald-400 font-mono focus:outline-none w-24"
                placeholder="func_name"
                title={lang === 'th' ? 'ชื่อฟังก์ชันที่ระบบจะเรียกเพื่อวัดผล' : 'Entry function name'}
              />
              <span className="text-slate-500 font-mono text-[11px]">(...)</span>
            </div>

            {/* Reset button */}
            <button
              onClick={() => onResetCompetitor(index)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title={lang === 'th' ? 'รีเซ็ตโค้ดกลับเป็นค่าเดิม' : 'Reset code to default'}
              aria-label="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Remove button (if > 2 competitors) */}
            {competitors.length > 2 && (
              <button
                onClick={() => onRemoveCompetitor(index)}
                className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition"
                title={lang === 'th' ? 'ลบผู้เข้าแข่งขันนี้' : 'Remove competitor'}
                aria-label="Remove competitor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs bg-slate-950">
          {/* Line Numbers */}
          <div className="w-10 bg-slate-950/90 text-slate-600 select-none py-3 px-1 text-right font-mono border-r border-slate-800/60 overflow-hidden leading-5">
            {lineNumbers.map((n) => (
              <div key={n} className="h-5">
                {n}
              </div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            aria-label={`${comp.name} Python code`}
            value={comp.code}
            onChange={(e) => onChangeCompetitor(index, { ...comp, code: e.target.value })}
            spellCheck={false}
            className="flex-1 bg-transparent text-slate-200 p-3 leading-5 font-mono text-xs resize-none focus:outline-none overflow-y-auto selection:bg-indigo-500/40"
            placeholder="# Write or paste Python code here..."
          />
        </div>

        {/* Editor Footer Status */}
        <div className="bg-slate-950/80 px-3 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono">Python 3</span>
            <span>•</span>
            <span>{comp.code.length} chars</span>
          </div>
          <div className="text-slate-500 text-[10px]">
            {lang === 'th' ? 'สามารถพิมพ์แก้ไขหรือวางโค้ดได้ทันที' : 'Editable code'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      {/* Section Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            {lang === 'th' ? 'กล่องเขียนโค้ดเพื่อประลอง (Arena Code Editors)' : 'Arena Code Editors'}
          </h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
            {competitors.length} {lang === 'th' ? 'ผู้เข้าแข่งขัน' : 'Contestants'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle (Tabs vs Split) */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 hidden md:flex items-center">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="เปรียบเทียบแบบเคียงข้าง (Side-by-side)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="text-[11px]">{lang === 'th' ? 'เคียงข้าง' : 'Split'}</span>
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'tabs'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="แสดงแบบแท็บเดี่ยว (Single Tab)"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="text-[11px]">{lang === 'th' ? 'แท็บ' : 'Tabs'}</span>
            </button>
          </div>

          {/* Add Competitor Button */}
          {competitors.length < 4 && (
            <button
              onClick={onAddCompetitor}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'เพิ่มผู้เข้าแข่งขัน (+Player)' : 'Add Contestant'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      {viewMode === 'split' ? (
        <div
          className={`grid gap-4 ${
            competitors.length === 2
              ? 'grid-cols-1 lg:grid-cols-2'
              : competitors.length === 3
              ? 'grid-cols-1 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {competitors.map((comp, idx) => renderSingleEditor(comp, idx, true))}
        </div>
      ) : (
        <div>
          {/* Tab bar */}
          <div className="flex border-b border-slate-800 mb-3 gap-2 overflow-x-auto pb-1">
            {competitors.map((comp, idx) => (
              <button
                key={comp.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-xs transition border-b-2 ${
                  activeTab === idx
                    ? 'border-indigo-500 bg-slate-900 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: comp.color }}
                />
                <span className="truncate max-w-[150px]">{comp.name}</span>
                <span className="text-slate-500 text-[10px]">({comp.author})</span>
              </button>
            ))}
          </div>

          {competitors[activeTab] && renderSingleEditor(competitors[activeTab], activeTab, false)}
        </div>
      )}
    </div>
  );
};
