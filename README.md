FactoryIQ Manufacturing Management Portal

FactoryIQ is a full-stack manufacturing management platform built with React + Vite on the frontend and Django REST Framework on the backend.
It provides secure JWT authentication, role-based access control, and modules for projects, production, quality management, and inventory tracking.

🚀 Features
JWT Authentication
User Registration & Login
Role-Based Access Control
Protected Frontend Routes
Manufacturing Dashboard
Project Management
Production Workflow Management
Quality Management
Inventory & Supply Chain Management
REST API Architecture
React SPA Frontend
Django REST Backend
🛠 Tech Stack
Frontend
React
Vite
React Router DOM
Axios
Context API
Backend
Django
Django REST Framework
SimpleJWT
SQLite (Development)
MySQL (Production)
📁 Project Structure
FactoryIQ/
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── ui/
│   │   ├── views/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── factoryiq/
│   ├── users/
│   ├── projects/
│   ├── production/
│   ├── quality/
│   ├── supplychain/
│   └── manage.py
│
└── README.md
⚙️ System Architecture
Frontend

The frontend is a single-page application built with React and Vite.

Main Responsibilities
Authentication handling
Protected routing
Role-based navigation
API communication
Dashboard and business modules
Important Files
File	Purpose
src/main.jsx	React entry point
src/App.jsx	Main route configuration
src/context/AuthContext.jsx	Authentication state management
src/lib/api.js	Shared Axios API client
src/lib/auth.js	JWT localStorage helper
src/ui/RequireAuth.jsx	Route protection
src/ui/AppLayout.jsx	Shared authenticated layout
Backend

The backend is built using Django REST Framework and provides REST APIs for authentication and manufacturing modules.

Main Responsibilities
JWT authentication
User management
API authorization
Domain services
Database interaction
Important Files
File	Purpose
factoryiq/settings.py	Project settings
factoryiq/urls.py	Root API routing
users/models.py	Custom user model
users/serializers.py	Authentication serializers
users/views.py	Registration and profile APIs
users/urls.py	Authentication routes
🔐 Authentication Flow
Registration
User submits registration form

Frontend sends POST request to:

/api/auth/register/
Backend creates user and hashes password
User is redirected to login page
Login
User submits credentials

Frontend sends POST request to:

/api/auth/token/
Backend returns JWT access token
Token is stored in localStorage

Frontend loads current user profile from:

/api/auth/profile/
🔒 Protected Routes

The following routes require authentication:

/dashboard
/projects
/production
/quality
/inventory

If JWT token expires or becomes invalid:

Frontend automatically clears auth state
User is redirected to /login
👥 Role-Based Access Control
Role	Accessible Pages
admin	All pages
engineer	Dashboard, Projects, Production
quality	Dashboard, Projects, Quality
customer	Dashboard, Projects
🌐 API Endpoints
Authentication APIs
Endpoint	Method	Description
/api/auth/register/	POST	Register new user
/api/auth/token/	POST	Obtain JWT token
/api/auth/token/refresh/	POST	Refresh JWT token
/api/auth/profile/	GET	Current user profile
📡 API Client Behavior

The frontend uses a shared Axios instance.

Features

Automatically attaches:

Authorization: Bearer <token>
Handles unauthorized responses
Clears invalid sessions automatically
🗄 Database Configuration
Development

Uses SQLite when:

DJANGO_USE_SQLITE=1
Production

Configured for MySQL using environment variables.

▶️ Local Development Setup
1️⃣ Clone Repository
git clone <your-repository-url>
cd FactoryIQ
2️⃣ Backend Setup
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver

Backend runs on:

http://127.0.0.1:8000/
3️⃣ Frontend Setup

Open another terminal:

cd frontend

npm install

npm run dev

Frontend runs on:

http://localhost:5173/
🔄 Recommended Startup Sequence

Start backend first:

cd backend
python manage.py migrate
python manage.py runserver

Then start frontend:

cd frontend
npm install
npm run dev
📌 Environment Variables
Frontend
VITE_API_BASE_URL=http://127.0.0.1:8000
Backend

Example:

DJANGO_USE_SQLITE=1

Production MySQL variables can also be configured.

🧩 Application Modules
Dashboard

Central landing page after login.

Projects

Project management and tracking.

Production

Production workflow management.

Quality

Quality assurance and monitoring.

Inventory

Inventory and supply chain tracking.

🔐 Security Features
JWT authentication
Protected API endpoints
Role-based authorization
Automatic logout on token expiration
Password hashing using Django authentication system
📈 Future Improvements
Refresh token rotation
Notifications system
Real-time production updates
Analytics dashboard
File uploads
Audit logs
Deployment with Docker
CI/CD integration
👨‍💻 Author

Developed by Hima Teja

📄 License

This project is licensed under the MIT License.
