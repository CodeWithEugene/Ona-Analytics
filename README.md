# ⚡ Ona Analytics

> **Ona** (*verb, Swahili*): To see, perceive, or understand.

Ona Analytics is a serverless, AI-native demand radar I built specifically for remote safari camps and eco-lodges to predict occupancy surges and secure isolated supply chains.

Built for the [H0: Hack the Zero Stack (Vercel + AWS)](https://h01.devpost.com/) Hackathon.

## 🎯 The High-Stakes Problem
Managers of remote luxury camps (10-25 tented suites in places like the Maasai Mara or Tsavo) operate in complete supply chain isolation. If a sudden 30% spike in weekend bookings occurs, they cannot simply run to a local supermarket. Supplies must be trucked in days in advance. Under-forecasting means running out of fresh food and linens 5 hours away from the nearest town. I built Ona Analytics to predict these surges so managers can optimize their weekly supply trucks before it's too late.

## 🧠 The Architecture & Database Justification
**I utilized Amazon Aurora PostgreSQL because my split-brain AI architecture required seamless, zero-latency querying of strict relational occupancy metrics alongside unstructured, high-dimensional vector embeddings (`pgvector`) for the camp's logistical SOPs, all within a single serverless environment.**

## ✨ Core Mechanics
* 📈 **Predictive Demand Radar:** Visualizes historical occupancy rates alongside forward-looking predictive models.
* 🤖 **The Ona Agent:** An autonomous operations analyst built with the Vercel AI SDK.
* 🗺️ **Dynamic Supply Mapping:** Translates forecasted demand into actionable supply truck procurement lists.

## 🚀 Local Deployment

```bash
git clone [https://github.com/your-username/ona-analytics.git](https://github.com/your-username/ona-analytics.git)
cd ona-analytics
npm install
npm run dev
