# 📊 TaxFlow - AI-Native Tax Calculator

TaxFlow is a sleek, modern, full-stack tax tracking application built specifically for UK gig workers, taxi drivers, and care workers. It features a weightless, glassmorphism UI designed to help users instantly see whether they are making a profit or a loss for the financial year.

---

## ✨ Features
* **Tailored Worker Profiles:** Select your role (Taxi Driver, Care Worker, General Gig Worker) to apply custom rules.
* **HMRC 2026/27 Tax Band Engine:** Automatically estimates standard Personal Allowance (£12,570), Basic Rate (20%), and Higher Rate (40%) brackets.
* **Flat-Rate Mileage Tracker:** Smart mileage deduction logic calculating the first 10,000 miles at 45p/mile and additional miles at 25p/mile.
* **Custom Date Selector:** Backdate income or expense receipts seamlessly with an inline calendar tool.
* **One-Click Data Export:** Instantly download a formatted `taxflow_summary.csv` to hand straight to an accountant or use for HMRC Self Assessment.

---

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Framer Motion
* **Backend:** Python FastAPI, Pydantic
* **Database:** SQLite

---

## 🚀 How to Run Locally

1. Make the launcher script executable:
   ```bash
   chmod +x start.sh
