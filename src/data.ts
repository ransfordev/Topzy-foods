import { MenuItem, DailySpecial, Chef, Testimonial } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Jollof Rice & Chicken",
    price: 45.0,
    category: "Main Meals",
    imageUrl: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&q=80",
    description: "Our legendary, perfectly seasoned Ghanaian Jollof rice, served with tender, flavorful grilled chicken.",
    special: false
  },
  {
    id: 2,
    name: "Fried Rice & Chicken",
    price: 42.0,
    category: "Main Meals",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    description: "Rich and savory stir-fried rice loaded with crunchy veggies and served with juicy crispy chicken.",
    special: false
  },
  {
    id: 3,
    name: "Fufu & Goat Soup",
    price: 50.0,
    category: "Local Ghanaian",
    imageUrl: "https://images.unsplash.com/photo-1600630700858-0d9d8df6411b?w=600&q=80",
    description: "Traditional pounded fufu, smooth and pillowy, drowned in rich, spicy slow-simmered goat soup.",
    special: false
  },
  {
    id: 4,
    name: "Banku & Tilapia",
    price: 48.0,
    category: "Local Ghanaian",
    imageUrl: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=600&q=80",
    description: "Soft, tangy fermented corn and cassava dough, served with a whole grilled Tilapia and spicy pepper sauce.",
    special: false
  },
  {
    id: 5,
    name: "Waakye & Shito",
    price: 35.0,
    category: "Local Ghanaian",
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80",
    description: "Traditional Ghanaian rice and beans cooked with millet stalks, served with authentic dark shito, boiled egg, spaghetti (talia) and wele.",
    special: false
  },
  {
    id: 6,
    name: "Double Cheeseburger",
    price: 38.0,
    category: "Fast Food",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    description: "Two juicy smash patties, melted cheddar, crisp lettuce, pickles, and our signature Topzy house sauce on a warm brioche bun.",
    special: false
  },
  {
    id: 7,
    name: "Pizza (Large)",
    price: 55.0,
    category: "Fast Food",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    description: "Freshly tossed large dough covered in seasoned robust tomato sauce, premium mozzarella, and choice toppings.",
    special: false
  },
  {
    id: 8,
    name: "Chicken & Chips",
    price: 32.0,
    category: "Fast Food",
    imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
    description: "Perfectly golden, crispy seasoned chicken pieces served with a side of hot, salty french fries.",
    special: false
  },
  {
    id: 9,
    name: "Fresh Fruit Juice",
    price: 18.0,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299e4e1?w=600&q=80",
    description: "Chilled, freshly squeezed tropical fruits, 100% natural with no added sugar or preservatives.",
    special: false
  },
  {
    id: 10,
    name: "Milkshake",
    price: 22.0,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
    description: "Creamy, thick gourmet milkshake with your choice of premium chocolate, strawberry, or vanilla flavors.",
    special: false
  },
  {
    id: 11,
    name: "Family Combo",
    price: 150.0,
    category: "Special Offers",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    description: "A massive spread featuring 4 portions of Jollof rice, 4 grilled chicken pieces, french fries, and a family-sized drink.",
    special: true
  },
  {
    id: 12,
    name: "Weekend Special",
    price: 60.0,
    category: "Special Offers",
    imageUrl: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=600&q=80",
    description: "A hearty combination of grilled spicy tilapia, golden plantain chunks, waakye, and custom sauces.",
    special: true
  }
];

export const DAILY_SPECIALS: DailySpecial[] = [
  {
    id: 1,
    name: "Weekend Combo",
    price: 55.0,
    description: "Jollof rice, grilled chicken, chips & drink",
    tag: "Limited Time",
    icon: "fa-hamburger"
  },
  {
    id: 2,
    name: "Spicy Tilapia Deal",
    price: 45.0,
    description: "Grilled tilapia with banku & pepper sauce",
    tag: "Today Only",
    icon: "fa-fire"
  },
  {
    id: 3,
    name: "Family Feast",
    price: 120.0,
    description: "Serves 4 — includes main, sides & drinks",
    tag: "Best Value",
    icon: "fa-users"
  }
];

export const CHEFS: Chef[] = [
  {
    id: 1,
    role: "Executive Chef",
    name: "Chef Kojo Mensah",
    signature: "Jollof Royale",
    icon: "fa-user-tie"
  },
  {
    id: 2,
    role: "Seafood Specialist",
    name: "Chef Ama Serwaa",
    signature: "Grilled Tilapia Supreme",
    icon: "fa-fish"
  },
  {
    id: 3,
    role: "Grill Master",
    name: "Chef Kwaku Anane",
    signature: "Double Smash Burger",
    icon: "fa-fire-burner"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    stars: 5,
    quote: "The best jollof rice in Kumasi! Topzy Foods never disappoints.",
    author: "Ama K.",
    role: "Regular Customer"
  },
  {
    id: 2,
    stars: 5,
    quote: "The grilled tilapia was absolutely divine. The pepper sauce is out of this world!",
    author: "Kwame A.",
    role: "Food Lover"
  },
  {
    id: 3,
    stars: 5,
    quote: "My go-to spot for family dinners. The kids love the burgers and the service is top-notch.",
    author: "Esi M.",
    role: "Family Diner"
  }
];

export const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&q=80",
    name: "Signature Ghanaian Jollof"
  },
  {
    url: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=600&q=80",
    name: "Grilled Tilapia with Banku"
  },
  {
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    name: "Double Smash Cheeseburger"
  },
  {
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    name: "Gourmet Loaded Pizza"
  },
  {
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    name: "Grand Family Combo"
  },
  {
    url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
    name: "Creamy Chocolate Milkshake"
  }
];
