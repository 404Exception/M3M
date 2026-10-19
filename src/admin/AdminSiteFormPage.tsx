import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Star,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Video,
  Play,
  Film
} from 'lucide-react';
import { api } from '../services/api.js';
import { Location, PlotSize, SiteImage } from '../types.js';
import { parseVideoUrl } from '../utils/video.js';

export const AdminSiteFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [siteType, setSiteType] = useState('Residential');
  const [startingPrice, setStartingPrice] = useState('');
  const [status, setStatus] = useState<'Available' | 'Sold' | 'Unavailable'>('Available');
  const [isPublished, setIsPublished] = useState(true);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [features, setFeatures] = useState(
    'Iconic Architecture by International Consultants, Triple Height Entrance Lobby, Ultra-Luxury Clubhouse & Infinity Pool, VRV Air Conditioning, Multi-tier Biometric Security, 100% Power Backup'
  );
  const [locationAdvantages, setLocationAdvantages] = useState(
    'Prime Frontage on Golf Course Extension Road / SPR / Dwarka Expressway, 2 Mins from Rapid Metro, 15 Mins from Cyber Hub, Top International Schools Nearby, 20 Mins from IGI Airport'
  );
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Images state
  const [images, setImages] = useState<
    Array<{
      id?: string;
      imageUrl: string;
      isCover: boolean;
      displayOrder: number;
    }>
  >([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Unit configurations state
  const [plotSizes, setPlotSizes] = useState<
    Array<{
      id?: string;
      plotSize: string;
      area: string;
      price: string;
      status: 'Available' | 'Sold';
    }>
  >([
    {
      plotSize: '3.5 BHK Luxury Suite',
      area: '2,450 sq.ft',
      price: '₹3.85 Cr',
      status: 'Available',
    },
    {
      plotSize: '4.5 BHK Master Residence',
      area: '3,250 sq.ft',
      price: '₹5.10 Cr',
      status: 'Available',
    },
  ]);

  // Load locations and initial site data if editing
  useEffect(() => {
    async function init() {
      try {
        const locs = await api.getAdminLocations();
        setLocations(locs);
        if (locs.length > 0 && !locationId) {
          setLocationId(locs[0].id);
        }

        if (isEditing && id) {
          const site = await api.getSiteById(id);
          setName(site.name);
          setLocationId(site.locationId);
          setAddress(site.address);
          setDescription(site.description);
          setSiteType(site.siteType || 'Residential');
          setStartingPrice(site.startingPrice || '');
          setStatus(site.status as any);
          setIsPublished(site.isPublished);
          setGoogleMapsUrl(site.googleMapsUrl || '');
          setLatitude(site.latitude ? String(site.latitude) : '');
          setLongitude(site.longitude ? String(site.longitude) : '');
          setFeatures(site.features || '');
          setLocationAdvantages(site.locationAdvantages || '');
          setVideoUrl(site.videoUrl || '');

          if (site.images) {
            setImages(
              site.images.map((img: SiteImage) => ({
                id: img.id,
                imageUrl: img.imageUrl,
                isCover: img.isCover,
                displayOrder: img.displayOrder,
              }))
            );
          } else {
            setImages([]);
          }

          if (site.plotSizes) {
            setPlotSizes(
              site.plotSizes.map((p: PlotSize) => ({
                id: p.id,
                plotSize: p.plotSize,
                area: p.area,
                price: p.price,
                status: (p.status as any) || 'Available',
              }))
            );
          } else {
            setPlotSizes([]);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setInitialLoading(false);
      }
    }
    init();
  }, [id, isEditing]);

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setImageError(null);
      setError(null);
      const res = await api.uploadImage(file);
      const isFirst = images.length === 0;
      setImages((prev) => [
        ...prev,
        {
          imageUrl: res.imageUrl,
          isCover: isFirst,
          displayOrder: prev.length,
        },
      ]);
    } catch (err: any) {
      const msg = err.message || 'Image upload failed';
      setImageError(msg);
      setError(msg);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Video Upload handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setVideoError(null);
      setError(null);
      const res = await api.uploadVideo(file);
      setVideoUrl(res.videoUrl || res.url);
      setSuccess('Video uploaded successfully!');
    } catch (err: any) {
      const msg = err.message || 'Video upload failed';
      setVideoError(msg);
      setError(msg);
    } finally {
      setUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  const handleClearVideo = () => {
    setVideoUrl('');
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = images.length === 0;
    setImages((prev) => [
      ...prev,
      {
        imageUrl: newImageUrl.trim(),
        isCover: isFirst,
        displayOrder: prev.length,
      },
    ]);
    setNewImageUrl('');
  };

  const handleSetCoverImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setImages(
      updated.map((img, idx) => ({
        ...img,
        displayOrder: idx,
      }))
    );
  };

  const handleDeleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If the deleted image was cover, set first as cover
    if (images[index]?.isCover && updated.length > 0) {
      updated[0].isCover = true;
    }
    setImages(
      updated.map((img, idx) => ({
        ...img,
        displayOrder: idx,
      }))
    );
  };

  // Unit configuration table operations
  const handleAddPlotSize = () => {
    setPlotSizes((prev) => [
      ...prev,
      {
        plotSize: '4 BHK Luxury Suite',
        area: '2,900 sq.ft',
        price: '₹4.50 Cr',
        status: 'Available',
      },
    ]);
  };

  const handleUpdatePlotSize = (
    index: number,
    field: 'plotSize' | 'area' | 'price' | 'status',
    val: string
  ) => {
    setPlotSizes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleDeletePlotSize = (index: number) => {
    setPlotSizes((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!locationId) {
      setError('Please select a valid corridor / micro-market');
      return;
    }
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        name: name.trim(),
        locationId,
        address: address.trim(),
        description: description.trim(),
        siteType: siteType.trim(),
        startingPrice: startingPrice.trim(),
        status,
        isPublished,
        googleMapsUrl: googleMapsUrl.trim(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        features: features.trim(),
        locationAdvantages: locationAdvantages.trim(),
        videoUrl: videoUrl.trim(),
        images,
        plotSizes,
      };

      if (isEditing && id) {
        const updated = await api.updateSite(id, payload as any);
        if (updated) {
          setName(updated.name);
          setLocationId(updated.locationId);
          setAddress(updated.address);
          setDescription(updated.description);
          setSiteType(updated.siteType || 'Residential');
          setStartingPrice(updated.startingPrice || '');
          setStatus(updated.status as any);
          setIsPublished(updated.isPublished);
          setGoogleMapsUrl(updated.googleMapsUrl || '');
          setLatitude(updated.latitude ? String(updated.latitude) : '');
          setLongitude(updated.longitude ? String(updated.longitude) : '');
          setFeatures(updated.features || '');
          setLocationAdvantages(updated.locationAdvantages || '');
          setVideoUrl(updated.videoUrl || '');
          setImages(
            (updated.images || []).map((img: SiteImage) => ({
              id: img.id,
              imageUrl: img.imageUrl,
              isCover: img.isCover,
              displayOrder: img.displayOrder,
            }))
          );
          setPlotSizes(
            (updated.plotSizes || []).map((p: PlotSize) => ({
              id: p.id,
              plotSize: p.plotSize,
              area: p.area,
              price: p.price,
              status: (p.status as any) || 'Available',
            }))
          );
        }
        setSuccess('Project details saved successfully!');
      } else {
        const created = await api.createSite(payload as any);
        setSuccess('Project created successfully!');
        setTimeout(() => navigate(`/admin/sites/${created.id}/edit`), 800);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-12 text-center text-slate-500">Loading site details...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/admin/sites"
              className="text-xs font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? `Edit Project: ${name || 'Project'}` : 'Add New M3M Project'}
          </h1>
          <p className="text-xs text-slate-500">
            Configure property specifications, upload high-res renders, and specify unit inventory variants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 border border-amber-500/20"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Saving...' : 'Save Project'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">1. Basic Project Information</h2>
            <p className="text-xs text-slate-500">Essential identifiers and geographical corridor</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Site Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. M3M Altitude / M3M Jewel"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Location Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Prime Corridor / Location *
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city}, {loc.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Starting Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Starting Price
              </label>
              <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. ₹2.10 Cr"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Address / Prime Frontage *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Golf Course Extension Road, Sector 65, Gurugram, Haryana"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Architectural Overview
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a comprehensive overview of the luxury project, architecture, master plan, and investor yields..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Property Specifications & Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">2. Project Category & Visibility</h2>
            <p className="text-xs text-slate-500">Category classification, status, and luxury amenities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Site Type / Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Portfolio Category
              </label>
              <select
                value={siteType}
                onChange={(e) => setSiteType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="Residential">Residential</option>
                <option value="Retail">Retail</option>
                <option value="Office">Office</option>
                <option value="Serviced Apartments">Serviced Apartments</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold / 100% Leased</option>
                <option value="Unavailable">Upcoming Launch</option>
              </select>
            </div>

            {/* Published Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Website Visibility
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  <span className="ml-3 text-xs font-bold text-slate-800">
                    {isPublished ? 'Published' : 'Draft / Hidden'}
                  </span>
                </label>
              </div>
            </div>

            {/* Amenities / Features */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Luxury Features & Amenities (Comma-separated)
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. Triple Height Entrance Lobby, Sky Lounge, 5-Tier Security, Infinity Edge Pool, High-Speed Elevators"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              {features && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {features.split(',').map((f, i) => f.trim() ? (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      ✓ {f.trim()}
                    </span>
                  ) : null)}
                </div>
              )}
            </div>

            {/* Location Advantages / Connectivity */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location Advantages & Frontage (Comma-separated)
              </label>
              <input
                type="text"
                value={locationAdvantages}
                onChange={(e) => setLocationAdvantages(e.target.value)}
                placeholder="e.g. Frontage on Golf Course Extension Road, 2 Mins from Rapid Metro, 15 Mins from Cyber Hub"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              {locationAdvantages && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {locationAdvantages.split(',').map((f, i) => f.trim() ? (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      📍 {f.trim()}
                    </span>
                  ) : null)}
                </div>
              )}
            </div>

            {/* Google Maps URL */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Maps Link
              </label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Photo Gallery Management */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-slate-900 text-base">3. Photographs & Layout Maps</h2>
              <p className="text-xs text-slate-500">
                Upload photos or paste direct URLs. Star to set as Cover Photo.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {images.length} Images Added
            </span>
          </div>

          {/* Upload and URL input */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Direct File Upload */}
            <div className="md:col-span-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
              </button>
            </div>

            <div className="md:col-span-1 text-center text-xs text-slate-400 font-bold">OR</div>

            {/* Paste URL */}
            <div className="md:col-span-7 flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (https://... or /uploads/...)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Add URL
              </button>
            </div>
          </div>

          {imageError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{imageError}</span>
            </div>
          )}

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                No photographs added yet. Upload files or paste image URLs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group rounded-xl overflow-hidden border-2 bg-slate-100 aspect-4/3 flex flex-col justify-between ${
                    img.isCover ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Cover badge */}
                  {img.isCover && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Cover</span>
                    </div>
                  )}

                  {/* Action Bar overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetCoverImage(idx)}
                        className={`text-[10px] font-bold px-2 py-1 rounded ${
                          img.isCover
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-slate-900 hover:bg-emerald-50'
                        }`}
                      >
                        Set Cover
                      </button>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'up')}
                          className="p-1 rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => handleMoveImage(idx, 'down')}
                          className="p-1 rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Project Walkthrough & Drone Video */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                <span>4. Project Walkthrough & Drone Video</span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload video files (MP4, WebM, MOV) or paste YouTube / Vimeo links for site walkthroughs.
              </p>
            </div>
            {videoUrl && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Video Attached</span>
              </span>
            )}
          </div>

          {/* Upload and URL input */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Direct File Upload */}
            <div className="md:col-span-4">
              <input
                type="file"
                ref={videoFileInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                disabled={uploadingVideo}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{uploadingVideo ? 'Uploading Video...' : 'Upload Video File'}</span>
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1">MP4, WebM, MOV (Max 100MB)</p>
            </div>

            <div className="md:col-span-1 text-center text-xs text-slate-400 font-bold">OR</div>

            {/* Paste URL */}
            <div className="md:col-span-7 flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube, Vimeo or direct video link (e.g. https://youtu.be/...)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
              {videoUrl && (
                <button
                  type="button"
                  onClick={handleClearVideo}
                  className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Remove Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {videoError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{videoError}</span>
            </div>
          )}

          {/* Video Preview */}
          {(() => {
            const parsed = parseVideoUrl(videoUrl);
            if (!parsed.isValid) {
              return (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 bg-slate-50/50">
                  <Film className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    No walkthrough video attached. Upload an MP4 video or paste a YouTube / Vimeo link.
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                    <span>Live Video Preview</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      {parsed.type}
                    </span>
                  </span>
                  <span className="text-slate-400 text-[11px] truncate max-w-xs">{videoUrl}</span>
                </div>

                <div className="relative aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-inner max-w-2xl mx-auto">
                  {parsed.type === 'youtube' || parsed.type === 'vimeo' ? (
                    <iframe
                      src={parsed.embedUrl}
                      title="Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      controls
                      controlsList="nodownload"
                      disableRemotePlayback
                      onContextMenu={(e) => e.preventDefault()}
                      playsInline
                      src={parsed.sourceUrl}
                      className="w-full h-full object-contain select-none"
                    >
                      Your browser does not support video playback.
                    </video>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Section 5: Available Unit Configurations & Inventory */}
        {/* <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-slate-900 text-base">5. Unit Configurations & Inventory</h2>
              <p className="text-xs text-slate-500">
                Specify unit typologies, super area / carpet dimensions, pricing, and availability.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPlotSize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto border border-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Unit Typology</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">Unit Configuration / Type</th>
                  <th className="py-3 px-3">Super / Carpet Area</th>
                  <th className="py-3 px-3">Price / Expected Yield</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plotSizes.map((plot, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={plot.plotSize}
                        onChange={(e) =>
                          handleUpdatePlotSize(idx, 'plotSize', e.target.value)
                        }
                        placeholder="e.g. 3.5 BHK Suite / Retail Anchor"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={plot.area}
                        onChange={(e) =>
                          handleUpdatePlotSize(idx, 'area', e.target.value)
                        }
                        placeholder="e.g. 2,450 sq.ft"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={plot.price}
                        onChange={(e) =>
                          handleUpdatePlotSize(idx, 'price', e.target.value)
                        }
                        placeholder="e.g. ₹3.85 Cr"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-amber-700 focus:ring-1 focus:ring-amber-500"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={plot.status}
                        onChange={(e) =>
                          handleUpdatePlotSize(idx, 'status', e.target.value)
                        }
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold / Leased</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeletePlotSize(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            to="/admin/sites"
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 border border-amber-500/20"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Saving...' : 'Save Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
