// Analytics Store - localStorage backed with React hooks
import { 
  UserAnalytics, 
  MCQAttempt, 
  ReadingSession, 
  VideoSession, 
  TopicMemory,
  CalibrationData,
  DailyStats,
  CONFIDENCE_EXPECTED,
  calculateMemoryStrength,
  calculateOptimalReviewDays,
} from './types';

const STORAGE_KEY = 'nucleux_analytics';

// Initialize empty analytics
function getInitialAnalytics(): UserAnalytics {
  return {
    totalQuestions: 0,
    correctAnswers: 0,
    totalStudyMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    topicsCompleted: 0,
    mcqAttempts: [],
    readingSessions: [],
    videoSessions: [],
    topicMemories: [],
    dailyStats: [],
    calibration: [
      { confidence: 'guessing', expected: 25, actual: 0, totalQuestions: 0, correctQuestions: 0 },
      { confidence: 'unsure', expected: 50, actual: 0, totalQuestions: 0, correctQuestions: 0 },
      { confidence: 'sure', expected: 75, actual: 0, totalQuestions: 0, correctQuestions: 0 },
      { confidence: 'very-sure', expected: 95, actual: 0, totalQuestions: 0, correctQuestions: 0 },
    ],
  };
}

// Load from localStorage
export function loadAnalytics(): UserAnalytics {
  if (typeof window === 'undefined') return getInitialAnalytics();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      parsed.mcqAttempts = parsed.mcqAttempts?.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      })) || [];
      parsed.readingSessions = parsed.readingSessions?.map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      })) || [];
      parsed.videoSessions = parsed.videoSessions?.map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      })) || [];
      parsed.topicMemories = parsed.topicMemories?.map((m: any) => ({
        ...m,
        firstLearned: new Date(m.firstLearned),
        lastReviewed: new Date(m.lastReviewed),
      })) || [];
      
      return { ...getInitialAnalytics(), ...parsed };
    }
  } catch (e) {
    console.error('Failed to load analytics:', e);
  }
  return getInitialAnalytics();
}

// Save to localStorage
export function saveAnalytics(analytics: UserAnalytics): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to save analytics:', e);
  }
}

// Helper: Get today's date string
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper: Get or create today's stats
function getOrCreateTodayStats(analytics: UserAnalytics): DailyStats {
  const today = getTodayString();
  let todayStats = analytics.dailyStats.find(d => d.date === today);
  
  if (!todayStats) {
    todayStats = {
      date: today,
      questionsAttempted: 0,
      questionsCorrect: 0,
      studyMinutes: 0,
      topicsReviewed: [],
      streak: false,
    };
    analytics.dailyStats.push(todayStats);
  }
  
  return todayStats;
}

// Log MCQ attempt
export function logMCQAttempt(analytics: UserAnalytics, attempt: MCQAttempt): UserAnalytics {
  const updated = { ...analytics };
  
  // Add attempt
  updated.mcqAttempts.push(attempt);
  
  // Update totals
  updated.totalQuestions++;
  if (attempt.isCorrect) updated.correctAnswers++;
  
  // Update calibration
  const confIndex = updated.calibration.findIndex(c => c.confidence === attempt.confidence);
  if (confIndex !== -1) {
    updated.calibration[confIndex].totalQuestions++;
    if (attempt.isCorrect) {
      updated.calibration[confIndex].correctQuestions++;
    }
    // Recalculate actual accuracy
    const cal = updated.calibration[confIndex];
    cal.actual = cal.totalQuestions > 0 
      ? Math.round((cal.correctQuestions / cal.totalQuestions) * 100)
      : 0;
  }
  
  // Update topic memory
  updateTopicMemory(updated, attempt.topicId, attempt.topicName, 'Surgery', attempt.isCorrect);
  
  // Update daily stats
  const todayStats = getOrCreateTodayStats(updated);
  todayStats.questionsAttempted++;
  if (attempt.isCorrect) todayStats.questionsCorrect++;
  if (!todayStats.topicsReviewed.includes(attempt.topicId)) {
    todayStats.topicsReviewed.push(attempt.topicId);
  }
  
  // Update streak
  updateStreak(updated);
  
  saveAnalytics(updated);
  return updated;
}

// Log reading session
export function logReadingSession(analytics: UserAnalytics, session: ReadingSession): UserAnalytics {
  const updated = { ...analytics };
  
  // Find or add session
  const existingIndex = updated.readingSessions.findIndex(s => s.id === session.id);
  if (existingIndex !== -1) {
    updated.readingSessions[existingIndex] = session;
  } else {
    updated.readingSessions.push(session);
  }
  
  // Update study time
  const minutesAdded = Math.round(session.duration / 60);
  updated.totalStudyMinutes += minutesAdded;
  
  // Update daily stats
  const todayStats = getOrCreateTodayStats(updated);
  todayStats.studyMinutes += minutesAdded;
  if (!todayStats.topicsReviewed.includes(session.topicId)) {
    todayStats.topicsReviewed.push(session.topicId);
  }
  
  // Update topic memory
  if (session.completed) {
    updateTopicMemory(updated, session.topicId, session.topicName, 'Reading', true);
    updated.topicsCompleted++;
  }
  
  updateStreak(updated);
  saveAnalytics(updated);
  return updated;
}

// Log video session
export function logVideoSession(analytics: UserAnalytics, session: VideoSession): UserAnalytics {
  const updated = { ...analytics };
  
  // Find or add session
  const existingIndex = updated.videoSessions.findIndex(s => s.id === session.id);
  if (existingIndex !== -1) {
    updated.videoSessions[existingIndex] = session;
  } else {
    updated.videoSessions.push(session);
  }
  
  // Update study time
  const minutesAdded = Math.round(session.watchedDuration / 60);
  updated.totalStudyMinutes += minutesAdded;
  
  // Update daily stats
  const todayStats = getOrCreateTodayStats(updated);
  todayStats.studyMinutes += minutesAdded;
  
  updateStreak(updated);
  saveAnalytics(updated);
  return updated;
}

// Update or create topic memory
function updateTopicMemory(
  analytics: UserAnalytics, 
  topicId: string, 
  topicName: string, 
  category: string,
  wasCorrect: boolean
): void {
  const now = new Date();
  let memory = analytics.topicMemories.find(m => m.topicId === topicId);
  
  if (!memory) {
    memory = {
      topicId,
      topicName,
      category,
      firstLearned: now,
      lastReviewed: now,
      reviewCount: 1,
      initialStrength: wasCorrect ? 80 : 60,
      currentStrength: wasCorrect ? 80 : 60,
      optimalReviewDays: 1,
      mcqAttempts: 1,
      mcqAccuracy: wasCorrect ? 100 : 0,
    };
    analytics.topicMemories.push(memory);
  } else {
    // Update existing memory
    memory.lastReviewed = now;
    memory.reviewCount++;
    memory.mcqAttempts++;
    
    // Recalculate accuracy
    const attempts = analytics.mcqAttempts.filter(a => a.topicId === topicId);
    const correct = attempts.filter(a => a.isCorrect).length;
    memory.mcqAccuracy = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;
    
    // Boost strength on correct answer, slight decrease on wrong
    if (wasCorrect) {
      memory.currentStrength = Math.min(100, memory.currentStrength + 5);
      memory.initialStrength = Math.max(memory.initialStrength, memory.currentStrength);
    } else {
      memory.currentStrength = Math.max(20, memory.currentStrength - 10);
    }
    
    // Update optimal review interval
    memory.optimalReviewDays = calculateOptimalReviewDays(memory.reviewCount);
  }
}

// Update streak
function updateStreak(analytics: UserAnalytics): void {
  const today = getTodayString();
  const todayStats = analytics.dailyStats.find(d => d.date === today);
  
  if (todayStats && (todayStats.questionsAttempted > 0 || todayStats.studyMinutes > 0)) {
    todayStats.streak = true;
    
    // Calculate current streak
    const sortedDays = [...analytics.dailyStats]
      .filter(d => d.streak)
      .sort((a, b) => b.date.localeCompare(a.date));
    
    let streak = 0;
    const checkDate = new Date();
    
    for (const day of sortedDays) {
      const dayDate = day.date;
      const expectedDate = checkDate.toISOString().split('T')[0];
      
      if (dayDate === expectedDate) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    analytics.currentStreak = streak;
    analytics.longestStreak = Math.max(analytics.longestStreak, streak);
  }
}

// Recalculate all topic memory strengths (call periodically)
export function recalculateMemoryStrengths(analytics: UserAnalytics): UserAnalytics {
  const now = new Date();
  const updated = { ...analytics };
  
  for (const memory of updated.topicMemories) {
    const daysSinceReview = Math.floor(
      (now.getTime() - new Date(memory.lastReviewed).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    memory.currentStrength = calculateMemoryStrength(
      memory.initialStrength,
      daysSinceReview,
      memory.reviewCount
    );
  }
  
  saveAnalytics(updated);
  return updated;
}

// Get topics that need review
export function getTopicsNeedingReview(analytics: UserAnalytics): TopicMemory[] {
  const now = new Date();
  
  return analytics.topicMemories
    .map(memory => {
      const daysSinceReview = Math.floor(
        (now.getTime() - new Date(memory.lastReviewed).getTime()) / (1000 * 60 * 60 * 24)
      );
      return { ...memory, daysSinceReview };
    })
    .filter(memory => memory.daysSinceReview >= memory.optimalReviewDays)
    .sort((a, b) => b.daysSinceReview - a.daysSinceReview);
}

// Get weekly activity data
export function getWeeklyActivity(analytics: UserAnalytics): DailyStats[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: DailyStats[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const stats = analytics.dailyStats.find(d => d.date === dateStr);
    result.push(stats || {
      date: dateStr,
      questionsAttempted: 0,
      questionsCorrect: 0,
      studyMinutes: 0,
      topicsReviewed: [],
      streak: false,
    });
  }
  
  return result;
}

// Clear all analytics (for testing)
export function clearAnalytics(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
