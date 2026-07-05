// SHA-256 forensic anchors for JVTO's verifiable legal/press documents.
//
// Single source of truth shared by:
//   - /verify-jvto/legal (renders the anchors table)
//   - /llms.txt (publishes the same hashes for AI-crawler / forensic cross-checks)
//
// Each entry: download the file at imageUrl, compute its SHA-256, and compare to
// `hash` to confirm the document has not been altered.

const BASE_URL = "https://javavolcano-touroperator.com";

export type ForensicAnchor = {
  asset: string;
  hash: string;
  imageUrl: string;
};

export const SHA256_ANCHORS: ForensicAnchor[] = [
  {
    asset: "NIB 1102230032918",
    hash: "fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7",
    imageUrl: `${BASE_URL}/legal/NIB-1102230032918-preview.png`,
  },
  {
    asset: "TDUP 1102230032918",
    hash: "27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3",
    imageUrl: `${BASE_URL}/legal/TDUP-1102230032918-preview.png`,
  },
  {
    asset: "HPWKI Approval",
    hash: "ca1fb1a48b550a7748d400f165899f12a356e6941aacdde9c043427698aaf63b",
    imageUrl: `${BASE_URL}/legal/HPWKI-approval-preview.png`,
  },
  {
    asset: "SPRIN POLPAR",
    hash: "03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab",
    imageUrl: `${BASE_URL}/legal/SPRIN-POLPAR.png`,
  },
  {
    asset: "SPRIN WAL TRAVEL 2024-02-12",
    hash: "179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3",
    imageUrl: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.png`,
  },
  {
    asset: "Press — Detik.com 2021-03-14",
    hash: "b257b75b3d2b9edebf07c9af89a6c6aa9a4e01d6a716ef3f7c4ca75deda64b77",
    imageUrl: `${BASE_URL}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png`,
  },
  {
    asset: "Press — Radar Jember 2021-03-24",
    hash: "2a60eb168274004283b2b9939ccbf5982c12a7db854fda014308a2494ee2abf4",
    imageUrl: `${BASE_URL}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png`,
  },
];
