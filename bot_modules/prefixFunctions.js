const Discord = require('discord.js');
const { client } = require('./constants.js');
const { sequelize } = require('./constants.js');
const Tables = require('./tables.js');
const Errors = require('./onEvents/errors.js');
let { PREFIX } = require('../config.js');

module.exports = {

    // Fetch the Prefix for that Guild
    async Fetch(guildid) {

        let guildData = await Tables.GuildConfig.findOrCreate(
            {
                where: {
                    guildID: guildid
                }
            }
        ).catch(async err => {
            await Errors.LogCustom(err, `Unable to fetch Guild_Config DB Table when fetching Prefix`);
            return String(PREFIX);
        });

        guildData = guildData[0].dataValues;

        let prefixValue = guildData.prefix;

        return String(prefixValue);

    },





    // Save new custom Prefix for that Guild
    async Update(guildid, newPrefix, message) {

        newPrefix = String(newPrefix);

        if ( newPrefix.length >= 4 ) {
            return await Errors.LogToUser(message.channel, `The given Prefix was too large! The maximum length I can accept for a custom prefix is 3 characters, but you entered ${newPrefix.length} characters`);
        }

        await Tables.GuildConfig.update(
            {
                prefix: newPrefix
            },
            {
                where: {
                    guildID: guildid
                }
            }
        ).catch(async err => {
            await Error.LogCustom(err, `Attempted GuildConfig DB Update`);
            return await Error.LogToUser(message.channel, `Sorry ${message.author.username} - I was unable to save the new Prefix. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
        });


        let embed = new Discord.MessageEmbed().setColor('#DC143C')
        .setTitle(`Updated Custom Prefix`)
        .setDescription(`Successfully updated **${message.guild.name}** Prefix to **${newPrefix}**`);

        return await message.channel.send(embed);
    }

};
