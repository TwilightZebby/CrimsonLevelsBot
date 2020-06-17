// ********** Libraries required
const fs = require('fs');
const Discord = require('discord.js');

// ********** Global Variables
// Discord
const { client } = require('./bot_modules/constants.js');
let { PREFIX, TOKEN, DBLTOKEN } = require('./config.js');

// Maps / Collections
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for ( const file of commandFiles ) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}




















// ********** Debugging / Error Handling
process.on('warning', console.warn);
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection\n${error}`));

//client.on('debug', console.log);
client.on('error', console.error);
client.on('rateLimit', console.error);
client.on('warn', console.warn);



















// ********** READY EVENT
client.once('ready', async () => {


    // ***** Set Status
    await client.user.setPresence({
        activity: {
          name: `CrimsonRoulette v2 WIP Test`
        },
        status: 'online'
    });

    client.setInterval(async function () {
        await client.user.setPresence({
          activity: {
            name: `CrimsonRoulette v2 WIP Test`
          },
          status: 'online'
        });
    }, 1.08e+7);
    
    
    console.log(`I am ready!`);
});




















// ******************************
// LOGIN TO BOT ACCOUNT
client.login(TOKEN);
