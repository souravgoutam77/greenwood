from PIL import Image

im = Image.open('C:/Users/Sourav/.gemini/antigravity/brain/e398a586-37c6-4491-aae1-778d0bff3a19/.user_uploaded/media_1792916142865_1af43807.jpg')

# 1. Gallery Row 1
im.crop((60, 595, 267, 666)).save('public/images/gallery-1.jpg', quality=95)
im.crop((275, 595, 483, 666)).save('public/images/gallery-2.jpg', quality=95)
im.crop((491, 595, 698, 666)).save('public/images/gallery-3.jpg', quality=95)

# 2. Gallery Row 2
im.crop((60, 673, 267, 737)).save('public/images/gallery-4.jpg', quality=95)
im.crop((275, 673, 425, 737)).save('public/images/gallery-5.jpg', quality=95)
im.crop((433, 673, 616, 737)).save('public/images/gallery-6.jpg', quality=95)
im.crop((624, 673, 698, 737)).save('public/images/gallery-more-tile.jpg', quality=95)

# 3. Social Row
im.crop((60, 784, 146, 845)).save('public/images/social-1.jpg', quality=95)
im.crop((154, 784, 240, 845)).save('public/images/social-2.jpg', quality=95)
im.crop((248, 784, 334, 845)).save('public/images/social-3.jpg', quality=95)
im.crop((342, 784, 428, 845)).save('public/images/social-4.jpg', quality=95)
im.crop((436, 784, 546, 845)).save('public/images/social-5.jpg', quality=95)

print('All gallery and social images perfectly extracted.')
