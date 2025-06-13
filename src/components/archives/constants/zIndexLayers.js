// Z-Index Layer Constants for Archives Page
// This ensures proper layering and prevents overlay issues

export const Z_INDEX = {
  // Background layer
  BACKGROUND: 0,
  
  // Selected element highlight (behind all foreground elements)
  SELECTED_HIGHLIGHT: -1,
  
  // Main content layer
  CONTENT: 10,
  
  // Cards and interactive elements
  CARDS: 20,
  
  // Navigation and year markers
  NAVIGATION: 30,
  
  // Filter overlay backdrop
  OVERLAY_BACKDROP: 30,
  
  // Fixed UI elements (timeline, labels)
  FIXED_UI: 40,
  
  // Dropdowns and overlays
  OVERLAYS: 50,
  
  // Modals and top-level UI
  MODALS: 999999
};

// Helper function to get z-index value
export const getZIndex = (layer) => Z_INDEX[layer] || 0; 