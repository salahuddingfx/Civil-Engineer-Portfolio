const mongoose = require("mongoose");

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    bn: { type: String, default: "" },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: localizedTextSchema, default: () => ({}) },
    description: { type: localizedTextSchema, default: () => ({}) },
    canonicalUrl: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    twitterImage: { type: String, default: "" },
    jsonLd: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    alt: { type: localizedTextSchema, default: () => ({}) },
  },
  { _id: false }
);

const baseContent = {
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: localizedTextSchema, default: () => ({}) },
  summary: { type: localizedTextSchema, default: () => ({}) },
  body: { type: localizedTextSchema, default: () => ({}) },
  quote: { type: localizedTextSchema, default: () => ({}) },
  category: { type: String, default: "general" },
  tags: [{ type: String }],
  featuredImage: { type: imageSchema, default: null },
  gallery: { type: [imageSchema], default: [] },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  order: { type: Number, default: 0 },
  experience: { type: String, default: "" },
  isPublished: { type: Boolean, default: true },
  seo: { type: seoSchema, default: () => ({}) },
};

const modelOptions = { timestamps: true };

const homeSchema = new mongoose.Schema(baseContent, modelOptions);
const HomeContent = mongoose.model("HomeContent", homeSchema);

const aboutSchema = new mongoose.Schema(baseContent, modelOptions);
const AboutContent = mongoose.model("AboutContent", aboutSchema);

const serviceSchema = new mongoose.Schema(baseContent, modelOptions);
serviceSchema.index({ isPublished: 1, category: 1, order: 1, createdAt: -1 });
serviceSchema.index({ isPublished: 1, order: 1, createdAt: -1 });
const Service = mongoose.model("Service", serviceSchema);

const projectSchema = new mongoose.Schema(baseContent, modelOptions);
projectSchema.index({ isPublished: 1, category: 1, order: 1, createdAt: -1 });
projectSchema.index({ isPublished: 1, order: 1, createdAt: -1 });
const Project = mongoose.model("Project", projectSchema);

// Expanded Testimonial with Featured status
const testimonialSchema = new mongoose.Schema({
  ...baseContent,
  isFeatured: { type: Boolean, default: false }
}, modelOptions);
testimonialSchema.index({ isPublished: 1, isFeatured: -1, order: 1 });
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

const gallerySchema = new mongoose.Schema(baseContent, modelOptions);
gallerySchema.index({ isPublished: 1, category: 1, order: 1 });
const GalleryItem = mongoose.model("GalleryItem", gallerySchema);

// New Micro-Management Models
const skillSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: localizedTextSchema, default: () => ({}) },
  category: { type: String, default: "technical" }, // technical, software, soft-skills
  proficiency: { type: Number, default: 80 },
  icon: { type: String, default: "Code" }, // Lucide icon name
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, modelOptions);
skillSchema.index({ isPublished: 1, category: 1, order: 1 });
const Skill = mongoose.model("Skill", skillSchema);

const timelineSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  title: { type: localizedTextSchema, default: () => ({}) },
  description: { type: localizedTextSchema, default: () => ({}) },
  category: { type: String, default: "Experience" }, // Education, Experience, Award
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, modelOptions);
timelineSchema.index({ isPublished: 1, category: 1, order: 1 });
const TimelineEntry = mongoose.model("TimelineEntry", timelineSchema);

const teamMemberSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: localizedTextSchema, default: () => ({}) },
  bio: { type: localizedTextSchema, default: () => ({}) },
  image: { type: imageSchema, default: null },
  socialLinks: {
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, modelOptions);
const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

const contactDetailSchema = new mongoose.Schema(
  {
    slug: { type: String, default: "primary", unique: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    whatsappEnabled: { type: Boolean, default: true },
    whatsappLabel: { type: String, default: "WhatsApp Chat" },
    address: { type: localizedTextSchema, default: () => ({}) },
    googleMapEmbedUrl: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    isPublished: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  modelOptions
);
const ContactDetail = mongoose.model("ContactDetail", contactDetailSchema);

const ContactSubmission = mongoose.model(
  "ContactSubmission",
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, default: "", trim: true },
      projectType: { type: String, default: "", trim: true },
      message: { type: String, required: true, trim: true },
      sourcePage: { type: String, default: "contact" },
      status: { type: String, enum: ["new", "seen", "resolved"], default: "new" },
    },
    modelOptions
  )
);

const seoMetaSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    pagePath: { type: String, required: true, trim: true },
    seo: { type: seoSchema, default: () => ({}) },
    isPublished: { type: Boolean, default: true },
  },
  modelOptions
);
const SeoMeta = mongoose.model("SeoMeta", seoMetaSchema);

const sectionBlockSchema = new mongoose.Schema(
    {
      slug: { type: String, required: true, unique: true, trim: true },
      page: { type: String, required: true, default: "global" },
      section: { type: String, required: true },
      title: { type: localizedTextSchema, default: () => ({}) },
      subtitle: { type: localizedTextSchema, default: () => ({}) },
      body: { type: localizedTextSchema, default: () => ({}) },
      value: { type: String, default: "" },
      suffix: { type: String, default: "" },
      icon: { type: String, default: "" },
      image: { type: imageSchema, default: null },
      order: { type: Number, default: 0 },
      isPublished: { type: Boolean, default: true },
    },
    modelOptions
  );
sectionBlockSchema.index({ isPublished: 1, page: 1, order: 1 });
const SectionBlock = mongoose.model("SectionBlock", sectionBlockSchema);

module.exports = {
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
};
