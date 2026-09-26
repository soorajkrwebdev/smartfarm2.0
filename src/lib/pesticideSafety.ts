/**
 * Shared chemical-safety strings (Chunk 2 — Pesticide Advisory + IPM Engine).
 *
 * FR-14: the high-risk chemical warning must be shown wherever chemical-control
 * information is displayed. The exact quote is ALSO rendered verbatim in
 * `src/pages/pest-ipm/PestPage.tsx` (Section D Step 8 and above the Section E
 * advisory library) so the rendered text is an exact character match of the
 * required wording; keep this constant and those two renders in sync.
 */
export const CHEMICAL_DISCLAIMER =
  'Use only according to the applicable registered label and official agricultural guidance. This platform does not replace product labels, qualified agricultural advice, or regulatory requirements.';

/**
 * FR-6: shown instead of PHI/REI/dose values whenever verified chemical
 * application information is not present in the knowledge base. Never replace
 * this with an inferred or invented value.
 */
export const CHEMICAL_UNVERIFIED_PLACEHOLDER =
  'Verified chemical application information is not available in the current knowledge base.';
