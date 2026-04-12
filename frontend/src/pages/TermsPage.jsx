import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";

export default function TermsPage() {
  const { language } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".legal-reveal", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="selection:bg-[#19D2FF]/30 min-h-screen pb-40">
      <SeoHead 
        title="Terms | Engr Alam Ashik | Civil Engineer in Cox's Bazar" 
        description="Establishing technical engagement standards and structural consultancy liability protocols for Cox's Bazar engineering standards." 
        path="/terms" 
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 text-center">
         <div className="legal-reveal mx-auto max-w-[900px]">
             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--highlight-border)] bg-[var(--highlight-soft)] mb-6 text-[var(--highlight)] text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--highlight)]"></span>
              LEGAL PROTOCOL
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-8 uppercase" style={{ color: "var(--text)" }}>
              {language === 'en' ? "Terms of" : "এনগেজমেন্ট"} <br /> <span className="text-[#19D2FF]">{language === 'en' ? "Engagement" : "শর্তাবলী"}</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("legal.agreement", language)}
            </p>
         </div>
      </section>

      <section className="mt-16 max-w-4xl mx-auto px-6 md:px-10 text-left space-y-16">
        <div className="legal-reveal p-8 md:p-16 border border-[var(--highlight-border)] bg-[var(--bg-card)] shadow-premium rounded-3xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 uppercase" style={{ color: "var(--text)" }}>{language === 'en' ? "Professional Liability" : "পেশাদার দায়বদ্ধতা"}</h2>
          <div className="space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <p>
              {language === 'en' 
                ? "Engr Alam Ashik provides structural designs and architectural visions based on the technical parameters submitted by the client. Any deviation from on-site execution without studio authorization nullifies structural safety guarantees." 
                : "ইঞ্জিনিয়ার আলম আশিক ক্লায়েন্টের জমা দেওয়া টেকনিক্যাল প্যারামিটারের ওপর ভিত্তি করে স্ট্রাকচারাল ডিজাইন এবং আর্কিটেকচারাল ভিশন প্রদান করেন। স্টুডিওর অনুমোদন ছাড়া অন-সাইট এক্সিকিউশন থেকে যেকোনো বিচ্যুতি কাঠামোগত নিরাপত্তার গ্যারান্টি বাতিল করবে।"}
            </p>
          </div>
        </div>

        <div className="legal-reveal space-y-12">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 uppercase" style={{ color: "var(--text)" }}>{language === 'en' ? "Engagement Cycle" : "কাজের প্রক্রিয়া"}</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {language === 'en' 
                ? "The consultancy cycle initializes upon receipt of detailed site surveys and authorized soil tests. Studio reserves the right to suspend engagement if structural safety standards are compromised by external factors."
                : "বিস্তারিত সাইট সার্ভে এবং অনুমোদিত সয়েল টেস্ট পাওয়ার পর কনসালটেন্সি চক্র শুরু হয়। বাহ্যিক কোনে কারণে কাঠামোগত নিরাপত্তার মান বিঘ্নিত হলে এনগেজমেন্ট স্থগিত করার অধিকার স্টুডিও সংরক্ষণ করে।"}
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 uppercase" style={{ color: "var(--text)" }}>{language === 'en' ? "Intellectual Property" : "মেধা সম্পদ"}</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {language === 'en'
                ? "All CAD blueprints, structural calculations, and 3D visualization assets remain the high-fidelity intellectual property of Engr Alam Ashik Studio unless otherwise authorized in the final engagement deed."
                : "সমস্ত CAD ব্লুপ্রিন্ট, কাঠামোগত গণনা এবং 3D ভিজ্যুয়ালাইজেশন অ্যাসেটগুলি অন্যথায় চুক্তিবদ্ধ না হলে ইঞ্জিনিয়ার আলম আশিক স্টুডিওর মেধা সম্পত্তি হিসেবে থাকবে।"}
            </p>
          </div>
        </div>

        <div className="legal-reveal pt-10 border-t border-[var(--highlight-border)] flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] gap-4 text-center" style={{ color: "var(--text-muted)" }}>
          <span>{t("legal.last_updated", language)}: April 2024</span>
          <span className="text-[#19D2FF]">Protocol Level 5.0</span>
        </div>
      </section>
    </div>
  );
}
