FROM node:13.3.0

COPY . .
RUN npm ci
RUN npm run build

WORKDIR build

ENTRYPOINT ["node", "bundle.js"]

