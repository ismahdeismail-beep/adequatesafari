/**
 * Adequate Safaris — template.js
 * Minimal progressive enhancement: mobile nav, search drawer, cookie consent.
 * Micro-app hand-off helpers read window.ADQ_CONFIG (set by index.php).
 */
(function () {
    'use strict';

    var cfg = window.ADQ_CONFIG || {};

    function ready(fn) {
        if (document.readyState !== 'loading') { fn(); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    ready(function () {
        // ── Mobile navigation (accordion) ──────────────────────
        var navToggle = document.querySelector('[data-adq-nav-toggle]');
        var mobileNav = document.getElementById('adq-mobile-nav');
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
                var toggle = e.target.closest('[data-adq-menu-toggle]');
                if (!toggle) { return; }
                var branch = toggle.closest('.adq-menu__item');
                if (!branch) { return; }
                var open = branch.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }

        // ── Desktop dropdown: Escape returns focus to the trigger ──
        var desktopNav = document.querySelector('.adq-nav');
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
        var searchToggle = document.querySelector('[data-adq-search-toggle]');
        var searchDrawer = document.querySelector('[data-adq-search-drawer]');
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
        var cookie = document.querySelector('[data-adq-cookie]');
        var CONSENT_KEY = 'adq_cookie_consent';
        if (cookie) {
            var stored = null;
            try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) { /* ignore */ }
            if (!stored) { cookie.hidden = false; }

            cookie.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-adq-cookie]');
                if (!btn) { return; }
                var value = btn.getAttribute('data-adq-cookie');
                try {
                    localStorage.setItem(CONSENT_KEY, JSON.stringify({
                        value: value,
                        at: new Date().toISOString()
                    }));
                } catch (err) { /* ignore */ }
                cookie.hidden = true;

                // Notify analytics layer (GA4 / GTM) if consent granted
                if (value === 'accept') {
                    window.dispatchEvent(new CustomEvent('adq:cookie-consent', { detail: { analytics: true } }));
                    if (typeof window.gtag === 'function') {
                        window.gtag('consent', 'update', { analytics_storage: 'granted' });
                    }
                }
            });
        }

        // ── Micro-app hand-off ─────────────────────────────────
        // Any element with [data-adq-book] opens the booking app with context.
        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-adq-book]');
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

        // Any element with [data-adq-plan] opens the itinerary builder.
        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-adq-plan]');
            if (!trigger || !cfg.itineraryUrl) { return; }
            e.preventDefault();
            window.location.href = cfg.itineraryUrl;
        });
    });

    // ── Public helpers for modules/micro-apps ─────────────────
    window.ADQ = {
        config: cfg,
        book: function (opts) {
            var params = new URLSearchParams(opts || {});
            window.location.href = (cfg.bookingUrl || '/') + (params.toString() ? '?' + params.toString() : '');
        },
        plan: function () { window.location.href = cfg.itineraryUrl || '/'; },
        agent: function () { window.location.href = cfg.agentUrl || '/'; }
    };
})();