# 🏗️ Architecture & Feature Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Projects Page                 New Components                     │
│  ├─ Advanced Filters ────────→ AdvancedFilters.jsx              │
│  ├─ Project List              ├─ Status filter                   │
│  │   ├─ Details Expand ─────→ │  Approval filter                │
│  │   ├─ Documents ──────────→ DocumentsList.jsx                 │
│  │   │   └─ Upload ────────→ DocumentUpload.jsx                 │
│  │   └─ Approval ──────────→ ApprovalWorkflow.jsx               │
│  │       ├─ Approve/Reject                                       │
│  │       └─ Request Changes                                      │
│  │                                                                │
│  └─ API Calls (Axios with Auth Token)                            │
│                                                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    [HTTP REST API]
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      BACKEND (Django)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  API Endpoints (DRF ViewSets)                                    │
│                                                                   │
│  ProjectViewSet ────────────────────────────────────────────┐    │
│  ├─ GET /projects/                                         │    │
│  ├─ POST /projects/                                        │    │
│  ├─ POST /projects/{id}/approve/                          │    │
│  ├─ POST /projects/{id}/reject/                           │    │
│  ├─ POST /projects/{id}/request_revision/                 ├──→ Project Model
│  └─ POST /projects/{id}/submit_for_approval/              │    │ ├─ name
│                                                             │    │ ├─ status
│  DocumentViewSet ────────────────────────────────────────┐ │    │ ├─ description
│  ├─ GET /documents/                                      │ │    │ ├─ approval_status
│  ├─ POST /documents/ (Upload)                            ├─┼──→ ├─ approved_by
│  ├─ GET /documents/{id}/                                 │ │    │ └─ approved_at
│  ├─ PUT /documents/{id}/                                 │ │    │
│  └─ DELETE /documents/{id}/                              │ │    │
│                                                           │ │    │
│  ProjectApprovalViewSet (Read-only) ────────────┐        │ │    │
│  ├─ GET /project-approvals/                     ├─────┐  │ │    │
│  └─ GET /project-approvals/{id}/                      └──┼─┼──→ Document Model
│                                                          │ │    │ ├─ project
│  Filtering & Search ──────────────────────────────────┐ │ │    │ ├─ title
│  ├─ django-filter (DjangoFilterBackend)              ├─┘ │    │ ├─ file
│  ├─ SearchFilter (name, description)                  │  │    │ ├─ type
│  └─ OrderingFilter (created_at, name)                 │  │    │ └─ uploaded_by
│                                                       │  │    │
│  Permission System ────────────────────────────────┐  │  │    │
│  ├─ IsAuthenticated                               │  │  │    │
│  ├─ IsAdminOrEngineer (for approvals)            ├──┘  │    │
│  └─ RBAC (Customer sees only their projects)      │     │    │
│                                                   │     │    │
│  Notifications ────────────────────────────────┐  │     │    │
│  ├─ NotificationService                       ├──┼─────┼──→ ProjectApproval Model
│  ├─ Email on approve/reject                   │  │     │    │ ├─ project
│  ├─ Email on document upload                  │  │     │    │ ├─ action
│  └─ Email on revision request                 │  │     │    │ ├─ approver
│                                                │  │     │    │ └─ notes
│  Email Config ────────────────────────────────┤  │     │    │
│  ├─ SMTP (Gmail, custom server)               │  │     │    │
│  ├─ Console (development)                     │  │     │    │
│  └─ HTML templates with context               │  │     │    │
│                                                │  │     │    │
│  Database ────────────────────────────────────┴──┴─────┘    │
│  └─ MySQL (amazon database)                                   │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Document Upload Flow

```
User clicks Upload
       ↓
Form submitted with:
  - title
  - document_type
  - description
  - file
       ↓
Frontend: FormData serialized
       ↓
POST /api/documents/
       ↓
Backend: DocumentViewSet.create()
       ↓
File saved to: backend/media/documents/YYYY/MM/DD/filename
       ↓
Document record created in DB
       ↓
NotificationService.send_document_uploaded()
       ↓
Email sent to project customer (optional)
       ↓
Response: {id, title, file_url, ...}
       ↓
Frontend: DocumentsList reloads
       ↓
User sees document in list ✅
```

### Approval Workflow Flow

```
Project Created
  status: "rnd"
  approval_status: "pending"
       ↓
Engineer views project
       ↓
Fills notes + Clicks "Approve"
       ↓
POST /api/projects/{id}/approve/
       ↓
Backend: ProjectViewSet.approve()
       ↓
Updates Project:
  - approval_status = "approved"
  - approved_by = engineer
  - approved_at = now()
       ↓
Creates ProjectApproval record
  - action = "approved"
  - notes = engineer's notes
       ↓
NotificationService.send_approval_status()
       ↓
Email sent to customer
       ↓
Response: {status: "approved"}
       ↓
Frontend: Page refreshes
       ↓
Customer sees ✅ Approved ✅
```

### Advanced Filter Flow

```
User clicks "Advanced Filters"
       ↓
Filter panel appears
       ↓
User selects:
  - status: "approval"
  - approval_status: "pending"
  - date range
  - search: "project name"
       ↓
Clicks "Apply"
       ↓
Frontend: load(filters)
       ↓
GET /api/projects/?status=approval&approval_status=pending&search=...
       ↓
Backend: DjangoFilterBackend + SearchFilter
       ↓
Filters applied in queryset
       ↓
Returns matching projects
       ↓
Frontend: Table updates with filtered results
       ↓
User sees only matching projects ✅
```

---

## Component Hierarchy

```
ProjectsPage
├── AdvancedFilters (collapsible)
│   ├── Status dropdown
│   ├── Approval Status dropdown
│   ├── Date inputs
│   ├── Search input
│   └── Apply/Reset buttons
│
├── Create Project Form
│   ├── Name input
│   ├── Description textarea
│   ├── Status select
│   └── Submit button
│
├── Projects Table
│   ├── ID column
│   ├── Project name column
│   ├── Status column
│   ├── Approval column
│   ├── Customer column
│   └── View button (toggles expanded view)
│
└── Project Detail (when expanded)
    ├── Project Info Card
    │   ├── Status badge
    │   ├── Approval status badge
    │   ├── Created date
    │   ├── Customer name
    │   └── Description
    │
    ├── DocumentsList
    │   ├── Document grid
    │   ├── Type badges
    │   ├── Download buttons
    │   └── Metadata
    │
    ├── DocumentUpload
    │   ├── Title input
    │   ├── Type select
    │   ├── Description textarea
    │   ├── File input
    │   └── Upload button
    │
    └── ApprovalWorkflow
        ├── Status display
        ├── Approval notes display
        ├── Approver info
        ├── Notes input
        ├── Action buttons
        │   ├── Approve
        │   ├── Reject
        │   └── Request Changes
        └── Error display
```

---

## State Management Flow

```
ProjectsPage (parent state)
├── projects [] ─────────────────┐
│                                │
├── selectedProject {...} ───────┼─→ DocumentsList
│                                │   └─ Uses projectId
├── filters {...} ───────────────┤
│                                ├─→ DocumentUpload
├── loading boolean ─────────────┤   └─ Uses projectId
│                                │
├── error string ────────────────┤
│                                └─→ ApprovalWorkflow
└── create {...}                    └─ Uses full project

When filters change:
  filters → load(filters) → API call → setProjects → Table updates

When document uploaded:
  onDocumentAdded() → load() → refreshes projects & documents

When approval action:
  onApprovalAction() → load() → updates approval_status display
```

---

## Database Relationships

```
User (Django)
  │
  ├─→ (1 to M) Project (created by customer)
  │   │
  │   ├─→ (1 to M) Document
  │   │   └─ uploaded_by → User
  │   │
  │   └─→ (1 to M) ProjectApproval
  │       └─ approver → User
  │
  ├─→ (1 to M) Document (as uploader)
  │
  └─→ (1 to M) ProjectApproval (as approver)
```

---

## API Request/Response Examples

### Document Upload Request

```http
POST /api/documents/ HTTP/1.1
Authorization: Bearer <token>
Content-Type: multipart/form-data

project=1
title=BOM v1.0
document_type=bom
description=Part list
file=<binary>
```

**Response:**

```json
{
  "id": 1,
  "project": 1,
  "project_name": "My Project",
  "title": "BOM v1.0",
  "document_type": "bom",
  "file": "https://api.test/media/documents/2026/03/19/bom_v1.pdf",
  "description": "Part list",
  "version": 1,
  "uploaded_by": 5,
  "uploaded_by_username": "engineer1",
  "created_at": "2026-03-19T10:30:00Z",
  "updated_at": "2026-03-19T10:30:00Z"
}
```

### Project Approval Request

```http
POST /api/projects/1/approve/ HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Looks good, approved!"
}
```

**Response:**

```json
{
  "status": "approved"
}
```

### Filter Query

```http
GET /api/projects/?status=approval&approval_status=pending&search=test HTTP/1.1
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Test Project",
    "status": "approval",
    "approval_status": "pending",
    "customer": 1,
    "customer_username": "customer1",
    ...
  }
]
```

---

## Technology Stack Map

```
Frontend Layer:
  React 18
  ├─ Components (DocumentUpload, etc.)
  ├─ Hooks (useState, useEffect)
  ├─ Axios (API calls)
  └─ CSS3 (Styling)

API Layer:
  Django REST Framework
  ├─ Serializers
  ├─ ViewSets
  ├─ Permissions
  ├─ Filters (django-filter)
  └─ Authentication (JWT)

Business Logic:
  Django Models
  ├─ Project (with approval fields)
  ├─ Document (with file storage)
  └─ ProjectApproval (audit trail)

Services:
  NotificationService
  ├─ Email backend (SMTP/Console)
  └─ Templates

Database:
  MySQL
  ├─ 3 main tables
  └─ Relationships
```

---

## Error Handling Flow

```
User Action
  ↓
Frontend Try/Catch
  ↓ (Error)
  └─→ Display error message

API Request
  ↓
Backend Try/Catch
  ↓ (Error)
  └─→ Return error response
      ├─ 400 Bad Request (validation)
      ├─ 401 Unauthorized (auth)
      ├─ 403 Forbidden (permission)
      └─ 500 Server Error

Email Send
  ↓
Try/Catch with fail_silently=True
  ↓ (Error)
  └─→ Log but don't crash
      └─ App continues normally ✅
```

---

## Deployment Architecture

```
Production Setup:
┌──────────────────┐
│   Load Balancer  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐  ┌───▼──┐
│Web 1 │  │Web 2 │  (Django servers)
└───┬──┘  └───┬──┘
    │         │
    └────┬────┘
         │
    ┌────▼────────┐
    │ MySQL Prod  │
    │ amazon DB   │
    └─────────────┘

Frontend served via CDN:
  Vercel/Netlify → Static files → Users

Storage:
  Media files → Cloudinary or AWS S3 (future)

Email:
  SMTP → Gmail / SendGrid service
```

---

This architecture supports:

- ✅ Scalability (stateless APIs)
- ✅ Reliability (error handling)
- ✅ Security (auth, permissions)
- ✅ Performance (filtering at database level)
- ✅ Maintainability (clear separation of concerns)
