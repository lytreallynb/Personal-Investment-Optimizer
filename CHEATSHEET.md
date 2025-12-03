# Personal Finance Optimizer - Quick Reference

## One-Page Cheat Sheet

### Starting the App
```bash
docker-compose up --build
```
Open: http://localhost:3000

### The 4 Steps

**1. INCOME**
Enter monthly income: $5000

**2. FIXED EXPENSES** (same every month)
Rent, insurance, subscriptions, loans

**3. VARIABLE EXPENSES** (flexible)
Set MIN and MAX for each category
- Groceries: $200 - $600
- Dining: $0 - $400

**4. FINANCIAL GOALS**
- Name: Emergency Fund
- Target: $10,000
- Priority: 1 (highest)

### Reading the Dashboard

```
+------------------+------------------+------------------+------------------+
|  Monthly Income  | Total Expenses   | Monthly Savings  |  Months to Goal  |
|     $5,000       |     $3,500       |     $1,500       |      6.7         |
+------------------+------------------+------------------+------------------+

[Pie Chart]              [Line Chart]
Budget Allocation        Savings Over Time

[Bar Chart]
Goal Progress: Emergency Fund [=========>    ] 60%
```

### Optimization Modes

| Mode | What It Does | Best For |
|------|--------------|----------|
| **Maximize Savings** | Save the most | Aggressive savers |
| **Balanced** | Balance life & savings | Most people |
| **Fastest Goal** | Extreme saving | Short-term goals |

### Infeasible = Problem!

```
Income:           $5,000
Fixed Expenses:   $4,000
Min Variable:     $1,200
Goal/Month:       $500
---------------------------
TOTAL NEEDED:     $5,700  <- More than income!
```

**Fix It:**
- [ ] Increase income
- [ ] Reduce fixed expenses
- [ ] Lower minimums
- [ ] Reduce goal
- [ ] Extend deadline

### Common Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reset Everything
docker-compose down -v && docker-compose up --build

# Shell Access
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Clear cache, check backend health |
| No results | Refresh page, check console (F12) |
| Port in use | `docker-compose down` or change ports |
| Wrong numbers | Verify monthly (not yearly) amounts |

### Quick Math

**Can I afford my goal?**
```
Monthly Surplus = Income - Fixed - Min(Variable)
Months to Goal = Goal Amount / Monthly Surplus

Example:
Surplus = $5,000 - $2,000 - $1,500 = $1,500
Goal = $10,000
Months = $10,000 / $1,500 = 6.7 months
```

### Best Practices

1. Set realistic minimums (you need to live!)
2. Use bank statements for maximums
3. Priority 1 = Emergency fund
4. Review monthly
5. Adjust as life changes

### Example: Build $10K Emergency Fund

```yaml
Income: $5,000/month

Fixed:
  - Rent: $1,500
  - Insurance: $200
  - Utilities: $150

Variable:
  - Groceries: $200-$500
  - Dining: $0-$300
  - Entertainment: $50-$200

Goal:
  - Emergency Fund: $10,000
  - Priority: 1

Result:
  - Monthly Savings: $1,400
  - Time to Goal: 7.1 months
```

### URLs to Remember

- App: http://localhost:3000
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### File Locations

```
backend/app/services/optimizer.py  <- Optimization logic
backend/app/api/routes/optimize.py <- API endpoints
frontend/src/components/Dashboard/ <- UI components
docker-compose.yml                 <- Configuration
```

---

**Pro Tip:** Start with "Balanced" mode. It gives realistic results that you can actually stick to!
