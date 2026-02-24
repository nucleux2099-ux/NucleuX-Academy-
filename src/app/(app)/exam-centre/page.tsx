'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Target, Award } from 'lucide-react';
import { QuickStats } from '@/components/exam-centre/QuickStats';
import { ExamTypesGrid } from '@/components/exam-centre/ExamTypesGrid';
import { FeaturedSimulations } from '@/components/exam-centre/FeaturedSimulations';
import { GuidedPathways } from '@/components/exam-centre/GuidedPathways';
import { SubjectGrid } from '@/components/exam-centre/SubjectGrid';
import { RecentActivity } from '@/components/exam-centre/RecentActivity';
import { PYQTab } from '@/components/exam-centre/PYQTab';
import { SimulatorTab } from '@/components/exam-centre/SimulatorTab';
import { GuidedLearningTab } from '@/components/exam-centre/GuidedLearningTab';
import { PracticalExamsTab } from '@/components/exam-centre/PracticalExamsTab';

export default function ExamCentrePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-400" />
            Training Centre
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

      <QuickStats />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#1A2332] border border-[rgba(91,179,179,0.15)]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-500/20">Overview</TabsTrigger>
          <TabsTrigger value="pyq" className="data-[state=active]:bg-amber-500/20">Previous Years</TabsTrigger>
          <TabsTrigger value="simulator" className="data-[state=active]:bg-emerald-500/20">Patient Simulator</TabsTrigger>
          <TabsTrigger value="guided" className="data-[state=active]:bg-purple-500/20">Guided Learning</TabsTrigger>
          <TabsTrigger value="practical" className="data-[state=active]:bg-rose-500/20">Practical Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ExamTypesGrid />
          <div className="grid grid-cols-2 gap-6">
            <FeaturedSimulations />
            <GuidedPathways />
          </div>
          <SubjectGrid />
          <RecentActivity />
        </TabsContent>

        <TabsContent value="pyq" className="space-y-4">
          <PYQTab />
        </TabsContent>

        <TabsContent value="simulator" className="space-y-4">
          <SimulatorTab />
        </TabsContent>

        <TabsContent value="guided" className="space-y-4">
          <GuidedLearningTab />
        </TabsContent>

        <TabsContent value="practical" className="space-y-4">
          <PracticalExamsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
