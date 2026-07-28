export function getAnchorScrollTop(
  targetTop: number,
  currentScroll: number,
  headerOffset: number,
): number {
  return Math.max(0, targetTop + currentScroll - headerOffset);
}
