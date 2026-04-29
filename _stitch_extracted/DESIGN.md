---
name: Cyber-Refined Narrative
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#fcf8f8'
  on-tertiary: '#313030'
  tertiary-container: '#dfdcdb'
  on-tertiary-container: '#616060'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.1em
  code-snippet:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  section-gap: 120px
  card-padding: 32px
---

## Brand & Style

This design system represents a sophisticated evolution of the "hacker" aesthetic, transitioning from raw terminal vibes to a high-end, architectural digital space. It is designed for a developer who balances deep technical mastery with a refined eye for professional polish.

The style is a synthesis of **Minimalism** and **Glassmorphism**, set against a high-contrast dark canvas. It avoids the cluttered "matrix" trope in favor of extreme clarity, utilizing ample negative space and purposeful neon accents to guide the user's eye. The emotional response is one of precision, intelligence, and modern authority. Visual interest is generated through crisp typography and subtle depth rather than heavy textures or decorative elements.

## Colors

The palette is anchored by a deep charcoal-to-black foundation (`#0A0A0A`), providing a "void" that makes content feel luminous. The primary accent is the **Vibrant Neon Green** (`#00FF41`), used sparingly for high-impact signals: calls to action, active states, and critical technical details. 

White (`#FFFFFF`) is reserved for high-priority typography to ensure maximum readability, while various shades of dark grey and semi-transparent layers are used for structural division. This restricted palette creates a focused, high-contrast environment that feels both high-tech and premium.

## Typography

The typographic strategy utilizes a "Technical vs. Functional" duality. **Space Grotesk** serves as the primary headline and label font; its geometric, slightly eccentric letterforms provide a modern, futuristic edge that references developer culture without being literal. 

**Inter** is employed for all body copy and long-form text. It is chosen for its neutrality and supreme legibility at small sizes, ensuring that the portfolio remains professional and accessible. Large headlines should use tight letter-spacing for a bold, editorial feel, while labels and technical tags should use wider tracking and uppercase styling to emphasize their role as metadata.

## Layout & Spacing

This design system uses a **fixed grid** model for desktop, centered within the viewport to create a structured, gallery-like feel. A 12-column grid provides the framework, but content is often offset or grouped to break the symmetry and avoid a generic look.

Spacing is generous. Massive vertical gaps (`section-gap`) separate content blocks, allowing each project or "thought" to breathe. The rhythm is based on an 8px base unit, ensuring consistency across margins, paddings, and component dimensions. High density is only permitted within technical data tables or code blocks; everywhere else, white space is treated as a premium design element.

## Elevation & Depth

Depth is conveyed through **glassmorphism** and **tonal layering** rather than traditional drop shadows. Surfaces do not "float" with shadows; they exist as translucent planes that subtly blur the content beneath them.

- **Level 1 (Base):** The core background (`#0A0A0A`).
- **Level 2 (Containers):** Semi-transparent surfaces (e.g., `rgba(255, 255, 255, 0.03)`) with a high-strength backdrop blur (20px+) and a very thin, low-opacity white border (0.5px) to define the edges.
- **Level 3 (Pop-overs):** Slightly more opaque layers used for tooltips or navigation menus, featuring a subtle green-tinted glow on hover to indicate interactivity.

## Shapes

The shape language is disciplined and "Soft-Industrial." By using a low roundedness level (`0.25rem`), the UI maintains the precision of a technical interface while feeling contemporary. 

Small tags and chips use the default `rounded`, while larger project cards use `rounded-lg` (0.5rem). Sharp corners are avoided to keep the interface from feeling aggressive, but large "pill" shapes are also excluded to prevent the design from looking too playful or consumer-oriented. Buttons and interactive elements follow this same rigorous geometric logic.

## Components

### Buttons
Primary buttons are solid Neon Green (`#00FF41`) with black text for maximum contrast. Secondary buttons are "Ghost" style, featuring a thin white border that shifts to green on hover. All buttons should have a subtle transition effect (200ms) on background and border color.

### Cards
Cards for projects or skills utilize the glassmorphism effect described in the Elevation section. They should feature a 1px border with 5-10% opacity white. On hover, the border opacity increases and the accent green is introduced as a top-border or small icon highlight.

### Chips & Tags
Technical skill tags use a monospaced font style. They should have a dark background (`#1A1A1A`) and white or green text. They are small, low-profile, and serve as metadata without distracting from the main content.

### Input Fields
Inputs are minimalist: a bottom-border only or a very subtle dark background. The focus state must be unmistakable, utilizing a neon green border and a slight "glow" effect (box-shadow) to simulate a light-emitting display.

### Navigation
The navigation bar should be a "floating" glass element anchored to the top of the screen, utilizing a strong backdrop blur to remain readable over any background content. Link items use Space Grotesk in uppercase for a clear, structural feel.