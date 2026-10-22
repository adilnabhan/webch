# 🏆 Discipl Challenges & Rewards Platform

> Production-grade, athletic, and modern web application for Discipl Challenges & Rewards. Connected directly to the live Discipl backend API (`https://app.thediscipl.com`).

---

## 🚀 Key Features

1. **Featured Challenge Hero & Carousel**:
   - Live real-time countdown timer (`Ends in HH:MM:SS` or `Starts in`).
   - Urgent badge when $\le 48\text{ hrs}$ remain.
   - Sponsor brand logos with verified badges.
   - Active athlete participant counters and profile avatar stacks.

2. **Explore Challenges Catalog**:
   - Filter by status: `All`, `Ongoing`, `Ending Soon`, `Upcoming`, `Completed / Winners`.
   - Filter by category: `Workout`, `Steps`, `Cardio`, `Gift Challenge`, `Lucky Draw`.
   - Filter by sponsor brand (e.g. *14's Restaurant*, *Discipl*).
   - Real-time search by challenge title or brand name.
   - Pagination and dynamic card states.

3. **Challenge Details & Live Progress**:
   - Banner showcase with dynamic brand theme color.
   - **4-Step "How It Works" Stepper**: Enroll $\rightarrow$ Workout $\rightarrow$ Verify $\rightarrow$ Win.
   - **Participant Progress Tracker**: Enforces the **1 distinct workout per calendar day** rule with visual day cards (Day 1, Day 2, Day 3).
   - Prize package card with verified reward vouchers and currency values.
   - Expandable Rules, Disqualification Criteria, and Terms & Conditions accordions.
   - Context-aware action buttons: `Join Challenge Now`, `Enrolled`, `Upcoming`, `View Winners`.

4. **Olympic-Style Winners Podium & Hall of Fame**:
   - Elevated Gold (#1 Center), Silver (#2 Left), and Bronze (#3 Right) podium cards.
   - Historical winners gallery with search by athlete, gym name, or prize title.
   - Filter between all platform winners and user's gym winners.

5. **Celebration Confetti Modal**:
   - Detects when the authenticated athlete won a challenge (`/api/v1/customer/challenges/winner-popup/`).
   - Fires celebratory confetti cannons using `canvas-confetti`.
   - Calls `/api/v1/customer/challenges/winner-popup/seen/` when claimed or dismissed.

6. **Admin Challenge Management & Data Collection Dashboard**:
   - Real-time participant tracking & progress inspection.
   - **Verified Candidate Inspection**: Inspects athletes with trainer-verified workouts on distinct days.
   - **Trigger Winner Selection**: Executes backend winner engine (`lucky_draw`, `weekly_min_3_days_random`, `top_performance`, `first_n_finishers`).
   - **Publish / Revoke Winners**: Toggle published status live to the customer mobile app.
   - Challenge creation modal with date pickers, target counts, and reward configuration.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom athletic dark palette & glassmorphism
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with centralized request/response interceptors & JWT auth
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
VITE_API_BASE_URL=https://app.thediscipl.com
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📤 Push to GitHub Repository (`https://github.com/adilnabhan/webch.git`)

Run these commands inside this folder to initialize git and push directly:

```powershell
# 1. Initialize git
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "Initial release: Discipl Challenges & Rewards web platform"

# 4. Set main branch
git branch -M main

# 5. Add remote repository
git remote add origin https://github.com/adilnabhan/webch.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📡 Connected Backend APIs

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/v1/customer/challenges/home/` | GET | Active & upcoming featured challenges |
| `/api/v1/customer/challenges/` | GET | Catalog with category, status, brand, search filters |
| `/api/v1/customer/challenges/<id>/` | GET | Challenge details, rules, prizes, how it works |
| `/api/v1/customer/challenges/<id>/join/` | POST | Enroll in challenge |
| `/api/v1/customer/challenges/<id>/progress/` | GET | User progress & distinct day tracker |
| `/api/v1/customer/challenges/<id>/winners/` | GET | Challenge winner podium |
| `/api/v1/customer/challenges/winners/` | GET | Hall of Fame historical winners |
| `/api/v1/customer/challenges/gym-winners/` | GET | Gym-specific winners gallery |
| `/api/v1/customer/challenges/winner-popup/` | GET | Winner notification popup |
| `/api/v1/customer/challenges/winner-popup/seen/` | POST | Dismiss/mark winner popup as seen |
| `/api/v1/customer/challenges/partners/` | GET | Sponsor brands & partners |
| `/api/v1/admin/challenges/` | GET / POST | Admin challenge listing & creation |
| `/api/v1/admin/challenges/<id>/participants/` | GET | Admin participant inspection |
| `/api/v1/admin/challenges/<id>/eligible-users/` | GET | Candidates who completed verified workout days |
| `/api/v1/admin/challenges/<id>/select-winners/` | POST | Trigger backend winner selection |
| `/api/v1/admin/challenges/<id>/publish-winners/` | POST | Publish winners live to customer app |
| `/api/v1/admin/challenges/<id>/revoke-winners/` | POST | Revoke announced winners |
