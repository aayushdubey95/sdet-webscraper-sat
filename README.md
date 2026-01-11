# SDET SAT – Web Scraper (Playwright + TypeScript)

This project is a coding challenge solution for the SDET role.  
It extracts the lowest listing price for a 5-night stay in a 5-star hotel for:

- 2 Adults  
- 1 Infant (below 2 years)  
- Any future date range ( upto 1 year)
- Highest rated 5-star hotel  
- INR currency  

The scraper uses Booking.com as the reference source.

---

## 🏗 Tech Stack
- TypeScript  
- Playwright  
- Node.js  

---

## ▶️ How to Run

### 1. Install dependencies
- npm install

### 2. Install browsers
- npx playwright install

### 3. Run scraper script
- npm start

---

## 📌 Output Format
The scraper stores the best rated hotel in best-hotel.json : 
{
"name": "...",
"rating": ...,
"price": "₹ ...",
"url": "..."
}

---

## 📦 Project Structure
src/
├── scraper.ts
├── utils.ts
└── types.ts

---

## 📑 Notes
- Only Booking.com is used as required.  
- No CAPTCHA bypassing involved.  
- Scraper is minimal and respects "no extensive crawling".  
