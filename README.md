# globalsearch cli

![example](screenshot.png "example")

### setup development 

#### npm install

```bash
npm i
# or yarn
```

#### npm run

```bash
npm run start
```

### docker 

#### build

```bash
docker build -f install/Dockerfile -t globalsearch-cli .
```

#### run from local

```bash
docker run -v $PWD:/app/out -it --rm globalsearch-cli
```

#### run from dockerhub

```bash
docker run -v $PWD:/app/out -it --rm bpmonlinebuild/globalsearch-cli
```
