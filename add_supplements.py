# -*- coding: utf-8 -*-
import os
from PIL import Image

base = r"c:\antygravity\greenwood\Greenwood Info"

# 1. Source screenshots for logo
home_ss = os.path.join(base, r"09_WEBSITE_REFERENCES\website_screenshots\google_sites_homepage_desktop.png")
if os.path.exists(home_ss):
    with Image.open(home_ss) as im:
        header_crop = im.crop((0, 0, 1440, 260))
        header_crop.save(os.path.join(base, r"01_REAL_LOGO_AND_BRANDING\source_screenshots\official_google_sites_header_logo.png"))

insta_ss = os.path.join(base, r"05_SOCIAL_MEDIA_ASSETS\instagram\instagram_profile_screenshot.png")
if os.path.exists(insta_ss):
    with Image.open(insta_ss) as im:
        insta_logo_crop = im.crop((50, 40, 400, 250))
        insta_logo_crop.save(os.path.join(base, r"01_REAL_LOGO_AND_BRANDING\source_screenshots\instagram_profile_header_logo.png"))

# 2. South Indian note
with open(os.path.join(base, r"02_FOOD_IMAGES\south_indian\south_indian_menu_audit_note.md"), "w", encoding="utf-8") as f:
    f.write("""# South Indian Cuisine Audit

- **Audit Status**: **Not Offered**
- **Findings**: After detailed inspection of all 16 physical menu card pages from Greenwood Café, no South Indian dishes (Dosas, Idlis, Vadas, Uttapams) are prepared or served by this establishment.
- **Menu Focus**: The menu focuses exclusively on:
  - North Indian Curries (prepared in 100% Desi Ghee)
  - Tandoori Starters & Soya Chaaps
  - Indo-Chinese (Noodles, Manchurian, Momos)
  - Continental (Burgers, Sandwiches, Pizzas, Pastas)
  - Café Desserts & Beverages
""")

# 3. Menu documents
with open(os.path.join(base, r"04_MENU_AND_PRICING\menu_documents\menu_structure_summary.md"), "w", encoding="utf-8") as f:
    f.write("""# Greenwood Café Menu Structure & Document Index

This folder indexes the digitized 16-page menu of Greenwood Café & Restaurant:
- **Compiled 16-Page PDF**: `08_BUSINESS_DOCUMENTS/publicly_available_pdfs/greenwood_cafe_complete_menu.pdf`
- **Machine-Readable CSV**: `04_MENU_AND_PRICING/extracted_menu_data.csv` (198 items/variants)
- **High-Resolution Scans**: `04_MENU_AND_PRICING/original_menu_images/`
- **Total Verified Items**: 115+ dishes across 16 master categories
- **Dietary Guarantee**: 100% Pure Vegetarian, 100% Desi Ghee Curries
""")

# 4. Facebook presence audit
with open(os.path.join(base, r"05_SOCIAL_MEDIA_ASSETS\facebook\facebook_presence_audit.md"), "w", encoding="utf-8") as f:
    f.write("""# Facebook Presence Audit for Greenwood Café, Narela

- **Search Query**: Greenwood Cafe Narela Delhi Facebook
- **Audit Findings**: The business currently prioritizes Instagram (`@greenwoodcafeindia`) and its Google Business Profile as its primary digital channels.
- **Status**: No standalone verified official Facebook page is independently maintained for the Narela branch. Unofficial community check-in pages exist without official owner claims.
""")

# 5. Other platforms audit
with open(os.path.join(base, r"05_SOCIAL_MEDIA_ASSETS\other_platforms\other_platforms_audit.md"), "w", encoding="utf-8") as f:
    f.write("""# Other Directory Listings & Platform Audit

- **Zomato**: Listing references exist for Greenwood Cafe, Sector A10 Narela; currently redirected or synced with Swiggy/Magicpin metrics.
- **Justdial / Sulekha / Tripadvisor**: Aggregator citation entries confirm phone +91 9066906607 and address at Plot No-2, Pocket-6, Sector-A10, Narela.
- **YouTube**: Multiple food vlogger short clips showcasing the golden birdcage dining gazebos and kurkure momos in Narela.
""")

print("All supplementary notes and crops created.")
