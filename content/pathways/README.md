# NucleuX Academy Learning Pathways

Learning pathways are structured educational journeys that combine CBME competencies, library topics, and textbook references to create comprehensive learning experiences with Arena-style progression.

## Structure

```
pathways/
├── README.md              # This file - how pathways work
├── schema.json            # JSON schema validation for pathways
├── mbbs/                  # MBBS degree pathways
│   ├── index.json         # All MBBS pathways catalog
│   ├── phase-1/           # Pre-clinical phase
│   ├── phase-2/           # Para-clinical phase
│   └── phase-3a/          # Clinical phase
└── skills/                # Cross-cutting clinical skills
    ├── clinical-examination.json
    ├── procedures.json
    └── communication.json
```

## How Pathways Work

### 1. **Competency-Driven**
Each pathway maps to specific CBME competencies, ensuring medical education standards are met while providing engaging learning experiences.

### 2. **Progressive Learning Steps**
Pathways break complex topics into digestible steps:
- **Reading**: Library topic exploration with specific sections
- **Quiz**: Knowledge checkpoints with MCQs
- **Skill**: Practical demonstrations and assessments
- **Case**: Clinical application scenarios
- **Integration**: Cross-system connections

### 3. **Arena Leveling System**
- **XP Points**: Earned through step completion
- **Unlocks**: Prerequisites and progression gates
- **Achievements**: Milestone recognition
- **Difficulty Scaling**: From basic concepts to advanced applications

### 4. **Multi-Modal Learning**
- **Library Topics**: In-depth conceptual content
- **Textbook References**: Authoritative source material
- **Retrieval Cards**: Spaced repetition for retention
- **Clinical Cases**: Real-world application
- **Skills Videos**: Procedural demonstrations

### 5. **Adaptive Pathways**
- **Prerequisites**: Ensures foundational knowledge
- **Branching**: Multiple learning routes based on interests
- **Remediation**: Support for struggling learners
- **Acceleration**: Advanced tracks for quick learners

## Pathway JSON Format

```json
{
  "id": "unique-pathway-identifier",
  "title": "Human-readable pathway name",
  "phase": "Phase-1|Phase-2|Phase-3A|Phase-3B",
  "subject": "Anatomy|Physiology|Biochemistry|etc",
  "description": "Comprehensive description of learning outcomes",
  "competencies": ["CBME.code.1", "CBME.code.2"],
  "prerequisites": ["prerequisite-pathway-id"],
  "steps": [
    {
      "order": 1,
      "type": "reading|quiz|skill|case|integration",
      "title": "Step title",
      "libraryTopic": "topic-id-from-library",
      "sections": ["specific", "sections"],
      "duration": "estimated-time",
      "xp": "experience-points",
      "competency": "specific-competency-if-applicable"
    }
  ],
  "totalXP": "sum-of-all-step-xp",
  "estimatedTime": "total-estimated-completion-time",
  "unlocks": ["pathway-ids-this-unlocks"],
  "textbooks": [
    {"title": "Textbook Name", "chapters": ["Chapter 1", "Chapter 2"]}
  ],
  "tags": ["high-yield", "neet-pg", "usmle"],
  "difficulty": 1-5,
  "lastUpdated": "2024-02-08"
}
```

## Implementation Guidelines

### For Pathway Creators

1. **Start with Competencies**: Always map to official CBME competencies
2. **Check Existing Topics**: Use available library topics before creating new ones
3. **Balance Steps**: Mix different learning modalities (reading, quiz, skill)
4. **Set Realistic XP**: Base points on actual effort and complexity
5. **Link Textbooks**: Always include authoritative references
6. **Test Prerequisites**: Ensure logical learning progression

### For Developers

1. **Validate Schema**: All pathway JSONs must pass schema validation
2. **Check Dependencies**: Verify library topics and competencies exist
3. **Update Index**: Add new pathways to appropriate index files
4. **Cache Friendly**: Structure allows for efficient caching and updates

### For Students

1. **Follow Prerequisites**: Complete required pathways before unlocking new ones
2. **Engage Actively**: Don't skip quizzes and skills assessments
3. **Use Textbooks**: Complement pathway content with textbook reading
4. **Track Progress**: Monitor XP accumulation and pathway completion

## Quality Assurance

- **Medical Accuracy**: All content reviewed by subject matter experts
- **Competency Alignment**: Regular audits against CBME updates
- **Student Feedback**: Continuous improvement based on learner experiences
- **Performance Analytics**: Data-driven pathway optimization

## Future Enhancements

- **Adaptive Difficulty**: AI-powered difficulty adjustment
- **Peer Learning**: Collaborative pathway completion
- **VR Integration**: Immersive anatomy and clinical skills
- **Global Variants**: Pathways for different medical education systems