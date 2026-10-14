#!/usr/bin/env bash
#
# Adequate Safaris — Joomla 5 setup automation (local installation)
# Installs/updates the custom template, plugins and modules against a local
# Joomla 5 webroot, then runs extension discovery and enablement via the
# Joomla CLI.
#
# Usage:
#     JOOMLA_SITE_ROOT=/var/www/joomla bash joomla-site/setup/install.sh
#
# Env overrides:
#     JOOMLA_SITE_ROOT  Joomla webroot         (default: /var/www/joomla)
#     PHP_BIN           PHP binary to use      (default: php)
#
set -euo pipefail

SITE_ROOT="${JOOMLA_SITE_ROOT:-/var/www/joomla}"
PHP_BIN="${PHP_BIN:-php}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SRC_ROOT="$REPO_ROOT/joomla-site"

info()  { printf '\033[1;34m▸ %s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m! %s\033[0m\n' "$*"; }
die()   { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# ── 0. Sanity checks ────────────────────────────────────────────────
[ -d "$SITE_ROOT" ] || die "Joomla site root not found: $SITE_ROOT (set JOOMLA_SITE_ROOT)"
[ -f "$SITE_ROOT/cli/joomla.php" ] || die "Not a Joomla 5 install (missing $SITE_ROOT/cli/joomla.php)"
[ -d "$SRC_ROOT" ] || die "Source extensions not found: $SRC_ROOT"

jc() { "$PHP_BIN" "$SITE_ROOT/cli/joomla.php" "$@"; }

# Sync a directory tree into a Joomla destination (rsync preferred).
sync_dir() {
    local src="$1" dst="$2"
    [ -d "$src" ] || { warn "Skipping missing source: $src"; return 0; }
    mkdir -p "$dst"
    if command -v rsync >/dev/null 2>&1; then
        rsync -a --delete "$src/" "$dst/"
    else
        rm -rf "${dst:?}/"*
        cp -R "$src/." "$dst/"
    fi
}

# ── 1. Template ─────────────────────────────────────────────────────
info "Installing template: adequate"
sync_dir "$SRC_ROOT/templates/adequate" "$SITE_ROOT/templates/adequate"
ok "Template files copied"

# ── 2. Plugins ──────────────────────────────────────────────────────
info "Installing system plugin: jwt"
sync_dir "$SRC_ROOT/plugins/system/jwt" "$SITE_ROOT/plugins/system/jwt"

info "Installing content plugin: api_sync"
sync_dir "$SRC_ROOT/plugins/content/api_sync" "$SITE_ROOT/plugins/content/api_sync"

info "Discovering extensions"
jc extension:discover >/dev/null 2>&1 || true
ok "Plugins copied"

# ── 3. Modules ──────────────────────────────────────────────────────
info "Installing module: mod_safari_search"
sync_dir "$SRC_ROOT/modules/mod_safari_search" "$SITE_ROOT/modules/mod_safari_search"

info "Installing module: mod_adq_hero"
sync_dir "$SRC_ROOT/modules/mod_adq_hero" "$SITE_ROOT/modules/mod_adq_hero"
ok "Modules copied"

# ── 4. Ownership / permissions (only when running as root) ──────────
if [ "$(id -u)" -eq 0 ]; then
    if id www-data >/dev/null 2>&1; then
        info "Setting ownership to www-data"
        chown -R www-data:www-data \
            "$SITE_ROOT/templates/adequate" \
            "$SITE_ROOT/plugins/system/jwt" \
            "$SITE_ROOT/plugins/content/api_sync" \
            "$SITE_ROOT/modules/mod_safari_search" \
            "$SITE_ROOT/modules/mod_adq_hero"
    else
        warn "Running as root but 'www-data' user does not exist — skipping chown."
    fi
else
    warn "Not running as root — skipping ownership/permission changes."
fi

# ── 5. Enable extensions via CLI ────────────────────────────────────
info "Enabling extensions"
jc extension:enable system --option=jwt            2>/dev/null || warn "enable jwt failed (discover manually)"
jc extension:enable content --option=api_sync      2>/dev/null || warn "enable api_sync failed (discover manually)"
jc extension:discover                              2>/dev/null || true

# ── 6. Set the default site template ────────────────────────────────
info "Setting default template"
jc template:set --template=adequate --client=site 2>/dev/null || \
    warn "Could not set template automatically — set it in System → Templates."

# ── 7. Custom fields ────────────────────────────────────────────────
info "Custom fields definition at joomla-site/setup/safari-fields.xml"
echo "    Import via: System → Fields, or the API seeder (api/prisma/seed.ts)."

# ── 8. Cache clean ──────────────────────────────────────────────────
jc cache:clean 2>/dev/null || true

ok "Joomla setup complete."
echo
echo "Next steps:"
echo "  1. Log in to /administrator and confirm no extension warnings."
echo "  2. System → Templates → adequate → set colours, logo, micro-app URLs."
echo "  3. System → Plugins → 'System - ADQ JWT Bridge' → set signing secret"
echo "     to match JWT_SECRET in .env."
echo "  4. System → Plugins → 'Content - ADQ API Sync' → set API URL + token."
echo "  5. Import safari-fields.xml (System → Fields) and create the Safari category."
