"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Map,
  Award,
  Loader2,
  Save,
  RefreshCw,
  Globe,
} from "lucide-react";

type RegistrationId = {
  label: string;
  value: string;
  document?: string;
};

type PaymentAccount = {
  label: string;
  accountDetails: string;
};

type SiteIdentity = {
  id: string;
  brand_name: string;
  legal_entity_name: string;
  official_website_url: string;
  official_emails: string[];
  official_whatsapp_numbers: string[];
  registration_ids: RegistrationId[];
  official_payment_accounts: PaymentAccount[];
  maps_listings: string[];
  association_memberships: string[];
  org_schema_json_ld: any;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function SiteIdentityPage() {
  const [data, setData] = useState<SiteIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Input states for adding items
  const [emailInput, setEmailInput] = useState("");
  const [waInput, setWaInput] = useState("");
  const [mapsInput, setMapsInput] = useState("");
  const [assocInput, setAssocInput] = useState("");

  const [regForm, setRegForm] = useState<RegistrationId>({
    label: "",
    value: "",
    document: "",
  });
  const [payForm, setPayForm] = useState<PaymentAccount>({
    label: "",
    accountDetails: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/site-identity", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        let msg = "Failed to load site identity";
        try {
          const errorData = await res.json();
          if (errorData?.message) msg = errorData.message;
        } catch {
          msg = `Failed to load: ${res.status} ${res.statusText}`;
        }
        throw new Error(msg);
      }

      const json: SiteIdentity = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("loadData error:", err);
      setError(err.message || "Failed to load site identity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveData = async () => {
    if (!data) return;

    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
      // Generate org schema before saving
      const orgSchema = generateOrgSchema();

      const payload = {
        brand_name: data.brand_name,
        legal_entity_name: data.legal_entity_name,
        official_website_url: data.official_website_url,
        official_emails: data.official_emails,
        official_whatsapp_numbers: data.official_whatsapp_numbers,
        registration_ids: data.registration_ids,
        official_payment_accounts: data.official_payment_accounts,
        maps_listings: data.maps_listings,
        association_memberships: data.association_memberships,
        org_schema_json_ld: orgSchema,
      };

      const res = await fetch("/api/site-identity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Failed to save site identity";
        try {
          const errorData = await res.json();
          if (errorData?.message) msg = errorData.message;
        } catch {
          msg = `Save failed: ${res.status} ${res.statusText}`;
        }
        throw new Error(msg);
      }

      const updated: SiteIdentity = await res.json();
      setData(updated);
      setSuccessMsg("Site identity saved successfully! ✓");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("saveData error:", err);
      setError(err.message || "Failed to save site identity");
    } finally {
      setSaving(false);
    }
  };

  const generateOrgSchema = () => {
    if (!data) return null;

    const schema: any = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: data.brand_name,
      legalName: data.legal_entity_name,
      url: data.official_website_url,
    };

    if (data.official_emails.length > 0) {
      schema.email = data.official_emails[0];
    }

    if (data.official_whatsapp_numbers.length > 0) {
      schema.telephone = data.official_whatsapp_numbers;
    }

    if (data.registration_ids.length > 0) {
      schema.identifier = data.registration_ids.map((r) => ({
        "@type": "PropertyValue",
        name: r.label,
        value: r.value,
      }));
    }

    if (data.maps_listings.length > 0) {
      schema.hasMap = data.maps_listings;
    }

    if (data.association_memberships.length > 0) {
      schema.memberOf = data.association_memberships.map((a) => ({
        "@type": "Organization",
        name: a,
      }));
    }

    return schema;
  };

  const updateField = (field: keyof SiteIdentity, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const addEmail = () => {
    if (!emailInput.trim() || !data) return;
    updateField("official_emails", [
      ...data.official_emails,
      emailInput.trim(),
    ]);
    setEmailInput("");
  };

  const removeEmail = (index: number) => {
    if (!data) return;
    updateField(
      "official_emails",
      data.official_emails.filter((_, i) => i !== index)
    );
  };

  const addWA = () => {
    if (!waInput.trim() || !data) return;
    updateField("official_whatsapp_numbers", [
      ...data.official_whatsapp_numbers,
      waInput.trim(),
    ]);
    setWaInput("");
  };

  const removeWA = (index: number) => {
    if (!data) return;
    updateField(
      "official_whatsapp_numbers",
      data.official_whatsapp_numbers.filter((_, i) => i !== index)
    );
  };

  const addReg = () => {
    if (!regForm.label || !regForm.value || !data) return;
    updateField("registration_ids", [...data.registration_ids, regForm]);
    setRegForm({ label: "", value: "", document: "" });
  };

  const removeReg = (index: number) => {
    if (!data) return;
    updateField(
      "registration_ids",
      data.registration_ids.filter((_, i) => i !== index)
    );
  };

  const addPay = () => {
    if (!payForm.label || !payForm.accountDetails || !data) return;
    updateField("official_payment_accounts", [
      ...data.official_payment_accounts,
      payForm,
    ]);
    setPayForm({ label: "", accountDetails: "" });
  };

  const removePay = (index: number) => {
    if (!data) return;
    updateField(
      "official_payment_accounts",
      data.official_payment_accounts.filter((_, i) => i !== index)
    );
  };

  const addMaps = () => {
    if (!mapsInput.trim() || !data) return;
    updateField("maps_listings", [...data.maps_listings, mapsInput.trim()]);
    setMapsInput("");
  };

  const removeMaps = (index: number) => {
    if (!data) return;
    updateField(
      "maps_listings",
      data.maps_listings.filter((_, i) => i !== index)
    );
  };

  const addAssoc = () => {
    if (!assocInput.trim() || !data) return;
    updateField("association_memberships", [
      ...data.association_memberships,
      assocInput.trim(),
    ]);
    setAssocInput("");
  };

  const removeAssoc = (index: number) => {
    if (!data) return;
    updateField(
      "association_memberships",
      data.association_memberships.filter((_, i) => i !== index)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-2 text-slate-400">Loading site identity...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Failed to load site identity data.</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Site Identity
            </h1>
            <p className="text-sm text-slate-400">
              Kelola identitas organisasi & data kontak resmi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 transition disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload
          </button>
          <button
            type="button"
            onClick={saveData}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium px-3 py-2 transition disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
          {successMsg}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-100">
            Basic Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Brand Name <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={data.brand_name}
              onChange={(e) => updateField("brand_name", e.target.value)}
              placeholder="JVTO / Java Volcano Tour Operator"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Legal Entity Name <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={data.legal_entity_name}
              onChange={(e) => updateField("legal_entity_name", e.target.value)}
              placeholder="PT. Contoh Pariwisata Indonesia"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-medium text-slate-300">
              Official Website URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={data.official_website_url}
              onChange={(e) =>
                updateField("official_website_url", e.target.value)
              }
              placeholder="https://yourdomain.com"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Emails */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Official Emails
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. hello@yourdomain.com"
              onKeyPress={(e) => e.key === "Enter" && addEmail()}
            />
            <button
              onClick={addEmail}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {data.official_emails.map((em, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
              >
                <span className="text-slate-200">{em}</span>
                <button
                  onClick={() => removeEmail(i)}
                  className="text-slate-400 hover:text-red-400 text-[10px]"
                >
                  Remove
                </button>
              </li>
            ))}
            {data.official_emails.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">
                No emails added yet
              </li>
            )}
          </ul>
        </div>

        {/* WhatsApp */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Official WhatsApp
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="e.g. +62 812-xxxx-xxxx"
              onKeyPress={(e) => e.key === "Enter" && addWA()}
            />
            <button
              onClick={addWA}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {data.official_whatsapp_numbers.map((wa, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
              >
                <span className="text-slate-200">{wa}</span>
                <button
                  onClick={() => removeWA(i)}
                  className="text-slate-400 hover:text-red-400 text-[10px]"
                >
                  Remove
                </button>
              </li>
            ))}
            {data.official_whatsapp_numbers.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">
                No WhatsApp numbers added yet
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Registration & Payment */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Registration IDs */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Registration IDs
            </h3>
          </div>
          <div className="space-y-2">
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Label (e.g. SIUP, TDP, NIB)"
              value={regForm.label}
              onChange={(e) =>
                setRegForm({ ...regForm, label: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Value / Number"
              value={regForm.value}
              onChange={(e) =>
                setRegForm({ ...regForm, value: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Document URL (optional)"
              value={regForm.document}
              onChange={(e) =>
                setRegForm({ ...regForm, document: e.target.value })
              }
            />
            <button
              onClick={addReg}
              className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add Registration ID
            </button>
          </div>
          <ul className="space-y-2">
            {data.registration_ids.map((r, i) => (
              <li
                key={i}
                className="text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 space-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-slate-100">{r.label}</div>
                    <div className="text-slate-400">{r.value}</div>
                    {r.document && (
                      <a
                        className="text-[10px] text-sky-400 underline"
                        href={r.document}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View document
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeReg(i)}
                    className="text-slate-400 hover:text-red-400 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {data.registration_ids.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">
                No registration IDs added yet
              </li>
            )}
          </ul>
        </div>

        {/* Payment Accounts */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Payment Accounts
            </h3>
          </div>
          <div className="space-y-2">
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Label (e.g. BCA, Mandiri, Wise)"
              value={payForm.label}
              onChange={(e) =>
                setPayForm({ ...payForm, label: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Account Details"
              value={payForm.accountDetails}
              onChange={(e) =>
                setPayForm({ ...payForm, accountDetails: e.target.value })
              }
            />
            <button
              onClick={addPay}
              className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add Payment Account
            </button>
          </div>
          <ul className="space-y-2">
            {data.official_payment_accounts.map((p, i) => (
              <li
                key={i}
                className="text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-slate-100">{p.label}</div>
                    <div className="text-slate-400">{p.accountDetails}</div>
                  </div>
                  <button
                    onClick={() => removePay(i)}
                    className="text-slate-400 hover:text-red-400 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {data.official_payment_accounts.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">
                No payment accounts added yet
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Maps & Associations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Maps Listings */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Maps Listings
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={mapsInput}
              onChange={(e) => setMapsInput(e.target.value)}
              placeholder="https://maps.google.com/..."
              onKeyPress={(e) => e.key === "Enter" && addMaps()}
            />
            <button
              onClick={addMaps}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {data.maps_listings.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
              >
                <a
                  className="text-sky-400 underline truncate flex-1"
                  href={m}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {m}
                </a>
                <button
                  onClick={() => removeMaps(i)}
                  className="ml-2 text-slate-400 hover:text-red-400 text-[10px]"
                >
                  Remove
                </button>
              </li>
            ))}
            {data.maps_listings.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">
                No maps listings added yet
              </li>
            )}
          </ul>
        </div>

        {/* Associations */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Association Memberships
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={assocInput}
              onChange={(e) => setAssocInput(e.target.value)}
              placeholder="e.g. ASITA, HPI, PHRI"
              onKeyPress={(e) => e.key === "Enter" && addAssoc()}
            />
            <button
              onClick={addAssoc}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {data.association_memberships.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
              >
                <span className="text-slate-200">{a}</span>
                <button
                  onClick={() => removeAssoc(i)}
                  className="text-slate-400 hover:text-red-400 text-[10px]"
                >
                  Remove
                </button>
              </li>
            ))}
            {data.association_memberships.length === 0 && (
              <li className="text-xs text-slate-500 text-center py-2">
                No associations added yet
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Preview Organization Schema */}
      {/* <div className="rounded-lg border border-slate-800 bg-slate-950/40 */}
    </div>
  );
}
