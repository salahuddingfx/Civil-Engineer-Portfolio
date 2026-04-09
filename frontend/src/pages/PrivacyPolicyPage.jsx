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
    <div ref={containerRef} className="bg-[#0A0F1C] text-white selection:bg-[#19D2FF]/30 selection:text-white min-h-screen pb-40">
      <SeoHead 
        title={t("legal.privacy_title", language) + " | Civil Engineer in Cox's Bazar"} 
        description="Standardizing data protection and privacy protocols for professional engineering consultancy in Cox's Bazar." 
        path="/privacy-policy" 
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-10 text-center">
         <div className="legal-reveal mx-auto max-w-[900px]">
             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(25,210,255,0.2)] bg-[#19D2FF]/5 mb-6 text-[#19D2FF] text-[10px] font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(25,210,255,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D2FF]"></span>
              LEGAL PROTOCOL
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8 uppercase text-white">
              {language === 'en' ? "Privacy" : "প্রাইভেসি"} <br /> <span className="text-[#19D2FF]">{language === 'en' ? "Registry" : "রেজিস্ট্রি"}</span>
            </h1>
            <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
              {t("legal.agreement", language)}
            </p>
         </div>
      </section>

      <section className="mt-8 md:mt-16 max-w-4xl mx-auto px-6 md:px-10 text-left space-y-12">
        <div className="legal-reveal p-8 md:p-16 border border-[rgba(25,210,255,0.1)] bg-[#111827] shadow-[0_20px_40px_rgba(10,15,28,0.5)] rounded-3xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8 uppercase">{t("legal.data_protection", language)}</h2>
          <div className="space-y-6 text-[15px] text-[#CBD5E1] leading-relaxed">
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
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 uppercase">{language === 'en' ? "Information Collection" : "তথ্য সংগ্রহ"}</h3>
            <p className="text-[15px] text-[#CBD5E1] leading-relaxed">
              {language === 'en' 
                ? "We collect only essential project parameters, including name, authorized email, and structural context required for engineering analysis in Cox's Bazar."
                : "আমরা কেবল প্রয়োজনীয় প্রজেক্ট প্যারামিটার সংগ্রহ করি, যার মধ্যে ইঞ্জিনিয়ারিং বিশ্লেষণের জন্য প্রয়োজনীয় নাম, অনুমোদিত ইমেল এবং কাঠামোগত তথ্য অন্তর্ভুক্ত।"}
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 uppercase">{language === 'en' ? "Data Retention Era" : "তথ্য সংরক্ষণের সময়কাল"}</h3>
            <p className="text-[15px] text-[#CBD5E1] leading-relaxed">
              {language === 'en'
                ? "Project records are archived for a period of 10 years to comply with Bangladesh's regional civil engineering safety standards and audit cycles."
                : "আঞ্চলিক সিভিল ইঞ্জিনিয়ারিং নিরাপত্তা মান এবং অডিট চক্র মেনে চলার জন্য প্রকল্পের রেকর্ড ১০ বছর পর্যন্ত আর্কাইভে রাখা হয়।"}
            </p>
          </div>
        </div>

        <div className="legal-reveal pt-10 border-t border-[rgba(25,210,255,0.1)] flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-[#CBD5E1] uppercase tracking-[0.2em] gap-4 text-center">
           <span>{t("legal.last_updated", language)}: April 2024</span>
           <span className="text-[#19D2FF]">Authorization v5.0</span>
        </div>
      </section>
    </div>
  );
}
