# Quick Start Guide

## Get Started in 3 Steps

### 1. Start the Application
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- React frontend on port 3000

### 2. Open Your Browser
Navigate to: **http://localhost:3000**

### 3. Create Your Budget
1. **Register** a new account
2. **Complete the 4-step budget wizard**:
   - Enter your monthly income
   - Add fixed expenses (rent, insurance, etc.)
   - Set min/max bounds for variable expenses
   - Define your financial goals
3. **View your optimized budget** on the dashboard!

## What You'll See

### Dashboard Features
- **Summary Cards**: Quick overview of income, expenses, savings
- **Pie Chart**: Visual breakdown of your budget allocation
- **Line Chart**: Projected savings trajectory
- **Goal Progress**: Track progress toward each financial goal
- **Smart Recommendations**: Personalized tips to optimize savings

### Optimization Modes
Try different strategies:
- **Maximize Savings**: Save as much as possible
- **Balanced**: Balance savings with lifestyle
- **Fastest Goal**: Reach your goals quickly

## Example Budget

Here's a sample budget to get started:

**Income**: $5,000/month

**Fixed Expenses**:
- Rent: $1,500
- Insurance: $200
- Subscriptions: $50

**Variable Expenses**:
| Category | Min | Max |
|----------|-----|-----|
| Groceries | $200 | $600 |
| Dining Out | $0 | $400 |
| Entertainment | $50 | $300 |
| Transportation | $50 | $300 |

**Goal**: Emergency Fund - $10,000

### Expected Result
With this budget, the optimizer might suggest:
- Monthly Savings: ~$1,200
- Time to Goal: ~8.3 months
- Optimized spending allocations for each category

## Useful Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset everything (including database)
docker-compose down -v

# Access API documentation
open http://localhost:8000/docs
```

## Using Make (Optional)

If you have `make` installed:

```bash
make up        # Start services
make down      # Stop services
make logs      # View logs
make clean     # Clean everything
make restart   # Restart services
```

## Troubleshooting

**Port conflicts?**
```bash
docker-compose down
# Edit docker-compose.yml to use different ports
```

**Database issues?**
```bash
docker-compose down -v  # Reset database
docker-compose up --build
```

**Can't login?**
- Clear browser cache
- Make sure backend is running (check http://localhost:8000/health)
- Check backend logs: `docker-compose logs backend`

## Next Steps

1. Create your budget
2. Run optimization
3. Try different optimization modes
4. Set multiple financial goals
5. Track your progress over time

## Need Help?

- Check the main README.md for detailed documentation
- View API docs at http://localhost:8000/docs
- Check logs with `docker-compose logs -f`

Happy budgeting!
