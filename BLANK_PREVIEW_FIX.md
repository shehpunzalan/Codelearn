# Blank Preview Diagnostic & Fix

## Current Status

I've created a **minimal test app** to diagnose the blank preview issue. The app is now using:

```
/src/app/App-minimal.tsx
```

This minimal version:
- ✅ Uses design system CSS variables
- ✅ Has no complex imports
- ✅ Tests React rendering
- ✅ Tests state management
- ✅ Tests event handling
- ✅ Shows visual confirmation if working

---

## What You Should See

If the preview is working, you'll see:

1. **Large heading**: "CodeLearn AI"
2. **Status indicators**: React working, CSS Variables loaded
3. **Interactive button**: Click to test counter
4. **Green success box**: Design System Variables Active

---

## Troubleshooting Steps

### Step 1: Check the Preview

**If you see the test app:**
✅ **Good news!** React is rendering correctly. The issue is with the full app imports.

**Action:** Open browser console (F12) and look for errors. They'll tell us which component is breaking.

**If you see nothing (blank):**
❌ The issue is with the build/preview system, not the code.

**Action:** Try these in order:
1. Hard refresh the preview (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Check if JavaScript is enabled

---

### Step 2: Check Browser Console

Open Developer Tools (F12) and look for:

**Common errors to look for:**
- `Cannot find module` → Missing import
- `Unexpected token` → Syntax error
- `undefined is not a function` → Missing dependency
- CSS loading errors → Style import issues

---

### Step 3: Switch Back to Full App

Once the minimal app is working, we can switch back:

**Edit `__figma__entrypoint__.ts`:**
```typescript
export const Code0_8 = () => import('./src/app/App.tsx');
```

Then check console for which component is failing.

---

## Files Changed for Diagnosis

### 1. `/src/app/App-minimal.tsx` (NEW)
Minimal React app with:
- Basic state management
- CSS variable usage
- Interactive elements
- Visual status indicators

### 2. `/src/styles/globals.css` (UPDATED)
Added complete design system variables:
- Color palette (primary, secondary, success, error, warning, neutral)
- Spacing scale (0-24)
- Border radius (none to full)
- Typography (sans, mono fonts)

### 3. `/src/styles/fonts.css` (UPDATED)
Added font family definitions:
- System font stack for sans-serif
- Monospace font stack for code
- Applied to body and code elements

### 4. `__figma__entrypoint__.ts` (UPDATED)
Temporarily using minimal app for testing.

### 5. `/src/app/App.tsx` (UPDATED)
Added better error handling:
- Try-catch around render
- Console logging for debugging
- Fallback error UI

---

## Design System Variables Available

All components can now use:

### Colors
```css
var(--color-primary-500)     /* #3b82f6 */
var(--color-primary-600)     /* #2563eb */
var(--color-success-500)     /* #22c55e */
var(--color-error-500)       /* #ef4444 */
var(--color-warning-500)     /* #f97316 */
var(--color-text-primary)    /* #111827 */
var(--color-text-secondary)  /* #6b7280 */
```

### Spacing
```css
var(--spacing-2)  /* 0.5rem */
var(--spacing-4)  /* 1rem */
var(--spacing-6)  /* 1.5rem */
var(--spacing-8)  /* 2rem */
```

### Border Radius
```css
var(--radius-sm)   /* 0.375rem */
var(--radius-md)   /* 0.5rem */
var(--radius-lg)   /* 0.75rem */
var(--radius-full) /* 9999px */
```

### Typography
```css
font-family: var(--font-sans);   /* System font stack */
font-family: var(--font-mono);   /* Monospace stack */
```

---

## Next Steps

1. **Check if minimal app renders** in the preview
2. **Open browser console** (F12) to check for errors
3. **Report what you see:**
   - Does the minimal app render?
   - Any errors in console?
   - What happens when you refresh?

This will help determine if the issue is:
- **Code-related** (component import errors)
- **Build-related** (Vite/bundler issues)
- **Preview-related** (Figma Make platform issues)

---

## Contact Info

Once you check the preview and console, let me know:
1. ✅ or ❌ Can you see the minimal app?
2. 📋 Any errors in the console?
3. 🔍 What happens on hard refresh?

I'll then guide you through the next steps to get the full app running!
