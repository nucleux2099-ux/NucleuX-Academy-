# ATOM Proactive Messaging Specification

## Overview
ATOM proactively reaches out to students via Telegram to:
1. Send study reminders
2. Push daily quiz questions
3. Celebrate achievements
4. Provide progress summaries

## Integration with Clawdbot

ATOM uses Clawdbot's cron system for scheduled messaging:

### Cron Jobs

```yaml
# Daily morning motivation (8 AM)
- id: atom-morning
  schedule: "0 8 * * *"
  text: |
    Send a motivational study reminder to NucleuX Academy users.
    Check their last study date and streak.
    If streak broken, encourage them to restart.
    If active, congratulate and suggest today's focus.
  wakeMode: "now"
  sessionTarget: "isolated"

# Daily quiz question (12 PM)
- id: atom-noon-quiz
  schedule: "0 12 * * *"  
  text: |
    Send a quick MCQ to active NucleuX users via Telegram.
    Pick from their weak areas or current pathway.
    Format: Question + 4 options as inline buttons.
  wakeMode: "now"
  sessionTarget: "isolated"

# Evening progress summary (8 PM)
- id: atom-evening-summary
  schedule: "0 20 * * *"
  text: |
    Send daily progress summary to active users.
    Include: XP earned, competencies completed, streak status.
    If no activity, send gentle nudge.
  wakeMode: "now"
  sessionTarget: "isolated"

# Weekly report (Sunday 10 AM)
- id: atom-weekly-report
  schedule: "0 10 * * 0"
  text: |
    Send weekly study report to all users.
    Include: Total XP, competencies mastered, rank change.
    Highlight achievements and areas for improvement.
  wakeMode: "now"
  sessionTarget: "isolated"
```

## Message Templates

### Morning Motivation
```
🌅 Good morning, {name}!

Your streak: 🔥 {streak} days
Yesterday: {xp_yesterday} XP earned

Today's focus: {suggested_topic}
📚 {competency_code}: {competency_desc}

Ready to learn? Let's go! 💪
```

### Quick Quiz
```
⚡ Quick Quiz Time!

{question}

A) {option_a}
B) {option_b}
C) {option_c}
D) {option_d}

[Inline buttons for A, B, C, D]
```

### Evening Summary
```
📊 Today's Progress

✅ Competencies: {completed_today}
⚡ XP Earned: {xp_today}
🔥 Streak: {streak} days
📈 Rank: #{rank} (+{rank_change})

{encouragement_message}

See you tomorrow! 🌙
```

## Database Integration

ATOM queries the following for personalization:
- `user_preferences.telegram_chat_id` - Where to send
- `user_preferences.atom_proactive` - Opt-in status
- `competency_progress` - What they've learned
- `streaks` - Current streak
- `user_xp` - Level and XP

## Telegram Bot Setup

1. Create bot via @BotFather
2. Store token in Clawdbot config
3. Link user's Telegram ID during onboarding
4. Use Clawdbot's message tool for sending

## Implementation Steps

1. [ ] Add telegram_chat_id to onboarding flow
2. [ ] Create ATOM-specific agent config
3. [ ] Set up cron jobs in Clawdbot gateway
4. [ ] Build quiz question picker logic
5. [ ] Create message templates
6. [ ] Test with pilot users
