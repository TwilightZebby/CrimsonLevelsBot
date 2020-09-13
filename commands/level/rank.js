const Discord = require("discord.js");
const { client } = require('../../bot_modules/constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../../bot_modules/leveling/xpFunctions.js');
const Levels = require('../../bot_modules/leveling/levelFunctions.js');


module.exports = {
    name: 'rank',
    description: 'Shows you your current XP total and Level',
    usage: ' ',
    aliases: ['xp', 'level'],
    //args: true,
    commandType: 'level',
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

    async execute(message, args) {
      
      let currentXP = await XPs.FetchXP(message);
      let currentLevel = await Levels.FetchLevel(currentXP);
      return await message.reply(`You currently have **${currentXP}** XP, and are Level **${currentLevel}**!`);

      //END OF COMMAND
    },
};
