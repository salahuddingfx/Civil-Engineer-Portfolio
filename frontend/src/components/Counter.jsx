import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Counter({ value, duration = 2, delay = 0, suffix = "", prefix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  
  // Parse numeric part
  const numericMatch = String(value || "").match(/(\d+(\.\d+)?)/);
  const target = numericMatch ? parseFloat(numericMatch[0]) : 0;
  
  // Extract suffix if not provided (e.g. if value is "500+")
  const autoSuffix = !suffix && String(value).includes("+") ? "+" : 
                     !suffix && String(value).includes("%") ? "%" : suffix;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const obj = { val: 0 };
    
    const tl = gsap.to(obj, {
      val: target,
      duration: duration,
      delay: delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
      },
      onUpdate: () => {
        setDisplayValue(Math.floor(obj.val));
      }
    });

    return () => {
      tl.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
    };
  }, [target, duration, delay]);

  return (
    <span ref={elementRef}>
      {prefix}{displayValue.toLocaleString()}{autoSuffix}
    </span>
  );
}
