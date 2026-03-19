# 🚀 Complete Setup Guide - Full Features Implementation

This guide walks you through setting up the FactoryIQ project with all new features:

- ✅ Document upload system
- ✅ Email notifications
- ✅ Workflow approval stages
- ✅ Advanced filtering UI

---

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- MySQL server running
- Git

---

## 🔧 Backend Setup

### 1. Install New Dependencies

```bash
cd backend

# Install django-filter for advanced filtering
pip install django-filter==25.1

# Or update all requirements
pip install -r requirements.txt
```

### 2. Create Database Migration

The new models (Document, ProjectApproval) need to be migrated:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Configure Email (Optional but Recommended)

Create a `.env` file in the `backend/` directory:

```env
# Email Configuration - Gmail SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

**To use Gmail:**

1. Go to https://myaccount.google.com/apppasswords
2. Generate app password (requires 2FA enabled)
3. Paste the app password in `.env`

**For testing without email:**

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### 4. Run Backend Server

```bash
python manage.py runserver
# Server runs at http://localhost:8000
```

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
# Opens at http://localhost:5173
```

---

## ✨ New Features Guide

### 1. **Advanced Filtering** 🔍

Click the **"🔍 Advanced Filters"** button on the Projects page to:

- Filter by status (R&D, Approval, Production, Shipment, Closed)
- Filter by approval status (Pending, Approved, Rejected)
- Filter by date range
- Search by project name or description

### 2. **Document Upload** 📄

On each project detail view:

- Click **"View"** button to expand project
- Upload documents with:
  - Title (required)
  - Type (BOM, Report, Specification, Other)
  - Description
  - File (PDF, Word, Excel, etc.)
- Documents are versioned and tracked by uploader

### 3. **Approval Workflow** 📋

Project approval process:

```
Pending → [Engineer/Admin Reviews] → Approved/Rejected/Changes Requested
```

**As Admin/Engineer:**

- Approve project ✅
- Reject project ❌
- Request revisions 🔄
- Add notes/comments

**Notifications sent to customer:**

- Project approved/rejected
- Changes requested

### 4. **New API Endpoints**

```
GET    /api/documents/                 → List all documents
POST   /api/documents/                 → Upload document
GET    /api/documents/{id}/            → Get document details
PUT    /api/documents/{id}/            → Update document
DELETE /api/documents/{id}/            → Delete document

GET    /api/project-approvals/         → Check approval history
GET    /api/projects/{id}/             → Get project (now includes approval data)
POST   /api/projects/{id}/approve/     → Approve project
POST   /api/projects/{id}/reject/      → Reject project
POST   /api/projects/{id}/request_revision/ → Request changes
```

**Filtering with query parameters:**

```
/api/projects/?status=rnd&approval_status=pending&search=myproject
/api/documents/?project=1&document_type=bom
/api/project-approvals/?project=1&action=approved
```

---

## 📊 Project Database Schema

```
Project
├── id
├── name
├── description (NEW)
├── status (R&D, Approval, Production, Shipment, Closed)
├── approval_status (NEW: Pending, Approved, Rejected)
├── approval_notes (NEW)
├── customer (ForeignKey: User)
├── approved_by (NEW: ForeignKey: User)
├── approved_at (NEW: DateTime)
└── timestamps

Document (NEW TABLE)
├── id
├── project (ForeignKey)
├── title
├── document_type (BOM, Report, Specification, Other)
├── file
├── description
├── version
├── uploaded_by (ForeignKey: User)
└── timestamps

ProjectApproval (NEW TABLE)
├── id
├── project (ForeignKey)
├── action (submitted, approved, rejected, revised)
├── approver (ForeignKey: User)
├── notes
└── created_at
```

---

## 🧪 Testing Workflow

### Test Case 1: Document Upload

1. Login as Engineer
2. Go to Projects → View a project
3. Click "Upload Document"
4. Fill in details and upload a PDF
5. Document appears in "Project Documents" section

### Test Case 2: Approval Workflow

1. Login as Customer → Create a project
2. Login as Engineer → Go to Projects → View the project
3. In "Approval Workflow" section:
   - Add approval notes
   - Click "✅ Approve"
4. Login as Customer → See approval status updated ✅

### Test Case 3: Advanced Filtering

1. Go to Projects page
2. Click "🔍 Advanced Filters"
3. Filter by status = "approval"
4. Filter by approval_status = "pending"
5. See only projects matching filters

### Test Case 4: Email Notifications (if configured)

1. Check email when:
   - Document uploaded
   - Project approved/rejected
   - Changes requested

---

## 🔐 Permission Matrix

| Action                | Customer | Engineer | Admin |
| --------------------- | -------- | -------- | ----- |
| View own projects     | ✅       | ❌       | ❌    |
| View all projects     | ❌       | ✅       | ✅    |
| Create project        | ✅       | ✅       | ✅    |
| Upload documents      | ✅       | ✅       | ✅    |
| Approve projects      | ❌       | ✅       | ✅    |
| Reject projects       | ❌       | ✅       | ✅    |
| View approval history | ✅       | ✅       | ✅    |

---

## 🐛 Troubleshooting

### Documents not uploading

```
Solution: Check MEDIA_ROOT and MEDIA_URL in settings.py
Make sure backend/media/ directory exists and is writable
```

### Email not sending

```
Solution:
1. Check EMAIL_BACKEND setting
2. Verify Gmail app password in .env
3. Enable "Less secure apps" if using Gmail
4. Check consoleEmailBackend output in terminal
```

### Filtering not working

```
Solution:
1. Ensure django-filter is installed: pip install django-filter
2. Restart backend server: python manage.py runserver
3. Check REST_FRAMEWORK settings include DEFAULT_FILTER_BACKENDS
```

### Migration errors

```
Solution:
python manage.py migrate --fake-initial
python manage.py migrate projects 0003_add_documents_approvals
```

---

## 📂 File Structure

```
backend/
├── projects/
│   ├── models.py (✨ Updated: Project, Document, ProjectApproval)
│   ├── serializers.py (✨ Updated: DocumentSerializer, ProjectApprovalSerializer)
│   ├── views.py (✨ Updated: DocumentViewSet, ProjectApprovalViewSet)
│   ├── urls.py (✨ Updated)
│   ├── notifications.py (✨ NEW)
│   └── migrations/
│       └── 0003_add_documents_approvals.py (✨ NEW)
├── factoryiq/
│   └── settings.py (✨ Updated: Email config, django-filter)
└── requirements.txt (✨ Updated: Added django-filter)

frontend/
├── src/
│   ├── components/
│   │   ├── AdvancedFilters.jsx (✨ NEW)
│   │   ├── DocumentUpload.jsx (✨ NEW)
│   │   ├── DocumentsList.jsx (✨ NEW)
│   │   └── ApprovalWorkflow.jsx (✨ NEW)
│   ├── views/
│   │   └── ProjectsPage.jsx (✨ Updated)
│   └── index.css (✨ Updated: New styles)
```

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm install
npm start

# Terminal 3: Optional - Monitor Emails
# Watch backend terminal for email output
```

---

## 📝 API Testing with Postman

### Test Document Upload

```
POST /api/documents/
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body (form-data):
  project: 1
  title: "BOM v1.0"
  document_type: "bom"
  description: "Bill of materials"
  file: <select file>
```

### Test Approval

```
POST /api/projects/1/approve/
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "notes": "Looks good, approved!"
}
```

### Test Filtering

```
GET /api/projects/?status=approval&approval_status=pending&search=test
Headers:
  Authorization: Bearer <token>
```

---

## 💾 Backup & Export

To backup documents:

```bash
# Copy media folder
cp -r backend/media/ backup/media/

# Export database
mysqldump -u root amazon > backup/database.sql
```

---

## 🎓 Learning Resources

- Django FileField: https://docs.djangoproject.com/en/6.0/ref/models/fields/#filefield
- Django Signals (for auto-notifications): https://docs.djangoproject.com/en/6.0/topics/signals/
- React File Upload: https://react.dev/learn/managing-state
- DRF Filters: https://django-filter.readthedocs.io/

---

## ✅ Feature Checklist

- [x] Document upload system
- [x] Email notifications configuration
- [x] Approval workflow API
- [x] Advanced filtering UI
- [x] Project approval status tracking
- [x] Document versioning
- [x] Permission-based approval
- [x] Responsive UI
- [x] Error handling
- [x] Loading states

---

## 🎯 Next Steps (Future Enhancements)

1. Add WebSocket for real-time notifications
2. Implement audit logs
3. Add batch approve/reject
4. Create report generation
5. Add automatic workflow transitions
6. Implement email templates
7. Add document preview
8. Create approval dashboard

---

Generated: March 19, 2026
Version: 2.0 (Full Features)
Status: ✅ Complete & Ready for Production
