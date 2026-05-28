# 📊 Where Is My Data? - Complete Guide

---

## 🎯 Quick Answer

Your CodeLearn AI data is stored in **2 places**:

1. **Browser localStorage** - Current active storage
2. **Export files** - When you export data for backup/migration

---

## 🔍 Method 1: Built-In Data Viewer (EASIEST)

### Access the Data Viewer:

1. **Log in** to your CodeLearn AI app
2. **Click your profile avatar** (top right)
3. **Click "View Data"** in the dropdown menu
4. ✅ See all your data in a nice interface!

### What You Can Do:

- ✅ **View all storage items** - Browse through all data
- ✅ **Filter by type** - Progress, Submissions, Quizzes, etc.
- ✅ **Search specific items** - Find what you need
- ✅ **Export data** - Download as JSON, SQL, or CSV
- ✅ **Delete items** - Clean up old data
- ✅ **See storage size** - Monitor how much space you're using

---

## 🔍 Method 2: Browser DevTools (DETAILED VIEW)

### Steps:

1. **Open your CodeLearn AI app**
2. **Press F12** (or Right-click → Inspect)
3. **Click "Application" tab** (Chrome) or "Storage" tab (Firefox)
4. **Expand "Local Storage"** in left sidebar
5. **Click your domain** (e.g., `http://localhost:3000`)

### You'll See These Keys:

```
📁 Local Storage
├── 🔐 Auth & Users
│   ├── currentUser              - Currently logged-in user
│   ├── accessToken             - Authentication token
│   ├── registeredUsers         - All registered accounts
│   └── rememberedEmail         - Saved email for login
│
├── 📊 Progress & Stats
│   ├── progress_user123_mod1_lesson1-1   - Lesson completion data
│   ├── progress_user123_mod2_lesson2-1   - More progress records
│   ├── stats_user123                      - Overall user statistics
│   └── lastLoginTime                      - Last login timestamp
│
├── 💻 Code Submissions
│   ├── submissions_user123               - All code submissions
│   ├── allSubmissions                    - Global submissions list
│   └── code_mod1_lesson1                 - Saved code drafts
│
├── 📝 Quiz Results
│   ├── quiz_quiz_12345_user123          - Knowledge check results
│   └── quiz_quiz_67890_user123          - Interactive game results
│
└── 🔔 Notifications
    └── notifications_user123             - User notifications
```

---

## 📦 Method 3: Export Your Data

### Export Options:

#### **Option A: JSON Export** (Universal Format)
- Click "Export JSON" in Data Viewer
- Opens in any text editor
- Can import to any database
- Best for: Backup, migration

**File format:**
```json
{
  "users": [...],
  "progress": [...],
  "submissions": [...],
  "metadata": {
    "exportDate": "2024-05-27",
    "totalRecords": 150
  }
}
```

#### **Option B: SQL Export** (For Databases)
- Click "Export SQL" in Data Viewer
- Ready to import to MySQL/PostgreSQL/Supabase
- Contains INSERT statements
- Best for: Database migration

**File format:**
```sql
INSERT INTO users (id, name, email) VALUES ('123', 'John', 'john@email.com');
INSERT INTO progress (user_id, module_id, score) VALUES ('123', 'mod1', 85);
```

#### **Option C: CSV Export** (For Excel/Sheets)
- Click "Export CSV" in Data Viewer
- Opens in Excel, Google Sheets
- Multiple files (one per table)
- Best for: Analysis, reports

**Files created:**
- `users.csv`
- `progress.csv`
- `submissions.csv`
- `quizzes.csv`

---

## 📂 Method 4: Access localStorage Programmatically

### In Browser Console:

Press **F12** → **Console** tab, then type:

```javascript
// Get current user
JSON.parse(localStorage.getItem('currentUser'))

// Get all progress for a user
JSON.parse(localStorage.getItem('progress_user123_mod1_lesson1-1'))

// Get all submissions
JSON.parse(localStorage.getItem('submissions_user123'))

// See all keys
Object.keys(localStorage)

// Get total storage size
let total = 0;
for (let key in localStorage) {
  total += localStorage[key].length;
}
console.log(`Total storage: ${(total / 1024).toFixed(2)} KB`);
```

---

## 🗄️ What Data Is Stored?

### **1. User Profiles**
```javascript
{
  id: "user_123",
  name: "John Doe",
  email: "john@example.com",
  role: "student",
  studentId: "2021-00123",
  section: "BSCS 3A",
  yearLevel: "3rd Year"
}
```

### **2. Progress Records**
```javascript
{
  userId: "user_123",
  moduleId: "mod1",
  lessonId: "lesson1-1",
  completed: true,
  score: 85,
  attempts: 2,
  timeSpent: 1200,  // seconds
  code: "public class HelloWorld {...}",
  feedback: "Good job! OOP principles detected...",
  lastAttempt: "2024-05-27T10:30:00Z"
}
```

### **3. Code Submissions**
```javascript
{
  id: "sub_456",
  userId: "user_123",
  moduleId: "mod1",
  lessonId: "lesson1-1",
  code: "public class HelloWorld {...}",
  score: 85,
  feedback: "Excellent use of encapsulation...",
  errors: [],
  passed: true,
  timestamp: "2024-05-27T10:30:00Z"
}
```

### **4. Quiz Results**
```javascript
{
  id: "quiz_789",
  userId: "user_123",
  moduleId: "mod1",
  lessonId: "lesson1-1",
  score: 8,
  totalQuestions: 10,
  answers: {q1: "A", q2: "B", ...},
  passed: true,
  timestamp: "2024-05-27T11:00:00Z"
}
```

### **5. Statistics**
```javascript
{
  userId: "user_123",
  totalLessonsCompleted: 15,
  totalModulesCompleted: 2,
  averageScore: 87,
  totalTimeSpent: 12.5,  // hours
  streak: 5,  // days
  lastActiveDate: "2024-05-27",
  completedLessons: ["lesson1-1", "lesson1-2", ...],
  completedModules: ["mod1", "mod2"]
}
```

---

## 💾 Storage Limits

### localStorage Limits:
- **Chrome:** ~10MB per domain
- **Firefox:** ~10MB per domain
- **Safari:** ~5MB per domain
- **Edge:** ~10MB per domain

### Your Current Usage:

Check in Data Viewer:
- Total items stored
- Total size (KB/MB)
- Breakdown by category

---

## 🔄 Migrate to a Database

If you want to move from localStorage to a real database:

### Step 1: Export Your Data
1. Open Data Viewer
2. Click "Export JSON" or "Export SQL"
3. Save the file

### Step 2: Choose Your Database
- **Supabase** - Best for most cases
- **Firebase** - Good for real-time
- **MySQL** - Traditional SQL
- **MongoDB** - NoSQL option

### Step 3: Import Data
Follow the guide in `CREATE_DATABASE_GUIDE.md`

---

## 🛠️ Data Management Commands

### Backup All Data:
```javascript
// Run in browser console
const backup = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  backup[key] = localStorage.getItem(key);
}
console.log(JSON.stringify(backup, null, 2));
// Copy output and save to file
```

### Clear All Data (⚠️ Destructive):
```javascript
// Run in browser console
localStorage.clear();
console.log('All data cleared!');
```

### Clear Specific User Data:
```javascript
// Run in browser console
const userId = 'user_123';
const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.includes(userId)) {
    localStorage.removeItem(key);
  }
});
console.log(`Cleared data for ${userId}`);
```

---

## 📊 View Live Data Changes

### Watch localStorage in Real-Time:

```javascript
// Run in browser console
window.addEventListener('storage', (e) => {
  console.log('Storage changed:', {
    key: e.key,
    oldValue: e.oldValue,
    newValue: e.newValue
  });
});
```

---

## 🎓 For Your University Submission

### Include This in Your Documentation:

**Data Storage Architecture:**
> The CodeLearn AI system implements a client-side data persistence layer using the Web Storage API (localStorage). All user data, including progress, code submissions, quiz results, and analytics, are stored locally in the browser's localStorage with a structured key-value format. The system includes built-in data export functionality (JSON, SQL, CSV) for backup and migration purposes.

**Advantages:**
- Fast access (no network latency)
- Works offline
- No server costs
- Privacy-focused (data stays on device)
- Simple deployment

**Production Considerations:**
- For multi-device access, backend integration available
- Supabase PostgreSQL configuration included
- Ready for cloud deployment when needed

---

## 🆘 Troubleshooting

### Can't See My Data?
1. Check if you're logged in
2. Open Data Viewer from profile menu
3. Click "Refresh" button
4. Check browser console for errors

### Data Disappeared?
- Did you clear browser cache?
- Did you switch browsers?
- Data is browser-specific!
- **Solution:** Export data regularly as backup

### Storage Full?
- Check Data Viewer for size
- Delete old submissions
- Export and archive old data
- Consider migrating to database

---

## ✅ Quick Checklist

- [ ] Can access Data Viewer from profile menu
- [ ] Can see all my progress and submissions
- [ ] Can export data as JSON
- [ ] Can export data as SQL (if migrating to database)
- [ ] Understand data is stored in browser localStorage
- [ ] Know how to backup data before clearing cache

---

## 🚀 Next Steps

1. **Try the Data Viewer** - Access from profile menu
2. **Export your data** - Create a backup
3. **Read CREATE_DATABASE_GUIDE.md** - If you want a real database
4. **Document for grading** - Include data architecture in your report

Need help? Just ask Claude!
