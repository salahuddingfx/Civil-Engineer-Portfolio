const express = require("express");
const contentController = require("../controllers/content.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:type", contentController.list);
router.get("/:type/:id", contentController.getOne);
router.post("/:type", requireAdmin, contentController.create);
router.put("/:type/:id", requireAdmin, contentController.update);
router.delete("/:type/:id", requireAdmin, contentController.remove);

module.exports = router;
