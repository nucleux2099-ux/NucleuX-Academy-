import {
  Crown,
  Medal,
  Award,
  Star,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  Gift,
  Trophy,
  Users,
  Target,
  Calendar,
} from 'lucide-react';

export const dailyChallenge = {
  title: "Speed Round: Cardiology",
  description: "Answer 20 MCQs in 15 minutes",
  subject: "Medicine",
  difficulty: "Hard",
  questionsCount: 20,
  timeLimit: 15,
  reward: { xp: 500, coins: 100 },
  participants: 1247,
  topPerformers: [
    { rank: 1, name: "Dr. Arun K", score: "20/20", time: "8:32", avatar: "AK" },
    { rank: 2, name: "MedProdigy", score: "20/20", time: "9:15", avatar: "MP" },
    { rank: 3, name: "CardioKing", score: "19/20", time: "10:02", avatar: "CK" },
  ],
  endsIn: { hours: 5, minutes: 32, seconds: 15 },
};

export const weeklyTournament = {
  name: "Grand Medical Tournament",
  week: "Week 7",
  phase: "Qualifying",
  totalParticipants: 5847,
  qualified: 256,
  prizePool: "₹50,000",
  prizes: [
    { rank: "1st", prize: "₹20,000 + Premium 1 Year", icon: Crown },
    { rank: "2nd", prize: "₹10,000 + Premium 6 Months", icon: Medal },
    { rank: "3rd", prize: "₹5,000 + Premium 3 Months", icon: Award },
    { rank: "4-10", prize: "Premium 1 Month", icon: Star },
  ],
  schedule: [
    { phase: "Qualifying", dates: "Feb 1-7", status: "active" as const, participants: 5847 },
    { phase: "Quarter Finals", dates: "Feb 8-9", status: "upcoming" as const, participants: 256 },
    { phase: "Semi Finals", dates: "Feb 10", status: "upcoming" as const, participants: 64 },
    { phase: "Finals", dates: "Feb 11", status: "upcoming" as const, participants: 16 },
  ],
  userProgress: {
    rank: 128,
    score: 2340,
    questionsAnswered: 450,
    accuracy: 84,
    qualified: true,
    nextMilestone: { rank: 100, scoreNeeded: 2500 },
  },
};

export const leaderboardTabs = [
  { id: "allIndia", label: "All India", icon: Trophy },
  { id: "college", label: "College", icon: Users },
  { id: "state", label: "State", icon: Target },
  { id: "friends", label: "Friends", icon: Star },
  { id: "weekly", label: "This Week", icon: Calendar },
];

export const leaderboardData = {
  allIndia: [
    { rank: 1, name: "Dr. Ravi Kumar", college: "AIIMS Delhi", mcqs: 12450, accuracy: 94.2, streak: 187, xp: 125000, avatar: "RK", change: 0 },
    { rank: 2, name: "Priya Sharma", college: "CMC Vellore", mcqs: 11890, accuracy: 92.8, streak: 156, xp: 118900, avatar: "PS", change: 1 },
    { rank: 3, name: "Arjun Menon", college: "JIPMER", mcqs: 11234, accuracy: 91.5, streak: 134, xp: 112340, avatar: "AM", change: -1 },
    { rank: 4, name: "Sneha Patel", college: "KMC Manipal", mcqs: 10876, accuracy: 90.1, streak: 128, xp: 108760, avatar: "SP", change: 2 },
    { rank: 5, name: "Vikram Singh", college: "MAMC Delhi", mcqs: 10654, accuracy: 89.7, streak: 112, xp: 106540, avatar: "VS", change: 0 },
    { rank: 6, name: "Kavitha R", college: "Stanley MC", mcqs: 10234, accuracy: 88.9, streak: 98, xp: 102340, avatar: "KR", change: 3 },
    { rank: 7, name: "Mohammed Ali", college: "GMC Thrissur", mcqs: 9987, accuracy: 88.2, streak: 89, xp: 99870, avatar: "MA", change: -2 },
    { rank: 8, name: "Ananya Das", college: "KGMU Lucknow", mcqs: 9765, accuracy: 87.6, streak: 76, xp: 97650, avatar: "AD", change: 1 },
    { rank: 9, name: "Rahul Verma", college: "Grant MC Mumbai", mcqs: 9543, accuracy: 87.1, streak: 65, xp: 95430, avatar: "RV", change: 0 },
    { rank: 10, name: "Deepika N", college: "MMC Chennai", mcqs: 9321, accuracy: 86.5, streak: 54, xp: 93210, avatar: "DN", change: -1 },
  ],
  userRank: {
    rank: 1247,
    name: "Aditya C",
    college: "GMC Kadapa",
    mcqs: 4567,
    accuracy: 78.5,
    streak: 12,
    xp: 45670,
    avatar: "AC",
    change: 15,
  },
};

export const userCoins = 2450;
export const rewardCategories = ["All", "Premium", "Badges", "Cosmetics", "Donate"];

export const rewardsShop = [
  { id: 1, name: "Premium Week", description: "7 days of premium access", price: 500, category: "Premium", icon: Sparkles, color: "#5BB3B3", popular: true },
  { id: 2, name: "Premium Month", description: "30 days of premium access", price: 1500, category: "Premium", icon: Crown, color: "#D97706", popular: true },
  { id: 3, name: "Speed Demon Badge", description: "Show off your quick answering", price: 300, category: "Badges", icon: Zap, color: "#DC2626", popular: false },
  { id: 4, name: "Scholar Badge", description: "100 MCQs with 90%+ accuracy", price: 500, category: "Badges", icon: Award, color: "#7BA69E", popular: false },
  { id: 5, name: "Streak Shield", description: "Protect your streak once", price: 200, category: "Cosmetics", icon: Shield, color: "#4A9E9E", popular: true },
  { id: 6, name: "Profile Frame: Gold", description: "Golden border for your avatar", price: 800, category: "Cosmetics", icon: Star, color: "#D97706", popular: false },
  { id: 7, name: "2x XP Boost (1 Day)", description: "Double XP for 24 hours", price: 400, category: "Premium", icon: TrendingUp, color: "#5BB3B3", popular: true },
  { id: 8, name: "Donate to Scholar Fund", description: "Help a student in need", price: 100, category: "Donate", icon: Gift, color: "#DB2777", popular: false },
];

export const pastChallenges = [
  { day: "Yesterday", title: "Pharmacology Sprint", score: "18/20", rank: 45 },
  { day: "2 days ago", title: "Anatomy Quick Fire", score: "16/20", rank: 89 },
  { day: "3 days ago", title: "Pathology Master", score: "19/20", rank: 23 },
  { day: "4 days ago", title: "Surgery Challenge", score: "17/20", rank: 56 },
];

export const earnMethods = [
  { action: "Complete Daily Challenge", coins: 100, icon: Crown, color: "#DC2626" },
  { action: "Win Tournament Match", coins: 50, icon: Trophy, color: "#D97706" },
  { action: "7-Day Streak", coins: 200, icon: Calendar, color: "#5BB3B3" },
  { action: "Answer in Q&A", coins: 10, icon: Star, color: "#7BA69E" },
];
