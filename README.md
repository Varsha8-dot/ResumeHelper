# 🚀 ResumeHelper — AI Resume Analyzer (Powered by Google Gemini FREE)

A full-stack AI resume analyzer. 100% free AI using Google Gemini API.

---

## 🆓 Why Gemini Instead of OpenAI?

| Feature         | OpenAI GPT-4       | Google Gemini (this project) |
|-----------------|--------------------|------------------------------|
| Cost            | ~$0.01 per request | ✅ FREE (1000 req/day)        |
| Credit card     | Required upfront   | ✅ Not required               |
| Quality         | Excellent          | ✅ Excellent (2.5 Flash-Lite) |
| Context window  | 128K tokens        | ✅ 1 Million tokens           |
| Setup time      | 5 min              | ✅ 5 min                      |

---

## 📁 Project Structure

```
resumehelper/
├── backend/
│   ├── models/         ← MongoDB schemas (User, Resume, Job)
│   ├── routes/         ← auth.js, resume.js, ai.js, tracker.js
│   ├── middleware/     ← auth.js (JWT protect)
│   ├── utils/
│   │   ├── gemini.js   ← Gemini AI helper (FREE)
│   │   ├── cloudinary.js
│   │   └── parser.js   ← PDF/DOCX parser + ATS scorer
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── pages/      ← Landing, Login, Register, Dashboard, Analyze, Results, Tracker
        ├── components/ ← Navbar
        └── context/    ← AuthContext (JWT + Axios interceptors)
```

---

## ⚡ Local Setup (5 minutes)

### Step 1 — Install dependencies

```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
```

### Step 2 — Get FREE Gemini API Key

1. Go to 👉 https://aistudio.google.com/apikey
2. Sign in with Google (no credit card needed)
3. Click **"Create API Key"**
4. Copy the key → paste into `backend/.env` as `GEMINI_API_KEY`

Done. That's your free AI! ✅

### Step 3 — Fill in backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://...        # Step 4 below
JWT_SECRET=any_long_random_string_123
JWT_REFRESH_SECRET=another_random_string_456
GEMINI_API_KEY=AIza...               # From Step 2 above ✅ FREE
CLOUDINARY_CLOUD_NAME=...            # Step 5 below
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:3000
```

### Step 4 — Run locally

```bash
# Terminal 1
cd backend && npm run dev    # → http://localhost:5000

# Terminal 2
cd frontend && npm start     # → http://localhost:3000
```

---

## ☁️ DEPLOYMENT GUIDE (All Free)

### 1️⃣ MongoDB Atlas — Database (FREE)

1. Go to https://cloud.mongodb.com → Create free account
2. Create a **free M0 cluster**
3. Database Access → Add database user (username + password)
4. Network Access → Add IP → **0.0.0.0/0** (allow all)
5. Connect → Drivers → Copy URI:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resumehelper
   ```
6. Paste into `MONGODB_URI` in your `.env`

---

### 2️⃣ Google Gemini API Key — AI (FREE)

1. Go to https://aistudio.google.com/apikey
2. Click **Create API Key**
3. Copy → paste as `GEMINI_API_KEY`

Free tier: **1,000 requests/day** — enough for hundreds of resume analyses!

---

### 3️⃣ Cloudinary — File Storage (FREE)

1. Go to https://cloudinary.com → Free signup
2. Dashboard → Copy **Cloud Name, API Key, API Secret**
3. Paste into your `.env`

---

### 4️⃣ Deploy Backend on Render (FREE)

1. Push project to GitHub
2. Go to https://render.com → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all environment variables from your `.env`
6. Deploy → copy your URL: `https://resumehelper-api.onrender.com`

---

### 5️⃣ Deploy Frontend on Vercel (FREE)

1. Go to https://vercel.com → New Project → Import repo
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://resumehelper-api.onrender.com/api`
4. Deploy → get your URL: `https://resumehelper.vercel.app`
5. Go back to **Render** → update `CLIENT_URL` = your Vercel URL

---

## ✅ Total Cost = $0/month

| Service         | Cost          |
|-----------------|---------------|
| MongoDB Atlas   | FREE (512MB)  |
| Gemini API      | FREE (1000/day) |
| Cloudinary      | FREE (25GB)   |
| Render          | FREE          |
| Vercel          | FREE          |
| **TOTAL**       | **$0.00/month** |

---

## 🔑 Features

- ✅ JWT Auth with Refresh Tokens
- ✅ Resume Upload (PDF + DOCX) → Cloudinary
- ✅ ATS Score Calculator
- ✅ AI Suggestions (Gemini FREE)
- ✅ Cover Letter Generator
- ✅ Mock Interview Coach
- ✅ Resume Roast Mode 🔥
- ✅ Salary Estimator
- ✅ Cold Email Generator
- ✅ LinkedIn Profile Optimizer
- ✅ Skills Gap Analysis
- ✅ Job Tracker (Kanban)
- ✅ Resume History Dashboard
- ✅ Beautiful colorful UI

---

## 🆘 Troubleshooting

**"GEMINI_API_KEY is not set"**
→ Get free key at https://aistudio.google.com/apikey

**"429 quota exceeded" from Gemini**
→ Free tier is 1000/day. Wait until midnight Pacific time for reset.

**MongoDB connection error**
→ Check MONGODB_URI and whitelist 0.0.0.0/0 in Atlas Network Access

**File upload failing**
→ Check Cloudinary credentials, max file size is 5MB

**CORS errors after deployment**
→ Update CLIENT_URL in Render to match your Vercel URL exactly
"# ResumeHelper" 
