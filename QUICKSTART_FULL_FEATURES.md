# ⚡ Quick Start - Full Features (5 Minutes)

## 🚀 Get Everything Running

### Terminal 1: Backend Setup & Run

```bash
# Navigate to backend
cd backend

# Install new dependency
pip install django-filter==25.1

# Apply database migrations
python manage.py migrate

# Start server
python manage.py runserver
# ✅ Server running at http://localhost:8000
```

### Terminal 2: Frontend Setup & Run

```bash
# Navigate to frontend
cd frontend

# Install if needed
npm install

# Start development server
npm start
# ✅ Browser opens at http://localhost:5173
```

---

## 📝 Test the New Features (1 Minute Each)

### Navigation Menus

**Top Navigation Bar:**

- 🏠 Dashboard
- 📋 Projects
- 📊 Production
- 🔴 Quality
- 📦 Inventory

### ✅ Test 1: Advanced Filters

1. Open **Projects** page
2. Click **"🔍 Advanced Filters"**
3. Select status filter
4. Click **"✓ Apply Filters"**
5. ✅ Table filters instantly

### ✅ Test 2: Create & Upload Document

1. Click **"▶ View"** on any project
2. Scroll to **"📄 Upload Document"**
3. Fill in:
   - Title: `My BOM`
   - Type: `Bill of Materials`
   - File: (select any PDF/file)
4. Click **"📤 Upload Document"**
5. ✅ Document appears in "Project Documents"

### ✅ Test 3: Document Download

1. In project detail view
2. Find document in list
3. Click **"📥 Download"**
4. ✅ File downloads

### ✅ Test 4: Approval Workflow

**As Engineer/Admin:**

1. View a project detail
2. Scroll to **"📋 Approval Workflow"**
3. Add text in "Comments / Notes"
4. Click **"✅ Approve"** or **"❌ Reject"**
5. ✅ Project status updates

**As Customer:**

1. Login with customer account
2. Go to Projects
3. ✅ See your approval status updated

### ✅ Test 5: Production Tracking

1. Click **"Production"** in navigation
2. Select a project from dropdown
3. Enter:
   - Output: `150`
   - Defects: `3`
   - Shift: `Day`
4. Click **"✓ Record Production"**
5. ✅ Record appears in table
6. ✅ KPI cards update automatically

### ✅ Test 6: Quality NCR Management

1. Click **"Quality"** in navigation
2. Click **"📋 Create NCR"**
3. Fill in:
   - Project: (select one)
   - Defect Type: `Surface scratches`
   - Root Cause: `Abrasive tool wear`
4. Click **"✓ Create NCR"**
5. ✅ NCR appears in list
6. ✅ Change status using dropdown: Open → Investigating → Closed

### ✅ Test 7: Inventory Management

1. Click **"Inventory"** in navigation
2. Click **"📦 Inventory"** tab
3. Fill in:
   - Item Name: `Copper Wire`
   - Quantity: `50`
   - Location: `Warehouse A`
4. Click **"✓ Add Item"**
5. ✅ Item appears in table
6. ✅ Click **"+10"** button to increase quantity
7. Edit quantity inline

### ✅ Test 8: Shipment Tracking

1. In **"Inventory"** page, click **"🚚 Shipments"** tab
2. Fill in:
   - Tracking ID: `SHIP-001`
   - Status: `Pending`
   - ETA: (pick future date)
3. Click **"✓ Create Shipment"**
4. ✅ Shipment appears in table
5. ✅ Change status using dropdown

---

## 🔐 Demo Workflow (Complete in < 5 Minutes)

### Setup Step 1: Create Test Users

```bash
# In backend directory, run:
python manage.py shell

# Run these commands:
from django.contrib.auth import get_user_model
User = get_user_model()

# Create customer
customer = User.objects.create_user(
    username='customer1',
    email='customer@test.com',
    password='test123',
    role='customer'
)

# Create engineer
engineer = User.objects.create_user(
    username='engineer1',
    email='engineer@test.com',
    password='test123',
    role='engineer'
)

# Exit
exit()
```

### Demo Step 2: Run Flow

1. **Browser 1 (Customer Account)**
   - Login with customer/test123
   - Create new project "Demo Project"
   - Go to Projects page

2. **Browser 2 (Engineer Account)**
   - Open new browser window
   - Login with engineer/test123
   - View "Demo Project"
   - Approve it with notes "Looks good!"

3. **Browser 1 (Check Approval)**
   - Refresh Projects page
   - Status shows ✅ Approved
   - View project details
   - See engineer's approval notes

4. **Browser 1 (Upload Document)**
   - Create a text file: `test.txt` with content "My BOM"
   - Upload it as "BOM v1"
   - See it in documents list

---

## 📧 Email Setup (Optional - 2 Minutes)

**Skip email testing?** Emails print to console by default ✅

**Want real email?** Configure Gmail:

1. Enable 2FA on Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Create app password
4. Create `.env` file in `backend/`:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=paste-app-password-here
DEFAULT_FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

5. Restart backend server
6. Emails now send to Gmail! 📧

---

## 🎯 Feature Coverage

| Feature                | Test Method               | Time     |
| ---------------------- | ------------------------- | -------- |
| 📄 Document Upload     | Upload file to project    | 1 min    |
| 📥 Document Download   | Click download button     | 30 sec   |
| 🔍 Advanced Filters    | Filter projects by status | 1 min    |
| 📋 Approvals           | Approve/reject project    | 1 min    |
| 📊 Production Tracking | Record output/defects     | 1 min    |
| 🔴 Quality NCR         | Create/manage NCRs        | 1 min    |
| 📦 Inventory Mgmt      | Add/update inventory      | 1 min    |
| 🚚 Shipment Tracking   | Create/track shipments    | 1 min    |
| ✉️ Notifications       | (Check console/email)     | optional |

**Total Demo Time: 8-15 minutes** ⏱️

---

## ❌ If Something Doesn't Work

### Django won't start

```bash
python manage.py migrate
```

### Frontend won't load

```bash
cd frontend
npm cache clean --force
npm install
npm start
```

### Dropdowns still hidden

```bash
# Clear browser cache: Ctrl+Shift+Delete
# Or use different browser
```

### Documents not uploading

```bash
mkdir backend/media
# Restart Django server
```

### Email not working

```bash
# Check console output for email text
# Or run: python manage.py test
```

---

## 📚 File Locations

**Want to check code?**

- Models: `backend/projects/models.py`
- APIs: `backend/projects/views.py`
- Components: `frontend/src/components/`
- Styles: `frontend/src/index.css`

---

## 🎓 Learning Tips

- **Filters work at API level** - Filter params in URL
- **Documents stored in** `backend/media/documents/`
- **Approvals tracked in** Database tables
- **Emails configurable** - Check `settings.py`
- **API URLs:**
  - Projects: `/api/projects/`
  - Production: `/api/production/`
  - Quality NCRs: `/api/quality/ncrs/`
  - Inventory: `/api/supplychain/inventory/`
  - Shipments: `/api/supplychain/shipments/`
- **Role-based access:**
  - Customer: See only own projects/docs
  - Engineer: Can approve projects
  - Admin: Full access to all

---

## ✅ Success Checklist

- [x] Backend running (port 8000)
- [x] Frontend running (port 5173)
- [x] Navigation shows 5 menu items (Dashboard, Projects, Production, Quality, Inventory)
- [x] Can create projects
- [x] Can upload documents
- [x] Can approve projects
- [x] Can filter projects
- [x] Can record production
- [x] Can create/update NCRs
- [x] Can manage inventory
- [x] Can track shipments
- [x] (Optional) Can send emails

**Everything working? 🎉 YOU'RE DONE!**

---

## 📞 Need Help?

Check these files for details:

- `SETUP_FULL_FEATURES.md` - Complete guide
- `IMPLEMENTATION_SUMMARY.md` - What was added
- `REQUIREMENTS_CHECKLIST.md` - Features list

---

**Ready to demo? Start servers and follow "Test the New Features" above! ⚡**
