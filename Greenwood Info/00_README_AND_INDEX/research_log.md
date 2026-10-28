# Greenwood Café & Restaurant — Detailed Research Log

| Timestamp | Phase | Action / Tool | Source / URL | Outcome / Findings |
| :--- | :--- | :--- | :--- | :--- |
| 2026-10-25 10:00 | Reconnaissance | Web Search & URL Validation | Google Search, Maps, Instagram | Validated correct entity: Greenwood Cafe, Plot No-2, Pocket-6, Sector A10, Narela, Delhi 110040. |
| 2026-10-25 10:15 | Source Inspection | Puppeteer Headless Browser | `https://sites.google.com/view/greenwoodcafe/home` | Captured full-page desktop screenshot (1440x3687). Discovered 23 official image assets, including 2048x695 transparent PNG brand logo. |
| 2026-10-25 10:30 | Menu Harvesting | Puppeteer Headless Browser | `https://sites.google.com/view/greenwoodcafe/menu` | Captured full-page desktop screenshot (1440x6669). Discovered 16 physical spiral-bound menu card photographs. |
| 2026-10-25 10:45 | Contact Verification | Puppeteer Headless Browser | `https://sites.google.com/view/greenwoodcafe/contact-us` | Extracted verified telephone (+91 9066906607), email (greenwoodcafeindia@gmail.com), operating hours (1pm-11pm). |
| 2026-10-25 11:00 | Listing Research | Puppeteer Headless Browser | `https://magicpin.in/New-Delhi/Narela/Restaurant/Greenwood-Cafe/store/1555757` | Captured store desktop screenshot. Extracted 27 photo assets, including 2.5MB–3.5MB original camera photos of interior, exterior, and dishes. |
| 2026-10-25 11:15 | Listing Research | Puppeteer Headless Browser | `https://www.swiggy.com/.../greenwood-cafe-729238/dineout/photos` | Extracted 5 verified dining atmosphere photographs (birdcage gazebos, banquets). |
| 2026-10-25 11:30 | Social Reconnaissance | Puppeteer Headless Browser | `https://www.instagram.com/greenwoodcafeindia/` | Downloaded official profile avatar and 15 reel/post thumbnails. Confirmed bio links to Google Maps. |
| 2026-10-25 11:45 | Google Maps Citation | Puppeteer Headless Browser | `https://maps.app.goo.gl/XtRtZAJStu6jEiZg6` | Captured listing screenshot, verified 612 reviews (3.9★), coordinates 28.8437515, 77.1003382. |
| 2026-10-25 12:00 | Transcription | Multimodal Image Inspection | `google_site_menu_23.jpg` to `38.jpg` | Transcribed all 16 physical menu cards into 115+ structured items with categories, descriptions, and exact INR prices. |
| 2026-10-25 12:30 | Asset Organization | Python OS / PIL Automation | Local Workspace `Greenwood Info/` | Categorized files across 11 structured directories, cropped logo marks, generated multi-page PDF, and generated CSV manifests. |
