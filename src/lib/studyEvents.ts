// Cross-section signal: About's claim links ask the (lazy-loaded) Work section to pre-select
// the case study that proves the claim. Lives here so About never imports ServiceMap.
export const SELECT_STUDY = 'tm-select-study';

let pending: string | null = null;

export function selectStudy(slug: string) {
  pending = slug; // Work may not have its data yet; it picks this up when it does
  window.dispatchEvent(new CustomEvent(SELECT_STUDY, { detail: { slug } }));
}

export function takePendingStudy() {
  const slug = pending;
  pending = null;
  return slug;
}

export const peekPendingStudy = () => pending;
