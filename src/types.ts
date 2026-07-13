export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  special: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface DailySpecial {
  id: number;
  name: string;
  price: number;
  description: string;
  tag: "Limited Time" | "Today Only" | "Best Value";
  icon: string;
}

export interface Chef {
  id: number;
  role: string;
  name: string;
  signature: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  stars: number;
  quote: string;
  author: string;
  role: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}
