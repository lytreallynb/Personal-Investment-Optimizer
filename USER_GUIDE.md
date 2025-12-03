# Personal Finance Optimizer - User Guide

A simple guide to get your budget optimized in minutes.

## Step 1: Start the Application

Open your terminal and run:

```bash
cd /Users/yutonglv/Desktop/investment
docker-compose up --build
```

Wait for the message: "Application startup complete"

Open your browser and go to: **http://localhost:3000**

## Step 2: Create Your Account

1. Click "Sign up" or go to the register page
2. Enter your email address
3. Create a password (minimum 6 characters)
4. Click "Create account"

You'll be automatically logged in and redirected to the budget wizard.

## Step 3: Enter Your Budget (4 Steps)

### Step 1 of 4: Monthly Income

Enter your total monthly income in dollars.

Example: `5000`

Click "Next"

### Step 2 of 4: Fixed Expenses

Add expenses that stay the same each month:

| Category | Amount | Example |
|----------|--------|---------|
| Rent/Mortgage | $1500 | Housing |
| Insurance | $200 | Car, health, etc. |
| Subscriptions | $50 | Netflix, Spotify, etc. |
| Loan Payments | $300 | Student loan, car loan |

Click "+ Add Fixed Expense" to add more categories.

Click "Next" when done.

### Step 3 of 4: Variable Expenses

Set minimum and maximum spending limits for flexible categories:

| Category | Min | Max | What it means |
|----------|-----|-----|---------------|
| Groceries | $200 | $600 | Spend at least $200, up to $600 |
| Dining Out | $0 | $400 | Optional, up to $400 max |
| Entertainment | $50 | $300 | Some entertainment is needed |
| Transportation | $50 | $300 | Gas, public transit, etc. |

The optimizer will find the best amount to spend in each category.

Click "Next" when done.

### Step 4 of 4: Financial Goals

Set your savings goals:

| Field | Example | Notes |
|-------|---------|-------|
| Goal Name | Emergency Fund | What you're saving for |
| Target Amount | $10000 | How much you need |
| Current Amount | $0 | How much you have now |
| Priority | 1 | 1 = highest, 10 = lowest |
| Deadline | (optional) | Target date to reach goal |

Click "+ Add Financial Goal" to add more goals.

Click "Save & Optimize"

## Step 4: View Your Optimized Budget

The dashboard shows:

### Summary Cards (Top)
- **Monthly Income**: Your total income
- **Total Expenses**: All spending (fixed + variable)
- **Monthly Savings**: How much you'll save each month
- **Months to Goal**: Time to reach your goal at current savings rate

### Budget Allocation Chart (Left)
Pie chart showing where your money goes:
- Each slice = a category
- Bigger slice = more spending in that category

### Savings Trajectory Chart (Right)
Line chart showing savings growth over time:
- X-axis: Months (1, 2, 3, etc.)
- Y-axis: Total savings accumulated

### Goal Progress Bars (Bottom)
Shows progress toward each financial goal:
- Green bar = percentage complete
- Numbers show: Current / Target amount

### Recommendations (Bottom)
Smart tips to improve your budget:
- Suggestions to reduce spending
- Ways to reach goals faster

## Step 5: Try Different Optimization Modes

At the top of the dashboard, try different strategies:

### Maximize Savings (Default)
- Saves the most money possible
- Spending = minimum in most categories
- Best for aggressive savers

### Balanced
- Balances savings with quality of life
- Moderate spending in variable categories
- Best for sustainable budgets

### Fastest Goal
- Minimizes spending to reach goals quickly
- Extreme saving mode
- Best for short-term goals

Click a mode, then click "Run Optimization" to see results.

## Step 6: Edit Your Budget

If your income or expenses change:

1. Click "Edit Budget" (top right)
2. Update any values in the 4-step wizard
3. Click "Save & Optimize"

Your dashboard will update with new results.

## Understanding the Results

### If the Optimizer Says "Feasible"
Green dashboard with charts = Success!
- The optimizer found a working budget
- You can meet your goals with current income
- Follow the spending recommendations

### If the Optimizer Says "Infeasible"
Red warning message = Problem!
- Your goals are too ambitious for your income
- OR your minimum expenses are too high
- OR your fixed expenses leave no room for savings

**Solutions:**
1. Increase your income
2. Reduce fixed expenses
3. Lower minimum spending in variable categories
4. Reduce savings goal amount
5. Extend deadline (more months to reach goal)

## Common Use Cases

### Use Case 1: Build Emergency Fund
- Set income and all expenses
- Add goal: "Emergency Fund", $10,000
- See how long it takes to save
- Adjust spending to reach goal faster

### Use Case 2: Save for Vacation
- Add goal: "Vacation", $3,000
- Set deadline: 6 months from now
- Optimizer shows if it's possible
- If not, extend deadline or reduce other spending

### Use Case 3: Pay Off Debt
- Add debt payment as fixed expense
- Add goal: "Debt Freedom", remaining balance
- See optimal spending to pay off debt quickly
- Try "Fastest Goal" mode for aggressive payoff

### Use Case 4: Multiple Goals
- Add multiple goals (emergency fund, vacation, car, etc.)
- Set priorities (1 = most important)
- Optimizer allocates savings across goals
- Higher priority goals get more weight

## Tips for Best Results

1. **Be Realistic with Minimums**
   - Don't set minimums too low
   - You need to eat, commute, etc.
   - Unrealistic minimums = unhappiness

2. **Set Maximums Honestly**
   - Reflect your actual current spending
   - Check bank statements for reference
   - Honest data = better recommendations

3. **Start Conservative**
   - First budget: use current spending habits
   - See the results
   - Then gradually reduce maximums

4. **Review Monthly**
   - Update with actual spending
   - Adjust goals as needed
   - Track progress over time

5. **Use Priorities**
   - Priority 1: Emergency fund (always first)
   - Priority 2: Debt payoff
   - Priority 3+: Other goals

## Troubleshooting

### Can't login?
- Check email/password spelling
- Clear browser cache
- Make sure backend is running: http://localhost:8000/health

### No optimization results?
- Refresh the page
- Check browser console for errors (F12)
- Make sure all 4 steps were completed

### Unrealistic results?
- Double-check all numbers entered
- Verify income is monthly (not yearly)
- Ensure expenses are monthly amounts

### App won't start?
```bash
# Stop everything
docker-compose down

# Remove old data
docker-compose down -v

# Restart fresh
docker-compose up --build
```

### Port already in use?
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or use different ports in docker-compose.yml
```

## Quick Reference

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Commands
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Reset database
docker-compose down -v
```

### Example Budget Template

Copy this example to get started:

**Income:** $5,000/month

**Fixed Expenses:**
- Rent: $1,500
- Car Insurance: $150
- Health Insurance: $200
- Internet: $60
- Phone: $50
- Gym: $40

**Variable Expenses:**
- Groceries: Min $250, Max $500
- Dining Out: Min $0, Max $300
- Gas: Min $80, Max $150
- Entertainment: Min $50, Max $200
- Shopping: Min $0, Max $300
- Personal Care: Min $30, Max $100

**Goal:**
- Emergency Fund: $15,000
- Deadline: 12 months
- Priority: 1

**Expected Result:**
- Monthly Savings: ~$1,500
- Months to Goal: ~10 months
- Surplus: Can reach goal in 10 months instead of 12

## Next Steps

After setting up your budget:

1. Track actual spending for a month
2. Compare actual vs. optimized amounts
3. Adjust budget based on reality
4. Re-optimize monthly
5. Celebrate hitting your goals!

## Need More Help?

- Read the full README.md for technical details
- Check API documentation at http://localhost:8000/docs
- Review QUICKSTART.md for installation help

---

Remember: The optimizer is a tool to help you make informed decisions. You know your life best - adjust the recommendations to fit your actual needs and circumstances.
