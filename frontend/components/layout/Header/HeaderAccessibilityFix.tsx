// Accessibility fix for Header buttons
// Add these aria-labels to your existing Header.tsx buttons:

// Font button: add aria-label="Select font"
// Mobile menu button: add aria-label="Open menu" or "Close menu"
// Theme button: add aria-label="Toggle theme"
// Language button: add aria-label="Select language"

// Example:
// <button aria-label="Select font" className="control-button" ...>
// <button aria-label={isDashboardOpen ? "Close menu" : "Open menu"} className="mobile-menu-button" ...>
