import React from 'react';

const TourRequirements = () => {
  return (
    <section className="my-8 p-6 bg-white rounded-sm shadow-sm border border-gray-100">
      
      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
        <span className="w-8 h-1 bg-jvto-green block"></span>
        Mandatory Requirements: Ijen Crater Tour
      </h2>

      <p className="mb-6 text-gray-600">
        To ensure safety and compliance with 2024/2025 BKSDA regulations, please review the requirements below.
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
                <strong>Health Certificate (Surat Sehat)</strong><br />
                <span className="text-xs text-gray-500">
                  Must state "Fit for hiking/physical activity". Provided by JVTO.
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
                  Provided by JVTO. Mandatory for sulfur fume protection.
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
                  To reach the summit before sunrise. Blue Fire visibility is subject to authority access policies and natural conditions, including sulfur gas levels and weather, and cannot be guaranteed.
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
              Do I really need a health certificate for Ijen?
              <span className="transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Yes, it is <strong>absolutely mandatory</strong>. You cannot purchase an entrance ticket without showing a valid health certificate obtained from a clinic or hospital on the <strong>same day of the hike</strong>.
            </p>
          </details>

          <details className="group rounded-sm border border-gray-200 p-4">
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
              Can children hike Ijen Crater?
              <span className="transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              No. Children under <strong>10 years old</strong> are strictly prohibited by BKSDA regulations due to safety concerns, especially related to sulfur gas exposure.
            </p>
          </details>
        </div>
      </div>

    </section>
  );
};

export default TourRequirements;
