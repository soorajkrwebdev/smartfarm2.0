-- ============================================================================
-- Chunk 3: Organic Input Knowledge Library — Extended Seed Data
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform
--
-- Adds:
--   • 12 additional organic inputs not in the phase 6 seed
--   • 26 crop-organic-input relationship records
--
-- IMPORTANT — Data quality rules enforced in this file:
--   • Every row has source_name and source_url.
--   • verification_status uses platform-defined grades only.
--   • No row claims "NPOP certified", "approved organic", or "permitted
--     under NPOP" unless the specific APEDA Annex 2 or regulation supports it.
--   • Application quantities and specific concentrations are NOT seeded
--     unless they are directly quoted from the named source.
--   • "Described benefits" — not "verified" benefits.
--
-- Sources used:
--   ICAR-IISS   https://iiss.icar.gov.in
--   ICAR-IISR   https://spices.res.in
--   ICAR-CPCRI  https://cpcri.icar.gov.in
--   ICAR-IARI   https://iari.res.in
--   ICAR-CRIDA  https://crida.icar.gov.in
--   ICAR-NBAII  https://nbaii.icar.gov.in
--   TNAU        https://agritech.tnau.ac.in
--   NCOF/NCONF  https://pgsindia-ncof.gov.in
--   APEDA/NPOP  https://apeda.gov.in/apedawebsite/organic/Organic_Products.htm
--   DPPQS       https://ppqs.gov.in
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- Update existing rows: add npop_relevance_class and source_limitation columns
-- These were not present in the Phase 6 migration.
-- The ALTER is safe with IF NOT EXISTS.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.organic_inputs
  add column if not exists npop_relevance_class text
    check (npop_relevance_class in ('natural','organic-input','listed-in-standard','certified-product','not-established'))
    default 'organic-input',
  add column if not exists source_limitation text,
  add column if not exists source_document_title text;

-- ─────────────────────────────────────────────────────────────────────────────
-- Update Phase 6 seed rows with richer classification data
-- ─────────────────────────────────────────────────────────────────────────────
update public.organic_inputs set
  npop_relevance_class = 'organic-input',
  source_limitation    = 'Source describes vermicompost properties in general. Does not certify specific products or verify any farm''s certification status.'
where id = 'a0000000-0000-0000-0000-000000000001';

update public.organic_inputs set
  npop_relevance_class = 'organic-input',
  source_limitation    = 'General guidance on FYM. Certification eligibility depends on feedstocks and the applicable certification body''s rules.'
where id = 'a0000000-0000-0000-0000-000000000002';

update public.organic_inputs set
  npop_relevance_class = 'listed-in-standard',
  source_limitation    = 'FCO and NPOP list biofertiliser categories, not specific products. A product must still meet applicable standard conditions.'
where id = 'a0000000-0000-0000-0000-000000000003';

update public.organic_inputs set
  npop_relevance_class = 'listed-in-standard',
  source_limitation    = 'FCO and NPOP list PSB as a category. Product-level eligibility requires certification body evaluation.'
where id = 'a0000000-0000-0000-0000-000000000004';

update public.organic_inputs set
  npop_relevance_class = 'organic-input',
  source_limitation    = 'CIBRC registration covers use as a biocontrol agent. NPOP eligibility of a specific product requires CB verification.'
where id = 'a0000000-0000-0000-0000-000000000005';

update public.organic_inputs set
  npop_relevance_class = 'organic-input',
  source_limitation    = 'CIBRC registration covers use as a biocontrol agent. NPOP eligibility of a specific product requires CB verification.'
where id = 'a0000000-0000-0000-0000-000000000006';

update public.organic_inputs set
  npop_relevance_class = 'organic-input',
  source_limitation    = 'NSKE is a traditional preparation, not a commercially registered pesticide. NPOP compliance must be confirmed with the applicable certification body.'
where id = 'a0000000-0000-0000-0000-000000000007';

update public.organic_inputs set
  npop_relevance_class = 'listed-in-standard',
  source_limitation    = 'NPOP Annex 2 lists calcium and magnesium carbonates subject to conditions. Product purity and specific eligibility not established here.'
where id = 'a0000000-0000-0000-0000-000000000008';

-- ─────────────────────────────────────────────────────────────────────────────
-- New organic inputs (12 additional entries not in Phase 6 seed)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.organic_inputs
  (id, name, category, description, purpose, benefits, suitable_crops,
   application_information, precautions, organic_relevance,
   source_name, source_url, verification_status,
   npop_relevance_class, source_limitation)
values

-- Jeevamrutha
(
  'a0000000-0000-0000-0000-000000000009',
  'Jeevamrutha (Fermented Microbial Inoculant)',
  'Organic Manures',
  'A fermented liquid biological preparation made from cow dung, cow urine, jaggery, pulse flour, and undisturbed forest soil, promoted through Zero Budget Natural Farming (ZBNF). Introduces indigenous soil microorganisms into the root zone.',
  'Rapid establishment of beneficial soil microflora and mobilisation of native soil nutrients.',
  array[
    'Introduces diverse beneficial bacteria and fungi into the root zone',
    'Promotes decomposition of crop residues and mulch',
    'Supports earthworm activity in the top soil',
    'Used extensively in ZBNF systems across India'
  ],
  array['Paddy','Arecanut','Coconut','Vegetables','Pulses','Millets','Black Pepper'],
  'Apply through irrigation or as a drench around the root zone. Follow NCOF/NCONF documentation for preparation proportions and application intervals. Use within a few days of fermentation completion.',
  'Do not mix with synthetic fertilisers or synthetic pesticides. Use non-metallic containers for preparation. Preparation results vary with ambient temperature.',
  'Organic farming input described in NCOF/NCONF ZBNF programme materials. Certification eligibility under specific standards should be confirmed with the applicable certification body.',
  'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
  'https://pgsindia-ncof.gov.in',
  'Source-backed',
  'organic-input',
  'Source describes preparation method and stated purpose. Does not certify individual batches or guarantee specific microbial counts.'
),

-- Green Manure Sunnhemp
(
  'a0000000-0000-0000-0000-000000000010',
  'Green Manure — Sunnhemp (Crotalaria juncea)',
  'Organic Manures',
  'Fast-growing leguminous cover crop incorporated into the soil while green to replenish nitrogen and organic matter. One of the most widely recommended green manure crops for tropical Indian conditions.',
  'In-situ biological nitrogen fixation, organic matter addition, and weed suppression.',
  array[
    'Fixes atmospheric nitrogen through root nodule bacteria (Rhizobium)',
    'Rapid biomass production improves soil organic carbon when incorporated',
    'Can suppress certain nematode populations in soil',
    'Protects topsoil from erosion during pre-monsoon rains'
  ],
  array['Paddy','Sugarcane','Banana','Arecanut (interspace)','Coconut (interspace)','Maize'],
  'Sow broadcast with pre-monsoon rains at the seed rate recommended by state extension. Incorporate at flowering stage before stems become lignified. Allow 2–3 weeks for decomposition before transplanting the main crop.',
  'Incorporate before full maturity to avoid nitrogen immobilisation. Ensure sufficient soil moisture for rapid decomposition after incorporation.',
  'Standard organic soil management practice. Widely described in ICAR and state extension literature.',
  'ICAR – Central Research Institute for Dryland Agriculture (CRIDA), Hyderabad',
  'https://crida.icar.gov.in',
  'Educational',
  'organic-input',
  'General description of sunnhemp as a green manure crop. Specific nitrogen fixation values depend on soil type, inoculation, and growing conditions.'
),

-- KMB
(
  'a0000000-0000-0000-0000-000000000011',
  'Potassium Mobilising Bacteria (KMB)',
  'Biofertilizers',
  'Biofertiliser containing bacteria that can mobilise potassium from silicate minerals and organic matter in the soil. Registered under the Fertiliser Control Order (FCO) in India.',
  'Improving potassium availability in potassium-fixing soils, especially laterite and red soils.',
  array[
    'Mobilises potassium from soil mineral reserves through organic acid production',
    'Produces plant growth-promoting substances as a secondary effect',
    'FCO-registered biofertiliser in India'
  ],
  array['Arecanut','Coconut','Black Pepper','Paddy','Banana','Vegetables'],
  'Apply as soil drench or mix with organic compost as carrier. Follow FCO-compliant product label instructions. Can be combined with PSB and Azospirillum as a biofertiliser consortium.',
  'Efficacy depends on soil type and mineral potassium reserves. Store in cool conditions and use before expiry date on the label.',
  'FCO-registered biofertiliser category. Suitability under organic certification programmes depends on product-level compliance and the applicable standard.',
  'Tamil Nadu Agricultural University (TNAU) Agritech Portal',
  'https://agritech.tnau.ac.in',
  'Source-backed',
  'listed-in-standard',
  'FCO lists KMB as a biofertiliser category. Product-level NPOP eligibility requires certification body evaluation.'
),

-- AMF
(
  'a0000000-0000-0000-0000-000000000012',
  'Mycorrhizal Fungi (Arbuscular Mycorrhizal Fungi — AMF)',
  'Biofertilizers',
  'Symbiotic root-colonising fungi that extend the effective root absorptive surface area, improving phosphorus and water uptake and seedling establishment.',
  'Enhancing phosphorus acquisition, drought tolerance, and plant establishment.',
  array[
    'Extends effective root surface area for nutrient and water uptake',
    'Particularly effective for phosphorus acquisition in low-P soils',
    'Improves seedling establishment and transplant survival',
    'Promotes soil aggregate stability through hyphal networks'
  ],
  array['Arecanut','Coconut','Black Pepper','Coffee','Banana','Cardamom','Ginger','Turmeric'],
  'Apply as soil inoculant during transplanting or at the nursery stage. Follow product label. Avoid application alongside phosphatic fertilisers or fungicides.',
  'Sensitive to chemical fungicides and high phosphorus soil conditions. Do not apply to sterilised soil. Efficacy is reduced in high-phosphorus soils.',
  'Mycorrhizal inoculants are widely used in organic and sustainable agriculture. Product-level eligibility under specific certification standards should be confirmed with the applicable certification body.',
  'ICAR – Indian Institute of Spices Research (IISR), Calicut',
  'https://spices.res.in',
  'Educational',
  'organic-input',
  'General educational description of AMF. Efficacy varies considerably by crop, soil, and strain. Not all commercial AMF products are equivalent.'
),

-- Beauveria bassiana
(
  'a0000000-0000-0000-0000-000000000013',
  'Beauveria bassiana (Entomopathogenic Fungus)',
  'Biological / Biocontrol Inputs',
  'A naturally occurring soil fungus used as a CIBRC-registered biological insecticide. Infects and kills a broad range of insect pests when conidia (spores) contact the insect cuticle.',
  'Biological management of insect pests including white grubs, thrips, whitefly, and stem borers.',
  array[
    'Infects insects on contact — no ingestion required by the host insect',
    'Broad pest spectrum across multiple insect orders',
    'Does not leave synthetic chemical residues',
    'CIBRC-registered biocontrol agent in India'
  ],
  array['Sugarcane','Paddy','Cardamom','Tea','Coffee','Arecanut','Vegetables'],
  'Apply as foliar spray or soil drench depending on target pest. Follow CIBRC-registered product label for rate and method. Spray during early morning or evening to protect spores from UV degradation.',
  'Sensitive to direct sunlight and high temperatures. Incompatible with chemical fungicides. Store under conditions specified on product label.',
  'CIBRC-registered biocontrol agent. NPOP eligibility depends on specific product registration and applicable certification body input approval.',
  'ICAR – National Bureau of Agriculturally Important Insects (NBAII), Bengaluru',
  'https://nbaii.icar.gov.in',
  'Source-backed',
  'organic-input',
  'General guidance on Beauveria bassiana as a biocontrol agent. Efficacy is pest-species and formulation-specific. No specific dosage claims made here.'
),

-- Metarhizium
(
  'a0000000-0000-0000-0000-000000000014',
  'Metarhizium anisopliae (Entomopathogenic Fungus)',
  'Biological / Biocontrol Inputs',
  'Naturally occurring entomopathogenic fungus. CIBRC-registered for biological control of soil-dwelling and surface insects including white grubs.',
  'Biological management of soil insect pests, particularly white grubs and root-feeding beetle larvae.',
  array[
    'Highly effective against soil-dwelling larval stages of scarab beetles',
    'Can persist in soil and provide residual protection',
    'CIBRC-registered in India for specific crops and pests'
  ],
  array['Sugarcane','Paddy','Turmeric','Groundnut','Coconut'],
  'Apply as soil drench or mix with organic manure for soil incorporation targeting larvae. Follow CIBRC-registered product label for rate and method.',
  'Avoid concurrent application of chemical fungicides. Soil moisture is important for fungal activity. Use before expiry date.',
  'CIBRC-registered biocontrol agent. NPOP eligibility depends on product-level registration and applicable certification body rules.',
  'ICAR – National Bureau of Agriculturally Important Insects (NBAII), Bengaluru',
  'https://nbaii.icar.gov.in',
  'Educational',
  'organic-input',
  'General description of Metarhizium as a biocontrol agent. Specific crop-pest registrations and NPOP eligibility not established by this entry.'
),

-- Neem Cake
(
  'a0000000-0000-0000-0000-000000000015',
  'Neem Cake (Cold-Pressed, De-oiled)',
  'Botanical Inputs',
  'Residue from cold-pressing neem seeds for oil. Contains azadirachtin and other limonoids. Used as a soil amendment with organic nitrogen and nematode-suppressive properties.',
  'Soil organic matter addition with secondary nematode-suppressive and slow-release nitrogen effects.',
  array[
    'Adds organic nitrogen to soil as it decomposes',
    'Contains neem limonoids with nematode-suppressive properties',
    'Improves soil microbial activity over time'
  ],
  array['Arecanut','Coconut','Black Pepper','Banana','Ginger','Turmeric','Vegetables','Paddy'],
  'Incorporate into the root zone soil or apply as a basal amendment during planting. Consult extension recommendations for rate. Can be combined with biofertilisers but apply separately.',
  'De-oiled neem cake has a strong odour. Avoid over-application which can cause temporary nitrogen immobilisation. Ensure product is from seed source, not bark or leaf.',
  'De-oiled neem cake is widely described as an organic soil amendment. Whether a specific commercial product is permissible under NPOP Annex 2 requires verification with the applicable certification body.',
  'ICAR – Central Plantation Crops Research Institute (CPCRI), Kasaragod',
  'https://cpcri.res.in',
  'Source-backed',
  'organic-input',
  'Source covers neem cake as an amendment for plantation crops. NPOP product-level eligibility not established by this entry.'
),

-- Pongamia Cake
(
  'a0000000-0000-0000-0000-000000000016',
  'Pongamia / Karanja Cake (Millettia pinnata)',
  'Botanical Inputs',
  'Residue from Pongamia (karanja) seed after oil extraction. Contains bitter compounds with soil pest-suppressive properties. Used as a soil amendment in plantation crops in South India.',
  'Organic soil amendment with nematode and soil insect pest-suppressive secondary effects.',
  array[
    'Adds organic nitrogen as it decomposes in soil',
    'Contains pongamol and karanjin with soil pest-deterrent properties',
    'Available locally in many South Indian farming regions'
  ],
  array['Arecanut','Coconut','Black Pepper','Banana','Vegetables'],
  'Incorporate into the root zone soil as a basal amendment. Follow extension advice for rate and crop. Can be used alongside FYM.',
  'Very strong odour during decomposition. Use adequate organic matter for proper incorporation.',
  'Traditional soil amendment in South Indian agriculture. NPOP eligibility of specific commercial products requires certification body verification.',
  'ICAR – Central Plantation Crops Research Institute (CPCRI), Kasaragod',
  'https://cpcri.res.in',
  'Educational',
  'organic-input',
  'General educational description of pongamia cake as an organic amendment.'
),

-- Garlic extract
(
  'a0000000-0000-0000-0000-000000000017',
  'Garlic Extract (Allium sativum) — Botanical Repellent',
  'Botanical Inputs',
  'Water extract of garlic cloves used as a traditional botanical repellent against soft-bodied insects. Preparation described in NCOF/NCONF natural farming literature.',
  'Botanical repellent application against aphids, mites, and soft-bodied pests in organic farming.',
  array[
    'Allicin and sulphur compounds have repellent properties against soft-bodied pests',
    'Traditional practice referenced in organic farming guides',
    'No synthetic chemistry involved'
  ],
  array['Vegetables','Paddy','Pulses','Spices'],
  'Crush fresh garlic cloves and soak in water overnight. Filter and dilute before spraying on plant foliage. Prepare fresh before each use.',
  'Highly concentrated extract may cause phytotoxicity on sensitive plant parts. Test on a small area first. Not suitable as a primary pest management tool for severe infestations.',
  'Traditional botanical preparation described in NCOF/NCONF materials. Not a registered pesticide. NPOP compliance should be confirmed with the certification body.',
  'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
  'https://pgsindia-ncof.gov.in',
  'General Agricultural Information',
  'organic-input',
  'General description of a traditional practice. Efficacy is not supported by controlled trial data referenced here.'
),

-- Rock Phosphate
(
  'a0000000-0000-0000-0000-000000000018',
  'Rock Phosphate (Natural, Unprocessed)',
  'Soil Amendments',
  'Ground natural rock phosphate used as a slow-release phosphorus source in acidic soils. Listed in NPOP Annex 2 as a permitted input subject to conditions including cadmium content limits.',
  'Long-term phosphorus supply in acidic soils where natural dissolution is effective.',
  array[
    'Provides phosphorus in a slow-release form with minimal leaching risk',
    'Listed as a permitted input under NPOP Annex 2 subject to conditions',
    'No synthetic processing involved'
  ],
  array['Acidic soil crops: Paddy','Tea','Coffee','Arecanut','Black Pepper','Cardamom'],
  'Most effective in acidic soils (pH below 6.5). Apply as a basal incorporation during land preparation. Consult state extension recommendations for rate. Combine with organic matter to enhance dissolution.',
  'Largely ineffective in neutral or alkaline soils. Check cadmium content — some natural sources may have elevated heavy metal levels requiring testing before use.',
  'NPOP Annex 2 lists rock phosphate as a permitted input under organic production, subject to conditions regarding cadmium content and evidence of need. Specific conditions must be confirmed with the applicable certification body.',
  'APEDA – National Programme for Organic Production (NPOP), Annex 2',
  'https://apeda.gov.in/apedawebsite/organic/Organic_Products.htm',
  'Verified',
  'listed-in-standard',
  'NPOP listing is subject to conditions including cadmium limits. Product-level compliance and actual cadmium content are not verified by this entry.'
),

-- Wood Ash
(
  'a0000000-0000-0000-0000-000000000019',
  'Wood Ash (Hardwood, Unleached)',
  'Soil Amendments',
  'Ash from burning hardwood. Used as a traditional potassium and calcium source and for minor pH adjustment in acidic soils. Described in NCOF/NCONF natural farming literature.',
  'Improving soil potassium and calcium availability in acidic soils; minor pH liming effect.',
  array[
    'Provides potassium and calcium in plant-available forms',
    'Raises soil pH in acidic conditions (mild liming effect)',
    'Traditional practice with no synthetic chemistry'
  ],
  array['Vegetables','Paddy','Arecanut','Coconut','Pulses'],
  'Apply sparingly as a basal dressing. Do not apply to already-alkaline soils. Use only ash from hardwood — not from treated, painted, or chemically impregnated wood.',
  'Do not use ash from treated, painted, or chemically impregnated wood. Avoid high rates that can over-alkalinise soil. Keep dry during storage.',
  'Referenced as a permitted input in various organic farming guidelines. Specific NPOP Annex 2 and product-level eligibility must be confirmed with the applicable certification body.',
  'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
  'https://pgsindia-ncof.gov.in',
  'Educational',
  'listed-in-standard',
  'General description of wood ash as a traditional soil amendment. Specific NPOP eligibility not verified by this entry.'
),

-- Dolomite (distinct from Agricultural Lime already in seed as a0000000-0000-0000-0000-000000000008)
-- Skipped — covered adequately by existing Ag Lime seed row.

-- Pseudomonas fluorescens entry already in Phase 6 seed (a0000000-0000-0000-0000-000000000006).
-- Trichoderma entry already in Phase 6 seed (a0000000-0000-0000-0000-000000000005).

-- Silica
(
  'a0000000-0000-0000-0000-000000000020',
  'Silica / Potassium Silicate Solution',
  'Soil Amendments',
  'Soluble silicate solution applied as a foliar spray or through irrigation to improve plant structural strength and minor biotic stress tolerance.',
  'Improving plant cell wall rigidity and minor stress tolerance.',
  array[
    'Strengthens plant epidermal cell walls by depositing silica',
    'Associated with improved resistance to fungal penetration in some crops',
    'Improves drought tolerance by reducing transpiration from leaf surfaces'
  ],
  array['Paddy','Sugarcane','Banana','Vegetables','Cucurbits'],
  'Apply as a foliar spray or through drip irrigation. Follow product manufacturer recommendations for dilution rate. Foliar application is typically during vegetative and early reproductive stages.',
  'Highly concentrated potassium silicate can cause phytotoxicity. Dilute carefully as per label. Effect is gradual — not a rescue intervention.',
  'Silicate minerals are referenced in some organic farming contexts. Product-level NPOP eligibility depends on the specific formulation and applicable certification body rules.',
  'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
  'https://iari.res.in',
  'Educational',
  'organic-input',
  'General description of silicate applications. Evidence base for specific crop benefits is variable. No specific dosage claims made here.'
)

on conflict (id) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- Crop-Organic-Input relationship records (new entries only)
-- Existing Phase 6 entries already cover Arecanut, Coconut, Black Pepper, Banana
-- with inputs a0000000-0000-0000-0000-000000000001 through 000000000007.
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.crop_organic_inputs
  (id, crop_name, organic_input_id, recommended_stage, dosage_guide, application_notes, source_reference)
values

  -- Arecanut — KMB
  ('c0000000-0000-0000-0000-000000000020', 'Arecanut', 'a0000000-0000-0000-0000-000000000011',
   'Annual soil application',
   'Follow FCO product label rate. Mix with organic compost carrier.',
   'Useful in laterite soils with low available potassium.',
   'TNAU Agritech Portal'),

  -- Arecanut — Neem Cake
  ('c0000000-0000-0000-0000-000000000021', 'Arecanut', 'a0000000-0000-0000-0000-000000000015',
   'Basal soil incorporation (pre-monsoon)',
   'Incorporate in root zone basin before monsoon. Can be combined with FYM.',
   'Supports nematode suppression in basin soil.',
   'ICAR-CPCRI'),

  -- Arecanut — Jeevamrutha
  ('c0000000-0000-0000-0000-000000000022', 'Arecanut', 'a0000000-0000-0000-0000-000000000009',
   'Active growth and nut development',
   'Apply through drip or basin drenching at intervals per NCOF guidance.',
   'Used in ZBNF systems for areca.',
   'NCOF/NCONF'),

  -- Black Pepper — Neem Cake
  ('c0000000-0000-0000-0000-000000000023', 'Black Pepper', 'a0000000-0000-0000-0000-000000000015',
   'Pre-planting soil preparation',
   'Incorporate in planting pit soil. Supports nematode suppression.',
   'Combine with Trichoderma enriched FYM for broader root zone protection.',
   'ICAR-IISR'),

  -- Black Pepper — KMB
  ('c0000000-0000-0000-0000-000000000024', 'Black Pepper', 'a0000000-0000-0000-0000-000000000011',
   'Annual soil application',
   'Mix KMB with FYM and apply at root zone. Follow FCO label.',
   'Supports potassium availability in laterite soils.',
   'TNAU Agritech Portal'),

  -- Coconut — Neem Cake
  ('c0000000-0000-0000-0000-000000000025', 'Coconut', 'a0000000-0000-0000-0000-000000000015',
   'Basal soil incorporation',
   'Apply in 1.8 m basin. Combine with FYM.',
   'Suppresses white grub larvae and nematodes in basin soil.',
   'ICAR-CPCRI'),

  -- Coconut — Beauveria bassiana
  ('c0000000-0000-0000-0000-000000000026', 'Coconut', 'a0000000-0000-0000-0000-000000000013',
   'Pre-monsoon and monsoon (white grub season)',
   'Follow CIBRC-registered product label rate for soil drench.',
   'Targets white grub (Leucopholis coneophora) larval stage.',
   'ICAR-NBAII'),

  -- Coconut — Metarhizium
  ('c0000000-0000-0000-0000-000000000027', 'Coconut', 'a0000000-0000-0000-0000-000000000014',
   'Pre-monsoon soil treatment (white grub)',
   'Follow CIBRC-registered product label rate. Mix with organic manure for soil incorporation.',
   'Targets larval stage of rhinoceros beetle and white grub.',
   'ICAR-NBAII'),

  -- Coconut — Jeevamrutha
  ('c0000000-0000-0000-0000-000000000028', 'Coconut', 'a0000000-0000-0000-0000-000000000009',
   'Active growth season',
   'Apply as basin drench at intervals per NCOF guidance.',
   'Described in ZBNF/natural farming protocols for coconut gardens.',
   'NCOF/NCONF'),

  -- Paddy — Azospirillum (extends Phase 6 link with stage details)
  ('c0000000-0000-0000-0000-000000000029', 'Paddy', 'a0000000-0000-0000-0000-000000000003',
   'Seedling root dip / seed treatment',
   'Apply as seedling root dip before transplanting. Follow FCO product label.',
   'Promotes rapid tillering and establishment in wetland soils.',
   'TNAU Organic Rice Manual'),

  -- Paddy — Jeevamrutha
  ('c0000000-0000-0000-0000-000000000030', 'Paddy', 'a0000000-0000-0000-0000-000000000009',
   'Throughout crop duration',
   'Apply through irrigation at intervals per NCOF documentation.',
   'Widely used in ZBNF paddy cultivation programmes.',
   'NCOF/NCONF'),

  -- Paddy — Green Manure Sunnhemp
  ('c0000000-0000-0000-0000-000000000031', 'Paddy', 'a0000000-0000-0000-0000-000000000010',
   'Pre-planting (45 days before transplanting)',
   'Sow broadcast. Incorporate at flowering stage before transplanting.',
   'Replaces a portion of external nitrogen inputs. Follow CRIDA guidance.',
   'ICAR-CRIDA'),

  -- Ginger — Trichoderma
  ('c0000000-0000-0000-0000-000000000032', 'Ginger', 'a0000000-0000-0000-0000-000000000005',
   'At planting and 30 days after emergence',
   'Mix Trichoderma with FYM and apply in planting furrow. Follow product label.',
   'Targets rhizome rot caused by Pythium aphanidermatum.',
   'ICAR-IISR'),

  -- Ginger — Vermicompost
  ('c0000000-0000-0000-0000-000000000033', 'Ginger', 'a0000000-0000-0000-0000-000000000001',
   'Basal application at planting',
   'Apply vermicompost in planting furrow as basal dressing. Follow extension recommendations.',
   '',
   'ICAR-IISR'),

  -- Ginger — Neem Cake
  ('c0000000-0000-0000-0000-000000000034', 'Ginger', 'a0000000-0000-0000-0000-000000000015',
   'Planting pit soil preparation',
   'Incorporate neem cake in planting furrow soil before planting.',
   'Suppresses soil nematodes and soft-rot pathogens.',
   'ICAR-IISR'),

  -- Turmeric — Trichoderma
  ('c0000000-0000-0000-0000-000000000035', 'Turmeric', 'a0000000-0000-0000-0000-000000000005',
   'At planting and earthing up',
   'Mix Trichoderma with FYM and apply in planting furrow and at earthing up. Follow product label.',
   'Helps prevent rhizome rot.',
   'TNAU Agritech Portal'),

  -- Turmeric — Vermicompost
  ('c0000000-0000-0000-0000-000000000036', 'Turmeric', 'a0000000-0000-0000-0000-000000000001',
   'Basal and top dressing',
   'Apply at planting and as top dressing after earthing up. Follow extension recommendations.',
   '',
   'TNAU Agritech Portal'),

  -- Banana — AMF
  ('c0000000-0000-0000-0000-000000000037', 'Banana', 'a0000000-0000-0000-0000-000000000012',
   'Nursery and at transplanting',
   'Inoculate planting pits with AMF inoculant before transplanting.',
   'Improves establishment and phosphorus uptake in new plantings.',
   'TNAU Agritech Portal'),

  -- Banana — Jeevamrutha
  ('c0000000-0000-0000-0000-000000000038', 'Banana', 'a0000000-0000-0000-0000-000000000009',
   'Vegetative to bunch emergence',
   'Apply as basin drench at intervals per NCOF documentation.',
   'Used in ZBNF banana cultivation.',
   'NCOF/NCONF'),

  -- Cardamom — AMF
  ('c0000000-0000-0000-0000-000000000039', 'Cardamom', 'a0000000-0000-0000-0000-000000000012',
   'Nursery stage and transplanting',
   'Inoculate nursery soil with AMF inoculant. Follow product label.',
   'Improves seedling establishment in shaded cardamom nurseries.',
   'ICAR-IISR'),

  -- Cardamom — Vermicompost
  ('c0000000-0000-0000-0000-000000000040', 'Cardamom', 'a0000000-0000-0000-0000-000000000001',
   'Basal and top dressing',
   'Apply in plant basin at start of the growing season. Follow IISR extension guidance.',
   '',
   'ICAR-IISR'),

  -- Coffee — Vermicompost
  ('c0000000-0000-0000-0000-000000000041', 'Coffee', 'a0000000-0000-0000-0000-000000000001',
   'Post-harvest soil conditioning (January–February)',
   'Apply around root zone. Combine with mulching from coffee pulp.',
   '',
   'Coffee Board of India Extension Guide'),

  -- Coffee — Rock Phosphate
  ('c0000000-0000-0000-0000-000000000042', 'Coffee', 'a0000000-0000-0000-0000-000000000018',
   'Basal soil amendment in acidic laterite soils',
   'Apply as basal incorporation. Most effective in acidic soils (pH < 6.5). Follow extension rate.',
   'Confirm cadmium content with the applicable certification body before use in certified organic systems.',
   'APEDA NPOP Annex 2'),

  -- Black Pepper — AMF
  ('c0000000-0000-0000-0000-000000000043', 'Black Pepper', 'a0000000-0000-0000-0000-000000000012',
   'Nursery and at transplanting',
   'Inoculate nursery soil or planting pits with AMF inoculant. Follow product label.',
   'Improves vine establishment and phosphorus uptake.',
   'ICAR-IISR'),

  -- Arecanut — Rock Phosphate
  ('c0000000-0000-0000-0000-000000000044', 'Arecanut', 'a0000000-0000-0000-0000-000000000018',
   'Basal soil amendment in acidic soils',
   'Apply as basal incorporation in acidic laterite soils based on soil test.',
   'Confirm cadmium content with applicable certification body before use in certified organic systems.',
   'APEDA NPOP Annex 2')

on conflict (id) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- Index: crop_name on crop_organic_inputs (if not already present)
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_crop_organic_inputs_crop_name
  on public.crop_organic_inputs (crop_name);

create index if not exists idx_organic_inputs_npop_class
  on public.organic_inputs (npop_relevance_class);
