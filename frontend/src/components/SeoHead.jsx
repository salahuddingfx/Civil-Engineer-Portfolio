import { Helmet } from "react-helmet-async";

export default function SeoHead({
  title = "Civil Engineer in Cox's Bazar | Engr Alam Ashik",
  description = "Premium civil engineering, structural design, and consultancy services in Cox's Bazar.",
  path = "/",
  image = "/og-identity.jpg",
}) {
  const siteUrl = "https://engralamashik.com";
  const absoluteUrl = `${siteUrl}${path}`;
  
  // Ensure image is an absolute URL for cross-platform compatibility
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Base schema for the Website
  const schemaGraph = [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Engr Alam Ashik",
      alternateName: ["Alam Ashik", "Engineer Alam Ashik"],
      inLanguage: ["en", "bn"],
      publisher: { "@id": `${siteUrl}/#person` }
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Engr Alam Ashik",
      jobTitle: "Civil Engineer & Structural Consultant",
      url: siteUrl,
      image: `${siteUrl}/images/alam-ashik-profile.jpg`, // Placeholder - would be better if actual exists
      sameAs: [
        "https://facebook.com/ce.alam",
        "https://linkedin.com/in/engr-alam-ashik",
        "https://instagram.com/engr_alam_ashik",
        "https://twitter.com/Engr_Alam_Ashik"
      ],
      worksFor: { "@id": `${siteUrl}/#professional-service` }
    }
  ];

  // Add ProfessionalService only on Home Page
  if (path === "/") {
    schemaGraph.push({
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#professional-service`,
      name: "Engr Alam Ashik - Civil Engineering & Consultancy",
      image: absoluteImage,
      description: description,
      url: siteUrl,
      telephone: "+8801829618805",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cox's Bazar",
        addressRegion: "Chattogram",
        postalCode: "4700",
        addressCountry: "BD",
      },
      areaServed: [
        { "@type": "Country", name: "Bangladesh" },
        { "@type": "City", name: "Cox's Bazar" },
        { "@type": "City", name: "Dhaka" },
        { "@type": "City", name: "Chattogram" }
      ],
      founder: { "@id": `${siteUrl}/#person` },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Engineering Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Structural Design" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Architectural Consultancy" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "CAD Visualization" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Project Supervision" } }
        ]
      }
    });
  }

  // Add Breadcrumbs for subpages
  if (path !== "/") {
    const pageName = path.replace("/", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    schemaGraph.push({
      "@type": "BreadcrumbList",
      "@id": `${absoluteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageName,
          item: absoluteUrl
        }
      ]
    });
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="civil engineer Bangladesh, structural engineer Bangladesh, architectural design Bangladesh, Engr Alam Ashik, engineering consultancy Bangladesh, building design Bangladesh, 3D architectural design, structural consultancy Bangladesh, Cox's Bazar civil engineer, best engineer Bangladesh, sustainable construction Bangladesh, building safety audit" />
      <meta name="author" content="Engr Alam Ashik" />
      <meta name="application-name" content="Engr Alam Ashik" />
      <meta name="apple-mobile-web-app-title" content="Engr Alam Ashik" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={absoluteUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="Engr Alam Ashik" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:site" content="@alamashik" />
      <meta name="twitter:creator" content="@alamashik" />
      <script type="application/ld+json">
        {JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph })}
      </script>
    </Helmet>
  );
}
