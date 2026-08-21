# 🏪 KiranaConnect: India's Decentralized PUDO Logistics Network

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in/)
[![Theme](https://img.shields.io/badge/Theme-Transportation%20%26%20Logistics-blue.svg)]()
[![Architecture](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20Express-emerald.svg)]()

> **Quick-commerce hurts local kirana stores, while e-commerce suffers 20%+ failed doorstep deliveries. KiranaConnect turns neighborhood stores into PUDO pickup hubs: riders drop parcels with photo proof and customers collect via OTP/QR. This cuts delivery failures to zero while driving store footfall with a 50-60% chance of impulse grocery sales.**

---

## 📁 Repository Structure

```text
kirana-connect/
├── backend/                       👉 Express.js REST API & Microservices
│   ├── src/
│   │   ├── controllers/           # Parcel, Store & Matching controllers
│   │   ├── routes/                # Express API Route endpoints
│   │   ├── services/              # Haversine Matching Engine & Security
│   │   ├── models/                # TypeScript Interfaces & Schemas
│   │   └── server.ts              # API Entry Point (Port 5000)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      👉 React + Vite + Tailwind Client App
│   ├── src/
│   │   ├── views/                 # Customer, Rider, Kirana & Admin Portals
│   │   ├── components/            # Interactive Vector Map, Soundbox, Shelf Rack
│   │   ├── lib/                   # Web Audio synthesizers & State
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                      👉 Project Documentation & Setup Guide
```

---

## 🚀 Quick Start Guide

### 1. Run the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
👉 Opens at **[http://localhost:3000](http://localhost:3000)**

### 2. Run the Backend API Service
```bash
cd backend
npm install
npm run dev
```
👉 API server runs at **[http://localhost:5000](http://localhost:5000)** (Health check: `http://localhost:5000/api/health`)

---

## 📌 Problem Statement

The rapid surge of quick-commerce apps (Blinkit, Zepto, Instamart) has diverted daily consumer footfall away from India’s **13 million+ neighborhood Kirana stores**, threatening their primary livelihood. Simultaneously, traditional e-commerce logistics battles an **18–25% failed doorstep delivery rate** caused by absent customers, gated communities, and ambiguous addresses. This results in heavy Return-to-Origin (RTO) expenses, fuel waste, and wasted gig-worker time.

---

## 💡 The Dual-Impact Solution

**KiranaConnect** converts neighborhood Kiranas into verified **Pick-Up & Drop-Off (PUDO) hubs**:

1. **Failure-Proof Last-Mile Delivery**: Gig riders batch-drop parcels at verified Kirana hubs with photo proof. Customers collect parcels using **cryptographic QR passes or 4-digit OTPs**, cutting last-mile delivery failure rates to **under 0.5%** and reducing logistics expenses by **~60%**.
2. **Revitalizing Kirana Revenues & Walk-In Footfall**: Kirana merchants earn a direct **₹15 micro-commission per parcel** deposited into their UPI wallet. Crucially, **50–60% of customers picking up parcels make unplanned grocery/household purchases on the spot**, restoring vital footfall and revenue to local mom-and-pop stores.

---

## 👥 The 4 Unified Portals

| Portal | Role | Key Capabilities |
| :--- | :--- | :--- |
| **1. Customer Pass** | Recipient | Dynamic QR Pass, 4-digit OTP PIN, Voice Audio Pronunciation, WhatsApp Pass Sharing, 72h countdown. |
| **2. Delivery Rider** | Gig Agent | Bulk drop console, AI photo proof camera viewfinder with tamper check, turn-by-turn navigation. |
| **3. Kirana Merchant** | Store Partner | 2D Shelf Rack visualizer (`A-01`, `B-03`), QR/OTP validator, working UPI Soundbox voice alert, instant withdrawal. |
| **4. Logistics Admin** | 3PL / Dispatch | Haversine Smart Matching Engine, Unit economics ROI matrix (₹60 vs ₹22), Store onboarding KYC. |
