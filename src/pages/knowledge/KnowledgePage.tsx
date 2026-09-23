import React, { useMemo, useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import {
  BookOpen,
  Search,
  ShieldCheck,
  Sprout,
  Bug,
  TestTube,
  Recycle,
  Package,
  ExternalLink,
  Clock,
  Library,
  FileText,
  Award,
} from 'lucide-react';

/**
 * Phase 2 (remaining scope) - Agricultural Knowledge Hub
 *
 * A curated, source-attributed reference library. It is an INFORMATION
 * DIRECTORY only - there is no cart, pricing or ordering anywhere in this
 * module, in line with the project principles.
 */

export type KnowledgeCategory =
  | 'Organic Inputs Library'
  | 'Certification'
  | 'Crop Guides'
  | 'Pest & Disease'
  | 'Soil & Water'
  | 'Compost & Waste'
  | 'Post-Harvest'
  | 'Schemes & Resources';

export interface KnowledgeSource {
  name: string;
  url: string;
}

export interface KnowledgeSection {
  heading: string;
  points: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  readMinutes: number;
  tags: string[];
  sections: KnowledgeSection[];
  sources: KnowledgeSource[];
  isReference?: boolean;
}

const CATEGORY_ICONS: Record<KnowledgeCategory, React.ReactNode> = {
  'Organic Inputs Library': <Package className="w-4 h-4" />,
  Certification: <ShieldCheck className="w-4 h-4" />,
  'Crop Guides': <Sprout className="w-4 h-4" />,
  'Pest & Disease': <Bug className="w-4 h-4" />,
  'Soil & Water': <TestTube className="w-4 h-4" />,
  'Compost & Waste': <Recycle className="w-4 h-4" />,
  'Post-Harvest': <FileText className="w-4 h-4" />,
  'Schemes & Resources': <Award className="w-4 h-4" />,
};

const ALL_CATEGORIES: KnowledgeCategory[] = [
  'Organic Inputs Library',
  'Certification',
  'Crop Guides',
  'Pest & Disease',
  'Soil & Water',
  'Compost & Waste',
  'Post-Harvest',
  'Schemes & Resources',
];

const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-organic-inputs',
    title: 'Permitted Organic Input Categories',
    category: 'Organic Inputs Library',
    summary:
      'A reference index of the input categories normally permitted in organic production, and how each category fits into a farm nutrient and protection plan.',
    readMinutes: 6,
    tags: ['manures', 'biofertilisers', 'biocontrol', 'botanicals', 'soil amendments'],
    isReference: true,
    sections: [
      {
        heading: 'Organic Manures',
        points: [
          'Farmyard manure, compost, vermicompost, green manure and crop residue based manures form the bulk nutrient source.',
          'They build soil organic carbon and improve water holding capacity in addition to supplying nutrients.',
        ],
      },
      {
        heading: 'Biofertilisers',
        points: [
          'Rhizobium for legumes; Azotobacter and Azospirillum for non-leguminous crops; phosphate solubilising bacteria for phosphorus mobilisation.',
          'Apply to moist soil and keep the culture out of direct sunlight to protect the live organisms.',
        ],
      },
      {
        heading: 'Biological / Biocontrol Inputs',
        points: [
          'Trichoderma, Pseudomonas and Bacillus based products for soil-borne disease suppression.',
          'Parasitoids and predators (for example Trichogramma cards) for field-level pest suppression.',
        ],
      },
      {
        heading: 'Botanical Inputs',
        points: [
          'Neem based preparations, garlic-chilli extracts and similar plant derived preparations used mainly as repellents and antifeedants.',
          'Rotate active materials to slow down resistance build-up.',
        ],
      },
      {
        heading: 'Soil Amendments',
        points: [
          'Lime, gypsum, rock phosphate, dolomite and biochar are typical soil amendments.',
          'Apply strictly on the basis of a soil test recommendation, never on assumption.',
        ],
      },
    ],
    sources: [
      { name: 'APEDA - NPOP Standards & Permitted Input Annexures', url: 'https://apeda.gov.in/organic' },
      { name: 'TNAU Agritech Portal - Organic Farming Inputs', url: 'https://agritech.tnau.ac.in/org_farm/orgfarm_inputs.html' },
    ],
  },
  {
    id: 'kb-npop-roadmap',
    title: 'NPOP Certification Roadmap for Smallholder Farms',
    category: 'Certification',
    summary:
      'The path from deciding to certify through documentation, inspection and issue of the certificate, including the conversion timeline.',
    readMinutes: 8,
    tags: ['npop', 'conversion', 'inspection', 'record keeping'],
    sections: [
      {
        heading: 'Step 1 - Decide and prepare',
        points: [
          'Select the parcel(s) to be certified and stop all prohibited inputs on them.',
          'Understand the conversion period: generally 2 years for annual crops and 3 years for perennial crops.',
        ],
      },
      {
        heading: 'Step 2 - Build the record system',
        points: [
          'Maintain field activity records, input purchase and application records, harvest and sales records, and a farm map.',
          'Record everything as it happens - a record written from memory at inspection time is a weak record.',
        ],
      },
      {
        heading: 'Step 3 - Apply through a certification body',
        points: [
          'Approved certification bodies operate under the NPOP framework; only a body accredited for the relevant scope can issue a certificate.',
          'Submit farm details, the farm map, the input list and the completed application.',
        ],
      },
      {
        heading: 'Step 4 - Inspection and audit',
        points: [
          'The inspector verifies records, inputs, storage and buffer zones, and may take residue samples.',
          'Maintain traceability between the field lot, the harvest lot and the sale.',
        ],
      },
      {
        heading: 'Step 5 - Certification and upkeep',
        points: [
          'Certificates are issued with scope and validity details and are subject to annual surveillance.',
          'Keep the internal control system updated so that the annual audit stays clean.',
        ],
      },
    ],
    sources: [
      { name: 'APEDA - Organic Certification Process', url: 'https://apeda.gov.in/organic' },
      { name: 'NPOP Standards (latest revision)', url: 'https://apeda.gov.in/organic/npop-standards' },
    ],
  },
  {
    id: 'kb-crop-rotation',
    title: 'Crop Rotation & Intercropping Planning',
    category: 'Crop Guides',
    summary:
      'How to sequence crops across seasons to break pest cycles, balance nutrients and keep the soil covered through the year.',
    readMinutes: 5,
    tags: ['rotation', 'intercrop', 'legumes', 'soil cover'],
    sections: [
      {
        heading: 'Why rotate',
        points: [
          'Continuous cropping of the same family builds up host-specific pests, diseases and weeds.',
          'Rotation interrupts those cycles and spreads nutrient demand across different rooting depths.',
        ],
      },
      {
        heading: 'A simple rotation rule',
        points: [
          'Follow a heavy feeder (cereal) with a legume, then a root or tuber crop, then a green manure.',
          'Avoid planting two crops of the same botanical family back to back.',
        ],
      },
      {
        heading: 'Intercropping tiers',
        points: [
          'Use a tall main crop with a short duration companion that does not compete for the same canopy space.',
          'For perennial plantations such as arecanut, coconut or coffee, keep a ground cover of legumes or cover crops between rows.',
        ],
      },
      {
        heading: 'Record what you plan',
        points: [
          'Log the planned rotation in the Crops module so that the actual sequence can be audited later.',
          'Rotation plans are a standard requirement during organic inspection.',
        ],
      },
    ],
    sources: [
      { name: 'ICAR - Cropping Systems Research', url: 'https://icar.org.in' },
      { name: 'TNAU Agritech Portal - Cropping Systems', url: 'https://agritech.tnau.ac.in/agriculture/agri_croppingsystems.html' },
    ],
  },
  {
    id: 'kb-scouting',
    title: 'Pest Scouting & Observation Records',
    category: 'Pest & Disease',
    summary:
      'A practical scouting routine plus the fields that should be captured in every pest observation record for a reliable field history.',
    readMinutes: 6,
    tags: ['scouting', 'monitoring', 'traps', 'threshold', 'records'],
    sections: [
      {
        heading: 'Build a scouting routine',
        points: [
          'Walk a fixed route on every visit and sample at several points rather than one corner of the field.',
          'Check the underside of leaves, growing points, flowers and the base of the plant.',
        ],
      },
      {
        heading: 'Use monitoring tools',
        points: [
          'Pheromone traps for moth pests, yellow sticky traps for sucking pests, and light traps where appropriate.',
          'Record trap counts over time - the trend matters more than a single count.',
        ],
      },
      {
        heading: 'What to capture in the record',
        points: [
          'Crop, variety, growth stage, date and time of observation, area inspected.',
          'Pest or disease identified, severity / incidence and the part of the plant affected.',
          'Natural enemies seen, weather conditions in the preceding days, and the action taken.',
        ],
      },
      {
        heading: 'Acting on the observation',
        points: [
          'Choose the least disruptive intervention that matches the severity.',
          'Where a chemical option is unavoidable, read the dose, waiting period and safety interval from the approved label.',
        ],
      },
    ],
    sources: [
      { name: 'NIPHM - Pest Surveillance & IPM Packages', url: 'https://niphm.gov.in' },
      { name: 'ICAR-NCIPM - Crop-wise IPM Practices', url: 'https://ncipm.icar.gov.in' },
    ],
  },
  {
    id: 'kb-soil-report',
    title: 'Reading Your Soil Test Report',
    category: 'Soil & Water',
    summary:
      'What the main parameters on a soil health card mean, what a low or high value implies, and how to convert the report into a field plan.',
    readMinutes: 7,
    tags: ['ph', 'ec', 'organic carbon', 'npk', 'micronutrients'],
    sections: [
      {
        heading: 'pH and electrical conductivity',
        points: [
          'pH indicates acidity or alkalinity; it controls how available the nutrients already in the soil are.',
          'Electrical conductivity indicates salinity. Rising EC needs drainage and salt management, not more fertiliser.',
        ],
      },
      {
        heading: 'Organic carbon',
        points: [
          'Organic carbon is the single best overall indicator of soil biological health.',
          'A low value means the priority is continuous organic matter addition over the season.',
        ],
      },
      {
        heading: 'Available N, P, K',
        points: [
          'Compare the values against the rating given on the report (low / medium / high) rather than absolute numbers alone.',
          'Nitrogen is mobile and leachable, phosphorus tends to be fixed in the soil, potassium availability is linked to soil texture.',
        ],
      },
      {
        heading: 'Micronutrients and texture',
        points: [
          'Deficiencies of zinc, boron and iron are common in intensive cropping systems.',
          'Soil texture decides irrigation frequency and how quickly amendments act.',
        ],
      },
      {
        heading: 'From report to plan',
        points: [
          'Log the test in the Soil & Water Tests module, then compare successive reports to see whether the trend is improving.',
          'Cross-check with the Knowledge Hub and your local extension officer before finalising an amendment programme.',
        ],
      },
    ],
    sources: [
      { name: 'Soil Health Card Scheme - Parameter Interpretation', url: 'https://soilhealth.dac.gov.in' },
      { name: 'ICAR - Soil Test Based Nutrient Management', url: 'https://icar.org.in' },
    ],
  },
  {
    id: 'kb-waste-to-compost',
    title: 'Farm Waste to Compost: The Conversion Chain',
    category: 'Compost & Waste',
    summary:
      'How to move crop residue and animal waste through collection, processing and curing into a finished compost that can be applied to a crop.',
    readMinutes: 6,
    tags: ['residue', 'composting', 'vermicompost', 'cycling', 'application'],
    sections: [
      {
        heading: 'Collect and segregate',
        points: [
          'Record each waste lot with its type, quantity, unit and collection date in the Waste module.',
          'Keep plastic, synthetic packaging and diseased plant material out of the compost heap.',
        ],
      },
      {
        heading: 'Process',
        points: [
          'Mix carbon-rich residue with nitrogen-rich material to reach a workable C:N balance.',
          'Maintain moisture and turn the heap to keep it aerobic; vermicomposting needs shade and stable temperature.',
        ],
      },
      {
        heading: 'Cure and assess',
        points: [
          'A mature compost is dark, crumbly, earthy smelling and no longer reheats after turning.',
          'Record the volume at start and at finish to track the conversion efficiency of your batches.',
        ],
      },
      {
        heading: 'Apply and close the loop',
        points: [
          'Note which crop received the compost and on which date, so the nutrient loop is fully traceable.',
          'Applied compost reduces dependence on purchased inputs and supports the sustainability indicators.',
        ],
      },
    ],
    sources: [
      { name: 'TNAU Agritech Portal - Composting Technologies', url: 'https://agritech.tnau.ac.in/org_farm/orgfarm_composting.html' },
      { name: 'ICAR - Recycling of Agricultural Waste', url: 'https://icar.org.in' },
    ],
  },
  {
    id: 'kb-post-harvest-storage',
    title: 'Drying, Grading and Safe Storage',
    category: 'Post-Harvest',
    summary:
      'Practical post-harvest steps for plantation and field crops - from moisture level and grading to storage hygiene and lot traceability.',
    readMinutes: 6,
    tags: ['drying', 'moisture', 'grading', 'storage', 'traceability'],
    sections: [
      {
        heading: 'Dry to the safe moisture level',
        points: [
          'Produce stored above its safe moisture level will mould, even in a clean godown.',
          'Dry on clean tarpaulins or drying floors and turn the produce regularly for even drying.',
        ],
      },
      {
        heading: 'Primary grading',
        points: [
          'Sort out damaged, immature and foreign material first; then grade on size and colour.',
          'Grading straight after harvest is the lowest cost way to improve the price you realise.',
        ],
      },
      {
        heading: 'Storage hygiene',
        points: [
          'Clean and dry the store before every new lot; stack on pallets with a gap from the walls.',
          'Use ventilated storage and inspect stored lots at regular intervals.',
        ],
      },
      {
        heading: 'Traceability',
        points: [
          'Keep a lot number with field, crop and harvest date, so any lot can be traced back to its records.',
          'Traceability is a fundamental requirement of organic certification and of buyer audits.',
        ],
      },
    ],
    sources: [
      { name: 'Agmarknet - Grading and Marketing Standards', url: 'https://agmarknet.gov.in' },
      { name: 'ICAR-CIPHET - Post Harvest Management', url: 'https://ciphet.icar.gov.in' },
    ],
  },
  {
    id: 'kb-schemes-support',
    title: 'Government Schemes & Extension Support',
    category: 'Schemes & Resources',
    summary:
      'Where to find official scheme information, organic certification support and district extension services - always from the primary government source.',
    readMinutes: 4,
    tags: ['schemes', 'subsidy', 'extension', 'npop', 'support'],
    sections: [
      {
        heading: 'Use the primary source only',
        points: [
          'Scheme rules, patterns of assistance and deadlines change - always read them on the official portal of the department concerned.',
          'Never rely on forwarded messages or unverified posts for eligibility or last dates.',
        ],
      },
      {
        heading: 'Organic certification support',
        points: [
          'The national programme for organic production is administered through the APEDA / NPOP framework and accredited certification bodies.',
          'Participatory Guarantee System (PGS-India) is an alternative certification route for smaller domestic market operations.',
        ],
      },
      {
        heading: 'Districts and extension',
        points: [
          'The district agriculture or horticulture office and your Krishi Vigyan Kendra are the local points of contact for advisory and scheme applications.',
        ],
      },
      {
        heading: 'Keep documentation ready',
        points: [
          'Maintain farm records, input purchase bills and test reports in one place - applications and inspections both ask for them.',
        ],
      },
    ],
    sources: [
      { name: 'APEDA - National Programme for Organic Production', url: 'https://apeda.gov.in' },
      { name: 'PGS-India - Paramparagat Krishi Vikas Yojana', url: 'https://pgsindia-ncof.gov.in' },
      { name: 'Krishi Vigyan Kendra Portal (ICAR)', url: 'https://kvk.icar.gov.in' },
    ],
  },
];

export interface ExternalResource {
  name: string;
  description: string;
  url: string;
}

const EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    name: 'ICAR - Indian Council of Agricultural Research',
    description: 'Crop-wise package of practices, advisories and research bulletins.',
    url: 'https://icar.org.in',
  },
  {
    name: 'TNAU Agritech Portal',
    description: 'Crop guides, organic farming package, composting and irrigation references.',
    url: 'https://agritech.tnau.ac.in',
  },
  {
    name: 'APEDA - National Programme for Organic Production',
    description: 'Organic standards, certification bodies and export requirements.',
    url: 'https://apeda.gov.in',
  },
  {
    name: 'PGS-India',
    description: 'Participatory Guarantee System portal for local group level certification.',
    url: 'https://pgsindia-ncof.gov.in',
  },
  {
    name: 'Agmarknet',
    description: 'Daily mandi and commodity price information across India.',
    url: 'https://agmarknet.gov.in',
  },
  {
    name: 'India Meteorological Department',
    description: 'District level weather forecast and agromet advisory services.',
    url: 'https://mausam.imd.gov.in',
  },
];

export const KnowledgePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | KnowledgeCategory>('all');
  const [readerArticle, setReaderArticle] = useState<KnowledgeArticle | null>(null);

  const totalReadMinutes = useMemo(
    () => KNOWLEDGE_ARTICLES.reduce((sum, article) => sum + article.readMinutes, 0),
    []
  );

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return KNOWLEDGE_ARTICLES.filter((article) => {
      if (activeCategory !== 'all' && article.category !== activeCategory) return false;
      if (!query) return true;

      const haystack = [
        article.title,
        article.summary,
        article.category,
        article.tags.join(' '),
        article.sections.map((section) => `${section.heading} ${section.points.join(' ')}`).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [search, activeCategory]);

  const resetFilters = () => {
    setSearch('');
    setActiveCategory('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Knowledge Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Curated, source-attributed reference material for organic and sustainable farming
          </p>
        </div>
        <Badge variant="emerald" size="sm">Phase 2 - Verified Reference Library</Badge>
      </div>

      <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/70 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-800 text-sm">Reference only - nothing is sold here</h4>
          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
            This module is an information directory. There is no cart, pricing or ordering. Content summarises
            institutional publications from ICAR, TNAU, NIPHM, APEDA (NPOP), IMD, Agmarknet, the Soil Health Card
            scheme and similar public sources, and each article lists its sources so you can verify them directly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Library className="w-5 h-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-tight">{KNOWLEDGE_ARTICLES.length}</p>
            <p className="text-[11px] text-slate-500">Reference articles</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-tight">{totalReadMinutes} min</p>
            <p className="text-[11px] text-slate-500">Total reading time</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ExternalLink className="w-5 h-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-tight">{EXTERNAL_RESOURCES.length}</p>
            <p className="text-[11px] text-slate-500">Official sources linked</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/70 p-4 space-y-3">
        <div className="flex items-center gap-2 bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, tags, headings..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            All ({KNOWLEDGE_ARTICLES.length})
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = KNOWLEDGE_ARTICLES.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                disabled={count === 0}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-3 py-1.5 border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {CATEGORY_ICONS[cat]}
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <EmptyState
          icon={<Search className="w-6 h-6" />}
          title="No matching articles"
          description="Try a different keyword or clear the filters to browse the whole library."
          actionText="Reset filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setReaderArticle(article)}
              className="text-left bg-white rounded-2xl border border-slate-200/70 p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2 py-0.5">
                  {CATEGORY_ICONS[article.category]}
                  {article.category}
                </span>
                {article.isReference && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-2 py-0.5 whitespace-nowrap">
                    Reference
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-800 leading-snug">{article.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed flex-1">{article.summary}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/70 rounded-full px-1.5 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 w-full">
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {article.readMinutes} min read
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <BookOpen className="w-3.5 h-3.5" />
                  Read
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/70 p-4">
        <div className="flex items-center gap-2 mb-1">
          <ExternalLink className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">Official sources & further reading</h3>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Always confirm current rules and recommendations on the primary source before acting on them.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXTERNAL_RESOURCES.map((res) => (
            <a
              key={res.url}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-slate-200/70 p-3 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-slate-800 leading-snug group-hover:text-emerald-800">
                  {res.name}
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5 leading-relaxed">{res.description}</span>
                <span className="block text-[10px] text-emerald-600 mt-1 truncate">
                  {res.url.replace('https://', '')}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <Modal
        isOpen={readerArticle !== null}
        onClose={() => setReaderArticle(null)}
        title={readerArticle?.title ?? ''}
        subtitle={
          readerArticle ? `${readerArticle.category} - ${readerArticle.readMinutes} min read` : undefined
        }
        maxWidth="2xl"
      >
        {readerArticle && (
          <div className="space-y-5">
            <div className="bg-emerald-50/60 rounded-xl border border-emerald-200/60 p-3">
              <p className="text-xs text-emerald-800 leading-relaxed">{readerArticle.summary}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {readerArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/70 rounded-full px-2 py-0.5"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {readerArticle.sections.map((section) => (
              <div key={section.heading}>
                <h4 className="text-sm font-bold text-slate-800 mb-2">{section.heading}</h4>
                <ul className="space-y-1.5">
                  {section.points.map((point, i) => (
                    <li key={i} className="text-[13px] text-slate-600 flex gap-2 leading-relaxed">
                      <span className="text-emerald-500 shrink-0">-</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">Sources</p>
              <div className="space-y-1.5">
                {readerArticle.sources.map((src) => (
                  <a
                    key={src.url}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{src.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};















