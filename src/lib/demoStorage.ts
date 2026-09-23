import {
  Farm,
  FarmCrop,
  CropActivity,
  UserProfile,
  FarmInput,
  OrganicInput,
  CropOrganicInput,
  OrganicPractice,
  PestObservation,
  IPMRecord,
  PesticideApplication,
  SoilTest,
  WaterTest,
  FarmWaste,
  CompostBatch
} from '../types';

const INITIAL_PROFILE: UserProfile = {
  id: 'demo-farmer-01',
  email: 'ramesh.farmer@smartfarm.org',
  full_name: 'Ramesh Patel',
  phone: '+91 98450 12345',
  state: 'Karnataka',
  district: 'Shimoga',
  village: 'Thirthahalli',
  preferred_language: 'en',
  farming_type: 'organic',
  created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-001',
    user_id: 'demo-farmer-01',
    name: 'Green Canopy Organic Homestead',
    location: 'Thirthahalli, Shimoga, Karnataka',
    area: 12.5,
    area_unit: 'acres',
    soil_type: 'Laterite Red Loam',
    irrigation_type: 'Drip & Sprinkler',
    farming_method: 'organic',
    organic_status: 'certified_organic',
    current_season: 'Kharif',
    description: 'Multi-tiered agroforestry farm cultivating spice crops, arecanut, and indigenous fruit trees with active vermicomposting.',
    latitude: 13.6937,
    longitude: 75.2415,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'farm-002',
    user_id: 'demo-farmer-01',
    name: 'Sahyadri River Valley Farm',
    location: 'Agumbe Border, Shimoga',
    area: 6.0,
    area_unit: 'acres',
    soil_type: 'Clay Loam with High Organic Matter',
    irrigation_type: 'Natural Stream & Rainfed',
    farming_method: 'regenerative',
    organic_status: 'in_conversion',
    current_season: 'Year-Round',
    description: 'Regenerative agroecology plot dedicated to heritage rice varieties and biological green manuring.',
    latitude: 13.5042,
    longitude: 75.0924,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const INITIAL_CROPS: FarmCrop[] = [
  {
    id: 'crop-001',
    farm_id: 'farm-001',
    user_id: 'demo-farmer-01',
    crop_name: 'Arecanut (Betel Nut)',
    variety: 'Mangala High Yield',
    area: 8.0,
    area_unit: 'acres',
    planting_date: '2023-06-15',
    expected_harvest_date: '2026-11-20',
    growth_stage: 'Fruiting / Podding',
    soil_type: 'Laterite Red Loam',
    irrigation: 'Drip Irrigation',
    farming_method: 'organic',
    status: 'active',
    notes: 'Intercropped with Black Pepper climbing on arecanut palms. Healthy canopy development.',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'crop-002',
    farm_id: 'farm-001',
    user_id: 'demo-farmer-01',
    crop_name: 'Black Pepper',
    variety: 'Panniyur-1',
    area: 4.5,
    area_unit: 'acres',
    planting_date: '2024-07-10',
    expected_harvest_date: '2027-01-15',
    growth_stage: 'Vegetative',
    soil_type: 'Laterite Red Loam',
    irrigation: 'Micro-sprinkler',
    farming_method: 'organic',
    status: 'active',
    notes: 'Trained on areca palms. Mulched with dried biomass and compost.',
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'crop-003',
    farm_id: 'farm-002',
    user_id: 'demo-farmer-01',
    crop_name: 'Indigenous Rice',
    variety: 'Gandhasale (Aromatic)',
    area: 5.0,
    area_unit: 'acres',
    planting_date: '2026-06-25',
    expected_harvest_date: '2026-10-30',
    growth_stage: 'Flowering',
    soil_type: 'Clay Loam',
    irrigation: 'Rainfed & Sluice Channel',
    farming_method: 'regenerative',
    status: 'active',
    notes: 'System of Rice Intensification (SRI) with green azolla biofertilizer incorporation.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const INITIAL_ACTIVITIES: CropActivity[] = [
  {
    id: 'act-001',
    farm_id: 'farm-001',
    crop_id: 'crop-001',
    user_id: 'demo-farmer-01',
    activity_type: 'Organic manure',
    activity_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    quantity: 2500,
    unit: 'kg',
    cost: 7500,
    area: 8.0,
    area_unit: 'acres',
    notes: 'Applied enriched farmyard manure around root zones with microbial consortium.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'act-002',
    farm_id: 'farm-001',
    crop_id: 'crop-002',
    user_id: 'demo-farmer-01',
    activity_type: 'Mulching',
    activity_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    quantity: 1200,
    unit: 'kg',
    cost: 1800,
    area: 4.5,
    area_unit: 'acres',
    notes: 'Applied chopped areca leaves and gliricidia green biomass to conserve soil moisture.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'act-003',
    farm_id: 'farm-002',
    crop_id: 'crop-003',
    user_id: 'demo-farmer-01',
    activity_type: 'Biofertilizer application',
    activity_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    quantity: 50,
    unit: 'kg',
    cost: 1200,
    area: 5.0,
    area_unit: 'acres',
    notes: 'Inoculated paddy field with Azospirillum and Phosphate Solubilizing Bacteria (PSB).',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'act-004',
    farm_id: 'farm-001',
    crop_id: 'crop-001',
    user_id: 'demo-farmer-01',
    activity_type: 'Irrigation',
    activity_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    quantity: 4,
    unit: 'hours',
    cost: 350,
    area: 8.0,
    area_unit: 'acres',
    notes: 'Evening drip cycle run after soil moisture probe indicated 35% tension.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const INITIAL_INPUTS: FarmInput[] = [
  {
    id: 'inp-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    crop_id: 'crop-001',
    product_name: 'Cold-Pressed Neem Cake (Organic)',
    category: 'Botanical inputs',
    purchase_date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    quantity: 500,
    unit: 'kg',
    cost: 12500,
    purpose: 'Nematode suppression and slow-release organic nitrogen',
    application_method: 'Soil application in root basin',
    supplier_or_source: 'Malnad Organic Producers Cooperative',
    batch_or_lot_no: 'NC-2026-B4',
    notes: 'Rich in azadirachtin (min 1000 ppm), certified for NPOP organic use.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inp-002',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    crop_id: 'crop-002',
    product_name: 'Trichoderma harzianum (Bio-Fungicide)',
    category: 'Biological inputs',
    purchase_date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    quantity: 25,
    unit: 'kg',
    cost: 3200,
    purpose: 'Root rot (Phytophthora) biological prevention in black pepper',
    application_method: 'Multiplied with 500kg FYM and drenching',
    supplier_or_source: 'ICAR - Indian Institute of Spices Research (IISR)',
    batch_or_lot_no: 'TH-IISR-88',
    notes: 'Colony forming units (CFU) minimum 2 x 10^6 per gram.',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inp-003',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    product_name: 'Enriched Farmyard Compost',
    category: 'Organic manure',
    purchase_date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    quantity: 4000,
    unit: 'kg',
    cost: 10000,
    purpose: 'Basal organic carbon improvement and microbial activation',
    application_method: 'Broadcasted and ring basin incorporation',
    supplier_or_source: 'On-Farm Composting Unit',
    notes: 'Produced from dairy cattle manure and shredded areca leaves.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inp-004',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-002',
    crop_id: 'crop-003',
    product_name: 'Azospirillum Biofertilizer (Carrier-based)',
    category: 'Biofertilizers',
    purchase_date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    quantity: 20,
    unit: 'kg',
    cost: 1100,
    purpose: 'Atmospheric nitrogen fixation for heritage paddy crop',
    application_method: 'Seedling root dip prior to transplantation',
    supplier_or_source: 'State Agricultural Extension Center, Shimoga',
    batch_or_lot_no: 'AZO-2026-09',
    notes: 'Mixed with rice gruel slurry for root seedling immersion for 30 minutes.',
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_ORGANIC_INPUTS: OrganicInput[] = [
  {
    id: 'org-001',
    name: 'Vermicompost (Earthworm Castings)',
    category: 'Organic Manures',
    description: 'Nutrient-rich, biologically active organic manure produced through earthworm biodegradation (Eisenia fetida) of agricultural and cattle residues.',
    purpose: 'Soil conditioning, structural improvement, microbial enrichment, and slow-release macronutrient supply.',
    benefits: [
      'Increases soil organic carbon (SOC) and cation exchange capacity',
      'Provides plant-available forms of N (1.5-2.5%), P (0.9-1.7%), and K (1.5-2.4%)',
      'Improves soil water-retention capacity and root aeration',
      'Contains growth hormones like auxins and gibberellins secreted by earthworms'
    ],
    suitable_crops: ['Arecanut', 'Black Pepper', 'Coconut', 'Paddy', 'Vegetables', 'Cardamom', 'Coffee'],
    application_information: 'Apply 5-10 kg per palm/tree annually around the drip circle; for field crops, 2-3 tonnes per acre incorporated during final land preparation.',
    precautions: 'Do not expose to direct harsh sunlight. Maintain 25-30% moisture during storage to preserve living beneficial microbes.',
    organic_relevance: 'Complies fully with National Programme for Organic Production (NPOP) Annexure 1 permissible inputs.',
    source_name: 'ICAR - Indian Institute of Soil Science (IISS), Bhopal',
    source_url: 'https://iiss.icar.gov.in',
    last_verified_date: '2026-05-15',
    verification_status: 'Verified Authoritative',
  },
  {
    id: 'org-002',
    name: 'Jeevamrutha (Microbial Bio-Enhancer)',
    category: 'Organic Manures',
    description: 'Fermented liquid microbial culture prepared from indigenous cow dung, urine, pulse flour, jaggery, and virgin soil that acts as a powerful soil biological activator.',
    purpose: 'Rapid proliferation of beneficial soil microflora and mobilization of locked native soil minerals.',
    benefits: [
      'Multiplies millions of indigenous beneficial bacteria and actinomycetes',
      'Accelerates decomposition of in-situ crop biomass and farm mulch',
      'Enhances earthworm activity in the top 15 cm soil layer',
      'Enhances natural systemic resistance in root zones'
    ],
    suitable_crops: ['Arecanut', 'Black Pepper', 'Coconut', 'Paddy', 'Pulses', 'Horticultural Crops'],
    application_information: 'Apply 200 litres per acre through drip irrigation or flood irrigation every 15-21 days during active vegetative and reproductive cycles.',
    precautions: 'Use within 7-10 days of fermentation. Stir clockwise twice daily during preparation. Do not mix with synthetic pesticides or fungicides.',
    organic_relevance: 'Standard input in Zero Budget Natural Farming (ZBNF) and NPOP sustainable practices.',
    source_name: 'National Centre for Organic and Natural Farming (NCONF), Ghaziabad',
    source_url: 'https://pgsindia-ncof.gov.in',
    last_verified_date: '2026-06-01',
    verification_status: 'Verified Authoritative',
  },
  {
    id: 'org-003',
    name: 'Trichoderma viride / harzianum',
    category: 'Biological / Biocontrol Inputs',
    description: 'Antagonistic fungal biocontrol agent that parasitizes pathogenic soil-borne fungi like Phytophthora, Fusarium, Rhizoctonia, and Pythium.',
    purpose: 'Biological management of root rot, damping-off, foot rot, and wilt diseases without chemical residues.',
    benefits: [
      'Secretes enzymes (chitinases, glucanases) that break down cell walls of fungal pathogens',
      'Competes aggressively for root space and nutrients',
      'Produces fungal secondary metabolites promoting plant vigor and root elongation',
      'Provides residual bio-protection without building pathogen resistance'
    ],
    suitable_crops: ['Black Pepper', 'Arecanut', 'Ginger', 'Turmeric', 'Tomato', 'Paddy', 'Pulses'],
    application_information: 'Mix 1 kg of formulation with 100 kg of well-rotted farmyard manure, incubate under shade for 7 days with light moisture, then apply to rhizosphere.',
    precautions: 'Do not apply chemical fungicides within 15 days before or after application. Ensure adequate organic matter is present in soil for fungal colonization.',
    organic_relevance: 'Recommended CIBRC biological formulation; permissible under NPOP Organic Standards.',
    source_name: 'ICAR - Indian Institute of Spices Research (IISR), Calicut',
    source_url: 'https://spices.res.in',
    last_verified_date: '2026-04-10',
    verification_status: 'Verified Authoritative',
  },
  {
    id: 'org-004',
    name: 'Azospirillum (Nitrogen-Fixing Biofertilizer)',
    category: 'Biofertilizers',
    description: 'Associative symbiotic nitrogen-fixing bacterium that colonizes the rhizosphere and root cortex of non-leguminous and plantation crops.',
    purpose: 'Atmospheric nitrogen fixation and synthesis of growth-promoting phytohormones (IAA, Gibberellins).',
    benefits: [
      'Fixes 20-40 kg of atmospheric nitrogen per hectare per season',
      'Saves up to 25-30% of nitrogenous fertilizer requirements',
      'Stimulates prolific lateral root proliferation and nutrient uptake',
      'Enhances drought tolerance through osmo-regulatory root exudates'
    ],
    suitable_crops: ['Paddy', 'Arecanut', 'Coconut', 'Maize', 'Sugarcane', 'Millets'],
    application_information: 'Seed treatment: 200g/acre; Seedling root dip: 1kg in 50L water for 30 mins; Soil application: 2-4 kg mixed with 200kg compost per acre.',
    precautions: 'Do not mix with chemical fertilizers or weedicides. Store in a cool dry place away from heat and direct sunlight.',
    organic_relevance: 'Standard bio-input recognized under Fertilizer Control Order (FCO) and NPOP.',
    source_name: 'Tamil Nadu Agricultural University (TNAU) Agritech Portal',
    source_url: 'https://agritech.tnau.ac.in',
    last_verified_date: '2026-03-20',
    verification_status: 'Verified Authoritative',
  },
  {
    id: 'org-005',
    name: 'Phosphate Solubilizing Bacteria (PSB)',
    category: 'Biofertilizers',
    description: 'Beneficial soil bacteria (Bacillus megaterium / Pseudomonas striata) that secrete organic acids to solubilize insoluble native rock phosphate and soil phosphorus.',
    purpose: 'Unlocks fixed soil phosphorus and converts it into bio-available orthophosphate ions (H2PO4-).',
    benefits: [
      'Solubilizes 30-50 kg of insoluble P2O5 per hectare',
      'Reduces dependence on external phosphorus sources',
      'Secretes organic acids (citric, gluconic, succinic) that buffer soil pH',
      'Synergizes with mycorrhizal fungi for deeper root nutrient extraction'
    ],
    suitable_crops: ['Arecanut', 'Black Pepper', 'Paddy', 'Pulses', 'Oilseeds', 'Vegetables'],
    application_information: 'Apply 2-4 kg/acre mixed with 250 kg organic manure around plant root basins or during field puddling/ploughing.',
    precautions: 'Apply when soil contains adequate moisture. Combine with organic carbon sources to ensure adequate microbial food.',
    organic_relevance: 'Permitted biofertilizer under national and international organic standards.',
    source_name: 'ICAR - Indian Agricultural Research Institute (IARI), New Delhi',
    source_url: 'https://iari.res.in',
    last_verified_date: '2026-05-18',
    verification_status: 'Verified Authoritative',
  },
  {
    id: 'org-006',
    name: 'Neem Seed Kernel Extract (NSKE 5%)',
    category: 'Botanical Inputs',
    description: 'Water extract of crushed neem seed kernels containing azadirachtin, salannin, and nimbin that acts as an oviposition deterrent, antifeedant, and growth regulator.',
    purpose: 'Botanical management of sucking pests, caterpillars, leaf miners, and early instars without harming non-target beneficial predators.',
    benefits: [
      'Broad-spectrum botanical repellent with multiple modes of action',
      'Inhibits insect ecdysone (molting hormone) preventing pest maturation',
      'Zero synthetic chemical residues on harvest products',
      'Completely safe for honeybees, ladybird beetles, and spiders when sprayed at dawn/dusk'
    ],
    suitable_crops: ['Arecanut', 'Black Pepper', 'Paddy', 'Vegetables', 'Cardamom', 'Pulses'],
    application_information: 'Crush 50g neem seeds per litre of water, soak overnight, filter through muslin cloth, add 1 ml liquid soap as emulsifier, spray thoroughly.',
    precautions: 'Prepare fresh before spraying. Spray during late afternoon hours to minimize ultraviolet degradation of azadirachtin.',
    organic_relevance: 'Premier botanical pest management input under NPOP and APEDA guidelines.',
    source_name: 'Directorate of Plant Protection, Quarantine & Storage (DPPQS)',
    source_url: 'https://ppqs.gov.in',
    last_verified_date: '2026-04-28',
    verification_status: 'Verified Authoritative',
  },
  {
    id: 'org-007',
    name: 'Sunnhemp (Crotalaria juncea) Green Manure',
    category: 'Organic Manures',
    description: 'Fast-growing leguminous cover crop that produces up to 15-20 tonnes of green biomass per hectare within 45-50 days of sowing.',
    purpose: 'In-situ organic matter replenishment, biological nitrogen fixation, and weed suppression.',
    benefits: [
      'Incorporates 80-120 kg of biological nitrogen per hectare upon decomposition',
      'Suppresses root-knot nematodes through exuded allelopathic compounds',
      'Prevents soil erosion during heavy pre-monsoon rains',
      'Rapidly breaks down within 2-3 weeks, releasing nutrients for main crop'
    ],
    suitable_crops: ['Paddy', 'Arecanut (interspace)', 'Coconut (interspace)', 'Sugarcane', 'Maize'],
    application_information: 'Broadcast seeds @ 15-20 kg/acre with pre-monsoon showers. Incorporate into soil at 50% flowering stage using a rotavator or disk plough.',
    precautions: 'Incorporate before stems turn fibrous/woody to ensure rapid microbial breakdown and prevent nitrogen immobilization.',
    organic_relevance: 'Core practice of biological soil fertility restoration in organic certification standards.',
    source_name: 'ICAR - Central Research Institute for Dryland Agriculture (CRIDA)',
    source_url: 'https://crida.icar.gov.in',
    last_verified_date: '2026-05-10',
    verification_status: 'Verified Authoritative',
  }
];

export const INITIAL_CROP_ORGANIC_INPUTS: CropOrganicInput[] = [
  {
    id: 'coi-001',
    crop_name: 'Arecanut (Betel Nut)',
    organic_input_id: 'org-001', // Vermicompost
    recommended_stage: 'Basal / Post-Monsoon (Sept-Oct)',
    dosage_guide: '10 kg per bearing palm applied in a shallow ring basin 1m from stem',
    application_notes: 'Cover immediately with leaf mulch to prevent drying out of castings.',
    source_reference: 'ICAR-CPCRI Package of Practices for Arecanut',
  },
  {
    id: 'coi-002',
    crop_name: 'Arecanut (Betel Nut)',
    organic_input_id: 'org-002', // Jeevamrutha
    recommended_stage: 'Active Growth & Nut Development',
    dosage_guide: '500 ml per palm diluted in 5L water every 20 days through drip or basin',
    application_notes: 'Enhances nut setting and prevents premature button shedding.',
    source_reference: 'NCONF Sustainable Areca Agroforestry Protocols',
  },
  {
    id: 'coi-003',
    crop_name: 'Black Pepper',
    organic_input_id: 'org-003', // Trichoderma
    recommended_stage: 'Pre-Monsoon (May-June) & Post-Monsoon (Aug-Sept)',
    dosage_guide: '500g enriched FYM containing Trichoderma per vine applied around root basin',
    application_notes: 'Critical biological prophylactic shield against Phytophthora quick wilt.',
    source_reference: 'ICAR-IISR Black Pepper Organic Management Guidelines',
  },
  {
    id: 'coi-004',
    crop_name: 'Black Pepper',
    organic_input_id: 'org-006', // NSKE 5%
    recommended_stage: 'Spike Emergence & Berry Formation',
    dosage_guide: '5% spray (50 ml/L) directed at foliage and trailing vines',
    application_notes: 'Suppresses pollu beetle (Longitarsus nigripennis) and thrips infestation.',
    source_reference: 'ICAR-IISR IPM in Black Pepper',
  },
  {
    id: 'coi-005',
    crop_name: 'Indigenous Rice',
    organic_input_id: 'org-004', // Azospirillum
    recommended_stage: 'Seedling Transplantation',
    dosage_guide: '1 kg carrier formulation in 50L water for seedling root immersion for 30 mins',
    application_notes: 'Promotes rapid tillering and establishment in wetland soils.',
    source_reference: 'TNAU Organic Rice Cultivation Manual',
  },
  {
    id: 'coi-006',
    crop_name: 'Indigenous Rice',
    organic_input_id: 'org-007', // Sunnhemp
    recommended_stage: 'Pre-Sowing Land Preparation (45 days prior to transplanting)',
    dosage_guide: 'Incorporate 15 tonnes/ha fresh biomass 10-15 days before puddling',
    application_notes: 'Replaces 40-50% of external nutrient inputs and improves soil structure.',
    source_reference: 'ICAR-CRIDA Soil Carbon Enhancement protocols',
  }
];

export const INITIAL_PRACTICES: OrganicPractice[] = [
  {
    id: 'prac-001',
    title: 'On-Farm Vermicomposting Protocol',
    category: 'Soil & Composting',
    summary: 'Converts agro-residues, dried areca leaves, and livestock manure into nutrient-dense vermicast using epigeic earthworm species (Eisenia fetida).',
    scientific_rationale: 'Earthworm gizzard grinding paired with gut symbiotic microbes transforms complex lignin and cellulose into microbial-dense humus with low C:N ratio (12:1 to 15:1).',
    preparation_steps: [
      'Construct a shaded pit or above-ground tank (10ft x 3ft x 2.5ft) with perforated drainage outlet.',
      'Lay a bottom bedding of coconut coir pith or shredded dried biomass (10 cm thick).',
      'Add partially decomposed cattle dung (15-20 days old) layered with chopped farm residues in a 1:1 ratio.',
      'Release 1,000-1,500 Eisenia fetida earthworms per square meter after initial thermal heating subsides.',
      'Sprinkle water regularly to maintain 60-70% moisture and cover with wet gunny bags.',
      'Harvest mature, granular black vermicast from the top layers after 60-75 days.'
    ],
    application_rate: '2 to 3 tonnes per acre for field crops; 5-10 kg per tree for horticultural crops.',
    dosage_timing: 'Apply twice annually during pre-monsoon and post-monsoon soil cultivation.',
    cautions: 'Avoid fresh dung (causes fatal thermal shock to worms). Protect pits from red ants and waterlogging.',
    source: 'ICAR - Indian Institute of Soil Science (IISS) Practical Bulletin',
  },
  {
    id: 'prac-002',
    title: 'Jeevamrutha Microbial Culturing Protocol',
    category: 'Bio-stimulants & Teas',
    summary: 'A fast-acting, anaerobic-aerobic fermented bio-stimulant that introduces trillions of beneficial rhizosphere microorganisms to revitalize depleted soils.',
    scientific_rationale: 'Indigenous cow dung provides live microflora inoculum; jaggery acts as a quick-release carbohydrate energy source; pulse flour provides proteins and amino acids for exponential bacterial doubling.',
    preparation_steps: [
      'Take a 200-litre non-metallic barrel and fill with 180 litres of clean, non-chlorinated water.',
      'Add 10 kg of fresh indigenous cow dung and 5 to 10 litres of indigenous cow urine.',
      'Add 2 kg of organic jaggery and 2 kg of pulse flour (gram or pigeon pea flour).',
      'Add a handful (100g) of undisturbed virgin soil from a forest or field fence boundary.',
      'Stir vigorously in a clockwise direction with a wooden stick for 5 minutes.',
      'Cover with a breathable cotton or gunny cloth and keep in deep shade.',
      'Stir for 5 minutes twice daily (morning and evening) for 5 to 7 days until fermentation bubbles subside.'
    ],
    application_rate: '200 litres per acre through drip irrigation or direct ring basin drenching.',
    dosage_timing: 'Apply every 15 to 21 days during vegetative and flowering stages.',
    cautions: 'Do not store beyond 10-12 days as beneficial bacterial populations peak and subsequently decline. Never use chemical drums.',
    source: 'National Centre for Organic and Natural Farming (NCONF) Technical Manual',
  },
  {
    id: 'prac-003',
    title: 'Biological Trichoderma Mass Multiplication',
    category: 'Biological Pest Control',
    summary: 'On-farm multiplication of the antagonistic fungus Trichoderma using farmyard manure to create a bio-shield against Phytophthora, Pythium, and Rhizoctonia.',
    scientific_rationale: 'Pre-incubating Trichoderma on decomposed cattle manure allows the fungal hyphae to colonize organic matter and achieve high spore density (>10^8 CFU/g) prior to field application.',
    preparation_steps: [
      'Select 500 kg of well-rotted, semi-dry farmyard manure (FYM) under deep tree shade.',
      'Broadcast 1 kg of commercial Trichoderma viride or harzianum formulation across the manure heap.',
      'Moisten lightly with water (around 30-40% moisture; wet enough to ball in the hand without dripping).',
      'Turn the mixture thoroughly and shape into a trapezoidal heap (about 1 meter high).',
      'Cover with a clean tarpaulin or damp gunny bags to maintain humid microclimate.',
      'After 7 to 10 days, examine the pile: a dense white-to-green fungal mycelial growth should cover the manure.',
      'Incorporate this enriched bio-manure into the soil around plant root zones immediately.'
    ],
    application_rate: '1 to 2 kg of enriched manure per plantation crop vine/palm; 500 kg/acre for field crops.',
    dosage_timing: 'Apply before the onset of monsoon rains (May-June) and immediately after rains (September).',
    cautions: 'Do not expose the multiplied fungus to copper oxychloride or synthetic fungicides.',
    source: 'ICAR - Indian Institute of Spices Research (IISR) Extension Bulletin',
  },
  {
    id: 'prac-004',
    title: 'Biomass Mulching & Soil Biome Stewardship',
    category: 'Cropping & Mulch',
    summary: 'Continuous soil surface covering using chopped crop residues, areca fronds, gliricidia cuttings, and dried leaves to eliminate bare soil exposure.',
    scientific_rationale: 'Thermal dampening of soil surface prevents solarization death of beneficial mycorrhizae and topsoil microbes; cuts evaporation by 60-70% and generates constant organic carbon recharge.',
    preparation_steps: [
      'Collect fallen areca leaves, pepper prunings, and cover crop biomass from farm interspaces.',
      'Chop coarse fronds into 10-15 cm segments to promote intimate soil contact and microbial decomposition.',
      'Spread a 8-12 cm thick layer around the tree canopy drip circle, keeping 15 cm clear of the main trunk base.',
      'Apply light Jeevamrutha or cow dung slurry spray over the mulch layer to jumpstart fungal decomposition.'
    ],
    application_rate: 'Maintain year-round mulch layer of 5 to 10 cm thickness across all crop basins.',
    dosage_timing: 'Replenish at the end of the monsoon season (October-November) to preserve moisture for the dry summer.',
    cautions: 'Do not pile mulch tightly against the tree bark/collar region to prevent opportunistic collar rot.',
    source: 'ICAR - Central Plantation Crops Research Institute (CPCRI)',
  }
];

// Phase 3: Initial Pest Observation Demo Data
export const INITIAL_PEST_OBSERVATIONS: PestObservation[] = [
  {
    id: 'demo-pest-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    crop_id: 'crop-001',
    pest_name: 'Areca Leaf Scraper (Slug/Ellura)',
    pest_type: 'insect',
    symptoms: 'Irregular feeding marks on arecanut leaves, severe scraping on younger fronds causing window-pane effect. Frass and insect casts found near mulch pockets.',
    growth_stage: 'Fruiting / Podding',
    severity: 'medium',
    affected_area_percent: 25,
    observation_date: '2026-09-15',
    notes: 'Observed during morning hours near mulch pockets. Population appears to be increasing after recent rains.',
    created_at: '2026-09-15T08:00:00Z',
    updated_at: '2026-09-15T08:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
    crop_name: 'Arecanut (Betel Nut)',
  },
  {
    id: 'demo-pest-002',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    crop_id: 'crop-002',
    pest_name: 'Pollu Beetle (Longitarsus nigripennis)',
    pest_type: 'insect',
    symptoms: 'Small round feeding holes on black pepper leaves, skeletonized leaves in severe cases. Adult beetles found on vine foliage.',
    growth_stage: 'Vegetative',
    severity: 'low',
    affected_area_percent: 10,
    observation_date: '2026-08-20',
    notes: 'Minor infestation detected. Monitoring recommended before intervention.',
    created_at: '2026-08-20T09:00:00Z',
    updated_at: '2026-08-20T09:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
    crop_name: 'Black Pepper',
  },
];

// Phase 3: Initial IPM Record Demo Data
export const INITIAL_IPM_RECORDS: IPMRecord[] = [
  {
    id: 'demo-ipm-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    crop_id: 'crop-001',
    pest_observation_id: 'demo-pest-001',
    pest_name: 'Areca Leaf Scraper (Slug/Ellura)',
    advisory_level: 'biological',
    recommendation: 'Apply Trichoderma-enriched FYM around root basin and maintain field sanitation. Remove alternate host weeds from plantation borders.',
    rationale: 'Biological control agents help manage leaf scraper populations without chemical residues. Trichoderma creates antagonistic environment for pest habitat.',
    source_name: 'ICAR-CPCRI IPM Guidelines for Arecanut',
    source_url: 'https://cpcli.icar.gov.in',
    created_at: '2026-09-16T10:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
    crop_name: 'Arecanut (Betel Nut)',
  },
];

// Phase 3: Initial Pesticide Application Demo Data
export const INITIAL_PESTICIDE_APPLICATIONS: PesticideApplication[] = [
  {
    id: 'demo-pest-002',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    crop_id: 'crop-001',
    pest_observation_id: 'demo-pest-001',
    product_name: 'Neem Oil 5EC',
    active_ingredient: 'Azadirachtin 5000 ppm',
    application_date: '2026-08-20',
    quantity: 500,
    unit: 'ml',
    area: 8,
    area_unit: 'acres',
    application_method: 'Foliar spray in early morning hours',
    source_reference: 'DPPQS Botanical Pesticide Guidelines',
    pre_harvest_interval_days: 7,
    re_entry_interval_hours: 12,
    notes: 'Applied during low pest incidence period. Mixed with water and emulsifier. Spray coverage ensured on leaf undersides.',
    follow_up_date: '2026-09-03',
    created_at: '2026-08-20T14:00:00Z',
    updated_at: '2026-08-20T14:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
    crop_name: 'Arecanut (Betel Nut)',
    pest_name: 'Areca Leaf Scraper (Slug/Ellura)',
  },
];

// Phase 4: Initial Soil & Water Test Demo Data
export const INITIAL_SOIL_TESTS: SoilTest[] = [
  {
    id: 'soil-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    test_date: '2026-08-15',
    laboratory: 'Karnataka State Soil Testing Lab, Shivamogga',
    ph: 6.2,
    nitrogen: 280,
    phosphorus: 32,
    potassium: 210,
    organic_carbon: 1.8,
    texture: 'Laterite Red Loam',
    moisture: 22,
    notes: 'Soil pH is slightly acidic, suitable for arecanut and black pepper. Organic carbon is within acceptable range for organic farming. Recommend adding FYM to improve SOC above 2%.',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
  },
];

export const INITIAL_WATER_TESTS: WaterTest[] = [
  {
    id: 'water-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    test_date: '2026-09-01',
    laboratory: 'ICAR-CPCRI Water Quality Analysis Center',
    ph: 7.1,
    ec: 0.38,
    hardness: 145,
    alkalinity: 120,
    sodium: 28,
    calcium: 32,
    magnesium: 18,
    chloride: 15,
    suitability: 'excellent',
    notes: 'Rainwater harvest sample from farm pond. Water quality is excellent for irrigation. Low salinity and sodium hazard.',
    created_at: '2026-09-01T14:00:00Z',
    updated_at: '2026-09-01T14:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
  },
];

// Phase 4: Initial Waste & Compost Demo Data
export const INITIAL_FARM_WASTE: FarmWaste[] = [
  {
    id: 'waste-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    waste_type: 'crop_residue',
    description: 'Areca nut fronds and dried leaves from pruning',
    quantity: 500,
    unit: 'kg',
    collection_date: '2026-09-10',
    source_location: 'Areca orchard blocks A, B, C',
    status: 'composted',
    processed_crop_id: 'crop-001',
    notes: 'Chopped into 15cm segments and mixed with cow dung for vermicomposting.',
    created_at: '2026-09-10T08:00:00Z',
    updated_at: '2026-09-10T08:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
    crop_name: 'Arecanut (Betel Nut)',
  },
  {
    id: 'waste-002',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    waste_type: 'leaves',
    description: 'Mixed leaf litter from understorey vegetation',
    quantity: 200,
    unit: 'kg',
    collection_date: '2026-09-12',
    status: 'processing',
    notes: 'Being used as mulch for black pepper vines.',
    created_at: '2026-09-12T09:00:00Z',
    updated_at: '2026-09-12T09:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
  },
];

export const INITIAL_COMPOST_BATCHES: CompostBatch[] = [
  {
    id: 'compost-001',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    compost_type: 'vermicompost',
    start_date: '2026-08-01',
    estimated_completion_date: '2026-09-15',
    processing_method: 'Eisenia fetida earthworm bed with cattle manure and areca leaves',
    volume_start: 100,
    unit: 'kg',
    volume_finished: 75,
    quality_rating: 'excellent',
    status: 'finished',
    applied_to_crop_id: 'crop-001',
    application_date: '2026-09-20',
    application_rate: '10 kg per palm',
    notes: 'High-quality vermicast with rich microbial activity. Smell of earth, dark color, fine texture.',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
  },
  {
    id: 'compost-002',
    user_id: 'demo-farmer-01',
    farm_id: 'farm-001',
    compost_type: 'farmyard_manure',
    start_date: '2026-09-01',
    estimated_completion_date: '2026-11-01',
    processing_method: 'Traditional dung heap composting with turnings every 15 days',
    volume_start: 500,
    unit: 'kg',
    status: 'active',
    notes: 'Dairy cattle manure being composted. Turned twice so far.',
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-15T08:00:00Z',
    farm_name: 'Green Canopy Organic Homestead',
  },
];

export class DemoStorage {
  private static getKey(table: string) {
    return `smartfarm_${table}`;
  }

  static getProfile(): UserProfile {
    const raw = localStorage.getItem(this.getKey('profile'));
    if (!raw) {
      localStorage.setItem(this.getKey('profile'), JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    return JSON.parse(raw);
  }

  static updateProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile, updated_at: new Date().toISOString() };
    localStorage.setItem(this.getKey('profile'), JSON.stringify(updated));
    return updated;
  }

  static getFarms(): Farm[] {
    const raw = localStorage.getItem(this.getKey('farms'));
    if (!raw) {
      localStorage.setItem(this.getKey('farms'), JSON.stringify(INITIAL_FARMS));
      return INITIAL_FARMS;
    }
    return JSON.parse(raw);
  }

  static saveFarm(farm: Omit<Farm, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Farm {
    const farms = this.getFarms();
    if (farm.id) {
      const idx = farms.findIndex(f => f.id === farm.id);
      if (idx !== -1) {
        const updated: Farm = {
          ...farms[idx],
          ...farm,
          updated_at: new Date().toISOString(),
        };
        farms[idx] = updated;
        localStorage.setItem(this.getKey('farms'), JSON.stringify(farms));
        return updated;
      }
    }
    const newFarm: Farm = {
      ...farm,
      id: `farm-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    farms.unshift(newFarm);
    localStorage.setItem(this.getKey('farms'), JSON.stringify(farms));
    return newFarm;
  }

  static deleteFarm(id: string): void {
    const farms = this.getFarms().filter(f => f.id !== id);
    localStorage.setItem(this.getKey('farms'), JSON.stringify(farms));
    const crops = this.getCrops().filter(c => c.farm_id !== id);
    localStorage.setItem(this.getKey('crops'), JSON.stringify(crops));
    const acts = this.getActivities().filter(a => a.farm_id !== id);
    localStorage.setItem(this.getKey('activities'), JSON.stringify(acts));
    const inps = this.getInputs().filter(i => i.farm_id !== id);
    localStorage.setItem(this.getKey('inputs'), JSON.stringify(inps));
  }

  static getCrops(farmId?: string): FarmCrop[] {
    const raw = localStorage.getItem(this.getKey('crops'));
    let crops: FarmCrop[] = raw ? JSON.parse(raw) : INITIAL_CROPS;
    if (!raw) {
      localStorage.setItem(this.getKey('crops'), JSON.stringify(INITIAL_CROPS));
    }
    if (farmId) {
      crops = crops.filter(c => c.farm_id === farmId);
    }
    const farms = this.getFarms();
    return crops.map(c => ({
      ...c,
      farm_name: farms.find(f => f.id === c.farm_id)?.name || 'Unknown Farm',
    }));
  }

  static saveCrop(crop: Omit<FarmCrop, 'id' | 'created_at' | 'updated_at'> & { id?: string }): FarmCrop {
    const crops = this.getCrops();
    if (crop.id) {
      const idx = crops.findIndex(c => c.id === crop.id);
      if (idx !== -1) {
        const updated: FarmCrop = {
          ...crops[idx],
          ...crop,
          updated_at: new Date().toISOString(),
        };
        crops[idx] = updated;
        localStorage.setItem(this.getKey('crops'), JSON.stringify(crops));
        return updated;
      }
    }
    const newCrop: FarmCrop = {
      ...crop,
      id: `crop-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    crops.unshift(newCrop);
    localStorage.setItem(this.getKey('crops'), JSON.stringify(crops));
    return newCrop;
  }

  static deleteCrop(id: string): void {
    const crops = this.getCrops().filter(c => c.id !== id);
    localStorage.setItem(this.getKey('crops'), JSON.stringify(crops));
    const acts = this.getActivities().map(a => a.crop_id === id ? { ...a, crop_id: undefined } : a);
    localStorage.setItem(this.getKey('activities'), JSON.stringify(acts));
    const inps = this.getInputs().map(i => i.crop_id === id ? { ...i, crop_id: undefined } : i);
    localStorage.setItem(this.getKey('inputs'), JSON.stringify(inps));
  }

  static getActivities(filters?: { farmId?: string; cropId?: string }): CropActivity[] {
    const raw = localStorage.getItem(this.getKey('activities'));
    let acts: CropActivity[] = raw ? JSON.parse(raw) : INITIAL_ACTIVITIES;
    if (!raw) {
      localStorage.setItem(this.getKey('activities'), JSON.stringify(INITIAL_ACTIVITIES));
    }
    if (filters?.farmId) {
      acts = acts.filter(a => a.farm_id === filters.farmId);
    }
    if (filters?.cropId) {
      acts = acts.filter(a => a.crop_id === filters.cropId);
    }
    const farms = this.getFarms();
    const crops = this.getCrops();
    return acts.map(a => ({
      ...a,
      farm_name: farms.find(f => f.id === a.farm_id)?.name || 'Unknown Farm',
      crop_name: crops.find(c => c.id === a.crop_id)?.crop_name || 'General Farm Activity',
    })).sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime());
  }

  static saveActivity(activity: Omit<CropActivity, 'id' | 'created_at' | 'updated_at'> & { id?: string }): CropActivity {
    const acts = this.getActivities();
    if (activity.id) {
      const idx = acts.findIndex(a => a.id === activity.id);
      if (idx !== -1) {
        const updated: CropActivity = {
          ...acts[idx],
          ...activity,
          updated_at: new Date().toISOString(),
        };
        acts[idx] = updated;
        localStorage.setItem(this.getKey('activities'), JSON.stringify(acts));
        return updated;
      }
    }
    const newAct: CropActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    acts.unshift(newAct);
    localStorage.setItem(this.getKey('activities'), JSON.stringify(acts));
    return newAct;
  }

  static deleteActivity(id: string): void {
    const acts = this.getActivities().filter(a => a.id !== id);
    localStorage.setItem(this.getKey('activities'), JSON.stringify(acts));
  }

  // Phase 2: Inputs Management
  static getInputs(filters?: { farmId?: string; cropId?: string }): FarmInput[] {
    const raw = localStorage.getItem(this.getKey('inputs'));
    let inps: FarmInput[] = raw ? JSON.parse(raw) : INITIAL_INPUTS;
    if (!raw) {
      localStorage.setItem(this.getKey('inputs'), JSON.stringify(INITIAL_INPUTS));
    }
    if (filters?.farmId) {
      inps = inps.filter(i => i.farm_id === filters.farmId);
    }
    if (filters?.cropId) {
      inps = inps.filter(i => i.crop_id === filters.cropId);
    }
    const farms = this.getFarms();
    const crops = this.getCrops();
    return inps.map(i => ({
      ...i,
      farm_name: farms.find(f => f.id === i.farm_id)?.name || 'Unknown Farm',
      crop_name: crops.find(c => c.id === i.crop_id)?.crop_name || 'General Inventory',
    })).sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime());
  }

  static saveInput(input: Omit<FarmInput, 'id' | 'created_at' | 'updated_at'> & { id?: string }): FarmInput {
    const inps = this.getInputs();
    if (input.id) {
      const idx = inps.findIndex(i => i.id === input.id);
      if (idx !== -1) {
        const updated: FarmInput = {
          ...inps[idx],
          ...input,
          updated_at: new Date().toISOString(),
        };
        inps[idx] = updated;
        localStorage.setItem(this.getKey('inputs'), JSON.stringify(inps));
        return updated;
      }
    }
    const newInp: FarmInput = {
      ...input,
      id: `inp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inps.unshift(newInp);
    localStorage.setItem(this.getKey('inputs'), JSON.stringify(inps));
    return newInp;
  }

  static deleteInput(id: string): void {
    const inps = this.getInputs().filter(i => i.id !== id);
    localStorage.setItem(this.getKey('inputs'), JSON.stringify(inps));
  }

  // Phase 2: Organic Knowledge Library
  static getOrganicInputs(): OrganicInput[] {
    const raw = localStorage.getItem(this.getKey('organic_inputs'));
    if (!raw) {
      localStorage.setItem(this.getKey('organic_inputs'), JSON.stringify(INITIAL_ORGANIC_INPUTS));
      return INITIAL_ORGANIC_INPUTS;
    }
    return JSON.parse(raw);
  }

  static getCropOrganicInputs(cropName?: string): CropOrganicInput[] {
    const raw = localStorage.getItem(this.getKey('crop_organic_inputs'));
    let mappings: CropOrganicInput[] = raw ? JSON.parse(raw) : INITIAL_CROP_ORGANIC_INPUTS;
    if (!raw) {
      localStorage.setItem(this.getKey('crop_organic_inputs'), JSON.stringify(INITIAL_CROP_ORGANIC_INPUTS));
    }
    const organicInputs = this.getOrganicInputs();
    const mapped = mappings.map(m => ({
      ...m,
      organic_input: organicInputs.find(o => o.id === m.organic_input_id),
    }));
    if (cropName) {
      return mapped.filter(m => m.crop_name.toLowerCase().includes(cropName.toLowerCase()));
    }
    return mapped;
  }

  static getOrganicPractices(): OrganicPractice[] {
    return INITIAL_PRACTICES;
  }

  // Phase 3: Pest & IPM Demo Data Methods
  static getPestObservations(): PestObservation[] {
    const raw = localStorage.getItem(this.getKey('pest_observations'));
    if (!raw) {
      localStorage.setItem(this.getKey('pest_observations'), JSON.stringify(INITIAL_PEST_OBSERVATIONS));
      return INITIAL_PEST_OBSERVATIONS;
    }
    return JSON.parse(raw);
  }

  static savePestObservation(obs: Omit<PestObservation, 'id' | 'created_at' | 'updated_at'> & { id?: string }): PestObservation {
    const obsList = this.getPestObservations();
    if (obs.id) {
      const idx = obsList.findIndex(o => o.id === obs.id);
      if (idx !== -1) {
        obsList[idx] = { ...obsList[idx], ...obs, updated_at: new Date().toISOString() };
        localStorage.setItem(this.getKey('pest_observations'), JSON.stringify(obsList));
        return obsList[idx];
      }
    }
    const newObs: PestObservation = {
      ...obs,
      id: `pest-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    obsList.unshift(newObs);
    localStorage.setItem(this.getKey('pest_observations'), JSON.stringify(obsList));
    return newObs;
  }

  static deletePestObservation(id: string): void {
    const obsList = this.getPestObservations().filter(o => o.id !== id);
    localStorage.setItem(this.getKey('pest_observations'), JSON.stringify(obsList));
  }

  static getIPMRecords(): IPMRecord[] {
    const raw = localStorage.getItem(this.getKey('ipm_records'));
    if (!raw) {
      localStorage.setItem(this.getKey('ipm_records'), JSON.stringify(INITIAL_IPM_RECORDS));
      return INITIAL_IPM_RECORDS;
    }
    return JSON.parse(raw);
  }

  static saveIPMRecord(record: Omit<IPMRecord, 'id' | 'created_at'> & { id?: string }): IPMRecord {
    const records = this.getIPMRecords();
    if (record.id) {
      const idx = records.findIndex(r => r.id === record.id);
      if (idx !== -1) {
        records[idx] = { ...records[idx], ...record, created_at: new Date().toISOString() };
        localStorage.setItem(this.getKey('ipm_records'), JSON.stringify(records));
        return records[idx];
      }
    }
    const newRecord: IPMRecord = {
      ...record,
      id: `ipm-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    records.unshift(newRecord);
    localStorage.setItem(this.getKey('ipm_records'), JSON.stringify(records));
    return newRecord;
  }

  static getPesticideApplications(): PesticideApplication[] {
    const raw = localStorage.getItem(this.getKey('pesticide_applications'));
    if (!raw) {
      localStorage.setItem(this.getKey('pesticide_applications'), JSON.stringify(INITIAL_PESTICIDE_APPLICATIONS));
      return INITIAL_PESTICIDE_APPLICATIONS;
    }
    return JSON.parse(raw);
  }

  static savePesticideApplication(app: Omit<PesticideApplication, 'id' | 'created_at' | 'updated_at'> & { id?: string }): PesticideApplication {
    const apps = this.getPesticideApplications();
    if (app.id) {
      const idx = apps.findIndex(a => a.id === app.id);
      if (idx !== -1) {
        apps[idx] = { ...apps[idx], ...app, updated_at: new Date().toISOString() };
        localStorage.setItem(this.getKey('pesticide_applications'), JSON.stringify(apps));
        return apps[idx];
      }
    }
    const newApp: PesticideApplication = {
      ...app,
      id: `app-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    apps.unshift(newApp);
    localStorage.setItem(this.getKey('pesticide_applications'), JSON.stringify(apps));
    return newApp;
  }

  // Phase 4: Soil & Water Tests Demo Methods
  static getSoilTests(): SoilTest[] {
    const raw = localStorage.getItem(this.getKey('soil_tests'));
    if (!raw) {
      localStorage.setItem(this.getKey('soil_tests'), JSON.stringify(INITIAL_SOIL_TESTS));
      return INITIAL_SOIL_TESTS;
    }
    return JSON.parse(raw);
  }

  static getWaterTests(): WaterTest[] {
    const raw = localStorage.getItem(this.getKey('water_tests'));
    if (!raw) {
      localStorage.setItem(this.getKey('water_tests'), JSON.stringify(INITIAL_WATER_TESTS));
      return INITIAL_WATER_TESTS;
    }
    return JSON.parse(raw);
  }

  // Phase 4: Waste & Compost Demo Methods
  static getFarmWaste(): FarmWaste[] {
    const raw = localStorage.getItem(this.getKey('farm_waste'));
    if (!raw) {
      localStorage.setItem(this.getKey('farm_waste'), JSON.stringify(INITIAL_FARM_WASTE));
      return INITIAL_FARM_WASTE;
    }
    return JSON.parse(raw);
  }

  static getCompostBatches(): CompostBatch[] {
    const raw = localStorage.getItem(this.getKey('compost_batches'));
    if (!raw) {
      localStorage.setItem(this.getKey('compost_batches'), JSON.stringify(INITIAL_COMPOST_BATCHES));
      return INITIAL_COMPOST_BATCHES;
    }
    return JSON.parse(raw);
  }
}
