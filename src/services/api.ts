import { Location, Site, AppSettings, DashboardStats, AdminUser, PlotSize, SiteImage, BlogPost } from '../types.js';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('m3m_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('m3m_admin_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('m3m_admin_token');
  localStorage.removeItem('m3m_admin_user');
}

export function getStoredUser(): AdminUser | null {
  const user = localStorage.getItem('m3m_admin_user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AdminUser): void {
  localStorage.setItem('m3m_admin_user', JSON.stringify(user));
}

// Authenticated fetch wrapper
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthToken();
    // if on admin page and not login, redirect to login
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }

  return response;
}

// --- PUBLIC APIS ---
export const api = {
  async getLocations(): Promise<Location[]> {
    const res = await fetch(`${API_BASE}/locations`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  async getLocationSites(slug: string): Promise<{ location: Location; sites: Site[] }> {
    const res = await fetch(`${API_BASE}/locations/${slug}/sites`);
    if (!res.ok) throw new Error('Failed to fetch location sites');
    return res.json();
  },

  async getCategories(): Promise<Array<{ name: string; count: number }>> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getSites(params?: {
    location?: string;
    siteType?: string;
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Site[]> {
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.append('location', params.location);
    if (params?.siteType && params.siteType !== 'All') searchParams.append('siteType', params.siteType);
    if (params?.category && params.category !== 'All') searchParams.append('category', params.category);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.offset !== undefined) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    const url = `${API_BASE}/sites${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch sites');
    return res.json();
  },

  async getSiteBySlug(slug: string): Promise<Site> {
    const res = await fetch(`${API_BASE}/sites/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch site details');
    return res.json();
  },

  async getPublicSettings(): Promise<AppSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async getPublicStats(): Promise<{ activeLocations: number; verifiedSites: number }> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch public stats');
    return res.json();
  },

  // --- ADMIN APIS ---
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setAuthToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async getAdminMe(): Promise<AdminUser> {
    const res = await fetchWithAuth(`${API_BASE}/admin/auth/me`);
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }): Promise<{ message: string }> {
    const res = await fetchWithAuth(`${API_BASE}/admin/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  async getDashboard(): Promise<DashboardStats> {
    const res = await fetchWithAuth(`${API_BASE}/admin/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getAdminSites(): Promise<Site[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites`);
    if (!res.ok) throw new Error('Failed to fetch sites');
    return res.json();
  },

  async getAdminSiteById(id: string): Promise<Site> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${id}`);
    if (!res.ok) throw new Error('Failed to fetch site');
    return res.json();
  },

  async getSiteById(id: string): Promise<Site> {
    return this.getAdminSiteById(id);
  },

  async uploadImage(file: File): Promise<{ imageUrl: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetchWithAuth(`${API_BASE}/admin/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errMsg = (data && (data.error || data.details || data.message)) || 'Failed to upload image. Please try again.';
      throw new Error(errMsg);
    }
    return data;
  },

  async uploadVideo(file: File): Promise<{ videoUrl: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetchWithAuth(`${API_BASE}/admin/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errMsg = (data && (data.error || data.details || data.message)) || 'Failed to upload video. Please try again.';
      throw new Error(errMsg);
    }
    return data;
  },

  async createSite(siteData: Partial<Site>): Promise<Site> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites`, {
      method: 'POST',
      body: JSON.stringify(siteData),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error((data && (data.error || data.details || data.message)) || 'Failed to create site');
    return data;
  },

  async updateSite(id: string, siteData: Partial<Site>): Promise<Site> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(siteData),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error((data && (data.error || data.details || data.message)) || 'Failed to update site');
    return data;
  },

  async deleteSite(id: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete site');
  },

  async uploadSiteImages(siteId: string, files: File[]): Promise<{ images: SiteImage[]; site: Site }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${siteId}/images`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errMsg = (data && (data.error || data.details || data.message)) || 'Failed to upload images';
      throw new Error(errMsg);
    }
    return data;
  },

  async addSiteImageUrl(siteId: string, imageUrl: string, isCover = false): Promise<{ images: SiteImage[]; site: Site }> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${siteId}/images`, {
      method: 'POST',
      body: JSON.stringify({ imageUrl, isCover }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add image');
    return data;
  },

  async deleteSiteImage(imageId: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/images/${imageId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete image');
  },

  async setCoverImage(siteId: string, imageId: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${siteId}/images/${imageId}/cover`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to set cover image');
  },

  async reorderImages(siteId: string, imageIds: string[]): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${siteId}/images/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ imageIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder images');
  },

  async addPlotSize(siteId: string, plotData: Omit<PlotSize, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>): Promise<PlotSize> {
    const res = await fetchWithAuth(`${API_BASE}/admin/sites/${siteId}/plot-sizes`, {
      method: 'POST',
      body: JSON.stringify(plotData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add plot size');
    return data;
  },

  async updatePlotSize(plotSizeId: string, plotData: Partial<PlotSize>): Promise<PlotSize> {
    const res = await fetchWithAuth(`${API_BASE}/admin/plot-sizes/${plotSizeId}`, {
      method: 'PUT',
      body: JSON.stringify(plotData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update plot size');
    return data;
  },

  async deletePlotSize(plotSizeId: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/plot-sizes/${plotSizeId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete plot size');
  },

  async getAdminLocations(): Promise<Location[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/locations`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  async createLocation(locationData: Partial<Location>): Promise<Location> {
    const res = await fetchWithAuth(`${API_BASE}/admin/locations`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create location');
    return data;
  },

  async updateLocation(id: string, locationData: Partial<Location>): Promise<Location> {
    const res = await fetchWithAuth(`${API_BASE}/admin/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update location');
    return data;
  },

  async deleteLocation(id: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/locations/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete location');
  },

  async getAdminSettings(): Promise<AppSettings> {
    const res = await fetchWithAuth(`${API_BASE}/admin/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateAdminSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const res = await fetchWithAuth(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data.settings;
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return this.updateAdminSettings(settings);
  },

  // --- BLOG CLIENT METHODS ---
  async getBlogs(params?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<BlogPost[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.limit !== undefined) query.append('limit', params.limit.toString());
    if (params?.offset !== undefined) query.append('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/blogs${qs}`);
    if (!res.ok) throw new Error('Failed to fetch blog articles');
    return res.json();
  },

  async getBlogCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/blogs/categories`);
    if (!res.ok) throw new Error('Failed to fetch blog categories');
    return res.json();
  },

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Blog article not found');
      throw new Error('Failed to fetch blog article');
    }
    return res.json();
  },

  async getAdminBlogs(params?: { category?: string; search?: string }): Promise<BlogPost[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetchWithAuth(`${API_BASE}/admin/blogs${qs}`);
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    return res.json();
  },

  async getAdminBlogById(id: string): Promise<BlogPost> {
    const res = await fetchWithAuth(`${API_BASE}/admin/blogs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog post');
    return res.json();
  },

  async createBlog(blogData: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetchWithAuth(`${API_BASE}/admin/blogs`, {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create blog post');
    return data;
  },

  async updateBlog(id: string, blogData: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetchWithAuth(`${API_BASE}/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog post');
    return data;
  },

  async deleteBlog(id: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/blogs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete blog post');
  },

  async toggleBlogPublish(id: string): Promise<BlogPost> {
    const res = await fetchWithAuth(`${API_BASE}/admin/blogs/${id}/publish`, {
      method: 'PATCH',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle publish status');
    return data;
  }
};
