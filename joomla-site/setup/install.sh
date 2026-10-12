#!/usr/bin/env bash
#
# Absolute Adventure Safaris — Joomla 5 setup automation
# Installs/updates the custom template, plugins, module, custom fields and
# languages against a running (dockerized) Joomla 5 instance.
#
# Usage:  bash joomla-site/setup/install.sh
# Env:    JOOMLA_CONTAINER (default: aas-joomla)
#
set -euo pipefail

CONTAINER="${JOOMLA_CONTAINER:-aas-joomla}"
SITE_ROOT="/var/www/html"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

info()  { printf '\033[1;34m▸ %s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m! %s\033[0m\n' "$*"; }

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
    warn "Container '$CONTAINER' is not running. Start it with:"
    echo "    docker compose -f docker/docker-compose.yml up -d joomla"
    exit 1
fi

jc() { docker exec -u www-data "$CONTAINER" php "$SITE_ROOT/cli/joomla.php" "$@"; }
jcp() { docker exec "$CONTAINER" "$@"; }

# ── 1. Template ─────────────────────────────────────────────────────
info "Installing template: absolute"
jcp mkdir -p "$SITE_ROOT/templates/absolute"
docker cp "$REPO_ROOT/joomla-site/templates/absolute/." "$CONTAINER:$SITE_ROOT/templates/absolute/"
ok "Template files copied"

# ── 2. Plugins ──────────────────────────────────────────────────────
info "Installing system plugin: jwt"
jcp mkdir -p "$SITE_ROOT/plugins/system/jwt"
docker cp "$REPO_ROOT/joomla-site/plugins/system/jwt/." "$CONTAINER:$SITE_ROOT/plugins/system/jwt/"

info "Installing content plugin: api_sync"
jcp mkdir -p "$SITE_ROOT/plugins/content/api_sync"
docker cp "$REPO_ROOT/joomla-site/plugins/content/api_sync/." "$CONTAINER:$SITE_ROOT/plugins/content/api_sync/"

info "Discovering extensions"
jc extension:discover >/dev/null 2>&1 || true
ok "Plugins copied"

# ── 3. Module ───────────────────────────────────────────────────────
info "Installing module: mod_safari_search"
jcp mkdir -p "$SITE_ROOT/modules/mod_safari_search"
docker cp "$REPO_ROOT/joomla-site/modules/mod_safari_search/." "$CONTAINER:$SITE_ROOT/modules/mod_safari_search/"
ok "Module copied"

# ── 4. Enable extensions via CLI ────────────────────────────────────
info "Enabling extensions"
jc extension:enable system --option=jwt            2>/dev/null || warn "enable jwt failed (discover manually)"
jc extension:enable content --option=api_sync      2>/dev/null || warn "enable api_sync failed (discover manually)"
jc extension:discover                              2>/dev/null || true

# ── 5. Set the default site template ────────────────────────────────
info "Setting default template"
jc template:set --template=absolute --client=site 2>/dev/null || \
    warn "Could not set template automatically — set it in System → Templates."

# ── 6. Custom fields ────────────────────────────────────────────────
info "Custom fields definition at joomla-site/setup/safari-fields.xml"
echo "    Import via: System → Fields, or the API seeder (api/prisma/seed.ts)."

# ── 7. Cache clean ──────────────────────────────────────────────────
jc cache:clean 2>/dev/null || true

ok "Joomla setup complete."
echo
echo "Next steps:"
echo "  1. Log in to /administrator and confirm no extension warnings."
echo "  2. System → Templates → absolute → set colours, logo, micro-app URLs."
echo "  3. System → Plugins → 'System - AAS JWT Bridge' → set signing secret"
echo "     to match JWT_SECRET in .env."
echo "  4. System → Plugins → 'Content - AAS API Sync' → set API URL + token."
echo "  5. Import safari-fields.xml (System → Fields) and create the Safari category."