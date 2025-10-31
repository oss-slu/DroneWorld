#!/bin/bash

# Wait for fake-gcs to be ready
until curl -s http://fake-gcs:4443/storage/v1/b > /dev/null; do
  echo "Waiting for fake-gcs-server..."
  sleep 2
done

# Create bucket
curl -X POST http://fake-gcs:4443/storage/v1/b \
  -H "Content-Type: application/json" \
  -d '{"name":"droneworld"}'

echo "Bucket 'droneworld' created"