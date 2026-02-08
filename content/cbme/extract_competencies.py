#!/usr/bin/env python3
"""
Extract CBME competencies from NMC curriculum documents
"""
import re
import json
import os
from collections import defaultdict

def extract_competencies_from_text(text_file, phase_mapping=None):
    """Extract competencies from a text file"""
    competencies = []
    
    with open(text_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Define subject code patterns
    subject_patterns = {
        'AN': 'Anatomy',
        'PY': 'Physiology', 
        'BI': 'Biochemistry',
        'PA': 'Pathology',
        'PH': 'Pharmacology',
        'MI': 'Microbiology',
        'FM': 'Forensic Medicine',
        'CM': 'Community Medicine',
        'EN': 'ENT',
        'OP': 'Ophthalmology',
        'OR': 'Orthopedics',
        'DE': 'Dermatology',
        'PS': 'Psychiatry',
        'RD': 'Radiodiagnosis',
        'IM': 'Medicine',
        'SU': 'Surgery',
        'OG': 'OBG',
        'PE': 'Pediatrics',
        'EM': 'Emergency Medicine'
    }
    
    # Phase mapping based on typical MBBS curriculum
    phase_map = {
        'AN': 'Phase-1', 'PY': 'Phase-1', 'BI': 'Phase-1',
        'PA': 'Phase-2', 'PH': 'Phase-2', 'MI': 'Phase-2', 'FM': 'Phase-2',
        'CM': 'Phase-2', 'EN': 'Phase-3A', 'OP': 'Phase-3A', 'OR': 'Phase-3A',
        'DE': 'Phase-3A', 'PS': 'Phase-3A', 'RD': 'Phase-3A',
        'IM': 'Phase-3B', 'SU': 'Phase-3B', 'OG': 'Phase-3B', 'PE': 'Phase-3B', 'EM': 'Phase-3B'
    }
    
    # Pattern to match competency codes
    comp_pattern = r'([A-Z]{2})(\d+)\.(\d+)'
    
    lines = content.split('\n')
    current_competency = None
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Check if line is a competency code
        match = re.match(comp_pattern, line)
        if match:
            subject_code = match.group(1)
            if subject_code in subject_patterns:
                current_competency = {
                    'code': line,
                    'subject': subject_patterns[subject_code],
                    'phase': phase_map.get(subject_code, 'Unknown'),
                    'description': '',
                    'type': 'K',  # Default to Knowledge
                    'level': 'Must Know',  # Default
                    'domain': 'Cognitive',  # Default
                    'core': True,
                    'integration': []
                }
                
                # Try to get description from next few lines
                desc_lines = []
                for j in range(1, 10):  # Look ahead up to 10 lines
                    if i + j < len(lines):
                        next_line = lines[i + j].strip()
                        if next_line and not re.match(comp_pattern, next_line):
                            if not next_line.lower().startswith(('number of', 'assessment', 'written', 'viva', 'observe', 'demonstrate')):
                                desc_lines.append(next_line)
                            else:
                                break
                        else:
                            break
                
                current_competency['description'] = ' '.join(desc_lines[:3])  # Take first 3 description lines
                
                # Determine competency type based on keywords
                desc_lower = current_competency['description'].lower()
                if any(word in desc_lower for word in ['demonstrate', 'perform', 'conduct', 'examine']):
                    current_competency['type'] = 'S'  # Skill
                elif any(word in desc_lower for word in ['counsel', 'communicate', 'interact']):
                    current_competency['type'] = 'C'  # Communication
                elif any(word in desc_lower for word in ['attitude', 'empathy', 'ethical']):
                    current_competency['type'] = 'A'  # Attitude
                
                competencies.append(current_competency)
    
    return competencies

def organize_by_subject_and_phase(competencies):
    """Organize competencies by subject and phase"""
    organized = defaultdict(lambda: defaultdict(list))
    
    for comp in competencies:
        phase = comp['phase']
        subject = comp['subject']
        organized[phase][subject].append(comp)
    
    return organized

def create_directory_structure(base_dir, organized_comps):
    """Create directory structure and files"""
    for phase, subjects in organized_comps.items():
        phase_dir = os.path.join(base_dir, phase)
        os.makedirs(phase_dir, exist_ok=True)
        
        for subject, comps in subjects.items():
            subject_dir = os.path.join(phase_dir, subject.replace(' ', '-'))
            os.makedirs(subject_dir, exist_ok=True)
            
            # Create competencies.json
            json_file = os.path.join(subject_dir, 'competencies.json')
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(comps, f, indent=2, ensure_ascii=False)
            
            # Create competencies.md
            md_file = os.path.join(subject_dir, 'competencies.md')
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(f"# {subject} Competencies\n\n")
                f.write(f"**Phase:** {phase}\n")
                f.write(f"**Total Competencies:** {len(comps)}\n\n")
                
                for comp in comps:
                    f.write(f"## {comp['code']}\n\n")
                    f.write(f"**Description:** {comp['description']}\n\n")
                    f.write(f"- **Type:** {comp['type']}\n")
                    f.write(f"- **Level:** {comp['level']}\n")
                    f.write(f"- **Domain:** {comp['domain']}\n")
                    f.write(f"- **Core:** {comp['core']}\n\n")

def main():
    # Extract from all volumes
    all_competencies = []
    
    text_files = ['vol1_text.txt', 'vol2_text.txt', 'vol3_text.txt']
    
    for text_file in text_files:
        if os.path.exists(text_file):
            comps = extract_competencies_from_text(text_file)
            all_competencies.extend(comps)
            print(f"Extracted {len(comps)} competencies from {text_file}")
    
    print(f"Total competencies extracted: {len(all_competencies)}")
    
    # Organize by subject and phase
    organized = organize_by_subject_and_phase(all_competencies)
    
    # Create directory structure
    create_directory_structure('.', organized)
    
    # Create overall index.json
    with open('index.json', 'w', encoding='utf-8') as f:
        json.dump(all_competencies, f, indent=2, ensure_ascii=False)
    
    # Create summary stats
    stats = defaultdict(lambda: defaultdict(int))
    for comp in all_competencies:
        stats[comp['phase']][comp['subject']] += 1
    
    with open('summary_stats.json', 'w', encoding='utf-8') as f:
        json.dump(dict(stats), f, indent=2, ensure_ascii=False)
    
    print("✅ CBME competencies extracted and organized successfully!")

if __name__ == "__main__":
    main()