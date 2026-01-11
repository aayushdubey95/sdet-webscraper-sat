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
.
├── .gitignore                   # Files & folders excluded from version control
│
├── scraperResults/              # Stores generated JSON output (best-hotel.json)
│
├── src/
│   ├── pages/                   # Page Object Model (POM) classes
│   │   ├── HomePage.ts          # Homepage + Calendar + Guests + Popup dismiss
│   │   └── SearchResultsPage.ts # Filters + Hotel extraction (best hotel logic)
│   │
│   ├── utils.ts                 # Shared helpers (futureDate)
│   ├── types.ts                 # Shared TypeScript interfaces (HotelInfo, etc.)
│   └── scraper.ts               # Main Booking.com scraping script (entry point)
│
├── package.json                 # Project metadata, dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation

---

## 📑 Notes
- Only Booking.com is used as required.  
- No CAPTCHA bypassing involved.  
- Scraper is minimal and respects "no extensive crawling".  
