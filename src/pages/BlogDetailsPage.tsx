import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../components/MarkdownRenderer.js';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  Tag,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api.js';
import { BlogPost, Site } from '../types.js';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getPhoneCallUrl } from '../utils/contact.js';
import { SEO } from '../components/common/SEO.js';

export const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [featuredSites, setFeaturedSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchArticleData(slug);
  }, [slug]);

  const fetchArticleData = async (articleSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const article = await api.getBlogBySlug(articleSlug);
      setBlog(article);

      // Lazy load only 4 blogs and 3 sites for sidebar recommendations
      const [allBlogs, sites] = await Promise.all([
        api.getBlogs({ limit: 4 }).catch(() => []),
        api.getSites({ limit: 3 }).catch(() => [])
      ]);

      setRecentBlogs(allBlogs.filter(b => b.slug !== articleSlug).slice(0, 3));
      setFeaturedSites(sites.slice(0, 3));
    } catch (err: any) {
      setError(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = blog
    ? `Hello, I read your analysis "${blog.title}" on M3M Properties. I would like to schedule a private walkthrough and receive the luxury investor kit.`
    : 'Hello, I would like to get detailed information regarding M3M Properties luxury projects.';

  const whatsappUrl = getWhatsAppUrl(settings.whatsapp_number, whatsappMessage);
  const phoneCallUrl = getPhoneCallUrl(settings.phone_number);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">
            {error || 'The requested article may have been moved or unpublished.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/blogs')}
              className="px-4 py-2.5 bg-slate-900 text-amber-400 rounded-xl text-xs font-semibold hover:bg-slate-800 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Insights
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author || 'M3M Luxury Advisory Team',
    },
    publisher: {
      '@type': 'Organization',
      name: settings.company_name || 'M3M Properties',
      logo: {
        '@type': 'ImageObject',
        url: settings.logo_url || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80',
      },
    },
    mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : '',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      <SEO
        title={blog.title}
        description={blog.excerpt || `Read complete guide on ${blog.title}`}
        ogType="article"
        ogImage={blog.coverImage}
        canonicalPath={`/blogs/${blog.slug}`}
        schemaData={blogPostingSchema}
      />

      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/blogs" className="hover:text-emerald-600">Blogs & Guides</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-medium truncate max-w-xs sm:max-w-md">
            {blog.title}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all Articles
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            {/* Meta header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-950 font-semibold text-xs uppercase tracking-wider">
                  {blog.category}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {blog.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {blog.title}
              </h1>

              {/* Author and Share bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-400/20">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{blog.author}</p>
                    <p className="text-slate-500 text-[11px]">Luxury Real Estate & M3M Portfolio Analyst</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-amber-600 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.coverImage && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full max-h-[480px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Article Excerpt Callout */}
            {blog.excerpt && (
              <div className="bg-amber-50/60 border-l-4 border-amber-500 p-5 rounded-r-xl mb-8 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                {blog.excerpt}
              </div>
            )}

            {/* Body Markdown Content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
              <MarkdownRenderer content={blog.content} />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                    <Tag className="w-3.5 h-3.5" />
                    Tags:
                  </span>
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* In-Article WhatsApp Callout */}
            <div className="mt-8 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div>
                <h3 className="text-lg font-extrabold mb-1 text-white">
                  Interested in M3M Luxury Portfolios?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Speak directly with an authorized M3M Investment Concierge for floor plans, payment schedules, and private Experion lounge visits.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 transition-transform hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Contact Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                VIP Private Desk
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Explore M3M Flagships
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Connect directly with our liaison desk for Golf Course Extn Rd, SPR, Dwarka Expressway, and MG Road developments.
              </p>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs transition-colors border border-amber-500/20"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Connect via WhatsApp
                </a>

                <a
                  href={phoneCallUrl}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  Call {settings.phone_number}
                </a>
              </div>
            </div>

            {/* Scheme Key Highlights Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-xs border border-amber-500/20">
              <h4 className="font-bold text-sm text-amber-400 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                The M3M Advantage
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Speed & Scale Delivery:</strong> Rapid project execution with top global construction partners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Iconic Architecture:</strong> Masterplanned by international firms like Chapman Taylor & UHA London.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Grade-A Leased Portfolios:</strong> Institutional tenants, premium high-street retail, & luxury clubs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Prime Micro-Markets:</strong> Strategic frontage on Golf Course Road Extn, SPR & Dwarka Expressway.</span>
                </li>
              </ul>
            </div>

            {/* Recent Articles */}
            {recentBlogs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Related Intelligence & Reports
                </h4>
                <div className="space-y-4">
                  {recentBlogs.map((item) => (
                    <Link
                      key={item.id}
                      to={`/blogs/${item.slug}`}
                      className="group block"
                    >
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
                        {item.title}
                      </h5>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {item.readTime}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Sites Teaser */}
            {featuredSites.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">
                    Featured M3M Projects
                  </h4>
                  <Link to="/" className="text-xs text-amber-600 font-bold hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {featuredSites.map((site) => (
                    <Link
                      key={site.id}
                      to={`/sites/${site.slug}`}
                      className="group block p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 line-clamp-1">
                        {site.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate">
                        {site.address}
                      </p>
                      {site.startingPrice && (
                        <span className="text-xs font-bold text-amber-700 block mt-1">
                          From {site.startingPrice}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
