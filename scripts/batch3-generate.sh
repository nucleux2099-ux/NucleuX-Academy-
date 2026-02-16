#!/bin/bash
set -euo pipefail

# Batch 3 content generation script
BASE="/Users/adityachandrabhatla/nucleux-academy/content/medicine"

# Helper: write _meta.yaml
write_meta() {
  local dir="$1" title="$2" slug="$3" highYield="$4" nmc_code="$5" nmc_text="$6" domain="$7"
  shift 7
  local prereqs=("$@")
  
  cat > "$dir/_meta.yaml" << YAML
title: "${title}"
slug: ${slug}
depth: "UG"
highYield: ${highYield}
nmc_codes:
  - "${nmc_code}"
prerequisites:
$(for p in "${prereqs[@]:-}"; do [ -n "$p" ] && echo "  - \"$p\""; done)
related_topics: []
enrichment:
  nmcCodes:
    - code: "${nmc_code}"
      text: "${nmc_text}"
      domain: "${domain}"
  prerequisite_details: []
  related_details: []
YAML
}

echo "Script ready - use node script instead"
