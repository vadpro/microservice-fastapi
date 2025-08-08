#!/bin/bash

echo "Testing microservices..."

# Test cast service health
echo "Testing cast service health..."
curl -f http://cast_service:8000/health || echo "Cast service health check failed"

# Test movie service health
echo "Testing movie service health..."
curl -f http://movie_service:8000/health || echo "Movie service health check failed"

# Test cast endpoint
echo "Testing cast endpoint..."
curl -f http://cast_service:8000/api/v1/casts/1/ || echo "Cast endpoint test failed"

echo "Tests completed."
