import * as path from 'path';
import * as fs from 'fs';
import test from 'ava';
import run, { UP, DOWN, ENTER } from 'inquirer-test';

const root = path.resolve(__dirname, '..');

const cliPath = path.resolve(root, 'build/bundle.js');
const outPath = path.resolve(root, 'out');

test('generated expected services files of the docker-compose', async t => {
    const result = await run([cliPath], [
        ENTER,
        'http://es:9200',
        ENTER,
        DOWN,
        ENTER,
        DOWN,
        ENTER,
        'servername',
        ENTER,
        'db-name',
        ENTER,
        'user',
        ENTER,
        'password',
        ENTER,
    ]);
    const env = fs.readFileSync(path.resolve(outPath, '.env')).toString();
    t.regex(env, new RegExp('DOCKER_TAG=1\.7\.1', 'g'));
    t.regex(env, new RegExp('GS_COMMON_DB_TYPE=postgres', 'g'));
    t.regex(env, new RegExp('GS_COMMON_DB_DIALECT_PROVIDER=ServiceStack\.OrmLite\.PostgreSqlDialect, ServiceStack\.OrmLite\.PostgreSQL, Culture=neutral, PublicKeyToken=null', 'g'));
    t.regex(env, new RegExp('GS_WORKER_DB_CONNECTION_STRING_PATTERN=User ID=user;Password=password;Server=servername;Port=5432;Database=db-name;Pooling=true;MinPoolSize=0;MaxPoolSize=200', 'g'));
    t.regex(env, new RegExp('GS_ES_URL=http://es:9200', 'g'));
    t.regex(env, new RegExp('GS_PUBLIC_ES_URL=http://es:9200', 'g'));
    const yaml = fs.readFileSync(path.resolve(outPath, 'docker-compose.yaml')).toString();
    t.truthy(yaml);
});

