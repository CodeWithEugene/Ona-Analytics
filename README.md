# ⚡ ZeroStack Analytics

> **Enterprise Demand Radar & AI Operational Intelligence** > Built for the [H0: Hack the Zero Stack (Vercel + AWS)](https://h01.devpost.com/) Hackathon.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/zerostack-analytics)
[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Vercel-black?logo=vercel)](#)
[![Devpost](https://img.shields.io/badge/Devpost-Submission_Link-003E54?logo=devpost)](#)

ZeroStack Analytics is a high-performance, AI-native B2B platform designed to solve fragmented business forecasting and resource allocation. By leveraging the precise technical synergy of Vercel's Edge Network and Amazon Aurora PostgreSQL, it provides organizations with real-time predictive analytics and natural language business intelligence without the overhead of maintaining monolithic server infrastructure.

---

## ✨ Core Features

* 📈 **Predictive Demand Engine:** Visualizes historical occupancy rates alongside forward-looking predictive models to highlight high-velocity demand shifts and low-occupancy periods.
* 🧠 **The ZeroStack Agent (Split-Brain AI):** An autonomous operations analyst utilizing the Vercel AI SDK. It combines deterministic SQL tool calling (for exact financial/capacity metrics) with semantic RAG lookups (for contextual operational guidelines).
* 🗺️ **Dynamic Resource Mapping:** Translates forecasted demand into actionable operational schedules and workforce allocation requirements.
* 🏢 **Multi-Tenant Architecture:** Secure, isolated data environments for onboarding multiple enterprise clients from day one.

---

## 🛠️ The Tech Stack (Hackathon Architecture)

This project strictly adheres to the **H0: Hack the Zero Stack** requirements, prioritizing a highly scalable, serverless architecture.

### Frontend & Edge Computing
* **Framework:** [Next.js (App Router)](https://nextjs.org/)
* **Deployment & Edge:** [Vercel](https://vercel.com/)
* **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/docs)
* **Styling:** Tailwind CSS & Figma Design Tokens

### Backend & Database Storage
* **Primary Database:** [Amazon Aurora PostgreSQL (Serverless)](https://aws.amazon.com/rds/aurora/)
* **Vector Search:** `pgvector` extension for high-speed HNSW cosine distance calculations.
* **Provisioning:** Connected seamlessly via **Vercel Storage Configuration**.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js 18+
* An active Vercel Account
* An active AWS Account (or Vercel Storage integration)
* OpenAI API Key (for embeddings and LLM generation)

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/zerostack-analytics.git](https://github.com/your-username/zerostack-analytics.git)
cd zerostack-analytics
