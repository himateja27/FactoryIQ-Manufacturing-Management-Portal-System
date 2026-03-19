# 📖 READ ME FIRST - FactoryIQ Complete System

**Welcome to FactoryIQ!** 🏭

This document will guide you through what FactoryIQ is and how to use it.

---

## 🎯 What is FactoryIQ?

**FactoryIQ** is a complete manufacturing ERP (Enterprise Resource Planning) system with:

- **4 User Roles:** Admin, Engineer, Quality Manager, Customer
- **5 Main Pages:** Dashboard, Projects, Production, Quality, Inventory
- **8+ Features:** Project management, approval workflow, document upload, production tracking, quality management, shipment tracking, email notifications, real-time analytics
- **Enterprise Security:** Role-based access control, JWT authentication, encrypted passwords

---

## 🚀 QUICK START (5 MINUTES)

### 1. Start the Backend

```bash
cd backend
python manage.py runserver
```

✅ You'll see: `Starting development server at http://127.0.0.1:8000/`

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

✅ You'll see: `Local: http://localhost:5174/`

### 3. Open Browser

```
http://localhost:5174
```

### 4. Login with Test Account

```
Username: admin
Password: admin123
```

### 5. Explore the System!

- Click "Projects" → Create a project
- Click "Production" → Record output
- Click "Quality" → Create NCR
- Click "Inventory" → Add items

---

## 👥 THE 4 ROLES

### 1️⃣ ADMIN (👨‍💼)

**Access:** Everything
**Can Do:** Create/edit/delete anything, approve projects, manage users
**Login:** `admin` / `admin123`

### 2️⃣ ENGINEER (👷)

**Access:** Production & Projects
**Can Do:** Record production, approve projects, view inventory
**Login:** `engineer` / `eng123`

### 3️⃣ QUALITY (🔬)

**Access:** Quality reports & Projects
**Can Do:** Create NCRs, track defects, manage quality
**Login:** `quality` / `qa123`

### 4️⃣ CUSTOMER (🏢)

**Access:** Only their projects
**Can Do:** Create projects, upload documents
**Login:** `customer1` / `cust123`

---

## 📱 THE 5 PAGES

### 🏠 Dashboard

Shows:

- Project statistics
- Production KPIs (if Engineer/Admin)
- Quality statistics (if Quality/Admin)
- User profile

### 📋 Projects

Do:

- Create projects
- Search & filter
- Upload documents
- Approve/Reject (Admin/Engineer only)
- Track approval status

### 🏭 Production (Admin/Engineer Only)

Do:

- Record production output
- Track defects
- View production statistics
- See production chart

### ✅ Quality (Admin/Quality Only)

Do:

- Create non-conformance reports (NCR)
- Track defect types
- Change NCR status
- View quality statistics

### 📦 Inventory (Admin/Engineer Only)

Do:

- Create inventory items
- Track quantities
- Get low-stock warnings
- Create shipments
- Track delivery status

---

## 🔐 SECURITY FEATURES

✅ **Role-Based Access** - Each role sees only their data
✅ **JWT Authentication** - Secure token-based login
✅ **Encrypted Passwords** - Uses bcrypt hashing
✅ **CORS Protection** - API restrictions
✅ **Email Notifications** - Audit trail of changes
✅ **Data Isolation** - Customers can't see others' projects

---

## 📚 DETAILED DOCUMENTATION

Read these files for more information:

1. **FACTORYIQ_COMPLETE_DEMO.md** ← START HERE
   - Complete demo walkthrough
   - Step-by-step instructions
   - All features explained

2. **FINAL_PROJECT_SUMMARY.md**
   - Project statistics
   - Architecture overview
   - Feature breakdown

3. **RBAC_DOCUMENTATION.md**
   - Detailed role definitions
   - Permission matrix
   - Security details

4. **RBAC_QUICK_REFERENCE.md**
   - Quick command reference
   - API endpoints
   - Troubleshooting

5. **FINAL_VERIFICATION_CHECKLIST.md**
   - What's been tested
   - What's working
   - Deployment readiness

---

## 🎮 DEMO WALKTHROUGH

### Scenario 1: Create & Approve a Project (5 min)

**Step 1: Login as Admin**

```
Username: admin
Password: admin123
```

**Step 2: Create Project**

- Click "Projects" menu
- Click "Create Project" button
- Name: "Phone Assembly"
- Description: "New mobile phone manufacturing"
- Click "Create"

**Step 3: Upload Document**

- Click on the project
- Click "Upload Document"
- Select any file (PDF, image, etc.)
- Click "Upload"

**Step 4: Submit for Approval**

- Click project again
- Click "Submit for Approval" button
- Status changes to "Submitted for Approval"

**Step 5: Approve Project**

- Click project again
- Click "Approve" button
- Status changes to "Approved" ✅

### Scenario 2: Record Production (3 min)

**Step 1: Go to Production**

- Click "Production" menu

**Step 2: Create Record**

- Select Project: "Phone Assembly"
- Output: 500
- Defects: 3
- Shift: Morning
- Click "Create Production Record"

**Step 3: View Statistics**

- See Total Output: 500
- See Total Defects: 3
- See Defect Rate: 0.60%

### Scenario 3: Test as Different Roles (5 min each)

**Logout:** Click avatar → Logout

**Test as Engineer:**

- Login: `engineer` / `eng123`
- Observe: Can see Production page
- Cannot see: Quality page

**Test as Quality:**

- Login: `quality` / `qa123`
- Observe: Can see Quality page
- Cannot see: Production page

**Test as Customer:**

- Login: `customer1` / `cust123`
- Observe: Can only see own projects
- Cannot see: Production, Quality, Inventory

---

## 🐛 TROUBLESHOOTING

### "Backend not running"

```bash
# Make sure you're in the backend directory
cd backend

# Start the server
python manage.py runserver
```

### "Frontend shows blank page"

```bash
# Hard refresh (clear cache)
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### "Can't see Production page as Engineer"

- Logout and login again
- The menu should filter after you log in

### "Imports showing as red errors but app works"

- This is normal in some editors
- The app still runs fine
- Just a display issue

### "Database error"

- Make sure MySQL is running
- Check connection in settings.py
- Run: `python manage.py migrate`

---

## 💻 TECH STACK

### Frontend

- React 19
- React Router (navigation)
- Axios (API calls)
- Recharts (graphs)
- CSS Grid & Flexbox

### Backend

- Django 5.2
- Django REST Framework
- MySQL database
- JWT authentication
- Email service

### Tools

- Vite (frontend build)
- NPM (package manager)
- Git (version control)

---

## 📊 DATABASE

The system uses MySQL with these tables:

- Users (with role field)
- Projects
- Documents
- Production records
- Quality NCRs
- Inventory items
- Shipments

---

## 📞 COMMON TASKS

### How to Create a New User?

```bash
cd backend
python manage.py createsuperuser
# Follow prompts to create new admin user
```

### How to Reset Password?

```bash
# It's stored as JWT tokens - clear localStorage:
# Open browser console (F12) and run:
# localStorage.clear()
# Then login again
```

### How to Backup Database?

```bash
# MySQL backup
mysqldump -u root -p amazon > backup.sql

# To restore
mysql -u root -p amazon < backup.sql
```

---

## ✨ KEY FEATURES

✅ **Multi-Role System** - Different people see different views
✅ **Approval Workflow** - Projects go through approval process
✅ **Real-Time Analytics** - Dashboards update instantly
✅ **Document Management** - Upload/download files
✅ **Production Tracking** - Track output and defects
✅ **Quality Management** - Create and track NCRs
✅ **Inventory Control** - Manage items and shipments
✅ **Email Alerts** - Get notified of changes

---

## 🎯 YOUR NEXT STEPS

1. **Start the Application** (see QUICK START above)
2. **Read FACTORYIQ_COMPLETE_DEMO.md** (detailed walkthrough)
3. **Test Each Role** (login and explore)
4. **Create Test Data** (projects, production, etc.)
5. **Read FINAL_VERIFICATION_CHECKLIST.md** (what's working)
6. **Deploy to Production** (when ready)

---

## 📈 PROJECT COMPLETION

| Component     | Status      |
| ------------- | ----------- |
| Frontend      | ✅ Complete |
| Backend       | ✅ Complete |
| Database      | ✅ Complete |
| RBAC System   | ✅ Complete |
| Documentation | ✅ Complete |
| Testing       | ✅ Complete |

---

## 🎉 YOU'RE ALL SET!

**FactoryIQ is ready to use!** 🚀

Start with the QUICK START section above, then refer to FACTORYIQ_COMPLETE_DEMO.md for detailed walkthrough.

---

## 📞 DOCUMENTATION FILES

- Start here → **FACTORYIQ_COMPLETE_DEMO.md**
- Overview → **FINAL_PROJECT_SUMMARY.md**
- Security → **RBAC_DOCUMENTATION.md**
- Reference → **RBAC_QUICK_REFERENCE.md**
- Testing → **FINAL_VERIFICATION_CHECKLIST.md**
- Deployment → **RBAC_DEPLOYMENT_GUIDE.md**

---

**Happy Manufacturing! 🏭**
