#!/usr/bin/env python3
"""
Create Arena-ready format for CBME gamification
"""
import json
import random

def create_arena_format():
    """Create Arena/Gaming optimized format"""
    
    # Load all competencies
    with open('index.json', 'r', encoding='utf-8') as f:
        all_competencies = json.load(f)
    
    # Load summary stats
    with open('summary_stats.json', 'r', encoding='utf-8') as f:
        stats = json.load(f)
    
    # Arena format with gaming elements
    arena_data = {
        "metadata": {
            "title": "CBME Arena - NucleuX Academy",
            "version": "1.0",
            "total_competencies": len(all_competencies),
            "total_phases": 4,
            "total_subjects": 18,
            "difficulty_levels": 3,
            "generated": "2026-02-08"
        },
        "phases": [],
        "achievements": [],
        "quests": [],
        "leaderboard_categories": [],
        "competency_tree": {}
    }
    
    # Create phases with gaming elements
    phase_info = {
        "Phase-1": {
            "name": "Foundation Explorer",
            "description": "Master the basic sciences that form the foundation of medicine",
            "difficulty": 1,
            "color": "#4CAF50",
            "icon": "🔬",
            "unlock_requirement": "Complete orientation",
            "completion_reward": 1000
        },
        "Phase-2": {
            "name": "Pathology Detective", 
            "description": "Investigate diseases and understand diagnostic principles",
            "difficulty": 2,
            "color": "#FF9800",
            "icon": "🧬",
            "unlock_requirement": "Complete Phase-1 with 80% mastery",
            "completion_reward": 1500
        },
        "Phase-3A": {
            "name": "Specialist Scholar",
            "description": "Explore clinical specialties and advanced diagnostics",
            "difficulty": 3,
            "color": "#2196F3", 
            "icon": "🩺",
            "unlock_requirement": "Complete Phase-2 with 85% mastery",
            "completion_reward": 2000
        },
        "Phase-3B": {
            "name": "Clinical Champion",
            "description": "Master major clinical subjects and patient management",
            "difficulty": 4,
            "color": "#9C27B0",
            "icon": "🏥",
            "unlock_requirement": "Complete Phase-3A with 90% mastery",
            "completion_reward": 3000
        }
    }
    
    # Create phases
    for phase_key, subjects in stats.items():
        phase_data = {
            "id": phase_key.lower().replace('-', '_'),
            "name": phase_info[phase_key]["name"],
            "description": phase_info[phase_key]["description"],
            "difficulty": phase_info[phase_key]["difficulty"],
            "color": phase_info[phase_key]["color"],
            "icon": phase_info[phase_key]["icon"],
            "unlock_requirement": phase_info[phase_key]["unlock_requirement"],
            "completion_reward": phase_info[phase_key]["completion_reward"],
            "subjects": [],
            "total_competencies": sum(subjects.values()),
            "total_xp_available": sum(subjects.values()) * 10
        }
        
        # Add subjects to phase
        for subject_name, comp_count in subjects.items():
            subject_data = {
                "id": subject_name.lower().replace(' ', '_').replace('-', '_'),
                "name": subject_name,
                "competency_count": comp_count,
                "xp_per_competency": 10,
                "total_xp": comp_count * 10,
                "estimated_hours": comp_count * 0.5,  # 30 min per competency
                "difficulty_distribution": {
                    "must_know": int(comp_count * 0.6),
                    "should_know": int(comp_count * 0.3), 
                    "nice_to_know": int(comp_count * 0.1)
                }
            }
            phase_data["subjects"].append(subject_data)
        
        arena_data["phases"].append(phase_data)
    
    # Create achievements
    achievements = [
        {
            "id": "first_competency",
            "name": "First Steps",
            "description": "Complete your first competency",
            "icon": "🎯",
            "xp_reward": 50,
            "rarity": "common"
        },
        {
            "id": "anatomy_master",
            "name": "Anatomy Master",
            "description": "Complete all 654 Anatomy competencies",
            "icon": "🦴",
            "xp_reward": 1000,
            "rarity": "legendary"
        },
        {
            "id": "speed_learner",
            "name": "Speed Learner",
            "description": "Complete 50 competencies in one day",
            "icon": "⚡",
            "xp_reward": 200,
            "rarity": "rare"
        },
        {
            "id": "phase_1_graduate",
            "name": "Pre-Clinical Graduate",
            "description": "Complete all Phase-1 competencies",
            "icon": "🎓",
            "xp_reward": 2000,
            "rarity": "epic"
        },
        {
            "id": "perfect_streak",
            "name": "Perfect Scholar",
            "description": "Get 100% on 20 competencies in a row",
            "icon": "💎",
            "xp_reward": 500,
            "rarity": "epic"
        },
        {
            "id": "cbme_champion",
            "name": "CBME Champion",
            "description": "Complete the entire CBME curriculum",
            "icon": "👑",
            "xp_reward": 10000,
            "rarity": "mythic"
        }
    ]
    
    arena_data["achievements"] = achievements
    
    # Create quest system
    quests = [
        {
            "id": "daily_practice",
            "name": "Daily Practice",
            "description": "Complete 5 competencies today",
            "type": "daily",
            "requirements": {"competencies_count": 5},
            "rewards": {"xp": 100, "coins": 50},
            "icon": "📅"
        },
        {
            "id": "subject_focus",
            "name": "Subject Mastery Sprint",
            "description": "Complete 20 competencies from a single subject",
            "type": "challenge",
            "requirements": {"competencies_count": 20, "same_subject": True},
            "rewards": {"xp": 300, "coins": 150},
            "icon": "🎯"
        },
        {
            "id": "knowledge_explorer",
            "name": "Knowledge Explorer",
            "description": "Complete at least one competency from 5 different subjects",
            "type": "exploration",
            "requirements": {"subjects_count": 5, "min_per_subject": 1},
            "rewards": {"xp": 250, "coins": 100, "badge": "Explorer"},
            "icon": "🗺️"
        }
    ]
    
    arena_data["quests"] = quests
    
    # Create leaderboard categories
    leaderboard_categories = [
        {
            "id": "total_xp",
            "name": "Overall Champion",
            "description": "Total XP earned across all competencies",
            "icon": "👑",
            "reset_period": "never"
        },
        {
            "id": "monthly_progress",
            "name": "Monthly Achiever",
            "description": "Competencies completed this month",
            "icon": "📈",
            "reset_period": "monthly"
        },
        {
            "id": "streak_master",
            "name": "Streak Master",
            "description": "Longest daily learning streak",
            "icon": "🔥",
            "reset_period": "never"
        },
        {
            "id": "subject_specialist",
            "name": "Subject Specialist",
            "description": "Highest competency count in any single subject",
            "icon": "🎯",
            "reset_period": "never"
        }
    ]
    
    arena_data["leaderboard_categories"] = leaderboard_categories
    
    # Create competency tree structure for progressive unlock
    competency_tree = {}
    for comp in all_competencies[:100]:  # Sample first 100 for tree structure
        phase = comp["phase"]
        subject = comp["subject"]
        
        if phase not in competency_tree:
            competency_tree[phase] = {}
        if subject not in competency_tree[phase]:
            competency_tree[phase][subject] = []
            
        tree_node = {
            "id": comp["code"],
            "name": comp["description"][:50] + "..." if len(comp["description"]) > 50 else comp["description"],
            "type": comp["type"],
            "level": comp["level"],
            "xp_value": 20 if comp["level"] == "Must Know" else 15 if comp["level"] == "Should Know" else 10,
            "prerequisites": [],  # Can be populated based on curriculum flow
            "unlocks": []  # Competencies that this one unlocks
        }
        competency_tree[phase][subject].append(tree_node)
    
    arena_data["competency_tree"] = competency_tree
    
    # Add gaming mechanics
    arena_data["game_mechanics"] = {
        "xp_system": {
            "base_xp_per_competency": 10,
            "must_know_multiplier": 2.0,
            "should_know_multiplier": 1.5,
            "nice_to_know_multiplier": 1.0,
            "perfect_score_bonus": 5,
            "streak_bonus_per_day": 2
        },
        "level_system": {
            "xp_per_level": [100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17500],
            "level_titles": [
                "Medical Novice", "Aspiring Doctor", "Clinical Student", 
                "Advanced Learner", "Medical Scholar", "Clinical Expert",
                "Medical Specialist", "Healthcare Master", "Medical Authority", 
                "CBME Champion"
            ]
        },
        "coin_system": {
            "coins_per_competency": 5,
            "daily_bonus": 20,
            "achievement_bonus": 100,
            "uses": ["unlock_hints", "buy_power_ups", "customize_avatar"]
        }
    }
    
    # Save Arena format
    with open('arena_format.json', 'w', encoding='utf-8') as f:
        json.dump(arena_data, f, indent=2, ensure_ascii=False)
    
    print(f"🎮 Arena format created successfully!")
    print(f"   Total competencies: {arena_data['metadata']['total_competencies']}")
    print(f"   Phases: {len(arena_data['phases'])}")
    print(f"   Achievements: {len(arena_data['achievements'])}")
    print(f"   Quests: {len(arena_data['quests'])}")

if __name__ == "__main__":
    create_arena_format()