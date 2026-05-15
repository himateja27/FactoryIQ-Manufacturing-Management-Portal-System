FactoryIQ Manufacturing Management Portal Architecture
1. System Overview
FactoryIQ is a manufacturing management portal built as a single-page React/Vite frontend that communicates with a Django REST backend.

Frontend: frontend/
Backend: backend/
API prefix: /api/
Local frontend dev server: http://localhost:5173/
Local backend dev server: http://127.0.0.1:8000/
The application supports:

User registration and login
JWT authentication
Role-based navigation and access control
Projects, production, quality, and inventory views
Backend data services for user profile and business domain APIs
2. Frontend Architecture
2.1 Entry point and routing
frontend/src/main.jsx: bootstraps React and renders the app.
frontend/src/App.jsx: defines the main route tree.
Route summary:

/ redirects to /dashboard if authenticated, otherwise /login
/login renders LoginPage
/register renders RegisterPage
Protected routes under RequireAuth:
/dashboard → DashboardPage
/projects → ProjectsPage
/production → ProductionPage
/quality → QualityPage
/inventory → InventoryPage
Any unknown route redirects to /
2.2 Authentication flow
frontend/src/lib/auth.js manages auth token state using localStorage.
frontend/src/context/AuthContext.jsx manages current user data and refresh logic.
frontend/src/ui/RequireAuth.jsx blocks access to protected pages when no token exists and redirects to /login.
frontend/src/ui/AppLayout.jsx renders the main shell and navigation bar for logged-in users.
Auth state behavior:

Login obtains a JWT access token from /api/auth/token/
Token is saved with setAccessToken() into localStorage
AuthContext fetches /api/auth/profile/ to load user details and role
Logout clears token and sends the user back to /login
2.3 Page and navigation behavior
AppLayout provides the shared layout and top navigation for protected pages.
AppLayout uses user role to conditionally show links:
admin sees all pages
engineer sees dashboard, projects, production
quality sees dashboard, projects, quality
customer sees dashboard, projects
Page list:

LoginPage.jsx: username/password login
RegisterPage.jsx: create account with username, email, name, role, password
DashboardPage.jsx: main landing page after login
ProjectsPage.jsx: project management view
ProductionPage.jsx: production workflow view
QualityPage.jsx: quality management view
InventoryPage.jsx: inventory and supply chain view
2.4 API client
frontend/src/lib/api.js exports a shared Axios instance.
Default backend base URL is http://127.0.0.1:8000 unless overridden by VITE_API_BASE_URL.
The Axios instance attaches the Authorization: Bearer <token> header automatically when available.
If the backend returns 401 Unauthorized, the frontend clears auth state and forces re-login.
2.5 Data flow for auth and registration
Registration flow:

User submits the form in RegisterPage
Frontend POSTs /api/auth/register/ with JSON payload
Backend creates a user and returns success
Frontend redirects to /login
Login flow:

User submits credentials in LoginPage
Frontend POSTs /api/auth/token/ and receives JWT access token
Token is stored in localStorage
AuthContext refreshes the user profile from /api/auth/profile/
User is redirected to /dashboard
3. Backend Architecture
3.1 Django project layout
backend/manage.py: Django CLI entry point
backend/factoryiq/: Django project configuration
settings.py: project settings, installed apps, database setup, CORS, authentication
urls.py: root URL routing and API namespace setup
backend/users/: authentication user app
backend/projects/, backend/production/, backend/quality/, backend/supplychain/: domain apps
3.2 Authentication backend
backend/users/models.py: custom User model extends AbstractUser
Adds role with choices admin, engineer, quality, customer
backend/users/serializers.py:
RegisterSerializer: creates new users and hashes password
UserSerializer: returns authenticated user profile data
backend/users/views.py:
RegisterView: allows unauthenticated POST to create a user
ProfileView: authenticated GET for current user profile
backend/factoryiq/urls.py configures auth endpoints:
api/auth/register/
api/auth/profile/
api/auth/token/
api/auth/token/refresh/
3.3 API routing and domain apps
Root URL routing in backend/factoryiq/urls.py:

api/auth/ → users.urls
api/auth/token/ and api/auth/token/refresh/ → JWT views
api/ → includes projects, production, quality, supplychain URL modules
This creates a clean API boundary where the frontend only interacts with /api/ endpoints.

3.4 Request flow for protected resources
When frontend sends a request to a protected endpoint, the shared Axios client attaches the JWT access token.
Django REST Framework authenticates the token and determines user identity.
Protected views use permissions.IsAuthenticated or custom permissions to allow access.
The backend returns domain data for projects, production, quality, or inventory.
3.5 Database and environment behavior
Development uses SQLite when DJANGO_USE_SQLITE=1.
Production is configured for MySQL by environment variables, but local development is intentionally simplified.
Migrations are managed via backend/manage.py migrate.
4. File and feature mapping
Frontend key files:

frontend/src/App.jsx: main route definitions
frontend/src/context/AuthContext.jsx: current user and auth refresh logic
frontend/src/lib/api.js: REST client
frontend/src/lib/auth.js: localStorage token helper
frontend/src/ui/AppLayout.jsx: authenticated page shell and navigation
frontend/src/ui/RequireAuth.jsx: protects routes
frontend/src/views/LoginPage.jsx: login screen
frontend/src/views/RegisterPage.jsx: registration screen
frontend/src/views/DashboardPage.jsx: dashboard landing page
Backend key files:

backend/factoryiq/settings.py: application settings and CORS configuration
backend/factoryiq/urls.py: root API routing
backend/users/models.py: custom user definition
backend/users/serializers.py: auth serializers
backend/users/views.py: registration and profile views
backend/users/urls.py: auth endpoint paths
5. Navigation and access flow
Public pages:

/login: user login page
/register: new account creation page
Protected pages (require valid JWT):

/dashboard
/projects
/production
/quality
/inventory
Protected pages are rendered inside AppLayout and share the same header/navigation.

Role-based visibility:

admin: can access all protected pages
engineer: sees production in addition to dashboard and projects
quality: sees quality in addition to dashboard and projects
customer: sees only dashboard and projects
6. Practical notes
If the backend is not running, registration and login fail because the frontend cannot reach /api/auth/*.
If tokens are invalid or expired, the frontend clears auth and forces re-login.
The backend must be reachable at VITE_API_BASE_URL or the default backend URL for frontend requests to work.
For development, start backend first, then frontend.
7. Recommended startup sequence
cd backend
python manage.py migrate
python manage.py runserver
cd ../frontend
npm install
npm run dev
This ensures the backend API is available before the frontend starts making authenticated requests.
