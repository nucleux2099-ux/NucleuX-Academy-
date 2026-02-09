'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GraduationCap,
  FileQuestion,
  Stethoscope,
  Activity,
  BookOpen,
  ClipboardList,
  Brain,
  Target,
  TrendingUp,
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
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Lock,
  Star,
} from 'lucide-react';

// Exam Centre Theme - Deep Purple/Indigo
const themeColor = '#6366F1';

// ============================================================================
// EXAM TYPES
// ============================================================================

const examTypes = [
  {
    id: 'pyq',
    title: 'Previous Year Questions',
    description: 'University papers with textbook references',
    icon: FileQuestion,
    color: 'from-amber-500 to-orange-600',
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
    color: 'from-blue-500 to-cyan-600',
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
    color: 'from-emerald-500 to-teal-600',
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-rose-500 to-red-600',
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
    color: 'from-indigo-500 to-violet-600',
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
  { id: 'surgery', name: 'Surgery', icon: Syringe, color: 'text-red-400', pyqs: 2500, cases: 80 },
  { id: 'medicine', name: 'Medicine', icon: Pill, color: 'text-blue-400', pyqs: 3200, cases: 120 },
  { id: 'obg', name: 'OBG', icon: Baby, color: 'text-pink-400', pyqs: 1800, cases: 60 },
  { id: 'pediatrics', name: 'Pediatrics', icon: Heart, color: 'text-purple-400', pyqs: 1500, cases: 45 },
  { id: 'anatomy', name: 'Anatomy', icon: Bone, color: 'text-amber-400', pyqs: 1200, cases: 20 },
  { id: 'pathology', name: 'Pathology', icon: Microscope, color: 'text-emerald-400', pyqs: 1400, cases: 35 },
  { id: 'pharmacology', name: 'Pharmacology', icon: Pill, color: 'text-cyan-400', pyqs: 1100, cases: 25 },
  { id: 'radiology', name: 'Radiology', icon: Radio, color: 'text-orange-400', pyqs: 800, cases: 40 },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, color: 'text-teal-400', pyqs: 600, cases: 30 },
  { id: 'ent', name: 'ENT', icon: Ear, color: 'text-indigo-400', pyqs: 550, cases: 25 },
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExamCentrePage() {
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-400" />
            Exam Centre
          </h1>
          <p className="text-gray-400 mt-1">
            Master concepts through practice, simulation, and guided learning
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            <Target className="h-3 w-3 mr-1" />
            2,340 Questions Attempted
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <Award className="h-3 w-3 mr-1" />
            68% Accuracy
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm">PYQs Solved</p>
                <p className="text-2xl font-bold text-white">2,340</p>
              </div>
              <FileQuestion className="h-8 w-8 text-amber-400 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Cases Completed</p>
                <p className="text-2xl font-bold text-white">85</p>
              </div>
              <Stethoscope className="h-8 w-8 text-emerald-400 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Pathways Done</p>
                <p className="text-2xl font-bold text-white">13</p>
              </div>
              <Compass className="h-8 w-8 text-purple-400 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Study Streak</p>
                <p className="text-2xl font-bold text-white">7 Days</p>
              </div>
              <Sparkles className="h-8 w-8 text-blue-400 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#1A2332] border border-[rgba(91,179,179,0.15)]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-500/20">
            Overview
          </TabsTrigger>
          <TabsTrigger value="pyq" className="data-[state=active]:bg-amber-500/20">
            Previous Years
          </TabsTrigger>
          <TabsTrigger value="simulator" className="data-[state=active]:bg-emerald-500/20">
            Patient Simulator
          </TabsTrigger>
          <TabsTrigger value="guided" className="data-[state=active]:bg-purple-500/20">
            Guided Learning
          </TabsTrigger>
          <TabsTrigger value="practical" className="data-[state=active]:bg-rose-500/20">
            Practical Exams
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Exam Types Grid */}
          <div className="grid grid-cols-3 gap-4">
            {examTypes.map((exam) => (
              <Link key={exam.id} href={exam.href || '#'}>
                <Card 
                  className={`bg-[#1A2332] border-[rgba(91,179,179,0.15)] hover:border-indigo-500/50 cursor-pointer transition-all group h-full ${
                    !exam.isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <exam.icon className="h-6 w-6 text-white" />
                      </div>
                      {exam.isAvailable ? (
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-white mb-1">{exam.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{exam.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{exam.stats.total.toLocaleString()} total</span>
                      <span className="text-emerald-400">{exam.stats.mastered} mastered</span>
                    </div>
                    <Progress 
                      value={(exam.stats.mastered / exam.stats.total) * 100} 
                      className="h-1 mt-2 bg-gray-700"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Featured Simulations */}
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-emerald-400" />
                  Featured Patient Cases
                </CardTitle>
                <CardDescription>Real-world clinical simulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredSimulations.map((sim) => (
                  <Link 
                    key={sim.id}
                    href={sim.isAvailable ? `/exam-centre/simulator/${sim.id}` : '#'}
                    className={`block p-3 rounded-lg bg-[#0D1B2A] hover:bg-[#162535] transition-colors group ${
                      sim.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                          {sim.title}
                          {sim.isNew && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">NEW</Badge>
                          )}
                          {!sim.isAvailable && (
                            <Lock className="h-3 w-3 text-gray-500" />
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{sim.description}</p>
                      </div>
                      <Badge variant="outline" className={
                        sim.difficulty === 'Hard' 
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }>
                        {sim.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {sim.duration}
                      </span>
                      <span>{sim.subject}</span>
                      <span className="flex items-center gap-1 ml-auto text-amber-400">
                        <Star className="h-3 w-3 fill-current" /> {sim.rating}
                      </span>
                    </div>
                  </Link>
                ))}
                <Button variant="outline" className="w-full mt-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  View All Cases <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Guided Pathways */}
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="h-5 w-5 text-purple-400" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Your guided learning pathways</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {guidedPathways.map((pathway) => (
                  <div 
                    key={pathway.id}
                    className="p-3 rounded-lg bg-[#0D1B2A] hover:bg-[#162535] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                          {pathway.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{pathway.description}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {pathway.completed}/{pathway.modules} modules
                      </span>
                    </div>
                    <Progress 
                      value={(pathway.completed / pathway.modules) * 100} 
                      className="h-1.5 bg-gray-700 mb-2"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-400">
                        Next: {pathway.nextTopic}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {pathway.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  Explore All Pathways <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subject-wise Quick Access */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                Subject-wise Practice
              </CardTitle>
              <CardDescription>Jump into any subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {subjects.map((subject) => (
                  <div 
                    key={subject.id}
                    className="p-4 rounded-lg bg-[#0D1B2A] hover:bg-[#162535] cursor-pointer transition-all hover:scale-105 text-center group"
                  >
                    <subject.icon className={`h-8 w-8 mx-auto mb-2 ${subject.color} group-hover:scale-110 transition-transform`} />
                    <p className="text-sm font-medium text-white">{subject.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{subject.pyqs.toLocaleString()} PYQs</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#0D1B2A]">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'pyq' ? 'bg-amber-400' :
                        activity.type === 'simulation' ? 'bg-emerald-400' :
                        activity.type === 'mcq' ? 'bg-blue-400' :
                        'bg-rose-400'
                      }`} />
                      <span className="text-white">{activity.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {activity.score}
                      </Badge>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PYQ TAB */}
        <TabsContent value="pyq" className="space-y-4">
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-amber-400" />
                Previous Year Questions
              </CardTitle>
              <CardDescription>
                University exam questions with textbook references
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Featured Sample Question */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-emerald-500 text-white mb-2">NEW: Sample Available</Badge>
                    <h3 className="text-lg font-semibold text-white">Acute Appendicitis - ALVARADO Score</h3>
                    <p className="text-sm text-gray-400">NEET-PG 2023 • Surgery • Medium Difficulty</p>
                  </div>
                  <Link href="/exam-centre/pyq">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Try Sample PYQ
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-amber-200/80">
                  Experience the complete PYQ format with clinical vignettes, textbook references from Bailey & Love, Sabiston, and more.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {['NEET-PG 2024', 'INICET Nov 2024', 'AIIMS Nov 2024', 'NEET-PG 2023', 'INICET May 2024', 'DNB-CET 2024'].map((exam, idx) => (
                  <Card key={exam} className="bg-[#0D1B2A] border-amber-500/20 hover:border-amber-500/50 cursor-pointer transition-all">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2">{exam}</h3>
                      <p className="text-sm text-gray-400 mb-3">200 Questions • 3.5 hrs</p>
                      <div className="flex gap-2">
                        {idx === 0 ? (
                          <Link href="/exam-centre/pyq" className="flex-1">
                            <Button size="sm" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 w-full">
                              <Play className="h-3 w-3 mr-1" /> Start
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="bg-gray-500/20 text-gray-400 flex-1" disabled>
                            <Lock className="h-3 w-3 mr-1" /> Locked
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400">
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-300">Textbook References Included</h4>
                    <p className="text-sm text-amber-200/70 mt-1">
                      Every question is linked to standard textbooks — Bailey, Sabiston, Harrison's, and more. 
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
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
                Patient Simulator
              </CardTitle>
              <CardDescription>
                Real-life clinical scenarios based on standard textbooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Simulation Flow Explanation */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="font-medium text-emerald-300 mb-3">How Patient Simulation Works</h4>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[
                    { icon: Users, label: 'Patient Presents', desc: 'Read the case' },
                    { icon: ClipboardList, label: 'Take History', desc: 'Ask questions' },
                    { icon: Stethoscope, label: 'Examine', desc: 'Physical findings' },
                    { icon: Microscope, label: 'Investigate', desc: 'Order tests' },
                    { icon: Pill, label: 'Manage', desc: 'Treatment plan' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                        <step.icon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <p className="text-xs font-medium text-emerald-300">{step.label}</p>
                      <p className="text-xs text-emerald-200/60 mt-0.5">{step.desc}</p>
                      {idx < 4 && (
                        <ChevronRight className="absolute top-3 -right-1 h-4 w-4 text-emerald-500/50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Patient Flow Link */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-purple-500 text-white mb-2">CLINICAL PATHWAYS</Badge>
                    <h3 className="text-lg font-semibold text-white">Upper GI Bleeding Flow</h3>
                    <p className="text-sm text-gray-400">Interactive decision tree with Blatchford & Rockall scores</p>
                  </div>
                  <Link href="/exam-centre/flow/upper-gi-bleeding">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Activity className="h-4 w-4 mr-2" />
                      Try Flow
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Featured Cases */}
              <div className="grid grid-cols-2 gap-4">
                {featuredSimulations.map((sim) => (
                  <Card key={sim.id} className={`bg-[#0D1B2A] border-emerald-500/20 hover:border-emerald-500/40 transition-all ${
                    sim.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            sim.difficulty === 'Hard' 
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }>
                            {sim.difficulty}
                          </Badge>
                          {sim.isNew && (
                            <Badge className="bg-emerald-500/20 text-emerald-300">NEW</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{sim.subject}</span>
                      </div>
                      <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        {sim.title}
                        {!sim.isAvailable && <Lock className="h-3 w-3 text-gray-500" />}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{sim.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {sim.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {sim.duration}
                        </span>
                        {sim.isAvailable ? (
                          <Link href={`/exam-centre/simulator/${sim.id}`}>
                            <Button size="sm" className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                              <Play className="h-3 w-3 mr-1" /> Start Case
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="bg-gray-500/20 text-gray-400" disabled>
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
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-purple-400" />
                Guided Learning Pathways
              </CardTitle>
              <CardDescription>
                Step-by-step concept mastery with spaced repetition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {guidedPathways.map((pathway) => (
                <Card key={pathway.id} className="bg-[#0D1B2A] border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{pathway.title}</h3>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                        {pathway.completed}/{pathway.modules} Complete
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{pathway.description}</p>
                    <Progress value={(pathway.completed / pathway.modules) * 100} className="h-2 bg-gray-700 mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Next: </span>
                        <span className="text-purple-400">{pathway.nextTopic}</span>
                        <span className="text-gray-500 ml-2">• {pathway.estimatedTime}</span>
                      </div>
                      <Button size="sm" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                        <Play className="h-3 w-3 mr-1" /> Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRACTICAL EXAMS TAB */}
        <TabsContent value="practical" className="space-y-4">
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-rose-400" />
                Practical & Clinical Exams
              </CardTitle>
              <CardDescription>
                OSCE stations, long cases, short cases, and viva preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Featured OSCE Station */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-emerald-500 text-white mb-2">NEW: Sample Available</Badge>
                    <h3 className="text-lg font-semibold text-white">Thyroid Examination OSCE Station</h3>
                    <p className="text-sm text-gray-400">Endocrine • 8 minutes • 41 checklist items</p>
                  </div>
                  <Link href="/exam-centre/osce/thyroid-examination">
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Start OSCE
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-rose-200/80">
                  Complete OSCE station with timer, examiner checklist, self-scoring, model answers, and verbal scripts.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'OSCE Stations', desc: 'Timed clinical skill stations', count: 50, icon: Clock, href: '/exam-centre/osce/thyroid-examination', available: true },
                  { title: 'Long Cases', desc: 'Complete case presentations', count: 30, icon: ClipboardList, href: '#', available: false },
                  { title: 'Short Cases', desc: 'Focused clinical examinations', count: 45, icon: Stethoscope, href: '#', available: false },
                  { title: 'Viva Voce', desc: 'Common viva questions', count: 200, icon: Users, href: '#', available: false },
                ].map((item) => (
                  <Card key={item.title} className={`bg-[#0D1B2A] border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all ${!item.available ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-rose-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <p className="text-xs text-gray-500">{item.count} available</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{item.desc}</p>
                      {item.available ? (
                        <Link href={item.href}>
                          <Button size="sm" className="w-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30">
                            Practice Now
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" className="w-full bg-gray-500/20 text-gray-400" disabled>
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
