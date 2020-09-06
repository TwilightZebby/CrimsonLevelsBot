const { client } = require('../constants.js');

module.exports = {

    // Dump log in Error Channel and Console!
    async Log(error) {

        // Log to Console
        console.error(error);

        // Log to Channel
        let errorLogChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');
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
        let errorLogChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');
        let messageArray = [
            `**Error**`,
            `\`\`\`${error}\`\`\``,
            `**Error Stack Trace**`,
            `\`\`\`${error.stack}\`\`\``
        ];

        return await errorLogChannel.send(`${eMessage}\n${messageArray.join(`\n`)}`);

    }

};