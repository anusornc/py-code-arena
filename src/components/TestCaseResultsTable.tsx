import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Beaker } from 'lucide-react';
import { BenchmarkSummary, Competitor, TestCase } from '../types/benchmark';
import { formatTime } from '../utils/benchmarkEngine';

interface TestCaseResultsTableProps {
  summary: BenchmarkSummary;
  competitors: Competitor[];
  testCases: TestCase[];
  lang: 'th' | 'en';
}

export const TestCaseResultsTable: React.FC<TestCaseResultsTableProps> = ({
  summary,
  competitors,
  testCases,
  lang,
}) => {
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const compMap = new Map(competitors.map((c) => [c.id, c]));

  if (!summary.results || summary.results.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-6">
      <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Beaker className="w-4 h-4 text-emerald-400" />
            {lang === 'th'
              ? 'ผลการทดสอบความถูกต้องตามชุดข้อมูล (Test Cases & Output Verification)'
              : 'Test Cases & Correctness Verification'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'เปรียบเทียบผลลัพธ์ของแต่ละคน เพื่อยืนยันว่าโค้ดที่เร็วกว่าไม่ได้ให้คำตอบผิดพลาด'
              : 'Verifies that faster code does not sacrifice output correctness'}
          </p>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
          {testCases.length} {lang === 'th' ? 'ชุดทดสอบ' : 'Test cases'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[180px]">{lang === 'th' ? 'ชุดข้อมูลทดสอบ' : 'Test Case'}</th>
              <th className="py-3 px-4 text-center w-24">{lang === 'th' ? 'ขนาด (N)' : 'Size (N)'}</th>
              <th className="py-3 px-4 text-center w-28">{lang === 'th' ? 'ความถูกต้อง' : 'Match'}</th>
              {summary.results.map((r) => {
                const comp = compMap.get(r.competitorId);
                return (
                  <th key={r.competitorId} className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: comp?.color || '#6366f1' }}
                      />
                      <span className="truncate max-w-[120px]">{r.competitorName}</span>
                    </div>
                  </th>
                );
              })}
              <th className="py-3 px-4 text-center w-16">{lang === 'th' ? 'รายละเอียด' : 'Detail'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {testCases.map((tc, idx) => {
              const isExpanded = expandedTestId === tc.id;
              // Check if all contestants matched outputs
              const outputs = summary.results.map(
                (r) => r.testCaseResults[idx]?.actualOutputStr || ''
              );
              const allMatch = outputs.every((o) => o === outputs[0] && o !== 'Error');

              return (
                <React.Fragment key={tc.id}>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{idx + 1}</td>

                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-200">{tc.label}</div>
                      <div className="text-[11px] text-slate-400">{tc.description}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        N={tc.n.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {allMatch ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          <span>ตรงกัน</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ต่างกัน</span>
                        </span>
                      )}
                    </td>

                    {summary.results.map((r) => {
                      const tResult = r.testCaseResults[idx];
                      return (
                        <td key={r.competitorId} className="py-3 px-4 text-right font-mono">
                          {tResult ? (
                            <span className="text-slate-200 font-medium">
                              {formatTime(tResult.timeNs)}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setExpandedTestId(isExpanded ? null : tc.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                        title="ดูรายละเอียดผลลัพธ์ (Toggle output details)"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded detail row showing actual outputs */}
                  {isExpanded && (
                    <tr className="bg-slate-950/90 border-b border-slate-800">
                      <td colSpan={5 + summary.results.length} className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              {lang === 'th' ? 'ข้อมูลนำเข้า (Input Expression):' : 'Test Input:'}
                            </div>
                            <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                              {tc.inputCode}
                            </pre>
                          </div>

                          <div>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              {lang === 'th'
                                ? 'ผลลัพธ์ที่คืนค่าจากแต่ละคน (Actual Return Outputs):'
                                : 'Outputs from each candidate:'}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {summary.results.map((r) => {
                                const tResult = r.testCaseResults[idx];
                                return (
                                  <div
                                    key={r.competitorId}
                                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono"
                                  >
                                    <div className="text-[11px] font-sans font-semibold text-slate-300 mb-1 flex items-center justify-between">
                                      <span>{r.competitorName} ({r.author}):</span>
                                      <span className="text-emerald-400">{formatTime(tResult?.timeNs || 0)}</span>
                                    </div>
                                    <div className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800/80">
                                      {tResult?.actualOutputStr || 'N/A'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
