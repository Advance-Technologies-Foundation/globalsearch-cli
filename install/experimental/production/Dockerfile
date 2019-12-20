# syntax=docker/dockerfile:experimental

#build stage
FROM node:10.15.3-stretch-slim as build
WORKDIR /tmp
RUN --mount=type=bind,source=package.json,target=./package.json \
	--mount=type=bind,source=package-lock.json,target=./package-lock.json \
	--mount=type=cache,target=/root/.npm \
    npm --prefer-offline ci --silent

RUN --mount=type=bind,source=package.json,target=./package.json \
	--mount=type=bind,source=tsconfig.json,target=./tsconfig.json \
	--mount=type=bind,source=webpack.config.js,target=./webpack.config.js \
	--mount=type=bind,source=src,target=./src \
	npm run build

COPY docker-compose build/docker-compose

# tests stage
FROM node:10.15.3-stretch-slim as tests
WORKDIR /tmp
COPY --from=build /tmp .
RUN npm run tests

# production stage
FROM node:10.15.3-stretch-slim as production
WORKDIR /app
COPY --from=build /tmp/build .
COPY --from=build /tmp/build/docker-compose docker-compose

ENTRYPOINT ["node", "bundle.js"]