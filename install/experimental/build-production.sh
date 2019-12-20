#!/usr/bin/env bash
DOCKER_BUILDKIT=1 docker build -f install/experimental/production/Dockerfile -t globalsearch-cli:production .
