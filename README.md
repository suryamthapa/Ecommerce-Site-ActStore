# Ecommerce-Site-ActStore
## Ecommerce Site built on top of Django and React.
#### Note:
- React Project is inside django project(backend/frontend).
- I have included the sqlite file just for the deployment purpose.
- Media Files(Images) are not visible in the site. Issue is open.

Access the app deployed on heroku using this link https://actstore.herokuapp.com/

### Specifications
1. Frontend - React
2. Backend - Django, Django restframework
3. State management - Redux

### Features
1. Login/Register user
2. Add to cart
3. Payment with PayPal
4. Admin Panel - CRUD operation
5. Pagination
6. Search with text

#### For Local setup:
1. Clone the repository.
2. Create virtual environment and install requirements inside it.
```
python3 -m venv /path/to/new/virtual/environment
pip install -r requirements.txt
```
3. Run django server
```
python manage.py runserver
```

