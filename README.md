# Tax Loss Harvesting

A frontend tool that helps users visualize how selling crypto assets at a loss can reduce their overall capital gains tax liability. Built as part of a frontend assignment using React and Tailwind CSS.

---

## What it does

The app shows your current capital gains (pre-harvesting) and lets you select crypto holdings to "harvest." As you select assets, it recalculates your gains in real time, showing how realized losses offset your taxable gains. If the post-harvest gains are lower, it shows how much you could potentially save.

---

## Setup

```bash
# Clone the repository
git clone https://github.com/your-username/koinx-tax-harvesting.git
cd koinx-tax-harvesting

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Screenshots

### Default View — Dark Mode
The app loads in dark mode by default. The Pre Harvesting card shows your current capital gains breakdown, and the After Harvesting card mirrors it before any selection is made.

![Dark mode overview showing Pre and Post Harvesting cards side by side]
(src/assets/screenshots/post-harvesting-savings.png)
(src/assets/screenshots/pre-harvesting-savings.png)
---

### Holdings Table
All your crypto holdings are listed here with their current price, short-term and long-term gains, and average buy price. Assets with losses show up in red — those are the ones worth harvesting. Columns are sortable by clicking the Short-Term or Long-Term headers.

![Holdings table expanded showing all assets including MATIC with -$3.24K short-term loss]
(src/assets/screenshots/holdings-table-selection.png)

---

### Tax Savings in Action
After selecting Polygon (MATIC) and Ethereum (ETH) — both carrying notable short-term losses — the After Harvesting card updates immediately. Total losses increase, effective capital gains drop from $70,622.35 to $61,781.10, and the savings banner appears showing **you could save up to $8,841.25**.

![After harvesting card showing effective gains reduced to $61,781.10 with savings banner]

---

### Table with Loss Assets Visible
Scrolling through the expanded holdings makes it clear which assets are dragging down the portfolio. ETH shows -$5.18K short-term and -$420 long-term — selecting it alongside MATIC is what drives the tax savings result above.


---

## Assumptions

- Assets are either fully sold or not at all — no partial selling
- Gains and losses for each holding are pre-calculated (not computed from raw trade history)
- All data is mocked locally; no real API calls are made
- No actual tax rules are applied — this is an estimation tool only
- The "savings" figure is the difference between pre and post effective capital gains, not a precise tax saving

---

## Features

- Real-time gain recalculation as you select/deselect holdings
- Select all / deselect all with indeterminate checkbox state
- Sort holdings by short-term or long-term gain
- Hover tooltips showing full currency values
- Dark and light mode toggle
- Loading and error states
- Responsive layout — works on mobile and desktop

---

## How it works

When the app loads, it fetches your capital gains summary and a list of your holdings (both mocked locally with a simulated delay).

The **Pre Harvesting** card shows your current realized gains before any action. The **After Harvesting** card updates as you select holdings from the table.

For each selected holding:
- If the asset has a **gain**, it adds to your total profits
- If the asset has a **loss**, it offsets your profits

The end result is your **Effective Capital Gains** — a lower number means less taxable income. If the effective gains drop below the pre-harvest figure, the app shows how much you could save.

Sorting the table is purely visual and has no effect on the calculations.

---

## Project Structure

```
src/
├── components/
│   ├── HoldingsTable/     # Main table with sorting and selection
│   ├── TaxCards/          # Pre and Post harvesting summary cards
│   ├── Header.jsx
│   ├── HowItWorks.jsx
│   └── ImportantNotes.jsx
├── data/
│   └── mockApi.js         # Simulated API with a small delay
└── utils/
    ├── calculations.js    # Core gain/loss logic
    └── formatters.js      # Currency formatting helpers
```

---

## Tech Stack

- React 19 (Vite)
- Tailwind CSS v4
- JavaScript (no TypeScript)
