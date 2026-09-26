/**
 * organicKnowledge.ts
 *
 * Curated organic-farming knowledge library.
 *
 * IMPORTANT NOTES ON DATA QUALITY:
 * ─────────────────────────────────
 * Every record must carry:
 *   • source_name     – the named organisation or publication
 *   • source_url      – the canonical URL (never an e-commerce page)
 *   • verification_status – one of the OrganicVerificationStatus values
 *   • limitation      – what the source does NOT prove
 *
 * Records labelled 'Educational' or 'General Agricultural Information' contain
 * no invented quantities. Where specific figures appear, they are marked
 * 'Source-backed' and cited.
 *
 * This file does NOT:
 *   • claim any product is "NPOP certified"
 *   • claim any product is "approved organic"
 *   • make clinical or chemical safety claims
 *   • fabricate dosage, concentration, or PHI values
 *
 * Sources used (authoritative Indian agricultural institutions):
 *   ICAR-IISS  – iiss.icar.gov.in
 *   ICAR-IISR  – spices.res.in
 *   ICAR-CPCRI – cpcri.res.in
 *   ICAR-IARI  – iari.res.in
 *   TNAU       – agritech.tnau.ac.in
 *   NCONF/NCOF – pgsindia-ncof.gov.in
 *   APEDA/NPOP – apeda.gov.in
 */

import {
  OrganicInputViewItem,
  OrganicInputCropLink,
  OrganicPractice,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// CURATED ORGANIC INPUT RECORDS
// ─────────────────────────────────────────────────────────────────────────────

export const ORGANIC_INPUTS: OrganicInputViewItem[] = [
  // ── ORGANIC MANURES ──────────────────────────────────────────────────────
  {
    id: 'oi-001',
    name: 'Vermicompost (Earthworm Castings)',
    category: 'Organic Manures',
    summary:
      'Decomposed organic material processed by earthworms (commonly Eisenia fetida). Produces a nutrient-rich, biologically active soil amendment.',
    purpose: 'Soil conditioning, microbial enrichment, and slow-release nutrient supply.',
    benefits: [
      'Improves soil structure and water-retention capacity',
      'Supplies plant-available nutrients including nitrogen, phosphorus, and potassium',
      'Increases beneficial microbial activity in the root zone',
      'Contributes to soil organic carbon build-up over time',
    ],
    mode_of_action:
      'Earthworm digestion and gut microbiome activity transform complex organic matter into humus with a low carbon-to-nitrogen ratio, making nutrients more accessible to plants.',
    suitable_crops: ['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Paddy', 'Vegetables', 'Coffee', 'Cardamom', 'Ginger', 'Turmeric'],
    application_guidance:
      'Apply around the root zone or incorporate into the soil during land preparation. Follow specific crop extension recommendations for quantities and timing.',
    precautions:
      'Keep stored vermicompost moist and shaded. Do not apply fresh, unmatured material. Protect from waterlogging.',
    classification: 'organic-input',
    classification_note:
      'Vermicompost is widely used in organic farming systems. Whether a specific batch meets a certification standard depends on the feedstocks used, the certification body, and applicable regulations — not on the material category alone.',
    source_name: 'ICAR – Indian Institute of Soil Science (IISS), Bhopal',
    source_kind: 'Research Institute',
    source_url: 'https://iiss.icar.gov.in',
    verification_status: 'Source-backed',
    last_verified: '2025-11-01',
    limitation:
      'Source provides general guidance on vermicompost properties. It does not certify specific products or verify any farm\'s compliance with NPOP or other certification standards.',
    related_practice_ids: ['prac-001'],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-002',
    name: 'Farmyard Manure (FYM)',
    category: 'Organic Manures',
    summary:
      'Composted mixture of animal dung, urine, and bedding material (straw, husk). One of the oldest and most widely used organic soil amendments.',
    purpose: 'Baseline organic carbon replenishment, soil structure improvement, and broad-spectrum nutrient supply.',
    benefits: [
      'Adds organic matter that improves soil tilth and water-holding capacity',
      'Provides a slow-release source of nitrogen, phosphorus, and potassium',
      'Supports earthworm populations and soil biodiversity',
      'Improves drainage in clay soils and moisture retention in sandy soils',
    ],
    mode_of_action:
      'Microbial decomposition of the composted dung-straw mixture releases macro and micronutrients gradually, reducing leaching compared to soluble synthetic fertilisers.',
    suitable_crops: ['Arecanut', 'Coconut', 'Black Pepper', 'Paddy', 'Sugarcane', 'Banana', 'Vegetables', 'Pulses', 'Millets'],
    application_guidance:
      'Use well-decomposed (cured) material. Apply during land preparation or as a basal dressing. Avoid application of fresh manure near harvest time. Consult state agricultural extension recommendations for quantities.',
    precautions:
      'Fresh manure may carry weed seeds and pathogens. Ensure sufficient composting time. Do not apply in excess as it can cause nutrient imbalances.',
    classification: 'organic-input',
    classification_note:
      'FYM is a traditional organic input. Whether it qualifies under a specific certification programme depends on the feedstocks, composting process, and the rules of the applicable certification body.',
    source_name: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_kind: 'Research Institute',
    source_url: 'https://iari.res.in',
    verification_status: 'Educational',
    last_verified: '2025-10-15',
    limitation:
      'General educational description of FYM. Does not constitute product-level verification or certification advice.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-003',
    name: 'Jeevamrutha (Fermented Microbial Inoculant)',
    category: 'Organic Manures',
    summary:
      'A fermented liquid biological preparation made from cow dung, cow urine, jaggery, pulse flour, and soil, used to introduce beneficial soil microorganisms.',
    purpose: 'Rapid establishment of beneficial soil microflora and mobilisation of native soil nutrients.',
    benefits: [
      'Introduces diverse beneficial bacteria and fungi into the root zone',
      'Promotes decomposition of crop residues and mulch',
      'Supports earthworm activity in the top soil',
      'Used extensively in Zero Budget Natural Farming (ZBNF) systems',
    ],
    mode_of_action:
      'Fermentation of organic substrates (jaggery, pulse flour) with indigenous cow dung microflora creates a culture of native soil microorganisms which, when applied to the field, can colonise the rhizosphere.',
    suitable_crops: ['Paddy', 'Arecanut', 'Coconut', 'Vegetables', 'Pulses', 'Millets', 'Black Pepper'],
    application_guidance:
      'Apply through irrigation or as a drench around the root zone. Use within a few days of fermentation completion. Prepare fresh batches as required.',
    precautions:
      'Do not mix with chemical fertilisers or synthetic pesticides. Use non-metallic containers for preparation. The preparation window is temperature-sensitive.',
    classification: 'organic-input',
    classification_note:
      'Jeevamrutha is a practice described in ZBNF and promoted by NCOF/NCONF. Its classification under specific certification standards should be confirmed with the applicable certification body.',
    source_name: 'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
    source_kind: 'Government Portal',
    source_url: 'https://pgsindia-ncof.gov.in',
    verification_status: 'Source-backed',
    last_verified: '2025-12-01',
    limitation:
      'Source describes the preparation method and stated purpose. It does not certify individual batches or guarantee specific microbial counts.',
    related_practice_ids: ['prac-002'],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-004',
    name: 'Green Manure — Sunnhemp (Crotalaria juncea)',
    category: 'Organic Manures',
    summary:
      'A fast-growing leguminous cover crop incorporated into the soil while green to replenish nitrogen and organic matter.',
    purpose: 'In-situ biological nitrogen fixation, organic matter addition, and weed suppression.',
    benefits: [
      'Fixes atmospheric nitrogen through root nodule bacteria (Rhizobium)',
      'Rapid biomass production improves soil organic carbon when incorporated',
      'Can suppress certain nematode populations in the soil',
      'Protects topsoil from erosion during pre-monsoon rains',
    ],
    mode_of_action:
      'Symbiotic nitrogen fixation by Rhizobium bacteria in root nodules captures atmospheric nitrogen. Incorporation of green biomass adds readily decomposable organic matter.',
    suitable_crops: ['Paddy', 'Sugarcane', 'Banana', 'Arecanut (interspace)', 'Coconut (interspace)', 'Maize'],
    application_guidance:
      'Sow broadcast with pre-monsoon rains. Incorporate into soil at the flowering stage before stems become lignified. Follow state extension recommendations for seeding rate and timing.',
    precautions:
      'Incorporate before full maturity to avoid nitrogen immobilisation. Ensure sufficient soil moisture for rapid decomposition after incorporation.',
    classification: 'organic-input',
    classification_note:
      'Green manure is a standard organic soil management practice. Incorporation timing and method must follow crop-specific extension guidance.',
    source_name: 'ICAR – Central Research Institute for Dryland Agriculture (CRIDA)',
    source_kind: 'Research Institute',
    source_url: 'https://crida.icar.gov.in',
    verification_status: 'Educational',
    last_verified: '2025-09-01',
    limitation:
      'General description of sunnhemp as a green manure crop. Specific nitrogen fixation values depend on soil type, inoculation, and growing conditions.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  // ── BIOFERTILIZERS ────────────────────────────────────────────────────────
  {
    id: 'oi-005',
    name: 'Azospirillum (Nitrogen-Fixing Biofertiliser)',
    category: 'Biofertilizers',
    summary:
      'A carrier-based or liquid biofertiliser containing nitrogen-fixing bacteria (genus Azospirillum) that colonise the rhizosphere and root cortex of non-leguminous crops.',
    purpose: 'Atmospheric nitrogen fixation in the root zone and production of plant growth-promoting hormones.',
    benefits: [
      'Fixes a portion of atmospheric nitrogen, potentially reducing external nitrogen requirements',
      'Produces plant growth hormones (IAA, gibberellins) that promote root development',
      'Registered biofertiliser under the Fertiliser Control Order (FCO), India',
    ],
    mode_of_action:
      'Azospirillum bacteria establish an associative relationship with crop roots and fix nitrogen using the nitrogenase enzyme complex. They also synthesise phytohormones that stimulate lateral root growth.',
    suitable_crops: ['Paddy', 'Maize', 'Millets', 'Sugarcane', 'Arecanut', 'Coconut', 'Vegetables'],
    application_guidance:
      'Apply as seed treatment, seedling root dip, or soil application mixed with organic carrier. Follow FCO-compliant product label instructions for rate and method.',
    precautions:
      'Do not mix with chemical fungicides or weedicides at the time of application. Store in a cool, dry place away from direct sunlight. Use before the expiry date on the product label.',
    classification: 'listed-in-standard',
    classification_note:
      'Azospirillum is listed as a standard biofertiliser under the Fertiliser Control Order (FCO) of India. Whether a specific commercial product is permitted under NPOP or another certification programme depends on the product\'s manufacturing standards and the applicable certification body rules.',
    source_name: 'Tamil Nadu Agricultural University (TNAU) Agritech Portal',
    source_kind: 'University Portal',
    source_url: 'https://agritech.tnau.ac.in',
    verification_status: 'Source-backed',
    last_verified: '2025-11-15',
    limitation:
      'Source provides general guidance on Azospirillum. Specific nitrogen fixation quantities vary by crop, soil, and strain. FCO listing ≠ NPOP certification.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-006',
    name: 'Phosphate Solubilising Bacteria (PSB)',
    category: 'Biofertilizers',
    summary:
      'Biofertiliser containing bacteria (such as Bacillus megaterium or Pseudomonas) that secrete organic acids to convert insoluble soil phosphorus into plant-available forms.',
    purpose: 'Unlocking fixed native soil phosphorus and reducing dependence on external phosphatic inputs.',
    benefits: [
      'Solubilises insoluble soil phosphates through organic acid secretion',
      'Can reduce external phosphorus requirements in combination with organic matter addition',
      'FCO-registered biofertiliser widely used in India',
    ],
    mode_of_action:
      'PSB bacteria produce organic acids (citric, gluconic) and enzymes (phosphatase) that react with calcium, iron, and aluminium phosphates in soil, releasing orthophosphate ions into the soil solution.',
    suitable_crops: ['Paddy', 'Pulses', 'Arecanut', 'Black Pepper', 'Oilseeds', 'Vegetables', 'Millets'],
    application_guidance:
      'Apply as soil application mixed with organic matter, or as seed/seedling treatment. Follow FCO-compliant product label. Best combined with Azospirillum and organic compost.',
    precautions:
      'Requires adequate soil moisture and organic matter for effective colonisation. Do not mix with chemical fertilisers at time of application.',
    classification: 'listed-in-standard',
    classification_note:
      'PSB is listed under the Fertiliser Control Order (FCO), India. Certification eligibility under NPOP or other organic standards depends on the specific product and the applicable certification body rules.',
    source_name: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_kind: 'Research Institute',
    source_url: 'https://iari.res.in',
    verification_status: 'Source-backed',
    last_verified: '2025-10-01',
    limitation:
      'Source covers PSB as a biofertiliser category. Effectiveness is highly soil- and strain-dependent. FCO listing ≠ NPOP certification.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-007',
    name: 'Potassium Mobilising Bacteria (KMB)',
    category: 'Biofertilizers',
    summary:
      'Biofertiliser containing bacteria that can mobilise potassium from silicate minerals and organic matter in the soil.',
    purpose: 'Improving potassium availability in potassium-fixing soils, especially laterite and red soils.',
    benefits: [
      'Mobilises potassium from soil mineral reserves',
      'Produces plant growth-promoting substances as a secondary effect',
      'FCO-registered biofertiliser in India',
    ],
    mode_of_action:
      'KMB bacteria produce organic acids and exopolysaccharides that weather potassium-bearing silicate minerals, releasing potassium ions into the soil solution.',
    suitable_crops: ['Arecanut', 'Coconut', 'Black Pepper', 'Paddy', 'Banana', 'Vegetables'],
    application_guidance:
      'Apply as soil drench or mix with organic compost as carrier. Follow product label instructions. Combine with PSB and Azospirillum for a biofertiliser consortium approach.',
    precautions:
      'Efficacy depends on soil type and mineral potassium reserves. Store in cool conditions and use before expiry.',
    classification: 'listed-in-standard',
    classification_note:
      'KMB is listed under the Fertiliser Control Order (FCO), India. Suitability under organic certification programmes depends on product-level compliance and the applicable standard.',
    source_name: 'Tamil Nadu Agricultural University (TNAU) Agritech Portal',
    source_kind: 'University Portal',
    source_url: 'https://agritech.tnau.ac.in',
    verification_status: 'Source-backed',
    last_verified: '2025-11-01',
    limitation:
      'General guidance on KMB category. Specific mobilisation rates depend on soil mineralogy, strain, and conditions.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-008',
    name: 'Mycorrhizal Fungi (Arbuscular Mycorrhizal Fungi — AMF)',
    category: 'Biofertilizers',
    summary:
      'Symbiotic root-colonising fungi that extend the effective root absorptive surface, improving phosphorus and water uptake.',
    purpose: 'Enhancing phosphorus acquisition, drought tolerance, and general plant establishment.',
    benefits: [
      'Extends the effective root surface area for nutrient and water uptake',
      'Particularly effective for phosphorus acquisition in low-P soils',
      'Improves seedling establishment and transplant survival',
      'Promotes soil aggregate stability through hyphal networks',
    ],
    mode_of_action:
      'AMF hyphae extend far beyond the root depletion zone, accessing soil pores that roots cannot reach, and transporting phosphorus and water back to the host plant in exchange for carbon.',
    suitable_crops: ['Arecanut', 'Coconut', 'Black Pepper', 'Coffee', 'Banana', 'Cardamom', 'Ginger', 'Turmeric'],
    application_guidance:
      'Apply as a soil inoculant during transplanting or nursery stage. Avoid application alongside phosphatic fertilisers or fungicides, which can reduce colonisation.',
    precautions:
      'AMF inoculants are sensitive to chemical fungicides. Do not apply to soil that has been sterilised. Efficacy is reduced in high-phosphorus soils.',
    classification: 'organic-input',
    classification_note:
      'Mycorrhizal inoculants are widely used in organic and sustainable agriculture. Product-level eligibility under specific certification standards should be confirmed with the applicable certification body.',
    source_name: 'ICAR – Indian Institute of Spices Research (IISR), Calicut',
    source_kind: 'Research Institute',
    source_url: 'https://spices.res.in',
    verification_status: 'Educational',
    last_verified: '2025-09-15',
    limitation:
      'General educational description of AMF. Efficacy varies considerably by crop, soil, and strain. Not all commercial AMF products are equivalent.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  // ── BIOLOGICAL / BIOCONTROL INPUTS ───────────────────────────────────────
  {
    id: 'oi-009',
    name: 'Trichoderma viride / harzianum (Biological Fungicide)',
    category: 'Biological / Biocontrol Inputs',
    summary:
      'Antagonistic soil fungus used as a biological control agent against soil-borne fungal pathogens including Pythium, Phytophthora, Fusarium, and Rhizoctonia.',
    purpose: 'Biological management of root rot, damping-off, and wilt diseases caused by soil-borne fungi.',
    benefits: [
      'Parasitises and competes with pathogenic soil fungi',
      'Produces enzymes and secondary metabolites that inhibit pathogen growth',
      'Does not leave synthetic chemical residues in soil or produce',
      'Promotes plant root growth as a secondary effect',
    ],
    mode_of_action:
      'Trichoderma hyperparasitises fungal pathogens through a combination of competition for nutrients and space, mycoparasitism (direct attack), and production of cell wall-degrading enzymes and antifungal metabolites.',
    suitable_crops: ['Black Pepper', 'Arecanut', 'Ginger', 'Turmeric', 'Tomato', 'Paddy', 'Cardamom', 'Coffee'],
    application_guidance:
      'Mix the commercial formulation with well-decomposed organic manure and apply to the root zone as a soil drench or incorporated amendment. Follow product label instructions for rate. Avoid use of chemical fungicides within the recommended period before or after application.',
    precautions:
      'Keep away from chemical fungicides and copper-based compounds. Product is living organism — store in cool conditions and use before expiry. High soil temperatures can reduce viability.',
    classification: 'organic-input',
    classification_note:
      'Trichoderma formulations are listed as biocontrol agents by CIBRC (Central Insecticides Board and Registration Committee). Whether a specific registered product is permitted under NPOP Annex 2 depends on product registration and the applicable certification body\'s input list. "Biocontrol agent" ≠ automatically NPOP-permitted.',
    source_name: 'ICAR – Indian Institute of Spices Research (IISR), Calicut',
    source_kind: 'Research Institute',
    source_url: 'https://spices.res.in',
    verification_status: 'Source-backed',
    last_verified: '2025-11-20',
    limitation:
      'Source covers Trichoderma as a biocontrol agent for spice crops. Specific products must be evaluated individually for NPOP or other certification compliance.',
    related_practice_ids: ['prac-003'],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-010',
    name: 'Pseudomonas fluorescens (Bacterial Biocontrol Agent)',
    category: 'Biological / Biocontrol Inputs',
    summary:
      'Antagonistic bacteria used as a biological control agent against soil-borne fungal and bacterial plant pathogens and as a plant growth promoter.',
    purpose: 'Biological disease suppression and promotion of plant root establishment.',
    benefits: [
      'Produces antifungal compounds (2,4-DAPG, pyoluteorin) that suppress soil pathogens',
      'Induces systemic resistance in host plants',
      'Promotes root growth through IAA production',
      'CIBRC-registered biocontrol agent',
    ],
    mode_of_action:
      'Colonises the rhizosphere and produces antibiotic compounds and siderophores that reduce soil pathogen populations, while also triggering induced systemic resistance (ISR) in the host plant.',
    suitable_crops: ['Paddy', 'Tomato', 'Ginger', 'Turmeric', 'Arecanut', 'Black Pepper', 'Pulses'],
    application_guidance:
      'Apply as seed treatment, seedling root dip, or soil drench. Follow CIBRC-registered product label instructions. Can be combined with Trichoderma for broader-spectrum protection.',
    precautions:
      'Do not mix with chemical bactericides or fungicides at time of application. Store in cool, dry conditions. Use before the expiry date.',
    classification: 'organic-input',
    classification_note:
      'CIBRC-registered biocontrol agent. Whether a specific product is permitted under NPOP requires checking the product registration details against the applicable certification body\'s input list.',
    source_name: 'Tamil Nadu Agricultural University (TNAU) Agritech Portal',
    source_kind: 'University Portal',
    source_url: 'https://agritech.tnau.ac.in',
    verification_status: 'Source-backed',
    last_verified: '2025-10-01',
    limitation:
      'Source provides general guidance. Product-level NPOP eligibility is not established by this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-011',
    name: 'Beauveria bassiana (Entomopathogenic Fungus)',
    category: 'Biological / Biocontrol Inputs',
    summary:
      'A naturally occurring soil fungus that infects and kills a broad range of insect pests when spores contact the insect cuticle.',
    purpose: 'Biological management of insect pests including white grubs, thrips, whitefly, and stem borers.',
    benefits: [
      'Infects insects on contact — no ingestion required',
      'Broad pest spectrum across insect orders',
      'Does not leave synthetic chemical residues',
      'CIBRC-registered biocontrol agent in India',
    ],
    mode_of_action:
      'Conidia (spores) attach to insect cuticle, germinate, penetrate the cuticle, and multiply within the insect body, producing toxins (beauvericins) and causing death. Dead insects become a source of further spore dispersal.',
    suitable_crops: ['Sugarcane', 'Paddy', 'Cardamom', 'Tea', 'Coffee', 'Arecanut', 'Vegetables'],
    application_guidance:
      'Apply as a foliar spray or soil drench depending on the target pest and its life stage. Follow CIBRC-registered product label. Spray in the early morning or evening to protect spores from UV degradation.',
    precautions:
      'Sensitive to direct sunlight and high temperatures — spray during cooler parts of the day. Incompatible with chemical fungicides. Store under refrigeration if specified on the product label.',
    classification: 'organic-input',
    classification_note:
      'CIBRC-registered biocontrol agent. NPOP eligibility depends on specific product registration and applicable certification body input approval.',
    source_name: 'ICAR – National Bureau of Agriculturally Important Insects (NBAII), Bengaluru',
    source_kind: 'Research Institute',
    source_url: 'https://nbaii.icar.gov.in',
    verification_status: 'Source-backed',
    last_verified: '2025-09-01',
    limitation:
      'General guidance on Beauveria bassiana. Efficacy is pest-species and formulation-specific. No specific dosage claims made here.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-012',
    name: 'Metarhizium anisopliae (Entomopathogenic Fungus)',
    category: 'Biological / Biocontrol Inputs',
    summary:
      'A naturally occurring entomopathogenic fungus used for biological control of soil-dwelling and surface insects including white grubs and locusts.',
    purpose: 'Biological management of soil insect pests, particularly white grubs and root-feeding beetle larvae.',
    benefits: [
      'Highly effective against soil-dwelling larval stages of beetles',
      'Persists in soil and can provide residual protection',
      'CIBRC-registered in India for specific crops and pests',
    ],
    mode_of_action:
      'Similar to Beauveria bassiana — conidia germinate on host cuticle, penetrate the integument, and colonise the insect body, producing toxins that lead to death.',
    suitable_crops: ['Sugarcane', 'Paddy', 'Turmeric', 'Groundnut', 'Coconut (white grub)'],
    application_guidance:
      'Apply as a soil drench or mix with organic manure for soil incorporation targeting larvae. Follow product label instructions for CIBRC-registered formulations.',
    precautions:
      'Avoid concurrent application of chemical fungicides. Soil moisture is important for fungal activity. Use before expiry date.',
    classification: 'organic-input',
    classification_note:
      'CIBRC-registered biocontrol agent. NPOP eligibility depends on product-level registration and applicable certification body rules.',
    source_name: 'ICAR – National Bureau of Agriculturally Important Insects (NBAII), Bengaluru',
    source_kind: 'Research Institute',
    source_url: 'https://nbaii.icar.gov.in',
    verification_status: 'Educational',
    last_verified: '2025-09-01',
    limitation:
      'General description of Metarhizium as a biocontrol agent. Specific crop-pest registrations and NPOP eligibility not established by this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-013',
    name: 'Neem Cake (Cold-Pressed, De-oiled)',
    category: 'Botanical Inputs',
    summary:
      'Residue remaining after cold-pressing neem seeds for oil. Contains azadirachtin and other limonoids. Used as a soil amendment with pest-suppressive properties.',
    purpose: 'Soil organic matter addition with secondary nematode-suppressive and slow-release nitrogen effects.',
    benefits: [
      'Adds organic nitrogen to soil as it decomposes',
      'Contains azadirachtin and neem limonoids with nematode-suppressive properties',
      'Reduces activity of certain soil-dwelling pests and nematodes',
      'Improves soil microbial activity over time',
    ],
    mode_of_action:
      'Decomposes slowly in soil, releasing nitrogen. Neem limonoids act as feeding deterrents and disrupt moulting hormones of soil-dwelling insect larvae and nematodes.',
    suitable_crops: ['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Ginger', 'Turmeric', 'Vegetables', 'Paddy'],
    application_guidance:
      'Incorporate into the root zone soil or apply as a basal amendment during planting. Follow extension recommendations for rate. Can be combined with biofertilisers but apply separately.',
    precautions:
      'De-oiled neem cake has a strong odour. Avoid over-application which can cause temporary nitrogen immobilisation. Ensure product is from seed source, not bark or leaf.',
    classification: 'organic-input',
    classification_note:
      'De-oiled neem cake is widely described as an organic soil amendment and is referenced in various state agricultural extension documents. Whether a specific commercial product is permissible under NPOP Annex 2 requires verification with the applicable certification body.',
    source_name: 'ICAR – Central Plantation Crops Research Institute (CPCRI), Kasaragod',
    source_kind: 'Research Institute',
    source_url: 'https://cpcri.res.in',
    verification_status: 'Source-backed',
    last_verified: '2025-11-01',
    limitation:
      'Source covers neem cake as an amendment for plantation crops. NPOP product-level eligibility not established by this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-014',
    name: 'Neem Seed Kernel Extract (NSKE)',
    category: 'Botanical Inputs',
    summary:
      'Water-based extract of crushed neem seed kernels, rich in azadirachtin, used as a foliar botanical pest deterrent.',
    purpose: 'Botanical management of sucking and chewing insect pests through antifeedant, oviposition-deterrent, and insect growth-regulatory effects.',
    benefits: [
      'Acts as an antifeedant and oviposition deterrent against many insect pests',
      'Disrupts insect moulting (ecdysone-disrupting) leading to larval mortality',
      'Degrades rapidly in the environment, reducing residue risk',
      'No known resistance development in target pests at this time',
    ],
    mode_of_action:
      'Azadirachtin and related limonoids mimic insect steroid hormones, disrupting moulting and reproduction. Secondary components deter feeding by making treated plant surfaces unpalatable to insects.',
    suitable_crops: ['Arecanut', 'Black Pepper', 'Paddy', 'Vegetables', 'Pulses', 'Cardamom', 'Coffee'],
    application_guidance:
      'Prepare a fresh extract by soaking crushed neem kernels in water overnight, filter, and spray on plant foliage. Add a small amount of liquid soap to improve adherence. Spray in the early morning or evening. Use within 24 hours of preparation.',
    precautions:
      'Prepare fresh before each application — extract degrades rapidly. Spray in cooler parts of the day to minimise UV degradation of azadirachtin. Avoid spraying near water bodies, as it can affect aquatic invertebrates at high concentrations.',
    classification: 'organic-input',
    classification_note:
      'NSKE is described as a botanical input in various ICAR and state extension documents. It is not a commercially registered pesticide in India — it is a home-prepared traditional botanical. NPOP compliance should be verified with the applicable certification body.',
    source_name: 'Directorate of Plant Protection, Quarantine & Storage (DPPQS), India',
    source_kind: 'Government Portal',
    source_url: 'https://ppqs.gov.in',
    verification_status: 'Source-backed',
    last_verified: '2025-10-15',
    limitation:
      'Source covers botanical pest management approaches. Specific preparation concentration claims removed as source-dependent — general guidance only.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-015',
    name: 'Pongamia / Karanja Cake (Millettia pinnata)',
    category: 'Botanical Inputs',
    summary:
      'Residue from Pongamia seed after oil extraction. Contains bitter compounds with soil pest-suppressive properties. Used as a soil amendment in plantation crops.',
    purpose: 'Organic soil amendment with nematode and soil insect pest-suppressive secondary effects.',
    benefits: [
      'Adds organic nitrogen as it decomposes in soil',
      'Contains pongamol and karanjin with soil pest-deterrent properties',
      'Available locally in many south Indian farming regions',
    ],
    mode_of_action:
      'Bitter limonoid compounds released during decomposition deter soil-dwelling insect larvae and nematodes. Nitrogen content provides a slow-release organic fertiliser effect.',
    suitable_crops: ['Arecanut', 'Coconut', 'Black Pepper', 'Banana', 'Vegetables'],
    application_guidance:
      'Incorporate into the root zone soil as a basal amendment. Follow extension advice for rate and crop. Can be used alongside FYM.',
    precautions:
      'Very strong odour during decomposition. Use adequate organic matter for proper incorporation. Not suitable for sensitive seedlings in high concentrations.',
    classification: 'organic-input',
    classification_note:
      'Pongamia cake is a traditional soil amendment in South Indian agriculture. NPOP eligibility of specific commercial products requires certification body verification.',
    source_name: 'ICAR – Central Plantation Crops Research Institute (CPCRI), Kasaragod',
    source_kind: 'Research Institute',
    source_url: 'https://cpcri.res.in',
    verification_status: 'Educational',
    last_verified: '2025-09-01',
    limitation:
      'General educational description of pongamia cake as an organic amendment.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-016',
    name: 'Garlic Extract (Allium sativum) — Botanical Repellent',
    category: 'Botanical Inputs',
    summary:
      'Water extract or diluted solution of garlic cloves used as a traditional botanical repellent against soft-bodied insects and as a minor antifungal foliar spray.',
    purpose: 'Botanical repellent application against aphids, mites, and minor fungal conditions in organic farming.',
    benefits: [
      'Allicin and sulphur compounds have well-documented repellent properties against soft-bodied pests',
      'Traditional practice referenced in multiple organic farming guides',
      'No synthetic chemistry involved',
    ],
    mode_of_action:
      'Sulphur compounds and allicin in garlic extract act as olfactory repellents for aphids, mites, and some caterpillars. Mechanism is deterrence rather than lethal toxicity.',
    suitable_crops: ['Vegetables', 'Paddy', 'Pulses', 'Spices'],
    application_guidance:
      'Crush fresh garlic cloves and soak in water overnight. Filter and dilute before spraying. Apply to plant foliage. Prepare fresh before each use.',
    precautions:
      'Highly concentrated extract may cause phytotoxicity on sensitive plant parts. Test on a small area first. Not suitable as a primary pest management tool for severe infestations.',
    classification: 'organic-input',
    classification_note:
      'Garlic extract is a traditional botanical preparation. It is not a registered pesticide. Efficacy evidence is largely observational. NPOP compliance should be confirmed with the certification body.',
    source_name: 'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
    source_kind: 'Government Portal',
    source_url: 'https://pgsindia-ncof.gov.in',
    verification_status: 'General Agricultural Information',
    last_verified: '2025-09-01',
    limitation:
      'General description of a traditional practice. Efficacy is not supported by controlled trial data in this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  // ── SOIL AMENDMENTS ────────────────────────────────────────────────────────
  {
    id: 'oi-017',
    name: 'Rock Phosphate (Natural)',
    category: 'Soil Amendments',
    summary:
      'Ground natural rock phosphate used as a slow-release phosphorus source in acidic soils. Listed as a permitted input under various organic standards subject to conditions.',
    purpose: 'Long-term phosphorus supply in acidic soils where natural dissolution is sufficient.',
    benefits: [
      'Provides phosphorus in a slow-release form with minimal leaching risk',
      'Listed as a permitted input under NPOP Annex 2 (subject to conditions)',
      'No synthetic processing involved',
    ],
    mode_of_action:
      'Slow dissolution of calcium phosphate minerals in acidic soil conditions, releasing orthophosphate ions over a period of months to years.',
    suitable_crops: ['Acidic soil crops: Paddy, Tea, Coffee, Arecanut, Black Pepper, Cardamom'],
    application_guidance:
      'Most effective in acidic soils (pH below 6.5). Apply as a basal incorporation during land preparation. Consult state extension recommendations for rate. Combine with organic matter to enhance dissolution.',
    precautions:
      'Largely ineffective in neutral or alkaline soils without acidification. Check cadmium content — some natural sources may have elevated heavy metal levels requiring testing.',
    classification: 'listed-in-standard',
    classification_note:
      'NPOP Annex 2 lists "rock phosphate" as a permitted input under organic production, subject to conditions regarding cadmium content and evidence of need. The specific conditions must be confirmed with the applicable certification body. "Listed in standard" does not mean a specific product is automatically approved.',
    source_name: 'APEDA – National Programme for Organic Production (NPOP), Annex 2',
    source_kind: 'Certification Body',
    source_url: 'https://apeda.gov.in/apedawebsite/organic/Organic_Products.htm',
    verification_status: 'Verified',
    last_verified: '2025-12-01',
    limitation:
      'NPOP listing is subject to conditions including cadmium limits. Product-level compliance and actual cadmium content are not verified by this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-018',
    name: 'Wood Ash (Hardwood, Unleached)',
    category: 'Soil Amendments',
    summary:
      'Ash from burning hardwood, used as a potassium and calcium source and for minor pH adjustment in acidic soils.',
    purpose: 'Improving soil potassium and calcium availability in acidic soils; minor pH liming effect.',
    benefits: [
      'Provides potassium and calcium in plant-available forms',
      'Raises soil pH in acidic conditions (mild liming effect)',
      'Improves availability of other soil nutrients by adjusting pH',
    ],
    mode_of_action:
      'Alkaline compounds (calcium carbonate, potassium carbonate) dissolve in soil water, increasing pH and releasing potassium and calcium ions. Effect is relatively short-term compared to agricultural lime.',
    suitable_crops: ['Vegetables', 'Paddy (acidic soils)', 'Arecanut', 'Coconut', 'Pulses'],
    application_guidance:
      'Apply sparingly as a basal dressing. Avoid over-application, which can raise pH excessively. Do not apply to already-alkaline soils. Use only ash from hardwood — not from treated wood or plastics.',
    precautions:
      'Do not use ash from treated, painted, or chemically impregnated wood. Avoid high rates — can over-alkalinize soil. Keep dry during storage as it absorbs moisture and loses potassium through leaching.',
    classification: 'listed-in-standard',
    classification_note:
      'Wood ash is referenced as a permitted input under various organic farming guidelines. Specific NPOP Annex 2 and product-level eligibility must be confirmed with the applicable certification body.',
    source_name: 'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
    source_kind: 'Government Portal',
    source_url: 'https://pgsindia-ncof.gov.in',
    verification_status: 'Educational',
    last_verified: '2025-09-01',
    limitation:
      'General description of wood ash as a traditional soil amendment. Specific NPOP eligibility not verified by this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-019',
    name: 'Dolomite / Agricultural Lime',
    category: 'Soil Amendments',
    summary:
      'Crushed calcium magnesium carbonate (dolomite) or calcium carbonate (ag lime) used to correct soil acidity and supply calcium and magnesium.',
    purpose: 'Correcting soil acidity and improving calcium and magnesium availability in acidic soils.',
    benefits: [
      'Raises soil pH in acidic soils, improving nutrient availability',
      'Supplies calcium and magnesium (dolomite)',
      'Reduces aluminium and manganese toxicity in strongly acidic soils',
    ],
    mode_of_action:
      'Carbonate minerals react with soil water and H⁺ ions, raising pH and releasing calcium and magnesium ions. Effect is gradual — takes weeks to months depending on soil type and particle size.',
    suitable_crops: ['Arecanut', 'Black Pepper', 'Coffee', 'Tea', 'Paddy', 'Vegetables in acidic laterite soils'],
    application_guidance:
      'Apply based on soil test recommendations for target pH. Incorporate into the soil before planting. Dolomite is preferred for soils deficient in both calcium and magnesium.',
    precautions:
      'Do not apply excessive quantities — raises pH too high, which can cause micronutrient deficiencies. Base application on soil test results.',
    classification: 'listed-in-standard',
    classification_note:
      'Calcium and magnesium carbonates are listed in NPOP Annex 2 as permitted inputs. Use conditions apply. Specific product eligibility must be confirmed with the applicable certification body.',
    source_name: 'APEDA – National Programme for Organic Production (NPOP), Annex 2',
    source_kind: 'Certification Body',
    source_url: 'https://apeda.gov.in/apedawebsite/organic/Organic_Products.htm',
    verification_status: 'Verified',
    last_verified: '2025-12-01',
    limitation:
      'NPOP listing subject to conditions. Product purity and specific eligibility are not established by this entry.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
  {
    id: 'oi-020',
    name: 'Silica / Potassium Silicate Solution',
    category: 'Soil Amendments',
    summary:
      'Soluble silicate solution applied as a foliar spray to improve plant structural strength, stress tolerance, and minor resistance to fungal and pest pressure.',
    purpose: 'Improving plant cell wall rigidity and minor biotic/abiotic stress tolerance.',
    benefits: [
      'Strengthens plant epidermal cell walls by depositing silica',
      'Associated with improved resistance to fungal penetration in some crops',
      'Improves drought tolerance by reducing transpiration from leaf surfaces',
    ],
    mode_of_action:
      'Silicon absorbed by plant roots and leaves is deposited in epidermal cells as phytoliths, increasing cell wall rigidity and creating a physical barrier against fungal penetration and insect feeding.',
    suitable_crops: ['Paddy', 'Sugarcane', 'Banana', 'Vegetables', 'Cucurbits'],
    application_guidance:
      'Apply as a foliar spray or through drip irrigation as recommended by the product manufacturer. Foliar application is typically during vegetative and early reproductive stages.',
    precautions:
      'Highly concentrated potassium silicate can cause phytotoxicity. Dilute carefully as per label. Effect is gradual — not a rescue intervention.',
    classification: 'organic-input',
    classification_note:
      'Silicate minerals are referenced in some organic farming contexts. Product-level NPOP eligibility depends on the specific formulation and applicable certification body rules.',
    source_name: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_kind: 'Research Institute',
    source_url: 'https://iari.res.in',
    verification_status: 'Educational',
    last_verified: '2025-09-01',
    limitation:
      'General description of silicate applications. Evidence base for specific crop benefits is variable. No specific dosage claims made here.',
    related_practice_ids: [],
    provenance: 'curated-knowledge',
    matched_crops: [],
    crop_guidance: [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CROP → INPUT RELATIONSHIP RECORDS
// ─────────────────────────────────────────────────────────────────────────────
// These records replicate what will be seeded into the crop_organic_inputs table.
// They link a specific crop and growth stage to a specific organic input, with
// crop-level guidance from an identified source.

export const CROP_INPUT_LINKS: OrganicInputCropLink[] = [
  // ARECANUT
  { id: 'cl-001', organic_input_id: 'oi-001', crop_name: 'Arecanut', stage: 'Post-monsoon / Basal (October–November)', guidance: 'Apply vermicompost around the root zone basin. Cover with leaf mulch to prevent drying.', source_name: 'ICAR-CPCRI Package of Practices for Arecanut', verification_status: 'Source-backed' },
  { id: 'cl-002', organic_input_id: 'oi-002', crop_name: 'Arecanut', stage: 'Basal application before monsoon (May–June)', guidance: 'Apply well-decomposed FYM around root basin. Combine with biofertilisers for enhanced effect.', source_name: 'ICAR-CPCRI Package of Practices for Arecanut', verification_status: 'Source-backed' },
  { id: 'cl-003', organic_input_id: 'oi-005', crop_name: 'Arecanut', stage: 'Planting and annual soil drenching', guidance: 'Apply as soil drench or mix with FYM. Follow FCO label for rate.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  { id: 'cl-004', organic_input_id: 'oi-013', crop_name: 'Arecanut', stage: 'Basal soil incorporation', guidance: 'Incorporate neem cake in the root zone basin before monsoon. Can be combined with FYM.', source_name: 'ICAR-CPCRI', verification_status: 'Source-backed' },
  { id: 'cl-005', organic_input_id: 'oi-007', crop_name: 'Arecanut', stage: 'Annual soil application', guidance: 'Apply KMB as soil drench mixed with organic carrier. Useful in laterite soils with low available potassium.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  // BLACK PEPPER
  { id: 'cl-006', organic_input_id: 'oi-009', crop_name: 'Black Pepper', stage: 'Pre-monsoon (May–June) and post-monsoon (September)', guidance: 'Mix Trichoderma formulation with decomposed FYM and apply to root zone. Critical for Phytophthora quick wilt management.', source_name: 'ICAR-IISR Black Pepper Management Guidelines', verification_status: 'Source-backed' },
  { id: 'cl-007', organic_input_id: 'oi-001', crop_name: 'Black Pepper', stage: 'Post-monsoon (October)', guidance: 'Apply vermicompost around vine base. Cover with mulch.', source_name: 'ICAR-IISR Package of Practices', verification_status: 'Source-backed' },
  { id: 'cl-008', organic_input_id: 'oi-014', crop_name: 'Black Pepper', stage: 'Spike emergence and berry formation', guidance: 'Spray fresh NSKE solution on foliage. Targets pollu beetle and thrips. Prepare fresh before each spray.', source_name: 'ICAR-IISR IPM in Black Pepper', verification_status: 'Source-backed' },
  { id: 'cl-009', organic_input_id: 'oi-013', crop_name: 'Black Pepper', stage: 'Pre-planting soil preparation', guidance: 'Incorporate neem cake in planting pit soil. Supports nematode suppression.', source_name: 'ICAR-IISR', verification_status: 'Source-backed' },
  // COCONUT
  { id: 'cl-010', organic_input_id: 'oi-001', crop_name: 'Coconut', stage: 'Basal application (May and October)', guidance: 'Apply vermicompost in basin around root zone. Cover with mulch.', source_name: 'ICAR-CPCRI Package of Practices for Coconut', verification_status: 'Source-backed' },
  { id: 'cl-011', organic_input_id: 'oi-002', crop_name: 'Coconut', stage: 'Basal application before monsoon', guidance: 'Apply well-decomposed FYM in the basin. Good for establishing a baseline organic carbon level.', source_name: 'ICAR-CPCRI', verification_status: 'Source-backed' },
  { id: 'cl-012', organic_input_id: 'oi-006', crop_name: 'Coconut', stage: 'Annual soil application', guidance: 'Mix PSB with organic compost and apply around root zone.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  // PADDY
  { id: 'cl-013', organic_input_id: 'oi-005', crop_name: 'Paddy', stage: 'Seedling transplantation / seed treatment', guidance: 'Apply as seedling root dip before transplanting. Follow FCO label.', source_name: 'TNAU Organic Rice Manual', verification_status: 'Source-backed' },
  { id: 'cl-014', organic_input_id: 'oi-006', crop_name: 'Paddy', stage: 'Transplanting / soil application', guidance: 'Apply as soil drench mixed with organic compost at transplanting.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  { id: 'cl-015', organic_input_id: 'oi-004', crop_name: 'Paddy', stage: 'Pre-planting (45 days before transplanting)', guidance: 'Sow sunnhemp broadcast. Incorporate at flowering stage before transplanting.', source_name: 'ICAR-CRIDA', verification_status: 'Source-backed' },
  { id: 'cl-016', organic_input_id: 'oi-003', crop_name: 'Paddy', stage: 'Throughout crop duration', guidance: 'Apply Jeevamrutha through irrigation or drenching as per NCOF protocols.', source_name: 'NCOF/NCONF', verification_status: 'Source-backed' },
  // GINGER
  { id: 'cl-017', organic_input_id: 'oi-009', crop_name: 'Ginger', stage: 'At planting and 30 days after emergence', guidance: 'Mix Trichoderma with FYM and apply in planting furrow. Targets rhizome rot.', source_name: 'ICAR-IISR', verification_status: 'Source-backed' },
  { id: 'cl-018', organic_input_id: 'oi-001', crop_name: 'Ginger', stage: 'Basal application at planting', guidance: 'Apply vermicompost in planting furrow as basal dressing.', source_name: 'ICAR-IISR', verification_status: 'Source-backed' },
  // TURMERIC
  { id: 'cl-019', organic_input_id: 'oi-009', crop_name: 'Turmeric', stage: 'At planting and earthing up', guidance: 'Mix Trichoderma with FYM and apply in planting furrow. Helps prevent rhizome rot.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  { id: 'cl-020', organic_input_id: 'oi-001', crop_name: 'Turmeric', stage: 'Basal and top dressing', guidance: 'Apply vermicompost in planting furrow and as top dressing after earthing up.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  // BANANA
  { id: 'cl-021', organic_input_id: 'oi-001', crop_name: 'Banana', stage: 'Planting and at bunch emergence', guidance: 'Apply vermicompost in planting pit and as a top dressing at regular intervals.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  { id: 'cl-022', organic_input_id: 'oi-005', crop_name: 'Banana', stage: 'Planting and monthly', guidance: 'Apply Azospirillum in planting pit mixed with FYM.', source_name: 'TNAU Agritech Portal', verification_status: 'Source-backed' },
  // CARDAMOM
  { id: 'cl-023', organic_input_id: 'oi-008', crop_name: 'Cardamom', stage: 'Nursery and transplanting', guidance: 'Inoculate nursery soil with AMF inoculant to improve seedling establishment.', source_name: 'ICAR-IISR', verification_status: 'Educational' },
  { id: 'cl-024', organic_input_id: 'oi-001', crop_name: 'Cardamom', stage: 'Basal and top dressing', guidance: 'Apply vermicompost in plant basin at the beginning of the growing season.', source_name: 'ICAR-IISR', verification_status: 'Educational' },
  // COFFEE
  { id: 'cl-025', organic_input_id: 'oi-001', crop_name: 'Coffee', stage: 'Post-harvest soil conditioning (January–February)', guidance: 'Apply vermicompost around the root zone. Combine with mulching from coffee pulp.', source_name: 'Coffee Board of India Extension Guide', verification_status: 'Educational' },
  { id: 'cl-026', organic_input_id: 'oi-017', crop_name: 'Coffee', stage: 'Basal soil amendment in acidic laterite soils', guidance: 'Apply rock phosphate as a basal incorporation. Most effective in acidic soils where natural dissolution occurs.', source_name: 'APEDA NPOP Annex 2', verification_status: 'Verified' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIC PRACTICES (preparation & execution protocols)
// ─────────────────────────────────────────────────────────────────────────────

export const ORGANIC_PRACTICES: OrganicPractice[] = [
  {
    id: 'prac-001',
    title: 'Vermicomposting — On-Farm Setup Guide',
    category: 'Soil & Composting',
    summary:
      'On-farm conversion of agro-residues, leaves, and livestock manure into vermicast using epigeic earthworms. A widely documented organic matter-building practice.',
    scientific_rationale:
      'Earthworm mechanical fragmentation and gut microbiome activity transform complex organic residues into humus with a lower carbon-to-nitrogen ratio than the original materials, improving nutrient availability.',
    preparation_steps: [
      'Choose a shaded, well-drained location for the vermicompost unit.',
      'Construct a bed or pit using local materials. Ensure drainage from the bottom.',
      'Lay a bedding layer of dried leaves, coir pith, or dry crop residues.',
      'Add partially decomposed cattle dung or farm residues as feedstock. Allow the initial heating phase to subside before introducing worms.',
      'Introduce epigeic earthworm species (e.g. Eisenia fetida) appropriate to your region.',
      'Maintain adequate moisture by sprinkling water. Cover with wet sacking or a shade net.',
      'Turn the material periodically to ensure aeration.',
      'Harvest mature vermicast from the upper layers once the material has a uniform, granular texture.',
    ],
    application_rate:
      'Follow state agricultural extension recommendations for the specific crop and soil type. General practice: 2–5 tonnes per acre for field crops; 5–10 kg per tree for plantation crops.',
    dosage_timing:
      'Apply as a basal dressing during land preparation or as a top dressing during active crop growth. Twice-annual applications are described in various plantation crop guides.',
    cautions:
      'Avoid introducing fresh (undecomposed) manure, which can generate heat harmful to earthworms. Protect the unit from waterlogging, ants, and predators. Keep in deep shade.',
    source: 'ICAR – Indian Institute of Soil Science (IISS), Bhopal',
    source_url: 'https://iiss.icar.gov.in',
    verification_status: 'Source-backed agricultural information',
    last_verified: '2025-11-01',
    claim_basis:
      'General preparation steps based on IISS extension documentation on vermicomposting methodology. Specific application rates reference ICAR-CPCRI plantation crop guides.',
  },
  {
    id: 'prac-002',
    title: 'Jeevamrutha — Fermented Microbial Inoculant Preparation',
    category: 'Bio-stimulants & Teas',
    summary:
      'A fermented liquid biological preparation promoted through Zero Budget Natural Farming (ZBNF), used to introduce indigenous soil microorganisms into the root zone.',
    scientific_rationale:
      'Organic substrates (jaggery, pulse flour) in the preparation serve as growth media for indigenous bacteria and fungi present in local cow dung and soil. Fermentation is anaerobic-aerobic and creates a microbial-rich liquid inoculant.',
    preparation_steps: [
      'Use a non-metallic container of appropriate volume.',
      'Add fresh indigenous cow dung and cow urine in the proportions described in NCOF/NCONF documentation.',
      'Add jaggery and pulse flour as microbial growth substrates.',
      'Add a small quantity of undisturbed soil from a forest edge or uncultivated area as an inoculum source.',
      'Add non-chlorinated water to fill the container.',
      'Stir vigorously and cover with a breathable cloth to allow gas exchange.',
      'Stir twice daily. Fermentation is typically complete in 5–7 days at ambient temperatures.',
      'Use within a few days of completion. Prepare fresh batches as needed.',
    ],
    application_rate:
      'NCOF/NCONF documentation describes application through irrigation at rates described in the ZBNF programme materials. Follow the specific guidance for your crop and region.',
    dosage_timing:
      'Apply during active vegetative and reproductive growth stages at intervals recommended in NCOF/NCONF or state agricultural extension documentation.',
    cautions:
      'Do not mix with synthetic fertilisers or pesticides. Use non-metallic containers. Preparation is temperature-sensitive — results vary with ambient conditions.',
    source: 'National Centre for Organic and Natural Farming (NCOF/NCONF), Ghaziabad',
    source_url: 'https://pgsindia-ncof.gov.in',
    verification_status: 'Source-backed agricultural information',
    last_verified: '2025-12-01',
    claim_basis:
      'Based on NCOF/NCONF ZBNF documentation. Specific proportions reference NCOF technical materials. Microbial counts are not specified here as they vary by batch and conditions.',
  },
  {
    id: 'prac-003',
    title: 'Trichoderma Mass Multiplication on Farmyard Manure',
    category: 'Biological Pest Control',
    summary:
      'On-farm method of multiplying Trichoderma fungal biocontrol agent on decomposed cattle manure before field application. Described in ICAR-IISR extension materials.',
    scientific_rationale:
      'Pre-incubating a commercial Trichoderma formulation on organic matter allows the fungal mycelium to colonise the carrier and increase spore density before field application, potentially improving soil colonisation.',
    preparation_steps: [
      'Source a CIBRC-registered commercial Trichoderma formulation (viride or harzianum).',
      'Mix the commercial formulation with well-decomposed, semi-dry farmyard manure in proportions described in ICAR-IISR extension documentation.',
      'Maintain moisture in the mixture without waterlogging.',
      'Keep the heap in shaded conditions and cover with sacking or a tarpaulin.',
      'After 7–10 days, visible fungal growth (white to green mycelium) indicates successful multiplication.',
      'Incorporate the enriched material into the root zone soil immediately after multiplication.',
    ],
    application_rate:
      'Follow ICAR-IISR extension recommendations for the specific crop and pest target. Do not apply alongside copper-based or synthetic fungicide treatments.',
    dosage_timing:
      'ICAR-IISR documentation describes application before monsoon onset and after monsoon for Black Pepper and related spice crops. Follow crop-specific guidance.',
    cautions:
      'Do not apply alongside chemical fungicides or copper oxychloride, which are incompatible with the living fungus. Trichoderma products are living organisms — use before expiry and store properly.',
    source: 'ICAR – Indian Institute of Spices Research (IISR), Calicut',
    source_url: 'https://spices.res.in',
    verification_status: 'Source-backed agricultural information',
    last_verified: '2025-11-20',
    claim_basis:
      'Based on ICAR-IISR extension bulletin on Trichoderma use in spice crops. CFU figures removed — they vary by commercial product and are specified on product labels, not here.',
  },
  {
    id: 'prac-004',
    title: 'Biomass Mulching — Soil Cover and Residue Recycling',
    category: 'Cropping & Mulch',
    summary:
      'Continuous soil surface cover using crop residues, leaf litter, and pruning material to reduce moisture loss, moderate soil temperature, and recycle organic matter.',
    scientific_rationale:
      'Maintaining a physical organic mulch layer reduces evaporative water loss from the soil surface, moderates soil temperature extremes, and provides a continuous input of decomposing organic matter that feeds soil microorganisms.',
    preparation_steps: [
      'Collect available farm organic material: fallen leaves, prunings, areca fronds, dried grass, weed biomass after weeding.',
      'Chop or break coarse material into smaller pieces to improve contact with soil and speed decomposition.',
      'Spread a layer of organic material around the plant base, covering the root zone area.',
      'Keep the mulch layer clear of the main trunk or stem to prevent collar rot.',
      'Replenish the mulch layer when it has decomposed significantly.',
    ],
    application_rate:
      'Maintain a continuous organic mulch layer throughout the year. Depth and material depends on availability. No specific quantity is prescribed — use all available farm residues.',
    dosage_timing:
      'Apply year-round. Most important to maintain during the dry season to reduce irrigation needs. Replenish after harvest and at the end of the monsoon.',
    cautions:
      'Do not pile mulch tightly against the trunk or collar of trees and vines — this can promote collar rot. Remove mulch briefly if diagnosing collar-level disease symptoms.',
    source: 'ICAR – Central Plantation Crops Research Institute (CPCRI), Kasaragod',
    source_url: 'https://cpcri.res.in',
    verification_status: 'Source-backed agricultural information',
    last_verified: '2025-11-01',
    claim_basis:
      'Based on CPCRI package of practices for plantation crops. Specific evaporation reduction percentages removed — they are soil- and climate-dependent and not stated in the source consulted here.',
  },
  {
    id: 'prac-005',
    title: 'Green Manure — In-Situ Soil Fertility Restoration',
    category: 'Soil & Composting',
    summary:
      'Growing a fast-maturing leguminous cover crop in field interspaces or fallow plots, then incorporating the biomass into the soil to replenish organic matter and biological nitrogen.',
    scientific_rationale:
      'Leguminous green manure crops fix atmospheric nitrogen through root nodule symbiosis (Rhizobium). Incorporation of the green biomass adds both biological nitrogen and readily decomposable organic matter, improving soil structure over successive seasons.',
    preparation_steps: [
      'Select an appropriate green manure species for your crop system and season (e.g. Sunnhemp, Daincha, Pillipesara, or Cowpea).',
      'Sow broadcast or in rows in field interspaces or fallow plots at the onset of the monsoon or as pre-monsoon rains begin.',
      'Allow the crop to grow to flowering stage before incorporation — this is when nitrogen content is at its peak.',
      'Cut or roller-crimp the biomass and incorporate into the soil using a cultivator or by hand.',
      'Allow 2–3 weeks for decomposition before transplanting the main crop.',
    ],
    application_rate:
      'Sow at the seed rate recommended for the selected species. Incorporate all above-ground biomass produced.',
    dosage_timing:
      'Best suited to pre-monsoon or kharif season. Allow adequate time between green manure incorporation and main crop transplanting for initial decomposition.',
    cautions:
      'Do not incorporate at full maturity — stems become lignified and decompose slowly, causing nitrogen immobilisation. Allow decomposition time before main crop planting.',
    source: 'ICAR – Central Research Institute for Dryland Agriculture (CRIDA), Hyderabad',
    source_url: 'https://crida.icar.gov.in',
    verification_status: 'Source-backed agricultural information',
    last_verified: '2025-09-01',
    claim_basis:
      'Based on CRIDA guidance on green manure practices. Specific nitrogen fixation quantities removed as they are highly variable and species/strain/condition-dependent.',
  },
  {
    id: 'prac-006',
    title: 'Crop Rotation for Soil Health and Pest Break',
    category: 'Cropping & Mulch',
    summary:
      'Planned sequence of different crops grown in the same field across seasons or years to improve soil health, break pest and disease cycles, and reduce dependence on external inputs.',
    scientific_rationale:
      'Different crops have different root architectures, nutrient requirements, and exudate profiles. Rotating crops changes the soil microbiome and breaks the host-pathogen cycle for many soil-borne diseases and pest species.',
    preparation_steps: [
      'Map your fields and current crop sequences.',
      'Plan a rotation sequence that alternates between botanical families and between grain/legume/root crops where possible.',
      'Include a legume or green manure phase in the rotation to replenish nitrogen biologically.',
      'Avoid returning a crop susceptible to a soil-borne disease to a recently infected plot within the recommended break period.',
    ],
    application_rate: 'No material application — this is a land management practice.',
    dosage_timing:
      'Plan rotations seasonally or annually based on market demand, water availability, and soil health objectives.',
    cautions:
      'Rotation choices must match local climate, water availability, and market. Not all crop combinations are beneficial — some crops share disease hosts.',
    source: 'ICAR – Indian Agricultural Research Institute (IARI), New Delhi',
    source_url: 'https://iari.res.in',
    verification_status: 'Source-backed agricultural information',
    last_verified: '2025-10-01',
    claim_basis:
      'General agronomic description of crop rotation principles from IARI extension materials. No specific yield claims made.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIC TERMINOLOGY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
// Used by the UI to show the "What this term means" panel in the Certification
// awareness tab.

export const ORGANIC_TERMINOLOGY = {
  natural: {
    term: 'Natural',
    definition: 'Describes the origin of a material — it comes from nature rather than being synthesised chemically. "Natural" has no regulatory meaning in Indian organic certification. A natural material is not automatically permitted under any standard.',
    example: 'Neem oil is a natural material. Whether it is permitted under NPOP depends on the specific standard version, the product registration, and the applicable certification body\'s input list.',
    source: 'APEDA NPOP Standards',
  },
  'organic-input': {
    term: 'Organic Farming Input',
    definition: 'A material used in organic-style farming systems, typically of biological or mineral origin. "Organic input" is a descriptive category, not a guarantee of certification eligibility.',
    example: 'Vermicompost and FYM are organic farming inputs widely described in ICAR literature. Whether they are permitted under a specific certification body\'s rules depends on the feedstocks, processing, and applicable standard.',
    source: 'ICAR Extension Guidance',
  },
  'listed-in-standard': {
    term: 'Listed in an Organic Standard',
    definition: 'A material named in the permitted-inputs annex of an organic standard (such as NPOP Annex 2). Being listed means it may be used under specified conditions — it does not mean every commercial product of that type is automatically approved.',
    example: 'Rock phosphate is listed in NPOP Annex 2 subject to conditions including cadmium content limits. A specific commercial rock phosphate product is only eligible if it meets those conditions and is accepted by the applicable certification body.',
    source: 'APEDA NPOP Annex 2',
  },
  'certified-product': {
    term: 'Certified Organic Product',
    definition: 'A specific product (batch or lot) covered by a valid certificate issued by an APEDA-accredited certification body after inspection and documentation review. This status applies to a specific consignment, not to a material category in general.',
    example: 'A bag of vermicompost sold by a certified organic producer with a valid certificate from an APEDA-accredited body is a certified organic product. A generic bag of vermicompost without certification documentation is not.',
    source: 'APEDA NPOP — Accreditation Programme for Certification Bodies',
  },
} as const;
