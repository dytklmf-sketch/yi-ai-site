#!/usr/bin/env bash
# Publishes the production build to https://ccg-cli.online/yi_ai/ on this server.
# nginx (snippets/yi-ai-site.conf) serves /var/www/yi_ai, a symlink to a timestamped release,
# so switching the link publishes or rolls back without reloading nginx.
#   scripts/deploy-ccg.sh             build, test and publish a new release
#   scripts/deploy-ccg.sh --rollback  point the link at the previous release
set -euo pipefail
cd "$(dirname "$0")/.."
releases=/var/www/releases
link=/var/www/yi_ai

if [[ "${1:-}" == "--rollback" ]]; then
  current=$(readlink -f "$link")
  previous=$(ls -d "$releases"/yi-ai-site-* | grep -vx "$current" | sort | tail -1)
  [[ -n "$previous" ]] || { echo "No previous release" >&2; exit 1; }
  ln -sfn "$previous" "$link"
  echo "Rolled back to $previous"
  exit 0
fi

pnpm build:production
pnpm test:production
target="$releases/yi-ai-site-$(date +%Y%m%d%H%M%S)"
mkdir -p "$target"
cp -a dist/. "$target/"
rm -f "$target/_headers" # Host headers live in nginx.
ln -sfn "$target" "$link"
curl -fsS -o /dev/null -A 'Mozilla/5.0 deploy-check' https://ccg-cli.online/yi_ai/zh/
echo "Published $target"
echo "Run 'pnpm build' again before local preview tests; dist now holds the /yi_ai build."
