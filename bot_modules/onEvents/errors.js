const { client } = require('../constants.js');
const Discord = require('discord.js');

module.exports = {

    // Dump log in Error Channel and Console!
    async Log(error) {

        // Log to Console
        console.error(error);

        // Log to Channel
        let errorLogChannel = await client.guilds.fetch('681805468749922308').channels.resolve('726336306497454081');
        let messageArray = [
            `**Error**`,
            `\`\`\`${error}\`\`\``,
            `**Error Stack Trace**`,
            `\`\`\`${error.stack}\`\`\``
        ];

        return await errorLogChannel.send(messageArray.join(`\n`));

    },


    // Same as above, but with a custom message for the Discord Output
    async LogCustom(error, eMessage) {

        // Log to Console
        console.error(`${eMessage}\n`, error);

        // Log to Channel
        let errorLogChannel = await client.guilds.fetch('681805468749922308').channels.resolve('726336306497454081');
        let messageArray = [
            `**Error**`,
            `\`\`\`${error}\`\`\``,
            `**Error Stack Trace**`,
            `\`\`\`${error.stack}\`\`\``
        ];

        return await errorLogChannel.send(`${eMessage}\n${messageArray.join(`\n`)}`);

    },



    // For outputting Errors to the User
    async LogToUser(messageTarget, eMessageContent) {

        const embed = new Discord.MessageEmbed();
        embed.setColor('#9c0000')
        .setTitle(`⚠️ An error has occurred!`)
        .setDescription(`${eMessageContent}`);

        return await messageTarget.send(embed);

    }

};