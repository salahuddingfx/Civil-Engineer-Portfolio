/**
 * Simple Dictionary-based Translation Service for Engineering Terms
 * (Mocking a real translation engine for demonstration purposes)
 */

const DICTIONARY = {
  "Structural Engineering": "কাঠামোগত ইঞ্জিনিয়ারিং",
  "Architectural Planning": "স্থাপত্য পরিকল্পনা",
  "3D BIM & Visualization": "থ্রিডি বিআইএম এবং ভিজুয়ালাইজেশন",
  "Foundation Engineering": "ফাউন্ডেশন ইঞ্জিনিয়ারিং",
  "MEP Solutions": "এমইপি সমাধান",
  "Interior Architecture": "ইন্টেরিয়র আর্কিটেকচার",
  "Cost Estimation & QA": "প্রকল্প অনুমান এবং কিউএ",
  "Residential": "আবাসিক",
  "Commercial": "বাণিজ্যিক",
  "Hospitality": "আতিথেয়তা",
  "Infrastructure": "অবকাঠামো",
  "Principal Structural Engineer": "প্রধান কাঠামোগত ইঞ্জিনিয়ার",
  "AutoCAD": "অটোক্যাড",
  "ETABS": "ইট্যাবস",
  "SAP2000": "স্যাপ২০০০",
  "SAFE": "সেফ",
  "Revit BIM": "রেভিট",
  "SketchUp": "স্কেচআপ",
  "Cox's Bazar": "কক্সবাজার",
  "Established": "প্রতিষ্ঠিত",
  "Experience": "অভিজ্ঞতা",
  "Project": "প্রকল্প",
  "Asset": "সম্পদ",
  "Strategic": "কৌশলগত",
  "Analysis": "বিশ্লেষণ"
};

/**
 * Translates text from English to Bengali.
 * In a production environment, this would call Google Translate / DeepL etc.
 */
async function translate(text, targetLang = "bn") {
  if (!text) return "";
  
  // Basic mock translation: If it's in our dictionary, return it.
  // Otherwise, return a slightly modified version to simulate "processing"
  const cleanedText = text.trim();
  if (DICTIONARY[cleanedText]) {
    return DICTIONARY[cleanedText];
  }

  // If not in dictionary, we "simulate" a translation by appending a message
  // (In real life, we would use an API here)
  return `${cleanedText} (Bengali Translation)`; 
}

module.exports = { translate };
