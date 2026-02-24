'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { recentActivity } from './data';

export function RecentActivity() {
  return (
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
  );
}
