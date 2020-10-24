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

const updateArray = [
  `[v1.5.1](https://gist.github.com/TwilightZebby/2423dfd02a2769d8182f36048bd8ac47)`,
  `[v1.5.0](https://gist.github.com/TwilightZebby/79398fced4f7869fcb97e7e04ff74940)`,
  `v1.4.5b`, `v1.4.5`, `v1.4.4`, `v1.4.3`, `v1.4.2`, `v1.4.1`, `v1.4.0`, `v1.3.1`, `v1.3.0`,
  `v1.2.1`, `v1.2.0`, `v1.1.1`, `v1.1.0`, `v1.0.0`
];


module.exports = {
    name: 'changelog',
    description: 'See my latest changes, or previous updates!',
    usage: ' ',
    aliases: ['updates'],
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
      .addFields(
        {
          name: `Latest Version`,
          value: `[v1.5.2](https://gist.github.com/TwilightZebby/31e8e52ca8b79d4d88b7c2aa1fd7b9c2)`
        },
        {
          name: `Previous Versions`,
          value: updateArray.join(`, `)
        },
        {
          name: `\u200B`,
          value: `*Updates before 1.5.0 were not documented on TwilightZebby's GitHub.
          Thus, won't be hyperlinked*`
        }
      );

      return await message.channel.send(embed);

      //END OF COMMAND
    },
};
