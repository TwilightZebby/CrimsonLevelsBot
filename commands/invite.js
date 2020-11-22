const Discord = require("discord.js");
//const fs = require('fs');
//const Canvas = require('canvas');
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');
//const XPs = require('../bot_modules/leveling/xpFunctions.js');
//const Levels = require('../bot_modules/leveling/levelFunctions.js');
//const Tables = require('../bot_modules/tables.js');
const Error = require('../bot_modules/onEvents/errors.js');
const Prefixs = require('../bot_modules/prefixFunctions.js');
//const Roles = require('../../bot_modules/cmds/roleFunctions.js');


module.exports = {
    name: 'invite',
    description: 'Bring up the Invite Link for the Bot so you can bring it into your own Servers!',
    usage: ' ',
    //aliases: [''],
    //args: true,
    commandType: 'general',
    cooldown: 5, // IN SECONDS

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
      
      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);

      const embed = new Discord.MessageEmbed().setColor('#DC143C')
      .setDescription(`[Click here to invite me to your Server!](https://discord.com/oauth2/authorize?client_id=657859837023092746&scope=bot&permissions=268487744)
      
      *Please remember that you need to either be the Owner of, or have the \`MANAGE_SERVER\` or \`ADMIN\` Permission in the Server you want to invite me to*`);

      //return await message.channel.send(embed);
      return await client.throttleCheck(message.channel, embed, message.author.id);

      //END OF COMMAND
    },
};
