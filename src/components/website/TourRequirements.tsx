import React from 'react';

const TourRequirements = () => {
  return (
    <section className="my-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
                        <span className="w-8 h-1 bg-lime-500 block"></span>

        Mandatory Requirements: Ijen Crater Tour
      </h2>
      <p className="mb-6 text-gray-600">
        To ensure safety and compliance with 2024/2025 BKSDA regulations, please review the requirements below.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Attribute (Category)</th>
              <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Value (Requirement)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Entry Document</td>
              <td className="px-6 py-4 text-gray-700">
                <strong>Health Certificate (Surat Sehat)</strong><br/>
                <span className="text-xs text-gray-500">Must state "Fit for hiking/physical activity". Provided by JVTO.</span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Safety Gear</td>
              <td className="px-6 py-4 text-gray-700">
                <strong>Professional Gas Mask</strong><br/>
                <span className="text-xs text-gray-500">Provided by JVTO. Mandatory for sulfur fume protection.</span>
              </td>
            </tr>
             <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Age Limit</td>
              <td className="px-6 py-4 text-gray-700">
                <strong>10 - 60 Years Old</strong><br/>
                <span className="text-xs text-gray-500">Strict regulation. ID card required for verification.</span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Start Time</td>
              <td className="px-6 py-4 text-gray-700">
                <strong>00:00 AM - 01:00 AM</strong><br/>
                <span className="text-xs text-gray-500">To catch the Blue Fire phenomenon before sunrise, please note that its appearance depends on sulfur gas concentration and high combustion temperatures above 360°C, so visibility is natural-condition dependent and not guaranteed.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TourRequirements;