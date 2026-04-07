"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "@/components/cms/DataTable";
import { FormField, CmsForm } from "@/components/cms/CmsForm";

interface FAQ {
  id: BigInt;
  question: string;
  answer: string;
  sort_order: number;
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

export default function FAQManager() {
  const [data, setData] = useState<FAQ[]>([]);
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
    question: "",
    answer: "",
    sort_order: 0,
    is_published: false,
    category_id: null,
  });

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/faqs?page=${page}&limit=10`);
      const result = await res.json();
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleEdit = (row: FAQ) => {
    setEditingId(row.id);
    setFormData({
      question: row.question,
      answer: row.answer,
      sort_order: row.sort_order,
      is_published: row.is_published,
      category_id: null,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (row: FAQ) => {
    if (!confirm(`Delete this FAQ?`)) return;
    try {
      await fetch(`/api/cms/faqs?id=${row.id}`, { method: "DELETE" });
      fetchData(pagination.page);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      await fetch("/api/cms/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        question: "",
        answer: "",
        sort_order: 0,
        is_published: false,
        category_id: null,
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
          <h2 className="text-xl font-semibold text-slate-50">FAQ Items</h2>
          <p className="text-sm text-slate-400">
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              question: "",
              answer: "",
              sort_order: 0,
              is_published: false,
              category_id: null,
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          New FAQ
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
        <Search className="h-4 w-4 text-slate-600" />
        <input
          placeholder="Search FAQs..."
          className="bg-transparent outline-none flex-1 text-slate-100 placeholder:text-slate-600"
        />
      </div>

      {/* Table */}
      <DataTable<FAQ>
        columns={[
          { key: "question", label: "Question", width: "50%" },
          { key: "sort_order", label: "Order", width: "15%" },
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
            key: "updated_at",
            label: "Updated",
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
          title={editingId ? "Edit FAQ" : "New FAQ"}
          onClose={() => {
            setIsFormOpen(false);
            setEditingId(null);
          }}
          onSubmit={handleSubmit}
        >
          <FormField
            label="Question"
            name="question"
            value={formData.question}
            onChange={(value) =>
              setFormData({ ...formData, question: value })
            }
            placeholder="What is your question?"
            required
          />
          <FormField
            label="Answer"
            name="answer"
            type="textarea"
            value={formData.answer}
            onChange={(value) =>
              setFormData({ ...formData, answer: value })
            }
            placeholder="Provide a detailed answer..."
            rows={6}
            required
          />
          <FormField
            label="Display Order"
            name="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(value) =>
              setFormData({ ...formData, sort_order: parseInt(value) || 0 })
            }
          />
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
              Publish this FAQ
            </label>
          </div>
        </CmsForm>
      )}
    </section>
  );
}
