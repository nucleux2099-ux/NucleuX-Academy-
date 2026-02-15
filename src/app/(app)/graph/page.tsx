"use client"

import { Share2 } from "lucide-react"

const nodes = [
  { name: "Anatomy", x: 50, y: 18, size: 70, color: "#5BB3B3", mastery: 85 },
  { name: "Surgery", x: 80, y: 30, size: 62, color: "#6BA8C9", mastery: 74 },
  { name: "Medicine", x: 85, y: 58, size: 58, color: "#F59E0B", mastery: 69 },
  { name: "Pathology", x: 70, y: 78, size: 52, color: "#EF4444", mastery: 65 },
  { name: "Pharmacology", x: 40, y: 85, size: 48, color: "#A855F7", mastery: 58 },
  { name: "OBG", x: 15, y: 70, size: 56, color: "#EC4899", mastery: 72 },
  { name: "Pediatrics", x: 12, y: 42, size: 44, color: "#10B981", mastery: 60 },
  { name: "Biochemistry", x: 30, y: 22, size: 50, color: "#F97316", mastery: 62 },
]

const center = { x: 50, y: 50 }

export default function GraphPage() {
  return (
    <div className="min-h-screen bg-[#2D3E50] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Share2 className="w-6 h-6 text-[#E879F9]" />
        <h1 className="text-2xl font-bold text-[#E8E0D5]">Knowledge Graph</h1>
      </div>

      <div className="text-center text-sm text-[#A0B0BC]">
        <span className="text-[#E8E0D5] font-semibold">127</span> Topics Connected • <span className="text-[#E8E0D5] font-semibold">34</span> Strong Links • <span className="text-[#E8E0D5] font-semibold">8</span> Weak Areas
      </div>

      <div className="relative bg-[#253545] rounded-xl border border-[#E879F9]/20 overflow-hidden" style={{ height: "500px" }}>
        {/* Connection lines via SVG overlay */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {nodes.map(n => (
            <line key={n.name} x1={`${center.x}%`} y1={`${center.y}%`} x2={`${n.x}%`} y2={`${n.y}%`} stroke="#E879F9" strokeOpacity={0.2} strokeWidth={1.5} />
          ))}
          {/* Some inter-node connections */}
          <line x1={`${nodes[0].x}%`} y1={`${nodes[0].y}%`} x2={`${nodes[1].x}%`} y2={`${nodes[1].y}%`} stroke="#E879F9" strokeOpacity={0.15} strokeWidth={1} />
          <line x1={`${nodes[1].x}%`} y1={`${nodes[1].y}%`} x2={`${nodes[2].x}%`} y2={`${nodes[2].y}%`} stroke="#E879F9" strokeOpacity={0.15} strokeWidth={1} />
          <line x1={`${nodes[2].x}%`} y1={`${nodes[2].y}%`} x2={`${nodes[3].x}%`} y2={`${nodes[3].y}%`} stroke="#E879F9" strokeOpacity={0.15} strokeWidth={1} />
          <line x1={`${nodes[5].x}%`} y1={`${nodes[5].y}%`} x2={`${nodes[6].x}%`} y2={`${nodes[6].y}%`} stroke="#E879F9" strokeOpacity={0.15} strokeWidth={1} />
          <line x1={`${nodes[7].x}%`} y1={`${nodes[7].y}%`} x2={`${nodes[4].x}%`} y2={`${nodes[4].y}%`} stroke="#E879F9" strokeOpacity={0.15} strokeWidth={1} />
        </svg>

        {/* Center node */}
        <div className="absolute flex items-center justify-center rounded-full bg-[#E879F9] text-white font-bold text-xs text-center shadow-lg shadow-[#E879F9]/30" style={{ width: 90, height: 90, left: `${center.x}%`, top: `${center.y}%`, transform: "translate(-50%, -50%)", zIndex: 2 }}>
          Your<br />Knowledge
        </div>

        {/* Topic nodes */}
        {nodes.map(n => (
          <div key={n.name} className="absolute flex flex-col items-center justify-center rounded-full text-white font-semibold text-[10px] text-center cursor-pointer hover:scale-110 transition-transform" style={{ width: n.size, height: n.size, left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)", backgroundColor: n.color, zIndex: 1, boxShadow: `0 0 20px ${n.color}40` }}>
            {n.name}
            <span className="text-[8px] opacity-75">{n.mastery}%</span>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-[#A0B0BC] italic">Click any node to explore</p>
    </div>
  )
}
