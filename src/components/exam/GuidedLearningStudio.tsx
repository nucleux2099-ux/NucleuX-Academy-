'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileQuestion,
  Library,
  Link2,
  Play,
  Sparkles,
  Stethoscope,
  Target,
} from 'lucide-react';

type TrainingMode = 'flow' | 'simulator' | 'mcq' | 'pyq' | 'osce';

type FocusNode = {
  id: string;
  title: string;
  objective: string;
  focusMinutes: number;
  mastery: number;
  status: 'locked' | 'active' | 'done';
  resources: {
    label: string;
    href: string;
    kind: 'library' | 'flow' | 'simulator' | 'mcq' | 'pyq' | 'osce';
  }[];
};

type GuidedTrack = {
  id: string;
  title: string;
  specialty: string;
  narrative: string;
  examContext: string;
  weeklyTarget: string;
  modeLinks: Record<TrainingMode, { label: string; href: string; note: string }>;
  nodes: FocusNode[];
  crossTopicLinks: { label: string; href: string }[];
};

const MODE_META: Record<TrainingMode, { label: string; icon: React.ElementType }> = {
  flow: { label: 'Clinical Flow', icon: Activity },
  simulator: { label: 'Patient Sim', icon: Stethoscope },
  mcq: { label: 'MCQ Drill', icon: ClipboardList },
  pyq: { label: 'PYQ Sprint', icon: FileQuestion },
  osce: { label: 'OSCE Prep', icon: Target },
};

const GUIDED_TRACKS: GuidedTrack[] = [
  {
    id: 'upper-gi-bleeding',
    title: 'Upper GI Bleeding Focus Sprint',
    specialty: 'Surgery + Medicine Integration',
    narrative: 'Triage fast, stratify risk, and choose intervention in sequence.',
    examContext: 'High-yield for ER vignettes, protocols, and viva algorithms.',
    weeklyTarget: '3 sessions this week · 90 minutes total',
    modeLinks: {
      flow: {
        label: 'Run Decision Pathway',
        href: '/exam-centre/flow/upper-gi-bleeding',
        note: 'Use pathway first to anchor decision order.',
      },
      simulator: {
        label: 'Simulate Acute Case',
        href: '/exam-centre/simulator/acute-appendicitis',
        note: 'Practice prioritization under time pressure.',
      },
      mcq: {
        label: 'Solve MCQ Drill',
        href: '/exam-centre/mcq',
        note: 'Target differential and severity scoring errors.',
      },
      pyq: {
        label: 'Attempt PYQ Set',
        href: '/exam-centre/pyq',
        note: 'Translate algorithmic flow into exam language.',
      },
      osce: {
        label: 'Practice OSCE Station',
        href: '/exam-centre/osce/thyroid-examination',
        note: 'Refine communication and structured presentation.',
      },
    },
    nodes: [
      {
        id: 'stabilize',
        title: 'Initial Stabilization',
        objective: 'Airway-breathing-circulation + hemodynamic triage.',
        focusMinutes: 18,
        mastery: 72,
        status: 'done',
        resources: [
          { label: 'Flow Entry Node', href: '/exam-centre/flow/upper-gi-bleeding', kind: 'flow' },
          { label: 'Core Reading', href: '/library/surgery/general-topics?mode=explorer', kind: 'library' },
        ],
      },
      {
        id: 'risk-stratify',
        title: 'Risk Stratification',
        objective: 'Blatchford/Rockall use and disposition thresholds.',
        focusMinutes: 22,
        mastery: 44,
        status: 'active',
        resources: [
          { label: 'Scoring in Flow', href: '/exam-centre/flow/upper-gi-bleeding', kind: 'flow' },
          { label: 'MCQ Reinforcement', href: '/exam-centre/mcq', kind: 'mcq' },
        ],
      },
      {
        id: 'definitive-plan',
        title: 'Definitive Management',
        objective: 'Endoscopy timing, transfusion strategy, escalation cues.',
        focusMinutes: 26,
        mastery: 21,
        status: 'active',
        resources: [
          { label: 'PYQ Pattern Set', href: '/exam-centre/pyq', kind: 'pyq' },
          { label: 'Clinical Simulation', href: '/exam-centre/simulator/acute-appendicitis', kind: 'simulator' },
        ],
      },
      {
        id: 'presentation',
        title: 'Exam Presentation Script',
        objective: 'Crisp 90-second verbal answer framework.',
        focusMinutes: 14,
        mastery: 0,
        status: 'locked',
        resources: [
          { label: 'OSCE Mode', href: '/exam-centre/osce/thyroid-examination', kind: 'osce' },
        ],
      },
    ],
    crossTopicLinks: [
      { label: 'Portal Hypertension', href: '/library/surgery/hepatobiliary?mode=explorer' },
      { label: 'Shock Fundamentals', href: '/library/surgery/general-topics?mode=examPrep' },
      { label: 'Anemia Approach', href: '/library/medicine?mode=explorer' },
    ],
  },
  {
    id: 'acute-abdomen-core',
    title: 'Acute Abdomen Core Track',
    specialty: 'Emergency + General Surgery',
    narrative: 'Differentiate pain patterns and escalate appropriately.',
    examContext: 'Frequently tested in integrated surgery viva and MCQ stems.',
    weeklyTarget: '2 sessions this week · 70 minutes total',
    modeLinks: {
      flow: {
        label: 'Open Diagnostic Flow',
        href: '/exam-centre/flow/upper-gi-bleeding',
        note: 'Focus on branch logic and early red flags.',
      },
      simulator: {
        label: 'Run Case Simulation',
        href: '/exam-centre/simulator/acute-appendicitis',
        note: 'Rehearse history and exam sequencing.',
      },
      mcq: {
        label: 'Start MCQ Block',
        href: '/exam-centre/mcq',
        note: 'Stress-test differential diagnosis picks.',
      },
      pyq: {
        label: 'Solve PYQ Cluster',
        href: '/exam-centre/pyq',
        note: 'Train concise exam-style reasoning.',
      },
      osce: {
        label: 'Practice Communication',
        href: '/exam-centre/osce/thyroid-examination',
        note: 'Improve opening statement + summary.',
      },
    },
    nodes: [
      {
        id: 'pain-map',
        title: 'Pain Pattern Mapping',
        objective: 'Visceral vs parietal pain and localizing clues.',
        focusMinutes: 16,
        mastery: 63,
        status: 'done',
        resources: [
          { label: 'Concept Reading', href: '/library/surgery/general-topics?mode=explorer', kind: 'library' },
        ],
      },
      {
        id: 'red-flags',
        title: 'Emergency Red Flags',
        objective: 'Peritonitis, perforation, sepsis early signals.',
        focusMinutes: 18,
        mastery: 40,
        status: 'active',
        resources: [
          { label: 'Rapid MCQ Checks', href: '/exam-centre/mcq', kind: 'mcq' },
          { label: 'Case Simulation', href: '/exam-centre/simulator/acute-appendicitis', kind: 'simulator' },
        ],
      },
      {
        id: 'operative-vs-conservative',
        title: 'Operative vs Conservative',
        objective: 'Choose route using risk and exam progression.',
        focusMinutes: 20,
        mastery: 12,
        status: 'active',
        resources: [
          { label: 'PYQ Decision Stem', href: '/exam-centre/pyq', kind: 'pyq' },
        ],
      },
      {
        id: 'oral-defense',
        title: 'Oral Defense Drill',
        objective: 'Defend diagnosis in viva format.',
        focusMinutes: 12,
        mastery: 0,
        status: 'locked',
        resources: [
          { label: 'OSCE Practice', href: '/exam-centre/osce/thyroid-examination', kind: 'osce' },
        ],
      },
    ],
    crossTopicLinks: [
      { label: 'Trauma Sequence', href: '/library/surgery/trauma?mode=examPrep' },
      { label: 'Peritonitis Notes', href: '/library/surgery/general-topics?mode=textbook' },
      { label: 'Fluid Management', href: '/library/medicine?mode=explorer' },
    ],
  },
];

function statusStyles(status: FocusNode['status']) {
  if (status === 'done') {
    return 'border-[#7BA69E]/36 bg-[#7BA69E]/14';
  }
  if (status === 'active') {
    return 'border-[#5BB3B3]/36 bg-[#5BB3B3]/12';
  }
  return 'border-[rgba(232,224,213,0.12)] bg-[rgba(37,53,69,0.64)]';
}

function statusLabel(status: FocusNode['status']) {
  if (status === 'done') return 'Done';
  if (status === 'active') return 'In Focus';
  return 'Locked';
}

function resourceTone(kind: FocusNode['resources'][number]['kind']) {
  if (kind === 'library') return 'border-[#7BA69E]/28 bg-[#7BA69E]/10 text-[#A8C9C2]';
  if (kind === 'flow' || kind === 'simulator') return 'border-[#5BB3B3]/28 bg-[#5BB3B3]/10 text-[#8FD5D5]';
  if (kind === 'osce') return 'border-[#C9A86C]/30 bg-[#C9A86C]/10 text-[#D8BE90]';
  return 'border-[rgba(232,224,213,0.16)] bg-[rgba(37,53,69,0.64)] text-[#A0B0BC]';
}

export function GuidedLearningStudio() {
  const [trackId, setTrackId] = useState(GUIDED_TRACKS[0].id);
  const [nodeId, setNodeId] = useState(GUIDED_TRACKS[0].nodes[1].id);
  const [mode, setMode] = useState<TrainingMode>('flow');

  const track = useMemo(
    () => GUIDED_TRACKS.find((item) => item.id === trackId) ?? GUIDED_TRACKS[0],
    [trackId]
  );

  const node = useMemo(
    () => track.nodes.find((item) => item.id === nodeId) ?? track.nodes[0],
    [track, nodeId]
  );

  const completedNodes = track.nodes.filter((item) => item.status === 'done').length;
  const roadmapProgress = Math.round((completedNodes / track.nodes.length) * 100);
  const modeLaunch = track.modeLinks[mode];

  const changeTrack = (nextTrackId: string) => {
    const nextTrack = GUIDED_TRACKS.find((item) => item.id === nextTrackId);
    if (!nextTrack) return;
    setTrackId(nextTrack.id);
    setNodeId(nextTrack.nodes.find((item) => item.status !== 'done')?.id ?? nextTrack.nodes[0].id);
    setMode('flow');
  };

  return (
    <div className="space-y-4">
      <div className="ui-panel ui-reveal-up p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <Compass className="h-5 w-5 text-[#C9A86C]" />
              Guided Learning Studio
            </h3>
            <p className="mt-1 text-sm text-[#A0B0BC]">
              Roadmap-first focused learning: pick a core topic, lock into one subtopic, then execute across training modes.
            </p>
            <p className="mt-2 text-xs text-[#6B7A88]">Mockup preview for the guided learning UX.</p>
          </div>
          <Badge className="w-fit border-[#5BB3B3]/30 bg-[#5BB3B3]/14 text-[#8FD5D5]">
            <Sparkles className="mr-1 h-3 w-3" />
            {track.weeklyTarget}
          </Badge>
        </div>
      </div>

      <div className="ui-panel ui-reveal-up ui-reveal-delay-1 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {GUIDED_TRACKS.map((item) => (
            <button
              key={item.id}
              onClick={() => changeTrack(item.id)}
              className={
                track.id === item.id
                  ? 'ui-pill-active inline-flex items-center gap-2 rounded-lg border border-[#5BB3B3]/32 px-3 py-2 text-sm text-[#E8E0D5]'
                  : 'ui-pill inline-flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm text-[#A0B0BC] hover:text-[#E8E0D5]'
              }
            >
              <Brain className="h-4 w-4" />
              {item.title}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          <div className="ui-subpanel p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-[#E8E0D5]">{track.title}</h4>
                <p className="text-sm text-[#A0B0BC]">{track.specialty}</p>
              </div>
              <Badge className="border-[#C9A86C]/30 bg-[#C9A86C]/14 text-[#D8BE90]">Roadmap</Badge>
            </div>

            <p className="text-sm text-[#A0B0BC]">{track.narrative}</p>
            <p className="mt-1 text-xs text-[#6B7A88]">{track.examContext}</p>

            <div className="mt-4 rounded-lg border border-[rgba(91,179,179,0.16)] bg-[rgba(37,53,69,0.6)] p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-[#6B7A88]">Roadmap Completion</span>
                <span className="font-medium text-[#8FD5D5]">{roadmapProgress}%</span>
              </div>
              <Progress value={roadmapProgress} className="h-1.5 bg-[#253545]" />
            </div>

            <div className="mt-4 space-y-2">
              {track.nodes.map((item, index) => {
                const isActive = item.id === node.id;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setNodeId(item.id)}
                      className={`ui-interactive w-full rounded-lg border p-3 text-left ${statusStyles(item.status)} ${
                        isActive ? 'ring-1 ring-[#5BB3B3]/35' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#E8E0D5]">
                            {index + 1}. {item.title}
                          </p>
                          <p className="mt-1 text-xs text-[#A0B0BC]">{item.objective}</p>
                        </div>
                        <Badge
                          className={
                            item.status === 'done'
                              ? 'border-[#7BA69E]/30 bg-[#7BA69E]/16 text-[#A8C9C2]'
                              : item.status === 'active'
                              ? 'border-[#5BB3B3]/30 bg-[#5BB3B3]/16 text-[#8FD5D5]'
                              : 'border-[rgba(232,224,213,0.16)] bg-[rgba(37,53,69,0.74)] text-[#A0B0BC]'
                          }
                        >
                          {item.status === 'done' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : null}
                          {statusLabel(item.status)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-[#6B7A88]">Focus {item.focusMinutes} min</span>
                        <span className="text-[#D8BE90]">Mastery {item.mastery}%</span>
                      </div>
                    </button>
                    {index < track.nodes.length - 1 ? (
                      <div className="mx-4 h-3 border-l border-dashed border-[rgba(91,179,179,0.22)]" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="ui-subpanel p-4">
              <h5 className="text-sm font-semibold text-[#E8E0D5]">Active Focus Node</h5>
              <p className="mt-1 text-sm text-[#A0B0BC]">{node.title}</p>
              <p className="mt-1 text-xs text-[#6B7A88]">{node.objective}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[#6B7A88]">Current Mastery</span>
                <span className="font-medium text-[#8FD5D5]">{node.mastery}%</span>
              </div>
              <Progress value={node.mastery} className="mt-2 h-1.5 bg-[#253545]" />
            </div>

            <div className="ui-subpanel p-4">
              <h5 className="mb-2 text-sm font-semibold text-[#E8E0D5]">Training Mode Launcher</h5>
              <div className="mb-3 flex flex-wrap gap-2">
                {(Object.keys(MODE_META) as TrainingMode[]).map((item) => {
                  const ModeIcon = MODE_META[item].icon;
                  return (
                    <button
                      key={item}
                      onClick={() => setMode(item)}
                      className={
                        mode === item
                          ? 'ui-pill-active inline-flex items-center gap-1.5 rounded-md border border-[#5BB3B3]/30 px-2.5 py-1.5 text-xs text-[#E8E0D5]'
                          : 'ui-pill inline-flex items-center gap-1.5 rounded-md border border-transparent px-2.5 py-1.5 text-xs text-[#A0B0BC] hover:text-[#E8E0D5]'
                      }
                    >
                      <ModeIcon className="h-3.5 w-3.5" />
                      {MODE_META[item].label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg border border-[rgba(91,179,179,0.16)] bg-[rgba(37,53,69,0.62)] p-3">
                <p className="text-sm font-medium text-[#E8E0D5]">{modeLaunch.label}</p>
                <p className="mt-1 text-xs text-[#A0B0BC]">{modeLaunch.note}</p>
                <Link href={modeLaunch.href} className="mt-3 inline-flex">
                  <Button className="bg-[#5BB3B3]/16 text-[#8FD5D5] hover:bg-[#5BB3B3]/26">
                    Launch in Training Centre
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="ui-subpanel p-4">
              <h5 className="mb-2 text-sm font-semibold text-[#E8E0D5]">Linked Micro-Resources</h5>
              <div className="space-y-2">
                {node.resources.map((resource) => (
                  <Link
                    key={`${resource.kind}-${resource.href}`}
                    href={resource.href}
                    className={`ui-interactive flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${resourceTone(resource.kind)}`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {resource.kind === 'library' ? <Library className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                      {resource.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="ui-subpanel p-4">
              <h5 className="mb-2 text-sm font-semibold text-[#E8E0D5]">Cross-Topic Focus Links</h5>
              <div className="space-y-2">
                {track.crossTopicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ui-interactive flex items-center justify-between rounded-lg border border-[rgba(201,168,108,0.26)] bg-[#C9A86C]/10 px-3 py-2 text-xs text-[#D8BE90]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5" />
                      {item.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

