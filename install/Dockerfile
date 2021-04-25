FROM debian:sid-20200514-slim

ENV RUN_IN_DOCKER=1

# install nodejs and npm
ENV NODE_VERSION=14.4.0
RUN apt update
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# install zip
RUN apt install -y zip

# install git
RUN apt install -y git

# install docker
RUN apt install -y docker-compose

# install docker-compose
RUN curl -L https://github.com/docker/compose/releases/download/1.26.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
RUN mv /usr/local/bin/docker-compose /usr/bin/docker-compose
RUN chmod +x /usr/bin/docker-compose
ENV PATH="/usr/bin:${PATH}"

# build node aplication
WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

ENTRYPOINT ["node", "build/bundle.js"]

