const registry = require("../models/modelRegistry");

function getModel(type) {
  console.log(`[GET_MODEL] Requested: "${type}" | Available Keys: ${Object.keys(registry)}`);
  const model = registry[type];
  if (!model) {
    console.error(`[GET_MODEL_ERROR] Type "${type}" not found in registry.`);
    const error = new Error(`Unknown content type: ${type}`);
    error.statusCode = 400;
    throw error;
  }
  return model;
}

async function list(req, res, next) {
  try {
    const model = getModel(req.params.type);
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 12), 100);
    const skip = (page - 1) * limit;
    const q = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    const onlyPublished = req.query.published === "true";

    const filter = {};
    if (q) {
      filter.$or = [
        { "title.en": { $regex: q, $options: "i" } },
        { "title.bn": { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (onlyPublished) {
      filter.isPublished = true;
    }

    const [items, total] = await Promise.all([
      model.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      model.countDocuments(filter),
    ]);

    return res.json({
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
}

async function getOne(req, res, next) {
  try {
    const model = getModel(req.params.type);
    const item = await model.findById(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.json(item);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const model = getModel(req.params.type);
    const item = await model.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const model = getModel(req.params.type);
    const item = await model.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const model = getModel(req.params.type);
    const item = await model.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
};
