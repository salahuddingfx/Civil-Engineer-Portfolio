import * as Icons from "lucide-react";

/**
 * Renders a Lucide icon by its name.
 * Falls back to a default icon if not found.
 */
const LucideIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

export default LucideIcon;
