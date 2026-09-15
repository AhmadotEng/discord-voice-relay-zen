#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
version=$(sed -n 's/^[[:space:]]*"version": "\([^"]*\)",*$/\1/p' "$project_dir/manifest.json")

if [ -z "$version" ]; then
  echo "Could not read the extension version from manifest.json" >&2
  exit 1
fi

output_dir="$project_dir/dist"
filename="discord-voice-relay-zen-$version.xpi"
output="$output_dir/$filename"
temporary="$output_dir/.discord-voice-relay-zen-$version.tmp.xpi"

mkdir -p "$output_dir"
rm -f "$temporary"

cd "$project_dir"
zip -X -q "$temporary" \
  manifest.json \
  src/relay-config.js \
  src/page-hook.js \
  src/bridge.js \
  popup/popup.html \
  popup/popup.css \
  popup/popup.js \
  icons/icon.svg \
  LICENSE \
  PRIVACY.md \
  README.md

mv "$temporary" "$output"
(cd "$output_dir" && shasum -a 256 "$filename" > "$filename.sha256")
echo "Built $output"
