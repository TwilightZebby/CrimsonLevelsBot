const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

let { PREFIX } = require('../config.js');
let { version, dependencies } = require('../package.json');


module.exports = {
    name: 'info',
    description: 'Displays general information about this Bot',
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

    async execute(message) {

      // Fetch values
      let guildCount = Array.from(client.guilds.cache.values()).length;
      let userZebby = await client.users.fetch('156482326887530498');


      // Embed
      let embed = new Discord.MessageEmbed().setColor('#07f51b')
      .setTitle(`${client.user.username} Information`)
      .setDescription(`These are my stats and links! If you want my commands, use \`${PREFIX}help\``)
      .addFields({
        name: `Bot Developer`,
        value: `${userZebby.username}\#${userZebby.discriminator}`,
        inline: true
      }, {
        name: `Bot Version`,
        value: version,
        inline: true
      }, {
        name: `Discord.JS Version`,
        value: dependencies["discord.js"],
        inline: true
      }, {
        name: `Current Prefix`,
        value: PREFIX,
        inline: true
      }, {
        name: `Guilds`,
        value: guildCount,
        inline: true
      }, {
        name: `\u200B`,
        value: `\u200B`,
        inline: true
      }, {
        name: `Top.gg Listing`,
        value: `[Click here](https://top.gg/bot/657859837023092746)`,
        inline: true
      }, {
        name: `Support Server`,
        value: `[Click here](https://discord.gg/hTstSCv)`,
        inline: true
      }, {
        name: `Invite Link`,
        value: `[Click here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=268487680)`,
        inline: true
      });

      return await message.channel.send(embed);


      //END OF COMMAND
    },
};
