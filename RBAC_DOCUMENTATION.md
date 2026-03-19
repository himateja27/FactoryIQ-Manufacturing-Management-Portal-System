# 🔐 Role-Based Access Control (RBAC) Documentation

## Overview

FactoryIQ implements comprehensive role-based access control to ensure users only see and interact with data relevant to their role.

---

## 🧑‍💼 User Roles

### 1. **ADMIN** (👨‍💼 Administrator)

**Access Level:** FULL SYSTEM ACCESS

#### Permissions:

- ✅ View all projects (regardless of customer)
- ✅ Create/edit/delete projects
- ✅ Approve/reject projects
- ✅ View all production records
- ✅ Create production records
- ✅ View all quality NCRs
- ✅ Create/manage NCRs
- ✅ View all inventory items
- ✅ Manage inventory items
- ✅ Track all shipments
- ✅ View all user analytics
- ✅ Access admin dashboard

#### Dashboard Visibility:

- Project overview (all projects)
- Production KPIs (all records)
- Quality NCR status (all NCRs)
- Analytics across entire system

#### Navigation Menu:

- Dashboard ✅
- Projects ✅
- Production ✅
- Quality ✅
- Inventory ✅

---

### 2. **ENGINEER** (👷 Engineer)

**Access Level:** PRODUCTION & PROJECT OVERSIGHT

#### Permissions:

- ✅ View all projects
- ✅ Approve/reject projects
- ❌ Create projects (customers only)
- ✅ View all production records
- ✅ Create production records
- ✅ Edit production records
- ❌ View quality NCRs (quality team only)
- ❌ Manage inventory (limited to view)
- ✅ View inventory
- ❌ Manage shipments (limited to view)
- ✅ View shipments

#### Dashboard Visibility:

- Project overview (all projects)
- Production KPIs (all records)
- Production chart (output vs defects)
- ❌ Quality metrics (not visible)

#### Navigation Menu:

- Dashboard ✅
- Projects ✅
- Production ✅
- Quality ❌ (hidden)
- Inventory ✅ (read-only for some)

#### Key Use Cases:

- Monitor production line performance
- Track output and defects
- Approve customer projects before production

---

### 3. **QUALITY** (🔬 Quality Manager)

**Access Level:** QUALITY & COMPLIANCE MANAGEMENT

#### Permissions:

- ✅ View all projects
- ❌ Approve projects (engineers only)
- ✅ View all quality NCRs
- ✅ Create/manage NCRs
- ✅ Update NCR status
- ❌ Create production records (engineers only)
- ✅ View production records
- ❌ Manage inventory
- ✅ View inventory
- ❌ Manage shipments

#### Dashboard Visibility:

- Project overview (all projects)
- Quality NCR status (open, investigating, closed)
- ❌ Production charts (not visible)
- Problem area tracking

#### Navigation Menu:

- Dashboard ✅
- Projects ✅
- Production ❌ (hidden)
- Quality ✅
- Inventory ❌ (hidden)

#### Key Use Cases:

- Create non-conformance reports (NCRs)
- Track defects and issues
- Monitor quality compliance

---

### 4. **CUSTOMER** (🏢 Customer/Client)

**Access Level:** OWN PROJECT VISIBILITY

#### Permissions:

- ✅ View only OWN projects
- ✅ Create own projects
- ✅ Upload documents to own projects
- ✅ View approval status of own projects
- ❌ Approve projects (admin/engineers only)
- ❌ Create production records
- ❌ View production data
- ❌ View quality NCRs
- ❌ Access inventory/shipment data
- ✅ View own document uploads

#### Dashboard Visibility:

- Own project count
- Own project approval status
- ❌ Production metrics (not visible)
- ❌ Quality metrics (not visible)

#### Navigation Menu:

- Dashboard ✅
- Projects ✅ (own projects only)
- Production ❌ (hidden)
- Quality ❌ (hidden)
- Inventory ❌ (hidden)

#### Key Use Cases:

- Track project status
- Submit projects for approval
- Upload project documents (BOM, specs, etc.)
- Monitor approval workflow

---

## 🔄 Access Control Implementation

### Backend Enforcement (Django)

#### API Queryset Filtering

```python
# Example from projects/views.py
def get_queryset(self):
    user = self.request.user
    if getattr(user, "role", None) == "customer":
        # Customers only see their own projects
        return Project.objects.filter(customer=user)
    # Admin/Engineer see all
    return Project.objects.all()
```

#### Permission Classes

```python
# Only admin/engineer can approve
class IsAdminOrEngineer(permissions.BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        return role in ["admin", "engineer"]

# Quality team only
class IsQualityTeam(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, "role", None) == "quality"

# Non-customers (staff)
class IsNotCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, "role", None) != "customer"
```

### Frontend Enforcement (React)

#### Role Detection

```javascript
// Using useAuth hook from context
const { user, isRole } = useAuth();

// Check single role
if (isRole("admin")) {
}

// Check multiple roles
if (isRole(["admin", "engineer"])) {
}
```

#### Conditional Navigation

```javascript
// AppLayout.jsx
const canViewProduction = ["admin", "engineer"].includes(user?.role);
const canViewQuality = ["admin", "quality"].includes(user?.role);

{
  canViewProduction && <NavLink to="/production">Production</NavLink>;
}
```

#### Page-Level Protection

```javascript
// DashboardPage.jsx
{
  ["admin", "engineer"].includes(user?.role) && <div>Production KPIs...</div>;
}
```

---

## 📊 Data Access Matrix

| Feature          | Admin | Engineer | Quality | Customer |
| ---------------- | ----- | -------- | ------- | -------- |
| **Projects**     |       |          |         |          |
| View all         | ✅    | ✅       | ✅      | ❌       |
| View own         | ✅    | ❌       | ❌      | ✅       |
| Create           | ✅    | ❌       | ❌      | ✅       |
| Approve          | ✅    | ✅       | ❌      | ❌       |
| **Production**   |       |          |         |          |
| View records     | ✅    | ✅       | ✅      | ❌       |
| Create records   | ✅    | ✅       | ❌      | ❌       |
| **Quality**      |       |          |         |          |
| View NCRs        | ✅    | ❌       | ✅      | ❌       |
| Create NCRs      | ✅    | ❌       | ✅      | ❌       |
| Manage NCRs      | ✅    | ❌       | ✅      | ❌       |
| **Inventory**    |       |          |         |          |
| View items       | ✅    | ✅       | ❌      | ❌       |
| Manage items     | ✅    | ❌       | ❌      | ❌       |
| View shipments   | ✅    | ✅       | ❌      | ❌       |
| Manage shipments | ✅    | ❌       | ❌      | ❌       |
| **Documents**    |       |          |         |          |
| View all         | ✅    | ❌       | ❌      | ❌       |
| Upload own       | ✅    | ❌       | ❌      | ✅       |

---

## 🔐 Authentication Flow

### 1. Login

```
User enters credentials
↓
Backend validates credentials
↓
Returns JWT token
↓
Frontend stores token in localStorage
```

### 2. Profile Load

```
Frontend has token
↓
Calls /api/auth/profile/ with token
↓
Backend returns user object with role
↓
Frontend stores user info in AuthContext
```

### 3. Authorization Checks

```
Each API request includes JWT token
↓
Backend extracts user from token
↓
Verifies user role has permission
↓
Returns filtered data (queryset filtering)
```

---

## 📝 User Creation Examples

### Create Admin User

```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_user(
    username='admin1',
    email='admin@factory.com',
    password='secure_password',
    role='admin'
)
```

### Create Engineer User

```bash
User.objects.create_user(
    username='engineer1',
    email='eng@factory.com',
    password='secure_password',
    role='engineer'
)
```

### Create Quality User

```bash
User.objects.create_user(
    username='quality1',
    email='qa@factory.com',
    password='secure_password',
    role='quality'
)
```

### Create Customer User

```bash
User.objects.create_user(
    username='customer1',
    email='customer@company.com',
    password='secure_password',
    role='customer'
)
```

---

## 🧪 Testing RBAC

### Test as Admin

1. Login with admin account
2. Should see all menu items
3. Can view all projects, production, quality, inventory
4. Dashboard shows all data

### Test as Engineer

1. Login with engineer account
2. Should NOT see Quality menu
3. Can view all projects and production
4. Cannot see inventory management
5. Dashboard shows project + production data

### Test as Quality

1. Login with quality account
2. Should NOT see Production menu
3. Should NOT see Inventory menu
4. Can create/manage NCRs
5. Dashboard shows only quality metrics

### Test as Customer

1. Login with customer account
2. Should only see Dashboard and Projects
3. Projects page shows only own projects
4. Cannot access production, quality, or inventory pages
5. Dashboard limited to own project data

---

## 🛡️ Security Best Practices

✅ All API endpoints check user role
✅ Frontend hides UI based on role (defense in depth)
✅ Backend filters queryset by user
✅ Sensitive operations require specific roles
✅ JWT tokens expire (24 hours by default)
✅ Passwords hashed with bcrypt
✅ CORS configured for frontend origin
✅ No sensitive data in tokens

---

## 🔧 Troubleshooting RBAC

### Issue: Customer can see other projects

**Solution:** Check queryset filtering in views.py - ensure `filter(customer=user)`

### Issue: Engineer can't approve

**Solution:** Verify user has 'engineer' or 'admin' role - check User table

### Issue: Role not showing in dashboard

**Solution:** Call /api/auth/profile/ endpoint - ensure AuthContext loads user

### Issue: Menu items still visible after logout

**Solution:** Clear localStorage - `localStorage.clear()`

---

## 📞 Support

For RBAC issues:

1. Check backend logs: `python manage.py runserver` output
2. Check browser console (F12) for API errors
3. Verify user role in database: `SELECT role FROM users_user WHERE username='...'`
4. Test API directly: `curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/projects/`

---

**Last Updated:** March 19, 2026
**Version:** 1.0 - Full RBAC Implementation
