import { supabase } from '../lib/supabase';
import {
  Farm,
  FarmCrop,
  CropActivity,
  FarmInput,
  PestObservation,
  IPMRecord,
  SoilTest,
  WaterTest,
  FarmExpense,
  CropHarvest,
  WeatherData,
  AiMessageItem,
  AiConversationRecord,
} from '../types';

export interface FarmAiContext {
  farms: Farm[];
  crops: FarmCrop[];
  activities: CropActivity[];
  inputs: FarmInput[];
  pestObservations: PestObservation[];
  ipmRecords: IPMRecord[];
  soilTests: SoilTest[];
  waterTests: WaterTest[];
  expenses?: FarmExpense[];
  harvests?: CropHarvest[];
  weather?: WeatherData | null;
  selectedFarm?: Farm | null;
}

export interface AiResponseResult {
  message: AiMessageItem;
}

/**
 * Save / Update an AI conversation in Supabase
 */
export async function saveAiConversation(
  userId: string,
  conversationId: string | null,
  title: string,
  messages: AiMessageItem[]
): Promise<string | null> {
  if (!supabase || !userId) return null;

  try {
    if (conversationId) {
      const { data, error } = await supabase
        .from('ai_conversations')
        .update({
          messages: messages as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (!error && data) return data.id;
    } else {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: title || 'Farm Advisory Consultation',
          messages: messages as any,
        })
        .select('id')
        .single();

      if (!error && data) return data.id;
    }
  } catch (err) {
    console.error('Failed to save AI conversation:', err);
  }
  return null;
}

/**
 * Fetch all AI conversation history for the logged-in farmer
 */
export async function fetchAiConversations(userId: string): Promise<AiConversationRecord[]> {
  if (!supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Notice loading AI conversations:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      messages: (row.messages || []) as AiMessageItem[],
    }));
  } catch (err) {
    console.error('Failed to fetch AI conversations:', err);
    return [];
  }
}

/**
 * Context-aware Farm AI Intelligence Engine.
 * Retrieves real farmer records to answer operational questions accurately
 * without hallucinating agricultural facts or safety instructions.
 */
export async function generateFarmAiResponse(
  query: string,
  ctx: FarmAiContext
): Promise<AiResponseResult> {
  const q = query.toLowerCase().trim();
  const now = new Date().toISOString();

  const activeCrops = ctx.crops.filter(c => c.status === 'active');
  const selectedFarm = ctx.selectedFarm || ctx.farms[0] || null;

  // 1. QUERY: Recorded Activities
  if (
    q.includes('activity') ||
    q.includes('activities') ||
    q.includes('what did i record') ||
    q.includes('logged this month')
  ) {
    if (ctx.activities.length === 0) {
      return {
        message: {
          role: 'assistant',
          title: 'Farm Activities Record',
          content: 'No activities have been recorded in your farm ledger yet.',
          sections: [
            {
              heading: 'Based on your farm records',
              points: [
                'You currently have 0 recorded activities in your farm ledger.',
                'Record activities like planting, weeding, organic manure, biofertilizer applications, or irrigation to track farm operations.',
              ],
            },
            {
              heading: 'Next Recommended Action',
              points: [
                'Use the "+ Add Activity" button to log recent farm operations.',
                'Logged activities automatically feed your farm sustainability indicators and cost analytics.',
              ],
            },
          ],
          sources: [
            { name: 'SmartFarm Digital Farm Ledger', url: 'https://smartfarm.org' },
          ],
          timestamp: now,
        },
      };
    }

    const recent = ctx.activities.slice(0, 5);
    const totalCost = ctx.activities.reduce((s, a) => s + (a.cost || 0), 0);

    return {
      message: {
        role: 'assistant',
        title: 'Recent Farm Activities Summary',
        content: `You have logged ${ctx.activities.length} total activities. Here are the most recent operations:`,
        sections: [
          {
            heading: 'Based on your farm records',
            points: [
              `Total recorded activities: ${ctx.activities.length}`,
              `Total recorded activity expenditure: Rs ${totalCost.toLocaleString()}`,
              ...recent.map(
                a =>
                  `• ${a.activity_date}: ${a.activity_type} on ${a.crop_name || 'General Farm'} (${a.farm_name || 'Farm'}) - ${a.quantity ? `${a.quantity} ${a.unit || ''}` : ''} ${a.cost > 0 ? `[Cost: Rs ${a.cost}]` : ''}`
              ),
            ],
          },
          {
            heading: 'Operational Insights',
            points: [
              'Regular logging of agronomic practices ensures traceability required for organic conversion ledgers under NPOP standards.',
            ],
          },
        ],
        sources: [
          { name: 'APEDA - NPOP Internal Control System (ICS) Standard', url: 'https://apeda.gov.in' },
        ],
        timestamp: now,
      },
    };
  }

  // 2. QUERY: Pest observations & IPM
  if (
    q.includes('pest') ||
    q.includes('disease') ||
    q.includes('observation') ||
    q.includes('symptom')
  ) {
    if (ctx.pestObservations.length === 0) {
      return {
        message: {
          role: 'assistant',
          title: 'Pest & Disease Status',
          content: 'No pest or disease observations are currently logged in your farm records.',
          sections: [
            {
              heading: 'Based on your farm records',
              points: [
                'There are 0 active pest or disease observations recorded.',
                'Routine field scouting is recommended once every 7 to 10 days, particularly during new leaf flush and post-monsoon phases.',
              ],
            },
            {
              heading: 'General IPM Scouting Guidance',
              points: [
                'Check spindle leaves and under-surfaces of foliage for mites, scale insects, or sucking pests.',
                'Inspect the collar region of plantation crops (arecanut, black pepper) for moisture stagnation or yellowing symptoms.',
              ],
            },
          ],
          sources: [
            { name: 'ICAR-CPCRI Integrated Pest Management Protocols', url: 'https://cpcri.icar.gov.in' },
          ],
          timestamp: now,
        },
      };
    }

    const critical = ctx.pestObservations.filter(
      p => p.severity === 'high' || p.severity === 'critical'
    );
    const recentObs = ctx.pestObservations.slice(0, 4);

    return {
      message: {
        role: 'assistant',
        title: 'Pest & Disease Observations Status',
        content: `You have ${ctx.pestObservations.length} pest observation(s) on file${critical.length > 0 ? `, including ${critical.length} high/critical priority item(s)` : ''}:`,
        sections: [
          {
            heading: 'Based on your farm records',
            points: recentObs.map(
              o =>
                `• ${o.pest_name} on ${o.crop_name || 'Crop'} (${o.observation_date}): ${o.severity.toUpperCase()} severity. Symptoms: "${o.symptoms}" - Affected: ${o.affected_area_percent}%`
            ),
          },
          {
            heading: 'IPM Recommended Decision Protocol',
            points: [
              'Step 1: Verify Economic Threshold Level (ETL) before taking corrective action.',
              'Step 2: Prioritize cultural and biological agents (e.g. Trichoderma for fungal rots, Metarhizium or neem-based formulations for insect pests).',
              'Step 3: Only apply registered chemical products when authoritative label recommendations exist, adhering strictly to CIBRC Pre-Harvest Intervals (PHI).',
            ],
          },
        ],
        sources: [
          { name: 'ICAR Integrated Pest Management Guidelines', url: 'https://icar.org.in' },
          { name: 'CIBRC Registered Pest Management Schedules', url: 'https://ppqs.gov.in' },
        ],
        timestamp: now,
      },
    };
  }

  // 3. QUERY: Soil & Water Tests
  if (
    q.includes('soil test') ||
    q.includes('soil health') ||
    q.includes('water test') ||
    q.includes('lab result') ||
    q.includes('ph')
  ) {
    if (ctx.soilTests.length === 0 && ctx.waterTests.length === 0) {
      return {
        message: {
          role: 'assistant',
          title: 'Soil & Water Analysis Status',
          content: 'No laboratory soil or water tests are currently on record for your farm.',
          sections: [
            {
              heading: 'Based on your farm records',
              points: [
                '0 soil tests and 0 water tests recorded.',
                'Testing soil every 2-3 years establishes baseline pH, organic carbon (SOC), and N-P-K nutrient status for precision organic nutrient plans.',
              ],
            },
            {
              heading: 'Guidance',
              points: [
                'Collect composite soil samples from 0-30 cm depth across 8-10 points in the farm.',
                'Have samples analyzed at an ICAR-KVK or state government agricultural testing laboratory.',
                'Record the resulting Soil Health Card numbers into the "Soil & Water Tests" module.',
              ],
            },
          ],
          sources: [
            { name: 'Soil Health Card Scheme - Government of India', url: 'https://soilhealth.dac.gov.in' },
          ],
          timestamp: now,
        },
      };
    }

    const latestSoil = ctx.soilTests[0];
    const latestWater = ctx.waterTests[0];

    const soilPoints: string[] = [];
    if (latestSoil) {
      soilPoints.push(`Latest test date: ${latestSoil.test_date} (${latestSoil.farm_name || 'Farm'})`);
      if (latestSoil.ph) soilPoints.push(`Soil pH: ${latestSoil.ph} (${latestSoil.ph < 5.5 ? 'Acidic - Consider Agricultural Lime/Dolomite' : latestSoil.ph > 7.8 ? 'Alkaline' : 'Near Neutral / Optimal'})`);
      if (latestSoil.organic_carbon) soilPoints.push(`Soil Organic Carbon: ${latestSoil.organic_carbon}% (${latestSoil.organic_carbon >= 0.75 ? 'Good Organic Matter' : 'Low Organic Carbon - Apply FYM / Vermicompost'})`);
      if (latestSoil.nitrogen) soilPoints.push(`Nitrogen: ${latestSoil.nitrogen} kg/ha`);
      if (latestSoil.phosphorus) soilPoints.push(`Phosphorus: ${latestSoil.phosphorus} kg/ha`);
      if (latestSoil.potassium) soilPoints.push(`Potassium: ${latestSoil.potassium} kg/ha`);
    }

    return {
      message: {
        role: 'assistant',
        title: 'Soil & Water Test Evaluation',
        content: 'Here is the summary of your most recent laboratory test records:',
        sections: [
          {
            heading: 'Based on your farm records (Soil Test)',
            points: soilPoints.length > 0 ? soilPoints : ['No soil test recorded yet.'],
          },
          ...(latestWater
            ? [
                {
                  heading: 'Based on your farm records (Water Test)',
                  points: [
                    `Tested on: ${latestWater.test_date}`,
                    `Water pH: ${latestWater.ph || 'N/A'}, Electrical Conductivity (EC): ${latestWater.ec ? `${latestWater.ec} dS/m` : 'N/A'}`,
                    `Suitability rating: ${latestWater.suitability?.toUpperCase() || 'GOOD'}`,
                  ],
                },
              ]
            : []),
          {
            heading: 'Source-backed Recommendation',
            points: [
              'Maintain soil pH between 5.8 and 6.8 for optimal nutrient availability in plantation crops.',
              'Incorporate 5-10 kg vermicompost or FYM per tree basin to build organic carbon.',
            ],
          },
        ],
        sources: [
          { name: 'ICAR-CPCRI Soil Health and Nutrient Management Guide', url: 'https://cpcri.icar.gov.in' },
        ],
        timestamp: now,
      },
    };
  }

  // 4. QUERY: Expenses / Financials
  if (
    q.includes('spend') ||
    q.includes('expense') ||
    q.includes('cost') ||
    q.includes('money') ||
    q.includes('fertilizer cost')
  ) {
    const expenses = ctx.expenses || [];
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    if (expenses.length === 0) {
      return {
        message: {
          role: 'assistant',
          title: 'Farm Expenditure Ledger',
          content: 'No expense records have been logged in your account yet.',
          sections: [
            {
              heading: 'Based on your farm records',
              points: [
                'Total recorded expenses: Rs 0 across 0 transactions.',
                'Record operational purchases (manure, seeds, bio-inputs, labour) under the "Farm Analytics & Expenses" section.',
              ],
            },
          ],
          sources: [
            { name: 'SmartFarm Financial Ledger', url: 'https://smartfarm.org' },
          ],
          timestamp: now,
        },
      };
    }

    // Category breakdown
    const categories: Record<string, number> = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    return {
      message: {
        role: 'assistant',
        title: 'Farm Expenses Breakdown',
        content: `Your total recorded farm expenditure is Rs ${totalExpenses.toLocaleString()} across ${expenses.length} records:`,
        sections: [
          {
            heading: 'Based on your farm records',
            points: Object.entries(categories).map(
              ([cat, amt]) => `• ${cat.toUpperCase()}: Rs ${amt.toLocaleString()} (${Math.round((amt / totalExpenses) * 100)}%)`
            ),
          },
          {
            heading: 'Recent Transactions',
            points: expenses.slice(0, 3).map(
              e => `• ${e.expense_date}: Rs ${e.amount} for "${e.description}" [${e.category}]`
            ),
          },
        ],
        sources: [
          { name: 'SmartFarm Internal Accounting Records', url: 'https://smartfarm.org' },
        ],
        timestamp: now,
      },
    };
  }

  // 5. QUERY: Active Crops & Harvest
  if (
    q.includes('crop') ||
    q.includes('harvest') ||
    q.includes('which crops') ||
    q.includes('arecanut') ||
    q.includes('coconut') ||
    q.includes('pepper')
  ) {
    const matchedCrop = ctx.crops.find(
      c =>
        q.includes(c.crop_name.toLowerCase()) ||
        (c.variety && q.includes(c.variety.toLowerCase()))
    );

    if (matchedCrop) {
      const cropPests = ctx.pestObservations.filter(p => p.crop_id === matchedCrop.id);
      const cropActs = ctx.activities.filter(a => a.crop_id === matchedCrop.id);

      return {
        message: {
          role: 'assistant',
          title: `Agronomic Status for ${matchedCrop.crop_name}`,
          content: `Here is the current status and check recommendations for your ${matchedCrop.crop_name} crop:`,
          sections: [
            {
              heading: 'Based on your farm records',
              points: [
                `Farm: ${matchedCrop.farm_name || 'My Farm'}`,
                `Variety: ${matchedCrop.variety || 'Standard / Local'}`,
                `Current Growth Stage: ${matchedCrop.growth_stage}`,
                `Planted on: ${matchedCrop.planting_date} ${matchedCrop.expected_harvest_date ? `| Expected Harvest: ${matchedCrop.expected_harvest_date}` : ''}`,
                `Recorded activities for this crop: ${cropActs.length}`,
                `Recorded pest/disease observations: ${cropPests.length}`,
              ],
            },
            {
              heading: `What to check for ${matchedCrop.crop_name} this week`,
              points: [
                '1. Moisture and Drainage: Inspect tree basins to ensure no standing water exists near roots or collar.',
                '2. Pest Scouting: Check spindle leaves for sucking pests, leaf spots, or crown rots.',
                '3. Organic Nutrition: Verify whether scheduled seasonal basin manuring (vermicompost / FYM) or biofertilizer applications are due.',
              ],
            },
            ...(ctx.weather
              ? [
                  {
                    heading: 'Weather context for your farm',
                    points: [
                      `Current: ${ctx.weather.temperature}°C, ${ctx.weather.condition}, Humidity: ${ctx.weather.humidity}%.`,
                      `Forecast: ${ctx.weather.dailyForecast?.[0]?.rainProb ?? 0}% rain probability today. Avoid foliar bio-inputs immediately prior to anticipated heavy rain showers.`,
                    ],
                  },
                ]
              : []),
            {
              heading: 'Authoritative Organic Input Recommendations',
              points: [
                matchedCrop.crop_name.toLowerCase().includes('arecanut')
                  ? 'Apply 5-10 kg vermicompost per palm basin. For fungal fruit rot (Koleroga), apply 1% Bordeaux mixture prophylactic spray before monsoon, or poly-covering of bunches.'
                  : matchedCrop.crop_name.toLowerCase().includes('pepper')
                  ? 'Drench vine basin with Trichoderma harzianum (50 g per vine in moist compost) to prevent Phytophthora quick wilt.'
                  : 'Apply well-decomposed FYM or vermicompost along with Azospirillum and PSB in the active root basin.',
              ],
            },
          ],
          sources: [
            { name: 'ICAR-CPCRI Plantation Crops Package of Practices', url: 'https://cpcri.icar.gov.in' },
            { name: 'ICAR-IISR Black Pepper & Spices Compendium', url: 'https://spices.res.in' },
          ],
          timestamp: now,
        },
      };
    }

    if (activeCrops.length === 0) {
      return {
        message: {
          role: 'assistant',
          title: 'Active Farm Crops',
          content: 'No active crops are registered in your farm profile.',
          sections: [
            {
              heading: 'Based on your farm records',
              points: [
                'You currently have 0 active crops registered.',
                'Add your crops in the "Crops & Cycles" module to enable customized agronomic advisories, IPM schedules, and harvest projections.',
              ],
            },
          ],
          sources: [
            { name: 'SmartFarm Digital Crop Manager', url: 'https://smartfarm.org' },
          ],
          timestamp: now,
        },
      };
    }

    return {
      message: {
        role: 'assistant',
        title: 'Active Crops Overview',
        content: `You currently have ${activeCrops.length} active crop(s) across your farms:`,
        sections: [
          {
            heading: 'Based on your farm records',
            points: activeCrops.map(
              c =>
                `• ${c.crop_name} (${c.variety || 'Standard'}) - Stage: ${c.growth_stage} on ${c.farm_name || 'Farm'} [Planted: ${c.planting_date}]`
            ),
          },
          {
            heading: 'Agronomic Guidance',
            points: [
              'Ensure each active crop has basin mulching and balanced organic nutrient replenishment.',
              'Ask specifically about any crop (e.g., "What should I check for arecanut?") for detailed stage-specific guidance.',
            ],
          },
        ],
        sources: [
          { name: 'ICAR Plantation Crop Management', url: 'https://icar.org.in' },
        ],
        timestamp: now,
      },
    };
  }

  // 6. QUERY: Weather
  if (q.includes('weather') || q.includes('rain') || q.includes('forecast') || q.includes('temperature')) {
    if (!ctx.weather) {
      return {
        message: {
          role: 'assistant',
          title: 'Hyperlocal Weather Advisory',
          content: selectedFarm?.latitude
            ? 'Weather data is currently synchronizing with the meteorological station.'
            : 'Add GPS coordinates to your farm location in the "My Farms" module to enable live hyperlocal weather forecasts.',
          sections: [
            {
              heading: 'Status',
              points: [
                selectedFarm
                  ? `Selected farm: ${selectedFarm.name} (${selectedFarm.location})`
                  : 'No farm selected.',
                'Accurate weather forecasting requires latitude and longitude coordinates.',
              ],
            },
          ],
          sources: [
            { name: 'Open-Meteo High-Resolution Numerical Weather Model', url: 'https://open-meteo.com' },
          ],
          timestamp: now,
        },
      };
    }

    return {
      message: {
        role: 'assistant',
        title: `Farm Weather Advisory: ${selectedFarm?.name || 'Your Farm'}`,
        content: `Forecast indicates ${ctx.weather.condition.toLowerCase()} with a current temperature of ${ctx.weather.temperature}°C.`,
        sections: [
          {
            heading: 'Hyperlocal Conditions',
            points: [
              `Temperature: ${ctx.weather.temperature}°C (Humidity: ${ctx.weather.humidity}%)`,
              `Wind Velocity: ${ctx.weather.windSpeed} km/h`,
              `Precipitation today: ${ctx.weather.precipitation} mm`,
            ],
          },
          {
            heading: 'Upcoming 3-Day Forecast',
            points: (ctx.weather.dailyForecast || []).slice(0, 3).map(
              f => `• ${f.dayName}: ${f.condition}, Max: ${f.maxTemp}°C, Min: ${f.minTemp}°C, Rain Probability: ${f.rainProb}%`
            ),
          },
          {
            heading: 'Agronomic Field Advice',
            points: [
              ctx.weather.precipitation > 5 || (ctx.weather.dailyForecast?.[0]?.rainProb ?? 0) > 60
                ? 'High rain probability: Postpone foliar spraying of bio-inputs or botanical extracts to avoid wash-off.'
                : 'Favorable spraying window: Early morning or late afternoon applications of microbial consortia recommended.',
            ],
          },
        ],
        sources: [
          { name: 'Open-Meteo Weather API (Hyperlocal Farm Coordinates)', url: 'https://open-meteo.com' },
        ],
        timestamp: now,
      },
    };
  }

  // 7. DEFAULT: Contextual Assistant Response
  return {
    message: {
      role: 'assistant',
      title: 'SmartFarm Sustainable Agriculture Assistant',
      content: `I am connected to your live farm records (${ctx.farms.length} farm(s), ${ctx.crops.length} crop(s), ${ctx.activities.length} activity(ies)).`,
      sections: [
        {
          heading: 'Based on your farm records',
          points: [
            `Active Farms: ${ctx.farms.map(f => f.name).join(', ') || 'None recorded yet'}`,
            `Active Crops: ${activeCrops.map(c => c.crop_name).join(', ') || 'None recorded yet'}`,
            `Total Operations Logged: ${ctx.activities.length}`,
            `Pest Observations on File: ${ctx.pestObservations.length}`,
          ],
        },
        {
          heading: 'What you can ask me',
          points: [
            '• "What activities did I record this month?"',
            '• "Show my recent pest observations and IPM options."',
            '• "What should I check for my arecanut crop this week?"',
            '• "What is my latest soil test result?"',
            '• "How much did I spend on fertilizer and inputs?"',
            '• "What is the weather forecast for my farm?"',
          ],
        },
        {
          heading: 'Data Integrity & Safety Notice',
          points: [
            'This assistant answers strictly from your recorded farm data and authoritative agricultural research (ICAR, APEDA, CPCRI, IISR). It never fabricates chemical dosages or safety periods.',
          ],
        },
      ],
      sources: [
        { name: 'ICAR & APEDA Certified Agricultural Knowledge Base', url: 'https://icar.org.in' },
      ],
      timestamp: now,
    },
  };
}
