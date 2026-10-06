import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from 'recharts'

// ─── Category Bar Chart ──────────────────────────────────────
const BAR_COLORS = [
  '#956b38', '#61715b', '#b3956b', '#9c6047',
  '#7e7261', '#6f7156', '#bb8a70', '#a08860',
]

export function CategoryBarChart({ data }) {
  const chartData = Object.entries(data || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  if (!chartData.length) return (
    <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
      No category data yet
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--raised)',
            border: '1px solid var(--rule)',
            borderRadius: '3px',
            color: 'var(--ink)',
            fontSize: '13px',
          }}
          cursor={{ fill: 'var(--wash)' }}
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Keywords Word Cloud (tag list) ─────────────────────────
export function KeywordCloud({ keywords, onKeywordClick }) {
  if (!keywords?.length) return (
    <div className="flex items-center justify-center h-24 text-slate-500 text-sm">
      No keyword data yet
    </div>
  )
  const max = keywords[0]?.count || 1

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {keywords.slice(0, 20).map(({ word, count }) => {
        const size = 11 + Math.round((count / max) * 10)
        return (
          <button
            key={word}
            onClick={() => onKeywordClick?.(word)}
            style={{ fontSize: size }}
            className="keyword-control px-3 py-1 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20
              hover:bg-primary-500/25 hover:opacity-100 transition-all cursor-pointer active:scale-95"
            title={`Filter news by "${word}" (${count} mentions)`}
          >
            {word}
            <span className="ml-1 text-[11px]">{count}</span>
          </button>
        )
      })}
    </div>
  )
}


// ─── Mini stat bar ────────────────────────────────────────────
export function StatBar({ label, value, max, color = 'var(--accent)' }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-500 text-xs w-20 shrink-0 capitalize">{label}</span>
      <div className="flex-1 h-1.5 rounded-sm overflow-hidden" style={{ background: 'var(--wash)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-slate-500 text-xs w-6 text-right">{value}</span>
    </div>
  )
}
