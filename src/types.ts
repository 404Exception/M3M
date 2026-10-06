export interface Location {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  siteCount?: number;
}

export interface SiteImage {
  id: string;
  siteId: string;
  imageUrl: string;
  isCover: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface PlotSize {
  id: string;
  siteId: string;
  plotSize: string; // e.g. "30 x 50 ft"
  area: string;     // e.g. "1500 sq.ft (166 sq.yd)"
  price: string;    // e.g. "₹24,80,000"
  status: 'Available' | 'Sold';
  createdAt: string;
  updatedAt: string;
}

export interface Site {
  id: string;
  locationId: string;
  name: string;
  slug: string;
  address: string;
  description: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  siteType: string;
  startingPrice?: string;
  features?: string;
  locationAdvantages?: string;
  videoUrl?: string;
  status: 'Available' | 'Sold' | 'Unavailable';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  location?: Location;
  images: SiteImage[];
  plotSizes: PlotSize[];
}

export interface DashboardStats {
  totalSites: number;
  publishedSites: number;
  unpublishedSites: number;
  availableSites: number;
  soldSites: number;
  totalLocations: number;
  totalBlogs?: number;
  publishedBlogs?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  readTime: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  company_name: string;
  whatsapp_number: string;
  phone_number: string;
  company_address: string;
  email: string;
  logo_url: string;
  business_hours?: string;
  [key: string]: string | undefined;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}
