"use client";

import { useState } from "react";
import { useGlobalSingletonsStore } from "@/lib/globalSingletonsStore";
import type { RegistrationId, PaymentAccount } from "@/lib/globalSingletonsTypes";

export default function Page() {
  const s = useGlobalSingletonsStore();
  const [emailInput, setEmailInput] = useState("");
  const [waInput, setWaInput] = useState("");
  const [mapsInput, setMapsInput] = useState("");
  const [assocInput, setAssocInput] = useState("");

  const addEmail = () => {
    if (!emailInput.trim()) return;
    s.setOfficialEmails([...s.siteIdentity.officialEmails, emailInput.trim()]);
    setEmailInput("");
  };

  const removeFrom = (arr: string[], i: number, setter: (v: string[]) => void) => {
    const next = [...arr]; next.splice(i,1); setter(next);
  };

  const [regForm, setRegForm] = useState<RegistrationId>({ label: "", value: "", document: "" });
  const addReg = () => {
    if (!regForm.label || !regForm.value) return;
    s.addRegistrationId(regForm);
    setRegForm({ label: "", value: "", document: "" });
  };

  const [payForm, setPayForm] = useState<PaymentAccount>({ label: "", accountDetails: "" });
  const addPay = () => {
    if (!payForm.label || !payForm.accountDetails) return;
    s.addPaymentAccount(payForm);
    setPayForm({ label: "", accountDetails: "" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-3">Site Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-xs text-slate-400">Brand Name *</div>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.siteIdentity.brandName}
              onChange={(e) => s.setBrandName(e.target.value)}
              placeholder="JVTO / Java Volcano Tour Operator"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-400">Legal Entity Name *</div>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.siteIdentity.legalEntityName}
              onChange={(e) => s.setLegalEntityName(e.target.value)}
              placeholder="PT. Contoh Pariwisata Indonesia"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-slate-400">Official Website URL *</div>
            <input
              type="url"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.siteIdentity.officialWebsiteUrl}
              onChange={(e) => s.setOfficialWebsiteUrl(e.target.value)}
              placeholder="https://yourdomain.com"
            />
          </label>
        </div>
      </div>

      {/* Emails & WhatsApp */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <h3 className="text-xs font-semibold mb-3">Official Emails</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="email"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. hello@yourdomain.com"
            />
            <button onClick={addEmail} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold">
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {s.siteIdentity.officialEmails.map((em, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2">
                <span>{em}</span>
                <button onClick={() => removeFrom(s.siteIdentity.officialEmails, i, s.setOfficialEmails)} className="text-slate-400 hover:text-red-400 text-xs">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <h3 className="text-xs font-semibold mb-3">Official WhatsApp Numbers</h3>
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="e.g. +62 812-xxxx-xxxx"
            />
            <button onClick={() => {
              if (!waInput.trim()) return;
              s.setOfficialWhatsAppNumbers([...s.siteIdentity.officialWhatsAppNumbers, waInput.trim()]);
              setWaInput("");
            }} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold">
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {s.siteIdentity.officialWhatsAppNumbers.map((wa, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2">
                <span>{wa}</span>
                <button onClick={() => s.setOfficialWhatsAppNumbers(s.siteIdentity.officialWhatsAppNumbers.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-400 text-xs">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Registration IDs & Payment Accounts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <h3 className="text-xs font-semibold mb-3">Registration IDs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <input className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" placeholder="Label"
              value={regForm.label} onChange={(e) => setRegForm({ ...regForm, label: e.target.value })}/>
            <input className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" placeholder="Value"
              value={regForm.value} onChange={(e) => setRegForm({ ...regForm, value: e.target.value })}/>
            <input className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" placeholder="Document URL (optional)"
              value={regForm.document} onChange={(e) => setRegForm({ ...regForm, document: e.target.value })}/>
          </div>
          <button onClick={addReg} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold">Add</button>
          <ul className="mt-3 space-y-2">
            {s.siteIdentity.registrationIds.map((r, i) => (
              <li key={i} className="text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2 flex justify-between">
                <div>
                  <div className="font-medium">{r.label}</div>
                  <div className="text-slate-400">{r.value}</div>
                  {r.document && <a className="text-xs text-sky-400 underline" href={r.document} target="_blank">Open document</a>}
                </div>
                <button onClick={() => s.removeRegistrationId(i)} className="text-slate-400 hover:text-red-400 text-xs">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <h3 className="text-xs font-semibold mb-3">Official Payment Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <input className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" placeholder="Label (e.g. BCA, Wise)"
              value={payForm.label} onChange={(e) => setPayForm({ ...payForm, label: e.target.value })}/>
            <input className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" placeholder="Account Details"
              value={payForm.accountDetails} onChange={(e) => setPayForm({ ...payForm, accountDetails: e.target.value })}/>
          </div>
          <button onClick={addPay} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold">Add</button>
          <ul className="mt-3 space-y-2">
            {s.siteIdentity.officialPaymentAccounts.map((p, i) => (
              <li key={i} className="text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2 flex justify-between">
                <div>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-slate-400">{p.accountDetails}</div>
                </div>
                <button onClick={() => s.removePaymentAccount(i)} className="text-slate-400 hover:text-red-400 text-xs">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Maps Listings & Associations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <h3 className="text-xs font-semibold mb-3">Maps Listings (URLs)</h3>
          <div className="flex gap-2 mb-3">
            <input className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={mapsInput} onChange={(e) => setMapsInput(e.target.value)} placeholder="https://maps.google.com/...."/>
            <button onClick={() => {
              if (!mapsInput.trim()) return;
              s.setMapsListings([...s.siteIdentity.mapsListings, mapsInput.trim()]);
              setMapsInput("");
            }} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold">Add</button>
          </div>
          <ul className="space-y-2">
            {s.siteIdentity.mapsListings.map((m, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2">
                <a className="text-sky-400 underline" href={m} target="_blank">{m}</a>
                <button onClick={() => s.setMapsListings(s.siteIdentity.mapsListings.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-400 text-xs">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
          <h3 className="text-xs font-semibold mb-3">Association Memberships</h3>
          <div className="flex gap-2 mb-3">
            <input className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={assocInput} onChange={(e) => setAssocInput(e.target.value)} placeholder="e.g. ASITA, HPI, dll."/>
            <button onClick={() => {
              if (!assocInput.trim()) return;
              s.setAssociationMemberships([...s.siteIdentity.associationMemberships, assocInput.trim()]);
              setAssocInput("");
            }} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold">Add</button>
          </div>
          <ul className="space-y-2">
            {s.siteIdentity.associationMemberships.map((a, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2">
                <span>{a}</span>
                <button onClick={() => s.setAssociationMemberships(s.siteIdentity.associationMemberships.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-400 text-xs">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preview JSON-LD */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold">Organization JSON-LD (Auto / Readonly)</h3>
          <button onClick={s.recomputeOrgSchema} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px]">Regenerate</button>
        </div>
        <pre className="mt-3 text-xs bg-slate-950 border border-slate-800 rounded p-3 overflow-x-auto">
{JSON.stringify(s.siteIdentity.orgSchemaJsonLd, null, 2)}
        </pre>
      </div>
    </div>
  );
}
