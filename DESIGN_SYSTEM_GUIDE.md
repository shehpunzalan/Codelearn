# CodeLearn AI Design System - Quick Reference Guide

## 🎨 Color Palette

### Brand Colors
```tsx
// Blue (Primary)
className="bg-blue-600"     // #2563EB - Primary buttons, accents
className="bg-blue-500"     // #3B82F6 - Hover states
className="bg-blue-700"     // #1E40AF - Active states
className="bg-blue-50"      // Light background
className="text-blue-600"   // Text color

// Purple (Secondary)
className="bg-purple-600"   // #9333EA - Secondary buttons
className="bg-purple-500"   // #A855F7 - Hover states
className="bg-purple-700"   // #7E22CE - Active states
className="bg-purple-50"    // Light background
className="text-purple-600" // Text color
```

### Semantic Colors
```tsx
// Success
className="bg-green-600 text-white"           // Button
className="bg-green-50 text-green-800"        // Badge
className="border-l-4 border-l-green-500"     // Alert

// Warning
className="bg-orange-600 text-white"          // Button
className="bg-orange-50 text-orange-800"      // Badge
className="border-l-4 border-l-orange-500"    // Alert

// Error
className="bg-red-600 text-white"             // Button
className="bg-red-50 text-red-800"            // Badge
className="border-l-4 border-l-red-500"       // Alert

// Info
className="bg-cyan-600 text-white"            // Button
className="bg-cyan-50 text-cyan-800"          // Badge
className="border-l-4 border-l-cyan-500"      // Alert
```

---

## 📐 Spacing Scale

```tsx
// Padding/Margin
className="p-2"   // 8px
className="p-3"   // 12px
className="p-4"   // 16px
className="p-6"   // 24px
className="p-8"   // 32px

// Gap (for flex/grid)
className="gap-2"  // 8px
className="gap-3"  // 12px
className="gap-4"  // 16px
className="gap-6"  // 24px
```

---

## 🔤 Typography

### Headings
```tsx
<h1>Main Page Title</h1>         // 36px, Bold
<h2>Section Title</h2>           // 30px, Semibold
<h3>Subsection Title</h3>        // 24px, Semibold
<h4>Card Title</h4>              // 20px, Medium
```

### Body Text
```tsx
<p className="text-base">Regular text</p>        // 16px
<p className="text-sm">Small text</p>            // 14px
<p className="text-xs">Extra small text</p>      // 12px
<p className="text-lg">Large text</p>            // 18px
```

### Font Weights
```tsx
className="font-bold"       // 700 - Main headings
className="font-semibold"   // 600 - Section titles
className="font-medium"     // 500 - Labels, buttons
className="font-normal"     // 400 - Body text
```

---

## 🎯 Buttons

### Primary Button
```tsx
<Button className="bg-blue-600 hover:bg-blue-700">
  <Icon className="w-4 h-4 mr-2" />
  Primary Action
</Button>
```

### Secondary Button
```tsx
<Button variant="outline">
  <Icon className="w-4 h-4 mr-2" />
  Secondary Action
</Button>
```

### Destructive Button
```tsx
<Button variant="destructive">
  <XCircle className="w-4 h-4 mr-2" />
  Delete
</Button>
```

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
```

---

## 🏷️ Badges

### Role Badges
```tsx
<Badge className="bg-blue-600 text-white">Student</Badge>
<Badge className="bg-purple-600 text-white">Instructor</Badge>
```

### Status Badges
```tsx
<Badge className="bg-green-100 text-green-800 border-0">Completed</Badge>
<Badge className="bg-blue-100 text-blue-800 border-0">In Progress</Badge>
<Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
<Badge className="bg-red-100 text-red-800 border-0">Failed</Badge>
<Badge className="bg-gray-100 text-gray-800 border-0">Not Started</Badge>
```

### Outline Badges
```tsx
<Badge variant="outline" className="border-blue-300 text-blue-700">
  CCS108
</Badge>
```

---

## 📦 Cards

### Standard Card
```tsx
<Card className="border-0 shadow-md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Gradient Stat Card
```tsx
<Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
  <CardContent className="p-6 text-white">
    <div className="flex items-center justify-between mb-2">
      <Users className="w-8 h-8" />
      <Badge className="bg-white/20 text-white border-0">Label</Badge>
    </div>
    <p className="text-sm font-medium mb-1">Stat Name</p>
    <p className="text-4xl font-bold">42</p>
    <p className="text-xs mt-2 text-blue-100">Additional info</p>
  </CardContent>
</Card>
```

### Alert Card (with Border Accent)
```tsx
<Card className="border-0 shadow-md border-l-4 border-l-green-500 bg-green-50">
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
      <CheckCircle className="w-8 h-8 text-green-600" />
      <div>
        <p className="font-semibold text-gray-900">Success Title</p>
        <p className="text-sm text-gray-600">Success message</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 📝 Form Elements

### Input Field
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id">Field Label</Label>
  <Input 
    id="field-id" 
    placeholder="Placeholder text..."
    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  />
</div>
```

### Textarea
```tsx
<div className="space-y-2">
  <Label htmlFor="textarea-id">Textarea Label</Label>
  <Textarea 
    id="textarea-id" 
    placeholder="Enter text..."
    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
    rows={4}
  />
</div>
```

### Code Input (Monospace)
```tsx
<Textarea 
  className="font-mono text-sm border-gray-300"
  placeholder="public class Student { ... }"
  rows={6}
/>
```

### Select Dropdown
```tsx
<div className="space-y-2">
  <Label htmlFor="select-id">Select Label</Label>
  <Select>
    <SelectTrigger id="select-id">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

## 🖼️ Icons

### Lucide React Icons
```tsx
import { 
  BookOpen, Users, Brain, Code, TrendingUp, 
  CheckCircle, AlertCircle, XCircle, Info,
  Award, Target, Clock, Zap 
} from 'lucide-react';

// Usage
<BookOpen className="w-5 h-5 text-blue-600" />
<Users className="w-6 h-6 text-purple-600" />
```

### Icon Sizes
```tsx
className="w-4 h-4"   // Small (16px) - In buttons, badges
className="w-5 h-5"   // Medium (20px) - Card titles
className="w-6 h-6"   // Large (24px) - Stat cards
className="w-8 h-8"   // XL (32px) - Hero sections
```

---

## 📊 Layout Patterns

### Page Container
```tsx
<div className="space-y-6">
  {/* Page Header */}
  <div className="flex justify-between items-start">
    <div>
      <h1>Page Title</h1>
      <p className="text-gray-600">Page description</p>
    </div>
    <div className="flex gap-2">
      <Button>Action 1</Button>
      <Button variant="outline">Action 2</Button>
    </div>
  </div>
  
  {/* Content sections */}
</div>
```

### Stats Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</div>
```

### Two-Column Layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content - 2/3 width */}
  <div className="lg:col-span-2 space-y-6">
    <Card>...</Card>
    <Card>...</Card>
  </div>
  
  {/* Sidebar - 1/3 width */}
  <div className="space-y-6">
    <Card>...</Card>
    <Card>...</Card>
  </div>
</div>
```

---

## 💬 Notifications (Toast)

### Success Toast
```tsx
import { toast } from 'sonner';

toast.success('Success!', {
  description: 'Your action completed successfully.',
});
```

### Error Toast
```tsx
toast.error('Error!', {
  description: 'Something went wrong. Please try again.',
});
```

### Info Toast
```tsx
toast.info('Info', {
  description: 'Here\'s some information for you.',
});
```

### Warning Toast
```tsx
toast.warning('Warning', {
  description: 'Please review this carefully.',
});
```

---

## 🎭 Modals/Dialogs

### Standard Dialog
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Dialog content */}
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700">
        Confirm
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## 🎨 Gradients

### Background Gradients
```tsx
// Blue to Purple
className="bg-gradient-to-r from-blue-600 to-purple-600"
className="bg-gradient-to-br from-blue-500 to-blue-600"

// Light backgrounds
className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
```

---

## ✅ Accessibility Checklist

- [ ] All interactive elements have focus states
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text (not just icons)
- [ ] Keyboard navigation works throughout
- [ ] Error messages are clear and actionable
- [ ] Loading states are indicated
- [ ] Success/error feedback is provided

---

## 📱 Responsive Breakpoints

```tsx
// Mobile First Approach
className="text-sm md:text-base lg:text-lg"  // Text sizes
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"  // Grid columns
className="hidden md:flex"  // Hide on mobile, show on tablet+
className="block md:hidden"  // Show on mobile, hide on tablet+
```

### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1920px
- **Large**: > 1920px

---

## 🚀 Quick Start Templates

### Dashboard Page Template
```tsx
export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-600 text-white">CCS108</Badge>
        <div>
          <h1>Dashboard Title</h1>
          <p className="text-gray-600">Dashboard description</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat cards */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Primary content */}
        </div>
        <div>
          {/* Sidebar */}
        </div>
      </div>
    </div>
  );
}
```

---

## 📚 Component Library

All components are from ShadCN UI located in `/src/app/components/ui/`:

- `button.tsx` - Button variants
- `card.tsx` - Card layouts
- `badge.tsx` - Status indicators
- `input.tsx` - Text inputs
- `textarea.tsx` - Multi-line inputs
- `select.tsx` - Dropdown selects
- `dialog.tsx` - Modal dialogs
- `label.tsx` - Form labels
- `progress.tsx` - Progress bars
- `avatar.tsx` - User avatars
- `dropdown-menu.tsx` - Dropdown menus
- And 30+ more...

---

## 🎯 Best Practices

1. **Always use design tokens** - Use Tailwind classes, not custom CSS
2. **Maintain consistency** - Reuse existing patterns
3. **Think responsive** - Mobile-first approach
4. **Accessibility first** - WCAG AA compliance
5. **Semantic HTML** - Use proper heading hierarchy
6. **Clear hierarchy** - Visual weight matches importance
7. **Provide feedback** - Toast notifications for actions
8. **Progressive disclosure** - Don't overwhelm users
9. **Error prevention** - Validate before submit
10. **Test thoroughly** - Multiple devices and browsers

---

**Happy Coding! 🚀**
