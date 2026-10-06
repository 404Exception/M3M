import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  BookOpen,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Minus,
  ExternalLink,
  Undo,
  Redo,
  Link2,
  Table as TableIcon,
  Code
} from 'lucide-react';
import { api, getAuthToken } from '../services/api.js';
import { BlogPost } from '../types.js';
import { MarkdownRenderer } from '../components/MarkdownRenderer.js';

const CATEGORY_PRESETS = [
  'Market Intelligence',
  'Investment & ROI',
  'Luxury Architecture',
  'Corridor Analysis',
  'Commercial & Retail',
  'NRI Advisory'
];

export const AdminBlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Market Intelligence',
    customCategory: '',
    author: 'M3M Luxury Advisory Desk',
    readTime: '4 min read',
    excerpt: '',
    content: '',
    coverImage: '',
    tagsString: '',
    isPublished: true,
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadBlog(id);
    }
  }, [isEditMode, id]);

  const loadBlog = async (blogId: string) => {
    try {
      setLoading(true);
      setError(null);
      const blog = await api.getAdminBlogById(blogId);
      const isCustomCat = !CATEGORY_PRESETS.includes(blog.category);
      const blogContent = blog.content || '';
      setFormData({
        title: blog.title,
        slug: blog.slug,
        category: isCustomCat ? 'Custom' : blog.category,
        customCategory: isCustomCat ? blog.category : '',
        author: blog.author || 'M3M Luxury Advisory Desk',
        readTime: blog.readTime || '4 min read',
        excerpt: blog.excerpt || '',
        content: blogContent,
        coverImage: blog.coverImage || '',
        tagsString: (blog.tags || []).join(', '),
        isPublished: blog.isPublished,
      });
      setHistory([blogContent]);
      setHistoryIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load article for editing');
    } finally {
      setLoading(false);
    }
  };

  const updateContentWithHistory = (newContent: string, recordHistory = true) => {
    setFormData(prev => ({ ...prev, content: newContent }));
    if (recordHistory) {
      setHistory(prev => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, newContent];
      });
      setHistoryIndex(prev => prev + 1);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, content: val }));

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setHistory(prev => {
        if (prev[historyIndex] === val) return prev;
        const next = prev.slice(0, historyIndex + 1);
        return [...next, val];
      });
      setHistoryIndex(prev => prev + 1);
    }, 400);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetContent = history[targetIndex];
      setHistoryIndex(targetIndex);
      setFormData(prev => ({ ...prev, content: targetContent }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetContent = history[targetIndex];
      setHistoryIndex(targetIndex);
      setFormData(prev => ({ ...prev, content: targetContent }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => {
      // Auto-suggest slug if creating new
      if (!isEditMode && (!prev.slug || prev.slug === slugify(prev.title))) {
        return {
          ...prev,
          title: val,
          slug: slugify(val)
        };
      }
      return { ...prev, title: val };
    });
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setImageUploadError(null);
      setError(null);
      const data = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, coverImage: data.imageUrl }));
    } catch (err: any) {
      const msg = err.message || 'Failed to upload cover image';
      setImageUploadError(msg);
      setError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const insertFormatting = (syntax: string) => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = formData.content;
    const selected = current.substring(start, end);

    let insertion = '';

    switch (syntax) {
      case 'h2':
        insertion = selected ? `\n## ${selected}\n` : `\n## Heading 2 Title\n`;
        break;
      case 'h3':
        insertion = selected ? `\n### ${selected}\n` : `\n### Sub-heading Title\n`;
        break;
      case 'bold':
        insertion = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        insertion = `*${selected || 'italic text'}*`;
        break;
      case 'ul':
        if (selected) {
          insertion = '\n' + selected.split('\n').map(l => l.startsWith('- ') ? l : `- ${l}`).join('\n') + '\n';
        } else {
          insertion = `\n- Item 1\n- Item 2\n- Item 3\n`;
        }
        break;
      case 'ol':
        if (selected) {
          insertion = '\n' + selected.split('\n').map((l, i) => `${i + 1}. ${l.replace(/^\d+\.\s*/, '')}`).join('\n') + '\n';
        } else {
          insertion = `\n1. Step one\n2. Step two\n3. Step three\n`;
        }
        break;
      case 'quote':
        if (selected) {
          insertion = '\n' + selected.split('\n').map(l => l.startsWith('> ') ? l : `> ${l}`).join('\n') + '\n';
        } else {
          insertion = `\n> Key policy takeaway or advisory quote.\n`;
        }
        break;
      case 'link':
        insertion = selected ? `[${selected}](https://)` : `[Link Title](https://example.com)`;
        break;
      case 'code':
        if (selected && selected.includes('\n')) {
          insertion = `\n\`\`\`\n${selected}\n\`\`\`\n`;
        } else {
          insertion = `\`${selected || 'code'}\``;
        }
        break;
      case 'table':
        insertion = `\n| Specification | Details | Status |\n| :--- | :--- | :--- |\n| Plot Size | 150 sq.yd | Available |\n| Stilt + 4 Floors | Approved | Permitted |\n| RERA Registration | Active | Verified |\n`;
        break;
      case 'hr':
        insertion = `\n\n---\n\n`;
        break;
      default:
        insertion = '';
    }

    const updated = current.substring(0, start) + insertion + current.substring(end);
    updateContentWithHistory(updated, true);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + insertion.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Undo shortcut: Ctrl+Z / Cmd+Z (without Shift)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Redo shortcut: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
    if (
      ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
    ) {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Tab key: indent 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = formData.content;
      const updated = current.substring(0, start) + '  ' + current.substring(end);
      updateContentWithHistory(updated, true);
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
      return;
    }

    // Bold shortcut: Ctrl+B / Cmd+B
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertFormatting('bold');
      return;
    }

    // Italic shortcut: Ctrl+I / Cmd+I
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertFormatting('italic');
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide an article title');
      return;
    }
    if (!formData.content.trim()) {
      setError('Please provide article content');
      return;
    }

    const finalCategory = formData.category === 'Custom'
      ? (formData.customCategory.trim() || 'General')
      : formData.category;

    const tags = formData.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload: Partial<BlogPost> = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || slugify(formData.title),
      category: finalCategory,
      author: formData.author.trim() || 'DDJAY Advisory Desk',
      readTime: formData.readTime.trim() || '4 min read',
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      tags,
      isPublished: formData.isPublished,
    };

    try {
      setSaving(true);
      setError(null);

      if (isEditMode && id) {
        await api.updateBlog(id, payload);
        setSuccessMessage('Article updated successfully!');
      } else {
        await api.createBlog(payload);
        setSuccessMessage('Article published successfully!');
      }

      setTimeout(() => {
        navigate('/admin/blogs');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-xs font-medium text-slate-500">Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {isEditMode ? 'Edit Blog Article' : 'Write New Blog Article'}
            </h1>
            <p className="text-xs text-slate-500">
              Create informative guides, investment comparisons, or policy walkthroughs.
            </p>
          </div>
        </div>

        {isEditMode && formData.slug && (
          <Link
            to={`/blogs/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Article Primary Details Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Article Information
          </h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Guide to Investing in M3M Luxury Commercial & Residential in Gurugram"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white font-medium"
            />
          </div>

          {/* URL Slug */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              URL Slug <span className="text-slate-400 font-normal">(e.g. /blogs/your-slug)</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 text-xs bg-slate-100 text-slate-500 border border-r-0 border-slate-200 rounded-l-lg select-none">
                /blogs/
              </span>
              <input
                type="text"
                placeholder="article-url-slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-r-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Excerpt / Brief Summary <span className="text-slate-400 font-normal">(displayed in cards and search results)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Provide a compelling 2-sentence summary outlining what buyers will learn from this article..."
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Grid for Category, Author, Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>

              {formData.category === 'Custom' && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={formData.customCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                  className="mt-2 w-full px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Author
              </label>
              <input
                type="text"
                placeholder="e.g. DDJAY Advisory Desk"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              placeholder="DDJAY, Haryana Housing, Stilt + 4, Registry, Bank Loan"
              value={formData.tagsString}
              onChange={(e) => setFormData(prev => ({ ...prev, tagsString: e.target.value }))}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            />
            {formData.tagsString && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tagsString.split(',').map(t => t.trim()).filter(Boolean).map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image Upload & URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cover Image
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or upload image"
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <label className="shrink-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploadingImage ? 'Uploading...' : 'Upload File'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {imageUploadError && (
              <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{imageUploadError}</span>
              </div>
            )}

            {formData.coverImage && (
              <div className="mt-3 relative w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 aspect-16/9 bg-slate-100">
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Publish Status Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Publication Status</p>
              <p className="text-[11px] text-slate-500">
                When checked, this article will immediately be visible on the public website.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {formData.isPublished ? 'Published' : 'Draft'}
              </span>
            </label>
          </div>
        </div>

        {/* Article Body Editor with Markdown Toolbar and Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'write'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Write Markdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
            </div>

            {/* Quick Formatting Toolbar (active when tab is 'write') */}
            {activeTab === 'write' && (
              <div className="flex items-center gap-1 flex-wrap">
                {/* Undo / Redo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Headings */}
                <button
                  type="button"
                  onClick={() => insertFormatting('h2')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs font-bold flex items-center gap-0.5"
                  title="Heading 2 (## Title)"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('h3')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs font-bold flex items-center gap-0.5"
                  title="Heading 3 (### Title)"
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Inline Formatting */}
                <button
                  type="button"
                  onClick={() => insertFormatting('bold')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs font-bold"
                  title="Bold (**text** / Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('italic')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs italic"
                  title="Italic (*text* / Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Lists & Quotes */}
                <button
                  type="button"
                  onClick={() => insertFormatting('ul')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Bullet List (- item)"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('ol')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Numbered List (1. item)"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('quote')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Blockquote (> Quote)"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Link, Code, Table, Divider */}
                <button
                  type="button"
                  onClick={() => insertFormatting('link')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Insert Link ([title](url))"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('code')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Code (`code`)"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('table')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Insert Markdown Table"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('hr')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs"
                  title="Horizontal Divider (---)"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Editor Body */}
          <div className="p-4">
            {activeTab === 'write' ? (
              <div>
                <textarea
                  id="blog-content-area"
                  required
                  rows={20}
                  placeholder="## Start writing your article here in Markdown...&#10;&#10;Explain the Haryana government notification, plot dimensions, bank loan criteria, or site advantages.&#10;&#10;Use Enter to create new paragraphs or lines. Select text and click toolbar buttons to format instantly."
                  value={formData.content}
                  onChange={handleContentChange}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 text-xs sm:text-sm font-mono bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white leading-relaxed whitespace-pre-wrap"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mt-2">
                  <p>
                    Supports full Markdown: <span className="font-semibold text-slate-600">## H2</span>, <span className="font-semibold text-slate-600">### H3</span>, <span className="font-semibold text-slate-600">**bold**</span>, <span className="font-semibold text-slate-600">- lists</span>, <span className="font-semibold text-slate-600">&gt; quotes</span>, <span className="font-semibold text-slate-600">[links](url)</span>, and tables.
                  </p>
                  <p className="text-slate-500">
                    Shortcuts: <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">Ctrl+Z</kbd> Undo, <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">Ctrl+Y</kbd> Redo, <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">Tab</kbd> Indent
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[400px] p-6 sm:p-8 bg-white rounded-lg border border-slate-100">
                {formData.content ? (
                  <MarkdownRenderer content={formData.content} />
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-12">
                    No content written yet. Switch back to Write tab to compose your article.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/blogs"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditMode ? 'Save Changes' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
};
