import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  MapPin,
  CheckCircle2,
  EyeOff,
  AlertCircle,
  Building2
} from 'lucide-react';
import { api } from '../services/api.js';
import { Site, Location } from '../types.js';

export const AdminSitesListPage: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sitesData, locsData] = await Promise.all([
        api.getAdminSites(),
        api.getAdminLocations(),
      ]);
      setSites(sitesData);
      setLocations(locsData);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = async (site: Site) => {
    try {
      await api.updateSite(site.id, { isPublished: !site.isPublished });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update publish status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteSite(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === 'all' || site.locationId === selectedLocation;
    const matchesCategory =
      selectedCategory === 'all' || site.siteType === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || site.status === selectedStatus;

    return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            M3M Project & Portfolio Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage 34 flagship M3M developments across Residential, Retail, Office, and Serviced Apartments.
          </p>
        </div>

        <Link
          to="/admin/sites/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-xs transition-colors self-start sm:self-auto border border-amber-500/20"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Add New Project</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name or corridor address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Retail">Retail</option>
            <option value="Office">Office</option>
            <option value="Serviced Apartments">Serviced Apartments</option>
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Corridors</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold / Leased</option>
            <option value="Unavailable">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading projects...</div>
        ) : filteredSites.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700">No Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No developments match your criteria. Add a new project or adjust filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Corridor</th>
                  <th className="py-3.5 px-4">Configurations</th>
                  <th className="py-3.5 px-4">Starting Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSites.map((site) => {
                  const coverImg =
                    site.images?.find((i) => i.isCover)?.imageUrl ||
                    site.images?.[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';

                  const categoryColor =
                    site.siteType === 'Residential'
                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                      : site.siteType === 'Retail'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                      : site.siteType === 'Office'
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : 'bg-purple-100 text-purple-900 border-purple-200';

                  return (
                    <tr key={site.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Photo & Site */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coverImg}
                            alt={site.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <Link
                              to={`/admin/sites/${site.id}/edit`}
                              className="font-bold text-slate-900 hover:text-amber-600 text-sm block"
                            >
                              {site.name}
                            </Link>
                            <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                              {site.address}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${categoryColor}`}>
                          {site.siteType || 'Residential'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          {site.location?.name || '—'}
                        </span>
                      </td>

                      {/* Units count */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="font-semibold">{site.plotSizes?.length || 0}</span> typologies
                      </td>

                      {/* Starting Price */}
                      <td className="py-3.5 px-4 font-bold text-amber-700">
                        {site.startingPrice || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            site.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : site.status === 'Sold'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {site.status}
                        </span>
                      </td>

                      {/* Published status button toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(site)}
                          title="Click to toggle publish status"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                            site.isPublished
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {site.isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-amber-700" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/sites/${site.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Public Site"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to={`/admin/sites/${site.id}/edit`}
                            title="Edit Project Details"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 font-semibold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(site.id, site.name)}
                            title="Delete Project"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
