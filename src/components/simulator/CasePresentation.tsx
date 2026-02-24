'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, BookOpen, Activity, Heart, Thermometer, Wind, Droplets, Eye, ChevronRight,
} from 'lucide-react';
import type { CaseData } from './types';

interface CasePresentationProps {
  caseData: CaseData;
  onNext: () => void;
}

export function CasePresentation({ caseData, onNext }: CasePresentationProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          Case Presentation
        </CardTitle>
        <CardDescription>Read the clinical scenario carefully</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="p-4 rounded-lg bg-[#0D1B2A]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Users className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {caseData.patient.age}-year-old {caseData.patient.gender === 'male' ? 'Male' : 'Female'}
              </h3>
              <p className="text-gray-400">{caseData.patient.occupation}</p>
              <Badge className="mt-1 bg-blue-500/20 text-blue-300">
                {caseData.patient.setting}
              </Badge>
            </div>
          </div>
          <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/10 rounded-r-lg">
            <p className="text-amber-300 font-medium">Chief Complaint</p>
            <p className="text-white mt-1">{caseData.presentation.chiefComplaint}</p>
          </div>
        </div>

        {/* Scenario */}
        <div className="p-4 rounded-lg bg-[#0D1B2A]">
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-400" />
            Clinical Scenario
          </h4>
          <p className="text-gray-300 leading-relaxed">{caseData.presentation.scenario}</p>
        </div>

        {/* Vitals */}
        <div className="p-4 rounded-lg bg-[#0D1B2A]">
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-red-400" />
            Vital Signs
          </h4>
          <div className="grid grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-red-500/10 text-center">
              <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Pulse</p>
              <p className="text-sm font-medium text-white">{caseData.presentation.vitals.pulse}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 text-center">
              <Activity className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">BP</p>
              <p className="text-sm font-medium text-white">{caseData.presentation.vitals.bp}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 text-center">
              <Thermometer className="h-5 w-5 text-amber-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Temp</p>
              <p className="text-sm font-medium text-white">{caseData.presentation.vitals.temperature}</p>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/10 text-center">
              <Wind className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">RR</p>
              <p className="text-sm font-medium text-white">{caseData.presentation.vitals.respiratory_rate}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
              <Droplets className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">SpO2</p>
              <p className="text-sm font-medium text-white">{caseData.presentation.vitals.spo2}</p>
            </div>
          </div>
        </div>

        {/* General Appearance */}
        <div className="p-4 rounded-lg bg-[#0D1B2A]">
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-400" />
            General Appearance
          </h4>
          <p className="text-gray-300">{caseData.presentation.generalAppearance}</p>
        </div>

        <Button
          className="w-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          onClick={onNext}
        >
          Proceed to History Taking <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
