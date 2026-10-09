#!/usr/bin/env bash
# Publishes the production build to https://www.yeeeai.com/ on this server (189.24.79.181, Hong Kong, BT panel nginx).
# nginx (/www/server/panel/vhost/nginx/yeeeai.com.conf) serves /www/wwwroot/yeeeai.com/current, a symlink to a
# timestamped release, so switching the link publishes or rolls back without reloading nginx.
#   scripts/deploy.sh             build, test and publish a new release
#   scripts/deploy.sh --rollback  point the link at the previous release
# Each release is built from a clean, committed tree, records its commit in version.json and gets a
# `release-<timestamp>` Git tag. Every sitemap route is checked after the switch; any failure rolls back.
# The checks go to this server directly (curl --resolve), so they work whatever DNS or Cloudflare is doing.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="/root/.local/node/bin:$PATH" # Non-interactive shells do not load the profile that adds node.
root=/www/wwwroot/yeeeai.com
releases=$root/releases
link=$root/current
host=www.yeeeai.com
origin=https://$host
keep=5

if [[ "${1:-}" == "--rollback" ]]; then
  current=$(readlink -f "$link")
  previous=$(ls -d "$releases"/yi-ai-site-* | sort | grep -B1 -x "$current" | head -1)
  [[ -n "$previous" && "$previous" != "$current" ]] || { echo "No previous release" >&2; exit 1; }
  ln -sfn "$previous" "$link"
  echo "Rolled back to $previous"
  exit 0
fi

[[ -z "$(git status --porcelain)" ]] || { echo "Commit or stash changes first; a release must match a commit." >&2; exit 1; }
commit=$(git rev-parse HEAD)
stamp=$(date +%Y%m%d%H%M%S)

pnpm build:production
pnpm test:production
target="$releases/yi-ai-site-$stamp"
mkdir -p "$target"
cp -a dist/. "$target/"
rm -f "$target/_headers" # Host headers live in nginx.
printf '{"release":"yi-ai-site-%s","commit":"%s","branch":"%s","builtAt":"%s"}\n' \
  "$stamp" "$commit" "$(git branch --show-current)" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >"$target/version.json"
chown -R www:www "$target" 2>/dev/null || true

previous=$(readlink -f "$link" 2>/dev/null || true)
ln -sfn "$target" "$link"
failed=0
for url in "$origin/version.json" $(grep -o '<loc>[^<]*' "$target/sitemap.xml" | cut -c6-); do
  curl -fsS -k -o /dev/null --resolve "$host:443:127.0.0.1" -A 'Mozilla/5.0 deploy-check' "$url" ||
    { echo "FAILED $url" >&2; failed=1; }
done
if ((failed)); then
  if [[ -n "$previous" && -d "$previous" ]]; then ln -sfn "$previous" "$link"; else rm -f "$link"; fi
  rm -rf "$target"
  echo "Post-publish check failed; restored ${previous:-nothing}" >&2
  exit 1
fi
git tag -a "release-$stamp" -m "Published to $origin/ as yi-ai-site-$stamp" "$commit"

# Keep the newest releases; the live one is always among them.
ls -d "$releases"/yi-ai-site-* | sort | head -n -"$keep" | while read -r old; do
  [[ "$old" == "$target" ]] || rm -rf "$old"
done
echo "Published $target ($commit), tagged release-$stamp"
echo "Run 'pnpm build' again before local preview tests; dist now holds the production build."
