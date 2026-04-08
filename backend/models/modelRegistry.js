const {
  HomeContent,
  AboutContent,
  Service,
  Project,
  Testimonial,
  GalleryItem,
  ContactDetail,
  ContactSubmission,
  SeoMeta,
} = require("./contentModels");

const registry = {
  home: HomeContent,
  about: AboutContent,
  services: Service,
  projects: Project,
  testimonials: Testimonial,
  gallery: GalleryItem,
  contactDetails: ContactDetail,
  contactSubmissions: ContactSubmission,
  seoMeta: SeoMeta,
};

module.exports = registry;
