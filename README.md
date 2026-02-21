# $pendr – AI-Powered Marketing Optimization Platform

**$pendr (a.k.a. spendr)** is an AI-driven marketing companion that helps founders, marketers, and agencies stop wasting ad budget.

It lets you:

- Optimize marketing budgets across channels  
- Compare manual strategy vs AI-recommended allocations  
- Simulate creatives on major ad platforms  
- Rate and improve ad copy with a built-in scoring rubric  

---

## 🚀 Features

### 1. AI Budget Optimization (`/ai-optimizer`)
Input:  
- Company, industry, region  
- Target audience  
- Budget & AOV  

AI Engine:  
- Located in **`lib/ml-optimizer.ts`**  
- Allocates spend across Google Ads, Facebook, TikTok, LinkedIn using:  
  - Industry benchmarks (CPM, CTR, CVR)  
  - Audience multipliers (Gen Z, B2B, Travelers, etc.)  

Outputs:  
- Channel-wise budget allocation  
- Predicted reach, clicks, conversions  
- CAC, CTR, ROAS  
- % improvement vs baseline  

---

### 2. Campaign Setup & Dashboard (`/campaign-setup`, `/dashboard`)
Rich form for defining a campaign:

- Company, industry, budget, duration  
- Region, product description, USP  
- Demographics & target audience  
- Optional current performance (impressions, clicks, conversions)  
- Current budget allocation across platforms  
- Saved to **localStorage** (`spendr_campaign_data`, `spendr_projects`)  

Dashboard includes:

- Summary cards  
- Predicted metrics (CAC, CTR, ROAS)  
- Visualizations:
  - Funnel chart  
  - Regional heatmap  
  - Budget allocation chart  
- Tabs:
  - Visualization  
  - Shortcomings  
  - Optimize & Compare  
  - Simulate Ad  
  - Rate Ad  

---

### 3. Ad Simulation (`/simulate`)
Use campaign data or uploaded creatives to generate previews on:

- Facebook  
- Google Search  
- Instagram  
- LinkedIn  

Device Views:  
- Desktop  
- Tablet  
- Mobile  

Ideal for demos and stakeholder presentations.

---

### 4. Ad Rating & Analysis (`/rate-ad`)
Powered by **`lib/ad-analyzer.ts`** (no external APIs):

Analyzes:

- Readability (Flesch-like metric)  
- Length & conciseness  
- Emotional impact  
- Power words  
- CTA presence  
- Uniqueness (n-gram similarity)  

Outputs:

- Score (0–100) + band (Excellent/Good/Average/Weak)  
- Per-criterion scores  
- Actionable suggestions  

---

### 5. Landing & Marketing Site (`/landing`)
Includes:

- Problem statement (wasted ad spend)  
- $pendr solution  
- Feature highlights  
- Pricing tiers:
  - Playground  
  - Kickstarter  
  - Overdrive  
- CTA flow connecting to core tools  

---

### 6. Lightweight Auth (Demo Only)
Client-side session using localStorage.

- Any email/password works  
- Stored in `spendr_user`  
- Redirects unauthenticated users to `/landing`  
- Implemented via `AuthContext`  

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)  
- **Language:** TypeScript + React 18  
- **Styling:** Tailwind CSS  
- **UI:** Custom components + Radix UI + lucide-react icons  
- **Charts:** Recharts  
- **State:** React Hooks + custom `AuthContext`  
- **Storage:** localStorage  
- **Tooling:** ESLint, TypeScript, PostCSS, Tailwind  

---

## 📦 Getting Started

### Prerequisites
- Node.js **18+**  
- npm  

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
