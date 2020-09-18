const Discord = require("discord.js");
const { client } = require('../../bot_modules/constants.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');

let { PREFIX } = require('../../config.js');
let validOptions = [
  'guide',
  'rank',
  'mentions',
  'mention'
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
      embed.setColor('#DC143C')
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
        
        // Format Embed
        embed.setTitle(`${message.author.username} Preferences`)
        .addFields(
          {
            name: `__Rank__ background`,
            value: `${userData.rankBackground}`,
            inline: true
          },
          {
            name: `Allow __mentions__`,
            value: `${userData.mentions}`,
            inline: true
          },
          {
            name: `Preferences Guide`,
            value: `To change a preference, use \`${PREFIX}prefs [option] [value]\`, where \`[option]\` is one of the __underlined__ words above.
            For more information, use \`${PREFIX}prefs guide\``
          }
        );

        return await message.channel.send(embed);

      }
      else if( validOptions.includes(args[0]) ) {

        // IF AN ARGUMENT IS GIVEN
        // Attempt change of given preference
        // Or show Preferences Guide


        let option = args[0].toLowerCase();

        if( option === `guide` ) {

          embed.setTitle(`Preferences Guide`)
          .addFields(
            {
              name: `Changing Preferences`,
              value: `To change a preference, use \`${PREFIX}prefs [option] [value]\`, where \`[option]\` is one of the __underlined__ words given when running \`${PREFIX}prefs\``
            },
            {
              name: `Example of changing preferences`,
              value: `For example: \`${PREFIX}prefs mentions false\``
            },
            {
              name: `Rank Backgrounds`,
              value: `These are the background images that show up when you use the \`${PREFIX}rank\` command. You can see the full list of [them here](#) or by using \`${PREFIX}prefs rank list\``
            },
            {
              name: `Allow Mentions`,
              value: `This configures if the Bot is allowed to @ping you or not when outputting Level Up/Down messages. Setting to \`false\` will suppress the @ping and thus reduce your notifications and red number icons!`
            }
          );

          return await message.channel.send(embed);

        }
        else {

          // Check for value
          if( !args[1] || args.length < 2 ) {
            return await Error.LogToUser(message.channel, `Sorry, but I couldn't see any value(s) given - please try again...`);
          }


          let value = args[1];


          // Save new value for preference
          if( option === `rank` ) {
























            
            
            // PLACEHOLDER
            return await message.channel.send(`Placeholder - will be added soon...`);

          }
          else if( [`mentions`, `mention`].includes(option) ) {






























            let mentionArray = [ `true`, `false` ];

            if( !mentionArray.includes(value) ) {
              return await Error.LogToUser(message.channel, `Sorry, but that wasn't an accepted value. The accepted values for **mentions** are \`true\` or \`false\``);
            }

            await Tables.UserPrefs.update(
              {
                mentions: value
              },
              {
                where:
                {
                  userID: message.author.id
                }
              }
            )
            .catch(async err => {
              await Error.LogCustom(err, `Attempted UserPrefs DB Update`);
              return await Error.LogToUser(message.channel, `Sorry ${message.author.username} - I was unable to save the updated User Preference value. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
            })


            embed.setTitle(`Updated Preferences`)
            .setDescription(`Your preferences for **${option}** have been updated to **${value}**`);

            return await message.channel.send(embed);

          }

        }

      }

      //END OF COMMAND
    },
};
