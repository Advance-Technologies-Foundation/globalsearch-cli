# syntax=docker/dockerfile:experimental

#build stage
FROM node:10.15.3-stretch-slim as build
WORKDIR /tmp
ENV NODE_ENV=production
RUN --mount=type=bind,source=package.json,target=./package.json \
	--mount=type=bind,source=package-lock.json,target=./package-lock.json \
	--mount=type=cache,target=/root/.npm \
    npm --prefer-offline ci --silent

RUN --mount=type=bind,source=package.json,target=./package.json \
	--mount=type=bind,source=tsconfig.json,target=./tsconfig.json \
	--mount=type=bind,source=webpack.config.js,target=./webpack.config.js \
	--mount=type=bind,source=docker-compose,target=./docker-compose \
	--mount=type=bind,source=src,target=./src \
	--mount=type=bind,source=tests,target=./tests \
	npm run build && npm run test:ci

# production stage
FROM node:10.15.3-stretch-slim as production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /tmp/build build
COPY docker-compose docker-compose

ENTRYPOINT ["node", "build/bundle.js"]
