# ⚡ RBAC Quick Reference Guide

**For:** Developers, DevOps, QA Testing
**Version:** 1.0
**Last Updated:** March 19, 2026

---

## 🚀 Start Here (1 minute)

### Run the Application

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm start

# Browser
http://localhost:3000
```

### Test Credentials

| Role     | Username  | Password | Expected Menu                     |
| -------- | --------- | -------- | --------------------------------- |
| Admin    | admin     | admin123 | All 5 items                       |
| Engineer | engineer  | eng123   | 4 items (no Quality)              |
| Quality  | quality   | qa123    | 3 items (no Production/Inventory) |
| Customer | customer1 | cust123  | 2 items (Dashboard, Projects)     |

---

## 📋 Key Files Reference

### Backend

```
backend/users/
├── models.py          → User.role field (ADMIN, ENGINEER, QUALITY, CUSTOMER)
├── views.py           → ProfileView (GET /api/auth/profile/)
├── serializers.py     → UserSerializer (returns role)
└── urls.py            → route("profile/", ...)

backend/projects/
└── views.py           → Queryset filtering: filter(customer=user) for customers

backend/production/
└── views.py           → Permission class: IsAdminOrEngineer

backend/factoryiq/
└── settings.py        → CORS_ALLOWED_ORIGINS
```

### Frontend

```
frontend/src/
├── context/
│   └── AuthContext.js         → Centralized user state + useAuth() hook
├── App.jsx                     → Wrapped with <AuthProvider>
├── ui/
│   └── AppLayout.jsx           → Role-based navigation filtering
└── views/
    ├── DashboardPage.jsx       → Role-specific KPI cards
    ├── ProductionPage.jsx      → Admin/Engineer only (enforced in nav)
    ├── QualityPage.jsx         → Admin/Quality only (enforced in nav)
    └── InventoryPage.jsx       → Admin/Engineer only (enforced in nav)
```

---

## 🔌 API Endpoints

### Authentication

```bash
# Get current user with role
GET /api/auth/profile/
Headers: Authorization: Bearer TOKEN

Response:
{
  "id": 1,
  "username": "admin",
  "email": "admin@local.com",
  "role": "admin",
  "first_name": "",
  "last_name": ""
}
```

### Projects

```bash
# Admin/Engineer see all projects
# Customer sees only own projects (filter applied in backend)
GET /api/projects/

# Create project (customer or admin)
POST /api/projects/

# Approve project (admin/engineer only)
PATCH /api/projects/{id}/approve/
```

### Production

```bash
# Admin/Engineer see all records
# Customers cannot access
GET /api/production/

# Create production record
POST /api/production/
Permission: IsAdminOrEngineer
```

### Quality

```bash
# Get NCRs
GET /api/quality/ncrs/

# Create NCR
POST /api/quality/ncrs/
```

### Inventory

```bash
# Get items
GET /api/inventory/
Permission: IsNotCustomer

# Manage inventory
POST/PATCH /api/inventory/
Permission: Admin/Engineer only
```

---

## 💻 Using useAuth() Hook

### In Any React Component

```javascript
import { useAuth } from "../context/AuthContext";

export function MyComponent() {
  const { user, loading, logout, isRole } = useAuth();

  // Check single role
  if (isRole("admin")) {
    return <AdminContent />;
  }

  // Check multiple roles
  if (isRole(["admin", "engineer"])) {
    return <ProductionContent />;
  }

  // Use user data
  return (
    <div>
      <p>Welcome, {user?.username}</p>
      <p>Your role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### In Conditional Rendering

```javascript
// Show section only to admin/engineer
{
  isRole(["admin", "engineer"]) && <ProductionKPIs />;
}

// Show section only to admin/quality
{
  isRole(["admin", "quality"]) && <QualityStats />;
}

// Show only to non-customers
{
  !isRole("customer") && <AdvancedFeatures />;
}
```

---

## 🔐 Permission Classes

### IsAdminOrEngineer

```python
from rest_framework import permissions

class IsAdminOrEngineer(permissions.BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, 'role', None)
        return role in ['admin', 'engineer']
```

**Used for:** Project approval, Production record creation

### IsNotCustomer

```python
class IsNotCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) != 'customer'
```

**Used for:** Inventory management, Shipment tracking

---

## 🧪 Quick Testing

### Test Navigation Filtering

1. Login as admin → Should see all 5 menu items
2. Login as engineer → Should see 4 items (Quality hidden)
3. Login as quality → Should see 3 items (Production, Inventory hidden)
4. Login as customer → Should see 2 items (only Dashboard, Projects)

### Test Data Isolation

```javascript
// Browser console after login as customer1
fetch("/api/projects/")
  .then((r) => r.json())
  .then((projects) => {
    // Should only see projects where customer_id = current user
    console.log("Projects for customer:", projects);
  });
```

### Test API Restrictions

```javascript
// As customer, try to create production record
fetch("/api/production/", {
  method: "POST",
  headers: { Authorization: "Bearer TOKEN" },
  body: JSON.stringify({ output: 100, defects: 2 }),
});
// Should get 403 Forbidden
```

---

## 🛠️ Common Tasks

### Add New Role

1. Add to `User.Role` enum in `backend/users/models.py`
2. Update `isRole()` checks in components
3. Add permission class if needed
4. Update navigation filters in `AppLayout.jsx`
5. Update dashboard sections in `DashboardPage.jsx`

### Restrict Page to Role

1. Add conditional in `AppLayout.jsx`:
   ```javascript
   const canViewNewPage = ["admin", "role2"].includes(user?.role);
   {
     canViewNewPage && <NavLink to="/newpage">New Page</NavLink>;
   }
   ```
2. Add permission class to backend view
3. Add queryset filtering if needed

### Change Role Permissions

1. Edit permission class in `backend/views.py`
2. Update queryset filtering logic
3. Update frontend navigation in `AppLayout.jsx`
4. Update dashboard in `DashboardPage.jsx`
5. Test with affected role

---

## 🐛 Debug Checklist

### Issue: Menu shows all items to all users

- [ ] Check `App.jsx` wrapped with `<AuthProvider>`
- [ ] Check `AuthContext.js` exists
- [ ] Check `AppLayout.jsx` has `useAuth()` hook
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check console for errors (F12)

### Issue: Role not showing

- [ ] Verify `/api/auth/profile/` returns role field
- [ ] Check backend `ProfileView` exists
- [ ] Check UserSerializer includes role
- [ ] Check AuthContext calls profile endpoint
- [ ] Check localStorage for token

### Issue: Customer can see all projects

- [ ] Check `projects/views.py` queryset filtering
- [ ] Verify: `filter(customer=user)` for customers
- [ ] Check user object has role attribute
- [ ] Check Django queryset filtering applied

### Issue: Permission denied but should allowed

- [ ] Check permission class on view
- [ ] Verify user has correct role in database
- [ ] Check role string matches exactly ('admin' not 'Admin')
- [ ] Check queryset filtering not blocking access

---

## 📊 Role Comparison

```
Feature                 Admin    Engineer Quality Customer
────────────────────────────────────────────────────────────
View Dashboard          ✓        ✓        ✓       ✓
View All Projects       ✓        ✓        ✓       ✗
View Own Projects       ✓        ✗        ✗       ✓
Approve Projects        ✓        ✓        ✗       ✗
Create Projects         ✓        ✗        ✗       ✓
View Production         ✓        ✓        ✓       ✗
Create Production       ✓        ✓        ✗       ✗
View Quality            ✓        ✗        ✓       ✗
Create Quality          ✓        ✗        ✓       ✗
Manage Inventory        ✓        ✗        ✗       ✗
View Inventory          ✓        ✓        ✗       ✗
```

---

## 🎨 UI Elements

### Role Badge (in Header)

```javascript
{
  getRoleLabel(user?.role);
}
// Returns: "👨‍💼 Admin" or "👷 Engineer" etc.
```

### Conditional Section

```javascript
{
  isRole(["admin", "engineer"]) && (
    <div className="kpiCard">
      <h3>Production KPIs</h3>
      ...
    </div>
  );
}
```

### Role-Based Message

```javascript
{
  isRole("admin") && <p>You have full access</p>;
}
{
  isRole("customer") && <p>You can manage your projects</p>;
}
```

---

## 📝 Useful Commands

```bash
# Check user roles in database
sqlite3 db.sqlite3 "SELECT username, role FROM users_user;"

# Django shell
python manage.py shell

# List all migrations
python manage.py showmigrations

# Create superuser
python manage.py createsuperuser

# Reset auth token (if JWT issues)
python manage.py shell
>>> from rest_framework.authtoken.models import Token
>>> Token.objects.all().delete()

# Check API
curl http://localhost:8000/api/auth/profile/

# Check frontend build
npm run build
```

---

## 🚨 Error Messages & Solutions

| Error                  | Cause                    | Fix                                     |
| ---------------------- | ------------------------ | --------------------------------------- |
| 403 Forbidden          | Permission denied        | Check user role + permission class      |
| 404 Not Found          | Profile endpoint missing | Verify `users/urls.py` has profile path |
| CORS error             | Frontend not allowed     | Check `CORS_ALLOWED_ORIGINS`            |
| Token expired          | JWT too old              | Login again                             |
| AuthContext undefined  | Not wrapped              | Check App.jsx has AuthProvider          |
| Menu showing all items | Role not loading         | Hard refresh + check profile endpoint   |

---

## ✅ Pre-Deployment

- [ ] All tests pass (see RBAC_TESTING_CHECKLIST.md)
- [ ] 5 test users created with different roles
- [ ] Login flow verified for each role
- [ ] Navigation filtering working
- [ ] Dashboard customization verified
- [ ] API endpoint security tested
- [ ] No console errors
- [ ] No database warnings
- [ ] Migrations applied
- [ ] .env file configured

---

## 📞 Help & References

**Full Documentation:**

- `RBAC_DOCUMENTATION.md` - Detailed specifications
- `RBAC_TESTING_CHECKLIST.md` - Test procedures
- `RBAC_DEPLOYMENT_GUIDE.md` - Deployment steps
- `RBAC_COMPLETION_SUMMARY.md` - Project summary

**For Questions:**

1. Check documentation files above
2. Review code comments in source files
3. Check browser console (F12) for errors
4. Check Django server output for API errors

---

**Last Updated:** March 19, 2026
**Version:** 1.0
**Status:** Production Ready ✅
