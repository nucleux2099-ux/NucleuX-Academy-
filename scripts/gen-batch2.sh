#!/bin/bash
# Just lists what needs to be done
cd /Users/adityachandrabhatla/nucleux-academy
echo "Topics needing explorer.md:"
for dir in content/medicine/{neurology,endocrinology,hematology,rheumatology}/*/; do
  [ ! -f "$dir/explorer.md" ] && echo "  $dir"
done
echo ""
echo "Topics needing exam-prep.md:"
for dir in content/medicine/{neurology,endocrinology,hematology,rheumatology}/*/; do
  [ ! -f "$dir/exam-prep.md" ] && echo "  $dir"
done
