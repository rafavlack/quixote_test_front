# Quixote AI Wrapper - Frontend Dashboard

This is the frontend application for the Quixote AI Wrapper assessment. It provides a real-time dashboard to monitor AI token usage, billing, and API performance.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: React Query (TanStack Query)
- **Authentication**: Supabase Auth
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios (with JWT Interceptors)

## 🛠️ Features Implemented

### 1. Secure Authentication Flow
- Integrates with **Supabase Auth** for secure user login.
- Custom middleware/guard to protect the `/dashboard` route.
- Persistent sessions using standard JWT handling.

### 2. Real-time Dashboard
- **Usage Area Chart**: Beautiful visualization of token consumption over time using `AreaChart` with smooth gradients.
- **Billing Summary**: Clear display of total tokens used and an estimated "Current Bill" in USD ($0.02 per 1k tokens).
- **Recent Activity**: A live list of the latest 3 AI interactions logged in the database.

### 3. Smart Data Management
- **React Query Integration**: Ensures data is fresh, cached efficiently, and provides a smooth loading experience with optimized re-fetching.
- **Axios Interceptors**: Automatically attaches the Supabase `access_token` to every request sent to the Backend API.

### 4. Desktop-Ready Architecture (Tauri Bonus)
- Built using **Static Site Generation (SSG)** compatibility.
- The project is structured to be easily ported to a **Tauri** environment by switching to `output: 'export'` in `next.config.js`.

## 🏃 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Backend API running on `http://localhost:3000`

### Setup
1. Navigate to the frontend directory:
   ```bash
   cd d:\REPO\quixote_test_front
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
4. Run the development server:
   ```bash
   npm run dev -- -p 3001
   ```
5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📸 Integration Evidence

Screenshots and visual proofs can be found in the `assets/test-evidence` directory (in the main repository).

---
*Developed as part of the Quixote Full-Stack Technical Assessment.*
