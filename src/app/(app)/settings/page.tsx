"use client"

import { useState } from "react"
import { Settings, User, Palette, Bell, BookOpen, Atom, Save } from "lucide-react"

const subjectsList = ["Anatomy", "Surgery", "Medicine", "Pathology", "Pharmacology", "OBG", "Pediatrics", "Biochemistry", "Microbiology", "Forensic Medicine"]

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(4)
  const [selectedSubjects, setSelectedSubjects] = useState(["Anatomy", "Surgery", "Medicine", "Pathology"])
  const [difficulty, setDifficulty] = useState("moderate")
  const [responseStyle, setResponseStyle] = useState("detailed")
  const [autoSuggestions, setAutoSuggestions] = useState(true)

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full relative transition-colors ${on ? "bg-[#A0B0BC]" : "bg-[#2D3E50]"}`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${on ? "left-5.5" : "left-0.5"}`} />
    </button>
  )

  const toggleSubject = (s: string) => setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="min-h-screen bg-[#2D3E50] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-[#A0B0BC]" />
        <h1 className="text-2xl font-bold text-[#E8E0D5]">Settings</h1>
      </div>

      {/* Account */}
      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2"><User className="w-5 h-5 text-[#A0B0BC]" /><h2 className="text-lg font-semibold text-[#E8E0D5]">Account</h2></div>
        {[["Name", "Aditya Chandra Bhatla"], ["Email", "aditya@nucleux.academy"], ["Institution", "Gandhi Medical College"]].map(([l, v]) => (
          <div key={l}><label className="text-xs text-[#A0B0BC]">{l}</label><div className="mt-1 bg-[#2D3E50] rounded-lg px-4 py-2.5 text-[#E8E0D5] text-sm">{v}</div></div>
        ))}
      </div>

      {/* Appearance */}
      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20">
        <div className="flex items-center gap-2 mb-4"><Palette className="w-5 h-5 text-[#A0B0BC]" /><h2 className="text-lg font-semibold text-[#E8E0D5]">Appearance</h2></div>
        <div className="flex gap-2">
          {["dark", "light", "system"].map(t => (
            <button key={t} onClick={() => setTheme(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${theme === t ? "bg-[#A0B0BC] text-[#253545]" : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5]"}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2"><Bell className="w-5 h-5 text-[#A0B0BC]" /><h2 className="text-lg font-semibold text-[#E8E0D5]">Notifications</h2></div>
        {([["Email Notifications", emailNotif, () => setEmailNotif(!emailNotif)], ["Push Notifications", pushNotif, () => setPushNotif(!pushNotif)], ["Study Reminders", studyReminders, () => setStudyReminders(!studyReminders)], ["Weekly Digest", weeklyDigest, () => setWeeklyDigest(!weeklyDigest)]] as [string, boolean, () => void][]).map(([label, on, toggle]) => (
          <div key={label as string} className="flex items-center justify-between"><span className="text-sm text-[#E8E0D5]">{label as string}</span><Toggle on={on as boolean} onToggle={toggle as () => void} /></div>
        ))}
      </div>

      {/* Study Preferences */}
      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2"><BookOpen className="w-5 h-5 text-[#A0B0BC]" /><h2 className="text-lg font-semibold text-[#E8E0D5]">Study Preferences</h2></div>
        <div>
          <label className="text-sm text-[#A0B0BC]">Daily Goal: {dailyGoal} hours</label>
          <input type="range" min={1} max={12} value={dailyGoal} onChange={e => setDailyGoal(Number(e.target.value))} className="w-full mt-2 accent-[#A0B0BC]" />
        </div>
        <div>
          <label className="text-sm text-[#A0B0BC] block mb-2">Preferred Subjects</label>
          <div className="flex flex-wrap gap-2">
            {subjectsList.map(s => (
              <button key={s} onClick={() => toggleSubject(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedSubjects.includes(s) ? "bg-[#A0B0BC] text-[#253545]" : "bg-[#2D3E50] text-[#A0B0BC]"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-[#A0B0BC] block mb-2">Difficulty Preference</label>
          <div className="flex gap-2">
            {["easy", "moderate", "hard"].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${difficulty === d ? "bg-[#A0B0BC] text-[#253545]" : "bg-[#2D3E50] text-[#A0B0BC]"}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ATOM Settings */}
      <div className="bg-[#253545] rounded-xl p-5 border border-[#A0B0BC]/20 space-y-4">
        <div className="flex items-center gap-2 mb-2"><Atom className="w-5 h-5 text-[#A0B0BC]" /><h2 className="text-lg font-semibold text-[#E8E0D5]">ATOM Settings</h2></div>
        <div>
          <label className="text-sm text-[#A0B0BC] block mb-2">Response Style</label>
          <div className="flex gap-2">
            {["concise", "detailed", "socratic"].map(s => (
              <button key={s} onClick={() => setResponseStyle(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${responseStyle === s ? "bg-[#A0B0BC] text-[#253545]" : "bg-[#2D3E50] text-[#A0B0BC]"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#E8E0D5]">Auto-suggestions</span>
          <Toggle on={autoSuggestions} onToggle={() => setAutoSuggestions(!autoSuggestions)} />
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-[#A0B0BC] text-[#253545] font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity">
        <Save className="w-5 h-5" /> Save Settings
      </button>
    </div>
  )
}
