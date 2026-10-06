import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Crown,
  Building,
  Award,
  RefreshCw,
  FileText
} from 'lucide-react';
import { api } from '../services/api.js';
import { BlogPost } from '../types.js';
import { ContactCta } from '../components/ContactCta.js';
import { SEO } from '../components/common/SEO.js';

export const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedBlogs, fetchedCategories] = await Promise.all([
        api.getBlogs(),
        api.getBlogCategories().catch(() => [])
      ]);
      setBlogs(fetchedBlogs);
      
      const allCats = Array.from(new Set([
        ...fetchedCategories,
        ...fetchedBlogs.map(b => b.category).filter(Boolean)
      ]));
      setCategories(allCats);
    } catch (err: any) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      (blog.tags && blog.tags.some(t => t.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularBlogs = filteredBlogs.length > 0 ? filteredBlogs.slice(1) : [];

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="M3M Properties Real Estate Insights & Investment Guides"
        description="Authoritative research on luxury residential trends, high-street retail commercial yields, and Gurugram infrastructure growth by M3M."
        keywords="m3m blogs, gurugram real estate news, golf course extension road investment, m3m high street retail"
        canonicalPath="/blogs"
      />

      {/* Header Banner */}
      <section className="relative bg-slate-950 text-white py-16 px-4 overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            M3M Intelligence & Market Research
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Luxury Real Estate Insights & Corridors
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-light">
            Strategic analysis on Golf Course Extension Road, SPR commercial boulevards, Dwarka Expressway appreciation, and luxury hospitality yields.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search insights by topic, corridor, or asset type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 text-white rounded-2xl border border-slate-700 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm shadow-inner placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories Filter Tabs */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-slate-950 text-amber-400 shadow-xs border border-amber-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Articles ({blogs.length})
            </button>
            {categories.map((cat) => {
              const count = blogs.filter(b => b.category.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-slate-950 text-amber-400 shadow-xs border border-amber-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mb-3" />
            <p className="text-sm font-medium">Loading luxury real estate insights...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700 max-w-lg mx-auto">
            <p className="font-semibold mb-2">Could not retrieve articles</p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBlogs}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No articles found</h3>
            <p className="text-sm text-slate-500 mb-6">
              We couldn't find any articles matching your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article Card */}
            {selectedCategory === 'All' && !searchQuery && featuredBlog && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Featured Research
                  </span>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all group grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto min-h-[260px] overflow-hidden bg-slate-900">
                    <img
                      src={featuredBlog.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/90 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 shadow-md">
                      {featuredBlog.category}
                    </div>
                  </div>
                  <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(featuredBlog.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {featuredBlog.readTime}
                        </span>
                      </div>
                      <Link to={`/blogs/${featuredBlog.slug}`}>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors mb-3 leading-snug">
                          {featuredBlog.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                        {featuredBlog.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                          {featuredBlog.author.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {featuredBlog.author}
                        </span>
                      </div>
                      <Link
                        to={`/blogs/${featuredBlog.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Other Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {selectedCategory === 'All' && !searchQuery ? 'Latest Market Insights' : `Articles (${filteredBlogs.length})`}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(selectedCategory === 'All' && !searchQuery ? regularBlogs : filteredBlogs).map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/40 transition-all flex flex-col group"
                  >
                    <Link to={`/blogs/${blog.slug}`} className="block relative aspect-16/10 overflow-hidden bg-slate-900">
                      <img
                        src={blog.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/90 text-amber-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-amber-500/30">
                        {blog.category}
                      </span>
                    </Link>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {blog.readTime}
                          </span>
                        </div>

                        <Link to={`/blogs/${blog.slug}`}>
                          <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors mb-2 line-clamp-2">
                            {blog.title}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[60%]">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{blog.author}</span>
                        </div>
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                        >
                          Read Guide
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <ContactCta
        title="Looking for Bespoke Real Estate Advisory?"
        subtitle="Our luxury portfolio managers provide tailored recommendations on high-yield commercial retail and premier golf condominium investments."
      />
    </div>
  );
};
