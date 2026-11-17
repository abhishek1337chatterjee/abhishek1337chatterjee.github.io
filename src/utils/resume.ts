export const RESUME_FILENAME = 'Abhishek-Chatterjee-Resume.pdf';

// Sanity's ?dl= flag switches Content-Disposition to attachment; the `download`
// attribute alone is ignored for cross-origin files.
export function resumeDownloadUrl(resumeUrl: string): string {
  const url = new URL(resumeUrl);
  url.searchParams.set('dl', RESUME_FILENAME);
  return url.toString();
}

// Runs inside the click on a target=_blank "view" link: the browser opens the
// PDF tab as usual, and this saves a copy without leaving the portfolio.
export function downloadResume(resumeUrl: string): void {
  const link = document.createElement('a');
  link.href = resumeDownloadUrl(resumeUrl);
  link.download = RESUME_FILENAME;
  link.click();
}
