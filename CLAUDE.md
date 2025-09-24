# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Django REST API backend for a food delivery/restaurant ordering system. It's part of a full-stack application where the frontend (React with TanStack Router) is in the parent directory. The backend handles products, categories, orders, and customer management with JWT authentication.

## Development Commands

### Setup and Installation
```bash
# Activate virtual environment (from backend directory)
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser
```

### Running the Application
```bash
# Start development server
python manage.py runserver

# Run on specific port
python manage.py runserver 8001
```

### Database Management
```bash
# Create new migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset migrations (if needed)
python manage.py migrate api zero
```

### Admin and Shell
```bash
# Access Django shell
python manage.py shell

# Collect static files (for production)
python manage.py collectstatic
```

## Architecture

### Core Models
- **Category**: Product categories (e.g., desserts, main courses)
- **Product**: Items with name, description, price, weight, ingredients, and image
- **Customer**: Business customers with company info and authentication
- **Order**: Customer orders with status tracking and delivery dates
- **OrderItem**: Individual products within orders with quantities and prices

### Authentication
- Uses Django REST Framework Simple JWT for token-based authentication
- Custom Customer model with password hashing and login tracking
- CORS configured for frontend at localhost:3000

### API Structure
- RESTful endpoints under `/api/`
- ViewSets for CRUD operations on main models
- Custom endpoints for authentication (`/api/auth/register/`, `/api/auth/login/`)
- Order creation with atomic transactions
- Product filtering by category and availability

### Key Files
- `config/settings.py`: Django configuration with JWT, CORS, and media settings
- `api/models.py`: Database models with Russian verbose names
- `api/views.py`: API endpoints and business logic
- `api/serializers.py`: Data serialization and validation
- `api/urls.py`: URL routing with DRF router
- `config/urls.py`: Main URL configuration

### Media Files
- Product images stored in `media/products/`
- Media files served in development via Django static files

### Database
- SQLite for development (db.sqlite3)
- Models use Russian field names for admin interface
- Automatic timestamps on models with created_at/updated_at

## API Endpoints

### Public Endpoints
- `GET /api/` - API overview
- `GET /api/health/` - Health check
- `GET /api/categories/` - List categories
- `GET /api/products/` - List products (with category filtering)
- `POST /api/auth/register/` - Customer registration
- `POST /api/auth/login/` - Customer login

### Order Management
- `GET /api/orders/` - List orders (with status filtering)
- `POST /api/orders/create_order/` - Create new order
- `PATCH /api/orders/{id}/update_status/` - Update order status

## Common Development Patterns

### Model Changes
1. Modify models in `api/models.py`
2. Run `python manage.py makemigrations`
3. Apply with `python manage.py migrate`
4. Update serializers if needed
5. Test in Django shell or admin

### Adding New Endpoints
1. Create/update serializers in `api/serializers.py`
2. Add views in `api/views.py`
3. Register routes in `api/urls.py`
4. Test with Django runserver

### Order Processing
Orders use atomic transactions to ensure data consistency. The create_order endpoint handles customer creation/lookup, order creation, and order item creation in a single transaction.

## Project Structure Context

This backend is part of a larger full-stack application:
- Frontend: React with TanStack Router (in parent directory)
- Backend: Django REST API (current directory)
- The system appears to be for restaurant/food delivery business management