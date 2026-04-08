import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function GlassCard({ children, className = "", delay = 0 }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Entry Animation
    gsap.fromTo(card, 
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, delay: delay, ease: "power4.out" }
    );

    const onMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const xPercent = (x / width - 0.5) * 12;
      const yPercent = (y / height - 0.5) * -12;

      gsap.to(card, {
        rotateY: xPercent,
        rotateX: yPercent,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 1200,
      });

      gsap.to(glowRef.current, {
        x: x,
        y: y,
        opacity: 1,
        duration: 0.4,
      });
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.6,
      });
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`glass-card group relative overflow-hidden rounded-[40px] border border-white/5 bg-zinc-950/40 p-1 backdrop-blur-3xl transition-all hover:border-cyan-400/30 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Dynamic Mouse Spotlight */}
      <div 
        ref={glowRef}
        className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-cyan-400/10 blur-[80px] opacity-0 transition-opacity duration-500"
      />

      {/* Internal Content Container */}
      <div className="relative z-10 h-full w-full rounded-[38px] p-8 md:p-10" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
      
      {/* Structural Deco */}
      <div className="absolute top-6 right-6 flex gap-1.5 opacity-20 transition-opacity group-hover:opacity-60">
        <div className="h-0.5 w-4 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]" />
        <div className="h-0.5 w-0.5 rounded-full bg-cyan-400" />
      </div>
    </div>
  );
}
