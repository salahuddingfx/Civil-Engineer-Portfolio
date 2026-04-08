import { Helmet } from "react-helmet-async";

export default function SeoHead({
  title = "Civil Engineer in Cox's Bazar | Engr. Alam Ashik",
  description = "Premium civil engineering, structural design, and consultancy services in Cox's Bazar.",
  path = "/",
  image = "https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?auto=format&fit=crop&w=1200&q=80",
}) {
  const siteUrl = "https://engralamashik.com";
  const absoluteUrl = `${siteUrl}${path}`;
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#local-business`,
        name: "Engr. Alam Ashik - Civil Engineering Services",
        image,
        description: "Premium civil engineering, structural design, and consultancy services in Cox's Bazar.",
        areaServed: {
          "@type": "City",
          name: "Cox's Bazar"
        },
        serviceType: ["Civil Engineering", "Architectural Design", "Structural Consultancy"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cox's Bazar",
          addressRegion: "Chattogram",
          postalCode: "4700",
          addressCountry: "BD",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 21.4272,
          longitude: 92.0058,
        },
        url: siteUrl,
        telephone: "+8801234567890",
        priceRange: "$$"
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Engr. Alam Ashik",
        inLanguage: ["en", "bn"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#professional-service`,
        name: "Engr. Alam Ashik Studio",
        url: siteUrl,
        logo: image,
      },
    ],
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="civil engineer Cox's Bazar, structural engineer Cox's Bazar, architectural design Cox's Bazar, Alam Ashik, Engr Alam Ashik, engineering consultancy Cox's Bazar, building design Bangladesh, structural consultancy Bangladesh, residential design Cox's Bazar, commercial building Cox's Bazar, construction supervision Bangladesh, CAD drawing Cox's Bazar, 3D architectural design, blueprint design Cox's Bazar, foundation engineering, load bearing design, building permit consultant Bangladesh, interior design Cox's Bazar, luxury villa design, hotel architecture Cox's Bazar, resort design Bangladesh, coastal construction consultancy, marine drive development Cox's Bazar, Chattogram civil engineer, Cox's Bazar construction, structural integrity consultant, engineering firm Bangladesh, architectural firm Bangladesh, best civil engineer Bangladesh, top architectural consultant Cox's Bazar, structural drawing services, technical drafting Bangladesh, building visualization 3D, building inspection Bangladesh, site supervision engineer Bangladesh, project management civil engineering, high rise building design Bangladesh, commercial tower design, eco-friendly building design Bangladesh, green architecture Bangladesh, sustainable engineering Bangladesh, coastal engineering Cox's Bazar, offshore construction consultant Bangladesh, reinforced concrete design Bangladesh, steel structure design, earthquake resistant design Bangladesh, foundation design Bangladesh, pile foundation Bangladesh, retaining wall design, drainage system design Bangladesh, road design Bangladesh, bridge engineering Bangladesh, urban planning Bangladesh, township development Cox's Bazar, real estate development Cox's Bazar, property development consultant, renovation engineer Cox's Bazar, house design Cox's Bazar, modern house design Bangladesh, duplex design Cox's Bazar, apartment design Bangladesh, condominium design, school building design Bangladesh, hospital design consultant Bangladesh, industrial building design Bangladesh, warehouse design Bangladesh, factory design Bangladesh, shopping mall design Bangladesh, mixed use development Bangladesh, affordable housing design Bangladesh, government project Bangladesh, infrastructure development Cox's Bazar, utility engineering Bangladesh, master planning Cox's Bazar, urban design Bangladesh, city planning consultant, structural audit Bangladesh, safety assessment building, pre-construction planning, feasibility study engineering, soil investigation consultant, geotechnical engineering Bangladesh, environmental engineering Cox's Bazar, water supply design Bangladesh, sewage design Bangladesh, fire safety engineering Bangladesh, electrical engineering coordination, mechanical engineering coordination, HVAC system building, project estimation Bangladesh, bill of quantities Bangladesh, rate analysis engineering, tender document preparation Bangladesh, as-built drawing Bangladesh, shop drawing preparation, civil engineering software Bangladesh, AutoCAD services, Revit architecture Bangladesh, SketchUp 3D modeling, structural analysis ETABS, SAP2000 structural analysis, BIM services Bangladesh, building information modeling Cox's Bazar, structural report Bangladesh, engineering certificate, NOC engineering Bangladesh, RAJUK approval Bangladesh, municipality approval Cox's Bazar, CDA approval Bangladesh, engineer stamp Bangladesh, engineering license Bangladesh, IQAC certification Bangladesh, IEB member Bangladesh, সিভিল ইঞ্জিনিয়ার কক্সবাজার, কাঠামোগত ইঞ্জিনিয়ারিং, স্থাপত্য নকশা বাংলাদেশ, ইঞ্জিনিয়ার আলম আশিক" />
      <meta name="author" content="Engr. Alam Ashik" />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="BD-10" />
      <meta name="geo.placename" content="Cox's Bazar" />
      <meta name="geo.position" content="21.4272;92.0058" />
      <meta name="ICBM" content="21.4272, 92.0058" />
      <link rel="canonical" href={absoluteUrl} />
      <link rel="alternate" hrefLang="en" href={absoluteUrl} />
      <link rel="alternate" hrefLang="bn" href={absoluteUrl} />
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Engr. Alam Ashik" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@alamashik" />
      <script type="application/ld+json">
        {JSON.stringify(schemaGraph)}
      </script>
    </Helmet>
  );
}
