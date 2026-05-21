import { ChevronDown, MoreHorizontal, MapPin, Link2 } from "lucide-react";

interface Company {
  id: string;
  name: string;
  address: string;
  website: string;
  logoColor: string;
  logoTextColor: string;
  logoLetter: string;
  logoType?: "letter" | "microsoft";
}

interface Column {
  id: string;
  title: string;
  companies: Company[];
}

const columns: Column[] = [
  {
    id: "to-contact",
    title: "To contact",
    companies: [
      {
        id: "google",
        name: "Google",
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
        website: "google.com",
        logoColor: "#F3F4F6",
        logoTextColor: "#111827",
        logoLetter: "G",
      },
      {
        id: "lvmh",
        name: "LVMH",
        address: "22 Avenue Montaigne, 75008 Paris, France",
        website: "lvmh.com",
        logoColor: "#111827",
        logoTextColor: "#FFFFFF",
        logoLetter: "L",
      },
      {
        id: "microsoft",
        name: "Microsoft",
        address: "1 Microsoft Way, Redmond, WA",
        website: "microsoft.com",
        logoColor: "#F3F4F6",
        logoTextColor: "#111827",
        logoLetter: "M",
        logoType: "microsoft",
      },
    ],
  },
  {
    id: "contacted",
    title: "Contacted",
    companies: [
      {
        id: "disney",
        name: "Disney",
        address: "500 S Buena Vista St, Burbank, CA",
        website: "disney.com",
        logoColor: "#113CCF",
        logoTextColor: "#FFFFFF",
        logoLetter: "D",
      },
      {
        id: "tesla",
        name: "Tesla",
        address: "1 Tesla Rd, Austin, TX",
        website: "tesla.com",
        logoColor: "#EF4444",
        logoTextColor: "#FFFFFF",
        logoLetter: "T",
      },
      {
        id: "nvidia",
        name: "NVIDIA",
        address: "2788 San Tomas Expy, Santa Clara, CA",
        website: "nvidia.com",
        logoColor: "#65A30D",
        logoTextColor: "#FFFFFF",
        logoLetter: "N",
      },
    ],
  },
  {
    id: "offer-sent",
    title: "Offer sent",
    companies: [
      {
        id: "sequoia",
        name: "Sequoia",
        address: "2800 Sand Hill Rd, Menlo Park, CA",
        website: "sequoiacap.com",
        logoColor: "#84CC16",
        logoTextColor: "#FFFFFF",
        logoLetter: "S",
      },
      {
        id: "amazon",
        name: "Amazon",
        address: "410 Terry Ave N, Seattle, WA",
        website: "amazon.com",
        logoColor: "#1F2937",
        logoTextColor: "#FFFFFF",
        logoLetter: "A",
      },
    ],
  },
];

function MicrosoftLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21" className="block">
      <rect x="0" y="0" width="10" height="10" fill="#F25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function CompanyLogo({ company }: { company: Company }) {
  if (company.logoType === "microsoft") {
    return (
      <div
        className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: company.logoColor }}
      >
        <MicrosoftLogo />
      </div>
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 font-bold text-lg"
      style={{
        backgroundColor: company.logoColor,
        color: company.logoTextColor,
      }}
    >
      {company.logoLetter}
    </div>
  );
}

export default function PipelineBoard() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Pipeline</h1>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {columns.map((column) => (
            <div key={column.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {column.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {column.companies.length}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {column.companies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 pr-5 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <CompanyLogo company={company} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span className="text-sm truncate">
                            {company.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
                          <Link2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span className="text-sm truncate">
                            {company.website}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
