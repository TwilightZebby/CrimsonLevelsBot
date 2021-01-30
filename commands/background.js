const Discord = require("discord.js");
const fs = require('fs');
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');
const Error = require('../bot_modules/onEvents/errors.js');
const Prefixs = require('../bot_modules/prefixFunctions.js');
const Backgrounds = require('../bot_modules/leveling/backgroundFunctions.js');









const backgrounds = [];
const standardBackgrounds = [];
const prideBackgrounds = [];
const gradientBackgrounds = [];
const themedBackgrounds = [];

// Fetch all Backgrounds
const standardBGs = fs.readdirSync('./backgrounds/standard').filter(file => file.endsWith('.png'));
for ( const file of standardBGs ) {

  // Add to Array
  let tempSTRING = file.toString();
  let tempSTRINGLength = tempSTRING.length;
  tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

  backgrounds.push(tempSTRING);
  standardBackgrounds.push(tempSTRING);

}

const prideBGs = fs.readdirSync('./backgrounds/pride').filter(file => file.endsWith('.png'));
for ( const file of prideBGs ) {

  // Add to Array
  let tempSTRING = file.toString();
  let tempSTRINGLength = tempSTRING.length;
  tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

  backgrounds.push(tempSTRING);
  prideBackgrounds.push(tempSTRING);

}

const gradientBGs = fs.readdirSync('./backgrounds/gradient').filter(file => file.endsWith('.png'));
for (const file of gradientBGs) {

  // Add to Array
  let tempSTRING = file.toString();
  let tempSTRINGLength = tempSTRING.length;
  tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

  gradientBackgrounds.push(tempSTRING);
  backgrounds.push(tempSTRING);

}

const themedBGs = fs.readdirSync('./backgrounds/themed').filter(file => file.endsWith('.png'));
for (const file of themedBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    themedBackgrounds.push(tempSTRING);
    backgrounds.push(tempSTRING);

}










module.exports = {
    name: 'background',
    description: 'Used for seeing what Rank Card Backgrounds are available',
    usage: `\nbackground list\nbackground preview backgroundName`,
    aliases: ['backgrounds', 'bg', 'bgs'],
    //args: true,
    commandType: 'general',
    cooldown: 6, // IN SECONDS

    // LIMITATION MUST BE ONE OF THE FOLLOWING:
    //    'dev' - Limits to me only, as the Bot's Developer
    //    'owner' - Limits to Guild Owner and me only
    //    'admin' - Those with the ADMIN Permission, the Guild Owner, and me only
    //    'mod' - Those with the MANAGE_SERVER/BAN_MEMBERS/ADMIN Permissions, the Guild Owner, and me only
    //     otherwise, comment out for everyone to be able to use
    //limitation: 'owner',

    // FLAGS
    //    If the Command has flags allowed in its arguments (eg: "--risk"), list them here in the following format:
    //    [ [ '--flag', `description of what flag does` ], [ '--flagTwo', `description of what flagTwo does` ], ... ]
    //flags: [],

    async execute(message, args) {
      
      // Check for custom Prefix
      PREFIX = await Prefixs.Fetch(message.guild.id);


      // Embed
      const embed = new Discord.MessageEmbed().setColor('#DC143C');








      if ( !args || !args.length || args.length === 0 ) {

        // Output guide when no args are given
        embed.setTitle(`Rank Backgrounds Guide`)
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
            value: `Use \`${PREFIX}background list\` to get a list of all the available backgrounds!`
          },
          {
            name: `Previewing Backgrounds`,
            value: `Want to see what the Background would look like for yourself? Use \`${PREFIX}background preview backgroundName\`, replacing \`backgroundName\` with the name of the Background`
          },
          {
            name: `Preview all the backgrounds`,
            value: `Want to see all the Rank Backgrounds in one place? Either check out \`#rank-backgrounds\` channel in my [Support Server](https://discord.gg/YuxSF39) ~~or view the [Imgur Post](https://imgur.com/a/Z2emsOJ)~~ (Imgur Album to be replaced soon)`
          }
        );


        return await client.throttleCheck(message.channel, embed, message.author.id);

      }
      else if ( args[0].toLowerCase() === "list" ) {

























        // LIST ALL THE BACKGROUNDS
        embed.setTitle(`Rank Backgrounds List`)
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
            value: `*You can see a preview of all my backgrounds in one place either by checking out the \`#rank-backgrounds\` channel in my [Support Server](https://discord.gg/YuxSF39) ~~or viewing the [Imgur Post](https://imgur.com/a/Z2emsOJ)~~* (Imgur Album to be replaced soon)`
          }
        );


        return await client.throttleCheck(message.channel, embed, message.author.id);

      }
      else if ( args[0].toLowerCase() === "preview" ) {






























        // PREVIEW BACKGROUND
        return await Backgrounds.GenerateCardPreview(message, args);

      }
      else {





























        // Catch
        return await Error.LogToUser(message.channel, `That wasn't a valid input!\nValid inputs for the \`background\` command can be found using \`${PREFIX}help background\``);

      }

      //END OF COMMAND
    },
};
