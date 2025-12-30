// Local PDF for download
const RESUME_PATH = '/Abhishek_Chatterjee_Resume.pdf';
const RESUME_FILENAME = 'Abhishek_Chatterjee_Resume.pdf';

// Google Drive link for viewing
const RESUME_VIEW_URL =
  'https://drive.google.com/file/d/1GJ75qUzJh6KWhj95osLf77DGmUBoUNyz/view?usp=drivesdk';

/**
 * Opens the resume in a new tab (Google Drive) AND triggers a download (local PDF) simultaneously.
 * Use this as an onClick handler for resume links/buttons.
 */
export function handleResumeClick(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
  e.preventDefault();

  // 1. Open Google Drive link in new tab for viewing
  window.open(RESUME_VIEW_URL, '_blank', 'noopener,noreferrer');

  // 2. Trigger download of local PDF programmatically
  const downloadLink = document.createElement('a');
  downloadLink.href = RESUME_PATH;
  downloadLink.download = RESUME_FILENAME;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export { RESUME_PATH, RESUME_FILENAME, RESUME_VIEW_URL };
