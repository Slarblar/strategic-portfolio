/**
 * Simplified Color Scheme Types for Archive Cards
 * 
 * Uses existing tailwind colors for consistency:
 * - Olive: #465902 (tailwind olive)
 * - Orange: #FF5C1A (tailwind orange)  
 * - Rust: #591902 (tailwind dark-rust)
 * - Sky: #ACC2FF (tailwind sky)
 * - Stone: #7D8A8A (tailwind stone)
 */

export interface ColorSchemeButton {
  /** Button background color (subtle) */
  bg: string;
  /** Button hover background color (bold complementary) */
  hover: string;
  /** Button hover text color (high contrast) */
  hoverText: string;
}

export interface ColorScheme {
  /** Display name for the color scheme */
  name: string;
  /** Primary background color (hex) - from tailwind config */
  background: string;
  /** Primary text color (hex) - ink or cream for accessibility */
  text: string;
  /** Button styling configuration */
  button: ColorSchemeButton;
}

export type ColorSchemeKey = 'olive' | 'orange' | 'rust' | 'sky' | 'stone';

export interface ColorSchemes {
  olive: ColorScheme;
  orange: ColorScheme;
  rust: ColorScheme;
  sky: ColorScheme;
  stone: ColorScheme;
}

export interface ArchiveCardProps {
  /** Project data object */
  project: {
    id?: string;
    title: string;
    type?: 'CASE_STUDY' | 'PROJECT' | 'EXPERIMENT';
    size?: 'large' | 'small';
    categories?: string[];
    description?: string;
    metrics?: string[];
    technologies?: string[];
    images?: string[];
    videoId?: string;
    videoType?: string;
    caseStudyUrl?: string;
    year?: number;
    /** Optional: Override automatic color scheme selection */
    colorScheme?: ColorSchemeKey;
  };
  /** Card index for staggered animations */
  index: number;
  /** Whether card is in viewport for animations */
  inView: boolean;
  /** Optional year metadata for archive context */
  yearData?: {
    dateAdded?: string;
    [key: string]: any;
  };
  /** Callback for element selection */
  onElementSelect?: (element: HTMLElement, selected: boolean) => void;
  /** Optional: Override automatic color scheme selection */
  colorScheme?: ColorSchemeKey;
}

/**
 * Simplified color scheme assignment rules:
 * 
 * CASE STUDIES (by primary category):
 * - animation, design → Olive
 * - development, web3, hardware → Orange  
 * - strategy, leadership, operations → Rust
 * - default → Sky
 * 
 * EXPERIMENTS:
 * - All → Stone
 * 
 * PROJECTS (by size and category):
 * - Large + development/tech → Orange
 * - Large + design/branding → Olive  
 * - Large + default → Rust
 * - Small + design/branding → Stone
 * - Small + default → Sky
 */ 