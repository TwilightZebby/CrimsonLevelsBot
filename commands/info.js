const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');
const Prefixs = require('../bot_modules/prefixFunctions.js');

let { PREFIX } = require('../config.js');
let { version, dependencies } = require('../package.json');


module.exports = {
    name: 'info',
    description: 'Displays general information about this Bot',
    usage: ' ',
    aliases: ['about'],
    //args: true,
    commandType: 'general',
    cooldown: 3, // IN SECONDS

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

      // Fetch values
      let guildCount = Array.from(client.guilds.cache.values()).length;
      let userZebby = await client.users.fetch('156482326887530498');
      let clientUptime = client.uptime;
      let readableUptime = "";

      // Make Uptime readable
      clientUptime = Math.floor(clientUptime / 1000);
      if ( clientUptime < 60 ) {
        // Seconds
        readableUptime = `${Math.floor(clientUptime)} seconds`;
      }
      else if ( clientUptime >= 60 && clientUptime < 3600 ) {
        // Minutes
        readableUptime = `${Math.floor(clientUptime / 60)} minutes`;
      }
      else if ( clientUptime >= 3600 && clientUptime < 86400 ) {
        // Hours
        readableUptime = `${Math.floor(clientUptime / 3600)} hours`;
      }
      else if ( clientUptime >= 86400 ) {
        // Days
        readableUptime = `${Math.floor(clientUptime / 86400)} days`;
      }


      // Embed
      let embed = new Discord.MessageEmbed().setColor('#DC143C')
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
        name: `Bot Uptime`,
        value: readableUptime,
        inline: true
      }, {
        name: `Top.gg Listing`,
        value: `[Click here](https://top.gg/bot/657859837023092746)`,
        inline: true
      }, {
        name: `Support Server`,
        value: `[Click here](https://discord.gg/YuxSF39)`,
        inline: true
      }, {
        name: `Invite Bot`,
        value: `[Click here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=268487744)`,
        inline: true
      });

      return await client.throttleCheck(message.channel, embed, message.author.id);


      //END OF COMMAND
    },
};
