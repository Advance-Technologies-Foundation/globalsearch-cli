FROM node:13.3.0

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

ENTRYPOINT ["node", "build/bundle.js"]

