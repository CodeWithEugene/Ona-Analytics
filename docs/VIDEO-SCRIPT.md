# Ona Analytics — Demo Video Script (≤3 min)

**Track**: Track 2: Monetizable B2B App
**Tone**: Calm, precise, professional. Like a field operations briefing.

---

## :00–:30 — The Problem (The Logistical Isolation)

**[Visual: Cinematic shot of a Land Cruiser driving across savannah at dawn. Cut to: a camp manager staring at a paper spreadsheet inside a tented mess hall.]**

**Narrator:**
"Luxury safari camps in places like the Maasai Mara operate in total supply chain isolation. 10 to 25 tented suites, zero local supermarkets, five hours from the nearest supply town."

**[Visual: Map animation showing a red dot (camp) 300km from the nearest blue dot (Nairobi). Dotted truck routes crossing unpaved roads.]**

"If an unexpected 40% occupancy surge hits for the weekend — which camp managers tell me happens constantly — you cannot just make a grocery run. Supplies must be dispatched days in advance, or you run out of fresh produce, gas cylinders, and clean linen mid-stay."

**[Visual: Close-up of a hand marking "OUT OF STOCK" on a clipboard. Fade to black.]**

---

## :30–:60 — The Solution (Ona Analytics)

**[Visual: Rapid fade-in to the Ona Analytics landing page — the Live Supply Radar HUD card.]**

**Narrator:**
"Ona Analytics is a serverless, AI-native demand radar built specifically for this problem. It predicts occupancy surges, secures isolated supply chains, and automates procurement — all without a single manual spreadsheet."

**[Visual: Scroll through the landing page — problem section, split-brain architecture, bento grid features.]**

"The name 'Ona' means 'to see' in Swahili. And that's exactly what it does — gives camp managers visibility into what's coming before it arrives."

---

## :60–:90 — Dashboard Walkthrough

**[Visual: Login screen. Type manager@ona-analytics.com / ona-demo-2026. Click "Sign In". Dashboard loads.]**

**Narrator:**
"Let me show you the dashboard. I'll sign in with the demo account."

**[Visual: Overview tab — occupancy card showing 41%, peak forecast showing 95% in red, urgent procurement items. Point to each.]**

"Here's the command center. Current occupancy sits at 41%, but our forecast detects a surge to 95% in three days — that's the peak you see highlighted. And we already have three urgent procurement items waiting."

**[Visual: Demand tab — the area chart showing 14-day booking velocity.]**

"The demand radar visualizes booking velocity over the last two weeks. You can see the spike clearly."

---

## :90–:150 — The Ona Agent Demo (THE MONEY SHOT)

**[Visual: Click the "Ona Agent" button. The chat panel slides open from the right.]**

**Narrator:**
"This is the heart of the system — the Ona Agent. It runs on Vercel AI SDK with NVIDIA Nemotron and what I call a 'split-brain' architecture."

**[Visual: Type "What is our occupancy looking like this week?" Send.]**

"Let's ask: 'What is our occupancy looking like this week?'"

**[Visual: Show the agent's response with tool calls. The Nemotron processes the query, calls query_demand_data, and returns real SQL results.]**

"You'll see it calls the deterministic SQL tool — it queries real data from Aurora PostgreSQL, so there is zero hallucination. Every number is a real SQL result."

**[Visual: Type "It looks like heavy rain is coming. How should we adjust based on our SOPs?"]**

**Narrator:**
"Now watch the split brain. I'll ask: 'How should we adjust for heavy rain based on our SOPs?'"

**[Visual: Show the agent trace — first the SQL query, then the RAG search_context_knowledge tool firing, showing the embedding similarity search returning the Weather SOP.]**

"The agent searches our pgvector embeddings — 1536-dimensional vectors of our camp SOPs — using cosine similarity. It finds the Weather SOP that says trucks must depart 12 hours early when rain is forecasted."

**[Visual: The agent's synthesized response appears — something like "Based on the 95% occupancy forecast and the Weather SOP requiring early dispatch due to mud..." Mark the synthesis with an overlay: "SQL DATA + VECTOR RAG = SYNTHESIS"]**

"It synthesizes both sources — exact numbers from SQL, and procedural knowledge from vector RAG — into one actionable command. This is the 'split brain' in action: one hemisphere for deterministic data, one for semantic context."

---

## :150–:175 — Architecture & Tech Stack

**[Visual: Cut to the architecture-submission.svg diagram. Zoom in on key sections.]**

**Narrator:**
"The architecture is built on Vercel's Edge Network with Next.js App Router, serverless API routes, and the Vercel AI SDK connecting to NVIDIA Nemotron for LLM inference."

**[Visual: Highlight the Aurora PostgreSQL box with pgvector.]**

"The database is Amazon Aurora PostgreSQL Serverless v2 with pgvector. We store both relational demand data and high-dimensional vector embeddings in the same database, queried via the same connection pool. The HNSW index on the vector column enables sub-50ms semantic search across camp SOPs."

**[Visual: Highlight the Vercel OIDC integration line.]**

"Vercel integrates with Aurora via native OIDC — no static passwords, just IAM authentication at the cluster level."

---

## :175–:180 — Outro

**[Visual: Slow zoom out to full application. Logo appears.]**

**Narrator:**
"Ona Analytics — see the surge, secure the supply. Built for H0: Hack the Zero Stack."

**[Visual: Fade to black with website URL.]**

---

## Production Notes

- **Total runtime**: ~180 seconds (3 minutes)
- **Audio**: Voiceover with calm, authoritative tone. Optional African ambient music in background at very low volume.
- **Screen capture**: Record at 1920×1080, 60fps. Use clean cursor movements.
- **Highlight on clicks**: Use a red circle animation around click points.
- **Text overlays**: Minimal — only key terms like "Split-Brain AI", "SQL Tool", "pgvector RAG", "HNSW Index".
- **AWS Database proof**: Include a 5-second clip at 2:30 showing the Aurora PostgreSQL cluster in Vercel Storage dashboard or AWS Console.
- **Published to**: YouTube (unlisted). Link in Devpost submission.
