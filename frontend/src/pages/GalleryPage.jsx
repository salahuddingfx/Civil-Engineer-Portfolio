import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../lib/translations";
import SeoHead from "../components/SeoHead";
import { fetchContent } from "../lib/api";
import { Skeleton } from "../components/Skeleton";

// Fallback images if database is empty
// Fallback images from database dump
const defaultImages = [
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1777223592/portfolio_assets/i36xdvii5uklfehe76wr.jpg",
    labelEn: "Site Supervision & Inspection",
    labelBn: "সাইট পরিদর্শন ও তদারকি",
    coord: "Site Photo",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "Live Supervision",
    metaEn: "Live construction quality assurance monitoring on site.",
    metaBn: "সাইটে নির্মাণ মানের লাইভ তদারকি ও গুণমান নিশ্চয়তা।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914055/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.02_PM_atzcme.jpg",
    labelEn: "Engineering Model 01 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 01 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 01.",
    metaBn: "Engineering Model 01 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914057/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.04_PM_vc3elp.jpg",
    labelEn: "Engineering Model 01 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 01 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 01.",
    metaBn: "Engineering Model 01 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914058/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.05_PM_1_jiacqo.jpg",
    labelEn: "Engineering Model 02 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 02 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 02.",
    metaBn: "Engineering Model 02 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914059/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.05_PM_2_fr7ukv.jpg",
    labelEn: "Engineering Model 02 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 02 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 02.",
    metaBn: "Engineering Model 02 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914060/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.05_PM_h1roqu.jpg",
    labelEn: "Engineering Model 03 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 03 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 03.",
    metaBn: "Engineering Model 03 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914061/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.06_PM_1_ettrdq.jpg",
    labelEn: "Engineering Model 03 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 03 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 03.",
    metaBn: "Engineering Model 03 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914062/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.06_PM_2_w0g9kf.jpg",
    labelEn: "Engineering Model 04 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 04 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 04.",
    metaBn: "Engineering Model 04 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914063/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.06_PM_gxaeh9.jpg",
    labelEn: "Engineering Model 04 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 04 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 04.",
    metaBn: "Engineering Model 04 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914064/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_1_shnbhr.jpg",
    labelEn: "Engineering Model 05 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 05 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 05.",
    metaBn: "Engineering Model 05 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914065/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_10_uk2kxd.jpg",
    labelEn: "Engineering Model 05 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 05 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 05.",
    metaBn: "Engineering Model 05 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914066/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_11_n94zz0.jpg",
    labelEn: "Engineering Model 06 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 06 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 06.",
    metaBn: "Engineering Model 06 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914067/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_12_s4dieo.jpg",
    labelEn: "Engineering Model 06 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 06 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 06.",
    metaBn: "Engineering Model 06 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914068/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_13_ep34bs.jpg",
    labelEn: "Engineering Model 07 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 07 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 07.",
    metaBn: "Engineering Model 07 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914069/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_14_epzefw.jpg",
    labelEn: "Engineering Model 07 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 07 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 07.",
    metaBn: "Engineering Model 07 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914070/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_2_kztxka.jpg",
    labelEn: "Engineering Model 08 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 08 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 08.",
    metaBn: "Engineering Model 08 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914071/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_3_nnwzz7.jpg",
    labelEn: "Engineering Model 08 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 08 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 08.",
    metaBn: "Engineering Model 08 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914072/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_4_qvv1gs.jpg",
    labelEn: "Engineering Model 09 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 09 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 09.",
    metaBn: "Engineering Model 09 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914073/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_5_lw8ueo.jpg",
    labelEn: "Engineering Model 09 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 09 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 09.",
    metaBn: "Engineering Model 09 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914073/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_6_ucgxjw.jpg",
    labelEn: "Engineering Model 10 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 10 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 10.",
    metaBn: "Engineering Model 10 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914074/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_7_soskc5.jpg",
    labelEn: "Engineering Model 10 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 10 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 10.",
    metaBn: "Engineering Model 10 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914075/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_8_xib9ue.jpg",
    labelEn: "Engineering Model 11 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 11 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 11.",
    metaBn: "Engineering Model 11 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914076/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_9_tvyyl6.jpg",
    labelEn: "Engineering Model 11 - Vision 2",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 11 - দৃশ্য 2",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 11.",
    metaBn: "Engineering Model 11 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1775914076/portfolio/gallery/WhatsApp_Image_2026-04-10_at_10.21.07_PM_lrt5hd.jpg",
    labelEn: "Engineering Model 12 - Vision 1",
    labelBn: "ইঞ্জিনিয়ারিং মডেল 12 - দৃশ্য 1",
    coord: "Structural Design",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "3D Visualization",
    metaEn: "High-fidelity structural visualization showcasing Engineering Model 12.",
    metaBn: "Engineering Model 12 এর উচ্চ-মানের কাঠামোগত ভিজ্যুয়ালাইজেশন।"
  },
  {
    src: "https://res.cloudinary.com/dxfvguilc/image/upload/v1776226890/portfolio_assets/chxwe7fmnq9gyf1troag.jpg",
    labelEn: "Client Projects",
    labelBn: "ক্লায়েন্ট প্রজেক্ট",
    coord: "Architectural Render",
    dateEn: "April 2026",
    dateBn: "এপ্রিল ২০২৬",
    iso: "Architectural Rendering",
    metaEn: "Architectural visual mapping of residential and commercial drafts.",
    metaBn: "আবাসিক এবং বাণিজ্যিক ড্রাফটের স্থাপত্য ভিজ্যুয়াল ম্যাপিং।"
  }
];

export default function GalleryPage() {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const [activeImage, setActiveImage] = useState(null);
  const containerRef = useRef(null);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9;

  // Fetch dynamic gallery content
  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetchContent("gallery", { limit: 50 });
        if (response.items && response.items.length > 0) {
          const mapped = response.items.map(item => ({
             src: item.featuredImage?.url || "/images/project-fallback.png",
             label: language === "bn" ? (item.title?.bn || item.title?.en) : (item.title?.en),
             coord: item.category || "Cox's Bazar",
             date: new Date(item.createdAt).toLocaleDateString(language === "en" ? 'en-US' : 'bn-BD', { year: 'numeric', month: 'long' }),
             iso: item.tags?.[0] || "Structural",
             meta: language === "bn" ? (item.summary?.bn || item.summary?.en) : (item.summary?.en)
          }));
          setImages(mapped);
        } else {
          setImages(defaultImages.map(img => ({
             src: img.src,
             label: language === "bn" ? (img.labelBn || img.labelEn) : img.labelEn,
             coord: img.coord,
             date: language === "bn" ? (img.dateBn || img.dateEn) : img.dateEn,
             iso: img.iso,
             meta: language === "bn" ? (img.metaBn || img.metaEn) : img.metaEn
          })));
        }
      } catch (err) {
        setImages(defaultImages.map(img => ({
           src: img.src,
           label: language === "bn" ? (img.labelBn || img.labelEn) : img.labelEn,
           coord: img.coord,
           date: language === "bn" ? (img.dateBn || img.dateEn) : img.dateEn,
           iso: img.iso,
           meta: language === "bn" ? (img.metaBn || img.metaEn) : img.metaEn
        })));
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [language]);

  useEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(".reveal-unit", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen">
      <SeoHead
        title="Gallery — Engr. Alam Ashik"
        description="A professional registry of structural achievements and architectural visual intelligence across Bangladesh."
        path="/gallery"
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-10 text-center mx-auto max-w-[1500px]">
         <div className="reveal-unit mx-auto max-w-[900px]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ border: "1px solid var(--highlight-border)", background: "var(--highlight-soft)", color: "var(--highlight)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--highlight)" }} />
              {t("gallery_page.eyebrow", language)}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-8 uppercase" style={{ color: "var(--text)" }}>
              {t("gallery_page.title", language).split(" ")[0]} <span className="text-glow">{t("gallery_page.title", language).split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("gallery_page.subtitle", language)}
            </p>
         </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-10 mx-auto max-w-[1500px]">
         {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                 <Skeleton className="h-[400px] rounded-3xl" />
                 <Skeleton className="h-[400px] rounded-3xl" />
                 <Skeleton className="h-[400px] rounded-3xl" />
             </div>
         ) : (          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
            {images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage).map((img, i) => (
              <div 
                key={i} 
                className={`reveal-unit group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-[rgba(25,210,255,0.05)] break-inside-avoid active:scale-[0.98] transition-transform duration-300
                  ${i % 3 === 0 ? "aspect-[4/5]" : i % 2 === 0 ? "aspect-square" : "aspect-[3/4]"}`}
                onClick={() => setActiveImage(img)}
              >
                 <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
                 
                 <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-black via-black/40" : "bg-gradient-to-t from-white via-white/20"} to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />
                 
                 <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end ${isDark ? "text-white" : "text-slate-900"}`}>
                    <div className="md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 rounded text-[9px] md:text-[10px] tracking-widest font-bold uppercase mb-2"
                        style={{ background: "var(--highlight-soft)", color: "var(--highlight)", border: "1px solid var(--highlight-border)" }}>
                        {img.iso}
                      </span>
                      <h2 className={`text-lg md:text-xl font-bold mb-2 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{img.label}</h2>
                      <div className={`flex items-center justify-between pt-3 md:pt-4 border-t ${isDark ? "border-white/10" : "border-slate-200"} opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity`}>
                         <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-600"} font-bold uppercase tracking-widest`}>{img.coord}</span>
                      </div>
                    </div>
                 </div>

                 <div className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-[#19D2FF]/10 backdrop-blur-md border border-[#19D2FF]/20 rounded-full flex items-center justify-center text-[#19D2FF] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-90 md:scale-50 md:group-hover:scale-100 hover:bg-[#19D2FF] hover:text-[#0A0F1C]">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>
                 </div>
              </div>
            ))}
         </div>
         )}

         {/* Pagination Controls */}
         {!loading && images.length > imagesPerPage && (
           <div className="flex justify-center items-center gap-4 mt-16 reveal-unit">
             <button 
               onClick={() => {
                 setCurrentPage(prev => Math.max(1, prev - 1));
                 window.lenis?.scrollTo(0);
               }}
               disabled={currentPage === 1}
               className="p-3 rounded-full border border-[var(--highlight-border)] bg-[var(--highlight-soft)] text-[var(--highlight)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--highlight)] hover:text-[#0A0F1C] transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
             </button>
             
             <div className="flex gap-2">
               {Array.from({ length: Math.ceil(images.length / imagesPerPage) }).map((_, idx) => (
                 <button
                   key={idx}
                   onClick={() => {
                     setCurrentPage(idx + 1);
                     window.lenis?.scrollTo(0);
                   }}
                   className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${
                     currentPage === idx + 1 
                       ? "bg-[var(--highlight)] text-[#0A0F1C]" 
                       : "bg-[var(--highlight-soft)] text-[var(--highlight)] border border-[var(--highlight-border)] hover:bg-[var(--highlight)] hover:text-[#0A0F1C]"
                   }`}
                 >
                   {String(idx + 1).padStart(2, '0')}
                 </button>
               ))}
             </div>

             <button 
               onClick={() => {
                 setCurrentPage(prev => Math.min(Math.ceil(images.length / imagesPerPage), prev + 1));
                 window.lenis?.scrollTo(0);
               }}
               disabled={currentPage === Math.ceil(images.length / imagesPerPage)}
               className="p-3 rounded-full border border-[var(--highlight-border)] bg-[var(--highlight-soft)] text-[var(--highlight)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--highlight)] hover:text-[#0A0F1C] transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </button>
           </div>
         )}
      </section>


      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <div className={`absolute inset-0 ${isDark ? "bg-black/96" : "bg-white/96"} backdrop-blur-xl`} onClick={() => setActiveImage(null)} />
          
          <div className={`relative w-full max-w-6xl max-h-[90vh] md:max-h-[95vh] overflow-hidden rounded-2xl md:rounded-3xl border ${isDark ? "border-white/10" : "border-slate-200"} shadow-3xl flex flex-col lg:flex-row transform transition-all duration-500`}
            style={{ background: "var(--bg-card)" }}>
             
             {/* Close Button */}
             <button 
               onClick={() => setActiveImage(null)}
               aria-label="Close Gallery Modal"
               className={`absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all z-20 shadow-lg ${isDark ? "bg-black/50 border-white/20 text-white" : "bg-white/80 border-slate-200 text-slate-900"} border hover:bg-[var(--highlight)] hover:text-white`}
             >
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             <div className="h-[40%] lg:h-auto lg:w-[60%] relative flex-shrink-0">
                <img src={activeImage.src} alt={activeImage.label} className="w-full h-full object-cover" />
             </div>
             
             <div className="h-[60%] lg:h-auto lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-y-auto" style={{ background: "var(--bg-card)" }}>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--highlight)] opacity-[0.03] rounded-tl-full blur-3xl pointer-events-none"></div>

                <span className="text-[var(--highlight)] text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Intelligence Archive</span>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 tracking-tight leading-tight" style={{ color: "var(--text)" }}>{activeImage.label}</h2>
                
                <p className="text-[13px] md:text-[15px] leading-relaxed mb-6 md:mb-10" style={{ color: "var(--text-muted)" }}>
                  Detailed analysis: {activeImage.meta}. Ensuring structural components meet premium architectural standards under rigorous stress conditions.
                </p>

                <div className="space-y-4 md:space-y-6 border-y py-6 md:py-8 mb-8 md:mb-10" style={{ borderColor: "var(--highlight-border)" }}>
                   <div className="flex justify-between items-center sm:block">
                      <p className="text-[9px] font-bold text-[#666] tracking-widest uppercase mb-1">ISO PROTOCOL</p>
                      <p className="text-sm font-bold text-[var(--highlight)]">{activeImage.iso}</p>
                   </div>
                   <div className="flex justify-between items-center sm:block">
                      <p className="text-[9px] font-bold text-[#666] tracking-widest uppercase mb-1">COORDINATION</p>
                      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{activeImage.coord}</p>
                   </div>
                   <div className="flex justify-between items-center sm:block">
                      <p className="text-[9px] font-bold text-[#666] tracking-widest uppercase mb-1">CAPTURE ERA</p>
                      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{activeImage.date}</p>
                   </div>
                </div>

                <button onClick={() => setActiveImage(null)} className="w-full py-4 bg-[#19D2FF] text-[#0A0F1C] text-[11px] md:text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-lg active:scale-95">
                   Close Archive Registry
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
