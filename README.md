<div align="center">

<img src="public/logo.svg" alt="Ona Analytics Logo" width="500">

# ⚡ Ona Analytics

> **Ona** (*verb, Swahili*): To see, perceive, or understand.

Ona Analytics is a serverless, AI-native demand radar built specifically for remote safari camps and eco-lodges to predict occupancy surges and secure isolated supply chains.

Built for the [H0: Hack the Zero Stack (Vercel + AWS)](https://h01.devpost.com/) Hackathon.

<img src="public/AWS-logo.webp" alt="AWS" height="40" style="margin-right: 48px;">
<img src="public/v0-logo.svg" alt="V0" height="40">

</div>

---

## 📐 Architecture

<img src="public/architecture.svg" alt="Architecture Diagram" width="100%">

---

## 🎯 The High-Stakes Problem

Managers of remote luxury camps (10-25 tented suites in places like the Maasai Mara or Tsavo) operate in complete supply chain isolation. If a sudden 30% spike in weekend bookings occurs, they cannot simply run to a local supermarket. Supplies must be trucked in days in advance. Under-forecasting means running out of fresh food and linens 5 hours away from the nearest town. I built Ona Analytics to predict these surges so managers can optimize their weekly supply trucks before it's too late.

## 🧠 The Architecture & Database Justification

**I utilized Amazon Aurora PostgreSQL because my split-brain AI architecture required seamless, zero-latency querying of strict relational occupancy metrics alongside unstructured, high-dimensional vector embeddings (`pgvector`) for the camp's logistical SOPs, all within a single serverless environment.**

### The Split-Brain AI Pipeline

| Component | What It Does | Technology |
|---|---|---|
| **Deterministic SQL** | Executes raw SQL against `demand_logs` to get exact occupancy numbers | Aurora PostgreSQL + Vercel AI SDK Tool Calling |
| **RAG + pgvector** | Searches camp SOPs using semantic similarity for logistics knowledge | pgvector HNSW index (cosine distance) |
| **Procurement Gen** | Creates actionable supply truck lists from agent decisions | Written to `procurement_items` table |

## ✨ Core Mechanics

* 📈 **Predictive Demand Radar:** Visualizes historical occupancy rates alongside forward-looking predictive models.
* 🤖 **The Ona Agent:** An autonomous operations analyst built with the Vercel AI SDK using tool calling.
* 🗺️ **Dynamic Supply Mapping:** Translates forecasted demand into actionable supply truck procurement lists.
* 🔐 **Authentication:** Secure login with NextAuth.js credentials provider.
* 🌓 **Dark Mode:** Full dark/light theme support via next-themes.

## 🚀 Prerequisites

- Node.js 18+ 
- An **OpenAI API key** (for the Ona Agent)
- An **Amazon Aurora PostgreSQL** database with pgvector enabled

## 🚀 Local Deployment

```bash
git clone https://github.com/your-username/ona-analytics.git
cd ona-analytics
npm install
cp .env.example .env
```

Then edit `.env` with your credentials:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Your Aurora PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key for the Ona Agent |
| `AUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `AUTH_URL` | `http://localhost:3000` for local dev |

### Database Setup (via deployment — no local psql needed)

This project uses **Vercel OIDC + IAM authentication** — no static password. The database is auto-migrated when you deploy.

1. Deploy to Vercel (see below)
2. After deploy, make a `POST` request to `https://your-app.vercel.app/api/migrate` to run the schema + seed
3. Or visit the app — it will work once Aurora is provisioned

### Start Development Server

Pull env vars from Vercel first:

```bash
npx vercel env pull
npm run dev
```

> **Note:** Local dev requires `vercel env pull` to get the OIDC credentials needed for IAM auth. Alternatively, deploy to Vercel directly.

### Demo Credentials

- **Email:** manager@ona-analytics.com
- **Password:** ona-demo-2026

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Import into Vercel
3. Vercel auto-detects the env vars from Storage → Aurora integration
4. Deploy
5. Run `curl -X POST https://your-app.vercel.app/api/migrate` to initialize the database

## 📹 Submission Checklist

- [ ] Deployed Vercel project link
- [ ] Architecture diagram included above
- [ ] AWS Console screenshot showing Aurora PostgreSQL resource
- [ ] Demo video (<3 min) showing: dashboard, spike forecast, Ona Agent query
- [ ] Blog post on dev.to/medium using #H0Hackathon (bonus +0.6 points)
