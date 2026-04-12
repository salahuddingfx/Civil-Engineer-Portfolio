const translateEngine = require("@iamtraction/google-translate");

/**
 * Translates text from English to Bengali using Google Translate API.
 */
async function translate(text, targetLang = "bn") {
  if (!text || typeof text !== 'string') return "";
  
  const cleanedText = text.trim();
  if (!cleanedText) return "";

  try {
    const result = await translateEngine(cleanedText, { to: targetLang });
    return result?.text || cleanedText;
  } catch (err) {
    console.error("[TRANSLATION_SERVICE_ERROR]", err.message);
    return cleanedText; 
  }
}

module.exports = { translate };
