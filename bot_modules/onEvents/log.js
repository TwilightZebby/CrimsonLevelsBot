const Discord = require('discord.js');

const { client } = require('../constants.js');

module.exports = {
    name: `log`,
    description: `Logs the Guild name and amount of members for each time the Bot is invited to or kicked from a Guild`,


    /**
     * Logs to Bot Developer whenever the Bot is invited to a Guild
     * 
     * @param {Discord.Guild} guild Discord Guild Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async JoinedGuild(guild) {

        // FOR WHEN THE BOT IS INVITED TO A GUILD
        let logChannel = await client.guilds.fetch('681805468749922308');
        logChannel = logChannel.channels.resolve('718720727829708811');
        const embed = new Discord.MessageEmbed().setColor('#33db00');


        // Fetch into cache
        await guild.members.fetch();


        // Grab Guild Info
        let guildName = guild.name;
        let guildOwner = await client.users.fetch(guild.ownerID); // Returns User Object
        let guildIcon = guild.iconURL();

        let guildMemberCount = Array.from(guild.members.cache.values()).filter(member => {
            return !member.user.bot;
        }).length;

        let guildBotCount = Array.from(guild.members.cache.values()).filter(member => {
            return member.user.bot;
        }).length;

        // Amount of Servers this Bot is in
        let botGuildAmount = Array.from(client.guilds.cache.values()).length;




        // Construct Embed
        embed.setTitle(`Joined a new Guild!`)
        .addFields({
            name: `Guild ID`,
            value: guild.id
        },
        {
            name: `Guild Name`,
            value: guildName
        }, {
            name: `Guild Owner`,
            value: `${guildOwner.username}\#${guildOwner.discriminator}`
        }, {
            name: `Member Count`,
            value: guildMemberCount
        }, {
            name: `Bot Count`,
            value: guildBotCount,
            inline: true
        })
        .setThumbnail(guildIcon)
        .setFooter(`${client.user.username} is in ${botGuildAmount} Guilds`);



        return await logChannel.send(embed);

    },




    
    /**
     * Logs to the Bot Developer whenever Bot leaves a Guild
     * 
     * @param {Discord.Guild} guild Discord Guild Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async LeftGuild(guild) {

        // FOR WHEN THE BOT IS KICKED FROM A GUILD
        let logChannel = await client.guilds.fetch('681805468749922308');
        logChannel = logChannel.channels.resolve('718720727829708811');
        const embed = new Discord.MessageEmbed().setColor('#800000');



        // Grab Guild Info
        let guildName = guild.name;
        let guildOwner = await client.users.fetch(guild.ownerID); // Returns User Object
        let guildIcon = guild.iconURL();


        // Amount of Servers this Bot is in
        let botGuildAmount = Array.from(client.guilds.cache.values()).length;




        // Construct Embed
        embed.setTitle(`Left a Guild`)
        .addFields({
            name: `Guild ID`,
            value: guild.id
        },
        {
            name: `Guild Name`,
            value: guildName
        },
        {
            name: `Guild Owner`,
            value: `${guildOwner.username}\#${guildOwner.discriminator}`
        })
        .setThumbnail(guildIcon)
        .setFooter(`${client.user.username} is in ${botGuildAmount} Guilds`);



        return await logChannel.send(embed);

    },
}