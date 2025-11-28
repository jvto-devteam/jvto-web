import React from 'react';

const ledgerData = [
  {
    document: 'HPWKI Membership Approval',
    type: 'Association Letter',
    number: '—',
    files: [
      { type: 'PDF', href: 'https://javavolcano-touroperator.com/legal/HPWKI-approval.pdf' },
      { type: 'PNG', href: 'https://javavolcano-touroperator.com/legal/HPWKI-approval-preview.png' },
      { type: 'WEBP', href: 'https://javavolcano-touroperator.com/legal/HPWKI-approval-preview.webp' },
    ],
    sha256: 'CA1FB1A48B550A7748D400F165899F12A356E6941AACDDE9C043427698AAF63B',
    lastVerified: '25 Oct 2025',
    verifiedDate: '2025-10-25',
  },
  {
    document: 'Business ID Number (NIB)',
    type: 'Official Registration',
    number: '1102230032918',
    files: [
      { type: 'PDF', href: 'https://javavolcano-touroperator.com/legal/NIB-1102230032918.pdf' },
      { type: 'PNG', href: 'https://javavolcano-touroperator.com/legal/NIB-1102230032918-preview.png' },
      { type: 'WEBP', href: 'https://javavolcano-touroperator.com/legal/NIB-1102230032918-preview.webp' },
    ],
    sha256: 'FA20DDE31BB75E46B061ED14CC6D003F6960C02A9A82C20D8603B0CBF6F7B1B7',
    lastVerified: '25 Oct 2025',
    verifiedDate: '2025-10-25',
  },
  {
    document: 'Tourism Business License (TDUP)',
    type: 'Official Registration',
    number: '1102230032918',
    files: [
      { type: 'PDF', href: 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918.pdf' },
      { type: 'PNG', href: 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918-preview.png' },
      { type: 'WEBP', href: 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918-preview.webp' },
    ],
    sha256: '27252D512DDFA74DE22A3E3EC10AA3DD40EF88DA3EB57349FCD2137411551EE3',
    lastVerified: '25 Oct 2025',
    verifiedDate: '2025-10-25',
  },
  {
    document: 'JVTO Operations Office',
    type: 'Premises',
    number: '—',
    files: [
      { type: 'JPG', href: 'https://javavolcano-touroperator.com/legal/office-photo.jpg' },
    ],
    sha256: '7850E39F80A5A42243982A33FC027E1D38F33BD28F7CDA56FC2E243790340A0F',
    lastVerified: '25 Oct 2025',
    verifiedDate: '2025-10-25',
  },
  {
    document: 'Police Travel Order (SPRIN-WAL-TRAVEL)',
    type: 'Police Order',
    number: '12 Feb 2024',
    files: [
      { type: 'PDF', href: 'https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.pdf' },
      { type: 'WEBP', href: 'https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp' },
    ],
    sha256: '179B061EAE558943FDCCC51D2EA3C8233A704B61F03CA3D212433F3E8D6F3BD3',
    lastVerified: '05 Nov 2025',
    verifiedDate: '2025-11-05',
  },
  {
    document: 'Tourist Police Assignment Letter (SPRIN-POLPAR)',
    type: 'Police Order',
    number: '—',
    files: [
      { type: 'PDF', href: 'https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.pdf' },
      { type: 'WEBP', href: 'https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.webp' },
    ],
    sha256: '03C8578DC22956FAA366D957BADECFE38868D4760359CD8059FB2D6B145DFEAB',
    lastVerified: '05 Nov 2025',
    verifiedDate: '2025-11-05',
  },
];


const ProofLedger: React.FC = () => {
    return (
        <section id="proof-ledger" aria-labelledby="proof-ledger-title" className="mt-14 rounded-2xl border border-ink-neutral-200 dark:border-ink-neutral-700 bg-white dark:bg-ink-primary p-6">
            <h2 id="proof-ledger-title" className="text-xl font-semibold text-ink-primary dark:text-white">Operator Proof Ledger</h2>
            <p className="mt-2 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
                All documents are provided by Java Volcano Tour Operator (PT Java Volcano Rendezvous). Hashes help you confirm file integrity.
            </p>

            <div className="mt-6 overflow-x-auto scrollbar-hide">
                <table className="min-w-full divide-y divide-ink-neutral-200 dark:divide-ink-neutral-700 text-sm">
                    <thead className="bg-ink-neutral-50 dark:bg-background-dark">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-ink-primary dark:text-white">Document</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-ink-primary dark:text-white">Type</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-ink-primary dark:text-white">Number</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-ink-primary dark:text-white">File</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-ink-primary dark:text-white">SHA-256</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-ink-primary dark:text-white">Last verified</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-neutral-200 dark:divide-ink-neutral-700">
                        {ledgerData.map((item, index) => (
                            <tr key={index} className="odd:bg-white dark:odd:bg-ink-primary even:bg-ink-neutral-50 dark:even:bg-background-dark">
                                <td className="px-4 py-3 font-medium text-ink-primary dark:text-white whitespace-nowrap">{item.document}</td>
                                <td className="px-4 py-3 text-ink-neutral-700 dark:text-ink-neutral-300 whitespace-nowrap">{item.type}</td>
                                <td className="px-4 py-3 text-ink-neutral-700 dark:text-ink-neutral-300 whitespace-nowrap">{item.number}</td>
                                <td className="px-4 py-3 text-primary whitespace-nowrap">
                                    {item.files.map((file, fileIndex) => (
                                        <React.Fragment key={file.href}>
                                            <a href={file.href} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">{file.type}</a>
                                            {fileIndex < item.files.length - 1 && ' · '}
                                        </React.Fragment>
                                    ))}
                                </td>
                                <td className="px-4 py-3">
                                    <code className="text-xs text-ink-neutral-500 bg-ink-neutral-100 dark:bg-ink-neutral-700 px-1 py-0.5 rounded break-all">{item.sha256}</code>
                                </td>
                                <td className="px-4 py-3 text-ink-neutral-700 dark:text-ink-neutral-300 whitespace-nowrap">
                                    <time dateTime={item.verifiedDate}>{item.lastVerified}</time>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <small className="block mt-4 text-xs text-ink-neutral-500">Note: “Last verified” indicates when JVTO last checked that each file on this page matches the shown SHA-256 hash.</small>
        </section>
    );
};

export default ProofLedger;
