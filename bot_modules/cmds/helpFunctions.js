const Discord = require('discord.js');

const { client } = require('../constants.js');
let { PREFIX } = require('../../config.js');

module.exports = {
    name: `help`,
    description: `Outputs Help message, changes dependant on inputs and who triggered command`,
    async ListCommands(embed, message, commands) {

        embed.setTitle(`Command List`)
        .setDescription(`__Definitions__
        < > means that is required.
        [ ] means that is optional.
        | means either/or.
        **Do __NOT__ include these symbols when typing out the commands!**`)
        .addFields(
            {
                name: `General Commands`,
                value: commands.filter(command => command.commandType === 'general' && !command.limitation).map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    }
}