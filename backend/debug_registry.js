const registry = require("./models/modelRegistry");
console.log("Registry Keys:", Object.keys(registry));
console.log("Skills Model:", registry.skills ? "LOADED" : "MISSING");
process.exit(0);
