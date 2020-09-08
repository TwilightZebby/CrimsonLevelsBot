const Discord = require("discord.js");
const { client } = require('../../bot_modules/constants.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');

let { PREFIX } = require('../../config.js');
let validOptions = [
  'rank',
  'mentions'
]


module.exports = {
    name: 'prefs',
    description: 'Used to show or change your User-specific Preferences, such as the Rank Backgrounds!',
    usage: '[option] [value]',
    aliases: ['preference', 'pref'],
    //args: true,
    commandType: 'management',
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

    async execute(message, args) {
      
      const embed = new Discord.MessageEmbed();
      embed.setColor('#07f51b')
      .setFooter(`User Preferences - ${message.author.username}`);


      if( !args.length || !validOptions.includes(args[0]) ) {

        // Show User's current preferences
        let userPrefs = await Tables.UserPrefs.findOrCreate({
          where: {
            userID: message.author.id
          }
        })
        .catch(async err => {
          await Error.Log(err);
          return await Error.LogToUser(message.channel, `I was unable to fetch the preferences for \`${message.author.username}\`, please try again later.`)
        });

        let userData = userPrefs[0].dataValues;
        return console.log(userData);

      }

      //END OF COMMAND
    },
};
