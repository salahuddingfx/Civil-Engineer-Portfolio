import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".legal-reveal", {
        opacity: 0,
        y: 30,
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
        title="Privacy Policy | Engr. Alam Ashik | Civil Engineer in Cox's Bazar" 
        description="Standardizing data protection and privacy protocols for professional engineering consultancy in Cox's Bazar." 
        path="/privacy-policy" 
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-10 text-center">
         <div className="legal-reveal mx-auto max-w-[900px]">
             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--highlight-border)] bg-[var(--highlight-soft)] mb-6 text-[var(--highlight)] text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--highlight)]"></span>
              LEGAL PROTOCOL
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8 uppercase" style={{ color: "var(--text)" }}>
              {language === 'en' ? "Privacy" : "প্রাইভেসি"} <br /> <span className="text-[#19D2FF]">{language === 'en' ? "Registry" : "রেজিস্ট্রি"}</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("legal.agreement", language)}
            </p>
         </div>
      </section>

      <section className="mt-8 md:mt-16 max-w-4xl mx-auto px-6 md:px-10 text-left space-y-12">
        <div className="legal-reveal p-8 md:p-16 border border-[var(--highlight-border)] bg-[var(--bg-card)] shadow-premium rounded-3xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-8 uppercase" style={{ color: "var(--text)" }}>{t("legal.data_protection", language)}</h2>
          <div className="space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <p>
              {language === 'en' 
                ? "This registry maintains high-fidelity encryption for all structural inquiry data. We authorize data processing only for the purpose of architectural vision and structural safety auditing." 
                : "এই রেজিস্ট্রি সমস্ত কাঠামোগত অনুসন্ধানের তথ্যের জন্য উচ্চ-মানের এনক্রিপশন বজায় রাখে। আমরা কেবল স্থাপত্য দর্শন এবং কাঠামোগত নিরাপত্তা অডিটিংয়ের উদ্দেশ্যে তথ্য প্রক্রিয়াকরণ করি।"}
            </p>
            <p>
              {language === 'en'
                ? "Your professional identity is secured within our studio parameters and is never transmitted to unauthorized third-level entities."
                : "আপনার পেশাদার পরিচয় আমাদের স্টুডিওর সীমাবদ্ধতার মধ্যে সুরক্ষিত থাকে এবং কখনোই অননুমোদিত তৃতীয় পক্ষের কাছে পাঠানো হয় না।"}
            </p>
          </div>
        </div>

        <div className="legal-reveal space-y-12">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 uppercase" style={{ color: "var(--text)" }}>{language === 'en' ? "Information Collection" : "তথ্য সংগ্রহ"}</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {language === 'en' 
                ? "We collect only essential project parameters, including name, authorized email, and structural context required for engineering analysis in Cox's Bazar."
                : "আমরা কেবল প্রয়োজনীয় প্রজেক্ট প্যারামিটার সংগ্রহ করি, যার মধ্যে ইঞ্জিনিয়ারিং বিশ্লেষণের জন্য প্রয়োজনীয় নাম, অনুমোদিত ইমেল এবং কাঠামোগত তথ্য অন্তর্ভুক্ত।"}
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 uppercase" style={{ color: "var(--text)" }}>{language === 'en' ? "Data Retention Era" : "তথ্য সংরক্ষণের সময়কাল"}</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {language === 'en'
                ? "Project records are archived for a period of 10 years to comply with Bangladesh's regional civil engineering safety standards and audit cycles."
                : "আঞ্চলিক সিভিল ইঞ্জিনিয়ারিং নিরাপত্তা মান এবং অডিট চক্র মেনে চলার জন্য প্রকল্পের রেকর্ড ১০ বছর পর্যন্ত আর্কাইভে রাখা হয়।"}
            </p>
          </div>
        </div>

        <div className="legal-reveal pt-10 border-t border-[var(--highlight-border)] flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] gap-4 text-center" style={{ color: "var(--text-muted)" }}>
           <span>{t("legal.last_updated", language)}: April 2024</span>
           <span className="text-[#19D2FF]">Authorization v5.0</span>
        </div>
      </section>
    </div>
  );
}
