const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const canvasExtras = require("canvas-extras");
const { client } = require('../../bot_modules/constants.js');
const Tables = require('../../bot_modules/tables.js');
const Error = require('../../bot_modules/onEvents/errors.js');
const Prefixs = require('../../bot_modules/prefixFunctions.js');
const Backgrounds = require('../../bot_modules/leveling/backgroundFunctions.js');

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
    cooldown: 6, // IN SECONDS

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

      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);
      
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
          await Error.LogCustom(err, `(**prefs.js**)`);
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
            For more information, use \`${PREFIX}prefs guide\`
            For specific information on Rank Backgrounds, use \`${PREFIX}prefs rank guide\``
          }
        );

        //return await message.channel.send(embed);
        return await client.throttleCheck(message.channel, embed, message.author.id);

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

          //return await message.channel.send(embed);
          return await client.throttleCheck(message.channel, embed, message.author.id);

        }
        else {

          // Check for value
          if( !args[1] || args.length < 2 ) {
            return await Error.LogToUser(message.channel, `Sorry, but I couldn't see any value(s) given - please try again...`);
          }


          let value = args[1];


          // Save new value for preference
          if( option === `rank` ) {
























            
            
            // Set the background that appears in the RANK command (or disable backgrounds completely)
            let backgrounds = [];
            let standardBackgrounds = [];
            let prideBackgrounds = [];
            let gradientBackgrounds = [];
            let themedBackgrounds = [];
            let rankValues = [ 'guide', 'list', 'preview', 'disable' ];

            // Fetch all Backgrounds
            let standardBGs = fs.readdirSync('./backgrounds/standard').filter(file => file.endsWith('.png'));
            for ( const file of standardBGs ) {

              // Add to Array
              let tempSTRING = file.toString();
              let tempSTRINGLength = tempSTRING.length;
              tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);
      
              backgrounds.push(tempSTRING);
              standardBackgrounds.push(tempSTRING);
              rankValues.push(tempSTRING);

            }

            let prideBGs = fs.readdirSync('./backgrounds/pride').filter(file => file.endsWith('.png'));
            for ( const file of prideBGs ) {

              // Add to Array
              let tempSTRING = file.toString();
              let tempSTRINGLength = tempSTRING.length;
              tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);
      
              backgrounds.push(tempSTRING);
              prideBackgrounds.push(tempSTRING);
              rankValues.push(tempSTRING);

            }

            let gradientBGs = fs.readdirSync('./backgrounds/gradient').filter(file => file.endsWith('.png'));
            for (const file of gradientBGs) {

              // Add to Array
              let tempSTRING = file.toString();
              let tempSTRINGLength = tempSTRING.length;
              tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

              gradientBackgrounds.push(tempSTRING);
              backgrounds.push(tempSTRING)

            }

            let themedBGs = fs.readdirSync('./backgrounds/themed').filter(file => file.endsWith('.png'));
            for (const file of themedBGs) {

                // Add to Array
                let tempSTRING = file.toString();
                let tempSTRINGLength = tempSTRING.length;
                tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

                themedBackgrounds.push(tempSTRING);
                backgrounds.push(tempSTRING);

            }














            if ( !rankValues.includes(value) ) {
              return await Error.LogToUser(message.channel, `That wasn't a valid Background or option! Please use \`${PREFIX}prefs rank guide\` for more information`);
            }
            else {

              switch (value) {

                // RANK BGs GUIDE
                case 'guide':
                  embed.setTitle(`Preferences: Rank Backgrounds Guide`)
                  .addFields(
                    {
                      name: `Setting/Changing your chosen background`,
                      value: `To set a background for the \`rank\` command - simply use \`${PREFIX}prefs rank backgroundName\`, where \`backgroundName\` is replaced with the name of the background!`
                    },
                    {
                      name: `Disable backgrounds for yourself`,
                      value: `Don't want a background when you use the \`rank\` command? Simply use \`${PREFIX}prefs rank disable\` to switch to a plain-text output`
                    },
                    {
                      name: `Viewing a list of backgrounds`,
                      value: `Use \`${PREFIX}prefs rank list\` to get a list of all the available backgrounds!`
                    },
                    {
                      name: `Previewing Backgrounds`,
                      value: `Want to see what the Background would look like for yourself? Use \`${PREFIX}prefs rank preview backgroundName\`, replacing \`backgroundName\` with the name of the Background`
                    },
                    {
                      name: `Preview all the backgrounds`,
                      value: `Want to see all the Rank Backgrounds in one place? Either check out \`#rank-backgrounds\` channel in my [Support Server](https://discord.gg/YuxSF39) or view the [Imgur Post](https://imgur.com/a/Z2emsOJ)!`
                    }
                  );

                  //return await message.channel.send(embed);
                  return await client.throttleCheck(message.channel, embed, message.author.id);

                
                













                // RANK BGs LIST
                case 'list':
                  embed.setTitle(`Preferences: Rank Backgrounds List`)
                  .addFields(
                    {
                      name: `Standard Backgrounds`,
                      value: standardBackgrounds.join(', ')
                    },
                    {
                      name: `Gradient Backgrounds`,
                      value: gradientBackgrounds.join(', ')
                    },
                    {
                      name: `Pride Backgrounds`,
                      value: prideBackgrounds.join(', ')
                    },
                    {
                      name: `Themed Backgrounds`,
                      value: themedBackgrounds.join(', ')
                    },
                    {
                      name: `\u200B`,
                      value: `*You can see a preview of all my backgrounds in one place either by checking out the \`#rank-backgrounds\` channel in my [Support Server](https://discord.gg/YuxSF39) or viewing the [Imgur Post](https://imgur.com/a/Z2emsOJ)!*`
                    }
                  );

                  //return await message.channel.send(embed);
                  return await client.throttleCheck(message.channel, embed, message.author.id);
                
                
                













                // PREVIEW BGs
                case 'preview':

                  return await Backgrounds.GenerateCardPreview(message, args);
                                  
                
                













                // DISABLE BGs
                case 'disable':
                  await Tables.UserPrefs.update(
                    {
                      rankBackground: 'disable'
                    },
                    {
                      where: {
                        userID: message.author.id
                      }
                    }
                  )
                  .catch(async err => {
                    await Error.LogCustom(err, `(**prefs.js**) Attempted UserPrefs DB Update`);
                    return await Error.LogToUser(message.channel, `Sorry ${message.author.username} - I was unable to save the updated User Preference value. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
                  });

                  embed.setTitle(`Updated Preferences`)
                  .setDescription(`Your preferences for **${option}** background have been updated to **${value}**`);

                  //return await message.channel.send(embed);
                  return await client.throttleCheck(message.channel, embed, message.author.id);
                                                    
                
                













                // SET BGs
                default:

                  // Double-check BG input
                  if ( !backgrounds.includes(value) ) {
                    return await Error.LogToUser(message.channel, `That background/value doesn't exist! Please try again`);
                  }

                  await Tables.UserPrefs.update(
                    {
                      rankBackground: value
                    },
                    {
                      where: {
                        userID: message.author.id
                      }
                    }
                  )
                  .catch(async err => {
                    await Error.LogCustom(err, `(**prefs.js**) Attempted UserPrefs DB Update`);
                    return await Error.LogToUser(message.channel, `Sorry ${message.author.username} - I was unable to save the updated User Preference value. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
                  });

                  embed.setTitle(`Updated Preferences`)
                  .setDescription(`Your preferences for **${option}** background have been updated to **${value}**`);

                  //return await message.channel.send(embed);
                  return await client.throttleCheck(message.channel, embed, message.author.id);

              }

            }


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
              await Error.LogCustom(err, `(**prefs.js**) Attempted UserPrefs DB Update`);
              return await Error.LogToUser(message.channel, `Sorry ${message.author.username} - I was unable to save the updated User Preference value. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
            });


            embed.setTitle(`Updated Preferences`)
            .setDescription(`Your preferences for **${option}** have been updated to **${value}**`);

            //return await message.channel.send(embed);
            return await client.throttleCheck(message.channel, embed, message.author.id);

          }

        }

      }

      //END OF COMMAND
    },
};
