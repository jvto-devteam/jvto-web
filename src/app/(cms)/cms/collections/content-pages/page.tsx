"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "@/components/cms/DataTable";
import { FormField, CmsForm } from "@/components/cms/CmsForm";

interface ContentPage {
  id: string;
  route: string;
  lang: string;
  is_active: boolean;
  updated_at: string;
  status: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ContentManager() {
  const [data, setData] = useState<ContentPage[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    route: "",
    lang: "en",
    is_active: true,
    seo: {},
    content: {},
  });

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/content?page=${page}&limit=10`);
      const result = await res.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleEdit = (row: ContentPage) => {
    setEditingId(row.id);
    setFormData({
      route: row.route,
      lang: row.lang,
      is_active: row.is_active,
      seo: {},
      content: {},
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (row: ContentPage) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try {
      await fetch(`/api/cms/content?id=${row.id}`, { method: "DELETE" });
      fetchData(pagination.page);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      await fetch("/api/cms/content", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        route: "",
        lang: "en",
        is_active: true,
        seo: {},
        content: {},
      });
      fetchData(pagination.page);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            Content Pages
          </h2>
          <p className="text-sm text-slate-400">
            Manage your website content pages
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              route: "",
              lang: "en",
              is_active: true,
              seo: {},
              content: {},
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          New Page
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
        <Search className="h-4 w-4 text-slate-600" />
        <input
          placeholder="Search pages..."
          className="bg-transparent outline-none flex-1 text-slate-100 placeholder:text-slate-600"
        />
      </div>

      {/* Table */}
      <DataTable<ContentPage>
        columns={[
          { 
            key: "route", 
            label: "Title", 
            width: "30%",
            render: (value) => value || "Untitled"
          },
          { key: "route", label: "Route", width: "25%" },
          { key: "lang", label: "Language", width: "15%" },
          {
            key: "is_active",
            label: "Status",
            render: (value) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  value
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-700/50 text-slate-400"
                }`}
              >
                {value ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            key: "updated_at",
            label: "Last Updated",
            render: (value) => {
              if (!value) return "-";
              const date = new Date(value);
              if (isNaN(date.getTime())) return "-";
              return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
            },
          },
        ]}
        data={data}
        loading={loading}
        rowKey="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        totalPages={pagination.pages}
        currentPage={pagination.page}
        onPageChange={(page) => fetchData(page)}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <CmsForm
          title={editingId ? "Edit Page" : "New Page"}
          onClose={() => {
            setIsFormOpen(false);
            setEditingId(null);
          }}
          onSubmit={handleSubmit}
        >
          <FormField
            label="Route"
            name="route"
            value={formData.route}
            onChange={(value) =>
              setFormData({ ...formData, route: value })
            }
            placeholder="/about"
            required
          />
          <FormField
            label="Language"
            name="lang"
            type="select"
            value={formData.lang}
            onChange={(value) =>
              setFormData({ ...formData, lang: value })
            }
          >
            <select
              value={formData.lang}
              onChange={(e) =>
                setFormData({ ...formData, lang: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
            </select>
          </FormField>
          <FormField
            label="Content (JSON)"
            name="content"
            type="textarea"
            value={typeof formData.content === 'object' ? JSON.stringify(formData.content, null, 2) : formData.content}
            onChange={(value) => {
              try {
                setFormData({ ...formData, content: JSON.parse(value) });
              } catch {
                setFormData({ ...formData, content: {} });
              }
            }}
            placeholder='{"title": "Page Title", "description": "..."}'
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm text-slate-300">
              Active
            </label>
          </div>
        </CmsForm>
      )}
    </section>
  );
}
