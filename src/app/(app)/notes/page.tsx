'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Grid3X3, List, FolderOpen, Star, Sparkles, FileText, Link2, Clock } from 'lucide-react';

const ROOM = '#C9A86C';

const folders = [
  { name: 'All Notes', icon: FileText, count: 10 },
  { name: 'Surgery', icon: FolderOpen, count: 3 },
  { name: 'Medicine', icon: FolderOpen, count: 2 },
  { name: 'Anatomy', icon: FolderOpen, count: 2 },
  { name: 'Favorites', icon: Star, count: 4 },
  { name: 'ATOM Generated', icon: Sparkles, count: 3 },
];

const notes = [
  { id: 1, title: 'Inguinal Hernia — Types & Repair', subject: 'Surgery', preview: 'Direct vs indirect hernia. Hesselbach triangle boundaries: inferior epigastric artery, lateral border of rectus, inguinal ligament...', edited: '2 hours ago', topics: 5, favorite: true, atomSuggested: false },
  { id: 2, title: 'Cardiac Cycle Phases', subject: 'Medicine', preview: 'Isovolumetric contraction → Rapid ejection → Reduced ejection → Isovolumetric relaxation → Rapid filling → Reduced filling...', edited: '5 hours ago', topics: 3, favorite: true, atomSuggested: true },
  { id: 3, title: 'Brachial Plexus — Roots to Branches', subject: 'Anatomy', preview: 'C5-T1 roots. Trunks: upper (C5,6), middle (C7), lower (C8,T1). Divisions: anterior & posterior. Cords: lateral, medial, posterior...', edited: '1 day ago', topics: 4, favorite: false, atomSuggested: false },
  { id: 4, title: 'Diabetic Ketoacidosis — Management', subject: 'Medicine', preview: 'IV fluids (NS initially), insulin infusion, potassium replacement. Monitor ABG, blood glucose hourly. Transition to subcut when...', edited: '1 day ago', topics: 6, favorite: true, atomSuggested: false },
  { id: 5, title: 'Acute Appendicitis — Clinical Features', subject: 'Surgery', preview: 'Periumbilical pain migrating to RIF. McBurney point tenderness. Rovsing sign, Psoas sign, Obturator sign. Alvarado score...', edited: '2 days ago', topics: 3, favorite: false, atomSuggested: true },
  { id: 6, title: 'Cranial Nerves — Quick Review', subject: 'Anatomy', preview: 'CN I Olfactory, CN II Optic, CN III Oculomotor, CN IV Trochlear... Clinical testing: pupillary reflex (II, III), jaw jerk (V)...', edited: '3 days ago', topics: 12, favorite: false, atomSuggested: false },
  { id: 7, title: 'Cell Injury & Adaptation', subject: 'Pathology', preview: 'Reversible injury: cellular swelling, fatty change. Irreversible: membrane damage, nuclear changes (pyknosis, karyorrhexis)...', edited: '3 days ago', topics: 4, favorite: true, atomSuggested: false },
  { id: 8, title: 'Pharmacokinetics — First Pass Metabolism', subject: 'Pharmacology', preview: 'Oral drugs absorbed from GIT → portal vein → liver metabolism before systemic circulation. High first pass: morphine, propranolol...', edited: '4 days ago', topics: 3, favorite: false, atomSuggested: true },
  { id: 9, title: 'Thyroid Disorders — Hyper vs Hypo', subject: 'Medicine', preview: 'Hyperthyroidism: weight loss, tachycardia, tremor, heat intolerance. Graves: diffuse goiter, exophthalmos, pretibial myxedema...', edited: '5 days ago', topics: 5, favorite: false, atomSuggested: false },
  { id: 10, title: 'Cholecystectomy — Steps & Complications', subject: 'Surgery', preview: 'Critical view of safety: cystic duct, cystic artery, gallbladder base. Calot triangle identification. Bile duct injury prevention...', edited: '1 week ago', topics: 4, favorite: false, atomSuggested: false },
];

export default function NotesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeFolder, setActiveFolder] = useState('All Notes');
  const [search, setSearch] = useState('');

  const filtered = notes.filter(n => {
    if (activeFolder === 'Favorites') return n.favorite;
    if (activeFolder === 'ATOM Generated') return n.atomSuggested;
    if (activeFolder !== 'All Notes') return n.subject === activeFolder;
    return true;
  }).filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0 space-y-2">
          <Button className="w-full rounded-xl font-semibold mb-4" style={{ backgroundColor: ROOM, color: '#1a2a38' }}>
            <Plus size={16} className="mr-2" /> New Note
          </Button>
          {folders.map(f => (
            <button
              key={f.name}
              onClick={() => setActiveFolder(f.name)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left"
              style={{
                backgroundColor: activeFolder === f.name ? `${ROOM}22` : 'transparent',
                color: activeFolder === f.name ? ROOM : '#A0B0BC',
              }}
            >
              <f.icon size={16} />
              <span className="flex-1">{f.name}</span>
              <span className="text-xs opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Main Area */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0B0BC]" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-[#253545] border-[rgba(232,224,213,0.06)] text-[#E8E0D5] placeholder:text-[#A0B0BC]/50 rounded-xl"
              />
            </div>
            <div className="flex bg-[#253545] rounded-xl border border-[rgba(232,224,213,0.06)] p-0.5">
              <button onClick={() => setView('grid')} className="p-2 rounded-lg transition" style={{ backgroundColor: view === 'grid' ? `${ROOM}22` : 'transparent', color: view === 'grid' ? ROOM : '#A0B0BC' }}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setView('list')} className="p-2 rounded-lg transition" style={{ backgroundColor: view === 'list' ? `${ROOM}22` : 'transparent', color: view === 'list' ? ROOM : '#A0B0BC' }}>
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3' : 'space-y-2'}>
            {filtered.map(note => (
              <Card key={note.id} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-4 hover:border-[rgba(232,224,213,0.12)] transition cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="text-[10px] px-1.5 py-0" style={{ backgroundColor: `${ROOM}22`, color: ROOM }}>{note.subject}</Badge>
                    {note.atomSuggested && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-purple-500/20 text-purple-400 flex items-center gap-1">
                        <Sparkles size={10} /> ATOM Suggested
                      </Badge>
                    )}
                  </div>
                  {note.favorite && <Star size={14} fill={ROOM} style={{ color: ROOM }} />}
                </div>
                <h3 className="text-sm font-semibold text-[#E8E0D5] mb-1">{note.title}</h3>
                <p className="text-xs text-[#A0B0BC] line-clamp-2 leading-relaxed">{note.preview}</p>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-[#A0B0BC]/70">
                  <span className="flex items-center gap-1"><Clock size={10} /> {note.edited}</span>
                  <span className="flex items-center gap-1"><Link2 size={10} /> {note.topics} topics</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
