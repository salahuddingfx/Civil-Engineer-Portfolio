const { z } = require("zod");
const { ContactSubmission } = require("../models/contentModels");

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  projectType: z.string().max(100).optional().default(""),
  message: z.string().min(10).max(2000),
  sourcePage: z.string().max(120).optional().default("contact"),
  website: z.string().optional().default(""),
});

async function submitContact(req, res, next) {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        details: parsed.error.issues,
      });
    }

    if (parsed.data.website) {
      return res.status(200).json({ message: "Submission received" });
    }

    const submission = await ContactSubmission.create(parsed.data);
    return res.status(201).json({ message: "Message sent", id: submission._id });
  } catch (error) {
    return next(error);
  }
}

module.exports = { submitContact };
