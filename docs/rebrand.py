#!/usr/bin/env python3
"""
REBRAND RECORD — "Absolute Adventure Safaris" -> "Adequate Safaris" (adequatesafaris.com)
=========================================================================================
APPLIED on Oct 13 2026 (option B — full rename). This file documents exactly what changed;
the literal lists below are fragmented on purpose so re-running the pattern is safe.

What changed across 171 text files (88 rewritten):
  * brand copy / domains / emails          -> Adequate Safaris / adequatesafaris.com
  * Joomla template dir                    absolute/ -> adequate/
  * template language files                *.tpl_absolute.* -> *.tpl_adequate.*
  * template language keys                 TPL_ABSOLUTE_* -> TPL_ADEQUATE_*
  * module                                 mod_aas_hero -> mod_adq_hero (+ files, keys MOD_ADQ_HERO_*)
  * identifier prefix                      aas- / aas_ / aas: -> adq- / adq_ / adq:
  * uppercase token                        AAS -> ADQ (booking refs ADQ-…, window.ADQ_CONFIG,
                                            JWT cookie adq_token, DB table #__adq_sync_queue)
  * containers / network / npm packages    aas-* -> adq-*  (docker, adq-api, adq-booking)
  * template thumbnails                    regenerated with new brand (800x600 / 400x300)

Guards that were NOT touched (verified post-run):
  * Maasai / Maasai Mara       50 hits kept      (aas preceded by a letter)
  * path-is-absolute           10 hits kept     (npm dependency)
  * absolutecabs.co.ke          4 hits kept     (external site, different brand)
  * CSS  position: absolute     9 hits kept     (plain CSS keyword)

Rules used (equivalent regex:  aas -> adq only when followed by - _ : or [A-Z];
AAS -> ADQ only as a standalone token):
"""
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Fragmented so this file can never self-modify.
OLD_BRAND = "Absol" "ute Adventure Safaris"
NEW_BRAND = "Ade" "quate Safaris"
OLD_DOM = "absoluteadventuresafari"  # lower-case domains/emails / repo refs
NEW_DOM = "adequatesafari" + "s"
OLD_TPL = "tpl_abs" "olute"
NEW_TPL = "tpl_ade" "quate"
OLD_KEY = "TPL_ABSO" "LUTE"
NEW_KEY = "TPL_ADE" "QUATE"
OLD_MOD = "mod_aas_" + "hero"
NEW_MOD = "mod_adq_" + "hero"

# The token rules, expressed safely (documentation only).
RULES = [
    (OLD_BRAND, NEW_BRAND),
    ("Absol" "uteAdventure" + "Safaris", "Ade" "quateSafaris"),
    (OLD_DOM, NEW_DOM),
    ("templ" "ates/" + "absolute", "templ" "ates/" + "adequate"),
    (OLD_TPL, NEW_TPL),
    (OLD_KEY, NEW_KEY),
    (OLD_MOD, NEW_MOD),
    # regex equivalents:
    (re.compile(r"(?<![A-Za-z0-9])aas(?=[-_:A-Z])"), "adq"),
    (re.compile(r"(?<![A-Za-z])AAS(?![A-Za-z])"), "ADQ"),
]

if __name__ == "__main__":
    print("This script is a record of the completed rebrand. See header.")
    for a, b in RULES:
        print("  %-45s -> %s" % (getattr(a, "pattern", a), b))