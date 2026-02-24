'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp } from 'lucide-react';
import { userCoins, rewardCategories, rewardsShop, earnMethods } from './data';

export function RewardsShopTab() {
  const [rewardCategory, setRewardCategory] = useState("All");

  return (
    <div className="space-y-6">
      {/* Coin Balance */}
      <Card className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#F3E8FF] border-[#FDE68A]/50 shadow-xl">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#364A5E] shadow-lg flex items-center justify-center border border-[#FDE68A]">
              <Coins className="w-8 h-8 text-[#D97706]" />
            </div>
            <div>
              <p className="text-sm text-[#A0B0BC]">Your Balance</p>
              <p className="text-4xl font-bold text-[#E8E0D5]">{userCoins.toLocaleString()} <span className="text-lg text-[#D97706]">Coins</span></p>
            </div>
          </div>
          <Button variant="outline" className="border-[#D97706] text-[#D97706] hover:bg-[#FFFBEB]">
            <TrendingUp className="w-4 h-4 mr-2" />
            Earn More
          </Button>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {rewardCategories.map((cat) => (
          <Button
            key={cat}
            variant={rewardCategory === cat ? "default" : "outline"}
            className={
              rewardCategory === cat
                ? "bg-[#5BB3B3] hover:bg-[#4A9E9E] shadow-lg"
                : "border-[rgba(91,179,179,0.15)] hover:bg-[#F8FAFC] text-[#A0B0BC]"
            }
            onClick={() => setRewardCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewardsShop
          .filter((r) => rewardCategory === "All" || r.category === rewardCategory)
          .map((reward) => (
            <Card key={reward.id} className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/30 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                {reward.popular && (
                  <Badge className="absolute top-3 right-3 bg-[#DC2626] text-white text-xs shadow-lg">Popular</Badge>
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${reward.color}20, ${reward.color}40)` }}
                >
                  <reward.icon className="w-8 h-8" style={{ color: reward.color }} />
                </div>
                <h3 className="font-bold text-[#E8E0D5] mb-1">{reward.name}</h3>
                <p className="text-sm text-[#A0B0BC] mb-4">{reward.description}</p>
                <Button
                  className={`w-full shadow-lg ${
                    userCoins >= reward.price
                      ? "bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#5B21B6]"
                      : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                  }`}
                  disabled={userCoins < reward.price}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  {reward.price}
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* How to Earn */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
        <CardHeader className="border-b border-[rgba(91,179,179,0.15)]">
          <CardTitle className="text-[#E8E0D5]">How to Earn Coins</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnMethods.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:shadow-lg transition-all">
                <div 
                  className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}30)` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#E8E0D5]">{item.action}</p>
                  <p className="text-[#D97706] text-sm font-semibold">+{item.coins} coins</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
