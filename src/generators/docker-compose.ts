import * as path from 'path';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as yosay from 'yosay';
const colors = require('colors/safe');
const generator = require('generate-password');

import {AbstractGenerator} from './abstract-generator';

export class DockerComposeGenerator extends AbstractGenerator {

    private readonly env: string[];
    private readonly isProduction = process.env.NODE_ENV === 'production';

    constructor() {
        super();
        this.env = [
            "DOCKER_TAG",
            "GS_COMMON_DB_TYPE",
            "GS_COMMON_DB_DIALECT_PROVIDER",
            "GS_WORKER_DB_CONNECTION_STRING_PATTERN",
            "GS_ES_URL",
            "GS_PUBLIC_ES_URL"
        ];
    }

    async run(): Promise<void> {
        try {
            console.log(yosay(`Приветствую, я помощник настройки ${colors.green('docker-compose')}
             для глобального поиска! Следуй инструкциям для генерации файлов!`));
            await this.requiredQuestions();
        } catch (e) {
            return
        }
        await this.commonQuestions();
        await this.workerDbTypeQuestions();
        await this.setCommonDbType();

        this.generateFiles();
        return undefined;
    }

    private async requiredQuestions(): Promise<void> {
        let answers = await inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "ES_INSTALLED",
                    message: "Вы уже установили elasticsearch (по-умолчанию Y)?",
                    default: true
                }
            ]);
        this.setAnswers(answers);
        if (!answers.ES_INSTALLED) {
            console.log(colors.red(`Невозможно продолжить установку, так как для установки неободимо развернуть elasticsearch`));
            return Promise.reject();
        }
        answers = await inquirer
            .prompt([
                {
                    type: "input",
                    name: "GS_ES_URL",
                    message:
                        "Введите аресс elasticsearch (например http://elasticsearch:9200)?",
                    validate: value => /^https?:\/\/.+$/.test(value)
                }
            ]);

        this.setAnswers({
            ...answers,
            GS_PUBLIC_ES_URL: answers.GS_ES_URL,
        });
    }
    private async commonQuestions(): Promise<void> {
        let answers = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "DOCKER_TAG",
                    message: "Выберите версию глобального поиска для установки?",
                    choices: ["1.7.0", "1.7.1"],
                    default: "1.7.0"
                }
            ]);
        this.setAnswers({
            ...answers,
        });
    }
    private async workerDbTypeQuestions(): Promise<void> {
        let answers = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "GS_COMMON_DB_TYPE",
                    message: "Какую DB использует приложение creatio?",
                    choices: ["mssql", "postgres", "oracle"],
                    default: "mssql"
                }
            ]);
        this.setAnswers(answers);
    }
    private async workerMssqlQuestions(): Promise<void> {
        let answers = await inquirer
            .prompt([
                {
                    type: "input",
                    name: "mssqlDbServer",
                    message: "Введите database server name (например localhost/mssql2016) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "mssqlDbName",
                    message: "Введите название базы данных (например creatio) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "mssqlDbLogin",
                    message:
                        "Введите логин к DB, пользователя глобального поиска (например gs) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "mssqlDbPassword",
                    message: "Введите пароль к DB, пользователя глобального поиска (например password) ?",
                    validate: value => /.+/.test(value)
                }
            ]);
        const connectionString = `Server=${answers.mssqlDbServer}; Database=${answers.mssqlDbName}; User Id=${answers.mssqlDbLogin}; Password=${answers.mssqlDbPassword}; Connection Timeout=10`
        this.answers.GS_WORKER_DB_CONNECTION_STRING_PATTERN = connectionString;
    }
    private async workerPostgresQuestions(): Promise<void> {
        let answers = await inquirer
            .prompt([
                {
                    type: "input",
                    name: "SERVER",
                    message: "Введите database server name (например localhost) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "DB_NAME",
                    message: "Введите название базы данных (например creatio) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "USER",
                    message:  "Введите логин к DB, пользователя глобального поиска (например gs) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "PASSWORD",
                    message: "Введите пароль к DB, пользователя глобального поиска (например password) ?",
                    validate: value => /.+/.test(value)
                }
            ]);
        const connectionString = `User ID=${answers.USER};Password=${answers.PASSWORD};Server=${answers.SERVER};Port=5432;Database=${answers.DB_NAME};Pooling=true;MinPoolSize=0;MaxPoolSize=200`;
        this.answers.GS_WORKER_DB_CONNECTION_STRING_PATTERN = connectionString;
    }
    private async workerOracleQuestions(): Promise<void> {
        let answers = await inquirer
            .prompt([
                {
                    type: "input",
                    name: "HOST_NAME",
                    message: "Введите HOST_NAME (например localhost) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "SERVICE_NAME",
                    message: "Введите SERVICE_NAME (например BPMBUILD) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "USER",
                    message:  "Введите логин к DB, пользователя глобального поиска (например gs) ?",
                    validate: value => /.+/.test(value)
                },
                {
                    type: "input",
                    name: "PASSWORD",
                    message: "Введите пароль к DB, пользователя глобального поиска (например password) ?",
                    validate: value => /.+/.test(value)
                }
            ]);
        const connectionString = `Data Source=(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = ${answers.HOST_NAME})(PORT = 1521))) (CONNECT_DATA = (SERVICE_NAME = ${answers.SERVICE_NAME}) (SERVER = DEDICATED)));User Id=${answers.USER};Password=${answers.PASSWORD}`;
        this.answers.GS_WORKER_DB_CONNECTION_STRING_PATTERN = connectionString;
    }
    private async setCommonDbType() {
        if (this.answers.GS_COMMON_DB_TYPE === "mssql") {
            this.answers.GS_COMMON_DB_DIALECT_PROVIDER =
                "ServiceStack.OrmLite.MySqlDialect, ServiceStack.OrmLite.MySql, Culture=neutral, PublicKeyToken=null";
            await this.workerMssqlQuestions();
        }

        if (this.answers.GS_COMMON_DB_TYPE === "postgres") {
            this.answers.GS_COMMON_DB_DIALECT_PROVIDER =
                "ServiceStack.OrmLite.PostgreSqlDialect, ServiceStack.OrmLite.PostgreSQL, Culture=neutral, PublicKeyToken=null";
            await this.workerPostgresQuestions();
        }

        if (this.answers.GS_COMMON_DB_TYPE === "oracle") {
            this.answers.GS_COMMON_DB_DIALECT_PROVIDER =
                "Cloud.OrmLite.Oracle.OracleOrmLiteDialect, Cloud.OrmLite.Oracle, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null";
            await this.workerOracleQuestions();
        }
    }

    private async generateFiles() {
        let composeFolder;
        let outFolder;
        if (this.isProduction) {
            composeFolder = path.resolve('../docker-compose');
            outFolder = path.resolve('../out');
        } else {
            composeFolder = path.resolve('./docker-compose');
            outFolder = path.resolve('./out');
        }
        let env = fs.readFileSync(path.resolve(composeFolder + '/.env')).toString();
        const yaml = fs.readFileSync(path.resolve(composeFolder + '/docker-compose.yaml')).toString();

        if (!fs.existsSync(outFolder)) {
            fs.mkdirSync(outFolder);
        }

        if (fs.existsSync(outFolder + '/.env')) {
            fs.unlinkSync(outFolder + '/.env');
        }
        if (fs.existsSync(outFolder + '/docker-compose.yaml')) {
            fs.unlinkSync(outFolder + '/docker-compose.yaml');
        }
        fs.appendFileSync(outFolder + '/docker-compose.yaml', yaml);
        
        env = DockerComposeGenerator.generatePasswords(env);
        fs.appendFileSync(outFolder + '/.env', env);
        fs.appendFileSync( outFolder + '/.env', `#### GENERATED ENV ####\n`);
        this.env.forEach(env => {
            fs.appendFileSync( outFolder + '/.env', `${env}=${this.answers[env]}\n`);
        });

        console.log('docker-compose файлы были успешно сгенерированы в $PWD папку');
    }

    private static generatePasswords(text: string): string {
        const mysql = '##MYSQL_ROOT_PASSWORD##';
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        return text.replace(new RegExp(mysql, 'g'), password);
    }
}
