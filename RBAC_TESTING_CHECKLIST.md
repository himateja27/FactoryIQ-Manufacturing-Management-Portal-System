# 🧪 RBAC Testing & Verification Checklist

**Status:** Ready for Testing
**Last Updated:** March 19, 2026

---

## ✅ Pre-Testing Verification

### Backend Setup

- [ ] Django server running: `python manage.py runserver`
- [ ] Database migrations applied: `python manage.py migrate`
- [ ] Test users created with different roles

### Frontend Setup

- [ ] React development server running: `npm start`
- [ ] AuthContext properly installed in `frontend/src/context/AuthContext.js`
- [ ] App.jsx wrapped with AuthProvider
- [ ] No console errors (F12 Dev Tools)

---

## 🔑 Test User Accounts

Create these test users before testing:

### Admin Account

```
Username: admin_test
Email: admin@test.local
Password: TestAdmin123!
Role: admin
```

### Engineer Account

```
Username: eng_test
Email: engineer@test.local
Password: TestEng123!
Role: engineer
```

### Quality Account

```
Username: qa_test
Email: qa@test.local
Password: TestQA123!
Role: quality
```

### Customer Accounts (Create 2)

```
Customer 1:
Username: cust1_test
Email: customer1@test.local
Password: TestCust123!
Role: customer

Customer 2:
Username: cust2_test
Email: customer2@test.local
Password: TestCust123!
Role: customer
```

---

## 📋 Test Case #1: Admin User Access

### Objective: Admin can access all features

#### Test 1.1: Dashboard Visibility

- [ ] Login as `admin_test`
- [ ] Dashboard loads without errors
- [ ] See **Project Overview** stats (total, approved, pending, rejected)
- [ ] See **Production KPIs** section (output, defects, rate)
- [ ] See **Quality NCR Stats** section (open, investigating, closed)
- [ ] See **Profile Info** with role showing "👨‍💼 ADMIN"
- **Expected:** All 4 sections visible ✓

#### Test 1.2: Navigation Menu

- [ ] Verify menu shows all items:
  - [ ] Dashboard
  - [ ] Projects
  - [ ] Production ✓
  - [ ] Quality ✓
  - [ ] Inventory ✓
- **Expected:** 5 menu items visible ✓

#### Test 1.3: Projects Page

- [ ] Navigate to Projects
- [ ] Can see all projects (from all customers)
- [ ] Can create new project
- [ ] Fields include: name, description, **customer selection**
- [ ] Can approve/reject projects
- **Expected:** Full CRUD + approval ✓

#### Test 1.4: Production Page

- [ ] Navigate to Production
- [ ] Can view all production records
- [ ] Can create new record
- [ ] Can record output and defects
- [ ] Can view production by shift
- **Expected:** Full CRUD access ✓

#### Test 1.5: Quality Page

- [ ] Navigate to Quality
- [ ] Can view all NCRs
- [ ] Can create new NCR
- [ ] Can update NCR status
- [ ] Can view NCR details
- **Expected:** Full CRUD access ✓

#### Test 1.6: Inventory Page

- [ ] Navigate to Inventory
- [ ] Can view all items
- [ ] Can edit item quantities
- [ ] Can view all shipments
- [ ] Can manage shipments
- **Expected:** Full CRUD access ✓

**Test 1 Result:** ⚫ PASS / ⚪ FAIL

---

## 📋 Test Case #2: Engineer User Access

### Objective: Engineer can access production but not quality

#### Test 2.1: Dashboard Visibility

- [ ] Login as `eng_test`
- [ ] Dashboard loads without errors
- [ ] See **Project Overview** stats
- [ ] See **Production KPIs** section ✓
- [ ] See **Quality NCR Stats** section ❌ (should NOT appear)
- [ ] See **Profile Info** with role showing "👷 ENGINEER"
- **Expected:** Only Project + Production sections visible ✓

#### Test 2.2: Navigation Menu

- [ ] Verify menu shows:
  - [ ] Dashboard ✓
  - [ ] Projects ✓
  - [ ] Production ✓
  - [ ] Quality ❌ (hidden)
  - [ ] Inventory ✓
- **Expected:** 4 menu items (Quality hidden) ✓

#### Test 2.3: Production Access

- [ ] Navigate to Production
- [ ] Can view all production records
- [ ] Can create new production record
- [ ] Can edit production records
- **Expected:** Full production access ✓

#### Test 2.4: Quality Access

- [ ] Try to navigate directly to `/quality` via URL
- [ ] Should be blocked or redirected
- **Expected:** Cannot access quality page ✓

#### Test 2.5: Projects Approval

- [ ] Go to Projects page
- [ ] See "Approve" and "Reject" buttons
- [ ] Can approve a pending project
- [ ] Can reject a project
- **Expected:** Approval capability enabled ✓

**Test 2 Result:** ⚫ PASS / ⚪ FAIL

---

## 📋 Test Case #3: Quality User Access

### Objective: Quality can only access quality features

#### Test 3.1: Dashboard Visibility

- [ ] Login as `qa_test`
- [ ] Dashboard loads without errors
- [ ] See **Project Overview** stats
- [ ] See **Production KPIs** section ❌ (should NOT appear)
- [ ] See **Quality NCR Stats** section ✓
- [ ] See **Profile Info** with role showing "🔬 QUALITY"
- **Expected:** Only Project + Quality sections visible ✓

#### Test 3.2: Navigation Menu

- [ ] Verify menu shows:
  - [ ] Dashboard ✓
  - [ ] Projects ✓
  - [ ] Production ❌ (hidden)
  - [ ] Quality ✓
  - [ ] Inventory ❌ (hidden)
- **Expected:** 3 menu items ✓

#### Test 3.3: Quality Access

- [ ] Navigate to Quality
- [ ] Can view all Quality NCRs
- [ ] Can create new NCR
- [ ] Can update NCR status
- **Expected:** Full quality access ✓

#### Test 3.4: Production Blocked

- [ ] Try to navigate directly to `/production` via URL
- [ ] Should not load production page
- **Expected:** Cannot access production ✓

#### Test 3.5: Inventory Blocked

- [ ] Try to navigate directly to `/inventory` via URL
- [ ] Should not load inventory page
- **Expected:** Cannot access inventory ✓

**Test 3 Result:** ⚫ PASS / ⚪ FAIL

---

## 📋 Test Case #4: Customer User Access

### Objective: Customer can only see own projects

#### Test 4.1: Dashboard Visibility

- [ ] Login as `cust1_test`
- [ ] Dashboard loads without errors
- [ ] See **Project Overview** for OWN projects only
- [ ] Production KPIs ❌ (hidden)
- [ ] Quality NCR Stats ❌ (hidden)
- [ ] See **Profile Info** with role showing "🏢 CUSTOMER"
- **Expected:** Only own project stats + profile ✓

#### Test 4.2: Navigation Menu

- [ ] Verify menu shows:
  - [ ] Dashboard ✓
  - [ ] Projects ✓
  - [ ] Production ❌ (hidden)
  - [ ] Quality ❌ (hidden)
  - [ ] Inventory ❌ (hidden)
- **Expected:** 2 menu items only ✓

#### Test 4.3: Projects Access

- [ ] Navigate to Projects
- [ ] Can see only OWN projects (created by `cust1_test`)
- [ ] Cannot see `cust2_test` projects
- [ ] Can create new project
- [ ] Cannot approve projects (no approval button)
- **Expected:** View and create only ✓

#### Test 4.4: Create Project

- [ ] Click "Create Project + button"
- [ ] Fill form (name, description)
- [ ] Note: **NO customer selection field** (pre-filled)
- [ ] Submit project
- **Expected:** Project created for current customer ✓

#### Test 4.5: Upload Document

- [ ] Click on own project
- [ ] Upload a document
- [ ] Document appears in project details
- **Expected:** Document upload works ✓

#### Test 4.6: Protected Routes

- [ ] Try direct URL `/production` → blocked ✓
- [ ] Try direct URL `/quality` → blocked ✓
- [ ] Try direct URL `/inventory` → blocked ✓
- **Expected:** All advanced pages blocked ✓

#### Test 4.7: Cross-Customer Isolation

- [ ] Login as `cust1_test`, create "Project Alpha"
- [ ] Logout and login as `cust2_test`
- [ ] Navigate to Projects
- [ ] Cannot see "Project Alpha" ✓
- [ ] Can create own projects
- **Expected:** Complete data isolation ✓

**Test 4 Result:** ⚫ PASS / ⚪ FAIL

---

## 📋 Test Case #5: API Endpoint Security

### Objective: Backend rejects unauthorized API calls

#### Test 5.1: Production API (Engineer Only)

- [ ] Open browser console (F12)
- [ ] Login as `cust1_test` (customer)
- [ ] Run: `fetch('/api/production/').then(r => r.json()).then(console.log)`
- **Expected:** Either empty list OR 403 error ✓

#### Test 5.2: Quality API (Quality Only)

- [ ] Login as `eng_test` (engineer)
- [ ] Run: `fetch('/api/quality/ncrs/').then(r => r.json()).then(console.log)`
- **Expected:** Either empty list OR 403 error ✓

#### Test 5.3: Approval API (Admin/Engineer Only)

- [ ] Login as `cust1_test` (customer)
- [ ] Create a project
- [ ] Try to approve via API (manual network request)
- **Expected:** 403 Forbidden ✓

#### Test 5.4: Profile Endpoint

- [ ] Login as any user
- [ ] Run: `fetch('/api/auth/profile/').then(r => r.json()).then(console.log)`
- [ ] Should see: `{ id, username, email, role, first_name, last_name }`
- **Expected:** Returns user with correct role ✓

**Test 5 Result:** ⚫ PASS / ⚪ FAIL

---

## 📋 Test Case #6: Session Management

### Objective: Verify role changes on login/logout

#### Test 6.1: Login/Logout Cycle

- [ ] Login as `admin_test` → See all menu items
- [ ] Check browser localStorage: `localStorage.getItem('factoryiq.accessToken')`
- [ ] Logout
- [ ] Check localStorage cleared
- [ ] Login as `cust1_test` → See limited menu items ✓
- **Expected:** Menu updates properly after login/logout ✓

#### Test 6.2: Token Expiration (Optional)

- [ ] Login with any user
- [ ] Wait for token expiration (24 hours) OR manually clear token
- [ ] Try to navigate to protected page
- **Expected:** Redirects to login ✓

#### Test 6.3: Page Refresh

- [ ] Login as `eng_test`
- [ ] Refresh page (F5)
- [ ] Dashboard should still show engineering content
- [ ] Menu should still show production option
- **Expected:** AuthContext reloads user profile ✓

**Test 6 Result:** ⚫ PASS / ⚪ FAIL

---

## 📋 Test Case #7: Error Handling

### Objective: Verify proper error messages

#### Test 7.1: Unauthorized Access

- [ ] Login as customer
- [ ] Try to POST document approval via API manually
- **Expected:** 403 Forbidden + error message ✓

#### Test 7.2: Missing Token

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Try to access `/projects`
- **Expected:** Redirects to login page ✓

#### Test 7.3: Invalid Token

- [ ] Edit localStorage token to invalid value
- [ ] Try to reload page
- **Expected:** Redirects to login ✓

**Test 7 Result:** ⚫ PASS / ⚪ FAIL

---

## 📊 Test Results Summary

| Test Case | Description           | Result          | Notes |
| --------- | --------------------- | --------------- | ----- |
| 1         | Admin Full Access     | ⚫ PASS ⚪ FAIL |       |
| 2         | Engineer Production   | ⚫ PASS ⚪ FAIL |       |
| 3         | Quality QA-Only       | ⚫ PASS ⚪ FAIL |       |
| 4         | Customer Isolation    | ⚫ PASS ⚪ FAIL |       |
| 5         | API Endpoint Security | ⚫ PASS ⚪ FAIL |       |
| 6         | Session Management    | ⚫ PASS ⚪ FAIL |       |
| 7         | Error Handling        | ⚫ PASS ⚪ FAIL |       |

---

## 🐛 Known Issues & Workarounds

### Issue: AuthContext not loading after login

**Workaround:** Hard refresh (Ctrl+Shift+R) to clear React cache

### Issue: Customer can't create projects

**Workaround:** Verify `customer` field is properly set in Project model

### Issue: API returns 401 Unauthorized

**Workaround:** Clear localStorage and login again

---

## 📝 Notes

- Token expiration: 24 hours by default (configurable in Django settings)
- CORS enabled for `http://localhost:3000`
- All role checks are case-sensitive (use lowercase: 'admin', 'engineer', etc.)
- For production, implement proper unauthorized error page

---

## ✅ Sign-Off

- [ ] All tests passed
- [ ] No security issues found
- [ ] RBAC fully operational
- [ ] Ready for user acceptance testing

**Tested By:** ******\_\_\_******
**Date:** ******\_\_\_******
**Signature:** ******\_\_\_******
