const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');


module.exports = {
    name: 'ping',
    description: 'Pong! Returns your average ping to the Bot in milliseconds',
    usage: ' ',
    //aliases: [''],
    //args: true,
    commandType: 'general',
    //cooldown: 3, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those set as "Admin" in the Bot, the Guild Owner, and me only
    //    'mod' - Those set as either "Mod" or "Admin", and the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    //limitation: 'owner',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message) {
      
      return await message.reply(`Pong! \n Your ping is ${message.client.ws.ping.toFixed(2)}ms`);

      //END OF COMMAND
    },
};
