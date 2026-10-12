/**
 * Absolute Adventure Safaris — template.js
 * Minimal progressive enhancement: mobile nav, search drawer, cookie consent.
 * Micro-app hand-off helpers read window.AAS_CONFIG (set by index.php).
 */
(function () {
    'use strict';

    var cfg = window.AAS_CONFIG || {};

    function ready(fn) {
        if (document.readyState !== 'loading') { fn(); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    ready(function () {
        // ── Mobile navigation (accordion) ──────────────────────
        var navToggle = document.querySelector('[data-aas-nav-toggle]');
        var mobileNav = document.getElementById('aas-mobile-nav');
        if (navToggle && mobileNav) {
            // Enable collapsing only once JS is available, so a no-JS user
            // still sees every link expanded.
            mobileNav.classList.add('js-ready');

            navToggle.addEventListener('click', function () {
                var open = mobileNav.classList.toggle('is-open');
                mobileNav.hidden = !open;
                navToggle.setAttribute('aria-expanded', String(open));
            });

            // Expand / collapse a branch.
            mobileNav.addEventListener('click', function (e) {
                var toggle = e.target.closest('[data-aas-menu-toggle]');
                if (!toggle) { return; }
                var branch = toggle.closest('.aas-menu__item');
                if (!branch) { return; }
                var open = branch.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }

        // ── Desktop dropdown: Escape returns focus to the trigger ──
        var desktopNav = document.querySelector('.aas-nav');
        if (desktopNav) {
            desktopNav.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    if (document.activeElement && document.activeElement.blur) {
                        document.activeElement.blur();
                    }
                }
            });
        }

        // ── Search drawer ──────────────────────────────────────
        var searchToggle = document.querySelector('[data-aas-search-toggle]');
        var searchDrawer = document.querySelector('[data-aas-search-drawer]');
        if (searchToggle && searchDrawer) {
            searchToggle.addEventListener('click', function () {
                searchDrawer.hidden = !searchDrawer.hidden;
                if (!searchDrawer.hidden) {
                    var input = searchDrawer.querySelector('input[type="search"]');
                    if (input) { input.focus(); }
                }
            });
        }

        // ── Cookie consent ─────────────────────────────────────
        var cookie = document.querySelector('[data-aas-cookie]');
        var CONSENT_KEY = 'aas_cookie_consent';
        if (cookie) {
            var stored = null;
            try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) { /* ignore */ }
            if (!stored) { cookie.hidden = false; }

            cookie.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-aas-cookie]');
                if (!btn) { return; }
                var value = btn.getAttribute('data-aas-cookie');
                try {
                    localStorage.setItem(CONSENT_KEY, JSON.stringify({
                        value: value,
                        at: new Date().toISOString()
                    }));
                } catch (err) { /* ignore */ }
                cookie.hidden = true;

                // Notify analytics layer (GA4 / GTM) if consent granted
                if (value === 'accept') {
                    window.dispatchEvent(new CustomEvent('aas:cookie-consent', { detail: { analytics: true } }));
                    if (typeof window.gtag === 'function') {
                        window.gtag('consent', 'update', { analytics_storage: 'granted' });
                    }
                }
            });
        }

        // ── Micro-app hand-off ─────────────────────────────────
        // Any element with [data-aas-book] opens the booking app with context.
        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-aas-book]');
            if (!trigger || !cfg.bookingUrl) { return; }
            e.preventDefault();
            var params = new URLSearchParams();
            ['safari', 'safariId', 'departure', 'adults', 'children'].forEach(function (key) {
                var v = trigger.getAttribute('data-' + key) || trigger.dataset[key];
                if (v) { params.set(key, v); }
            });
            var url = cfg.bookingUrl + (params.toString() ? ('?' + params.toString()) : '');
            window.location.href = url;
        });

        // Any element with [data-aas-plan] opens the itinerary builder.
        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-aas-plan]');
            if (!trigger || !cfg.itineraryUrl) { return; }
            e.preventDefault();
            window.location.href = cfg.itineraryUrl;
        });
    });

    // ── Public helpers for modules/micro-apps ─────────────────
    window.AAS = {
        config: cfg,
        book: function (opts) {
            var params = new URLSearchParams(opts || {});
            window.location.href = (cfg.bookingUrl || '/') + (params.toString() ? '?' + params.toString() : '');
        },
        plan: function () { window.location.href = cfg.itineraryUrl || '/'; },
        agent: function () { window.location.href = cfg.agentUrl || '/'; }
    };
})();