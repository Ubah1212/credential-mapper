// Records stay on this device only (privacy by design). Nothing is uploaded.
const KEY = 'credential-mapper:records:v1';

export function loadRecords() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* storage unavailable (private mode): app keeps working in memory */
  }
}

export function downloadFile(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
