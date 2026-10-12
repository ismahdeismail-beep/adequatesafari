/**
 * Absolute Adventure Safaris — hero carousel controller.
 * Controlled motion: one slide advances at a fixed cadence; the Ken Burns
 * zoom, caption reveals and progress bar are all tied to that cadence and
 * pause together on hover / focus / hidden tab.
 */
(function () {
    'use strict';

    var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initHero(root) {
        if (!root || root.dataset.aasHeroReady === '1') { return; }
        root.dataset.aasHeroReady = '1';

        var slides   = Array.prototype.slice.call(root.querySelectorAll('.aas-hero__slide'));
        var dots     = Array.prototype.slice.call(root.querySelectorAll('.aas-hero__dot'));
        var prevBtn  = root.querySelector('[data-aas-hero-prev]');
        var nextBtn  = root.querySelector('[data-aas-hero-next]');
        var bar      = root.querySelector('.aas-hero__progress-bar');

        if (slides.length < 2) { return; }

        var interval = parseInt(root.getAttribute('data-interval'), 10) || 6000;
        var autoplay = root.getAttribute('data-autoplay') !== '0';
        var index    = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
        var timer    = null;
        var paused   = false;

        function show(next) {
            next = (next + slides.length) % slides.length;
            if (next === index) { return; }

            slides[index].classList.remove('is-active');
            slides[index].setAttribute('aria-hidden', 'true');
            if (dots[index]) { dots[index].classList.remove('is-active'); dots[index].setAttribute('aria-selected', 'false'); }

            index = next;

            slides[index].classList.add('is-active');
            slides[index].setAttribute('aria-hidden', 'false');
            if (dots[index]) { dots[index].classList.add('is-active'); dots[index].setAttribute('aria-selected', 'true'); }

            restartProgress();
        }

        function restartProgress() {
            if (!bar) { return; }
            bar.classList.remove('is-running');
            bar.style.animationDuration = interval + 'ms';
            // force reflow so the animation restarts
            void bar.offsetWidth;
            if (autoplay && !paused && !REDUCED) { bar.classList.add('is-running'); }
        }

        function start() {
            if (!autoplay) { return; }
            stop();
            restartProgress();
            timer = window.setInterval(function () { show(index + 1); }, interval);
        }

        function stop() {
            if (timer) { window.clearInterval(timer); timer = null; }
            if (bar) { bar.classList.remove('is-running'); }
        }

        function pause()  { if (paused) { return; } paused = true;  stop(); }
        function resume() { if (!paused) { return; } paused = false; start(); }

        // Controls
        if (nextBtn) { nextBtn.addEventListener('click', function () { show(index + 1); start(); }); }
        if (prevBtn) { prevBtn.addEventListener('click', function () { show(index - 1); start(); }); }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(parseInt(dot.getAttribute('data-aas-hero-goto'), 10) || 0);
                start();
            });
        });

        // Keyboard
        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { show(index + 1); start(); }
            else if (e.key === 'ArrowLeft') { show(index - 1); start(); }
        });

        // Pause on hover / focus
        root.addEventListener('mouseenter', pause);
        root.addEventListener('mouseleave', resume);
        root.addEventListener('focusin', pause);
        root.addEventListener('focusout', resume);

        // Pause when the tab is hidden (saves battery, avoids jumpy motion)
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { stop(); } else { start(); }
        });

        // Touch swipe
        var startX = null;
        root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
        root.addEventListener('touchend', function (e) {
            if (startX === null) { return; }
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 45) { show(index + (dx < 0 ? 1 : -1)); start(); }
            startX = null;
        }, { passive: true });

        // Reduced motion: keep rotating content but skip the zoom/pan and the
        // animated progress bar (CSS already disables the Ken Burns effect).
        if (REDUCED) {
            if (bar) { bar.style.width = '100%'; bar.classList.remove('is-running'); }
            if (!autoplay) { return; }
            stop();
            timer = window.setInterval(function () { show(index + 1); }, interval);
            return;
        }

        start();
    }

    function boot() {
        document.querySelectorAll('[data-aas-hero]').forEach(initHero);
    }

    if (document.readyState !== 'loading') { boot(); }
    else { document.addEventListener('DOMContentLoaded', boot); }
})();