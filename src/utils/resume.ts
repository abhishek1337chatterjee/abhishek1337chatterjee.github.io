// Resume filename for downloads
export const RESUME_FILENAME = 'Abhishek-Chatterjee-Resume.pdf';

/**
 * Opens the resume in a new tab AND triggers a download simultaneously.
 * Use this as an onClick handler for resume links/buttons.
 *
 * @param resumeUrl - The Sanity CDN URL for the resume PDF
 */
export function handleResumeClick(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  resumeUrl: string,
) {
  e.preventDefault();

  if (!resumeUrl) return;

  // 1. Open resume in new tab for viewing
  window.open(resumeUrl, '_blank', 'noopener,noreferrer');

  // 2. Trigger download with custom filename
  // Fetch the PDF and create a blob to force download with custom name
  fetch(resumeUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = RESUME_FILENAME;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((err) => {
      console.error('Failed to download resume:', err);
    });
}
