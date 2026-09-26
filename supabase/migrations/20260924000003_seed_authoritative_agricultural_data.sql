-- Phase 6: Authoritative Agricultural Seed Data
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform
-- Sources: ICAR, ICAR-CPCRI (Kasargod), ICAR-IISR (Kozhikode), APEDA (NPOP), DPPQS

-- 1. KNOWLEDGE SOURCES
insert into public.knowledge_sources (id, name, organization, website_url, authority_type, description)
values
  ('b0000000-0000-0000-0000-000000000001', 'ICAR', 'Indian Council of Agricultural Research', 'https://icar.org.in', 'Apex Agricultural Research Body', 'National agricultural research and education coordination body of India.'),
  ('b0000000-0000-0000-0000-000000000002', 'APEDA (NPOP)', 'Agricultural and Processed Food Products Export Development Authority', 'https://apeda.gov.in', 'National Organic Regulatory Authority', 'Custodian of the National Programme for Organic Production standards and accreditation.'),
  ('b0000000-0000-0000-0000-000000000003', 'ICAR-CPCRI', 'Central Plantation Crops Research Institute', 'https://cpcri.icar.gov.in', 'National Plantation Crop Research Institute', 'Premier institute for research on coconut, arecanut and cocoa agronomy, crop protection and IPM.'),
  ('b0000000-0000-0000-0000-000000000004', 'ICAR-IISR', 'Indian Institute of Spices Research', 'https://spices.res.in', 'National Spices Research Institute', 'Authority on black pepper, cardamom, ginger, turmeric and spice crops pathology and organic production.'),
  ('b0000000-0000-0000-0000-000000000005', 'CIBRC / DPPQS', 'Central Insecticides Board & Registration Committee', 'https://ppqs.gov.in', 'Statutory Pesticide Regulatory Board', 'Official regulatory board for pesticide registration, label claims, and Pre-Harvest Intervals.')
on conflict (id) do nothing;

-- 2. ORGANIC INPUTS
insert into public.organic_inputs (id, name, category, description, purpose, benefits, suitable_crops, application_information, precautions, organic_relevance, source_name, source_url, verification_status)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    'Vermicompost',
    'Organic Manures',
    'High quality nutrient-rich humus produced through the joint biodegradation of crop biomass and animal dung by earthworms (e.g., Eisenia foetida).',
    'Improves soil structure, water retention, cation exchange capacity, and supplies macro and micronutrients in bioavailable forms.',
    array['Enhances root elongation and mycorrhizal colonization', 'Increases soil organic carbon (SOC) levels', 'Suppresses soil-borne pathogenic fungal damping-off'],
    array['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Coffee', 'Vegetables'],
    'Apply 5-10 kg per arecanut or coconut palm basin annually. For black pepper, apply 2-3 kg per vine around the base ring at monsoon onset.',
    'Keep moist; avoid exposure to direct sunlight to preserve earthworm cocoon viability and beneficial aerobic microorganisms.',
    'Permitted under NPOP Annexure 1 for certified and conversion organic production.',
    'ICAR-CPCRI Extension Bulletin',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Well-Decomposed Farmyard Manure (FYM)',
    'Organic Manures',
    'Aged and aerated mixture of cattle dung, urine, animal bedding straw and farm sweepings decomposed for 4-6 months.',
    'Base soil conditioner and source of slow-release nitrogen, phosphorus and potassium.',
    array['Improves bulk density of heavy soils', 'Increases moisture retention in sandy soils', 'Sustains beneficial earthworm populations'],
    array['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Paddy'],
    'Apply 15-20 kg per adult palm basin incorporated into the top 10-15 cm soil. For black pepper, 5 kg per vine during pre-monsoon shower.',
    'Ensure manure is completely decomposed to prevent grub infestation (e.g. Rhinoceros beetle breeding in raw dung).',
    'Standard permitted farm-derived input under NPOP standards.',
    'ICAR Plantation Crop Package of Practices',
    'https://icar.org.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Azospirillum Biofertilizer',
    'Biofertilizers',
    'Associative microaerophilic nitrogen-fixing bacterium that inoculates root zones and fixes atmospheric nitrogen into ammonium.',
    'Biological nitrogen supplementation and production of growth-promoting hormones (auxins, gibberellins).',
    array['Reduces synthetic nitrogen dependence', 'Stimulates adventitious root formation', 'Improves drought stress tolerance'],
    array['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Paddy'],
    'Mix 50-100 g per palm or 20 g per vine with 5 kg vermicompost or FYM and apply in moist soil basin.',
    'Do not mix directly with copper-based fungicides, chemical fertilizers, or disinfectants. Store in a cool dry place away from heat.',
    'Listed as permitted bio-fertilizer in NPOP Annexure 1.',
    'ICAR-IISR Package of Practices',
    'https://spices.res.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Phosphate Solubilizing Bacteria (PSB)',
    'Biofertilizers',
    'Microbial inoculant containing Pseudomonas or Bacillus strains capable of solubilizing insoluble inorganic phosphorus through organic acid excretion.',
    'Converts unavailable tricalcium, iron, and aluminium phosphates into plant-absorbable orthophosphate forms.',
    array['Releases fixed soil phosphorus', 'Improves root development and tillering', 'Lowers rhizosphere pH beneficially in alkaline soils'],
    array['Arecanut', 'Coconut', 'Black Pepper', 'Banana'],
    'Apply 50 g per palm or 20 g per vine mixed with moist organic manure once or twice a year.',
    'Maintain adequate soil moisture for microbial survival. Apply during morning or evening hours.',
    'Fully permitted biological fertilizer under NPOP guidelines.',
    'ICAR National Biofertilizer Repository',
    'https://icar.org.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'Trichoderma harzianum / viride',
    'Biological / Biocontrol Inputs',
    'Antagonistic fungal biocontrol agent that parasitizes and suppresses soil-borne phytopathogens such as Phytophthora, Pythium, and Rhizoctonia.',
    'Prevention and biological management of root rot, foot rot, quick wilt, and damping-off.',
    array['Secretes chitinases and glucanases that lyse pathogen hyphae', 'Outcompetes pathogens for space and iron in the rhizosphere', 'Induces systemic resistance in plants'],
    array['Black Pepper', 'Arecanut', 'Banana', 'Ginger', 'Vegetables'],
    'Enrich 50 kg vermicompost or FYM with 1 kg Trichoderma formulation; incubate under shade for 10 days maintaining moisture. Apply around vine/tree root zone.',
    'Do not combine with chemical fungicides or systemic fungicides. Allow at least 15 days interval from any fungicide application.',
    'Authoritative biological control organism permitted under NPOP.',
    'ICAR-IISR Black Pepper Management Bulletin',
    'https://spices.res.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'Pseudomonas fluorescens',
    'Biological / Biocontrol Inputs',
    'Beneficial plant growth-promoting rhizobacterium (PGPR) that produces siderophores, salicylic acid, and secondary antimicrobial metabolites.',
    'Bio-control of foliar and soil-borne fungal/bacterial leaf spots, wilt, and root disorders.',
    array['Suppresses leaf blights and Sigatoka leaf spots', 'Produces plant growth stimulants (IAA)', 'Siderophore-mediated iron deprivation of pathogens'],
    array['Banana', 'Black Pepper', 'Arecanut', 'Coconut', 'Paddy'],
    'Foliar spray at 2% concentration (20 g/L or 10 ml/L) or soil drenching around plant basin at 20-50 g per plant in organic carrier.',
    'Use fresh viable cultures. Spray during non-sunny hours (late afternoon) to preserve bacterial viability.',
    'Permitted biocontrol agent under NPOP standards.',
    'ICAR-CPCRI Crop Protection Protocols',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000007',
    'Neem Seed Kernel Extract (NSKE 5%)',
    'Botanical Inputs',
    'Water extract derived from crushed neem (Azadirachta indica) seed kernels containing bioactive tetranortriterpenoids including azadirachtin.',
    'Eco-friendly broad-spectrum insect antifeedant, repellent, and oviposition deterrent.',
    array['Disrupts insect molting and ecdysone hormone production', 'Non-toxic to pollinators when applied at dusk', 'Prevents pesticide resistance development'],
    array['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Vegetables'],
    'Crush 50 g of good quality dried neem seeds into powder, soak in 1 L water overnight, filter through muslin cloth, add 1 ml soap solution/emulsifier, and spray thoroughly.',
    'Prepare fresh and use within 24 hours of extraction. Do not store fermented extract in closed containers.',
    'Classic permitted botanical preparation under NPOP Annexure 1.',
    'National Centre for Organic and Natural Farming (NCONF)',
    'https://pgsindia-ncof.gov.in',
    'General Agricultural Information'
  ),
  (
    'a0000000-0000-0000-0000-000000000008',
    'Agricultural Lime / Dolomite',
    'Soil Amendments',
    'Natural pulverized limestone (calcium carbonate) or dolomite (calcium magnesium carbonate) mineral amendment.',
    'Correction of soil acidity (pH < 5.5) common in high-rainfall Western Ghats plantation soils; provides essential calcium and magnesium.',
    array['Neutralizes aluminium toxicity in acid soils', 'Enhances phosphorus and microbial availability', 'Improves fertilizer and organic manure nutrient uptake'],
    array['Arecanut', 'Coconut', 'Black Pepper', 'Coffee'],
    'Apply 500 g to 1 kg per adult palm basin once in two years based on soil test pH analysis. Apply 100-200 g per black pepper vine basin.',
    'Apply at least 3-4 weeks prior to organic manure or biofertilizer application to prevent nitrogen volatilization.',
    'Natural mineral amendment permitted under NPOP guidelines when certified as unrefined mineral source.',
    'ICAR-CPCRI Soil Health Guidelines',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  )
on conflict (id) do nothing;

-- 3. CROP ORGANIC INPUTS (Relational junction mapping)
insert into public.crop_organic_inputs (id, crop_name, organic_input_id, recommended_stage, dosage_guide, application_notes, source_reference)
values
  -- ARECANUT
  ('c0000000-0000-0000-0000-000000000001', 'Arecanut', 'a0000000-0000-0000-0000-000000000001', 'Pre-Monsoon & Post-Monsoon', '5-10 kg per palm basin annually', 'Apply in 1 m radius basin around palm base and incorporate gently.', 'ICAR-CPCRI Arecanut Package of Practices'),
  ('c0000000-0000-0000-0000-000000000002', 'Arecanut', 'a0000000-0000-0000-0000-000000000002', 'Basin Manuring (May-June)', '15-20 kg per palm basin', 'Ensure complete decomposition to avoid rhinoceros beetle breeding.', 'ICAR-CPCRI Technical Bulletin'),
  ('c0000000-0000-0000-0000-000000000003', 'Arecanut', 'a0000000-0000-0000-0000-000000000003', 'Active Root Flushes (Sept-Oct)', '50 g per palm mixed with FYM', 'Apply in moist soil conditions for optimal bacterial establishment.', 'ICAR National Biofertilizer Directorate'),
  ('c0000000-0000-0000-0000-000000000004', 'Arecanut', 'a0000000-0000-0000-0000-000000000004', 'Post-Monsoon', '50 g per palm in basin', 'Mobilizes fixed soil phosphorus in acidic laterite soils.', 'ICAR-CPCRI Soil Science Dept'),
  ('c0000000-0000-0000-0000-000000000005', 'Arecanut', 'a0000000-0000-0000-0000-000000000007', 'Spindle & Foliar Monitoring', '5% aqueous extract spray', 'Repels mites, caterpillars and phytophagous bugs.', 'NCONF Botanical Protocols'),
  ('c0000000-0000-0000-0000-000000000006', 'Arecanut', 'a0000000-0000-0000-0000-000000000008', 'Pre-Monsoon (April-May)', '500 g to 1 kg per palm based on soil test', 'Broadcast in basin 3 weeks before manure application.', 'ICAR-CPCRI Soil Health Guidelines'),

  -- COCONUT
  ('c0000000-0000-0000-0000-000000000007', 'Coconut', 'a0000000-0000-0000-0000-000000000001', 'Basin Application (Aug-Sept)', '10-15 kg per palm basin', 'Spread in 1.8 m radius circular basin around tree base.', 'ICAR-CPCRI Coconut Handbook'),
  ('c0000000-0000-0000-0000-000000000008', 'Coconut', 'a0000000-0000-0000-0000-000000000002', 'Pre-Monsoon Manuring', '25-50 kg per palm basin', 'Incorporate into green mulch residues.', 'ICAR-CPCRI Agronomy Guidelines'),
  ('c0000000-0000-0000-0000-000000000009', 'Coconut', 'a0000000-0000-0000-0000-000000000003', 'Active Growing Phase', '100 g per palm in compost carrier', 'Improves leaf chlorophyll and bunch retention.', 'ICAR-CPCRI Microbiology Division'),
  ('c0000000-0000-0000-0000-000000000010', 'Coconut', 'a0000000-0000-0000-0000-000000000004', 'Post-Monsoon', '100 g per palm in compost carrier', 'Supports root phosphorus assimilation.', 'ICAR-CPCRI Microbiology Division'),
  ('c0000000-0000-0000-0000-000000000011', 'Coconut', 'a0000000-0000-0000-0000-000000000007', 'Crown Sanitation & Beetle Prevention', '5% NSKE or Neem Cake mix in crown', 'Apply in leaf axils around spindle leaves.', 'ICAR-CPCRI Entomology Division'),

  -- BLACK PEPPER
  ('c0000000-0000-0000-0000-000000000012', 'Black Pepper', 'a0000000-0000-0000-0000-000000000001', 'Pre-Monsoon & Post-Monsoon', '2-3 kg per vine around standard base', 'Apply in 30 cm radius ring and mulch with dried leaves.', 'ICAR-IISR Package of Practices for Black Pepper'),
  ('c0000000-0000-0000-0000-000000000013', 'Black Pepper', 'a0000000-0000-0000-0000-000000000002', 'Pre-Monsoon Shower (May)', '5-10 kg per vine', 'Keep away from direct contact with vine collar to prevent collar rot.', 'ICAR-IISR Spices Manual'),
  ('c0000000-0000-0000-0000-000000000014', 'Black Pepper', 'a0000000-0000-0000-0000-000000000005', 'Monsoon Onset (June & August)', '50 g Trichoderma enriched compost/vine', 'Crucial biological barrier against Phytophthora capsici quick wilt.', 'ICAR-IISR Phytopathology Bulletin'),
  ('c0000000-0000-0000-0000-000000000015', 'Black Pepper', 'a0000000-0000-0000-0000-000000000006', 'Vegetative Flush', '2% foliar spray or basin drenching', 'Stimulates systemic resistance against anthracnose and slow decline.', 'ICAR-IISR Pathology Division'),
  ('c0000000-0000-0000-0000-000000000016', 'Black Pepper', 'a0000000-0000-0000-0000-000000000008', 'Pre-Monsoon (April)', '100-200 g per vine based on soil pH', 'Neutralizes vine collar acidity; apply 1 month prior to manure.', 'ICAR-IISR Soil Science Bulletin'),

  -- BANANA
  ('c0000000-0000-0000-0000-000000000017', 'Banana', 'a0000000-0000-0000-0000-000000000001', 'Vegetative to Bunch Emergence', '5 kg per plant at planting, 3rd, and 5th month', 'Incorporated into irrigation ring.', 'ICAR-NRCB Banana Package of Practices'),
  ('c0000000-0000-0000-0000-000000000018', 'Banana', 'a0000000-0000-0000-0000-000000000006', '3rd to 7th Month', '2% foliar spray at 25-day intervals', 'Effective biological suppression of Sigatoka leaf spot.', 'ICAR-NRCB Crop Protection Division')
on conflict (id) do nothing;

-- 4. PESTICIDE ADVISORIES (Authoritative IPM Advisory Knowledge Base)
insert into public.pesticide_advisories (id, crop, pest_or_disease, control_category, recommendation, active_ingredient, product_information, application_information, safety_information, source_name, source_url, verification_status)
values
  (
    'd0000000-0000-0000-0000-000000000001',
    'Arecanut',
    'Koleroga / Fruit Rot (Phytophthora meadii)',
    'prevention',
    'Field phytosanitation: Remove and burn all dried and infected bunches and fallen rotted nuts before monsoon onset to eradicate inoculum reserves.',
    null,
    'Sanitation / Cultural Management',
    'Inspect palms in April-May; clean crown area thoroughly.',
    'Do not allow infected bunch mummies to remain in garden basins.',
    'ICAR-CPCRI Disease Management Advisory',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Arecanut',
    'Koleroga / Fruit Rot (Phytophthora meadii)',
    'mechanical',
    'Bunches can be covered with polythene bags (poly-covering) before onset of monsoon rains to prevent water contact and fungal spore deposition.',
    null,
    'Physical Barrier Protection',
    'Cover bunch using 100-150 gauge polythene bags with small drainage holes at base; tie firmly at bunch peduncle.',
    'A physical barrier reduces water contact and spore deposition on the bunch; it does not by itself guarantee complete disease control. Continue scouting and combine with sanitation.',
    'ICAR-CPCRI Sustainable Practice Manual',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'Arecanut',
    'Koleroga / Fruit Rot (Phytophthora meadii)',
    'chemical',
    'Prophylactic protection before the onset of the southwest monsoon is a traditional practice in Koleroga-prone gardens. Any chemical option must be selected and applied only according to the currently applicable registered label and official extension guidance; no dose, concentration, mixing ratio or repeat interval is stated here.',
    null,
    'Copper-based prophylactic fungicide (formulation and registration must be verified against the current CIBRC label for this crop and disease).',
    'Preparation, dilution, spray schedule and number of rounds are label- and extension-specific and are deliberately not stated here. Confirm them from the registered product label or your local agricultural officer before use.',
    'Wear the personal protective equipment specified on the product label. Do not spray in windy or rainy conditions. Observe the pre-harvest interval printed on the label before harvesting edible produce.',
    'ICAR-CPCRI Plant Pathology Guide',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'Coconut',
    'Rhinoceros Beetle (Oryctes rhinoceros)',
    'mechanical',
    'Hook out adult beetles from the infested crown using a barbed iron rod during peak emergence periods.',
    null,
    'Mechanical beetle hooking',
    'Inspect young palms monthly. Extract beetle from feeding hole, seal hole with neem cake + sand mixture.',
    'Work carefully to prevent apical bud damage during extraction.',
    'ICAR-CPCRI Integrated Pest Management Bulletin',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    'Coconut',
    'Rhinoceros Beetle (Oryctes rhinoceros)',
    'biological',
    'Incorporate a Metarhizium anisopliae-based biocontrol preparation into cattle-manure pits and other organic breeding sites so that the fungus can suppress developing beetle stages. Use a preparation that carries a valid biopesticide registration and follow its label for dosage and interval.',
    'Metarhizium anisopliae',
    'Metarhizium anisopliae bio-formulation (use a product bearing a valid biopesticide registration; spore count, carrier and shelf life are product-specific and are not stated here).',
    'Mix into manure pits or breeding material as directed on the product label, typically ahead of the pre-monsoon showers; repeat as advised by the label or extension guidance. No quantity per unit volume is stated here because it is formulation-specific.',
    'Handle all biological preparations as directed on the label. Do not assume that a biocontrol agent is harmless to every non-target organism; follow the label precautions and keep treated material away from water bodies.',
    'ICAR-CPCRI Bio-suppression Directorate',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'd0000000-0000-0000-0000-000000000006',
    'Black Pepper',
    'Quick Wilt / Foot Rot (Phytophthora capsici)',
    'prevention',
    'Provide adequate field drainage to prevent water stagnation in the root zone. Mulch vine basins during post-monsoon.',
    null,
    'Cultural and Drainage Management',
    'Cut drainage channels across slope before June monsoon onset.',
    'Water stagnation triggers zoospore release and epidemic infection.',
    'ICAR-IISR Black Pepper Compendium',
    'https://spices.res.in',
    'General Agricultural Information'
  ),
  (
    'd0000000-0000-0000-0000-000000000007',
    'Black Pepper',
    'Quick Wilt / Foot Rot (Phytophthora capsici)',
    'biological',
    'Drench the vine root zone with a Trichoderma harzianum-based biocontrol preparation combined with organic compost incorporation. Apply the quantity and dilution stated on the registered product label or by official extension guidance; no dose is stated here.',
    'Trichoderma harzianum',
    'Trichoderma harzianum bio-formulation (use a preparation bearing a valid biopesticide registration).',
    'Apply as two split rounds aligned with the pre-monsoon and post-monsoon showers as advised on the product label.',
    'Ensure the soil is moist at application. Where a copper-based fungicide is also used, keep the interval stated on the product label between the biological and the copper application.',
    'ICAR-IISR Package of Practices',
    'https://spices.res.in',
    'General Agricultural Information'
  )
on conflict (id) do nothing;

-- 5. KNOWLEDGE ARTICLES
insert into public.knowledge_articles (id, title, category, summary, content, tags, read_minutes, source_name, source_url, verification_status)
values
  (
    'e0000000-0000-0000-0000-000000000001',
    'Organic Conversion & Management Standards under NPOP',
    'Organic Farming',
    'Authoritative breakdown of the National Programme for Organic Production conversion requirements, buffer demarcation, and farm audit registers.',
    '[
      {"heading": "Conversion Periods Required", "points": ["Under NPOP standards, annual field crops require a minimum of 2 years of verified organic management before harvest can be certified organic.", "Perennial plantation crops (such as Arecanut, Coconut, Coffee, and Black Pepper) require a 3-year documented conversion period.", "During this time, the harvest may be labelled as In-Conversion only if recognized in writing by an accredited certification body."]},
      {"heading": "Buffer Zones & Contamination Prevention", "points": ["Maintain a distinct boundary or physical vegetative barrier between organic parcels and neighboring conventional farms.", "Ensure water channels from conventional fields do not drain directly into organic root basins."]},
      {"heading": "Documentation and Audit Ledgers", "points": ["Maintain detailed ledgers for all inputs applied, activities performed, harvest dates, lot numbers and sales.", "All inputs must comply with NPOP permitted annexure lists; retain purchase receipts and batch numbers."]}
    ]'::jsonb,
    array['NPOP', 'APEDA', 'Conversion', 'Certification', 'Compliance'],
    6,
    'APEDA - National Programme for Organic Production (NPOP)',
    'https://apeda.gov.in/organic',
    'General Agricultural Information'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Integrated Pest Management (IPM) Decision Hierarchy',
    'Pest & IPM',
    'The ICAR-recommended step-by-step decision framework emphasizing prevention, biological agents, and judicious use of interventions.',
    '[
      {"heading": "Hierarchy of Intervention", "points": ["Step 1 - Cultural & Mechanical: Sanitation, crop residue burning/composting, yellow sticky traps, light traps, physical barriers.", "Step 2 - Biological Control: Encouraging natural predators, applying Trichoderma, Metarhizium, and Pseudomonas formulations.", "Step 3 - Botanical Preparations: Fresh Neem Seed Kernel Extract (NSKE 5%), neem oil, and botanical repellents.", "Step 4 - Chemical Control as Last Resort: Applied only after reaching Economic Threshold Level (ETL) with strict adherence to label dosages and pre-harvest intervals."]},
      {"heading": "Safety and Environmental Principles", "points": ["Authoritative information must always be verified from CIBRC registered label claims.", "Never exceed recommended concentrations or reduce Pre-Harvest Intervals (PHI) before harvesting edible produce."]}
    ]'::jsonb,
    array['IPM', 'Biocontrol', 'Decision Hierarchy', 'ICAR', 'Safety'],
    7,
    'ICAR Integrated Pest Management Guidelines',
    'https://icar.org.in',
    'General Agricultural Information'
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'Soil Organic Carbon Management in Plantation Agroforestry',
    'Soil Health',
    'Methods to build and maintain soil organic carbon (SOC) levels above 1.0% in high-rainfall tropical plantation soils.',
    '[
      {"heading": "Why Soil Organic Carbon Matters", "points": ["SOC directly determines cation exchange capacity, phosphorus availability, and water retention capacity in laterite and red loamy soils.", "Tropical soils subject to heavy southwest monsoon leaching lose uncomplexed organic matter rapidly if left unmulched."]},
      {"heading": "Effective In-Situ Practices", "points": ["Annual basin incorporation of 15-20 kg FYM or 5-10 kg vermicompost per palm.", "Growing cover crops such as Sunn hemp (Crotalaria juncea) or Mucuna bracteata incorporated at 45-50 days.", "Recycling all arecanut and coconut fronds by shredding and composting rather than burning."]}
    ]'::jsonb,
    array['Soil Health', 'Organic Carbon', 'Cover Crops', 'Compost', 'Laterite'],
    5,
    'ICAR-CPCRI Soil Science Bulletin',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    'Farm Residue Recycling & Vermicomposting Technology',
    'Waste Management',
    'Standard operating procedure for converting farm crop residue, dried arecanut husks and cattle manure into vermicompost.',
    '[
      {"heading": "Waste Segregation and Preparation", "points": ["Segregate fibrous biomass (areca husks, coconut coir pith) from soft leaves and animal dung.", "Chop tough residues and pre-compost with cow dung slurry for 2-3 weeks to soften lignocellulosic bonds."]},
      {"heading": "Worm Bed Maintenance", "points": ["Maintain 60-70% moisture content in vermicompost pits; never let beds dry out or become waterlogged.", "Keep beds shaded from direct rain and solar radiation; maintain temperature between 25°C and 32°C."]}
    ]'::jsonb,
    array['Vermicompost', 'Waste Recycling', 'Biomass', 'Eisenia foetida'],
    5,
    'ICAR-CPCRI Waste Management Technology',
    'https://cpcri.icar.gov.in',
    'General Agricultural Information'
  )
on conflict (id) do nothing;
