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

type OperatingHours = {
  Monday?: string;
  Tuesday?: string;
  Wednesday?: string;
  Thursday?: string;
  Friday?: string;
  Saturday?: string;
  Sunday?: string;
};

type OfficeAddress = {
  street?: string;
  city?: string;
  operating_hours?: OperatingHours;
};

type AssociationMembership = {
  name: string;
  asset_url?: string;
};

type Founder = {
  name?: string;
  known_as?: string;
  full_name?: string;
  role_in_JVTO?: string;
  status_dinas?: string;
  public_mission_statement?: string;
  social_role?: string;
  asset_url?: string;
};
type ValuePropositions = {
  safety_leadership?: string;
  transparency?: string;
  inclusivity?: string;
  social_impact?: string;
};

type BrandPositioning = {
  founding_mission?: string;
  slogans?: string[];
  value_propositions?: ValuePropositions;
  differentiators?: string[];
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
  association_memberships: AssociationMembership[];
  org_schema_json_ld: any;

  office_address?: OfficeAddress | null;
  google_business_profile_url?: string | null;
  founder?: Founder | null;
  brand_positioning?: BrandPositioning | null;

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

  const [sloganInput, setSloganInput] = useState("");
  const [diffInput, setDiffInput] = useState("");

  const [regForm, setRegForm] = useState<RegistrationId>({
    label: "",
    value: "",
    document: "",
  });
  const [payForm, setPayForm] = useState<PaymentAccount>({
    label: "",
    accountDetails: "",
  });

  const [assocForm, setAssocForm] = useState<AssociationMembership>({
    name: "",
    asset_url: "",
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

      const raw: any = await res.json();

      const normalizedAssoc: AssociationMembership[] = Array.isArray(
        raw.association_memberships
      )
        ? raw.association_memberships.map((a: any) =>
            typeof a === "string"
              ? { name: a }
              : {
                  name: a?.name ?? "",
                  asset_url: a?.asset_url ?? "",
                }
          )
        : [];

      const json: SiteIdentity = {
        ...raw,
        association_memberships: normalizedAssoc,
      };

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

  const updateField = (field: keyof SiteIdentity, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
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
      schema.memberOf = data.association_memberships
        .filter((a) => a.name)
        .map((a) => ({
          "@type": "Organization",
          name: a.name,
        }));
    }

    // Office address -> PostalAddress
    if (
      data.office_address &&
      (data.office_address.street || data.office_address.city)
    ) {
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: data.office_address.street,
        addressLocality: data.office_address.city,
      };
    }

    // Google Business Profile URL -> sameAs
    if (
      data.google_business_profile_url &&
      data.google_business_profile_url !== "To be confirmed"
    ) {
      const sameAs: string[] = [];
      sameAs.push(data.google_business_profile_url);
      schema.sameAs = sameAs;
    }

    // Founder info -> Person
    if (data.founder && (data.founder.name || data.founder.full_name)) {
      const founderSchema: any = {
        "@type": "Person",
        name: data.founder.full_name || data.founder.name,
        givenName: data.founder.name,
        jobTitle: data.founder.role_in_JVTO,
      };

      if (data.founder.asset_url) {
        founderSchema.image = data.founder.asset_url;
      }

      schema.founder = founderSchema;

      if (data.founder.public_mission_statement && !schema.description) {
        schema.description = data.founder.public_mission_statement;
      }
    }
    if (data.brand_positioning) {
      const bp = data.brand_positioning;

      if (bp.founding_mission && !schema.description) {
        schema.description = bp.founding_mission;
      }

      if (Array.isArray(bp.slogans) && bp.slogans.length > 0) {
        // schema.org punya property "slogan"
        schema.slogan = bp.slogans[0];
      }
    }

    return schema;
  };

  const saveData = async () => {
    if (!data) return;

    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
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
        office_address: data.office_address,
        google_business_profile_url: data.google_business_profile_url,
        founder: data.founder,
        brand_positioning: data.brand_positioning,
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

      const updated: any = await res.json();

      const normalizedAssoc: AssociationMembership[] = Array.isArray(
        updated.association_memberships
      )
        ? updated.association_memberships.map((a: any) =>
            typeof a === "string"
              ? { name: a }
              : {
                  name: a?.name ?? "",
                  asset_url: a?.asset_url ?? "",
                }
          )
        : [];

      const updatedData: SiteIdentity = {
        ...updated,
        association_memberships: normalizedAssoc,
      };

      setData(updatedData);
      setSuccessMsg("Site identity saved successfully! ✓");

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("saveData error:", err);
      setError(err.message || "Failed to save site identity");
    } finally {
      setSaving(false);
    }
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
    if (!assocForm.name.trim() || !data) return;
    updateField("association_memberships", [
      ...data.association_memberships,
      {
        name: assocForm.name.trim(),
        asset_url: assocForm.asset_url?.trim() || undefined,
      },
    ]);
    setAssocForm({ name: "", asset_url: "" });
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

          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-medium text-slate-300">
              Google Business Profile URL
            </label>
            <input
              type="url"
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={data.google_business_profile_url ?? ""}
              onChange={(e) =>
                updateField("google_business_profile_url", e.target.value)
              }
              placeholder="https://www.google.com/maps/place/..."
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
              onKeyDown={(e) => e.key === "Enter" && addEmail()}
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
              onKeyDown={(e) => e.key === "Enter" && addWA()}
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
          <ul className="space-y-2 max-h-52 overflow-y-auto">
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
          <ul className="space-y-2 max-h-52 overflow-y-auto">
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
              onKeyDown={(e) => e.key === "Enter" && addMaps()}
            />
            <button
              onClick={addMaps}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2 max-h-52 overflow-y-auto">
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
          <div className="space-y-2">
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={assocForm.name}
              onChange={(e) =>
                setAssocForm({ ...assocForm, name: e.target.value })
              }
              placeholder="Association name (e.g. ASITA, HPI, PHRI)"
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={assocForm.asset_url ?? ""}
              onChange={(e) =>
                setAssocForm({ ...assocForm, asset_url: e.target.value })
              }
              placeholder="Logo / asset URL (optional)"
            />
            <button
              onClick={addAssoc}
              className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add Association
            </button>
          </div>
          <ul className="space-y-2 max-h-52 overflow-y-auto">
            {data.association_memberships.map((a, i) => (
              <li
                key={i}
                className="text-xs bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="font-medium text-slate-100">
                      {a.name || "-"}
                    </div>
                    {a.asset_url && (
                      <a
                        href={a.asset_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-sky-400 underline break-all"
                      >
                        Asset URL
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeAssoc(i)}
                    className="text-slate-400 hover:text-red-400 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
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

      {/* Office Address & Founder */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Office Address */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Office Address
            </h3>
          </div>
          <div className="space-y-2">
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Street address"
              value={data.office_address?.street ?? ""}
              onChange={(e) =>
                updateField("office_address", {
                  ...(data.office_address ?? {}),
                  street: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="City"
              value={data.office_address?.city ?? ""}
              onChange={(e) =>
                updateField("office_address", {
                  ...(data.office_address ?? {}),
                  city: e.target.value,
                })
              }
            />
          </div>

          {/* Operating hours per day */}
          <div className="space-y-1 mt-2">
            <div className="text-[10px] font-medium text-slate-400">
              Operating Hours (per day)
            </div>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-20 text-[11px] text-slate-300">{day}</span>
                <input
                  className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-[11px] text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. 08:00–21:00"
                  value={
                    data.office_address?.operating_hours?.[
                      day as keyof OperatingHours
                    ] ?? ""
                  }
                  onChange={(e) =>
                    updateField("office_address", {
                      ...(data.office_address ?? {}),
                      operating_hours: {
                        ...(data.office_address?.operating_hours ?? {}),
                        [day]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Founder */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-100">Founder</h3>
          </div>
          <div className="space-y-2">
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Name"
              value={data.founder?.name ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  name: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Known as (public name)"
              value={data.founder?.known_as ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  known_as: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Full legal name"
              value={data.founder?.full_name ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  full_name: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Role in JVTO"
              value={data.founder?.role_in_JVTO ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  role_in_JVTO: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Status dinas"
              value={data.founder?.status_dinas ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  status_dinas: e.target.value,
                })
              }
            />
            <textarea
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
              placeholder="Public mission statement"
              value={data.founder?.public_mission_statement ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  public_mission_statement: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Social role (e.g. Pembina HPWKI)"
              value={data.founder?.social_role ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  social_role: e.target.value,
                })
              }
            />
            <input
              className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Founder asset URL (photo, etc.)"
              value={data.founder?.asset_url ?? ""}
              onChange={(e) =>
                updateField("founder", {
                  ...(data.founder ?? {}),
                  asset_url: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      {/* Brand Positioning */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-100">
            Brand Positioning
          </h2>
        </div>

        {/* Founding Mission */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Founding Mission
          </label>
          <textarea
            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
            placeholder="Why this brand was founded..."
            value={data.brand_positioning?.founding_mission ?? ""}
            onChange={(e) =>
              updateField("brand_positioning", {
                ...(data.brand_positioning ?? {}),
                founding_mission: e.target.value,
              })
            }
          />
        </div>

        {/* Slogans */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300">
              Slogans
            </label>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder='e.g. "Safety-led Java volcano tours..."'
              value={sloganInput}
              onChange={(e) => setSloganInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!sloganInput.trim()) return;
                  const current = data.brand_positioning?.slogans ?? [];
                  updateField("brand_positioning", {
                    ...(data.brand_positioning ?? {}),
                    slogans: [...current, sloganInput.trim()],
                  });
                  setSloganInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (!sloganInput.trim()) return;
                const current = data.brand_positioning?.slogans ?? [];
                updateField("brand_positioning", {
                  ...(data.brand_positioning ?? {}),
                  slogans: [...current, sloganInput.trim()],
                });
                setSloganInput("");
              }}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {(data.brand_positioning?.slogans ?? []).map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-[11px] bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5"
              >
                <span className="text-slate-200">{s}</span>
                <button
                  type="button"
                  className="text-slate-400 hover:text-red-400 text-[10px]"
                  onClick={() => {
                    const current = data.brand_positioning?.slogans ?? [];
                    updateField("brand_positioning", {
                      ...(data.brand_positioning ?? {}),
                      slogans: current.filter((_, idx) => idx !== i),
                    });
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
            {(data.brand_positioning?.slogans ?? []).length === 0 && (
              <li className="text-[11px] text-slate-500 text-center py-1.5">
                No slogans added yet
              </li>
            )}
          </ul>
        </div>

        {/* Value Propositions */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Value Propositions
          </label>
          {[
            ["safety_leadership", "Safety leadership"],
            ["transparency", "Transparency"],
            ["inclusivity", "Inclusivity"],
            ["social_impact", "Social impact"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1">
              <div className="text-[11px] text-slate-400">{label}</div>
              <input
                className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={
                  (data.brand_positioning?.value_propositions as any)?.[key] ??
                  ""
                }
                onChange={(e) =>
                  updateField("brand_positioning", {
                    ...(data.brand_positioning ?? {}),
                    value_propositions: {
                      ...(data.brand_positioning?.value_propositions ?? {}),
                      [key]: e.target.value,
                    },
                  })
                }
                placeholder={`Explain your ${label.toLowerCase()} value...`}
              />
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Differentiators
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="What makes you different?"
              value={diffInput}
              onChange={(e) => setDiffInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!diffInput.trim()) return;
                  const current = data.brand_positioning?.differentiators ?? [];
                  updateField("brand_positioning", {
                    ...(data.brand_positioning ?? {}),
                    differentiators: [...current, diffInput.trim()],
                  });
                  setDiffInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (!diffInput.trim()) return;
                const current = data.brand_positioning?.differentiators ?? [];
                updateField("brand_positioning", {
                  ...(data.brand_positioning ?? {}),
                  differentiators: [...current, diffInput.trim()],
                });
                setDiffInput("");
              }}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-xs font-semibold text-slate-950"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {(data.brand_positioning?.differentiators ?? []).map((d, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-[11px] bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5"
              >
                <span className="text-slate-200">{d}</span>
                <button
                  type="button"
                  className="text-slate-400 hover:text-red-400 text-[10px]"
                  onClick={() => {
                    const current =
                      data.brand_positioning?.differentiators ?? [];
                    updateField("brand_positioning", {
                      ...(data.brand_positioning ?? {}),
                      differentiators: current.filter((_, idx) => idx !== i),
                    });
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
            {(data.brand_positioning?.differentiators ?? []).length === 0 && (
              <li className="text-[11px] text-slate-500 text-center py-1.5">
                No differentiators added yet
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
