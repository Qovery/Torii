#!/usr/bin/make

docker_build_backend: 
	DOCKER_BUILDKIT=1
	docker build --no-cache -t torii-backend:latest backend/

docker_build_frontend:
	DOCKER_BUILDKIT=1
	docker build --no-cache -t torii-frontend:latest frontend/