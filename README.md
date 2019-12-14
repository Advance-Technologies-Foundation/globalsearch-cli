# globalsearch cli

![example](screenshot.png "example")

### setup development 

#### npm install

```bash
npm i
npm i -g yo
```

#### npm link

```bash
npm link
```

#### run 

```bash
yo globalsearch-docker-compose-generator
```

### docker 

#### build

```bash
docker buid -f install/Dockerfile -t gs-docker-compose-generator .
```

#### run

```bash
docker run -it --rm gs-docker-compose-generator
```

