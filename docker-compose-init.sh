#!/bin/bash

# Load port configuration from the single source of truth
if [ -f ./.env ]; then
  set -a
  # shellcheck source=/dev/null
  source ./.env
  set +a
fi
: "${FAKE_GCS_PORT:?FAKE_GCS_PORT must be set in .env}"

# Wait for fake-gcs to be ready
until curl -s "http://fake-gcs:${FAKE_GCS_PORT}/storage/v1/b" > /dev/null; do
  echo "Waiting for fake-gcs-server..."
  sleep 2
done

# Create bucket
curl -X POST "http://fake-gcs:${FAKE_GCS_PORT}/storage/v1/b" \
  -H "Content-Type: application/json" \
  -d '{"name":"droneworld"}'

echo "Bucket 'droneworld' created"
