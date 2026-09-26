-- ============================================================================
-- CHUNK 2 — TASK 18 AUDIT: REMOVE UNSUPPORTED EXACT CLAIMS FROM SEEDED ADVISORIES
-- ============================================================================
-- Spec reference: chunk2-pesticide-ipm-engine, section 18 "REMOVE UNSUPPORTED
-- CURRENT CLAIMS": any unsupported exact dose, concentration, PHI, REI,
-- chemical claim or safety claim in the seeded pesticide_advisories rows must be
-- removed, downgraded to general information, or replaced with sourced data.
--
-- Audit result (7 legacy seed rows seeded by
--   20260924000003_seed_authoritative_agricultural_data.sql):
--
--   d0000000-...-000000000001  prevention  no exact dose/concentration   -> unchanged
--   d0000000-...-000000000002  mechanical  had absolute efficacy claim   -> softened below
--   d0000000-...-000000000003  chemical    had 1% conc. + 1:1:100 mixing
--                                         ratio + "repeat 40-45 days"   -> removed below
--   d0000000-...-000000000004  mechanical  no exact dose/concentration   -> unchanged
--   d0000000-...-000000000005  biological  had "5 x 10^11 spores/g" and
--                                         "50 g per cubic meter" dose +
--                                         "completely harmless" claim   -> removed below
--   d0000000-...-000000000006  prevention  no exact dose/concentration   -> unchanged
--   d0000000-...-000000000007  biological  had "50 g in 5 L water per
--                                         vine" dose + exact 15-day copper
--                                         interval                      -> removed below
--
-- No numeric PHI or REI value is invented or retained anywhere: every row keeps
-- phi_days = NULL and rei_hours = NULL so the UI shows the FR-6 placeholder
-- instead of an unverified number.
-- Chemical rows are NOT upgraded to "Registered Use (Crop/Pest)" or
-- "Registered Formulation" because no CIBRC label claim is traceable in this
-- knowledge-base snapshot.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- (a) d0000000-...-000000000003 — Arecanut Koleroga (chemical)
--     Downgrade exact prophylactic recipe to general agricultural information.
-- ----------------------------------------------------------------------------
update public.pesticide_advisories
set recommendation        = 'Prophylactic protection before the onset of the southwest monsoon is a traditional practice in Koleroga-prone gardens. Any chemical option must be selected and applied only according to the currently applicable registered label and official extension guidance; the platform does not state a dose, concentration, mixing ratio or repeat interval.',
    active_ingredient     = null,
    product_information   = 'Copper-based prophylactic fungicide (formulation and registration must be verified against the current CIBRC label for this crop and disease).',
    application_information = 'Preparation, dilution, spray schedule and number of rounds are label- and extension-specific and are deliberately not stated here. Confirm them from the registered product label or your local agricultural officer before use.',
    safety_information    = 'Wear the personal protective equipment specified on the product label. Do not spray in windy or rainy conditions. Observe the pre-harvest interval printed on the label before harvesting edible produce.',
    verification_status   = 'General Agricultural Information',
    phi_days              = null,
    rei_hours             = null
where id = 'd0000000-0000-0000-0000-000000000003';


-- ----------------------------------------------------------------------------
-- (b) d0000000-...-000000000005 — Coconut Rhinoceros Beetle (biological)
--     Remove formulation concentration, per-unit dose and absolute safety claim.
-- ----------------------------------------------------------------------------
update public.pesticide_advisories
set recommendation        = 'Incorporate a Metarhizium anisopliae-based biocontrol preparation into cattle-manure pits and other organic breeding sites so that the fungus can suppress developing beetle stages. Use a preparation that carries a valid biopesticide registration and follow its label for dosage and interval.',
    active_ingredient     = 'Metarhizium anisopliae',
    product_information   = 'Metarhizium anisopliae bio-formulation (use a product bearing a valid biopesticide registration; spore count, carrier and shelf life are product-specific and are not stated here).',
    application_information = 'Mix into manure pits or breeding material as directed on the product label, typically ahead of the pre-monsoon showers; repeat as advised by the label or extension guidance. No quantity per unit volume is stated here because it is formulation-specific.',
    safety_information    = 'Handle all biological preparations as directed on the label. Do not assume that a biocontrol agent is harmless to every non-target organism; follow the label precautions and keep treated material away from water bodies.',
    verification_status   = 'Non-chemical IPM Practice',
    phi_days              = null,
    rei_hours             = null
where id = 'd0000000-0000-0000-0000-000000000005';

-- ----------------------------------------------------------------------------
-- (c) d0000000-...-000000000007 — Black Pepper Quick Wilt (biological)
--     Remove the "50 g in 5 L water per vine" dose and the exact copper gap.
-- ----------------------------------------------------------------------------
update public.pesticide_advisories
set recommendation        = 'Drench the vine root zone with a Trichoderma harzianum-based biocontrol preparation combined with organic compost incorporation. Apply the quantity and dilution stated on the registered product label or by official extension guidance; no dose is stated here.',
    product_information   = 'Trichoderma harzianum bio-formulation (use a preparation bearing a valid biopesticide registration).',
    application_information = 'Apply as two split rounds aligned with the pre-monsoon and post-monsoon showers as advised on the product label.',
    safety_information    = 'Ensure the soil is moist at application. Where a copper-based fungicide is also used, keep the interval stated on the product label between the biological and the copper application.',
    verification_status   = 'Non-chemical IPM Practice',
    phi_days              = null,
    rei_hours             = null
where id = 'd0000000-0000-0000-0000-000000000007';

-- ----------------------------------------------------------------------------
-- (d) d0000000-...-000000000002 — Arecanut Koleroga (mechanical, poly-covering)
--     Remove the absolute efficacy claim; keep the non-chemical practice.
-- ----------------------------------------------------------------------------
update public.pesticide_advisories
set safety_information    = 'A physical barrier reduces water contact and spore deposition on the bunch; it does not by itself guarantee complete disease control. Continue scouting and combine with sanitation.',
    verification_status   = 'Non-chemical IPM Practice',
    phi_days              = null,
    rei_hours             = null
where id = 'd0000000-0000-0000-0000-000000000002';

-- ----------------------------------------------------------------------------
-- (e) Inventory guard — no legacy advisory row may carry a PHI/REI number that
--     was not derived from a traceable registered label in this knowledge base.
--     Rows without a traceable label claim are forced to NULL so the UI renders
--     the "not verified" placeholder rather than a fabricated interval.
-- ----------------------------------------------------------------------------
update public.pesticide_advisories
set phi_days  = null,
    rei_hours = null
where id in (
  'd0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000002',
  'd0000000-0000-0000-0000-000000000003',
  'd0000000-0000-0000-0000-000000000004',
  'd0000000-0000-0000-0000-000000000005',
  'd0000000-0000-0000-0000-000000000006',
  'd0000000-0000-0000-0000-000000000007'
)
and (phi_days is not null or rei_hours is not null);
