const { client } = require('../constants.js');

module.exports = {

    // Dump log in Error Channel and Console!
    async Log(error) {

        // Log to Console
        console.error(error);

        // Log to Channel
        let errorLogChannel = client.guilds.resolve('681805468749922308').channels.resolve('726336306497454081');
        let messageArray = [
            `__**Error**__`,
            `\`\`\`${error}\`\`\``,
            `__**Error Stack Trace**__`,
            `\`\`\`${error.stack}\`\`\``
        ];

        return await errorLogChannel.send(messageArray.join(`\n`));

    }

};