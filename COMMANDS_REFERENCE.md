# 🔧 Installation & Execution Commands

## 📋 Prerequisites Check

```bash
# Check Python version (need 3.9+)
python --version

# Check Node version (need 16+)
node --version

# Check MySQL is running
mysql -u root -p
# Type password, should show mysql>
# Then type: exit
```

---

## 🚀 Step-by-Step Installation

### Step 1: Backend Dependencies

```bash
# Navigate to backend
cd backend

# Install new package
pip install django-filter==25.1

# Or reinstall all requirements to be safe
pip install -r requirements.txt

# Output: Successfully installed django-filter
```

### Step 2: Database Migrations

```bash
# Create migrations for new models
python manage.py makemigrations

# Output:
# Migrations for 'projects':
#   projects/migrations/0003_add_documents_approvals.py

# Apply migrations
python manage.py migrate

# Output:
# Running migrations:
#   Applying projects.0003_add_documents_approvals... OK
```

### Step 3: Create Media Directory

```bash
# Documents will be stored here
mkdir -p media/documents

# Verify it was created
ls -la media/
# Should show: documents/
```

### Step 4: Optional Email Configuration

```bash
# Create .env file in backend directory
# (Skip if you want emails to print to console)

cat > .env << EOF
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
EOF

# Verify .env was created
cat .env
```

### Step 5: Start Backend Server

```bash
# Start Django development server
python manage.py runserver

# Output:
# Watching for file changes with StatReloader
# Quit the server with CONTROL-C.
# Started development server at http://127.0.0.1:8000/

# ✅ Backend running on port 8000
```

### Step 6: Frontend Installation

```bash
# Open new terminal
# Navigate to frontend
cd frontend

# Install JavaScript dependencies
npm install

# Output:
# added XXX packages in X.Xs
```

### Step 7: Start Frontend Server

```bash
# Start React development server
npm start

# Output:
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help

# ✅ Frontend running on port 5173
# 🌐 Browser should auto-open to http://localhost:5173
```

---

## ✅ Verify Installation

### Test Backend API

```bash
# In new terminal, test if backend is working
curl -X GET http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Or use browser: http://localhost:8000/api/projects/
# (You'll see an auth error - this is expected if not logged in)
```

### Test Frontend

```bash
# Open browser
open http://localhost:5173

# Should see FactoryIQ login page
# ✅ If you see login form, frontend is working!
```

---

## 🧪 Full Test Sequence

### Quick Test (2 minutes)

```bash
# Terminal 1: Backend running
# Terminal 2: Frontend running

# Browser: Go to http://localhost:5173
# 1. Register new user (or login with existing)
# 2. Create new project
# 3. Click "▶ View" on project
# 4. See document upload section appear
# 5. Click "🔍 Advanced Filters" at top
# 6. See filter panel appear
# ✅ All three new features visible!
```

### Complete Test (5-10 minutes)

```bash
# 1. Advanced Filters
#    - Click filter button
#    - Select status filter
#    - Apply
#    - ✅ Table filters

# 2. Document Upload
#    - Create text file: echo "test" > test.txt
#    - Go to project detail
#    - Upload the file
#    - ✅ Document appears in list

# 3. Approvals (needs 2 users)
#    - Login as engineer
#    - View project
#    - Click Approve with notes
#    - Check project status updates
#    - ✅ Status changes to Approved

# 4. Emails (optional)
#    - Check Django console output
#    - Should see email content printed
#    - ✅ Email logged
```

---

## 🔄 Troubleshooting Commands

### Django Won't Start

```bash
# Check migrations
python manage.py showmigrations projects

# If stuck, remake migrations
python manage.py migrate --fake projects 0002_initial
python manage.py migrate

# Check database
python manage.py dbshell
# mysql> SHOW TABLES;
# mysql> exit
```

### Frontend Port Already in Use

```bash
# Kill process on port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
PORT=3000 npm start
```

### Django Port in Use

```bash
# Kill process on port 8000
# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
python manage.py runserver 8001
```

### Database Connection Error

```bash
# Test MySQL connection
mysql -u root -p

# Verify database exists
# mysql> SHOW DATABASES;
# You should see "amazon" or your DB name

# If missing, create it
# mysql> CREATE DATABASE amazon;
# mysql> exit
```

### File Upload Not Working

```bash
# Check media directory exists
ls -la backend/media/

# If missing, create it
mkdir -p backend/media/documents

# Check permissions
chmod 755 backend/media

# Restart Django
# Ctrl+C to stop
python manage.py runserver
```

### Filters Not Showing

```bash
# Verify django-filter installed
pip show django-filter

# If not installed
pip install django-filter==25.1

# Restart Django server
# Ctrl+C
python manage.py runserver

# Refresh browser
# Ctrl+F5 (hard refresh)
```

---

## 📊 Terminal Output Reference

### Successful Backend Startup

```
Django version 6.0.3, using settings 'factoryiq.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Successful Frontend Startup

```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Successful Migration

```
Operations to perform:
  Synchronize unmigrated apps: messages, admin, sessions, auth, contenttypes
  Apply all migrations: projects, users, ...
    Applying projects.0003_add_documents_approvals... OK
```

---

## 🎯 Commands by Feature

### To Enable All Features:

```bash
# Backend setup
pip install -r requirements.txt         # Install deps
python manage.py migrate                # Update DB
mkdir -p media/documents                # Create storage

# Frontend setup
npm install                             # Install deps

# Run both
python manage.py runserver &            # Backend (background)
npm start                               # Frontend (foreground)
```

### To Test Document Upload:

```bash
# Create test file
echo "Test content" > test_document.pdf

# Go to http://localhost:5173
# Login → Create project → View → Upload test_document.pdf
# ✅ Document should appear in list
```

### To Test Approvals:

```bash
# Terminal 1: Start servers
python manage.py runserver
npm start

# Browser: Create 2 sessions
# Session 1: Login as customer
# Session 2: Login as engineer

# Session 1: Create project
# Session 2: Approve project
# Session 1: Refresh - see ✅ Approved
```

### To Test Filters:

```bash
# Browsers: Create multiple projects with different status

# Click "🔍 Advanced Filters"
# Select status = "rnd"
# Click "✓ Apply Filters"
# ✅ Only RnD projects show
```

### To Test Emails:

```bash
# Watch Django console
# (Terminal showing backend server)

# Upload document OR approve project
# Check console - should show email heading and content
# ✅ "From: noreply@factoryiq.com" etc.
```

---

## 📱 Mobile Testing

```bash
# Get your machine IP
# Mac/Linux: ifconfig | grep inet
# Windows: ipconfig | grep IPv4

# Access frontend from phone on same network
# Replace 127.0.0.1 with your IP
http://YOUR_IP:5173

# Backend API still uses localhost:8000
# (Ensure both are on same network)
```

---

## 🧹 Cleanup Commands

```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Clear npm cache
npm cache clean --force

# Clear Django temp files
rm -rf backend/media/documents/*

# Reset database migrations (⚠️ WARNING: Deletes data!)
python manage.py migrate zero projects
python manage.py migrate projects

# Remove node_modules (reinstall with npm install)
rm -rf frontend/node_modules
```

---

## 🚀 Production Deployment Commands

```bash
# Backend
python manage.py collectstatic --noinput
python manage.py migrate --noinput
gunicorn factoryiq.wsgi:application --bind 0.0.0.0:8000

# Frontend
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

---

## 📝 Full Setup Script

**Create this as `setup.sh`:**

```bash
#!/bin/bash

echo "🚀 FactoryIQ Full Setup"
echo "======================="

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

echo "🗄️ Running migrations..."
python manage.py migrate

echo "📁 Creating media directory..."
mkdir -p media/documents

# Frontend setup
echo "⚛️ Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd backend && python manage.py runserver"
echo "2. Terminal 2: cd frontend && npm start"
echo ""
echo "Then open http://localhost:5173"
```

**Run it:**

```bash
chmod +x setup.sh
./setup.sh
```

---

## ⚡ TL;DR - Just Run These

```bash
# Backend
cd backend
pip install django-filter==25.1
python manage.py migrate
mkdir -p media/documents
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm start

# Done! ✅
# Open http://localhost:5173
```

---

## 💾 Useful Django Commands

```bash
# Create superuser (admin account)
python manage.py createsuperuser

# Access Django shell (Python REPL with Django)
python manage.py shell

# Check installed packages
pip list | grep -E "django|rest_framework|filter"

# Run tests
python manage.py test

# Collect static files (production)
python manage.py collectstatic

# Check for issues
python manage.py check

# Squash migrations (cleanup)
python manage.py squashmigrations projects 0003
```

---

## ✅ Verification Checklist

After running all commands, verify with:

```bash
# ✅ Check 1: Django server running
curl http://localhost:8000/api/projects/ 2>/dev/null | grep -q "results" && echo "✅ Backend OK" || echo "❌ Backend Down"

# ✅ Check 2: Frontend server running
curl http://localhost:5173 2>/dev/null | grep -q "html" && echo "✅ Frontend OK" || echo "❌ Frontend Down"

# ✅ Check 3: Media directory exists
test -d backend/media/documents && echo "✅ Media DIR OK" || echo "❌ Media DIR Missing"

# ✅ Check 4: django-filter installed
pip show django-filter | grep -q "Version" && echo "✅ Filters OK" || echo "❌ Filters Missing"
```

---

**Ready? Start with the TL;DR section above! 🚀**
