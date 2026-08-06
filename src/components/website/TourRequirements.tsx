import React from 'react';

const TourRequirements = () => {
  return (
    <section className="my-8 p-6 bg-white rounded-sm shadow-sm border border-gray-100">
      
      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
        <span className="w-8 h-1 bg-jvto-orange block"></span>
        Ijen Crater Access &amp; Health Screening
      </h2>

      <p className="mb-6 text-gray-600">
        Kawah Ijen sits inside a BBKSDA-managed conservation zone. A health certificate is
        mandatory for every guest before crater entry, per BBKSDA Surat Edaran SE.1658/KSA.9/2024.
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full text-left text-sm">
          <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Attribute (Category)
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Value (Requirement)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">
                Entry Document
              </td>
              <td className="px-6 py-4 text-gray-700">
                <strong>Health certificate — mandatory</strong><br />
                <span className="text-xs text-gray-500">
                  Required for every guest under BBKSDA SE.1658/KSA.9/2024. JVTO coordinates the clinic
                  workflow with Dr. Ahmad Irwandanu (Klinik Bakti Husada, Bondowoso) — nothing for you to
                  arrange separately.
                </span>
              </td>
            </tr>

            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">
                Safety Gear
              </td>
              <td className="px-6 py-4 text-gray-700">
                <strong>Professional Gas Mask</strong><br />
                <span className="text-xs text-gray-500">
                  Provided by JVTO for sulfur fume protection on the crater hike.
                </span>
              </td>
            </tr>

            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">
                Age Limit
              </td>
              <td className="px-6 py-4 text-gray-700">
                <strong>10 – 60 Years Old</strong><br />
                <span className="text-xs text-gray-500">
                  Strict regulation. ID card required for verification.
                </span>
              </td>
            </tr>

            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">
                Start Time
              </td>
              <td className="px-6 py-4 text-gray-700">
                <strong>00:00 AM – 01:00 AM</strong><br />
                <span className="text-xs text-gray-500">
                  To catch the Blue Fire phenomenon before sunrise. Visibility depends on sulfur gas concentration and temperatures above 360°C and is not guaranteed.
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FAQ SECTION */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-xl font-bold mb-6 text-slate-900">
          Frequently Asked Questions about Ijen Requirements
        </h3>

        <div className="space-y-4">
          <details className="group rounded-sm border border-gray-200 p-4">
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
              Do I need a health certificate for Ijen?
              <span className="transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Yes. A recent local health certificate is mandatory for every guest under BBKSDA Surat
              Edaran SE.1658/KSA.9/2024. JVTO coordinates the clinic workflow — conducted by licensed
              medical staff (Dr. Ahmad Irwandanu, SIP) — so there is nothing for you to arrange
              separately. The certificate is checked at the crater access gate; without a
              valid health certificate, the crater zone is not accessible that day.
            </p>
          </details>

          <details className="group rounded-sm border border-gray-200 p-4">
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
              Can children hike Ijen Crater?
              <span className="transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              No. Children under <strong>10 years old</strong> are not permitted into the Ijen crater zone
              under BBKSDA safety guidance, primarily due to sulfur gas exposure risk.
            </p>
          </details>
        </div>
      </div>

    </section>
  );
};

export default TourRequirements;
