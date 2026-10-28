# -*- coding: utf-8 -*-
"""
Greenwood Café Master Research and Digital Asset Archivist Script
Processes, verifies, organizes, categorizes, manifests, and archives
all collected assets and business intelligence for Greenwood Café & Restaurant, Narela, Delhi.
"""

import os
import shutil
import csv
import json
from PIL import Image

BASE_DIR = r"c:\antygravity\greenwood\Greenwood Info"

# 1. VERIFY DIRECTORIES
dirs = [
    r"00_README_AND_INDEX",
    r"01_REAL_LOGO_AND_BRANDING\original_logo",
    r"01_REAL_LOGO_AND_BRANDING\logo_variations",
    r"01_REAL_LOGO_AND_BRANDING\brand_assets",
    r"01_REAL_LOGO_AND_BRANDING\source_screenshots",
    r"02_FOOD_IMAGES\starters",
    r"02_FOOD_IMAGES\north_indian",
    r"02_FOOD_IMAGES\chinese",
    r"02_FOOD_IMAGES\south_indian",
    r"02_FOOD_IMAGES\pizza_and_pasta",
    r"02_FOOD_IMAGES\breads_and_thalis",
    r"02_FOOD_IMAGES\desserts_and_ice_cream",
    r"02_FOOD_IMAGES\beverages_and_shakes",
    r"02_FOOD_IMAGES\other_food",
    r"03_RESTAURANT_INTERIOR_AND_GALLERY\interior",
    r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining",
    r"03_RESTAURANT_INTERIOR_AND_GALLERY\exterior_and_entrance",
    r"03_RESTAURANT_INTERIOR_AND_GALLERY\ambience_and_lighting",
    r"03_RESTAURANT_INTERIOR_AND_GALLERY\other_gallery_images",
    r"04_MENU_AND_PRICING\original_menu_images",
    r"04_MENU_AND_PRICING\menu_documents",
    r"05_SOCIAL_MEDIA_ASSETS\instagram",
    r"05_SOCIAL_MEDIA_ASSETS\facebook",
    r"05_SOCIAL_MEDIA_ASSETS\other_platforms",
    r"06_OFFERS_AND_PROMOTIONS\offer_images",
    r"07_REVIEWS_AND_LISTINGS\listing_screenshots",
    r"08_BUSINESS_DOCUMENTS\publicly_available_pdfs",
    r"08_BUSINESS_DOCUMENTS\downloadable_documents",
    r"08_BUSINESS_DOCUMENTS\other_relevant_files",
    r"09_WEBSITE_REFERENCES\official_website_assets",
    r"09_WEBSITE_REFERENCES\website_screenshots",
    r"10_UNSORTED_REVIEW_REQUIRED"
]

for d in dirs:
    os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)
print("All 32 directories verified.")

# 2. ASSET COPY & ORGANIZATION
# Define mapping from raw downloads to organized destinations
copies = [
    # Logos & Branding
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_1.jpg",
     r"01_REAL_LOGO_AND_BRANDING\original_logo\greenwood_cafe_official_logo_transparent.png"),
    (r"05_SOCIAL_MEDIA_ASSETS\instagram\instagram_official_profile_avatar.jpg",
     r"01_REAL_LOGO_AND_BRANDING\original_logo\greenwood_cafe_avatar_logo.jpg"),
    
    # Food Images - Starters
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_17.jpg",
     r"02_FOOD_IMAGES\starters\kurkure_momos_with_dips.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_16.jpg",
     r"02_FOOD_IMAGES\starters\steamed_momos_bamboo_basket_1600x1067.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_17.jpg",
     r"02_FOOD_IMAGES\starters\veg_seekh_kebab_platter_mint_chutney.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_18.jpg",
     r"02_FOOD_IMAGES\starters\tandoori_paneer_tikka_bell_peppers.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_13.jpg",
     r"02_FOOD_IMAGES\starters\paneer_tikka_charcoal_grilled.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_12.jpg",
     r"02_FOOD_IMAGES\starters\malai_soya_chaap_skewers.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_18.jpg",
     r"02_FOOD_IMAGES\starters\crispy_honey_chilli_potato.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_19.jpg",
     r"02_FOOD_IMAGES\starters\assorted_tandoori_kebab_platter.jpg"),

    # Food Images - North Indian
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_10.jpg",
     r"02_FOOD_IMAGES\north_indian\paneer_butter_masala_gravy.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_11.jpg",
     r"02_FOOD_IMAGES\north_indian\dal_makhani_overnight_desi_ghee.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_19.jpg",
     r"02_FOOD_IMAGES\north_indian\tawa_masala_chaap_coriander_cream.jpg"),

    # Food Images - Chinese
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_16.jpg",
     r"02_FOOD_IMAGES\chinese\chilli_garlic_hakka_noodles.jpg"),

    # Food Images - Pizza & Pasta
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_14.jpg",
     r"02_FOOD_IMAGES\pizza_and_pasta\veggie_lover_fresh_mozzarella_pizza.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_15.jpg",
     r"02_FOOD_IMAGES\pizza_and_pasta\alfredo_white_sauce_pasta.jpg"),

    # Food Images - Breads & Thalis
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_15.jpg",
     r"02_FOOD_IMAGES\breads_and_thalis\tandoori_butter_roti_pickled_onions.jpg"),

    # Food Images - Desserts & Ice Cream
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_21.jpg",
     r"02_FOOD_IMAGES\desserts_and_ice_cream\death_by_chocolate_sundae_goblet.jpg"),

    # Food Images - Beverages & Shakes
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_20.jpg",
     r"02_FOOD_IMAGES\beverages_and_shakes\gourmet_kitkat_brownie_shakes.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_22.jpg",
     r"02_FOOD_IMAGES\beverages_and_shakes\fresh_mint_mojito_cooler.jpg"),

    # Food Images - Other Food (Delivery Order)
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_23.jpg",
     r"02_FOOD_IMAGES\other_food\takeaway_veg_seekh_kebab_box.jpg"),

    # Interior & Exterior - Exterior
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_2.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\exterior_and_entrance\greenwood_cafe_exterior_daytime_facade_hd.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_1.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\exterior_and_entrance\greenwood_cafe_exterior_wide_driveway_1600x1200.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_5.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\exterior_and_entrance\greenwood_cafe_exterior_full_angle.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_2.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\exterior_and_entrance\greenwood_cafe_exterior_illuminated_signage.jpg"),

    # Interior & Exterior - Seating & Dining
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_3.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\golden_birdcage_gazebo_dining_pods_ultra_hd.png"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_4.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\golden_birdcage_dining_pod_closeup.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\swiggy_dineout_photo_4.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\golden_birdcage_dining_pods_swiggy.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_5.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\hanging_wooden_swing_seats_dining.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_3.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\emerald_green_velvet_booth_seating.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\swiggy_dineout_photo_3.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\emerald_banquet_floral_chairs_dining.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_4.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\mustard_yellow_fluted_sofa_lounge_ultra_hd.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\swiggy_dineout_photo_1.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\yellow_sofa_lounge_swiggy.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\swiggy_dineout_photo_2.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\seating_and_dining\yellow_sofa_lounge_angle_2.jpg"),

    # Interior & Exterior - Interior & Counter
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_7.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\interior\service_billing_beverage_counter_1600x1200.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_7.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\interior\billing_counter_google_site.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_8.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\interior\main_dining_hall_wide_view.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_9.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\interior\botanical_wall_feature_ambient_lights.jpg"),

    # Interior & Exterior - Ambience & Lighting
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_home_6.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\ambience_and_lighting\suspended_circular_halo_lighting_rings.jpg"),

    # Interior & Exterior - Other Gallery
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_contact-us_40.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\other_gallery_images\party_celebration_banner_dining.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_contact-us_42.jpg",
     r"03_RESTAURANT_INTERIOR_AND_GALLERY\other_gallery_images\private_party_gathering_area.jpg"),

    # Menu Cards (16 physical menu pages)
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_23.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p01_chinese_starters.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_24.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p02_special_momos_tikkas.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_25.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p03_soya_chaaps_rolls.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_26.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p04_burgers_sandwiches.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_27.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p05_classic_signature_pizzas.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_28.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p06_fries_and_dips.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_29.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p07_wraps_and_pastas.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_30.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p08_full_meals_curries_paneer.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_31.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p09_paneer_lovers_breads_parathas.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_32.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p10_rice_raitas_cold_beverages.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_33.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p11_cold_hot_beverages.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_34.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p12_gourmet_mojitos.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_35.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p13_gourmet_thick_shakes.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_36.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p14_dessert_sundaes.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_37.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p15_special_chocolate_sundaes.jpg"),
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_menu_38.jpg",
     r"04_MENU_AND_PRICING\original_menu_images\greenwood_menu_p16_ice_cream_pastries.jpg"),

    # Offers & Promotions
    (r"09_WEBSITE_REFERENCES\official_website_assets\google_site_contact-us_40.jpg",
     r"06_OFFERS_AND_PROMOTIONS\offer_images\party_celebration_offer_banner.jpg"),

    # Quarantined / Unsorted Assets
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_9.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_gullak_gold.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_10.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_promotional_1.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_11.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_promotional_2.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_12.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_promotional_3.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_13.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_promotional_4.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_14.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_promotional_5.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_21.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_user_upload_anime_illustration_unrelated.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_22.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_user_profile_avatar_male.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_25.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_neighboring_store_aggarwal_sweets.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_8.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ui_icon_small_1.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_20.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ui_icon_small_2.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_24.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ad_banner_horizontal_small.jpg"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_26.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ui_icon_small_3.png"),
    (r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_27.jpg",
     r"10_UNSORTED_REVIEW_REQUIRED\magicpin_ui_icon_small_4.png")
]

for src_rel, dst_rel in copies:
    src = os.path.join(BASE_DIR, src_rel)
    dst = os.path.join(BASE_DIR, dst_rel)
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        print(f"Copied: {dst_rel}")
    else:
        print(f"Warning: Source not found: {src_rel}")

# 3. GENERATE CROPPED LOGO DERIVATIVES (Clearly labeled as crops)
orig_logo_path = os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\original_logo\greenwood_cafe_official_logo_transparent.png")
if os.path.exists(orig_logo_path):
    with Image.open(orig_logo_path) as im:
        # 1. Leaf G symbol crop (approx x: 0 to 450, y: 0 to 400)
        leaf_g = im.crop((0, 0, 420, 360))
        leaf_g.save(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\logo_variations\greenwood_cafe_leaf_g_symbol_crop.png"))
        
        # 2. GREENWOOD Wordmark crop (x: 350 to 2048, y: 0 to 400)
        wordmark = im.crop((370, 40, 2048, 380))
        wordmark.save(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\logo_variations\greenwood_cafe_wordmark_crop.png"))
        
        # 3. "Café" script crop (x: 1300 to 2000, y: 320 to 695)
        cafe_script = im.crop((1300, 320, 1960, 695))
        cafe_script.save(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\logo_variations\greenwood_cafe_script_crop.png"))
        print("Generated logo crop derivatives in 01_REAL_LOGO_AND_BRANDING/logo_variations/.")

# Crop illuminated store sign from magicpin 2
ext_photo_path = os.path.join(BASE_DIR, r"07_REVIEWS_AND_LISTINGS\listing_screenshots\magicpin_greenwood_photo_2.jpg")
if os.path.exists(ext_photo_path):
    with Image.open(ext_photo_path) as im:
        # crop illuminated sign above doorway
        sign = im.crop((580, 420, 1020, 580))
        sign.save(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\logo_variations\greenwood_cafe_illuminated_signboard_crop.jpg"))
        # crop illuminated leaf-G wall logo
        wall_logo = im.crop((1330, 690, 1490, 800))
        wall_logo.save(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\logo_variations\greenwood_cafe_wall_mounted_leaf_logo_crop.jpg"))
        print("Generated real signage crops.")

# 4. BRAND COLOR PALETTE & TYPOGRAPHY ASSETS
palette = {
    "brand_name": "Greenwood Café & Restaurant",
    "location": "Narela, Delhi",
    "extracted_color_palette": {
        "primary_brand_green": {
            "hex": "#1E4D2B",
            "name": "Forest Emerald Green",
            "usage": "Primary buttons, lush foliage arches, velvet banquet upholstery, call-to-actions",
            "source": "Physical interior banquets, moss arches, leaf G signage"
        },
        "brand_walnut_brown": {
            "hex": "#2C1E14",
            "name": "Deep Walnut Wood",
            "usage": "Header navigation bar, exterior timber facade slats, dark contrasting elements",
            "source": "Exterior facade wooden cladding, wooden dining tables"
        },
        "background_cream": {
            "hex": "#FBF8F2",
            "name": "Warm Natural Cream",
            "usage": "Website background, card surfaces, clean organic aesthetic",
            "source": "Warm ambient lighting and official website theme"
        },
        "gold_accent": {
            "hex": "#D4AF37",
            "name": "Champagne Metallic Gold",
            "usage": "Subtle accents, decorative dividers, rating badges, gazebo cage metalwork",
            "source": "Golden birdcage gazebos, circular ceiling chandeliers, official logo champagne vector (#D2C59D)"
        },
        "mustard_yellow": {
            "hex": "#D89A2B",
            "name": "Warm Turmeric Velvet",
            "usage": "Secondary warm accents, modern armchair highlights",
            "source": "Fluted velvet sofas and modern lounge chairs"
        },
        "charcoal_black": {
            "hex": "#1A1A1A",
            "name": "Architectural Black",
            "usage": "Body typography, window framing, industrial mesh ceilings",
            "source": "Window frames, industrial ceiling grid, chalkboard signage"
        }
    },
    "pure_veg_certification": {
        "color_hex": "#0F8A3C",
        "symbol": "Green dot inside green square (FSSAI standard)",
        "promise": "100% Pure Vegetarian, prepared in 100% Desi Ghee"
    }
}

with open(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\brand_assets\greenwood_cafe_color_palette.json"), "w", encoding="utf-8") as f:
    json.dump(palette, f, indent=2)

typo_guide = """# Greenwood Café & Restaurant — Brand Identity & Typography Guide

## 1. Brand Mark Analysis
- **Logo Symbol**: Botanical Leaf stylized into a capital letter **G**. The outer contour forms the letter G while inner veins form a lush leaf.
- **Logotype ("GREENWOOD")**: Clean geometric sans-serif (resembling Montserrat / Futura Bold), with the distinct botanical feature that both letter **O**'s are depicted as intricate **tree-ring wood-grain cross-sections**.
- **Descriptor ("Café")**: Energetic, casual brush script (resembling Satisfy or Pacifico) placed directly beneath the "WOOD" suffix.
- **Original Vector Color**: Warm Champagne / Pale Ochre (`#D2C59D`) on transparent background.

## 2. Typography Recommendations for Web
- **Primary Headings (H1, H2, H3)**: Modern geometric serif / warm editorial font such as `Playfair Display`, `Cinzel`, or geometric sans `Montserrat` (700 Bold).
- **Body Text**: `Inter`, `Plus Jakarta Sans`, or `Outfit` (400 Regular / 500 Medium) with high legibility.
- **Accent & Cursive Subheadings**: `Playfair Display (Italic)` or `Satisfy` for artisanal warmth.
- **Price & Numbers**: Clean tabular monospace or semi-bold numerals (`Outfit` or `Inter`, font-weight: 600).

## 3. Brand Tone & Atmosphere
- **Atmosphere**: Natural biophilic retreat inside an urban setting.
- **Key Visual Elements**: Real timber slats, living moss arches with LED backlighting, golden birdcage dining pods, hanging wooden swing seats, exposed white brick alcoves, lush cascading foliage.
- **Culinary Philosophy**: 100% Pure Vegetarian dining with curries prepared exclusively in 100% Desi Ghee.
"""
with open(os.path.join(BASE_DIR, r"01_REAL_LOGO_AND_BRANDING\brand_assets\greenwood_cafe_typography_guide.md"), "w", encoding="utf-8") as f:
    f.write(typo_guide)

# 5. COMPILE ALL 16 MENU PAGES INTO MULTI-PAGE PDF
menu_page_files = [
    os.path.join(BASE_DIR, f"04_MENU_AND_PRICING\\original_menu_images\\greenwood_menu_p{i:02d}_{s}.jpg")
    for i, s in [
        (1, "chinese_starters"), (2, "special_momos_tikkas"), (3, "soya_chaaps_rolls"),
        (4, "burgers_sandwiches"), (5, "classic_signature_pizzas"), (6, "fries_and_dips"),
        (7, "wraps_and_pastas"), (8, "full_meals_curries_paneer"), (9, "paneer_lovers_breads_parathas"),
        (10, "rice_raitas_cold_beverages"), (11, "cold_hot_beverages"), (12, "gourmet_mojitos"),
        (13, "gourmet_thick_shakes"), (14, "dessert_sundaes"), (15, "special_chocolate_sundaes"),
        (16, "ice_cream_pastries")
    ]
]

valid_menu_imgs = []
for p in menu_page_files:
    if os.path.exists(p):
        valid_menu_imgs.append(Image.open(p).convert("RGB"))

if valid_menu_imgs:
    pdf_out = os.path.join(BASE_DIR, r"08_BUSINESS_DOCUMENTS\publicly_available_pdfs\greenwood_cafe_complete_menu.pdf")
    valid_menu_imgs[0].save(
        pdf_out,
        "PDF",
        resolution=100.0,
        save_all=True,
        append_images=valid_menu_imgs[1:]
    )
    print(f"Compiled {len(valid_menu_imgs)} menu pages into PDF: {pdf_out}")

# Also generate a contact vCard
vcard_content = """BEGIN:VCARD
VERSION:3.0
FN:Greenwood Café & Restaurant
ORG:Greenwood Café & Restaurant
TITLE:Pure Vegetarian Restaurant & Café
TEL;TYPE=WORK,VOICE:+919066906607
TEL;TYPE=CELL:+919066906607
EMAIL;TYPE=INTERNET,PREF:greenwoodcafeindia@gmail.com
ADR;TYPE=WORK:;;Plot No-2, Pocket-6, Sector-A10, Sector A/10, Near Narela Sports Complex;Narela;New Delhi;110040;India
LABEL;TYPE=WORK:Plot No-2, Pocket-6, Sector-A10, Narela, New Delhi 110040
GEO:28.8437515;77.1003382
URL:https://sites.google.com/view/greenwoodcafe/home
URL;TYPE=Instagram:https://www.instagram.com/greenwoodcafeindia/
NOTE:100% Pure Vegetarian Restaurant. All main courses prepared in 100% Desi Ghee. Golden birdcage dining pods, family seating, party hosting.
END:VCARD
"""
with open(os.path.join(BASE_DIR, r"08_BUSINESS_DOCUMENTS\other_relevant_files\greenwood_cafe_contact.vcf"), "w", encoding="utf-8") as f:
    f.write(vcard_content)

print("Assets organized, PDFs compiled, vCards created.")
