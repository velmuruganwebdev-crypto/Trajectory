Trajectory

Trajectory is a Django + frontend project with JWT authentication, PostgreSQL database, and CSV File management.
It has a separate frontend (HTML + JS) and backend (Django REST API).

Folder Structure:
endgame/
│
├── backend/
│   ├── .venv/                     # Virtual environment
│   ├── myproject/                 # Django project main folder
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── authentication/            # JWT-based authentication app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── statictables/              # Static table management app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── manage.py                  # Django management script
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── js/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── dashboard.js
│
└── requirements.txt

Step 1: clone the repository
git clone https://github.com/velmuruganwebdev-crypto/Trajectory.git
cd Trajectory/backend

Step 2: Create and activate virtual environment 

# Create virtual environment
python -m venv .venv

# Activate
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

Step 3: Install Dependencies
pip install -r requirements.txt

Step 4: Configure Database (PostgreSQL)
Edit->backend/myproject/settings.py

Example:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'trajectory_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

Create the database manually if needed:


CREATE DATABASE trajectory_db;

Step 5: Run Backend Migrations
python manage.py makemigrations
python manage.py migrate

Step 6: Create Superuser (Optional)
python manage.py createsuperuser

Step 7: Run Backend Server
python manage.py runserver 8000
Backend API will run on: http://127.0.0.1:8000/


Step 8: Run Frontend Server
Open another terminal
Navigate to frontend folder:
cd Trajectory/frontend
Run simple HTTP server on port 5500:
# Python 3
python -m http.server 5500

Open browser at:
http://127.0.0.1:5500/

Step 9: Using the Application
1. Register user via register.html
2. Login via login.html
3. After login, access dashboard.html
4. Dashboard will communicate with backend APIs on port 8000


Make sure both servers are running simultaneously

Backend → 8000

Frontend → 5500

Notes

.gitignore excludes unwanted files:

Virtual environment, migrations, uploads, environment files, old apps


Anyone downloading the repo gets the latest uploaded files.

Always run backend first, then frontend.
