# 🚀 RBAC Deployment & Setup Guide

**Version:** 1.0
**Last Updated:** March 19, 2026
**Status:** Production Ready

---

## 📋 Quick Start (5 minutes)

### 1. Verify Backend Files

```bash
# Check that these files exist and are modified
backend/
├── users/
│   ├── models.py (User.role field exists)
│   ├── views.py (ProfileView added)
│   ├── serializers.py (UserSerializer added)
│   └── urls.py (profile/ path added)
└── projects/
    └── models.py (customer field nullable)
```

### 2. Verify Frontend Files

```bash
# Check that these files exist
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js (NEW)
│   ├── ui/
│   │   └── AppLayout.jsx (modified with useAuth)
│   ├── views/
│   │   ├── DashboardPage.jsx (modified with role-based sections)
│   │   ├── ProductionPage.jsx (exists)
│   │   ├── QualityPage.jsx (exists)
│   │   └── InventoryPage.jsx (exists)
│   └── App.jsx (wrapped with AuthProvider)
└── package.json (has dependencies)
```

### 3. Start Services

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm start
```

### 4. Test RBAC

- Open http://localhost:3000
- Login with test user (see Test Users section)
- Verify role badge appears in top-right
- Check that menu filters by role

---

## 🔧 Installation & Configuration

### Backend Setup

#### Step 1: Verify Django Apps Installed

```bash
cd backend
python manage.py shell
```

```python
from django.apps import apps
print(apps.get_app_config('users'))  # Should work
print(apps.get_app_config('projects'))  # Should work
```

#### Step 2: Create Superuser (Optional)

```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@local
# Password: (secure password)
```

#### Step 3: Create Test Users

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Admin
User.objects.create_user(
    username='admin',
    email='admin@local.com',
    password='admin123',
    role='admin'
)

# Engineer
User.objects.create_user(
    username='engineer',
    email='eng@local.com',
    password='eng123',
    role='engineer'
)

# Quality
User.objects.create_user(
    username='quality',
    email='qa@local.com',
    password='qa123',
    role='quality'
)

# Customer 1
User.objects.create_user(
    username='customer1',
    email='cust1@local.com',
    password='cust123',
    role='customer'
)

# Customer 2
User.objects.create_user(
    username='customer2',
    email='cust2@local.com',
    password='cust123',
    role='customer'
)

# Logout
exit()
```

#### Step 4: Migrations

```bash
python manage.py migrate
```

**Expected Output:**

```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, ...
Running migrations:
  ...
  0004_project_customer_nullable
  ...
```

#### Step 5: Verify Permission Classes Exist

```bash
# Check that permission classes are defined
grep -r "IsAdminOrEngineer" backend/
grep -r "IsNotCustomer" backend/
```

**Expected:** Found in production/views.py and projects/views.py

### Frontend Setup

#### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

#### Step 2: Verify AuthContext Module

```bash
# Check that AuthContext exists
ls -la src/context/AuthContext.js
```

#### Step 3: Verify CORS Setting

```bash
# frontend/vite.config.js should have CORS proxy
cat vite.config.js
```

**Expected:**

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

#### Step 4: Build Verification (Optional)

```bash
npm run build
# Creates dist/ directory
```

---

## 🏗️ Architecture Overview

### File Changes Summary

#### New Files Created

1. **`frontend/src/context/AuthContext.js`** (48 lines)
   - Purpose: Centralized user authentication state
   - Exports: `AuthProvider`, `useAuth()` hook
   - Fetches: `/api/auth/profile/` on app mount

#### Modified Files

1. **`backend/users/views.py`**
   - Added: `ProfileView` class (RetrieveAPIView)
   - Returns: Authenticated user with role

2. **`backend/users/serializers.py`**
   - Added: `UserSerializer` class
   - Fields: id, username, email, first_name, last_name, role

3. **`backend/users/urls.py`**
   - Added: `path("profile/", ProfileView.as_view())`

4. **`frontend/src/App.jsx`**
   - Wrapped: `<Routes>` with `<AuthProvider>`
   - Added: Product page imports

5. **`frontend/src/ui/AppLayout.jsx`**
   - Added: `useAuth()` hook integration
   - Added: Role-based navigation filtering
   - Added: Role badge display

6. **`frontend/src/views/DashboardPage.jsx`**
   - Added: Role-based section visibility
   - Added: Conditional API calls by role
   - Added: Role-specific KPI cards

---

## 🔐 Security Checklist

### Backend Security

- [ ] User passwords are hashed (Django default)
- [ ] JWT tokens set to expire (24 hours)
- [ ] CORS configured to only allow frontend origin
- [ ] Permission classes on all privileged endpoints
- [ ] Queryset filtering by user.role
- [ ] Database credentials in .env file (not hardcoded)

### Frontend Security

- [ ] JWT token stored in localStorage only
- [ ] No sensitive data in JWT (public info only)
- [ ] Navigation filtering as defense-in-depth (not primary security)
- [ ] API interceptor adds token to all requests
- [ ] Logout clears localStorage

### Deployment Security

- [ ] HTTPS enabled (not HTTP)
- [ ] Django DEBUG = False in production
- [ ] ALLOWED_HOSTS configured
- [ ] SECRET_KEY unique and strong
- [ ] Database user has minimal permissions

---

## 🐛 Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'rest_framework'"

```bash
# Solution: Install Django REST framework
pip install djangorestframework
pip freeze > requirements.txt
```

### Problem: CORS error in browser console

```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution:**

```python
# backend/factoryiq/settings.py
INSTALLED_APPS = [
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Problem: Profile endpoint returns 404

**Solution:** Verify users/urls.py has profile path:

```python
path("profile/", views.ProfileView.as_view(), name="profile")
```

### Problem: Role badge not showing in header

**Solution:**

1. Check browser console for errors (F12)
2. Verify AuthContext.js exists
3. Verify App.jsx wraps with `<AuthProvider>`
4. Hard refresh: Ctrl+Shift+R
5. Check that `/api/auth/profile/` returns user with role

### Problem: Customer sees all projects

**Solution:** Verify projects/views.py queryset filtering:

```python
def get_queryset(self):
    user = self.request.user
    if getattr(user, "role", None) == "customer":
        return Project.objects.filter(customer=user)
    return Project.objects.all()
```

### Problem: Engineer can't approve projects

**Solution:** Verify permission class in projects/views.py:

```python
permission_classes = [IsAdminOrEngineer]
```

---

## 📊 Environment Variables

### Backend (.env file)

```
DEBUG=False
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=mysql://user:password@localhost:3306/factoryiq
JWT_EXPIRATION_HOURS=24
```

### Frontend (.env.local file)

```
VITE_API_URL=http://localhost:8000
```

---

## 📈 Performance Considerations

### Database Queries

- `GET /api/auth/profile/` - 1 query (single user fetch)
- `GET /api/projects/` (customer) - 1 query (filtered by customer_id)
- `GET /api/production/` (admin) - 1 query (no filter)

**Optimization:** Add select_related() for foreign keys if needed

### Frontend

- AuthContext fetches user once on app mount (cached in context)
- No additional profile requests (token contains no user info)
- Dashboard conditionally fetches data by role (no wasted requests)

---

## 🚀 Production Deployment

### Using Gunicorn + Nginx

#### 1. Backend (Gunicorn)

```bash
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:8000 factoryiq.wsgi:application
```

#### 2. Frontend (Static Build)

```bash
cd frontend
npm run build
# Nginx serves dist/ directory
```

#### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

#### 4. Environment Variables

```bash
# Create .env file in backend/
export $(cat .env | xargs)
gunicorn factoryiq.wsgi:application
```

---

## 📝 Maintenance

### Regular Tasks

- [ ] Monitor JWT token expiration
- [ ] Audit user role assignments
- [ ] Check API logs for 403 Forbidden errors
- [ ] Verify CORS configuration
- [ ] Update dependencies monthly

### Backup Strategy

- [ ] Daily database backups
- [ ] Weekly code repository backups
- [ ] Store backups off-server

---

## 📞 Support & Documentation

### Code Documentation

- See `RBAC_DOCUMENTATION.md` for detailed role definitions
- See `RBAC_TESTING_CHECKLIST.md` for verification procedures

### Quick Reference

```bash
# Django Shell - Check user roles
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.values('username', 'role')

# Check AuthContext in browser console
>>> localStorage.getItem('factoryiq.accessToken')
>>> console.log(authContext.user)
```

---

## ✅ Pre-Launch Checklist

- [ ] All migrations applied
- [ ] Test users created with all roles
- [ ] JWT token generation working
- [ ] `/api/auth/profile/` endpoint accessible
- [ ] Frontend AuthContext loading user profile
- [ ] Role-based navigation showing correct menu items
- [ ] Dashboard showing role-specific sections
- [ ] Permission classes blocking unauthorized requests
- [ ] CORS configured correctly
- [ ] No console errors (F12 check)
- [ ] Mobile responsive (viewport configured)
- [ ] Error handling graceful
- [ ] Documentation complete

---

## 🎯 Next Steps

1. **Complete Setup:** Follow Quick Start section above
2. **Run Tests:** Follow RBAC_TESTING_CHECKLIST.md
3. **Enable Features:** Each role now has specialized dashboard
4. **Monitor:** Check logs for permission violations
5. **Optimize:** Add caching if performance scales needed

---

**For questions or issues, refer to:**

- RBAC_DOCUMENTATION.md - Detailed role specification
- RBAC_TESTING_CHECKLIST.md - Test procedures
- Code comments in source files
