"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "@/components/cms/DataTable";
import { FormField, CmsForm } from "@/components/cms/CmsForm";

interface Blog {
  id: BigInt;
  title: string;
  slug: string;
  excerpt: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function BlogManager() {
  const [data, setData] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<BigInt | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: {},
    cover_image: null,
    category_id: null,
    is_published: false,
    lang: "en",
  });

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/blogs?page=${page}&limit=10`);
      const result = await res.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleEdit = (row: Blog) => {
    setEditingId(row.id);
    setFormData({
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: {},
      cover_image: null,
      category_id: null,
      is_published: row.is_published,
      lang: "en",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (row: Blog) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try {
      await fetch(`/api/cms/blogs?id=${row.id}`, { method: "DELETE" });
      fetchData(pagination.page);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      await fetch("/api/cms/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: {},
        cover_image: null,
        category_id: null,
        is_published: false,
        lang: "en",
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
          <h2 className="text-xl font-semibold text-slate-50">Blog Posts</h2>
          <p className="text-sm text-slate-400">
            Manage your blog articles and content
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              slug: "",
              excerpt: "",
              content: {},
              cover_image: null,
              category_id: null,
              is_published: false,
              lang: "en",
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
        <Search className="h-4 w-4 text-slate-600" />
        <input
          placeholder="Search posts..."
          className="bg-transparent outline-none flex-1 text-slate-100 placeholder:text-slate-600"
        />
      </div>

      {/* Table */}
      <DataTable<Blog>
        columns={[
          { key: "title", label: "Title", width: "35%" },
          { key: "slug", label: "Slug", width: "25%" },
          {
            key: "is_published",
            label: "Status",
            render: (value) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  value
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-700/50 text-slate-400"
                }`}
              >
                {value ? "Published" : "Draft"}
              </span>
            ),
          },
          {
            key: "created_at",
            label: "Created",
            render: (value) => new Date(value).toLocaleDateString(),
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
          title={editingId ? "Edit Blog Post" : "New Blog Post"}
          onClose={() => {
            setIsFormOpen(false);
            setEditingId(null);
          }}
          onSubmit={handleSubmit}
        >
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(value) =>
              setFormData({ ...formData, title: value })
            }
            required
          />
          <FormField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(value) =>
              setFormData({ ...formData, slug: value })
            }
            placeholder="blog-post-title"
            required
          />
          <FormField
            label="Excerpt"
            name="excerpt"
            type="textarea"
            rows={3}
            value={formData.excerpt}
            onChange={(value) =>
              setFormData({ ...formData, excerpt: value })
            }
            placeholder="Short summary of the post..."
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) =>
                setFormData({ ...formData, is_published: e.target.checked })
              }
              className="rounded"
            />
            <label htmlFor="is_published" className="text-sm text-slate-300">
              Publish this post
            </label>
          </div>
        </CmsForm>
      )}
    </section>
  );
}
