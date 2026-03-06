#!/usr/bin/env python3
"""
Source Library → Supabase Ingestion Pipeline

Reads markdown chapters from Source Library and generates SQL
INSERT/UPSERT statements for the atoms table.

Usage:
    python scripts/ingest_source_library.py --textbook "Shackelford 9th Ed"
    python scripts/ingest_source_library.py --all --priority
    python scripts/ingest_source_library.py --textbook "Blumgart 7th Ed" --system "Liver"
"""

import os
import re
import json
import yaml
import hashlib
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field, asdict
import unicodedata

# ============================================
# CONFIGURATION
# ============================================

SOURCE_LIBRARY_PATH = Path("/Volumes/Aditya's Ideaverse/03 Spaces/Sarath's Learning System/Source Library")
OUTPUT_PATH = Path.home() / "nucleux-academy" / "supabase" / "seeds"

# Priority textbooks (in order)
PRIORITY_TEXTBOOKS = [
    "Shackelford 9th Ed",
    "Blumgart 7th Ed", 
    "Sleisenger 11th Ed",
    "Fischer Mastery of Surgery 7th Ed",
    "Harrison 22nd Ed",
]

# Textbook metadata mapping
TEXTBOOK_CONFIG = {
    "Shackelford 9th Ed": {
        "specialty": "surgery",
        "full_name": "Shackelford's Surgery of the Alimentary Tract",
        "edition": "9th",
        "systems": {
            "Esophagus": "esophagus",
            "Stomach and Duodenum": "stomach",
            "Small Intestine and Mesentery": "small_intestine",
            "Colon Rectum and Anus": "colon_rectum",
            "Liver": "liver",
            "Biliary Tract and Gallbladder": "biliary",
            "Pancreas": "pancreas",
            "Spleen": "spleen",
            "Abdominal Wall and Hernia": "hernia",
            "Bariatric and Metabolic": "bariatric",
        }
    },
    "Blumgart 7th Ed": {
        "specialty": "surgery",
        "full_name": "Blumgart's Surgery of the Liver, Biliary Tract and Pancreas",
        "edition": "7th",
        "systems": {
            "Part 1": "liver",
            "Part 2": "biliary",
            "Part 3": "pancreas",
            "Liver": "liver",
            "Biliary": "biliary",
            "Pancreas": "pancreas",
        }
    },
    "Sleisenger 11th Ed": {
        "specialty": "medicine",
        "full_name": "Sleisenger and Fordtran's Gastrointestinal and Liver Disease",
        "edition": "11th",
        "systems": {}
    },
    "Fischer Mastery of Surgery 7th Ed": {
        "specialty": "surgery",
        "full_name": "Fischer's Mastery of Surgery",
        "edition": "7th",
        "systems": {}
    },
    "Harrison 22nd Ed": {
        "specialty": "medicine",
        "full_name": "Harrison's Principles of Internal Medicine",
        "edition": "22nd",
        "systems": {}
    },
}

# ============================================
# DATA CLASSES
# ============================================

@dataclass
class Atom:
    """Represents a content atom for the database."""
    title: str
    slug: str
    type: str = "chapter"
    content: Dict[str, Any] = field(default_factory=dict)
    summary: Optional[str] = None
    specialty: str = "surgery"
    system: Optional[str] = None
    topic: str = ""
    subtopic: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    source_type: str = "textbook"
    source_textbook: str = ""
    source_edition: str = ""
    source_chapter: str = ""
    source_page: Optional[str] = None
    difficulty: int = 2
    read_time_minutes: int = 10
    is_premium: bool = False
    is_published: bool = True


# ============================================
# UTILITY FUNCTIONS
# ============================================

def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    # Normalize unicode
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Convert to lowercase and replace spaces/special chars
    text = re.sub(r'[^\w\s-]', '', text.lower())
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text[:100]  # Limit length


def estimate_read_time(content: str) -> int:
    """Estimate reading time in minutes (200 wpm average for medical text)."""
    words = len(content.split())
    return max(1, round(words / 200))


def extract_chapter_number(filename: str) -> Optional[str]:
    """Extract chapter number from filename."""
    match = re.match(r'^(\d+)[\.\s-]', filename)
    if match:
        return match.group(1)
    return None


def extract_summary(content: str, max_length: int = 500) -> str:
    """Extract first paragraph as summary."""
    # Skip headings and find first paragraph
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('---'):
            # Clean up markdown
            summary = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', line)
            summary = re.sub(r'[*_`]', '', summary)
            summary = re.sub(r'<[^>]+>', '', summary)
            if len(summary) > max_length:
                summary = summary[:max_length-3] + '...'
            return summary
    return ""


def parse_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
    """Parse YAML frontmatter from markdown content."""
    frontmatter = {}
    body = content
    
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError:
                pass
            body = parts[2].strip()
    
    return frontmatter, body


def determine_system(folder_name: str, textbook: str) -> str:
    """Determine the anatomical system from folder name."""
    config = TEXTBOOK_CONFIG.get(textbook, {})
    systems = config.get("systems", {})
    
    for key, value in systems.items():
        if key.lower() in folder_name.lower():
            return value
    
    # Fallback mappings
    folder_lower = folder_name.lower()
    if "esoph" in folder_lower:
        return "esophagus"
    elif "liver" in folder_lower or "hepat" in folder_lower:
        return "liver"
    elif "pancrea" in folder_lower:
        return "pancreas"
    elif "bili" in folder_lower or "gallbladder" in folder_lower:
        return "biliary"
    elif "colon" in folder_lower or "rect" in folder_lower:
        return "colon_rectum"
    elif "stomach" in folder_lower or "duoden" in folder_lower or "gastric" in folder_lower:
        return "stomach"
    elif "small" in folder_lower or "intestin" in folder_lower:
        return "small_intestine"
    elif "hernia" in folder_lower or "abdominal wall" in folder_lower:
        return "hernia"
    elif "spleen" in folder_lower:
        return "spleen"
    elif "bariatric" in folder_lower:
        return "bariatric"
    
    return "general"


def extract_topic_from_title(title: str) -> str:
    """Extract main topic from chapter title."""
    # Remove common prefixes/suffixes
    topic = re.sub(r'^(Chapter\s+)?\d+[\.\s:-]+', '', title)
    topic = re.sub(r'\s*-\s*ClinicalKey$', '', topic)
    topic = re.sub(r'\s*\([^)]+\)\s*$', '', topic)
    return topic.strip()


# ============================================
# INGESTION FUNCTIONS
# ============================================

def process_chapter(file_path: Path, textbook: str, system_folder: str) -> Optional[Atom]:
    """Process a single markdown chapter file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  ⚠️ Error reading {file_path.name}: {e}")
        return None
    
    # Parse frontmatter
    frontmatter, body = parse_frontmatter(content)
    
    # Extract metadata
    title = frontmatter.get('title', file_path.stem)
    title = extract_topic_from_title(title)
    
    chapter_num = frontmatter.get('Chapter Number') or extract_chapter_number(file_path.name)
    
    # Get textbook config
    config = TEXTBOOK_CONFIG.get(textbook, {})
    
    # Build tags
    tags = frontmatter.get('tags', [])
    if isinstance(tags, str):
        tags = [tags]
    
    # Create atom
    atom = Atom(
        title=title,
        slug=slugify(f"{textbook}-{chapter_num or ''}-{title}"),
        type="chapter",
        content={
            "markdown": body,
            "version": "1.0",
            "source_file": file_path.name,
        },
        summary=extract_summary(body),
        specialty=config.get("specialty", "surgery"),
        system=determine_system(system_folder, textbook),
        topic=system_folder,
        subtopic=title,
        tags=tags[:10],  # Limit tags
        source_type="textbook",
        source_textbook=config.get("full_name", textbook),
        source_edition=config.get("edition", ""),
        source_chapter=str(chapter_num) if chapter_num else "",
        source_page=frontmatter.get("Page Numbers"),
        difficulty=2,
        read_time_minutes=estimate_read_time(body),
        is_premium=False,
        is_published=True,
    )
    
    return atom


def process_textbook(textbook_name: str, system_filter: Optional[str] = None) -> List[Atom]:
    """Process all chapters from a textbook."""
    textbook_path = SOURCE_LIBRARY_PATH / textbook_name
    
    if not textbook_path.exists():
        print(f"❌ Textbook not found: {textbook_name}")
        return []
    
    atoms = []
    print(f"\n📚 Processing: {textbook_name}")
    
    # Find all markdown files
    for item in textbook_path.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            # This is a system/section folder
            system_folder = item.name
            
            # Apply system filter if specified
            if system_filter and system_filter.lower() not in system_folder.lower():
                continue
            
            print(f"  📂 {system_folder}")
            
            md_files = list(item.glob("*.md"))
            for md_file in sorted(md_files):
                atom = process_chapter(md_file, textbook_name, system_folder)
                if atom:
                    atoms.append(atom)
                    print(f"    ✓ {atom.title[:50]}...")
    
    print(f"  📊 Total atoms: {len(atoms)}")
    return atoms


# ============================================
# SQL GENERATION
# ============================================

def escape_sql_string(s: Any) -> str:
    """Escape string for SQL."""
    if s is None:
        return "NULL"
    # Handle lists by joining
    if isinstance(s, list):
        s = ", ".join(str(x) for x in s)
    s = str(s)
    return "'" + s.replace("'", "''") + "'"


def escape_sql_array(arr: List[str]) -> str:
    """Convert Python list to PostgreSQL array literal."""
    if not arr:
        return "ARRAY[]::TEXT[]"
    escaped = [s.replace("'", "''") for s in arr]
    return "ARRAY[" + ", ".join(f"'{s}'" for s in escaped) + "]"


def atom_to_sql_values(atom: Atom) -> str:
    """Convert an Atom to SQL VALUES clause."""
    content_json = json.dumps(atom.content).replace("'", "''")
    
    values = [
        escape_sql_string(atom.title),
        escape_sql_string(atom.slug),
        escape_sql_string(atom.type),
        f"'{content_json}'::jsonb",
        escape_sql_string(atom.summary),
        escape_sql_string(atom.specialty),
        escape_sql_string(atom.system),
        escape_sql_string(atom.topic),
        escape_sql_string(atom.subtopic),
        escape_sql_array(atom.tags),
        escape_sql_string(atom.source_type),
        escape_sql_string(atom.source_textbook),
        escape_sql_string(atom.source_edition),
        escape_sql_string(atom.source_chapter),
        escape_sql_string(atom.source_page) if atom.source_page else "NULL",
        str(atom.difficulty),
        str(atom.read_time_minutes),
        "FALSE" if not atom.is_premium else "TRUE",
        "TRUE" if atom.is_published else "FALSE",
    ]
    
    return "(" + ", ".join(values) + ")"


def generate_sql(atoms: List[Atom], textbook_name: str) -> str:
    """Generate SQL INSERT/UPSERT statements."""
    if not atoms:
        return "-- No atoms to insert\n"
    
    sql_parts = [
        f"-- Source Library Ingestion: {textbook_name}",
        f"-- Generated: {datetime.now().isoformat()}",
        f"-- Total atoms: {len(atoms)}",
        "",
        "-- Insert atoms (upsert on slug conflict)",
        "INSERT INTO atoms (",
        "  title, slug, type, content, summary,",
        "  specialty, system, topic, subtopic, tags,",
        "  source_type, source_textbook, source_edition, source_chapter, source_page,",
        "  difficulty, read_time_minutes, is_premium, is_published",
        ") VALUES",
    ]
    
    # Add values
    values = []
    for atom in atoms:
        values.append(atom_to_sql_values(atom))
    
    sql_parts.append(",\n".join(values))
    
    # Add conflict handling
    sql_parts.append("""
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  summary = EXCLUDED.summary,
  tags = EXCLUDED.tags,
  read_time_minutes = EXCLUDED.read_time_minutes,
  updated_at = NOW();
""")
    
    return "\n".join(sql_parts)


def save_sql(sql: str, textbook_name: str) -> Path:
    """Save SQL to file."""
    OUTPUT_PATH.mkdir(parents=True, exist_ok=True)
    
    filename = f"seed_{slugify(textbook_name)}.sql"
    filepath = OUTPUT_PATH / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(sql)
    
    return filepath


# ============================================
# MAIN
# ============================================

def main():
    parser = argparse.ArgumentParser(description="Ingest Source Library to Supabase")
    parser.add_argument("--textbook", "-t", help="Specific textbook to process")
    parser.add_argument("--system", "-s", help="Filter by system/section (e.g., 'Esophagus')")
    parser.add_argument("--all", "-a", action="store_true", help="Process all textbooks")
    parser.add_argument("--priority", "-p", action="store_true", help="Process priority textbooks only")
    parser.add_argument("--dry-run", "-d", action="store_true", help="Don't write SQL files")
    parser.add_argument("--list", "-l", action="store_true", help="List available textbooks")
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("🔄 Source Library → Supabase Ingestion Pipeline")
    print("=" * 60)
    
    # List textbooks
    if args.list:
        print("\n📚 Available textbooks:")
        for item in sorted(SOURCE_LIBRARY_PATH.iterdir()):
            if item.is_dir() and not item.name.startswith('.'):
                md_count = len(list(item.rglob("*.md")))
                priority = "⭐" if item.name in PRIORITY_TEXTBOOKS else ""
                print(f"  {priority} {item.name} ({md_count} chapters)")
        return
    
    # Determine which textbooks to process
    textbooks_to_process = []
    
    if args.textbook:
        textbooks_to_process = [args.textbook]
    elif args.priority:
        textbooks_to_process = PRIORITY_TEXTBOOKS
    elif args.all:
        textbooks_to_process = [
            d.name for d in SOURCE_LIBRARY_PATH.iterdir()
            if d.is_dir() and not d.name.startswith('.')
        ]
    else:
        parser.print_help()
        return
    
    # Process textbooks
    all_atoms = []
    for textbook in textbooks_to_process:
        atoms = process_textbook(textbook, args.system)
        all_atoms.extend(atoms)
        
        if atoms and not args.dry_run:
            sql = generate_sql(atoms, textbook)
            filepath = save_sql(sql, textbook)
            print(f"  💾 Saved: {filepath}")
    
    # Summary
    print("\n" + "=" * 60)
    print(f"✅ Total atoms processed: {len(all_atoms)}")
    print(f"📁 Output directory: {OUTPUT_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    main()
