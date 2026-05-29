# App Rendering Checklist

## 🎯 Current Configuration

Your app is configured to load the **full App.tsx** with all features:
- ✅ Login/Register screens
- ✅ Student/Instructor dashboards
- ✅ 10 Java OOP modules with 47 lesson quizzes
- ✅ Database connection test UI
- ✅ Settings and progress tracking

**Entrypoint:** `__figma__entrypoint__.ts` → `src/app/App.tsx`

---

## 🔍 What to Check Now

### 1. Open Preview Window
   - Do you see **anything** at all?
   - Is it completely blank/white?
   - Is there a loading spinner?
   - Is there an error message?

### 2. Open Browser Console (F12)
   Press F12 in the preview window and check:

   **Console Tab - Look for:**
   ```
   ✅ GOOD: 🎯 App function called - CodeLearn AI starting
   ✅ GOOD: 📦 React: 18.3.1
   ✅ GOOD: 🚀 AppContent rendering
   ✅ GOOD: ⏳ App initializing... OR 🔐 Rendering login screen

   ❌ BAD: Any red error messages
   ❌ BAD: "Cannot find module"
   ❌ BAD: "undefined is not a function"
   ❌ BAD: Blank console (nothing logging at all)
   ```

   **Network Tab - Look for:**
   - Are JavaScript files loading? (App.tsx, components, etc.)
   - Any 404 errors? (missing files)
   - Any failed requests with red status codes?

### 3. Check Preview Frame
   - Is the preview frame visible in Figma Make?
   - Try resizing the frame
   - Check if there's a scrollbar
   - Try clicking in the frame area

---

## 🚨 Common Issues & Solutions

### Issue 1: Completely Blank (Nothing Renders)

**Symptoms:**
- White/blank preview
- No console messages at all
- Network tab shows no activity

**Likely Cause:** Build system issue or JavaScript disabled

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check if JavaScript is enabled in browser
3. Try different browser
4. Clear browser cache completely
5. Check Figma Make preview settings

---

### Issue 2: Console Shows Errors

**Symptoms:**
- Preview may be blank OR shows partial content
- Red error messages in console
- Stack traces visible

**Likely Cause:** Component import/rendering error

**Solutions:**
1. Read the error message carefully - it tells you which component failed
2. Check the file mentioned in the stack trace
3. Common errors:
   - `Cannot read property 'X' of undefined` → Missing data
   - `Cannot find module 'Y'` → Wrong import path
   - `Unexpected token` → Syntax error
   - `X is not defined` → Missing import

**Report to me:**
- Screenshot of the error
- Full error message text
- File names mentioned in error

---

### Issue 3: Loading Spinner Stuck

**Symptoms:**
- Preview shows "Loading CodeLearn AI..." forever
- Console shows initialization messages but no login screen

**Likely Cause:** useState initialization issue

**Solutions:**
1. Check console for any errors
2. Check if localStorage is accessible
3. Try clearing localStorage: 
   ```javascript
   // In console:
   localStorage.clear()
   location.reload()
   ```

---

### Issue 4: Error Screen Shows

**Symptoms:**
- Red background
- Error message displayed
- "Reload Application" button

**Likely Cause:** Component threw error during render

**Solutions:**
1. Click "Show error details" to see stack trace
2. Look for which component/file caused error
3. Report error message to me

---

## 🧪 Test Alternative Component

If the main app won't load, you can test with a minimal component:

### Switch to Safety Check:

Edit `__figma__entrypoint__.ts`:
```typescript
export const Code0_8 = () => import('./src/app/SafetyCheck.tsx');
```

This ultra-minimal component will **definitely** render if:
- ✅ React is working
- ✅ Build system is functional
- ✅ Preview can display content

**If SafetyCheck renders:** The issue is in App.tsx or its dependencies
**If SafetyCheck doesn't render:** The issue is with the build/preview system

---

## 🎨 Design System Verification

Once the app loads, verify design system is working:

### Check in Browser DevTools:

1. **Right-click** any element → **Inspect**
2. **Computed tab** → look for CSS variables:
   ```css
   --color-primary-600: #2563eb
   --spacing-4: 1rem
   --radius-md: 0.5rem
   --font-sans: -apple-system, ...
   ```

3. **If variables are missing:**
   - Check `/src/styles/globals.css` loaded
   - Check `/src/styles/index.css` import order
   - Look for CSS errors in Console

### Update Design System:

Edit `/src/styles/globals.css` to change:
- Colors: `--color-*` variables
- Spacing: `--spacing-*` variables  
- Border radius: `--radius-*` variables
- Fonts: `--font-sans` and `--font-mono`

All components will update automatically! 🎨

---

## 📋 Report Template

If you need help debugging, please provide:

### 1. What You See:
- [ ] Completely blank
- [ ] Loading spinner
- [ ] Error message
- [ ] Partial content
- [ ] Login screen
- [ ] Dashboard

### 2. Console Messages:
```
(Paste first 10-20 lines from console here)
```

### 3. Network Tab:
- [ ] JavaScript files loading successfully
- [ ] Some files failing (404 or error)
- [ ] No network activity at all

### 4. Screenshots:
- Preview window
- Browser console (F12)
- Network tab (if relevant)

### 5. What You Tried:
- [ ] Hard refresh
- [ ] Cleared cache
- [ ] Tried different browser
- [ ] Checked JavaScript enabled
- [ ] Switched to SafetyCheck.tsx

With this information, I can provide a specific fix!

---

## ✅ Success Criteria

You'll know everything is working when:

1. **Preview shows content** (login screen or dashboard)
2. **Console shows logs** without errors
3. **Can interact** with buttons/forms
4. **Can navigate** between screens
5. **Design system colors** are applied correctly

---

## 🚀 Once Working...

After the app renders successfully:

### Test Supabase Connection:
1. Login to app
2. Settings → System Tools
3. Run Connection Test (tests API)
4. Test Database Connection (tests PostgreSQL)

### Create Database Table:
See `QUICK_DATABASE_SETUP.md` for instructions

### Explore Features:
- Browse 10 Java OOP modules
- Take quizzes (47 lessons with 940 questions)
- Submit code for AI feedback
- Track progress and analytics

Your system is ready - just need to get it rendering! 🎯
