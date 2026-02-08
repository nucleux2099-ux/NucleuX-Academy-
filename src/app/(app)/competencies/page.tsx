'use client';

import { useState } from 'react';
import { 
  allCompetencies, 
  getCompetenciesByPhase, 
  getCompetencyStats,
  subjectsWithCompetencies,
  type Competency 
} from '@/lib/data/competencies';

const phaseColors = {
  'Phase-1': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Phase-2': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Phase-3A': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Phase-3B': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const typeIcons = {
  'K': '📚', // Knowledge
  'S': '🔧', // Skill
  'A': '💭', // Attitude
  'C': '💬', // Communication
};

const typeLabels = {
  'K': 'Knowledge',
  'S': 'Skill',
  'A': 'Attitude',
  'C': 'Communication',
};

export default function CompetenciesPage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const stats = getCompetencyStats();
  
  const filteredCompetencies = allCompetencies.filter(c => {
    const matchesPhase = selectedPhase === 'all' || c.phase === selectedPhase;
    const matchesSubject = selectedSubject === 'all' || c.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🎯</span>
          <h1 className="text-3xl font-bold">CBME Competencies</h1>
        </div>
        <p className="text-gray-400">Track your mastery of NMC-mandated MBBS competencies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a2942] rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-cyan-400">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total Competencies</div>
        </div>
        <div className="bg-[#1a2942] rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-emerald-400">{stats.byPhase['Phase-1']}</div>
          <div className="text-gray-400 text-sm">Phase 1 (Basic Sciences)</div>
        </div>
        <div className="bg-[#1a2942] rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-amber-400">{stats.byPhase['Phase-2']}</div>
          <div className="text-gray-400 text-sm">Phase 2 (Para-clinical)</div>
        </div>
        <div className="bg-[#1a2942] rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-purple-400">{stats.byPhase['Phase-3']}</div>
          <div className="text-gray-400 text-sm">Phase 3 (Clinical)</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-[#1a2942] rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Total XP Available</h2>
            <p className="text-gray-400 text-sm">Complete competencies to earn XP and level up!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">⚡ {stats.totalXP} XP</div>
            <div className="text-gray-400 text-sm">0 / {stats.totalXP} earned</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-3 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Phase</label>
          <select 
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="bg-[#1a2942] border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Phases</option>
            <option value="Phase-1">Phase 1 - Basic Sciences</option>
            <option value="Phase-2">Phase 2 - Para-clinical</option>
            <option value="Phase-3A">Phase 3A - Clinical</option>
            <option value="Phase-3B">Phase 3B - Clinical</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Subject</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-[#1a2942] border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Subjects</option>
            {subjectsWithCompetencies.map(s => (
              <option key={s.id} value={s.name}>{s.name} ({s.count})</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-gray-400 text-sm mb-1 block">Search</label>
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a2942] border border-gray-700 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-gray-400 mb-4">
        Showing {filteredCompetencies.length} of {stats.total} competencies
      </div>

      {/* Competencies List */}
      <div className="space-y-3">
        {filteredCompetencies.map((comp) => (
          <CompetencyCard key={comp.code} competency={comp} />
        ))}
      </div>
    </div>
  );
}

function CompetencyCard({ competency }: { competency: Competency }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className="bg-[#1a2942] rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{typeIcons[competency.type]}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-cyan-400">{competency.code}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${phaseColors[competency.phase]}`}>
                  {competency.phase}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                  {competency.subject}
                </span>
              </div>
              <p className="text-gray-200">{competency.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-semibold">+{competency.xpReward} XP</span>
            <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-xs">○</span>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="ml-2 text-white">{typeLabels[competency.type]}</span>
              </div>
              <div>
                <span className="text-gray-400">Level:</span>
                <span className="ml-2 text-white">{competency.level}</span>
              </div>
              <div>
                <span className="text-gray-400">Domain:</span>
                <span className="ml-2 text-white">{competency.domain}</span>
              </div>
              <div>
                <span className="text-gray-400">Core:</span>
                <span className="ml-2 text-white">{competency.core ? 'Yes ✓' : 'No'}</span>
              </div>
            </div>
            {competency.linkedTopics && competency.linkedTopics.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-400 text-sm">Linked Topics: </span>
                {competency.linkedTopics.map(topic => (
                  <a 
                    key={topic}
                    href={`/library?topic=${topic}`}
                    className="inline-block bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded mr-2 hover:bg-cyan-500/30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {topic}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
