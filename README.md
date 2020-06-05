# globalsearch cli

![example](demo1.gif "example")

## Description 

This tool help you setup global search in [creatio](https://creatio.com) application.  
It is has GUI for interactive setup step by step.
Besides it has methods for debug setup process.

## For developers

### Setup development 

#### npm install

```bash
npm i
# or yarn
```

#### npm run

```bash
npm run start
```

### Docker 

#### build

```bash
docker build -f install/Dockerfile -t globalsearch-cli .
```

##### or build experimental (fastest)

```bash
DOCKER_BUILDKIT=1 docker build -f install/experimental/production/Dockerfile -t globalsearch-cli .
```

#### run from local

```bash
docker run -v $PWD:/app/out -it --rm globalsearch-cli
```

#### run from dockerhub

```bash
docker run -v $PWD:/app/out -it --rm bpmonlinebuild/globalsearch-cli
```
### User workflow docs

* [En](docs/workflow.md)
* [Ru google](https://docs.google.com/spreadsheets/d/1CcB6Pi-lXCl7-zPmwBc-UgXw_1u7_HFS_dMCfr6tlNU/edit#gid=0)
