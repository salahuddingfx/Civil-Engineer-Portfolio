import { Helmet } from "react-helmet-async";

export default function SeoHead({
  title = "Civil Engineer in Cox's Bazar | Engr Alam Ashik",
  description = "Premium civil engineering, structural design, and consultancy services in Cox's Bazar.",
  path = "/",
  image = "/og-identity.jpg",
}) {
  const siteUrl = "https://engralamashik.com";
  const absoluteUrl = `${siteUrl}${path}`;
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#local-business`,
        name: "Engr Alam Ashik - Civil Engineering Services",
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
        name: "Engr Alam Ashik",
        inLanguage: ["en", "bn"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#professional-service`,
        name: "Engr Alam Ashik Studio",
        url: siteUrl,
        logo: image,
      },
    ],
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="civil engineer Cox's Bazar, structural engineer Cox's Bazar, architectural design Cox's Bazar, Engr Alam Ashik, Alam Ashik, engineering consultancy Cox's Bazar, building design Bangladesh, structural consultancy Bangladesh, residential design Cox's Bazar, commercial building Cox's Bazar, construction supervision Bangladesh, CAD drawing Cox's Bazar, 3D architectural design, blueprint design Cox's Bazar, foundation engineering, load bearing design, building permit consultant Bangladesh, interior design Cox's Bazar, luxury villa design, hotel architecture Cox's Bazar, resort design Bangladesh, coastal construction consultancy, marine drive development Cox's Bazar, Chattogram civil engineer, Cox's Bazar construction, structural integrity consultant, engineering firm Bangladesh, architectural firm Bangladesh, best civil engineer Bangladesh, top architectural consultant Cox's Bazar, structural drawing services, technical drafting Bangladesh, building visualization 3D, building inspection Bangladesh, site supervision engineer Bangladesh, project management civil engineering, high rise building design Bangladesh, commercial tower design, eco-friendly building design Bangladesh, green architecture Bangladesh, sustainable engineering Bangladesh, coastal engineering Cox's Bazar, offshore construction consultant Bangladesh, reinforced concrete design Bangladesh, steel structure design, earthquake resistant design Bangladesh, foundation design Bangladesh, pile foundation Bangladesh, retaining wall design, drainage system design Bangladesh, road design Bangladesh, bridge engineering Bangladesh, urban planning Bangladesh, township development Cox's Bazar, real estate development Cox's Bazar, property development consultant, renovation engineer Cox's Bazar, house design Cox's Bazar, modern house design Bangladesh, duplex design Cox's Bazar, apartment design Bangladesh, condominium design, school building design Bangladesh, hospital design consultant Bangladesh, industrial building design Bangladesh, warehouse design Bangladesh, factory design Bangladesh, shopping mall design Bangladesh, mixed use development Bangladesh, affordable housing design Bangladesh, government project Bangladesh, infrastructure development Cox's Bazar, utility engineering Bangladesh, master planning Cox's Bazar, urban design Bangladesh, city planning consultant, structural audit Bangladesh, safety assessment building, pre-construction planning, feasibility study engineering, soil investigation consultant, geotechnical engineering Bangladesh, environmental engineering Cox's Bazar, water supply design Bangladesh, sewage design Bangladesh, fire safety engineering Bangladesh, electrical engineering coordination, mechanical engineering coordination, HVAC system building, project estimation Bangladesh, bill of quantities Bangladesh, rate analysis engineering, tender document preparation Bangladesh, as-built drawing Bangladesh, shop drawing preparation, civil engineering software Bangladesh, AutoCAD services, Revit architecture Bangladesh, SketchUp 3D modeling, structural analysis ETABS, SAP2000 structural analysis, BIM services Bangladesh, building information modeling Cox's Bazar, structural report Bangladesh, engineering certificate, NOC engineering Bangladesh, RAJUK approval Bangladesh, municipality approval Cox's Bazar, CDA approval Bangladesh, engineer stamp Bangladesh, engineering license Bangladesh, IQAC certification Bangladesh, IEB member Bangladesh, best engineer in Cox's Bazar, top architectural firm Chittagong, structural design cost Bangladesh, architectural plan price Bangladesh, house drawing services Cox's Bazar, professional civil engineer Chittagong, affordable building design Bangladesh, luxury apartment architecture Bangladesh, duplex house design ideas Bangladesh, modern duplex plan Cox's Bazar, multi-storied building design Bangladesh, industrial steel structure design, warehouse construction consultant, factory planning Bangladesh, bridge inspection engineer, sustainable road design Bangladesh, low cost housing Bangladesh, rural housing design Bangladesh, villa architecture Cox's Bazar, bungalow design Bangladesh, penthouse design Bangladesh, rooftop garden design Bangladesh, landscaping services Cox's Bazar, MEP design coordination, plumbing drawing services Bangladesh, electrical layout design building, fire fighting system design Bangladesh, building automation consultant, smart home design Bangladesh, earthquake safety audit Bangladesh, building crack analysis, structural retrofitting Bangladesh, building extension engineer, renovation consultant Cox's Bazar, interior decorator Cox's Bazar, office interior design Bangladesh, restaurant interior design Bangladesh, retail shop design Bangladesh, showroom architecture Bangladesh, car showroom design, bank building architecture, mosque design architecture Bangladesh, religious building architecture, community center design Bangladesh, standard building code BNBC, BNBC 2020 compliance, building safety consultant, workplace safety engineering, civil engineering career Bangladesh, IEB membership guide, IEB Cox's Bazar,偏Chittagong engineering events, Cox's Bazar development plans, Cox's Bazar smart city project, Marine Drive architectural landscape, tourism infra design Bangladesh, beach resort architecture world class, eco-resort planning Bangladesh, floating restaurant design, waterfront development engineering, jetty construction consultant, breakwater design Bangladesh, coastal embankment engineering, cyclon shelter design Bangladesh, disaster resilient architecture Bangladesh, temporary structure design, exhibition stall design Bangladesh, modular housing Bangladesh, pre-fab house design Bangladesh, steel building consultant Bangladesh, iron structure design, aluminum structure design, glass facade architecture Bangladesh, curtain wall design, energy efficient building Bangladesh, solar power building design, greywater recycling design, rainwater harvesting engineering, soil test company Cox's Bazar, digital survey Bangladesh, land measurement services, property valuation consultant Bangladesh, legal building document consultant, flat registration guide Bangladesh, plot development engineering, boundary wall design, swimming pool design Bangladesh, gymnasium interior design, library architecture Bangladesh, library design consultant, university campus planning, college building design, school infrastructure development, kindergarten design Bangladesh, play school architecture, urban renewal project Bangladesh, historic building restoration, museum design architecture, gallery design consultant, auditorium engineering, cinema hall design Bangladesh, theater architecture, stadium design consultant, sports complex planning Bangladesh, park design services, playground engineering, public space design, bus terminal design Bangladesh, railway station architecture, airport infrastructure engineering, harbor design consultant, port engineering Bangladesh, dredging project consultant, irrigation engineering Bangladesh, canal design services, dam engineering consultant, water treatment plant design, wastewater management engineering, solid waste management consultant, urban drainage system design, flood control engineering, hydrology consultant Bangladesh, geotechnical report analysis, structural stability certificate, building legal permit advisor, house plan approval Cox's Bazar, building plan signature engineer, blueprint print services Cox's Bazar, architectural walk through 3D, virtual tour architecture, augmented reality building design, drone survey engineering, BIM level 2 services Bangladesh, 4D construction scheduling, 5D costestimation, 6D sustainability BIM, property management systems, bridge maintenance engineer, road pavement design, flexible pavement design, rigid pavement design, highway engineering Bangladesh, traffic engineering consultant, transportation planning Bangladesh, logistics park design, cold storage engineering, poultry farm design Bangladesh, dairy farm planning, agricultural building design, greenhouse engineering, vertical farming building design, sustainable farm design, rural development engineer, village planning Bangladesh, PWD schedule of rates, LGED project consultant, EED project engineer, RHD structural design, MES project engineering, building maintenance services, property repair consultant, building dampness treatment, structural reinforcement services, carbon fiber wrapping building, epoxy injection structural, foundation underpinning services, soil stabilization engineering, ground improvement consultant, sand compaction piling, pre-cast pile design, bored pile engineering, mat foundation design, combined footing design, strap footing design, eccentric loading analysis, wind load analysis Bangladesh, cyclone wind speed design, seismic zone 3 building design, seismic zone 2 architecture, base isolation design, fluid viscous damper building, tuned mass damper engineering, structural dynamics consultant, finite element analysis services, linear static analysis, non-linear dynamic analysis, performance based design, resilience engineering Bangladesh, sustainable construction materials, recycled concrete engineering, bamboo architecture Bangladesh, low carbon building design, zero energy building Bangladesh, passive house design, engineering ethics Bangladesh, professional liability insurance engineer, building insurance consultant, project risk management, construction safety protocol, HSE engineer Bangladesh, structural consultant for renovators, architectural advisor for homeowners, best architect for modern house, top civil engineering firm in Bangladesh, ইঞ্জিনিয়ার আলম আশিক আর্কিটেক্ট, স্ট্রাকচারাল ডিজাইনার কক্সবাজার, আধুনিক বাড়ির নকশা, সিভিল ইঞ্জিনিয়ারিং কনালটেন্সি, বিল্ডিং ডিজাইন রেট বাংলাদেশ" />
      <meta name="author" content="Engr Alam Ashik" />
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
      <meta property="og:site_name" content="Engr Alam Ashik" />
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
