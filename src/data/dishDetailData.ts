export interface DishGalleryImage {
  id: number;
  url: string;
  alt: string;
}

export interface PairingItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface RecommendationItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
}

export interface ReviewRatingDist {
  stars: number;
  percentage: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  avatarInitial: string;
  rating: number;
  timeAgo: string;
  text: string;
  helpfulCount: number;
  images?: string[];
}

export interface DishDetail {
  id: string;
  name: string;
  category: string;
  breadcrumbs: string[];
  isVeg: boolean;
  vegLabel: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  images: DishGalleryImage[];
  metadata: {
    serves: string;
    cuisine: string;
    preparationTime: string;
    availability: string;
  };
  about: {
    title: string;
    description: string;
  };
  pairings: PairingItem[];
  recommendations: RecommendationItem[];
  reviewsSummary: {
    average: number;
    total: number;
    distribution: ReviewRatingDist[];
  };
  reviews: CustomerReview[];
}

export const BUTTER_PANEER_DETAIL: DishDetail = {
  id: "butter-paneer",
  name: "Butter Paneer",
  category: "North Indian",
  breadcrumbs: ["Menu", "North Indian", "Butter Paneer"],
  isVeg: true,
  vegLabel: "100% Vegetarian",
  price: 299,
  rating: 4.8,
  reviewsCount: 184,
  description:
    "Rich, creamy and full of authentic flavours. Soft paneer cubes cooked in a luscious tomato and butter gravy with a perfect blend of spices.",
  images: [
    {
      id: 1,
      url: "/images/paneer-butter-masala.jpg",
      alt: "Butter Paneer in copper handi garnished with cream swirl",
    },
    {
      id: 2,
      url: "/images/dish-detail/real-thumb-2.jpg",
      alt: "Freshly served bowl of rich paneer butter gravy",
    },
    {
      id: 3,
      url: "/images/dish-detail/real-thumb-3.jpg",
      alt: "Crisp golden tandoori naan flatbread pairing",
    },
    {
      id: 4,
      url: "/images/dish-detail/real-thumb-4.jpg",
      alt: "Freshly brushed butter garlic naan close-up",
    },
    {
      id: 5,
      url: "/images/dish-detail/real-thumb-5.jpg",
      alt: "Butter Paneer meal setup with fragrant basmati garnish",
    },
  ],
  metadata: {
    serves: "1–2 People",
    cuisine: "North Indian",
    preparationTime: "20–25 mins",
    availability: "Dine-in, Takeaway, Delivery",
  },
  about: {
    title: "About This Dish",
    description:
      "A classic North Indian favourite, our Butter Paneer is prepared with soft paneer cubes simmered in a rich, creamy tomato gravy, infused with aromatic spices and a hint of butter. Perfectly balanced and full of flavour, it's a timeless dish loved by all.",
  },
  pairings: [
    {
      id: "pair-1",
      name: "Butter Naan",
      price: 49,
      image: "/images/dish-detail/real-pair-butter-naan.jpg",
    },
    {
      id: "pair-2",
      name: "Jeera Rice",
      price: 129,
      image: "/images/dish-detail/real-pair-jeera-rice.jpg",
    },
    {
      id: "pair-3",
      name: "Garlic Naan",
      price: 59,
      image: "/images/dish-detail/real-pair-garlic-naan.jpg",
    },
  ],
  recommendations: [
    {
      id: "rec-1",
      name: "Shahi Paneer",
      price: 299,
      rating: 4.6,
      reviewsCount: 92,
      image: "/images/dish-detail/real-rec-shahi-paneer.jpg",
    },
    {
      id: "rec-2",
      name: "Dal Makhani",
      price: 279,
      rating: 4.6,
      reviewsCount: 84,
      image: "/images/dish-detail/real-rec-dal-makhani.jpg",
    },
    {
      id: "rec-3",
      name: "Paneer Tikka Masala",
      price: 329,
      rating: 4.7,
      reviewsCount: 98,
      image: "/images/dish-detail/real-rec-paneer-tikka.jpg",
    },
    {
      id: "rec-4",
      name: "Kadai Paneer",
      price: 299,
      rating: 4.5,
      reviewsCount: 61,
      image: "/images/dish-detail/real-rec-kadai-paneer.jpg",
    },
  ],
  reviewsSummary: {
    average: 4.8,
    total: 184,
    distribution: [
      { stars: 5, percentage: 78 },
      { stars: 4, percentage: 15 },
      { stars: 3, percentage: 5 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 1 },
    ],
  },
  reviews: [
    {
      id: "rev-1",
      author: "Rahul Sharma",
      avatarInitial: "R",
      rating: 5.0,
      timeAgo: "12 days ago",
      text: "Amazing taste and perfect texture. Gravy is rich and creamy. Highly recommended!",
      helpfulCount: 24,
      images: [
        "/images/dish-detail/real-rev-1a.jpg",
        "/images/dish-detail/real-rev-1b.jpg",
      ],
    },
    {
      id: "rev-2",
      author: "Priya Verma",
      avatarInitial: "P",
      rating: 4.5,
      timeAgo: "3 weeks ago",
      text: "Perfectlys cooked paneer and great balance of spices. Goes really well with butter naan.",
      helpfulCount: 12,
      images: [
        "/images/dish-detail/real-rev-2a.jpg",
        "/images/dish-detail/real-rev-2b.jpg",
      ],
    },
  ],
};
