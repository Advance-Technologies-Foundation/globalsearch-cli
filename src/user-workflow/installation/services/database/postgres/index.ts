import * as inquirer from "inquirer";

const connection = {
	host: '',
	port: 5432,
	db: '',
	user: '',
	password: '',
	getConnectionString: function () {
		return `User ID=${this.user};Password=${this.password};Host=${this.host};Port=${this.port};Database=${this.db};`;
	}
};

export const run = async () => {
	await setHost();
	await setPort();
	await setDatabase();
	await setUser();
	await setPassword();
	console.log(connection.getConnectionString())
}

const setHost = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "host",
				message: "Specify database ip, example 192.168.15.5",
				validate: value => Boolean(value),
			}
		]) as any;
	connection.host = answer.host;
}

const setPort = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "port",
				message: "Specify database port",
				default: connection.port,
				validate: value => Boolean(value),
			}
		]) as any;
	connection.port = answer.port;
}

const setDatabase = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "db",
				message: "Specify database name, example production-db-name",
				validate: value => Boolean(value),
			}
		]) as any;
	connection.db = answer.db;
}

const setUser = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "user",
				message: "Specify database user name, example gs-user",
				validate: value => Boolean(value),
			}
		]) as any;
	connection.user = answer.user;
}

const setPassword = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "password",
				message: "Specify database user password, example gs-password",
				validate: value => Boolean(value),
			}
		]) as any;
	connection.password = answer.password;
}

