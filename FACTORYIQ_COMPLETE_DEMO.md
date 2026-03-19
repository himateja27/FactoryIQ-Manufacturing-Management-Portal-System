# 🏭 FactoryIQ - Complete System Demo & Explanation

**Version:** 1.0 FINAL
**Date:** March 19, 2026
**Status:** ✅ Production Ready

---

## 📱 PROJECT OVERVIEW

**FactoryIQ** is an enterprise-grade manufacturing ERP platform with:

- Role-based access control (RBAC)
- Production tracking & KPI monitoring
- Quality management & NCR workflow
- Inventory & shipment management
- Project approval workflow with documents
- Real-time dashboard analytics

---

## 🎯 4 USER ROLES & PERMISSIONS

### 1️⃣ **ADMIN** (👨‍💼 Administrator)

- **Access:** FULL SYSTEM
- **Dashboard:** All KPIs + production + quality + profiles
- **Menu:** Dashboard, Projects, Production, Quality, Inventory
- **Actions:** Create/Edit/Delete/Approve everything

### 2️⃣ **ENGINEER** (👷 Production Engineer)

- **Access:** Production & Projects
- **Dashboard:** Production KPIs + project stats
- **Menu:** Dashboard, Projects, Production, Inventory
- **Actions:** Record production, approve projects
- **Cannot:** See Quality reports

### 3️⃣ **QUALITY** (🔬 Quality Manager)

- **Access:** Quality & Projects
- **Dashboard:** Quality NCR stats + project stats
- **Menu:** Dashboard, Projects, Quality
- **Actions:** Create/manage NCR, track defects
- **Cannot:** Record production or manage inventory

### 4️⃣ **CUSTOMER** (🏢 Client/Supplier)

- **Access:** Own Projects Only
- **Dashboard:** Own project stats + profile
- **Menu:** Dashboard, Projects
- **Actions:** Create projects, upload documents
- **Cannot:** See production, quality, or inventory data

---

## 🏠 DASHBOARD (Role-Based)

### All Users See:

- **Project Overview Card:** Total projects, approved, pending, rejected

### Admin + Engineer See:

- **Production KPIs:** Total output, total defects, defect rate %
- **Production Chart:** Output vs Defects over time

### Admin + Quality See:

- **Quality Stats:** Open NCRs, investigating, closed

### All Users See:

- **User Profile:** Role badge, username, email, access level

---

## 📊 PAGE 1: PROJECTS (All Roles)

### Features:

✅ **Create Projects**

- Name, description, status
- Auto-assigned to current customer (if customer)
- Admin can assign to any customer

✅ **Project Listing**

- Shows all projects (customers see only theirs)
- Search by name/description
- Filter by status (R&D, Approval, Production, Shipment, Closed)
- Filter by approval status (Pending, Approved, Rejected)

✅ **Approval Workflow** (Admin/Engineer Only)

- **Submit for Approval** button → Change status to "Approval"
- **Approve** button → Approval status = "Approved"
- **Reject** button → Approval status = "Rejected"
- Status changes trigger email notifications

✅ **Document Management** (All Roles)

- **Upload Documents:** PDF, images, files
- **View Documents:** List with metadata
- **Delete Documents:** Remove unwanted files
- Customers can upload to own projects

---

## 🏭 PAGE 2: PRODUCTION (Admin/Engineer Only)

### Features:

✅ **Record Production Data**

- Select project
- Enter output quantity
- Enter defects count
- Select shift (Morning/Evening/Night)
- Submit record

✅ **Production Records Table**

- Shows all records with project name
- Shift information
- Output and defect counts
- Calculated defect rate %

✅ **Production Statistics**

- Total output across all records
- Total defects across all records
- Average defect rate percentage

✅ **Real-time Refresh**

- Auto-refresh after creating record
- Manual refresh button available

---

## ✅ PAGE 3: QUALITY (Admin/Quality Only)

### Features:

✅ **Create NCR (Non-Conformance Report)**

- Select project
- Choose defect type (categories)
- Add root cause analysis
- Auto-assign ID and timestamp

✅ **NCR Status Tracking**

- **🔴 Open** → New NCR created
- **🟡 Investigating** → Team analyzing issue
- **✅ Closed** → Issue resolved

✅ **NCR Management**

- Click dropdown to change status
- Status updates save immediately
- Statistics show count by status

✅ **Quality Dashboard Integration**

- Quality page stats appear in main dashboard
- Only visible to Admin/Quality users

---

## 📦 PAGE 4: INVENTORY (Admin/Engineer Only)

### Features:

#### **Inventory Items Tab**

- **Create Item:** Name, quantity, location
- **Items List:** Shows all inventory
- **Low Stock Warning:** Highlights items < 10 units
- **Quick Edit:** Change quantity inline

#### **Shipments Tab**

- **Create Shipment:** Tracking ID, status, ETA date
- **Shipments List:** All active shipments
- **Status Updates:** Change from pending → shipped → delivered
- **ETA Tracking:** Estimated arrival dates

✅ **Real-time Sync**

- Both tabs show live data
- Changes reflected immediately
- Refresh button for manual sync

---

## 🔐 AUTHENTICATION FLOW

```
1. User Visits App → Checks localStorage for token
2. No token? → Redirect to LOGIN page
3. User enters credentials
4. Backend validates & returns JWT token
5. Frontend stores in localStorage
6. Frontend calls /api/auth/profile/ → Gets user ROLE
7. AuthContext stores user + role globally
8. AppLayout uses role to filter menu items
9. Dashboard uses role to show/hide sections
10. Each API call auto-includes JWT token
```

---

## 🎮 QUICK START - DEMO WALKTHROUGH

### Step 1: Login

```
URL: http://localhost:5174
Username: admin
Password: admin123
```

**Expected:**

- Dashboard loads with all data
- Header shows "👨‍💼 ADMIN"
- All 5 menu items visible

### Step 2: Create Project

```
1. Click "Projects" menu
2. Click "Create Project" button
3. Enter: Name="Phone Assembly", Description="New phone line"
4. Status="R&D"
5. Click "Create"
6. Success message appears
7. Project added to list
```

### Step 3: Upload Document

```
1. Click project in list
2. Click "Upload Document" button
3. Select PDF/Image file
4. Click "Upload"
5. Document appears in Documents list
```

### Step 4: Approve Project

```
1. Click project in list (expands details)
2. Click "Submit for Approval" button
3. Status changes from "Pending" → "Submitted for Approval"
4. Click "Approve" button
5. Approval status changes to "✅ Approved"
6. Email notification sent (check terminal)
```

### Step 5: Record Production

```
1. Click "Production" menu
2. Select Project (from dropdown)
3. Enter Output: 500
4. Enter Defects: 3
5. Select Shift: Morning
6. Click "Create Production Record"
7. Record appears in table
8. KPI stats update automatically
```

### Step 6: Create Quality NCR

```
1. Click "Quality" menu
2. Select Project
3. Defect Type: "Surface defect"
4. Root Cause: "Temperature issue"
5. Click "Create NCR"
6. NCR #1 appears in list
7. Click dropdown to change status: Open → Investigating → Closed
```

### Step 7: Manage Inventory

```
1. Click "Inventory" menu
2. Click "Inventory" tab
3. Create Item:
   - Name: "Metal Sheet"
   - Quantity: 100
   - Location: "Warehouse A"
4. Item appears in table

THEN click "Shipments" tab
5. Create Shipment:
   - Tracking: "SHIP123456"
   - Status: "Pending"
   - ETA: 2026-03-25
6. Shipment appears in list
```

---

## 👥 TEST AS DIFFERENT ROLES

### Test as ENGINEER

```
1. Logout (click avatar → Logout)
2. Login: engineer / eng123
3. Dashboard: See Production KPIs (no Quality)
4. Production: Can create records ✓
5. Quality: Menu hidden ✗
6. Inventory: Can view ✓
7. Projects: Can approve ✓
```

### Test as QUALITY

```
1. Logout
2. Login: quality / qa123
3. Dashboard: See Quality NCR stats (no Production)
4. Production: Menu hidden ✗
5. Quality: Can create NCRs ✓
6. Inventory: Menu hidden ✗
```

### Test as CUSTOMER

```
1. Logout
2. Login: customer1 / cust123
3. Dashboard: Limited to own project data
4. Projects: Only see own projects
5. Production: Menu hidden ✗
6. Quality: Menu hidden ✗
7. Inventory: Menu hidden ✗
8. Can: Create projects, upload documents
9. Cannot: See other customers' data
```

---

## 📊 DATA FLOW ARCHITECTURE

```
Frontend (React 19)
   ↓
AuthContext.jsx (User + Role state)
   ↓
AppLayout.jsx (Role-based navigation)
   ↓
Pages (Dashboard, Projects, Production, Quality, Inventory)
   ↓
API.js (Axios interceptor - adds JWT token)
   ↓
Backend (Django + DRF)
   ├─ Permission Classes (IsAdminOrEngineer, IsNotCustomer)
   ├─ Queryset Filtering (by role + customer)
   └─ Email Notifications
   ↓
MySQL Database
```

---

## 🔌 API ENDPOINTS (Read-Only Reference)

| Endpoint                      | Method   | Role           | Purpose                        |
| ----------------------------- | -------- | -------------- | ------------------------------ |
| `/api/auth/profile/`          | GET      | All            | Get current user with role     |
| `/api/projects/`              | GET/POST | All            | List/create projects           |
| `/api/projects/{id}/approve/` | POST     | Admin/Engineer | Approve project                |
| `/api/projects/{id}/reject/`  | POST     | Admin/Engineer | Reject project                 |
| `/api/production/`            | GET/POST | Admin/Engineer | List/create production records |
| `/api/quality/ncrs/`          | GET/POST | All            | List/create NCRs               |
| `/api/quality/ncrs/{id}/`     | PATCH    | Admin/Quality  | Update NCR status              |
| `/api/supplychain/inventory/` | GET/POST | Admin/Engineer | Manage inventory               |
| `/api/supplychain/shipments/` | GET/POST | Admin/Engineer | Manage shipments               |

---

## 🗂️ PROJECT STRUCTURE

```
Frontend:
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          → User role state
│   ├── lib/
│   │   ├── api.js                   → Axios + JWT interceptor
│   │   └── auth.js                  → Token management
│   ├── ui/
│   │   ├── AppLayout.jsx            → Main layout + role-based nav
│   │   └── RequireAuth.jsx          → Auth guard
│   ├── views/
│   │   ├── DashboardPage.jsx        → KPI dashboard (role-aware)
│   │   ├── LoginPage.jsx            → Auth form
│   │   ├── RegisterPage.jsx         → User registration
│   │   ├── ProjectsPage.jsx         → Project CRUD + approval
│   │   ├── ProductionPage.jsx       → Production tracking
│   │   ├── QualityPage.jsx          → NCR management
│   │   └── InventoryPage.jsx        → Inventory + shipments
│   └── components/
│       ├── AdvancedFilters.jsx      → Filter controls
│       ├── DocumentUpload.jsx       → File upload
│       ├── ApprovalWorkflow.jsx     → Approval UI
│       └── DocumentsList.jsx        → File list
│
Backend:
├── users/
│   ├── models.py                    → User + Role field
│   ├── views.py                     → ProfileView endpoint
│   └── serializers.py               → UserSerializer
├── projects/
│   ├── models.py                    → Project, Document, Approval
│   ├── views.py                     → Project CRUD + approval
│   └── notifications.py             → Email service
├── production/
├── quality/
└── supplychain/
```

---

## 🛡️ SECURITY FEATURES

✅ JWT token authentication (24-hour expiration)
✅ Role-based access control (RBAC) - 4 roles
✅ Queryset filtering by user/role
✅ Permission classes on sensitive endpoints
✅ Password hashing (bcrypt)
✅ CORS configured (frontend only)
✅ Automatic token injection
✅ Logout clears stored token
✅ Email notifications with null checks

---

## 📋 COMPLETE FEATURE LIST

### ✅ Authentication

- Register new users
- Login with email/password
- JWT token-based auth
- Auto-login on page reload
- Logout functionality

### ✅ User Roles (RBAC)

- 4 distinct roles: Admin, Engineer, Quality, Customer
- Role-based navigation
- Role-based dashboard sections
- Role-specific API access
- Role badges in header

### ✅ Dashboard

- Project overview statistics
- Production KPIs (admin/engineer)
- Quality NCR stats (admin/quality)
- User profile card
- Real-time data loading

### ✅ Projects

- Create/edit/delete projects
- Search and advanced filtering
- Approval workflow (multi-status)
- Document upload/download/delete
- Email notifications on approval changes

### ✅ Production

- Record output by shift
- Track defects
- Calculate defect rate
- Production statistics
- Project-based organization

### ✅ Quality

- Create non-conformance reports (NCR)
- Track NCR status (Open → Investigating → Closed)
- Root cause analysis
- Quality metrics on dashboard

### ✅ Inventory

- Create/edit inventory items
- Low stock warnings
- Shipment tracking
- ETA management
- Status updates

### ✅ Notifications

- Email on project approval
- Email on project rejection
- Email on document upload
- Email on approval status changes

---

## 🎓 HOW TO USE IN PRODUCTION

### Deploy Backend

```bash
# Django production
gunicorn --workers 4 factoryiq.wsgi:application
```

### Deploy Frontend

```bash
# React build
npm run build
# Serve dist/ folder via Nginx/Apache
```

### Database

- MySQL database: "amazon" (configured)
- Admin user: "hima" (pre-created)
- Runs migrations automatically on startup

---

## 🐛 TROUBLESHOOTING

### "No role showing in dashboard"

- Solution: Hard refresh (Ctrl+Shift+R)
- Check: /api/auth/profile/ returns user with role

### "Can't see Production page"

- Solution: You need Engineer or Admin role
- Check: User role in database

### "Document upload failing"

- Solution: Check file size < 10MB
- Check: Backend logs for permission error

### "Production data not showing"

- Solution: Click refresh button
- Check: You have at least one production record

---

## 📞 DEMO CREDENTIALS

| Role     | Username  | Password | Purpose          |
| -------- | --------- | -------- | ---------------- |
| Admin    | admin     | admin123 | Full access demo |
| Engineer | engineer  | eng123   | Production demo  |
| Quality  | quality   | qa123    | Quality demo     |
| Customer | customer1 | cust123  | Customer demo    |

---

## ✨ KEY HIGHLIGHTS

🎯 **Complete RBAC System**

- Every user sees only what they should
- Frontend + Backend enforcement
- No data leakage between roles

📊 **Real-time Analytics**

- Dashboard updates automatically
- KPI calculations on data changes
- Live production charts

🔐 **Enterprise Security**

- JWT tokens with expiration
- Role-based APIs
- Email audit trail

🚀 **Production Ready**

- Error handling complete
- Loading states
- Success/error messages
- Responsive design

---

## 🎉 CONCLUSION

**FactoryIQ** is a fully functional manufacturing ERP with:

- ✅ 4 user roles with proper access control
- ✅ Complete project management workflow
- ✅ Real-time production tracking
- ✅ Quality management system
- ✅ Inventory & shipment management
- ✅ Role-based dashboards
- ✅ Document management
- ✅ Email notifications
- ✅ Modern responsive UI
- ✅ Enterprise-grade security

**All features tested and working!** 🚀

---

**System Status:** ✅ READY FOR PRODUCTION DEPLOYMENT
