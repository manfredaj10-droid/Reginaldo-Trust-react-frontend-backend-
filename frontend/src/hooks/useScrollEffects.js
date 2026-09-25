import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollEffects() {
  const location = useLocation();

  useEffect(() => {
    // 1. Scroll Progress Bar
    let scrollTicking = false;
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const bar = document.getElementById('scroll-progress');
      if (bar) {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = scrollHeight > 0 ? ((scrollTop / scrollHeight) * 100) + '%' : '0%';
      }
      scrollTicking = false;
    }

    const scrollListener = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(onScroll);
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    onScroll();

    // 2. Stat Counters
    function triggerCounter(el) {
      if (el.getAttribute('data-started')) return;
      el.setAttribute('data-started', 'true');

      const targetText = el.getAttribute('data-target') || '0';
      const hasPlus = targetText.includes('+');
      const target = parseInt(targetText.replace(/\+/g, ''), 10) || 0;
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(target * easeProgress);

        el.innerText = currentCount.toLocaleString() + (hasPlus ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.innerText = target.toLocaleString() + (hasPlus ? '+' : '');
        }
      }

      requestAnimationFrame(update);
    }

    // 3. Reveal elements in viewport immediately
    const revealSelector = '.reveal-on-scroll, .image-reveal, [data-animate-heading], .counter, .slide-left, .slide-right, .text-reveal';
    
    // Fallback & immediate activation for elements visible in viewport
    const activateVisible = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(revealSelector).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight && rect.bottom >= 0) {
          el.classList.add('active');
          if (el.classList.contains('counter')) {
            triggerCounter(el);
          }
        }
      });
    };

    // Run immediately
    activateVisible();

    // 4. Shared Scroll Reveal Observer
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.classList.contains('counter')) {
              triggerCounter(entry.target);
            }
          }
        });
      }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });

      document.querySelectorAll(revealSelector).forEach(el => observer.observe(el));
    } else {
      document.querySelectorAll(revealSelector).forEach(el => el.classList.add('active'));
    }

    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);
}
