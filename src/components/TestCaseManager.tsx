import React, { useState } from 'react';
import { Beaker, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { TestCase, SizeTag } from '../types/benchmark';

interface TestCaseManagerProps {
  testCases: TestCase[];
  onUpdateTestCases: (updated: TestCase[]) => void;
  lang: 'th' | 'en';
}

export const TestCaseManager: React.FC<TestCaseManagerProps> = ({
  testCases,
  onUpdateTestCases,
  lang,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInputCode, setEditInputCode] = useState<string>('');
  const [editLabel, setEditLabel] = useState<string>('');

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditLabel(testCases[index].label);
    setEditInputCode(testCases[index].inputCode);
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...testCases];
    updated[index] = {
      ...updated[index],
      label: editLabel,
      inputCode: editInputCode,
    };
    onUpdateTestCases(updated);
    setEditingIndex(null);
  };

  const handleAddTestCase = () => {
    const newCase: TestCase = {
      id: `custom-test-${Date.now()}`,
      label: `Test Case ${testCases.length + 1}`,
      description: 'Custom test input',
      inputCode: '[10, 20, 30, 40, 50]',
      sizeTag: 'M',
      n: 50,
    };
    onUpdateTestCases([...testCases, newCase]);
    handleStartEdit(testCases.length);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length <= 1) return;
    const updated = testCases.filter((_, i) => i !== index);
    onUpdateTestCases(updated);
  };

  const getSizeBadgeColor = (tag: SizeTag) => {
    switch (tag) {
      case 'S':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'M':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'L':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'XL':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Edge':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Beaker className="w-4 h-4 text-emerald-400" />
            {lang === 'th' ? 'ชุดข้อมูลสำหรับทดสอบ (Test Suites)' : 'Benchmark Test Suites'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'ระบบจะส่งชุดข้อมูลเหล่านี้ให้ฟังก์ชันของแต่ละคนเพื่อจับเวลาและเปรียบเทียบผลลัพธ์'
              : 'These test cases are fed to each candidate to measure latency, RAM, and output parity'}
          </p>
        </div>

        <button
          onClick={handleAddTestCase}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'th' ? 'เพิ่มชุดทดสอบ (+Test)' : 'Add Test'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {testCases.map((tc, idx) => {
          const isEditing = editingIndex === idx;

          return (
            <div
              key={tc.id}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSizeBadgeColor(
                      tc.sizeTag
                    )}`}
                  >
                    {tc.sizeTag} • N={tc.n.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          className="p-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50"
                          title="บันทึก"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                          title="ยกเลิก"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(idx)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                          title="แก้ไข"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        {testCases.length > 1 && (
                          <button
                            onClick={() => handleRemoveTestCase(idx)}
                            className="p-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400"
                            title="ลบ"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2 mt-2">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="Label"
                    />
                    <textarea
                      value={editInputCode}
                      onChange={(e) => setEditInputCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300 h-20 resize-none"
                      placeholder="Input expression e.g. [1, 2, 3]"
                    />
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-xs text-slate-200 line-clamp-1">
                      {tc.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                      {tc.description}
                    </div>
                    <div className="bg-slate-900/90 rounded p-2 border border-slate-800/80 font-mono text-[11px] text-emerald-300/90 line-clamp-2 break-all select-all">
                      {tc.inputCode}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
