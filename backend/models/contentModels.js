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
  category: { type: String, default: "general" },
  tags: [{ type: String }],
  featuredImage: { type: imageSchema, default: null },
  gallery: { type: [imageSchema], default: [] },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  seo: { type: seoSchema, default: () => ({}) },
};

const modelOptions = { timestamps: true };

const HomeContent = mongoose.model("HomeContent", new mongoose.Schema(baseContent, modelOptions));
const AboutContent = mongoose.model("AboutContent", new mongoose.Schema(baseContent, modelOptions));
const Service = mongoose.model("Service", new mongoose.Schema(baseContent, modelOptions));
const Project = mongoose.model("Project", new mongoose.Schema(baseContent, modelOptions));
const Testimonial = mongoose.model("Testimonial", new mongoose.Schema(baseContent, modelOptions));
const GalleryItem = mongoose.model("GalleryItem", new mongoose.Schema(baseContent, modelOptions));

const ContactDetail = mongoose.model(
  "ContactDetail",
  new mongoose.Schema(
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
        youtube: { type: String, default: "" },
      },
      isPublished: { type: Boolean, default: true },
      seo: { type: seoSchema, default: () => ({}) },
    },
    modelOptions
  )
);

const ContactSubmission = mongoose.model(
  "ContactSubmission",
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, default: "", trim: true },
      message: { type: String, required: true, trim: true },
      sourcePage: { type: String, default: "contact" },
      status: { type: String, enum: ["new", "seen", "resolved"], default: "new" },
    },
    modelOptions
  )
);

const SeoMeta = mongoose.model(
  "SeoMeta",
  new mongoose.Schema(
    {
      slug: { type: String, required: true, unique: true, trim: true },
      pagePath: { type: String, required: true, trim: true },
      seo: { type: seoSchema, default: () => ({}) },
      isPublished: { type: Boolean, default: true },
    },
    modelOptions
  )
);

module.exports = {
  HomeContent,
  AboutContent,
  Service,
  Project,
  Testimonial,
  GalleryItem,
  ContactDetail,
  ContactSubmission,
  SeoMeta,
};
