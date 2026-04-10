const {
  HomeContent,
  AboutContent,
  Service,
  Project,
  Testimonial,
  GalleryItem,
  Skill,
  TimelineEntry,
  TeamMember,
  ContactDetail,
  ContactSubmission,
  SeoMeta,
  SectionBlock,
} = require("./contentModels");

const registry = {
  home: HomeContent,
  about: AboutContent,
  services: Service,
  projects: Project,
  testimonials: Testimonial,
  gallery: GalleryItem,
  skills: Skill,
  timelineEntries: TimelineEntry,
  teamMembers: TeamMember,
  contactDetails: ContactDetail,
  contactSubmissions: ContactSubmission,
  seoMeta: SeoMeta,
  sectionBlocks: SectionBlock,
};

module.exports = registry;
