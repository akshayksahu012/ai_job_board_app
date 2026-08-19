const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function callAiService(path, body) {
  const res = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`AI service ${path} failed (${res.status}): ${detail}`);
  }

  return res.json();
}

export const parseResume = (rawText) => callAiService('/parse-resume', { rawText });

export const searchMatchingJobs = ({ resumeText, jobTitle, location }) =>
  callAiService('/search-jobs', { resumeText, jobTitle, location }).then((r) => r.jobs);