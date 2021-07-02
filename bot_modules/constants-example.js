// ********** DISCORD
const Discord = require('discord.js');
exports.client = new Discord.Client(
    {
        ws: {
            intents: 1539
        }
    }
);


// ********* DATABASE (Sequelize & SQLite3)
const Sequelize = require('sequelize');
exports.sequelize = new Sequelize('databaseName', 'username', 'password', {
    host: 'hostAddressOrIP',
    port: 'portNumber',
	dialect: 'mysql',
    logging: false,
    timezone: '+00:00'
});
