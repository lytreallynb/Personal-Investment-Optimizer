# Personal Finance Optimizer

A full-stack web application that uses Linear Programming to generate optimal budget allocations based on your income, expenses, and financial goals.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## Documentation

**New users: Read [GUIDE.md](GUIDE.md)** - Complete guide with everything you need

- **[GUIDE.md](GUIDE.md)** - Simple, clear, complete user guide (START HERE)
- **[README.md](README.md)** (this file) - Technical documentation and API reference

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Budget Management**: Input and manage monthly income, fixed expenses, and variable spending categories
- **Financial Goals**: Set and track multiple financial goals with priorities and deadlines
- **LP Optimization**: Uses PuLP to solve Linear Programming problems for optimal budget allocation
- **Multiple Optimization Modes**:
  - **Maximize Savings**: Maximize monthly savings
  - **Balanced**: Balance savings with lifestyle quality
  - **Fastest Goal**: Minimize spending to reach goals faster
- **Interactive Visualizations**:
  - Pie chart for budget allocation
  - Line chart for savings trajectory
  - Bar chart for goal progress
- **Smart Recommendations**: AI-generated tips based on spending patterns
- **Scenario Analysis**: Test "what-if" scenarios without saving to database
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy 2.0** for ORM
- **Pydantic v2** for data validation
- **PuLP** for Linear Programming optimization
- **PostgreSQL** for database
- **JWT** authentication with python-jose
- **Uvicorn** ASGI server

### Deployment
- **Docker** and **Docker Compose** for containerization
- **Nginx** for frontend serving

## Project Structure

```
personal-finance-optimizer/
+-- frontend/                 # React TypeScript frontend
|   +-- src/
|   |   +-- components/      # React components
|   |   |   +-- Auth/        # Login & Register
|   |   |   +-- BudgetForm/  # Multi-step budget input
|   |   |   +-- Dashboard/   # Main dashboard with charts
|   |   |   +-- Charts/      # Visualization components
|   |   +-- hooks/           # Custom React hooks
|   |   +-- services/        # API service layer
|   |   +-- types/           # TypeScript type definitions
|   |   +-- App.tsx          # Main application
|   +-- Dockerfile
|   +-- package.json
+-- backend/                  # FastAPI backend
|   +-- app/
|   |   +-- api/             # API routes
|   |   |   +-- routes/      # Auth, Budget, Optimize endpoints
|   |   +-- core/            # Config, Security, Database
|   |   +-- models/          # SQLAlchemy models
|   |   +-- schemas/         # Pydantic schemas
|   |   +-- services/        # Business logic
|   |   |   +-- optimizer.py # LP optimization engine
|   |   +-- main.py          # FastAPI application
|   +-- Dockerfile
|   +-- requirements.txt
+-- docker-compose.yml        # Docker orchestration
+-- README.md

```

## Installation & Setup

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Git** for cloning the repository

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-optimizer
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Create an account**
   - Navigate to http://localhost:3000/register
   - Register with your email and password
   - Start optimizing your budget!

### Manual Setup (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**
   - Install PostgreSQL
   - Create database: `createdb finance_optimizer`
   - Update `DATABASE_URL` in `app/core/config.py`

5. **Run the backend**
   ```bash
   python run.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_URL=http://localhost:8000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

## How to Use

For complete step-by-step instructions, examples, and troubleshooting, see **[GUIDE.md](GUIDE.md)**.

Quick overview:
1. Start the app: `docker-compose up --build`
2. Open http://localhost:3000
3. Register an account
4. Complete the 4-step budget wizard:
   - Enter monthly income
   - Add fixed expenses (rent, insurance, etc.)
   - Set min/max for variable expenses (groceries, dining, etc.)
   - Define financial goals
5. View your optimized budget on the dashboard
6. Try different optimization modes (Maximize Savings, Balanced, Fastest Goal)

For detailed guidance, read [GUIDE.md](GUIDE.md)

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Budget Endpoints

```
POST /api/budget/              # Create/update budget profile
GET  /api/budget/              # Get current budget
GET  /api/budget/history       # Get optimization history
```

### Optimization Endpoints

```
POST /api/optimize/            # Run optimization
POST /api/optimize/scenario    # What-if analysis
GET  /api/optimize/recommendations  # Get recommendations
```

Full API documentation available at: http://localhost:8000/docs

## Linear Programming Model

The optimization engine uses PuLP to solve the following LP problem:

**Decision Variables:**
- `x[i]`: Monthly spending in variable category i
- `s`: Monthly savings

**Objective Function (Max Savings mode):**
```
maximize: s
```

**Constraints:**
```
1. Budget balance: SUM(x[i]) + fixed_expenses + s = monthly_income
2. Category bounds: min[i] <= x[i] <= max[i]
3. Goal constraint: s * months >= savings_goal
4. Non-negativity: s >= 0
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/finance_optimizer
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## Development

### Running Tests (Backend)
```bash
cd backend
pytest
```

### Building for Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Troubleshooting

### Port Already in Use
If ports 3000, 8000, or 5432 are already in use:
```bash
# Stop existing containers
docker-compose down

# Or change ports in docker-compose.yml
```

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### Frontend Not Loading
```bash
# Clear browser cache
# Check that VITE_API_URL is set correctly
# Ensure backend is running and accessible
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **PuLP** for LP optimization capabilities
- **FastAPI** for the excellent web framework
- **Recharts** for beautiful visualizations
- **Tailwind CSS** for rapid UI development

## Future Enhancements

- [ ] Export budget reports as PDF
- [ ] Multi-currency support
- [ ] Recurring transaction tracking
- [ ] Bank account integration (Plaid)
- [ ] Investment portfolio optimization
- [ ] Debt payoff calculator
- [ ] Mobile app (React Native)
- [ ] Email notifications for goals
- [ ] Budget sharing for families
- [ ] Historical spending analysis

## Contact

For questions or support, please open an issue on GitHub.

---

**Made with Linear Programming and Modern Web Technologies**
