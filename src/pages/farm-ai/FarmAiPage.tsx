import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Bot,
  Send,
  AlertTriangle,
  Leaf,
  Bug,
  CloudSun,
  TestTube,
  Recycle,
  ShieldCheck,
  Loader2,
  Trash2,
  BookOpen,
  Sprout,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useFarmData } from '../../contexts/FarmContext';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Phase 8 - Farm AI Assistant
 *
 * Design principle honoured here: the assistant NEVER invents agricultural
 * instructions (dosages, spray intervals, waiting periods). It only explains
 * and contextualises information taken from a curated, source-attributed
 * advisory library, and always shows the source it is based on.
 */

export type AdvisoryTopic =
  | 'organic-certification'
  | 'soil-health'
  | 'compost'
  | 'pest-ipm'
  | 'botanical'
  | 'water'
  | 'weather'
  | 'nutrition'
  | 'post-harvest';

export interface AdvisorySource {
  name: string;
  url: string;
}

export interface AdvisoryEntry {
  topic: AdvisoryTopic;
  title: string;
  keywords: string[];
  guidance: string[];
  sources: AdvisorySource[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  title?: string;
  lines: string[];
  sources?: AdvisorySource[];
  groundedOnFarmData?: boolean;
  timestamp: Date;
}

const TOPIC_ICONS: Record<AdvisoryTopic, React.ReactNode> = {
  'organic-certification': <ShieldCheck className="w-4 h-4" />,
  'soil-health': <TestTube className="w-4 h-4" />,
  compost: <Recycle className="w-4 h-4" />,
  'pest-ipm': <Bug className="w-4 h-4" />,
  botanical: <Leaf className="w-4 h-4" />,
  water: <CloudSun className="w-4 h-4" />,
  weather: <CloudSun className="w-4 h-4" />,
  nutrition: <Sprout className="w-4 h-4" />,
  'post-harvest': <BookOpen className="w-4 h-4" />,
};

const ADVISORY_LIBRARY: AdvisoryEntry[] = [
  {
    topic: 'organic-certification',
    title: 'Organic Certification & Conversion (NPOP)',
    keywords: ['certif', 'npop', 'conversion', 'apeda', 'organic status', 'label', 'traceab'],
    guidance: [
      'Conversion period under NPOP: annual crops generally require 2 years of organic management before the harvest can be sold as organic, and perennial crops (including plantation crops such as arecanut, coconut and coffee) generally require 3 years.',
      'Keep ledgers for every input applied, every activity performed and every harvest lot - the internal record system is what the certification body audits.',
      'Maintain a buffer zone / demarcation between certified and non-certified parcels to avoid drift and contamination.',
      'Use only inputs permitted under the NPOP annexures. Inputs not on the permitted list must be cleared with your certification body before use.',
      'An "in-conversion" label can be used only after the certification body issues that status in writing.',
    ],
    sources: [
      { name: 'APEDA - National Programme for Organic Production (NPOP)', url: 'https://apeda.gov.in/organic' },
      { name: 'NPOP Organic Production Standards & Annexures', url: 'https://apeda.gov.in/organic/npop-standards' },
    ],
  },
  {
    topic: 'soil-health',
    title: 'Soil Health & Organic Matter Building',
    keywords: ['soil', 'organic carbon', 'organic matter', 'fym', 'green manure', 'ph', 'acidity', 'soil health card'],
    guidance: [
      'Get a soil test at least once per season and track organic carbon, pH, electrical conductivity and available N-P-K.',
      'Organic carbon below about 0.5% indicates a depleted soil; concentrate on continuous organic matter addition rather than a one-off dose.',
      'Incorporate green manure crops (for example sunhemp or daincha) before flowering to add biomass and fix nitrogen.',
      'For acidic soils typical of laterite belts, apply lime / rock phosphate only as per the soil test recommendation.',
      'Avoid burning residues - convert them into compost or mulch, which also conserves soil moisture.',
    ],
    sources: [
      { name: 'ICAR - Soil Health & Nutrient Management Advisory', url: 'https://icar.org.in' },
      { name: 'Soil Health Card Scheme (Dept. of Agriculture & Farmers Welfare)', url: 'https://soilhealth.dac.gov.in' },
    ],
  },
  {
    topic: 'compost',
    title: 'Compost & Vermicompost Preparation',
    keywords: ['compost', 'vermicompost', 'manure', 'earthworm', 'decompos', 'curing', 'residue'],
    guidance: [
      'Maintain the C:N ratio of the heap close to 25-30:1 by mixing carbon-rich residues with nitrogen-rich material such as animal dung or green biomass.',
      'Turn the heap periodically and keep moisture at the "squeeze test" level - a handful should feel like a damp sponge without dripping.',
      'Vermicompost beds need shade and a temperature that stays comfortable for the worms; excess heat or waterlogging will kill the population.',
      'Compost is mature / cured when it is dark, crumbly, has an earthy smell and the pile no longer heats up on turning.',
      'Apply finished compost to the root zone and incorporate it lightly; the leachate can be used as a liquid feed after dilution.',
    ],
    sources: [
      { name: 'TNAU Agritech Portal - Organic Farming: Composting', url: 'https://agritech.tnau.ac.in/org_farm/orgfarm_composting.html' },
      { name: 'ICAR - Organic Waste Recycling & Compost Technology', url: 'https://icar.org.in' },
    ],
  },
  {
    topic: 'pest-ipm',
    title: 'Pest Monitoring & Integrated Pest Management',
    keywords: ['pest', 'ipm', 'insect', 'disease', 'borer', 'bug', 'trap', 'monitor', 'infest', 'caterpillar', 'aphid'],
    guidance: [
      'Correct identification comes first - a wrong diagnosis wastes the whole season. Record the pest, the crop, the growth stage and the extent of the damage.',
      'Scout at fixed intervals (weekly is a good starting cadence) and use pheromone / yellow sticky / light traps for early detection instead of reacting to an outbreak.',
      'Build the IPM pyramid in order: cultural practices, mechanical and physical controls, biological control, botanicals, and only then permitted chemical options as the last resort.',
      'Conserve and release natural enemies (predators and parasitoids); avoid broad-spectrum sprays that destroy them.',
      'For any approved chemical option, the dose, waiting period and safety interval must be read from the approved label - this assistant will never invent them.',
    ],
    sources: [
      { name: 'NIPHM - Integrated Pest Management Packages', url: 'https://niphm.gov.in' },
      { name: 'ICAR-NCIPM - Crop-wise IPM Practices', url: 'https://ncipm.icar.gov.in' },
    ],
  },
  {
    topic: 'botanical',
    title: 'Botanical & Biological Inputs',
    keywords: ['neem', 'botanical', 'biopesticide', 'biofertilizer', 'trichoderma', 'pseudomonas', 'rhizobium', 'azotobacter', 'biological', 'consortia'],
    guidance: [
      'Botanical preparations (neem kernel / leaf extracts, garlic-chilli preparations) act mainly as repellents and growth disruptors - use them preventively and rotate them.',
      'Biofertiliser consortia (Rhizobium for legumes, Azotobacter / Azospirillum for non-legumes, PSB for phosphorus) must be kept out of direct sunlight and applied to moist soil.',
      'Bio-control agents such as Trichoderma and Pseudomonas work best when applied to the root zone early, before the pathogen establishes.',
      'Never tank-mix a biological agent with a chemical pesticide - it will be killed.',
      'Record the batch number, source and application date of every biological input; this is required for organic audits.',
    ],
    sources: [
      { name: 'ICAR - Biofertilisers & Biopesticides in Organic Farming', url: 'https://icar.org.in' },
      { name: 'TNAU Agritech Portal - Biological Control', url: 'https://agritech.tnau.ac.in/crop_protection/crop_prot_biocontrol.html' },
    ],
  },
  {
    topic: 'water',
    title: 'Water Management & Irrigation',
    keywords: ['water', 'irrigat', 'drip', 'mulch', 'moisture', 'drought', 'rainwater', 'water test', 'salinity', 'saline'],
    guidance: [
      'Match irrigation frequency to the crop growth stage - the critical stages (flowering, pod / fruit filling) tolerate stress the least.',
      'Drip irrigation with mulch gives a substantially higher water-use efficiency than flood irrigation and keeps the root zone evenly moist.',
      'Test the irrigation water source at least once a year for pH, EC / salinity and hardness; saline water needs leaching and drainage planning.',
      'Mulching with crop residue reduces surface evaporation and suppresses weeds - a double benefit for organic systems.',
      'Harvest rainwater into farm ponds or farm bunds and reuse it for critical-stage irrigation.',
    ],
    sources: [
      { name: 'ICAR - Micro-irrigation & Water Management', url: 'https://icar.org.in' },
      { name: 'TNAU Agritech Portal - Irrigation Methods', url: 'https://agritech.tnau.ac.in/agriculture/agri_irrigationmethods.html' },
    ],
  },
  {
    topic: 'weather',
    title: 'Weather-Based Farm Advisories',
    keywords: ['weather', 'rain', 'temperature', 'monsoon', 'humidity', 'forecast', 'wind', 'spray', 'climate'],
    guidance: [
      'Do not spray or dust when rain is expected within the next few hours - the material will wash off and become a wasted input.',
      'Wind speeds are usually lowest in the early morning and late evening, which is also the safer window for spraying.',
      'When daytime temperatures are very high, shift irrigation to early morning or evening to cut evaporative losses and avoid root stress.',
      'High humidity after rain favours fungal disease build-up - scout more frequently during these windows.',
      'Use the Weather Intelligence module for the live forecast of your farm location before planning field operations.',
    ],
    sources: [
      { name: 'India Meteorological Department - Agromet Advisory Services', url: 'https://mausam.imd.gov.in' },
      { name: 'IMD District-wise Weather Forecast', url: 'https://city.imd.gov.in' },
    ],
  },
  {
    topic: 'nutrition',
    title: 'Crop Nutrition in Organic Systems',
    keywords: ['nutrition', 'nutrient', 'nitrogen', 'phosphorus', 'potassium', 'deficien', 'yellow', 'fertilizer', 'fertiliser', 'micronutrient'],
    guidance: [
      'Deficiency symptoms are the starting point - leaf colour, the position of the symptom (old vs new leaves) and the growth pattern indicate which nutrient is limiting.',
      'Combine sources: bulky organic manures for the base, enriched compost / vermicompost for the active root zone, and biofertilisers for nutrient mobilisation.',
      'Green manuring and legume rotation are the cheapest nitrogen strategies in an organic system.',
      'Split the nutrient supply across the season instead of a single heavy application, so it stays in step with crop demand.',
      'Confirm with a soil test before corrective applications; do not act on symptom guessing alone.',
    ],
    sources: [
      { name: 'ICAR - Nutrient Management in Organic Farming', url: 'https://icar.org.in' },
      { name: 'TNAU Agritech Portal - Organic Nutrient Management', url: 'https://agritech.tnau.ac.in/org_farm/orgfarm_nutrientmanagement.html' },
    ],
  },
  {
    topic: 'post-harvest',
    title: 'Post-Harvest Handling & Market Readiness',
    keywords: ['post harvest', 'harvest', 'store', 'storag', 'grading', 'drying', 'market', 'price', 'mandi', 'packing', 'value addition', 'sell'],
    guidance: [
      'Grade and sort immediately after harvest; primary grading is the cheapest way to raise the realised price.',
      'For plantation crops such as arecanut and pepper, dry down to the safe moisture level before storage to prevent mould and quality loss.',
      'Clean, dry, ventilated storage with proper stacking prevents pest build-up without chemicals.',
      'Keep the harvest lot identifiable (lot number, date, field) so it can be linked back to field records during certification.',
      'Track mandi prices in the Market Prices module before planning dispatch, since arrivals drive short-term price swings.',
    ],
    sources: [
      { name: 'Agmarknet - Agricultural Marketing Information Network', url: 'https://agmarknet.gov.in' },
      { name: 'ICAR-CIPHET - Post Harvest Technology', url: 'https://ciphet.icar.gov.in' },
    ],
  },
];

const DEFAULT_GUIDANCE: string[] = [
  'I am your Farm AI Assistant. I explain and contextualise verified agricultural information - I never invent dosages, spray intervals or safety periods.',
  'I can help with organic certification and conversion, soil health, compost and vermicompost, pest monitoring and IPM, botanical and biological inputs, water and irrigation, weather-based advisories, organic crop nutrition, and post-harvest handling.',
  'Ask a question in your own words, or pick one of the suggested topics. Every answer I give cites the source it is based on.',
];

/**
 * Scores each advisory entry against the farmer's question using that entry's
 * keyword list and returns the best match, or null when nothing is relevant.
 */
const matchAdvisory = (query: string): AdvisoryEntry | null => {
  const lower = query.toLowerCase();
  // Match against the query as typed and against a hyphen-normalised copy, so
  // that "post-harvest" and "post harvest" both resolve to the same topic.
  const normalised = `${lower} ${lower.replace(/-/g, ' ')}`;
  let best: AdvisoryEntry | null = null;
  let bestScore = 0;

  for (const entry of ADVISORY_LIBRARY) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalised.includes(keyword)) {
        score += keyword.length > 4 ? 2 : 1;
      }
    }
    if (normalised.includes(entry.topic.replace(/-/g, ' '))) {
      score += 3;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
};

let messageCounter = 0;
const nextMessageId = (prefix: string) => {
  messageCounter += 1;
  return `${prefix}-${Date.now()}-${messageCounter}`;
};

const SUGGESTED_QUESTIONS: string[] = [
  'What records do I need for NPOP organic certification?',
  'How do I improve low soil organic carbon?',
  'My compost heap is not heating up, what should I check?',
  'Older leaves in my crop are turning yellow',
  'How often should I irrigate with drip?',
  'How do I dry and store my harvest safely?',
];

export const FarmAiPage: React.FC = () => {
  const { profile } = useAuth();
  const {
    farms,
    crops,
    activities,
    soilTests,
    waterTests,
    farmWaste,
    compostBatches,
    selectedFarm,
  } = useFarmData();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      title: 'Namaste! I am your Farm AI Assistant',
      lines: DEFAULT_GUIDANCE,
      sources: [],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const activeCrops = crops.filter((c) => c.status === 'active');
  const wasteKg = farmWaste.reduce((sum, w) => sum + (Number(w.quantity) || 0), 0);
  const activitySpend = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

  const farmContextLines: string[] = [];
  if (farms.length > 0) {
    farmContextLines.push(
      `${farms.length} farm record${farms.length > 1 ? 's' : ''} registered${selectedFarm ? ' - currently viewing "' + selectedFarm.name + '"' : ''}.`
    );
  }
  if (activeCrops.length > 0) {
    const stages = Array.from(new Set(activeCrops.map((c) => c.growth_stage)));
    farmContextLines.push(
      `${activeCrops.length} active crop cycle${activeCrops.length > 1 ? 's' : ''} at stage${stages.length > 1 ? 's' : ''}: ${stages.join(', ')}.`
    );
  }
  if (activities.length > 0) {
    farmContextLines.push(
      `${activities.length} farm activit${activities.length > 1 ? 'ies' : 'y'} logged with a total recorded cost of Rs ${activitySpend.toLocaleString()}.`
    );
  }
  if (soilTests.length > 0 || waterTests.length > 0) {
    farmContextLines.push(`${soilTests.length} soil test(s) and ${waterTests.length} water test(s) on record.`);
  }
  if (wasteKg > 0 || compostBatches.length > 0) {
    farmContextLines.push(
      `${wasteKg.toLocaleString()} kg of farm waste collected across ${compostBatches.length} compost batch(es).`
    );
  }

  const buildAnswer = (question: string): ChatMessage => {
    const match = matchAdvisory(question);
    const hasFarmData = farmContextLines.length > 0;

    if (!match) {
      return {
        id: nextMessageId('ai'),
        role: 'assistant',
        title: 'No matching advisory in the verified library yet',
        lines: [
          'I answer only from the curated advisory library, so that no agricultural instruction is ever invented. Your question did not match any topic that is currently in the library.',
          'Try rephrasing with a keyword such as certification, soil, compost, pest, neem, irrigation, weather, nutrient deficiency or post-harvest - or open the Knowledge Hub, which carries the full reference library with sources.',
        ],
        sources: [],
        groundedOnFarmData: hasFarmData,
        timestamp: new Date(),
      };
    }

    const contextNote = hasFarmData
      ? [
          `Applied to your records: ${farmContextLines.join(' ')}`,
          'Use the guidance above as a starting point, and confirm the field-level decision against your own records and your local extension officer.',
        ]
      : [
          'You have not logged farm records yet, so this answer stays general. Add at least one farm and crop cycle to get context-linked guidance.',
        ];

    return {
      id: nextMessageId('ai'),
      role: 'assistant',
      title: match.title,
      lines: [...match.guidance, ...contextNote],
      sources: match.sources,
      groundedOnFarmData: hasFarmData,
      timestamp: new Date(),
    };
  };

  const sendQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;

    setMessages((prev) => [
      ...prev,
      { id: nextMessageId('user'), role: 'user', lines: [trimmed], timestamp: new Date() },
    ]);
    setInput('');
    setThinking(true);

    const answer = buildAnswer(trimmed);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, answer]);
      setThinking(false);
    }, 450);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: nextMessageId('welcome'),
        role: 'assistant',
        title: 'Conversation cleared',
        lines: DEFAULT_GUIDANCE,
        sources: [],
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Farm AI Assistant</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Explains verified agricultural information and interprets it for your farm records
          </p>
        </div>
        <Badge variant="emerald" size="sm">Phase 8 - Grounded Answers</Badge>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-800 text-sm">How this assistant is designed to stay safe</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Answers come only from a curated advisory library built on ICAR, TNAU, NIPHM, APEDA (NPOP) and IMD
            material, and every answer displays its source. The assistant will not invent pesticide doses, application
            rates, waiting periods or safety intervals. Always confirm field-level decisions with your local extension
            officer before acting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">Farm AI</p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  {profile?.full_name ? 'Assisting ' + profile.full_name : 'Advisory library connected'}
                </p>
              </div>
            </div>
            <button
              onClick={clearConversation}
              title="Clear conversation"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[360px] max-h-[520px] bg-slate-50/40">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className="max-w-[94%] sm:max-w-[85%]">
                  {msg.role === 'user' ? (
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-sm">
                      {msg.lines[0]}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200/70 rounded-2xl rounded-bl-sm px-4 py-3 shadow-2xs">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Farm AI</span>
                        {msg.groundedOnFarmData && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap">
                            farm-aware
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto whitespace-nowrap">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {msg.title && <p className="text-sm font-bold text-slate-800 mb-2">{msg.title}</p>}

                      <div className="space-y-2">
                        {msg.lines.map((line, i) => (
                          <p key={i} className="text-[13px] leading-relaxed text-slate-600 flex gap-2">
                            <span className="text-emerald-500 shrink-0">-</span>
                            <span>{line}</span>
                          </p>
                        ))}
                      </div>

                      {(msg.sources?.length ?? 0) > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                            Sources
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(msg.sources ?? []).map((src) => (
                              <a
                                key={src.url}
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2 py-0.5 hover:bg-emerald-100 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {src.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/70 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 shadow-2xs">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-[13px] text-slate-500">Checking the advisory library...</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-3 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendQuestion(q)}
                  disabled={thinking}
                  className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about certification, soil, compost, pests, water..."
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-300"
              />
              <Button
                type="submit"
                size="md"
                icon={<Send className="w-4 h-4" />}
                loading={thinking}
                disabled={!input.trim()}
              >
                Ask
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">What I know about your farm</h3>
            </div>
            {farmContextLines.length > 0 ? (
              <ul className="space-y-2">
                {farmContextLines.map((line, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                    <span className="text-emerald-500 shrink-0">-</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                No farm records found yet. Add a farm and a crop cycle, and future answers will reference your own
                data.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/70 p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">Advisory library</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">{ADVISORY_LIBRARY.length} verified topics</p>
            <div className="space-y-1.5">
              {ADVISORY_LIBRARY.map((entry) => (
                <button
                  key={entry.topic}
                  type="button"
                  onClick={() => sendQuestion(entry.title)}
                  disabled={thinking}
                  className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-xl hover:bg-emerald-50/70 transition-colors disabled:opacity-50 cursor-pointer group"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100">
                    {TOPIC_ICONS[entry.topic]}
                  </span>
                  <span className="text-xs font-medium text-slate-700 leading-tight">{entry.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/70 p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">Scope of this assistant</h3>
          <Badge variant="slate" size="sm">Grounded, cited, no guessing</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {[
            'Explains certification, soil, compost, pest, water, weather, nutrition and post-harvest topics in plain language.',
            'Interprets the answer against the farm, crop, activity, soil / water test and waste records you have already logged.',
            'Always lists the institutional source behind the answer, so it can be verified independently.',
            'Never issues pesticide doses, spray intervals or waiting periods - those must always come from the approved label.',
          ].map((item) => (
            <p key={item} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
              <span className="text-emerald-500 shrink-0">-</span>
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};












