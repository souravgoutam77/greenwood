export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  alt: string;
  overlayText?: string;
  isActionTile?: boolean;
}

export interface SocialPost {
  id: string;
  image: string;
  isVideo: boolean;
  alt: string;
  views?: string;
  likes?: string;
  caption?: string;
  reelUrl?: string;
}

export const RESTAURANT_DATA = {
  brand: {
    name: "GREENWOOD",
    subtitle: "Café & RESTAURANT",
    tagline: "Good Food. Greener Moods.",
    locationBadge: "100% PURE VEG • FINE DINE, NARELA",
    description: "A 100% pure vegetarian fine dine restaurant in Narela, serving delicious food in a beautiful natural ambience.",
    copyrightYear: 2026,
  },
  delivery: {
    location: "Narela, Delhi (Hub)",
    radiusBadge: "Max 15km",
    homeDeliveryText: "Home Delivery (25 Mins)",
    takeawayText: "Takeaway",
    notice: "Delivery within 15 km of Narela Hub",
  },
  hero: {
    slides: [
      {
        id: "slide-1",
        titlePrefix: "Good Food.",
        titleSuffix: "Greener Moods.",
        offerTag: "FLAT 20% OFF",
        offerSubtitle: "ON FIRST ORDER",
        offerCode: "CODE: GREENWOOD",
        imageDesktop: "/images/hero-banner.jpg",
        imageMobile: "/images/hero-banner-mobile.jpg",
        alt: "Greenwood luxury botanical dining room with gazebo pods",
      },
      {
        id: "slide-2",
        titlePrefix: "Lush Ambience.",
        titleSuffix: "Pure Indulgence.",
        offerTag: "SPECIAL DINE-IN",
        offerSubtitle: "COMPLIMENTARY MOCKTAIL",
        offerCode: "CODE: DINEGREEN",
        imageDesktop: "/images/gallery-2.jpg",
        imageMobile: "/images/gallery-2.jpg",
        alt: "Private wooden gazebo dining pod surrounded by greenery",
      },
      {
        id: "slide-3",
        titlePrefix: "Culinary Art.",
        titleSuffix: "Fresh Flavours.",
        offerTag: "CHEF'S TASTING",
        offerSubtitle: "GOURMET SELECTIONS",
        offerCode: "CODE: CHEFSPECIAL",
        imageDesktop: "/images/gallery-1.jpg",
        imageMobile: "/images/gallery-1.jpg",
        alt: "Greenwood conservatory dining hall with hanging ivy",
      },
    ],
  },
  navLinks: [
    { label: "Home", href: "#home", isActive: true },
    { label: "Menu", href: "#menu", isActive: false },
    { label: "About Us", href: "#about", isActive: false },
    { label: "Gallery", href: "#gallery", isActive: false },
    { label: "Contact", href: "#contact", isActive: false },
  ],
  signatureDishes: [
    {
      id: "dish-1",
      name: "Paneer Butter Masala",
      description: "Rich, creamy cottage cheese simmered in buttery tomato & cashew gravy.",
      price: 349,
      rating: 4.8,
      reviewsCount: 184,
      isVeg: true,
      image: "/images/paneer-butter-masala.jpg",
    },
    {
      id: "dish-2",
      name: "Farmhouse Pizza",
      description: "Loaded with fresh veggies, cheese and herbs.",
      price: 399,
      rating: 4.7,
      reviewsCount: 120,
      isVeg: true,
      image: "/images/farmhouse-pizza.jpg",
    },
    {
      id: "dish-3",
      name: "Paneer Tikka",
      description: "Smoky, spiced and perfectly grilled cottage cheese skewers.",
      price: 299,
      rating: 4.8,
      reviewsCount: 96,
      isVeg: true,
      image: "/images/tandoori-tikka.jpg",
    },
  ] as Dish[],
  categories: [
    { id: "all", name: "All", icon: "cloche" },
    { id: "starters", name: "Starters", icon: "starters" },
    { id: "main-course", name: "Main Course", icon: "main-course" },
    { id: "south-indian", name: "South Indian", icon: "south-indian" },
    { id: "chinese", name: "Chinese", icon: "chinese" },
    { id: "pizza-pasta", name: "Pizza & Pasta", icon: "pizza-pasta" },
    { id: "breads", name: "Breads", icon: "breads" },
    { id: "desserts", name: "Desserts", icon: "desserts" },
    { id: "beverages", name: "Beverages", icon: "beverages" },
  ] as Category[],
  gallery: [
    {
      id: "gal-1",
      image: "/images/real/real-gazebo-pods.jpg",
      title: "Signature Gazebo Dining Pods",
      alt: "Greenwood Café signature illuminated golden birdcage gazebo dining booths with lush foliage",
    },
    {
      id: "gal-2",
      image: "/images/real/real-botanical-wall.jpg",
      title: "Botanical Plant Feature Wall",
      alt: "Verdant botanical vertical garden with Greenwood illuminated ambient logo",
    },
    {
      id: "gal-3",
      image: "/images/real/real-swing-seats.jpg",
      title: "Wooden Swing Seating",
      alt: "Indoor natural wooden swing seats dining table under warm ambient glow",
      overlayText: "Good Food. Greener Moods.",
    },
    {
      id: "gal-4",
      image: "/images/real/real-yellow-lounge.jpg",
      title: "Fluted Velvet Lounge",
      alt: "Luxury mustard yellow fluted sofa lounge under designer ring chandelier",
    },
    {
      id: "gal-5",
      image: "/images/real/real-dining-hall.jpg",
      title: "Grand Main Dining Floor",
      alt: "Panoramic view of Greenwood's spacious natural dining floor and botanical ceiling",
    },
    {
      id: "gal-6",
      image: "/images/real/real-emerald-booths.jpg",
      title: "Emerald Velvet Private Booths",
      alt: "Intimate emerald velvet booth dining with nature accents",
    },
    {
      id: "gal-more",
      image: "/images/real/real-gazebo-pods.jpg",
      title: "View More Photos",
      alt: "View more gallery photographs",
      isActionTile: true,
    },
  ] as GalleryItem[],
  socialThumbnails: [
    {
      id: "soc-1",
      image: "/images/instagram/reel-real-1.jpg",
      isVideo: true,
      alt: "Greenwood Cafe signature chef culinary creation reel",
      views: "18.4K",
      likes: "1,240",
      caption: "Culinary craft and fresh ingredients at Greenwood Café & Restaurant, Narela! 🍽️🌿",
      reelUrl: "https://www.instagram.com/greenwoodcafeindia/reel/DMxlW8OyfW9/",
    },
    {
      id: "soc-2",
      image: "/images/instagram/reel-real-2.jpg",
      isVideo: true,
      alt: "Greenwood Cafe refreshing handcrafted mocktail & beverage reel",
      views: "24.1K",
      likes: "1,890",
      caption: "Sip into freshness with our handcrafted coolers and signature drinks! 🍹✨",
      reelUrl: "https://www.instagram.com/greenwoodcafeindia/reel/DMng0p9ysWA/",
    },
    {
      id: "soc-3",
      image: "/images/instagram/reel-real-3.jpg",
      isVideo: true,
      alt: "Greenwood Cafe special gazebo dining and celebratory moments reel",
      views: "31.9K",
      likes: "2,530",
      caption: "Celebrating togetherness under the golden gazebos at Greenwood Café! 🌿💛",
      reelUrl: "https://www.instagram.com/greenwoodcafeindia/reel/DMX1Xm_S4fE/",
    },
    {
      id: "soc-4",
      image: "/images/instagram/reel-real-4.jpg",
      isVideo: true,
      alt: "Greenwood Cafe artisan gourmet delights and sizzler reel",
      views: "42.5K",
      likes: "3,710",
      caption: "Hot, delicious and crafted to perfection! Experience true flavours at Greenwood 🍕🔥",
      reelUrl: "https://www.instagram.com/greenwoodcafeindia/reel/DMSrwfrSCyl/",
    },
    {
      id: "soc-5",
      image: "/images/instagram/reel-real-5.jpg",
      isVideo: true,
      alt: "Greenwood Cafe North Indian tandoori feast platter",
      views: "53.2K",
      likes: "4,680",
      caption: "Authentic North Indian tandoori flavours prepared with love and tradition ✨🍽️",
      reelUrl: "https://www.instagram.com/greenwoodcafeindia/p/DMQHBHoyVn5/",
    },
    {
      id: "soc-6",
      image: "/images/instagram/reel-real-6.jpg",
      isVideo: true,
      alt: "Greenwood Cafe golden crispy appetizers and rolls",
      views: "29.7K",
      likes: "2,190",
      caption: "Crispy rolls and flavour-packed starters for every craving at Greenwood! 🌯✨",
      reelUrl: "https://www.instagram.com/greenwoodcafeindia/p/DMaaIqeyd9m/",
    },
  ] as SocialPost[],
  contact: {
    address: "Plot No-2, Pocket-6, Sector-A10, Narela, Delhi - 110040",
    phone: "9066906607",
    phoneDisplay: "9066906607",
    hours: "11:00 AM - 11:30 PM",
    deliveryInfo: "Delivery within 15 km of Narela Hub",
    whatsAppNumber: "919066906607",
    whatsAppLink: "https://wa.me/919066906607?text=Hi%20Greenwood%20Caf%C3%A9%2C%20I%20would%20like%20to%20place%20an%20order%20or%20reserve%20a%20table",
  },
  socialLinks: {
    instagram: "https://www.instagram.com/greenwoodcafeindia/",
    googleMaps: "https://maps.app.goo.gl/XtRtZAJStu6jEiZg6",
  },
  legalLinks: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms & Conditions", href: "#terms" },
    { label: "Refund Policy", href: "#refund" },
  ],
};
