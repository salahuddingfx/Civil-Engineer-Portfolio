/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransitionBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setActive(true);
    setProgress(18);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          return prev;
        }
        return prev + (92 - prev) * 0.2;
      });
    }, 90);

    const endTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 220);
    }, 420);

    return () => {
      clearTimeout(endTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [location.pathname]);

  return (
    <div className={`route-progress ${active ? "active" : ""}`} aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}
