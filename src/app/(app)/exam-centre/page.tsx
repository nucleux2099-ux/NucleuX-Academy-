'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuidedLearningStudio } from '@/components/exam/GuidedLearningStudio';
import {
  useExamCentreCatalog,
  useExamCentreOverview,
  useExamCentrePyqCatalog,
  useExamCentreReadModelAnalytics,
  useExamCentreSimulatorCatalog,
} from '@/lib/api/hooks';
import {
  GraduationCap,
  FileQuestion,
  Stethoscope,
  Activity,
  BookOpen,
  ClipboardList,
  Target,
  Clock,
  Award,
  Play,
  ChevronRight,
  Users,
  Sparkles,
  Compass,
  Heart,
  Syringe,
  Pill,
  Microscope,
  Radio,
  Baby,
  Bone,
  Eye,
  Ear,
  CheckCircle,
  Lock,
  Star,
} from 'lucide-react';

// ============================================================================
// EXAM TYPES
// ============================================================================

const examTypes = [
  {
    id: 'pyq',
    title: 'Previous Year Questions',
    description: 'University papers with textbook references',
    icon: FileQuestion,
    color: 'from-[#C9A86C] to-[#A88758]',
    stats: { total: 15000, attempted: 2340, mastered: 890 },
    sources: ['NEET-PG', 'INICET', 'AIIMS', 'JIPMER', 'DNB-CET'],
    href: '/exam-centre/pyq',
    isAvailable: true,
  },
  {
    id: 'mcq',
    title: 'MCQ Practice',
    description: 'Topic-wise questions with explanations',
    icon: ClipboardList,
    color: 'from-[#5BB3B3] to-[#4A9E9E]',
    stats: { total: 25000, attempted: 5420, mastered: 2100 },
    sources: ['Standard Textbooks', 'High-Yield Topics', 'Recent Updates'],
    href: '/exam-centre/mcq',
    isAvailable: true,
  },
  {
    id: 'patient-sim',
    title: 'Patient Simulator',
    description: 'Real-life case simulations',
    icon: Stethoscope,
    color: 'from-[#5BB3B3] to-[#4A9E9E]',
    stats: { total: 500, attempted: 45, mastered: 12 },
    features: ['History Taking', 'Examination', 'Investigations', 'Management'],
    href: '/exam-centre/simulator/acute-appendicitis',
    isAvailable: true,
  },
  {
    id: 'patient-flow',
    title: 'Patient Flows',
    description: 'Clinical decision pathways',
    icon: Activity,
    color: 'from-[#C9A86C] to-[#A88758]',
    stats: { total: 200, attempted: 28, mastered: 8 },
    features: ['Diagnostic Algorithms', 'Treatment Protocols', 'Emergency Pathways'],
    href: '/exam-centre/flow/upper-gi-bleeding',
    isAvailable: true,
  },
  {
    id: 'practical',
    title: 'Practical Exams',
    description: 'OSCE & clinical skills assessment',
    icon: Target,
    color: 'from-[#C9A86C] to-[#A88758]',
    stats: { total: 150, attempted: 22, mastered: 6 },
    types: ['Long Case', 'Short Case', 'OSCE Stations', 'Viva Voce'],
    href: '/exam-centre/osce/thyroid-examination',
    isAvailable: true,
  },
  {
    id: 'guided',
    title: 'Guided Learning',
    description: 'Step-by-step concept mastery',
    icon: Compass,
    color: 'from-[#5BB3B3] to-[#4A9E9E]',
    stats: { total: 100, attempted: 15, mastered: 5 },
    features: ['Interactive Tutorials', 'Concept Maps', 'Spaced Repetition'],
    href: '#',
    isAvailable: false,
  },
];

// ============================================================================
// SUBJECT DATA
// ============================================================================

const subjects = [
  { id: 'surgery', name: 'Surgery', icon: Syringe, color: 'text-[#EAA0A0]', pyqs: 2500, cases: 80 },
  { id: 'medicine', name: 'Medicine', icon: Pill, color: 'text-[#5BB3B3]', pyqs: 3200, cases: 120 },
  { id: 'obg', name: 'OBG', icon: Baby, color: 'text-[#C9A86C]', pyqs: 1800, cases: 60 },
  { id: 'pediatrics', name: 'Pediatrics', icon: Heart, color: 'text-[#C9A86C]', pyqs: 1500, cases: 45 },
  { id: 'anatomy', name: 'Anatomy', icon: Bone, color: 'text-[#D8BE90]', pyqs: 1200, cases: 20 },
  { id: 'pathology', name: 'Pathology', icon: Microscope, color: 'text-[#8FD5D5]', pyqs: 1400, cases: 35 },
  { id: 'pharmacology', name: 'Pharmacology', icon: Pill, color: 'text-[#8FD5D5]', pyqs: 1100, cases: 25 },
  { id: 'radiology', name: 'Radiology', icon: Radio, color: 'text-[#C9A86C]', pyqs: 800, cases: 40 },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, color: 'text-[#8FD5D5]', pyqs: 600, cases: 30 },
  { id: 'ent', name: 'ENT', icon: Ear, color: 'text-[#5BB3B3]', pyqs: 550, cases: 25 },
];

// ============================================================================
// FEATURED SIMULATIONS
// ============================================================================

const featuredSimulations = [
  {
    id: 'acute-appendicitis',
    title: 'Acute Appendicitis',
    description: 'A 22-year-old male with right iliac fossa pain for 12 hours...',
    difficulty: 'Medium',
    duration: '20 min',
    subject: 'Surgery',
    skills: ['History', 'Examination', 'McBurney\'s Point', 'Rovsing\'s Sign'],
    completionRate: 0,
    rating: 4.9,
    isNew: true,
    isAvailable: true,
  },
  {
    id: 'acute-abdomen',
    title: 'Acute Abdomen Emergency',
    description: 'A 45-year-old male presents with severe abdominal pain...',
    difficulty: 'Hard',
    duration: '25 min',
    subject: 'Surgery',
    skills: ['History', 'Examination', 'Differential Diagnosis', 'Investigation Selection'],
    completionRate: 67,
    rating: 4.8,
    isAvailable: false,
  },
  {
    id: 'chest-pain',
    title: 'Chest Pain Evaluation',
    description: 'A 60-year-old diabetic female with crushing chest pain...',
    difficulty: 'Medium',
    duration: '20 min',
    subject: 'Medicine',
    skills: ['ECG Interpretation', 'Cardiac Enzymes', 'Risk Stratification'],
    completionRate: 72,
    rating: 4.9,
    isAvailable: false,
  },
  {
    id: 'labor-management',
    title: 'Normal Labor Management',
    description: 'A primigravida at 39 weeks presents in early labor...',
    difficulty: 'Medium',
    duration: '30 min',
    subject: 'OBG',
    skills: ['Partograph', 'Fetal Monitoring', 'Stage Recognition', 'Delivery'],
    completionRate: 58,
    rating: 4.7,
    isAvailable: false,
  },
];

// ============================================================================
// GUIDED PATHWAYS
// ============================================================================

const guidedPathways = [
  {
    id: 'surgery-essentials',
    title: 'Surgery Essentials',
    modules: 12,
    completed: 4,
    description: 'Master core surgical concepts step-by-step',
    nextTopic: 'Acute Appendicitis',
    estimatedTime: '45 min',
  },
  {
    id: 'medicine-diagnostics',
    title: 'Medicine Diagnostics',
    modules: 15,
    completed: 7,
    description: 'Learn systematic diagnostic approaches',
    nextTopic: 'Approach to Anemia',
    estimatedTime: '30 min',
  },
  {
    id: 'emergency-protocols',
    title: 'Emergency Protocols',
    modules: 8,
    completed: 2,
    description: 'Critical emergency management pathways',
    nextTopic: 'Anaphylaxis Management',
    estimatedTime: '25 min',
  },
];

// ============================================================================
// RECENT ACTIVITY
// ============================================================================

const recentActivity = [
  { type: 'pyq', title: 'NEET-PG 2024 - Surgery', score: '45/50', time: '2 hours ago' },
  { type: 'simulation', title: 'Diabetic Ketoacidosis', score: '88%', time: 'Yesterday' },
  { type: 'mcq', title: 'Hepatobiliary - 25 MCQs', score: '21/25', time: '2 days ago' },
  { type: 'practical', title: 'Long Case: Thyroid Swelling', score: 'Pass', time: '3 days ago' },
];

function formatDurationLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) return `${hours} hrs`;
  if (mins === 30) return `${hours}.5 hrs`;
  return `${hours}h ${mins}m`;
}

function formatSignedPercent(value: number | null) {
  if (value === null) return 'N/A';
  return `${value > 0 ? '+' : ''}${value}%`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExamCentrePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: catalog } = useExamCentreCatalog();
  const { data: overview } = useExamCentreOverview();
  const { data: pyqCatalog } = useExamCentrePyqCatalog(6);
  const { data: simulatorCatalog } = useExamCentreSimulatorCatalog();
  const { data: examInsights } = useExamCentreReadModelAnalytics(30);

  const summary = overview?.summary;
  const questionsAttempted = summary?.questionsAttempted ?? 2340;
  const accuracyPercent = summary?.accuracyPercent ?? 68;
  const casesCompleted = summary?.casesCompleted ?? 85;
  const pathwaysDone = summary?.pathwaysDone ?? 13;
  const studyStreakDays = summary?.studyStreakDays ?? 7;
  const pathwayCards = overview?.guidedPathways?.length ? overview.guidedPathways : guidedPathways;
  const activityRows = overview?.recentActivity?.length ? overview.recentActivity : recentActivity;
  const liveSimulations = simulatorCatalog?.cases?.length ? simulatorCatalog.cases : featuredSimulations;
  const subjectProgressById = useMemo(
    () =>
      new Map(
        (overview?.subjectProgress || []).map((subject) => [subject.id, subject] as const)
      ),
    [overview?.subjectProgress]
  );
  const catalogStatsByType = useMemo(
    () => new Map((catalog?.examTypes || []).map((row) => [row.id, row.stats] as const)),
    [catalog?.examTypes]
  );
  const examTypeCards = useMemo(
    () =>
      examTypes.map((exam) => {
        const liveStats = catalogStatsByType.get(exam.id);
        return {
          ...exam,
          stats: {
            total: liveStats?.total ?? exam.stats.total,
            attempted: liveStats?.attempted ?? exam.stats.attempted,
            mastered: liveStats?.mastered ?? exam.stats.mastered,
          },
        };
      }),
    [catalogStatsByType]
  );
  const catalogSubjectsById = useMemo(
    () => new Map((catalog?.subjects || []).map((subject) => [subject.id, subject] as const)),
    [catalog?.subjects]
  );
  const pyqPapers = useMemo(() => {
    if (pyqCatalog?.papers?.length) return pyqCatalog.papers;
    return ['NEET-PG 2024', 'INICET Nov 2024', 'AIIMS Nov 2024', 'NEET-PG 2023', 'INICET May 2024', 'DNB-CET 2024'].map(
      (paperName, index) => ({
        id: paperName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: paperName,
        source: 'seed',
        year: null,
        totalQuestions: 200,
        totalSubjects: 0,
        highYieldTopics: [],
        durationMinutes: 210,
        isAvailable: index === 0,
        href: '/exam-centre/pyq',
      })
    );
  }, [pyqCatalog?.papers]);
  const insightsSummary = examInsights?.summary;
  const insightsQuality = examInsights?.sessionQuality;
  const calibrationOverall = examInsights?.confidenceCalibration?.overall;
  const calibrationGapPercent = calibrationOverall?.calibrationGapPercent ?? null;
  const weakTopics = examInsights?.weakTopicRecurrence?.topics || [];
  const topWeakTopic = weakTopics[0] || null;
  const strongestMode = useMemo(() => {
    const byMode = insightsQuality?.byMode || [];
    if (!byMode.length) return null;
    return [...byMode].sort((a, b) => (b.highQualityRate || 0) - (a.highQualityRate || 0))[0];
  }, [insightsQuality?.byMode]);

  return (
    <div className="ui-shell ui-page space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-[#5BB3B3]" />
            Training Centre
          </h1>
          <p className="text-[#A0B0BC] mt-1">
            Master concepts through practice, simulation, and guided learning
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-[#5BB3B3]/16 text-[#8FD5D5] border-[#5BB3B3]/30">
            <Target className="h-3 w-3 mr-1" />
            {questionsAttempted.toLocaleString()} Questions Attempted
          </Badge>
          <Badge variant="outline" className="bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28">
            <Award className="h-3 w-3 mr-1" />
            {accuracyPercent}% Accuracy
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="ui-interactive bg-gradient-to-br from-[#C9A86C]/16 to-[#A88758]/20 border-[#C9A86C]/28">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#D8BE90] text-sm">PYQs Solved</p>
                <p className="text-2xl font-bold text-[#E8E0D5]">{questionsAttempted.toLocaleString()}</p>
              </div>
              <FileQuestion className="h-8 w-8 text-[#D8BE90] opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="ui-interactive bg-gradient-to-br from-[#5BB3B3]/16 to-[#4A9E9E]/20 border-[#5BB3B3]/28">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9FC3BC] text-sm">Cases Completed</p>
                <p className="text-2xl font-bold text-[#E8E0D5]">{casesCompleted}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-[#8FD5D5] opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="ui-interactive bg-gradient-to-br from-[#364A5E]/95 to-[#2D3E50]/95 border-[#C9A86C]/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#D8BE90] text-sm">Pathways Done</p>
                <p className="text-2xl font-bold text-[#E8E0D5]">{pathwaysDone}</p>
              </div>
              <Compass className="h-8 w-8 text-[#C9A86C] opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="ui-interactive bg-gradient-to-br from-[#364A5E]/95 to-[#2D3E50]/95 border-[#5BB3B3]/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8FD5D5] text-sm">Study Streak</p>
                <p className="text-2xl font-bold text-[#E8E0D5]">{studyStreakDays} Days</p>
              </div>
              <Sparkles className="h-8 w-8 text-[#5BB3B3] opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start gap-1 overflow-x-auto whitespace-nowrap rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-1">
          <TabsTrigger value="overview" className="shrink-0 data-[state=active]:bg-[#5BB3B3]/16">
            Overview
          </TabsTrigger>
          <TabsTrigger value="pyq" className="shrink-0 data-[state=active]:bg-[#C9A86C]/16">
            Previous Years
          </TabsTrigger>
          <TabsTrigger value="simulator" className="shrink-0 data-[state=active]:bg-[#5BB3B3]/16">
            Patient Simulator
          </TabsTrigger>
          <TabsTrigger value="guided" className="shrink-0 data-[state=active]:bg-[#C9A86C]/16">
            Guided Learning
          </TabsTrigger>
          <TabsTrigger value="practical" className="shrink-0 data-[state=active]:bg-[#C9A86C]/16">
            Practical Exams
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Exam Types Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {examTypeCards.map((exam) => (
              <Link key={exam.id} href={exam.href || '#'}>
                <Card 
                  className={`ui-panel ui-interactive cursor-pointer group h-full ${
                    !exam.isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <exam.icon className="h-6 w-6 text-[#E8E0D5]" />
                      </div>
                      {exam.isAvailable ? (
                        <Badge className="bg-[#5BB3B3]/16 text-[#9FC3BC] text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-[#3A4D5F] text-[#A0B0BC] text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#E8E0D5] mb-1">{exam.title}</h3>
                    <p className="text-sm text-[#A0B0BC] mb-3">{exam.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7A88]">{exam.stats.total.toLocaleString()} total</span>
                      <span className="text-[#8FD5D5]">{exam.stats.mastered} mastered</span>
                    </div>
                    <Progress 
                      value={exam.stats.total > 0 ? (exam.stats.mastered / exam.stats.total) * 100 : 0}
                      className="h-1 mt-2 bg-[#253545]"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Exam Intelligence Read-Model */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-[#8FD5D5]" />
                Exam Intelligence
              </CardTitle>
              <CardDescription>Session quality, confidence calibration, and weak-topic recurrence</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#5BB3B3]/28 bg-[#2D3E50] p-4">
                <p className="text-xs uppercase tracking-wide text-[#8FD5D5]">Session quality</p>
                <p className="mt-2 text-2xl font-semibold text-[#E8E0D5]">
                  {insightsSummary?.highQualitySessionRate ?? 0}%
                </p>
                <p className="mt-1 text-xs text-[#A0B0BC]">
                  {insightsQuality?.highQualitySessions ?? 0}/{insightsQuality?.totalSessions ?? 0} sessions hit quality threshold
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#6B7A88]">
                  <span>{insightsSummary?.avgAttemptsPerSession ?? 0} avg attempts/session</span>
                  <span>
                    {insightsSummary?.avgSessionDurationMinutes !== null &&
                    insightsSummary?.avgSessionDurationMinutes !== undefined
                      ? `${insightsSummary.avgSessionDurationMinutes} min avg`
                      : 'No duration data'}
                  </span>
                </div>
                {strongestMode ? (
                  <p className="mt-2 text-xs text-[#9FC3BC]">
                    Strongest mode: <span className="font-medium uppercase">{strongestMode.mode}</span> ({strongestMode.highQualityRate}% high quality)
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-[#C9A86C]/28 bg-[#2D3E50] p-4">
                <p className="text-xs uppercase tracking-wide text-[#D8BE90]">Confidence calibration</p>
                <p className="mt-2 text-2xl font-semibold text-[#E8E0D5]">
                  {formatSignedPercent(calibrationGapPercent)}
                </p>
                <p className="mt-1 text-xs text-[#A0B0BC]">
                  Accuracy {calibrationOverall?.accuracyPercent ?? 'N/A'}% vs expected {calibrationOverall?.expectedAccuracyPercent ?? 'N/A'}%
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#6B7A88]">
                  <span>{calibrationOverall?.attempts ?? 0} confidence-tagged attempts</span>
                  <span>
                    {calibrationOverall?.avgConfidence !== null && calibrationOverall?.avgConfidence !== undefined
                      ? `avg confidence ${calibrationOverall.avgConfidence}/5`
                      : 'No confidence data'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#9FC3BC]">
                  {calibrationGapPercent === null
                    ? 'Complete more confidence-tagged attempts to calibrate.'
                    : Math.abs(calibrationGapPercent) <= 8
                      ? 'Calibration is stable.'
                      : calibrationGapPercent > 8
                        ? 'You are under-confident versus observed accuracy.'
                        : 'You are over-confident versus observed accuracy.'}
                </p>
              </div>

              <div className="rounded-xl border border-[#E57373]/30 bg-[#2D3E50] p-4">
                <p className="text-xs uppercase tracking-wide text-[#EAB7B7]">Weak-topic recurrence</p>
                <p className="mt-2 text-2xl font-semibold text-[#E8E0D5]">
                  {insightsSummary?.weakTopicCount ?? 0}
                </p>
                <p className="mt-1 text-xs text-[#A0B0BC]">
                  {insightsSummary?.recurringWeakTopicCount ?? 0} topics show repeated misses
                </p>
                {topWeakTopic ? (
                  <div className="mt-3 rounded-lg border border-[#E57373]/25 bg-[#E57373]/8 p-3">
                    <p className="text-xs text-[#EAB7B7]">Most recurrent</p>
                    <p className="mt-1 text-sm font-medium text-[#F3D6D6]">{topWeakTopic.topicLabel}</p>
                    <p className="mt-1 text-xs text-[#EAB7B7]">
                      {topWeakTopic.incorrectCount}/{topWeakTopic.attempts} incorrect ({topWeakTopic.recurrenceCount} repeat misses)
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[#9FC3BC]">
                    No recurring weak topic detected in the selected window.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Featured Simulations */}
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-[#8FD5D5]" />
                  Featured Patient Cases
                </CardTitle>
                <CardDescription>Real-world clinical simulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveSimulations.map((sim) => (
                  <Link 
                    key={sim.id}
                    href={sim.isAvailable ? `/exam-centre/simulator/${sim.id}` : '#'}
                    className={`block p-3 rounded-lg bg-[#2D3E50] hover:bg-[#162535] transition-colors group ${
                      sim.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-[#E8E0D5] group-hover:text-[#8FD5D5] transition-colors flex items-center gap-2">
                          {sim.title}
                          {sim.isNew && (
                            <Badge className="bg-[#5BB3B3]/16 text-[#9FC3BC] text-xs">NEW</Badge>
                          )}
                          {!sim.isAvailable && (
                            <Lock className="h-3 w-3 text-[#6B7A88]" />
                          )}
                        </h4>
                        <p className="text-xs text-[#6B7A88] mt-0.5">{sim.description}</p>
                      </div>
                      <Badge variant="outline" className={
                        sim.difficulty === 'Hard' 
                          ? 'bg-[#E57373]/18 text-[#EAB7B7] border-[#E57373]/28'
                          : 'bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28'
                      }>
                        {sim.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#A0B0BC]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {sim.duration}
                      </span>
                      <span>{sim.subject}</span>
                      <span className="flex items-center gap-1 ml-auto text-[#D8BE90]">
                        <Star className="h-3 w-3 fill-current" /> {sim.rating}
                      </span>
                    </div>
                  </Link>
                ))}
                <Button variant="outline" className="w-full mt-2 border-[#5BB3B3]/28 text-[#8FD5D5] hover:bg-[#5BB3B3]/10">
                  View All Cases <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Guided Pathways */}
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#C9A86C]" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Your guided learning pathways</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pathwayCards.map((pathway) => (
                  <div 
                    key={pathway.id}
                    className="p-3 rounded-lg bg-[#2D3E50] hover:bg-[#162535] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-[#E8E0D5] group-hover:text-[#C9A86C] transition-colors">
                          {pathway.title}
                        </h4>
                        <p className="text-xs text-[#6B7A88] mt-0.5">{pathway.description}</p>
                      </div>
                      <span className="text-xs text-[#A0B0BC]">
                        {pathway.completed}/{pathway.modules} modules
                      </span>
                    </div>
                    <Progress 
                      value={(pathway.completed / pathway.modules) * 100} 
                      className="h-1.5 bg-[#253545] mb-2"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#C9A86C]">
                        Next: {pathway.nextTopic}
                      </span>
                      <span className="text-[#6B7A88] flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {pathway.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 border-[#C9A86C]/30 text-[#C9A86C] hover:bg-[#C9A86C]/10">
                  Explore All Pathways <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subject-wise Quick Access */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#5BB3B3]" />
                Subject-wise Practice
              </CardTitle>
              <CardDescription>Jump into any subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {subjects.map((subject) => {
                  const progress = subjectProgressById.get(subject.id);
                  const catalogSubject = catalogSubjectsById.get(subject.id);
                  const hasProgress = Boolean(progress && progress.totalTopics > 0);
                  const progressLabel = hasProgress
                    ? `${progress!.completedTopics}/${progress!.totalTopics} pathways`
                    : catalogSubject && catalogSubject.pyqQuestions > 0
                      ? `${catalogSubject.pyqQuestions.toLocaleString()} PYQs`
                      : `${subject.pyqs.toLocaleString()} PYQs`;
                  return (
                    <div 
                      key={subject.id}
                      className="p-4 rounded-lg bg-[#2D3E50] hover:bg-[#162535] cursor-pointer transition-all hover:scale-105 text-center group"
                    >
                      <subject.icon className={`h-8 w-8 mx-auto mb-2 ${subject.color} group-hover:scale-110 transition-transform`} />
                      <p className="text-sm font-medium text-[#E8E0D5]">{subject.name}</p>
                      <p className="text-xs text-[#6B7A88] mt-1">{progressLabel}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#A0B0BC]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activityRows.map((activity, idx) => (
                  <div key={`${activity.title}-${idx}`} className="flex items-center justify-between p-3 rounded-lg bg-[#2D3E50]">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'pyq' ? 'bg-[#D8BE90]' :
                        activity.type === 'simulation' ? 'bg-[#8FD5D5]' :
                        activity.type === 'mcq' ? 'bg-[#8FD5D5]' :
                        'bg-[#C9A86C]'
                      }`} />
                      <span className="text-[#E8E0D5]">{activity.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-[#5BB3B3]/10 text-[#8FD5D5] border-[#5BB3B3]/16">
                        {activity.score}
                      </Badge>
                      <span className="text-xs text-[#6B7A88]">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PYQ TAB */}
        <TabsContent value="pyq" className="space-y-4">
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-[#D8BE90]" />
                Previous Year Questions
              </CardTitle>
              <CardDescription>
                University exam questions with textbook references
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Featured Sample Question */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#C9A86C]/16 to-[#A88758]/18 border border-[#C9A86C]/28">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-[#5BB3B3] text-[#E8E0D5] mb-2">NEW: Sample Available</Badge>
                    <h3 className="text-lg font-semibold text-[#E8E0D5]">Acute Appendicitis - ALVARADO Score</h3>
                    <p className="text-sm text-[#A0B0BC]">NEET-PG 2023 • Surgery • Medium Difficulty</p>
                  </div>
                  <Link href="/exam-centre/pyq">
                    <Button className="bg-[#C9A86C] hover:bg-[#B89455] text-[#E8E0D5]">
                      <Play className="h-4 w-4 mr-2" />
                      Try Sample PYQ
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#D8BE90]/80">
                  Experience the complete PYQ format with clinical vignettes, textbook references from Bailey & Love, Sabiston, and more.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {pyqPapers.map((paper) => (
                  <Card key={paper.id} className="bg-[#2D3E50] border-[#C9A86C]/16 hover:border-[#C9A86C]/40 cursor-pointer transition-all">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#E8E0D5] mb-2">{paper.name}</h3>
                      <p className="text-sm text-[#A0B0BC] mb-3">
                        {paper.totalQuestions} Questions • {formatDurationLabel(paper.durationMinutes)}
                      </p>
                      <div className="flex gap-2">
                        {paper.isAvailable ? (
                          <Link href={paper.href || '/exam-centre/pyq'} className="flex-1">
                            <Button size="sm" className="bg-[#C9A86C]/16 text-[#D8BE90] hover:bg-[#C9A86C]/28 w-full">
                              <Play className="h-3 w-3 mr-1" /> Start
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="bg-[#3A4D5F] text-[#A0B0BC] flex-1" disabled>
                            <Lock className="h-3 w-3 mr-1" /> Locked
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-[#C9A86C]/28 text-[#D8BE90]">
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/16">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-[#D8BE90] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-[#D8BE90]">Textbook References Included</h4>
                    <p className="text-sm text-[#D8BE90]/70 mt-1">
                      Every question is linked to standard textbooks — Bailey, Sabiston, Harrison&apos;s, and more. 
                      Learn not just the answer, but the source.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIMULATOR TAB */}
        <TabsContent value="simulator" className="space-y-4">
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-[#8FD5D5]" />
                Patient Simulator
              </CardTitle>
              <CardDescription>
                Real-life clinical scenarios based on standard textbooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Simulation Flow Explanation */}
              <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                <h4 className="font-medium text-[#9FC3BC] mb-3">How Patient Simulation Works</h4>
                <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-5">
                  {[
                    { icon: Users, label: 'Patient Presents', desc: 'Read the case' },
                    { icon: ClipboardList, label: 'Take History', desc: 'Ask questions' },
                    { icon: Stethoscope, label: 'Examine', desc: 'Physical findings' },
                    { icon: Microscope, label: 'Investigate', desc: 'Order tests' },
                    { icon: Pill, label: 'Manage', desc: 'Treatment plan' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#5BB3B3]/16 flex items-center justify-center mb-2">
                        <step.icon className="h-5 w-5 text-[#8FD5D5]" />
                      </div>
                      <p className="text-xs font-medium text-[#9FC3BC]">{step.label}</p>
                      <p className="text-xs text-[#9FC3BC]/60 mt-0.5">{step.desc}</p>
                      {idx < 4 && (
                        <ChevronRight className="absolute top-3 -right-1 hidden h-4 w-4 text-[#5BB3B3]/45 sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Patient Flow Link */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#364A5E]/95 to-[#2D3E50]/95 border border-[#C9A86C]/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-[#C9A86C] text-[#E8E0D5] mb-2">CLINICAL PATHWAYS</Badge>
                    <h3 className="text-lg font-semibold text-[#E8E0D5]">Upper GI Bleeding Flow</h3>
                    <p className="text-sm text-[#A0B0BC]">Interactive decision tree with Blatchford & Rockall scores</p>
                  </div>
                  <Link href="/exam-centre/flow/upper-gi-bleeding">
                    <Button className="bg-[#C9A86C] hover:bg-[#B89455] text-[#E8E0D5]">
                      <Activity className="h-4 w-4 mr-2" />
                      Try Flow
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Featured Cases */}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {liveSimulations.map((sim) => (
                  <Card key={sim.id} className={`bg-[#2D3E50] border-[#5BB3B3]/16 hover:border-[#5BB3B3]/36 transition-all ${
                    sim.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            sim.difficulty === 'Hard' 
                              ? 'bg-[#E57373]/18 text-[#EAB7B7]'
                              : 'bg-[#C9A86C]/16 text-[#D8BE90]'
                          }>
                            {sim.difficulty}
                          </Badge>
                          {sim.isNew && (
                            <Badge className="bg-[#5BB3B3]/16 text-[#9FC3BC]">NEW</Badge>
                          )}
                        </div>
                        <span className="text-xs text-[#A0B0BC]">{sim.subject}</span>
                      </div>
                      <h3 className="font-semibold text-[#E8E0D5] mb-2 flex items-center gap-2">
                        {sim.title}
                        {!sim.isAvailable && <Lock className="h-3 w-3 text-[#6B7A88]" />}
                      </h3>
                      <p className="text-sm text-[#A0B0BC] mb-3">{sim.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {sim.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-[#5BB3B3]/10 text-[#9FC3BC] border-[#5BB3B3]/16">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7A88] flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {sim.duration}
                        </span>
                        {sim.isAvailable ? (
                          <Link href={`/exam-centre/simulator/${sim.id}`}>
                            <Button size="sm" className="bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28">
                              <Play className="h-3 w-3 mr-1" /> Start Case
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="bg-[#3A4D5F] text-[#A0B0BC]" disabled>
                            <Lock className="h-3 w-3 mr-1" /> Coming Soon
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GUIDED LEARNING TAB */}
        <TabsContent value="guided" className="space-y-4">
          <GuidedLearningStudio />
        </TabsContent>

        {/* PRACTICAL EXAMS TAB */}
        <TabsContent value="practical" className="space-y-4">
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#C9A86C]" />
                Practical & Clinical Exams
              </CardTitle>
              <CardDescription>
                OSCE stations, long cases, short cases, and viva preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Featured OSCE Station */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#364A5E]/95 to-[#2D3E50]/95 border border-[#C9A86C]/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-[#5BB3B3] text-[#E8E0D5] mb-2">NEW: Sample Available</Badge>
                    <h3 className="text-lg font-semibold text-[#E8E0D5]">Thyroid Examination OSCE Station</h3>
                    <p className="text-sm text-[#A0B0BC]">Endocrine • 8 minutes • 41 checklist items</p>
                  </div>
                  <Link href="/exam-centre/osce/thyroid-examination">
                    <Button className="bg-[#C9A86C] hover:bg-[#B89455] text-[#E8E0D5]">
                      <Play className="h-4 w-4 mr-2" />
                      Start OSCE
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#D8BE90]/80">
                  Complete OSCE station with timer, examiner checklist, self-scoring, model answers, and verbal scripts.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {[
                  { title: 'OSCE Stations', desc: 'Timed clinical skill stations', count: 50, icon: Clock, href: '/exam-centre/osce/thyroid-examination', available: true },
                  { title: 'Long Cases', desc: 'Complete case presentations', count: 30, icon: ClipboardList, href: '#', available: false },
                  { title: 'Short Cases', desc: 'Focused clinical examinations', count: 45, icon: Stethoscope, href: '#', available: false },
                  { title: 'Viva Voce', desc: 'Common viva questions', count: 200, icon: Users, href: '#', available: false },
                ].map((item) => (
                  <Card key={item.title} className={`bg-[#2D3E50] border-[#C9A86C]/20 hover:border-[#C9A86C]/35 cursor-pointer transition-all ${!item.available ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#C9A86C]/16 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-[#C9A86C]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#E8E0D5]">{item.title}</h3>
                          <p className="text-xs text-[#6B7A88]">{item.count} available</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#A0B0BC] mb-3">{item.desc}</p>
                      {item.available ? (
                        <Link href={item.href}>
                          <Button size="sm" className="w-full bg-[#C9A86C]/16 text-[#D8BE90] hover:bg-[#C9A86C]/30">
                            Practice Now
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" className="w-full bg-[#3A4D5F] text-[#A0B0BC]" disabled>
                          <Lock className="h-3 w-3 mr-1" /> Coming Soon
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
