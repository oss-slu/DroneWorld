# Backend Error Handling

All API errors return the same JSON envelope to keep client handling predictable and to align with log correlation.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "missing_fields": ["Drones"]
    },
    "timestamp": "2025-11-18T10:30:00Z",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

- `code`: machine-readable identifier
- `message`: user-friendly string
- `details`: technical context (never contains secrets)
- `timestamp`: ISO 8601 in UTC
- `request_id`: UUID also emitted in the `X-Request-ID` response header and server logs

## Standard error codes

| Code | HTTP status | Notes |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400/422 | Missing or malformed input data |
| `AUTHENTICATION_REQUIRED` | 401 | Auth is required but missing/invalid |
| `AUTHORIZATION_DENIED` | 403 | Caller lacks permission |
| `RESOURCE_NOT_FOUND` | 404 | Resource or record does not exist |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SIMULATION_FAILED` | 500 | Simulation dispatch/stream failed |
| `STORAGE_ERROR` | 500/501 | Storage service issues |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled exceptions |

## Endpoint examples

- `POST /api/simulation/drones` missing `id`:
  ```json
  {"error":{"code":"VALIDATION_ERROR","message":"Invalid drone data","details":{"missing_fields":["id"]},"timestamp":"...","request_id":"..."}}
  ```
- `PUT /api/simulation/environment` without body:
  ```json
  {"error":{"code":"VALIDATION_ERROR","message":"Environment configuration is required","details":{"missing_fields":["environment"]},"timestamp":"...","request_id":"..."}}
  ```
- `PUT /api/simulation/drones/<drone_id>` where the drone does not exist:
  ```json
  {"error":{"code":"RESOURCE_NOT_FOUND","message":"Drone not found","details":{"drone_id":"Drone3"},"timestamp":"...","request_id":"..."}}
  ```
- `POST /addTask` missing `environment` or `Drones`:
  ```json
  {"error":{"code":"VALIDATION_ERROR","message":"Task payload missing required sections","details":{"missing_fields":["environment"]},"timestamp":"...","request_id":"..."}}
  ```
- `POST /list-folder-contents/<folder_name>` when storage is unavailable:
  ```json
  {"error":{"code":"STORAGE_ERROR","message":"Failed to list folder contents","details":{"folder":"2024-10-01_Batch_1","storage_error":"Failed to list folder contents from GCS"},"timestamp":"...","request_id":"..."}}
  ```
- `GET /serve-html/<folder>/<file>` when the HTML file is missing:
  ```json
  {"error":{"code":"RESOURCE_NOT_FOUND","message":"HTML file not found","details":{"folder":"2024-10-01_Batch_1","path":"index.html"},"timestamp":"...","request_id":"..."}}
  ```
- `GET /list-reports` when the storage backend fails:
  ```json
  {"error":{"code":"STORAGE_ERROR","message":"Failed to list reports","details":{"storage_error":"Failed to list reports from GCS"},"timestamp":"...","request_id":"..."}}
  ```
- `GET /report/<path>` when file listing is not supported by the storage backend:
  ```json
  {"error":{"code":"STORAGE_ERROR","message":"Listing files is not supported for this storage backend","details":{"prefix":"reports/demo/"},"timestamp":"...","request_id":"..."}}
  ```

Unhandled exceptions are logged with stack traces server-side, but only the standardized envelope is returned to clients.
