import React from 'react';
import { BookOpen, Zap, HardDrive, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface BigOGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const BigOGuideModal: React.FC<BigOGuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              {lang === 'th'
                ? 'คู่มือวิเคราะห์ประสิทธิภาพ & Big-O สำหรับนักศึกษา'
                : 'Algorithm Performance & Big-O Guide for Students'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 pt-4 text-xs sm:text-sm text-slate-300">
          {/* Big-O Cheat Sheet */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              {lang === 'th' ? 'ลำดับความเร็ว Big-O (เร็วสุด ➔ ช้าสุด)' : 'Big-O Hierarchy (Fastest ➔ Slowest)'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <span className="font-bold text-emerald-400 text-sm">O(1)</span>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Constant Time (ดีเลิศ) เช่น Dict lookup, Index access
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 text-sm">O(log N)</span>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Logarithmic (ยอดเยี่ยม) เช่น Binary Search
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-teal-950/20 border border-teal-500/20">
                <span className="font-bold text-teal-300 text-sm">O(N)</span>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Linear (ดี) ลูปเดี่ยวรอบเดียว เช่น Linear Search
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                <span className="font-bold text-cyan-300 text-sm">O(N log N)</span>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Linearithmic เช่น QuickSort, MergeSort, Timsort
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                <span className="font-bold text-rose-400 text-sm">O(N²)</span>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Quadratic (ช้าเมื่อ N ใหญ่) ลูปซ้อน เช่น BubbleSort
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40">
                <span className="font-bold text-red-400 text-sm">O(2^N)</span>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Exponential (ระวังค้าง) เช่น Naive Recursion
                </div>
              </div>
            </div>
          </div>

          {/* Common Python Traps */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              {lang === 'th' ? 'กับดักความเร็วที่พบบ่อยในโค้ด Python' : 'Common Python Performance Pitfalls'}
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-rose-300 flex items-center gap-1">
                  <span>❌ เรียก list.count() หรือ item in list ซ้ำๆ ในลูป</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  การค้นหาใน list ต้องกวาดทีละตัว O(N) หากอยู่ในลูป for N รอบ โค้ดจะกลายเป็น O(N²) ทันที!
                  <span className="text-emerald-400 font-medium ml-1">
                    ✔ ทางแก้: แปลง list เป็น set() หรือ dict เพื่อค้นหาแบบ O(1)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-rose-300 flex items-center gap-1">
                  <span>❌ การต่อสตริงด้วย += ซ้ำๆ ในลูป</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  ใน Python สตริงเป็น Immutable ทุกครั้งที่ += จะต้องจองหน่วยความจำใหม่และคัดลอกสตริงเดิม
                  <span className="text-emerald-400 font-medium ml-1">
                    ✔ ทางแก้: เก็บใส่ list แล้วใช้ "".join(items)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-rose-300 flex items-center gap-1">
                  <span>❌ Recursion ลึกโดยไม่จำค่า (No Memoization)</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  การเรียกซ้ำซ้อนสร้างกิ่งก้าน exponential O(2^N) และอาจทำให้ RecursionError (Call Stack Overflow)
                  <span className="text-emerald-400 font-medium ml-1">
                    ✔ ทางแก้: ใช้ @functools.lru_cache หรือทำ Iterative Bottom-Up
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* How the Arena Measures */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              {lang === 'th' ? 'ระบบ Arena วัดผลอย่างไร?' : 'How Arena Measures Benchmarks'}
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400">
              <li>
                <strong className="text-slate-200">Nanosecond Precision:</strong> วัดเวลาด้วย{' '}
                <code className="text-emerald-400 font-mono">time.perf_counter_ns()</code> เพื่อความแม่นยำสูง
              </li>
              <li>
                <strong className="text-slate-200">Warmup Runs:</strong> รันอุ่นเครื่องก่อน 3-5 รอบเพื่อลดผลกระทบจาก JIT/Memory allocation cold start
              </li>
              <li>
                <strong className="text-slate-200">Tracemalloc RAM Tracking:</strong> วัดจุดสูงสุดของหน่วยความจำที่ฟังก์ชันใช้จริง (Peak Memory Footprint)
              </li>
              <li>
                <strong className="text-slate-200">Output Validation:</strong> ตรวจสอบว่าผลลัพธ์ของนักศึกษาทั้งสองคนได้คำตอบเดียวกันทุก test case
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            {lang === 'th' ? 'เข้าใจแล้ว (Got it)' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
