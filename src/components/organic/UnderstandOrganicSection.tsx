import React, { useState } from 'react';
import {
  Leaf, Sprout, Globe, Recycle, Bug, Droplets, Sun, TreePine,
  ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';

interface SectionCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  summary: string;
  points: string[];
  source?: string;
  source_url?: string;
}

const SECTIONS: SectionCard[] = [
  {
    id: 'what-is',
    icon: <Leaf className="w-5 h-5" />,
    title: 'What is Organic Farming?',
    summary:
      'Organic farming is a production system that sustains the health of soils, ecosystems, and people. It relies on ecological processes, biodiversity, and cycles adapted to local conditions, rather than the use of synthetic inputs.',
    points: [
      'Defined by the International Federation of Organic Agriculture Movements (IFOAM) as a production system that sustains the health of soils, ecosystems, and people.',
      'In India, regulated under the National Programme for Organic Production (NPOP) by APEDA for export, and through PGS-India for domestic markets.',
      'Avoids the use of synthetic fertilisers, synthetic pesticides, sewage sludge, and genetically modified organisms.',
      'Emphasises closed nutrient cycles, biodiversity, and long-term soil health over short-term yield maximisation.',
    ],
    source: 'IFOAM Organics International — Principles of Organic Agriculture',
    source_url: 'https://www.ifoam.bio/why-organic/organic-landmarks/principles-organic',
  },
  {
    id: 'principles',
    icon: <Globe className="w-5 h-5" />,
    title: 'Four Principles of Organic Agriculture (IFOAM)',
    summary:
      'IFOAM defines four principles that ground organic farming — Health, Ecology, Fairness, and Care. These are the ethical foundation of the organic movement worldwide.',
    points: [
      'Health: Organic agriculture should sustain and enhance the health of soil, plant, animal, human, and planet as one and indivisible.',
      'Ecology: Farming must be based on living ecological systems and cycles — it works with them, emulates them, and helps sustain them.',
      'Fairness: Relationships ensure fairness regarding the common environment and life opportunities for present and future generations.',
      'Care: Organic agriculture should be managed in a precautionary and responsible manner to protect the health and well-being of current and future generations.',
    ],
    source: 'IFOAM Organics International — Principles of Organic Agriculture',
    source_url: 'https://www.ifoam.bio/why-organic/organic-landmarks/principles-organic',
  },
  {
    id: 'soil-health',
    icon: <TreePine className="w-5 h-5" />,
    title: 'Soil Health — The Foundation',
    summary:
      'Healthy soil is the cornerstone of organic farming. Soil is a living ecosystem with billions of microorganisms in every teaspoon. Organic farming practices aim to feed and protect this soil life.',
    points: [
      'Soil organic matter (SOM) is the foundation of soil health — it holds nutrients, water, and supports microbial life.',
      'Practices like composting, mulching, and green manuring build SOM over time.',
      'A diverse soil microbiome (bacteria, fungi, nematodes, protozoa) is essential for nutrient cycling and disease suppression.',
      'Earthworms are key indicators of soil biological health — their activity improves aeration, drainage, and organic matter decomposition.',
      'Repeated synthetic fertiliser use without organic matter additions can degrade SOM and reduce soil biology over time.',
    ],
    source: 'ICAR – Indian Institute of Soil Science (IISS), Bhopal',
    source_url: 'https://iiss.icar.gov.in',
  },
  {
    id: 'nutrient-management',
    icon: <Sprout className="w-5 h-5" />,
    title: 'Organic Nutrient Management',
    summary:
      'In organic systems, nutrients are supplied through biological and organic sources rather than synthetic fertilisers. The goal is to feed the soil food web, which in turn feeds the plant.',
    points: [
      'Primary nutrient sources: farmyard manure, compost, vermicompost, green manure crops, and crop residue recycling.',
      'Biological nitrogen fixation: leguminous crops and biofertilisers (Rhizobium, Azospirillum) fix atmospheric nitrogen, reducing external inputs.',
      'Phosphorus and potassium are made available through soil biological activity — PSB bacteria solubilise fixed phosphate; KMB bacteria mobilise potassium from minerals.',
      'Nutrient cycling is central — nutrients in crop residues, animal manure, and kitchen waste are returned to the soil rather than lost.',
      'Soil testing helps understand baseline nutrient status before planning inputs.',
    ],
    source: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_url: 'https://iari.res.in',
  },
  {
    id: 'pest-management',
    icon: <Bug className="w-5 h-5" />,
    title: 'Organic Pest & Disease Management',
    summary:
      'Organic pest management follows a prevention-first hierarchy. The goal is to prevent pest build-up through ecological design rather than to react with inputs after infestation.',
    points: [
      'Prevention first: healthy soil and plants are naturally more resilient to pest and disease pressure.',
      'Biodiversity and habitat: planting diverse crops, maintaining field borders, and preserving natural enemy habitat supports pest predator populations.',
      'Cultural methods: crop rotation, intercropping, and sanitation reduce host continuity for pest species.',
      'Biological controls: beneficial insects, entomopathogenic fungi, and antagonistic bacteria are used before botanical or chemical interventions.',
      'Botanical preparations (neem, garlic extract) are used as last-resort interventions before any permitted chemical application.',
      'Chemical intervention is only considered after all other methods have been evaluated, and only using permitted substances from the applicable standard\'s input list.',
    ],
    source: 'ICAR – Indian Institute of Spices Research (IISR), Calicut',
    source_url: 'https://spices.res.in',
  },
  {
    id: 'water',
    icon: <Droplets className="w-5 h-5" />,
    title: 'Water Management in Organic Systems',
    summary:
      'Organic farming reduces irrigation dependence by improving soil structure and organic matter, which increases water-holding capacity and reduces evaporation.',
    points: [
      'Higher soil organic matter increases the soil\'s water-holding capacity, reducing irrigation frequency.',
      'Mulching reduces evaporative water loss from the soil surface — important during dry seasons.',
      'Drip and micro-irrigation deliver water directly to the root zone, reducing overall water use.',
      'Water harvesting structures (farm ponds, check dams) capture rainwater for use during dry periods.',
      'Avoiding soil compaction (by limiting heavy machinery) maintains infiltration rate, reducing runoff.',
    ],
    source: 'ICAR – Central Research Institute for Dryland Agriculture (CRIDA)',
    source_url: 'https://crida.icar.gov.in',
  },
  {
    id: 'biodiversity',
    icon: <TreePine className="w-5 h-5" />,
    title: 'Biodiversity & Agroecology',
    summary:
      'Organic farming actively promotes biodiversity at field, farm, and landscape levels. A diverse farm ecosystem is more stable, more resilient, and less dependent on external inputs.',
    points: [
      'Crop diversity: growing multiple crops together (intercropping, polyculture) reduces pest and disease risk by breaking monoculture patterns.',
      'Natural enemy habitat: maintaining hedgerows, shade trees, and flowering borders supports populations of natural pest predators.',
      'Soil biodiversity: a diverse soil microbiome (bacteria, fungi, nematodes) performs multiple beneficial ecosystem functions.',
      'Reduced pesticide use protects pollinators, soil organisms, and aquatic life in and around the farm.',
      'Agroforestry integrates trees with crops and livestock to create diverse, multi-layered productive systems.',
    ],
    source: 'IFOAM Organics International — Biodiversity in Organic Systems',
    source_url: 'https://www.ifoam.bio',
  },
  {
    id: 'waste-recycling',
    icon: <Recycle className="w-5 h-5" />,
    title: 'Waste Recycling & Circular Agriculture',
    summary:
      'Organic farming aims to close nutrient loops by converting farm waste into valuable inputs — composting crop residues, animal manure, and organic household waste back into soil amendments.',
    points: [
      'Crop residues (stems, leaves, husks) are composted or used as mulch rather than burnt.',
      'Animal manure is composted and returned to fields as farmyard manure or vermicompost.',
      'Composting transforms waste materials into stable humus, reducing pathogens and weed seeds.',
      'Biogas systems can convert manure into energy, with the slurry (digestate) used as a liquid manure.',
      'Reducing farm waste lowers the external input requirement and improves farm sustainability.',
    ],
    source: 'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
    source_url: 'https://pgsindia-ncof.gov.in',
  },
  {
    id: 'composting',
    icon: <Leaf className="w-5 h-5" />,
    title: 'Composting — Converting Residues to Soil Food',
    summary:
      'Composting is the controlled aerobic decomposition of organic materials. It is one of the most practical ways to build soil organic matter and recycle farm nutrients.',
    points: [
      'Aerobic composting requires a balance of carbon-rich materials (straw, dry leaves) and nitrogen-rich materials (fresh manure, green biomass).',
      'Turning the pile periodically introduces oxygen and speeds decomposition.',
      'Maturity indicators: dark colour, earthy smell, crumbly texture, no recognisable original materials.',
      'Mature compost suppresses some soil-borne pathogens and improves soil structure.',
      'Vermicomposting uses earthworms to process organic material faster and produce a higher-quality end product.',
    ],
    source: 'ICAR – Indian Institute of Soil Science (IISS), Bhopal',
    source_url: 'https://iiss.icar.gov.in',
  },
  {
    id: 'benefits',
    icon: <Sun className="w-5 h-5" />,
    title: 'Benefits of Organic Farming',
    summary:
      'Organic farming offers documented benefits to soil health, environment, and in many cases farmer economics — alongside real challenges that must be understood honestly.',
    points: [
      'Environmental: reduced synthetic chemical load in soil, water, and food; supports biodiversity; lower greenhouse gas emissions per unit of land in many studies.',
      'Soil: documented improvement in soil organic carbon, biological activity, and water-holding capacity over time in organic systems.',
      'Economic: potentially premium market prices for certified organic produce; reduced dependence on purchased synthetic inputs once the system is established.',
      'Health: reduced exposure of farm workers to synthetic pesticides; no synthetic residues in produce from certified farms.',
      'Honest limitation: transition period (2–3 years) often involves yield reduction before the organic system reaches stability. Investment in knowledge and labour may be higher initially.',
    ],
    source: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_url: 'https://iari.res.in',
  },
  {
    id: 'limitations',
    icon: <ChevronDown className="w-5 h-5" />,
    title: 'Limitations & Honest Trade-Offs',
    summary:
      'Organic farming is not universally superior in all situations. Honest understanding of limitations helps farmers make informed decisions.',
    points: [
      'Yield gap: organic yields can be 10–30% lower than conventional in some crops and regions, especially during the conversion period.',
      'Labour: many organic practices (composting, manual weeding, biological applications) are more labour-intensive than conventional approaches.',
      'Knowledge demand: effective organic farming requires a deeper understanding of ecology, soil biology, and crop-specific management.',
      'Market dependency: premium prices are only realised if the farmer can access certified organic markets — not all regions have this infrastructure.',
      'Pest pressure: without synthetic pesticide backup, some pest events can cause significant crop loss if management systems are not in place.',
      'Not a panacea: organic farming does not automatically solve food security, poverty, or environmental problems — systemic issues require systemic solutions.',
    ],
    source: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_url: 'https://iari.res.in',
  },
  {
    id: 'transition',
    icon: <Sprout className="w-5 h-5" />,
    title: 'Transition to Organic — What to Expect',
    summary:
      'The transition from conventional to organic farming is a process, not an event. It typically takes 2–3 years for the soil biology to recover and the farm ecosystem to stabilise.',
    points: [
      'Year 1 (Conversion 1): Cessation of synthetic inputs. Intensive soil inoculation with compost, FYM, and biofertilisers. Yield may decline before the soil biology recovers.',
      'Year 2 (Conversion 2): Soil organic carbon begins to rise. Beneficial insect populations establish. Start building internal nutrient cycling (composting, green manure).',
      'Year 3+ (Full Organic): The agro-ecosystem reaches increasing stability. Dependence on external inputs decreases. Eligible to apply for organic certification after meeting CB requirements.',
      'Record keeping is critical from day one — conversion start date and input records are required by certification bodies.',
      'Transition support is available from state agriculture departments, ATMA, Krishi Vigyan Kendras, and NGOs working in organic farming.',
    ],
    source: 'APEDA – National Programme for Organic Production (NPOP)',
    source_url: 'https://apeda.gov.in/apedawebsite/organic/Organic_Products.htm',
  },
  {
    id: 'organic-vs-conventional',
    icon: <Globe className="w-5 h-5" />,
    title: 'Organic vs Conventional — Key Differences',
    summary:
      'Understanding the differences between organic and conventional farming helps in making informed management decisions. Neither system is monolithic.',
    points: [
      'Inputs: Organic uses biological and mineral inputs from approved lists; conventional allows synthetic fertilisers and registered pesticides.',
      'Soil management: Organic focuses on building SOM and biological activity; conventional often relies on soluble nutrients with less attention to biological soil health.',
      'Pest management: Organic follows a prevention-biological-botanical hierarchy; conventional typically uses synthetic pesticides as the primary tool.',
      'Certification: Organic production for market claims requires third-party certification; conventional does not.',
      'Record keeping: Organic certification requires extensive records; conventional has fewer documentation requirements (though good practice recommends records for both).',
      'Time horizon: Organic benefits compound over years as soil health improves; conventional inputs give more immediate but often less persistent results.',
    ],
    source: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_url: 'https://iari.res.in',
  },
];

export const UnderstandOrganicSection: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('what-is');

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Understand Organic Farming</h2>
        <p className="text-sm text-emerald-100 leading-relaxed max-w-3xl">
          A structured educational reference grounded in ICAR, IFOAM, and APEDA publications. This
          section covers what organic farming is, how it works, and what it genuinely involves —
          including both benefits and honest trade-offs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['ICAR', 'IFOAM', 'APEDA/NPOP', 'TNAU', 'NCOF'].map(s => (
            <span key={s} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600/60 border border-emerald-500/40 text-emerald-100">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Accordion sections */}
      <div className="space-y-2">
        {SECTIONS.map(section => {
          const isOpen = openSection === section.id;
          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{section.title}</span>
                </div>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-slate-100 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-600 leading-relaxed pt-3">
                    {section.summary}
                  </p>
                  <ul className="space-y-2">
                    {section.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                  {section.source && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>
                        <span className="font-medium">Source: </span>{section.source}
                      </span>
                      {section.source_url && (
                        <a
                          href={section.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline shrink-0 ml-3"
                        >
                          <ExternalLink className="w-3 h-3" /> Visit
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
