/**
 * Parse a fetch Response and throw a normalized Error when the backend returns an error envelope.
 */
export async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let body;
  try {
    body = isJson ? await response.json() : await response.text();
  } catch (err) {
    body = null;
  }

  if (response.ok) {
    return body;
  }

  const envelope = isJson && body && typeof body === 'object' ? body.error : null;
  const error = new Error(envelope?.message || `Request failed with status ${response.status}`);
  error.code = envelope?.code || 'INTERNAL_SERVER_ERROR';
  error.details = envelope?.details;
  error.requestId = envelope?.request_id;
  error.timestamp = envelope?.timestamp;
  error.status = response.status;
  error.raw = body;
  throw error;
}
