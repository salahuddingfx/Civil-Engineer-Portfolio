import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";

/**
 * SmoothScroll component integrates Lenis with GSAP ScrollTrigger
 * to provide a premium momentum-based scrolling experience.
 */
export default function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    // 1. Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true, // Enabled for mobile as requested
      touchMultiplier: 2,
      infinite: false,
    });

    // 3. Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Drive Lenis from GSAP Ticker for frame-perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 5. Disable GSAP's lag smoothing to keep animations in sync with the momentum scroll
    gsap.ticker.lagSmoothing(0);

    // 6. Handle route changes - Scroll to top immediately
    lenis.scrollTo(0, { immediate: true });

    // Global reference for other components to access lenis.scrollTo if needed
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      window.lenis = null;
    };
  }, []);

  // 7. Reset scroll on path change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  return <>{children}</>;
}
