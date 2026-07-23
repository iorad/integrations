#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$script_dir"

zendesk_build_dir="$(mktemp -d /tmp/iorad-zendesk-app.XXXXXX)"
zendesk_zip="$zendesk_build_dir/app.zip"
trap 'rm -rf "$zendesk_build_dir"' EXIT

zip -r "$zendesk_zip" \
  translations \
  app.css \
  lib \
  assets \
  README.md \
  templates \
  manifest.json \
  app.js

mv "$zendesk_zip" dist/app.zip
