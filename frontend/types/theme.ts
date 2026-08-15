// types/theme.ts
export type Theme = 
  | 'professional-blue'
  | 'corporate-green'
  | 'premium-purple'
  | 'luxury-gold'
  | 'minimal-gray'
  | 'tech-cyan'
  | 'nature-green'
  | 'ocean-blue'
  | 'sunset-orange'
  | 'midnight-purple'
  | 'rose-pink'
  | 'vibrant-red'
  | 'cool-teal';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

export interface ThemeWithMetadata extends ThemeColors {
  name: string;
  category: string;
  icon: string;
  description: string;
  dark?: ThemeColors;
}

export interface ThemeConfigWithoutMetadata {
  [key: string]: ThemeColors;
}

export interface ThemeConfigWithMetadata {
  [key: string]: ThemeWithMetadata;
}

export interface ThemeOption {
  value: Theme;
  label: string;
  category: string;
  icon: string;
  description: string;
}

export interface FontOption {
  value: string;
  label: string;
}