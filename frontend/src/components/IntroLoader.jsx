import React, { useEffect } from "react";
import gsap from "gsap";

const IntroLoader = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete && onComplete(),
    });

    // Initial sequence (Sub-second)
    tl.fromTo(".loader-content",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    )
      .to(".loader-ring", {
        opacity: 1,
        duration: 0.2
      }, "-=0.2")

      // No hold duration for maximum speed

      // Exit
      .to(".intro-overlay", {
        y: "-100%",
        duration: 0.4,
        ease: "expo.inOut",
      })
      .to(".loader-content", {
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: "power2.in",
      }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="intro-overlay fixed inset-0 z-[9999] flex items-center justify-center transition-colors duration-500 overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Background Layers */}
      <div className="absolute inset-0 bg-tech-grid opacity-20" />
      <div className="absolute inset-0 blueprint-overlay blueprint-scroll opacity-10" />

      {/* Content */}
      <div className="loader-content relative z-10 text-center px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter" style={{ color: "var(--text)" }}>
            Engr. Alam <span className="text-[var(--highlight)] text-glow">Ashik</span>
          </h1>
          <div className="h-px w-24 bg-[var(--highlight)] mx-auto mt-4 opacity-50" />
        </div>

        <div className="flex flex-col items-center">
          <div className="loader-ring mb-6 opacity-0" />
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[var(--highlight)] animate-pulse">
            Engineering Precision
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .text-glow {
          text-shadow: 0 0 20px var(--highlight-glow);
        }
      `}} />
    </div>
  );
};

export default IntroLoader;
