# ⚡ Ona Analytics

> **Ona** (*verb, Swahili*): To see, perceive, or understand.
>
> **Predictive Demand & Resource Allocation for Boutique Hospitality** > Built for the [H0: Hack the Zero Stack (Vercel + AWS)](https://h01.devpost.com/) Hackathon.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ona-analytics)
[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Vercel-black?logo=vercel)](#)

Ona Analytics is a serverless, AI-native operational dashboard that transforms fragmented booking data into actionable predictive forecasts, allowing boutique hotel managers to dynamically map staff and resources via an intelligent conversational agent. 

---

## 🎯 The Problem & Our Audience

Regional hospitality groups and boutique hotel managers typically rely on static spreadsheets or monolithic legacy software to track occupancy. When unexpected demand spikes occur, they face understaffing, resource shortages, and revenue leakage. They need a system that actively analyzes historical data to forecast trends and suggests operational adjustments in real time. 

## 🧠 Why AWS Aurora PostgreSQL?

**We utilized Amazon Aurora PostgreSQL because our split-brain AI architecture required seamless, zero-latency querying of both strict relational financial metrics and unstructured, high-dimensional vector embeddings (`pgvector`) within the exact same serverless environment.**

---

## ✨ Core Features

* 📈 **Predictive Demand Engine:** Visualizes historical occupancy rates alongside forward-looking predictive models to highlight high-velocity demand shifts.
* 🤖 **The Ona Agent (RAG Intelligence):** An autonomous operations analyst built with the Vercel AI SDK. Managers can ask, *"What is our projected housekeeping deficit for the upcoming holiday weekend?"* and receive localized, data-backed answers.
* 🗺️ **Dynamic Resource Mapping:** Translates forecasted demand into actionable operational schedules and workforce allocation requirements.
* 🏢 **Multi-Tenant Architecture:** Secure, isolated data environments ensuring enterprise-grade privacy from day one.

---

## 🛠️ The Tech Stack 

Designed from the ground up for the Vercel + AWS ecosystem, prioritizing a highly scalable, serverless architecture.

* **Frontend & Edge:** [Next.js (App Router)](https://nextjs.org/) + TypeScript 
* **UI/UX:** Component-based design system prototyped in Figma, styled with Tailwind CSS
* **Deployment & AI:** [Vercel](https://vercel.com/) Edge Network + Vercel AI SDK
* **Backend Database:** [Amazon Aurora PostgreSQL (Serverless)](https://aws.amazon.com/rds/aurora/)
* **Vector Search:** Native `pgvector` extension for high-speed HNSW cosine distance calculations

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js 18+
* Vercel Account
* AWS Account (or Vercel Storage integration)
* OpenAI API Key

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/ona-analytics.git](https://github.com/your-username/ona-analytics.git)
cd ona-analytics
npm install
