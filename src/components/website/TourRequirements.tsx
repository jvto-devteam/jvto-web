import React from 'react';
import type { IjenCraterRequirementsContent } from '@/lib/ecosystemContent/ijenCraterRequirements';

interface Props {
  pageContent?: Partial<IjenCraterRequirementsContent> | null;
}

// FALLBACK — exact copy of the content that used to be hardcoded here.
// Used only if ekosistem doesn't return a `pageContent` section for this component.
const FALLBACK: IjenCraterRequirementsContent = {
  heading: 'Mandatory Requirements: Ijen Crater Tour',
  intro:
    'To ensure safety and compliance with 2024/2025 BKSDA regulations, please review the requirements below.',
  tableHeaders: {
    attribute: 'Attribute (Category)',
    value: 'Value (Requirement)',
  },
  requirementsTable: [
    {
      category: 'Entry Document',
      valueStrong: 'Health Certificate (Surat Sehat)',
      note: 'Must state "Fit for hiking/physical activity". Provided by JVTO.',
    },
    {
      category: 'Safety Gear',
      valueStrong: 'Professional Gas Mask',
      note: 'Provided by JVTO. Mandatory for sulfur fume protection.',
    },
    {
      category: 'Age Limit',
      valueStrong: '10 – 60 Years Old',
      note: 'Strict regulation. ID card required for verification.',
    },
    {
      category: 'Start Time',
      valueStrong: '00:00 AM – 01:00 AM',
      note: 'To reach the summit before sunrise. Blue Fire visibility is subject to authority access policies and natural conditions, including sulfur gas levels and weather, and cannot be guaranteed.',
    },
  ],
  faqHeading: 'Frequently Asked Questions about Ijen Requirements',
  faqItems: [
    {
      question: 'Do I really need a health certificate for Ijen?',
      answerSegments: [
        { text: 'Yes, it is ' },
        { text: 'absolutely mandatory', strong: true },
        {
          text: '. You cannot purchase an entrance ticket without showing a valid health certificate obtained from a clinic or hospital on the ',
        },
        { text: 'same day of the hike', strong: true },
        { text: '.' },
      ],
    },
    {
      question: 'Can children hike Ijen Crater?',
      answerSegments: [
        { text: 'No. Children under ' },
        { text: '10 years old', strong: true },
        {
          text: ' are strictly prohibited by BKSDA regulations due to safety concerns, especially related to sulfur gas exposure.',
        },
      ],
    },
  ],
};

const TourRequirements = ({ pageContent }: Props) => {
  const pc = pageContent ?? {};
  const heading = pc.heading ?? FALLBACK.heading;
  const intro = pc.intro ?? FALLBACK.intro;
  const tableHeaders = pc.tableHeaders ?? FALLBACK.tableHeaders;
  const requirementsTable = pc.requirementsTable ?? FALLBACK.requirementsTable;
  const faqHeading = pc.faqHeading ?? FALLBACK.faqHeading;
  const faqItems = pc.faqItems ?? FALLBACK.faqItems;

  return (
    <section className="my-8 p-6 bg-white rounded-sm shadow-sm border border-gray-100">

      <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
        <span className="w-8 h-1 bg-jvto-lime block"></span>
        {heading}
      </h2>

      <p className="mb-6 text-gray-600">
        {intro}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full text-left text-sm">
          <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">
                {tableHeaders.attribute}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                {tableHeaders.value}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requirementsTable.map((row) => (
              <tr key={row.category} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {row.category}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <strong>{row.valueStrong}</strong><br />
                  <span className="text-xs text-gray-500">
                    {row.note}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ SECTION */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-xl font-bold mb-6 text-slate-900">
          {faqHeading}
        </h3>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="group rounded-sm border border-gray-200 p-4">
              <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
                {item.question}
                <span className="transition group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {item.answerSegments.map((seg, i) =>
                  seg.strong ? <strong key={i}>{seg.text}</strong> : <React.Fragment key={i}>{seg.text}</React.Fragment>
                )}
              </p>
            </details>
          ))}
        </div>
      </div>

    </section>
  );
};

export default TourRequirements;
