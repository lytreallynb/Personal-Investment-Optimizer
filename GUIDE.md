# Personal Finance Optimizer - Complete Guide

A simple, complete guide to optimize your budget using Linear Programming.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Setting Up Your Budget](#setting-up-your-budget)
3. [Understanding Your Results](#understanding-your-results)
4. [Optimization Modes](#optimization-modes)
5. [Solving Problems](#solving-problems)
6. [Examples](#examples)
7. [Quick Reference](#quick-reference)

---

## Getting Started

### Installation

**Step 1: Start the application**
```bash
cd /Users/xxx/Desktop/investment
docker-compose up --build
```

Wait for: "Application startup complete"

**Step 2: Open your browser**
```
http://localhost:3000
```

**Step 3: Create your account**
- Click "Sign up"
- Enter your email
- Create a password (minimum 6 characters)
- Click "Create account"

You're now ready to optimize your budget!

---

## Setting Up Your Budget

You'll complete a simple 4-step wizard to enter your financial information.

### Step 1: Monthly Income

Enter your total monthly income in dollars.

```
Example: 5000
```

This is your total take-home pay each month (after taxes).

Click "Next"

---

### Step 2: Fixed Expenses

Add expenses that are the same every month and must be paid.

**Examples:**

| Category | Amount | What it is |
|----------|--------|------------|
| Rent | 1500 | Your monthly rent or mortgage |
| Car Insurance | 150 | Monthly insurance payment |
| Internet | 60 | Internet bill |
| Phone | 50 | Cell phone bill |
| Gym | 40 | Gym membership |

**How to add:**
1. Type the category name (e.g., "Rent")
2. Enter the amount (e.g., 1500)
3. Click "+ Add Fixed Expense" for more

Click "Next" when done

---

### Step 3: Variable Expenses

Set minimum and maximum spending for flexible categories.

**What are Min and Max?**
- **Min**: The least you can spend (basic needs)
- **Max**: The most you want to spend

**Examples:**

| Category | Min | Max | Explanation |
|----------|-----|-----|-------------|
| Groceries | 200 | 600 | Need at least $200 for food, prefer up to $600 |
| Dining Out | 0 | 400 | Can skip entirely, but enjoy up to $400 |
| Entertainment | 50 | 300 | Need some fun, at least $50 |
| Gas | 80 | 150 | Need at least $80 for work commute |
| Shopping | 0 | 300 | Optional spending |

**How to add:**
1. Type the category name
2. Enter minimum amount
3. Enter maximum amount
4. Click "+ Add Variable Expense" for more

The optimizer will find the best amount to spend in each category.

Click "Next" when done

---

### Step 4: Financial Goals

Set what you're saving for.

**Example Goal:**

| Field | Value | What it means |
|-------|-------|---------------|
| Goal Name | Emergency Fund | What you're saving for |
| Target Amount | 10000 | Total amount you need |
| Current Amount | 0 | Amount you already have |
| Priority | 1 | 1 = most important, 10 = least |
| Deadline | 2025-12-31 | Optional: when you need it by |

**How to add:**
1. Enter goal name (e.g., "Emergency Fund")
2. Enter target amount (e.g., 10000)
3. Enter current amount (e.g., 0)
4. Set priority (1 is highest)
5. Optionally set a deadline
6. Click "+ Add Financial Goal" for more goals

Click "Save & Optimize"

---

## Understanding Your Results

### The Dashboard

After clicking "Save & Optimize", you'll see your dashboard.

**Top Cards:**

```
+------------------+------------------+------------------+------------------+
| Monthly Income   | Total Expenses   | Monthly Savings  | Months to Goal   |
| $5,000          | $3,500          | $1,500          | 6.7              |
+------------------+------------------+------------------+------------------+
```

- **Monthly Income**: Your total income
- **Total Expenses**: All spending (fixed + variable)
- **Monthly Savings**: Money saved each month
- **Months to Goal**: Time to reach your goal

---

### Charts Explained

**1. Budget Allocation (Pie Chart)**

Shows where every dollar goes:
- Each slice = one category
- Bigger slice = more money
- Colors: different categories

Example:
- Rent: $1,500 (30%)
- Groceries: $400 (8%)
- Savings: $1,500 (30%)

---

**2. Savings Trajectory (Line Chart)**

Shows how your savings grow over time:
- X-axis: Months (1, 2, 3...)
- Y-axis: Total saved ($)
- Line going up = accumulating savings

Example:
- Month 1: $1,500
- Month 2: $3,000
- Month 3: $4,500

---

**3. Goal Progress (Bar Chart)**

Shows progress toward each goal:
- Green bar = percentage complete
- Numbers = Current / Target

Example:
- Emergency Fund: $2,000 / $10,000 (20%)

---

### Recommendations

Smart tips appear at the bottom:

Examples:
- "You're spending $500 on Dining Out. Reducing to $200 could save $300/month."
- "At current rate, it will take 8 months to reach your goal."
- "Great job saving $1,500/month!"

---

## Optimization Modes

Try different strategies by selecting a mode at the top.

### Mode 1: Maximize Savings

**What it does:**
- Saves the most money possible
- Spending = minimum in most categories
- Maximum monthly savings

**Best for:**
- Aggressive savers
- High income earners
- Short-term intense saving

**Example Result:**
- Income: $5,000
- Savings: $2,000/month
- Spending: Mostly at minimums

---

### Mode 2: Balanced

**What it does:**
- Balances savings with quality of life
- Moderate spending in each category
- Sustainable approach

**Best for:**
- Most people
- Long-term budgets
- Realistic lifestyle

**Example Result:**
- Income: $5,000
- Savings: $1,500/month
- Spending: Middle range in categories

---

### Mode 3: Fastest Goal

**What it does:**
- Extreme saving mode
- Minimizes all spending
- Reaches goals as fast as possible

**Best for:**
- Urgent short-term goals
- Debt payoff
- Emergency situations

**Example Result:**
- Income: $5,000
- Savings: $2,200/month
- Spending: At absolute minimums

---

**How to change modes:**
1. Click the mode button at top (Maximize Savings / Balanced / Fastest Goal)
2. Click "Run Optimization"
3. See updated results

---

## Solving Problems

### Problem 1: "Budget Not Feasible"

You see a red error message saying your budget is infeasible.

**What it means:**
Your income is not enough to cover:
- All fixed expenses
- Minimum variable expenses
- Required savings to reach goal

**Example of the problem:**
```
Income:              $3,000
Fixed Expenses:      $2,000
Min Variable:        $1,000
Goal (per month):    $500
------------------------
Total Needed:        $3,500
Shortfall:           -$500  <- Not enough!
```

**How to fix (choose one or more):**

1. **Increase income**
   - Get a raise, side job, freelance work
   - Example: $3,000 -> $4,000/month

2. **Reduce fixed expenses**
   - Move to cheaper apartment
   - Cancel subscriptions
   - Example: $2,000 -> $1,500

3. **Lower minimum variable expenses**
   - Reduce "must spend" amounts
   - Example: Groceries min $400 -> $250

4. **Reduce goal amount**
   - Example: $10,000 -> $7,000

5. **Extend deadline**
   - More time = less savings needed per month
   - Example: 6 months -> 12 months

---

### Problem 2: Numbers Look Wrong

**Issue:** Spending recommendations seem too low

**Cause:** You entered yearly amounts instead of monthly

**Fix:**
- Divide yearly by 12
- Example: $12,000/year = $1,000/month

---

### Problem 3: Can't Login

**Solutions:**
1. Clear browser cache
2. Check email/password spelling
3. Make sure backend is running: http://localhost:8000/health
4. Check logs: `docker-compose logs backend`

---

### Problem 4: App Won't Start

**Solutions:**
```bash
# Stop everything
docker-compose down

# Remove old data
docker-compose down -v

# Restart fresh
docker-compose up --build
```

---

## Examples

### Example 1: Build Emergency Fund

**Situation:**
You want to save $10,000 for emergencies in 12 months.

**Your Budget:**
- Income: $5,000/month
- Rent: $1,500
- Insurance: $200
- Bills: $150
- Groceries: $200-$500
- Dining: $0-$300
- Entertainment: $50-$200
- Gas: $80-$150

**Steps:**
1. Enter income: 5000
2. Add fixed expenses: Rent (1500), Insurance (200), Bills (150)
3. Add variable expenses with min/max ranges
4. Add goal: Emergency Fund, target 10000, priority 1
5. Click "Save & Optimize"

**Results (Maximize Savings mode):**
```
Monthly Savings: $1,800
Months to Goal: 5.6 months
Groceries: $200
Dining: $0
Entertainment: $50
Gas: $80
Total Spending: $3,200
```

**Conclusion:** You can reach your $10,000 goal in just 5.6 months!

---

### Example 2: Save for Vacation

**Situation:**
You want $3,000 for vacation in 6 months.

**Your Budget:**
- Income: $4,000/month
- Fixed expenses: $2,200
- Variable expenses: $800-$1,500

**Steps:**
1. Enter income: 4000
2. Add all fixed expenses (total: 2200)
3. Set variable expense ranges
4. Add goal: Vacation, target 3000, deadline in 6 months
5. Click "Save & Optimize"

**Results:**
```
Required Savings Per Month: $500 (3000 / 6)
Available After Fixed: $1,800
Variable Spending: $1,300
Monthly Savings: $500
Months to Goal: 6.0 months
```

**Conclusion:** You can afford the vacation! Spend $1,300 on variables, save $500/month.

---

### Example 3: Pay Off Debt Fast

**Situation:**
You have $8,000 credit card debt at 18% interest. Want to pay it off ASAP.

**Your Budget:**
- Income: $6,000/month
- Fixed expenses: $2,500
- Variable expenses: $1,500-$2,500

**Steps:**
1. Enter income: 6000
2. Add fixed expenses (including minimum payment)
3. Set tight variable ranges
4. Add goal: Debt Payoff, target 8000, priority 1
5. Select "Fastest Goal" mode
6. Click "Run Optimization"

**Results:**
```
Monthly Savings: $2,000
Variable Spending: $1,500 (at minimums)
Months to Goal: 4 months
Interest Saved: ~$300
```

**Conclusion:** Pay off debt in 4 months instead of years!

---

### Example 4: Multiple Goals

**Situation:**
You have 3 goals with different priorities.

**Your Budget:**
- Income: $7,000/month
- Fixed: $3,000
- Variable: $2,000-$3,000

**Goals:**
1. Emergency Fund: $15,000 (Priority 1)
2. Car Down Payment: $5,000 (Priority 2)
3. Vacation: $2,000 (Priority 3)

**Results:**
```
Total Monthly Savings: $1,500

How savings are allocated:
- Emergency Fund: $900/month (60% - highest priority)
- Car: $450/month (30%)
- Vacation: $150/month (10% - lowest priority)

Time to complete:
- Vacation: 13 months
- Car: 11 months
- Emergency: 17 months
```

**Conclusion:** Higher priority goals get more savings allocated.

---

## Quick Reference

### Essential Commands

```bash
# Start the app
docker-compose up --build

# Stop the app
docker-compose down

# View logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Reset database (fresh start)
docker-compose down -v
docker-compose up --build
```

---

### Important URLs

```
Frontend (main app):  http://localhost:3000
Backend API:          http://localhost:8000
API Documentation:    http://localhost:8000/docs
Health Check:         http://localhost:8000/health
```

---

### Budget Calculation Formula

```
Monthly Surplus = Income - Fixed Expenses - Variable Minimums

Required Savings = Goal Amount / Number of Months

If Surplus < Required Savings:
  Result = Infeasible (not enough money)
Else:
  Result = Feasible (goal achievable)
```

**Example:**
```
Income: $5,000
Fixed: $2,000
Variable Min: $1,000
Goal: $10,000 in 10 months

Surplus = 5000 - 2000 - 1000 = $2,000
Required = 10000 / 10 = $1,000

$2,000 > $1,000 = FEASIBLE!
```

---

### Optimization Mode Comparison

| Feature | Maximize Savings | Balanced | Fastest Goal |
|---------|------------------|----------|--------------|
| Savings Rate | Highest | Medium | Maximum |
| Lifestyle | Minimal | Comfortable | Restricted |
| Sustainability | Medium | High | Low |
| Speed to Goal | Fast | Moderate | Fastest |
| Spending | At minimums | Middle range | Absolute minimums |
| Best Use | Extra income | Daily life | Emergencies |

---

### Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Yearly amounts | Numbers too high | Divide by 12 |
| Unrealistic minimums | Can't live on it | Increase minimums |
| Too many goals | Can't fund all | Focus on top 2-3 |
| No emergency fund | Risky | Make it Priority 1 |
| Ignoring recommendations | Miss savings | Read and apply tips |

---

### Tips for Success

**1. Start realistic**
- Use current spending as maximums
- Set comfortable minimums
- Adjust over time

**2. Review monthly**
- Update with actual spending
- Adjust goals as needed
- Track progress

**3. Use priorities wisely**
- Priority 1: Emergency fund (always)
- Priority 2: Debt payoff
- Priority 3+: Other goals

**4. Be honest**
- Enter real numbers
- Don't underestimate expenses
- Include everything

**5. Stay flexible**
- Life changes
- Update your budget
- Re-optimize regularly

---

### Troubleshooting Checklist

**App won't start:**
- [ ] Docker installed and running?
- [ ] Ports 3000, 8000, 5432 available?
- [ ] Run: `docker-compose down -v && docker-compose up --build`

**Can't login:**
- [ ] Correct email/password?
- [ ] Backend running? Check: http://localhost:8000/health
- [ ] Clear browser cache
- [ ] Check logs: `docker-compose logs backend`

**Infeasible budget:**
- [ ] All amounts are monthly (not yearly)?
- [ ] Income > Fixed + Variable Mins?
- [ ] Goal realistic for timeline?
- [ ] Try "Balanced" mode instead

**Wrong results:**
- [ ] Double-check all numbers entered
- [ ] Verify minimums < maximums
- [ ] Check goal deadline is in future
- [ ] Try different optimization mode

---

## Summary

**To use this app:**

1. **Start it:** `docker-compose up --build`
2. **Register:** Create account at http://localhost:3000
3. **Enter budget:** Complete 4-step wizard
4. **View results:** See optimized spending on dashboard
5. **Adjust:** Try different modes, update as needed

**The app will:**
- Calculate optimal spending for each category
- Show how much to save each month
- Predict when you'll reach your goals
- Give tips to save more money

**Remember:**
- Be realistic with your numbers
- Review and update monthly
- Prioritize emergency fund first
- Use "Balanced" mode for sustainability

---

**Questions? Check:**
- README.md for technical details
- http://localhost:8000/docs for API documentation
- `docker-compose logs` for error messages

**Happy budgeting!**
