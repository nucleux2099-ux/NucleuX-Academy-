"use client"

import { useState } from "react"
import { BookOpen, Atom, Trophy, Flame, MessageSquare, Calendar, Bell, CheckCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const tabs = ["All", "Unread", "Mentions", "System"] as const

interface Notif {
  id: number; icon: LucideIcon; color: string; message: string; time: string; read: boolean; type: string; group: string
}

const initialNotifications: Notif[] = [
  { id: 1, icon: BookOpen, color: "#6BA8C9", message: "New lecture added: \"Acute Appendicitis — Surgical Approach\"", time: "12 min ago", read: false, type: "All", group: "Earlier Today" },
  { id: 2, icon: Atom, color: "#5BB3B3", message: "ATOM suggestion: Review Pharmacology MCQs — accuracy dropped to 58%", time: "34 min ago", read: false, type: "Mentions", group: "Earlier Today" },
  { id: 3, icon: Trophy, color: "#E879F9", message: "Achievement unlocked: \"Week Warrior\" — 7 day study streak!", time: "1 hr ago", read: false, type: "System", group: "Earlier Today" },
  { id: 4, icon: Flame, color: "#F59E0B", message: "Study streak reminder: Keep your 12-day streak alive today!", time: "2 hr ago", read: false, type: "System", group: "Earlier Today" },
  { id: 5, icon: MessageSquare, color: "#6BA8C9", message: "Dr. Sharma replied to your question on \"Portal Hypertension\"", time: "3 hr ago", read: true, type: "Mentions", group: "Earlier Today" },
  { id: 6, icon: Calendar, color: "#5BB3B3", message: "Exam scheduled: Pathology Unit Test — Feb 20, 10:00 AM", time: "5 hr ago", read: true, type: "System", group: "Earlier Today" },
  { id: 7, icon: BookOpen, color: "#6BA8C9", message: "New lecture added: \"Neonatal Jaundice — Pediatrics\"", time: "Yesterday, 8:30 PM", read: true, type: "All", group: "Yesterday" },
  { id: 8, icon: Atom, color: "#5BB3B3", message: "ATOM suggestion: Try Socratic mode for better Anatomy retention", time: "Yesterday, 4:15 PM", read: true, type: "Mentions", group: "Yesterday" },
  { id: 9, icon: Trophy, color: "#E879F9", message: "Achievement unlocked: \"Century Club\" — 100 MCQs completed!", time: "Yesterday, 2:00 PM", read: true, type: "System", group: "Yesterday" },
  { id: 10, icon: MessageSquare, color: "#6BA8C9", message: "Priya commented on your note: \"Great summary of cardiac cycle!\"", time: "Yesterday, 11:00 AM", read: true, type: "Mentions", group: "Yesterday" },
  { id: 11, icon: Flame, color: "#F59E0B", message: "Study streak reminder: You studied 4.5 hours yesterday!", time: "2 days ago", read: true, type: "System", group: "This Week" },
  { id: 12, icon: Calendar, color: "#5BB3B3", message: "Exam scheduled: Surgery Practical — Feb 25, 9:00 AM", time: "3 days ago", read: true, type: "System", group: "This Week" },
  { id: 13, icon: BookOpen, color: "#6BA8C9", message: "New lecture added: \"Thyroid Disorders — Medicine\"", time: "4 days ago", read: true, type: "All", group: "This Week" },
  { id: 14, icon: Atom, color: "#5BB3B3", message: "ATOM suggestion: Your OBG accuracy improved 12% this week!", time: "5 days ago", read: true, type: "Mentions", group: "This Week" },
  { id: 15, icon: Trophy, color: "#E879F9", message: "Achievement unlocked: \"Deep Diver\" — 10 ATOM conversations!", time: "6 days ago", read: true, type: "System", group: "This Week" },
]

export default function NotificationsPage() {
  const [tab, setTab] = useState<string>("All")
  const [notifs, setNotifs] = useState(initialNotifications)

  const filtered = notifs.filter(n => tab === "All" || tab === "Unread" ? (tab === "Unread" ? !n.read : true) : n.type === tab)
  const groups = ["Earlier Today", "Yesterday", "This Week"]

  return (
    <div className="ui-shell ui-page space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#6BA8C9]" />
          <h1 className="text-2xl font-bold text-[#E8E0D5]">Notifications</h1>
          {notifs.filter(n => !n.read).length > 0 && (
            <span className="bg-[#6BA8C9] text-white text-xs px-2 py-0.5 rounded-full">{notifs.filter(n => !n.read).length}</span>
          )}
        </div>
        <button onClick={() => setNotifs(ns => ns.map(n => ({ ...n, read: true })))} className="flex items-center gap-2 text-sm text-[#6BA8C9] hover:text-[#E8E0D5] transition-colors">
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="flex gap-1 bg-[#253545] rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-[#6BA8C9] text-white" : "text-[#A0B0BC] hover:text-[#E8E0D5]"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-6">
        {groups.map(g => {
          const items = filtered.filter(n => n.group === g)
          if (!items.length) return null
          return (
            <div key={g}>
              <p className="text-xs font-semibold text-[#A0B0BC] uppercase tracking-wider mb-3">{g}</p>
              <div className="space-y-2">
                {items.map(n => (
                  <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${n.read ? "bg-[#253545] border-[#A0B0BC]/10" : "bg-[#253545] border-[#6BA8C9]/30"}`}>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#6BA8C9] mt-2 flex-shrink-0" />}
                    <n.icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: n.color }} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? "text-[#A0B0BC]" : "text-[#E8E0D5] font-medium"}`}>{n.message}</p>
                      <p className="text-xs text-[#A0B0BC]/60 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
