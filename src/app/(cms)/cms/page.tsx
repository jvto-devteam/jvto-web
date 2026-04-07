// app/cms/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  Newspaper,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";

interface Stats {
  pages: number;
  blogs: number;
  faqs: number;
  assets: number;
}

export default function CmsDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    blogs: 0,
    faqs: 0,
    assets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pagesRes, blogsRes, faqsRes] = await Promise.all([
          fetch("/api/cms/content?limit=1"),
          fetch("/api/cms/blogs?limit=1"),
          fetch("/api/cms/faqs?limit=1"),
        ]);

        const pagesData = await pagesRes.json();
        const blogsData = await blogsRes.json();
        const faqsData = await faqsRes.json();

        setStats({
          pages: pagesData.pagination?.total || 0,
          blogs: blogsData.pagination?.total || 0,
          faqs: faqsData.pagination?.total || 0,
          assets: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {loading ? "-" : value}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Overview</h2>
        <p className="text-sm text-slate-400">
          Ringkasan cepat konten yang kamu kelola dari CMS.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText className="h-6 w-6 text-blue-400" />}
          label="Content Pages"
          value={stats.pages}
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<Newspaper className="h-6 w-6 text-emerald-400" />}
          label="Blog Posts"
          value={stats.blogs}
          color="bg-emerald-500/10"
        />
        <StatCard
          icon={<HelpCircle className="h-6 w-6 text-purple-400" />}
          label="FAQ Items"
          value={stats.faqs}
          color="bg-purple-500/10"
        />
        <StatCard
          icon={<ImageIcon className="h-6 w-6 text-orange-400" />}
          label="Media Assets"
          value={stats.assets}
          color="bg-orange-500/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-100">Content Pages</h3>
              <p className="text-sm text-slate-400 mt-1">
                Manage website pages and routes
              </p>
              <a
                href="/cms/collections/content-pages"
                className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Go to Pages →
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Newspaper className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-100">Blog Posts</h3>
              <p className="text-sm text-slate-400 mt-1">
                Create and manage blog articles
              </p>
              <a
                href="/cms/blog"
                className="mt-3 inline-block text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Go to Blog →
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <HelpCircle className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-100">FAQ Management</h3>
              <p className="text-sm text-slate-400 mt-1">
                Organize frequently asked questions
              </p>
              <a
                href="/cms/faq"
                className="mt-3 inline-block text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Go to FAQ →
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <ImageIcon className="h-6 w-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-100">Media Assets</h3>
              <p className="text-sm text-slate-400 mt-1">
                Upload and manage images and files
              </p>
              <a
                href="/cms/assets"
                className="mt-3 inline-block text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                Go to Assets →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Tips */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-400" />
          CMS Tips
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>
              Keep content organized with consistent naming conventions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>
              Use SEO metadata for better search engine visibility
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Always preview content before publishing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Optimize images before uploading to improve performance</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
