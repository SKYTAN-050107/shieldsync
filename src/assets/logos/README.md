# Theme-Specific Logos

Place theme-specific logo variations in this directory:

## Files Needed:

1. **logo-light.svg** - Logo for light backgrounds
   - Dark text/icon for contrast
   - Used in light mode

2. **logo-dark.svg** - Logo for dark backgrounds (optional)
   - Light text/icon for contrast
   - Used in dark mode (if implementing dark theme)

## Usage:

These logos will be imported in React components and displayed based on the current theme.

Example:
```jsx
import logoLight from './assets/logos/logo-light.svg'
import logoDark from './assets/logos/logo-dark.svg'

// Use based on theme
<img src={isDarkMode ? logoDark : logoLight} alt="ShieldSync" />
```

## Note:

If you only create one logo, just use the same file for both light and dark variants.
