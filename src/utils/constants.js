import { Home, FileText, Star, Trash2 } from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { icon: Home, label: "Home", active: true },
  { icon: FileText, label: "All Pages" },
  { icon: Star, label: "Favorites" },
  { icon: Trash2, label: "Trash" }
];

export const PRIVATE_PAGES = [
  { icon: "🔒", label: "DSA" },
  { icon: "📝", label: "Quick Note" },
  { icon: "🏠", label: "Personal Home" },
  { icon: "✅", label: "Task List" },
  { icon: "📖", label: "Journal" }
];

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};