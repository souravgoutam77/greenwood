from PIL import Image

im = Image.open('C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/.user_uploaded/media_1792916142865_1af43807.jpg')
w, h = im.size
print(f'Full image: {w}x{h}')

# 1. Three signature dishes:
# Butter chicken dish photo
butter_chicken = im.crop((92, 301, 274, 388))
butter_chicken.save('public/images/butter-chicken.jpg', quality=95)

# Farmhouse pizza dish photo
farmhouse_pizza = im.crop((297, 301, 479, 388))
farmhouse_pizza.save('public/images/farmhouse-pizza.jpg', quality=95)

# Tandoori tikka dish photo
tandoori_tikka = im.crop((503, 301, 685, 388))
tandoori_tikka.save('public/images/tandoori-tikka.jpg', quality=95)

# 2. Hero banner:
# Let's crop the full hero banner from desktop
hero = im.crop((58, 97, 720, 258))
hero.save('public/images/hero-banner-exact.jpg', quality=95)

# Let's also crop the mobile hero banner from mobile mockup (x ~ 770 to 970, y ~ 250 to 375):
mobile_hero = im.crop((778, 253, 966, 376))
mobile_hero.save('public/images/hero-banner-mobile-exact.jpg', quality=95)

# 3. Gallery images:
gal_top1 = im.crop((60, 594, 269, 668))
gal_top1.save('public/images/gallery-1.jpg', quality=95)

gal_top2 = im.crop((276, 594, 485, 668))
gal_top2.save('public/images/gallery-2.jpg', quality=95)

gal_top3 = im.crop((492, 594, 701, 668))
gal_top3.save('public/images/gallery-3.jpg', quality=95)

gal_bot1 = im.crop((60, 676, 269, 740))
gal_bot1.save('public/images/gallery-4.jpg', quality=95)

gal_bot2 = im.crop((276, 676, 427, 740))
gal_bot2.save('public/images/gallery-5.jpg', quality=95)

gal_bot3 = im.crop((434, 676, 617, 740))
gal_bot3.save('public/images/gallery-6.jpg', quality=95)

# 4. Social thumbnails:
soc1 = im.crop((60, 785, 146, 847))
soc1.save('public/images/social-1.jpg', quality=95)

soc2 = im.crop((150, 785, 235, 847))
soc2.save('public/images/social-2.jpg', quality=95)

soc3 = im.crop((240, 785, 325, 847))
soc3.save('public/images/social-3.jpg', quality=95)

soc4 = im.crop((330, 785, 415, 847))
soc4.save('public/images/social-4.jpg', quality=95)

soc5 = im.crop((420, 785, 572, 847))
soc5.save('public/images/social-5.jpg', quality=95)

# 5. Ivy Vine clusters from the desktop borders:
# Top-left ivy vine
ivy_tl = im.crop((35, 15, 95, 200))
ivy_tl.save('public/images/ivy-top-left.png')

# Top-right ivy vine
ivy_tr = im.crop((685, 15, 745, 200))
ivy_tr.save('public/images/ivy-top-right.png')

# Bottom-left ivy vine
ivy_bl = im.crop((35, 740, 95, 920))
ivy_bl.save('public/images/ivy-bottom-left.png')

# Bottom-right ivy vine
ivy_br = im.crop((685, 740, 745, 920))
ivy_br.save('public/images/ivy-bottom-right.png')

print('All reference assets extracted and saved.')
