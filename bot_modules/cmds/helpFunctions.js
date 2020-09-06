const Discord = require('discord.js');

const { client } = require('../constants.js');
let { PREFIX } = require('../../config.js');

module.exports = {
    name: `help`,
    description: `Outputs Help message, changes dependant on inputs and who triggered command`,




    // Output a list of all the commands (for all Users)
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
                name: `Level Commands`,
                value: commands.filter(command => command.commandType === 'level' && !command.limitation).map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },




















    // List all commands (Yes, all - this is for if I use it)
    async ListDevCommands(embed, message, commands) {

        embed.setTitle(`Command List (Developer\'s List)`)
        .setDescription(`__Definitions__
        < > means that is required.
        [ ] means that is optional.
        | means either/or.
        **Do __NOT__ include these symbols when typing out the commands!**`)
        .addFields(
            {
                name: `General Commands`,
                value: commands.filter(command => command.commandType === 'general').map(command => command.name).join(', ')
            },
            {
                name: `Level Commands`,
                value: commands.filter(command => command.commandType === 'level').map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },
    



















    // List all Commands a Server Owner can see
    async ListOwnerCommands(embed, message, commands) {

        embed.setTitle(`Command List (Server Owner\'s List)`)
        .setDescription(`__Definitions__
        < > means that is required.
        [ ] means that is optional.
        | means either/or.
        **Do __NOT__ include these symbols when typing out the commands!**`)
        .addFields(
            {
                name: `General Commands`,
                value: commands.filter(command => command.commandType === 'general' && command.limitation !== 'dev').map(command => command.name).join(', ')
            },
            {
                name: `Level Commands`,
                value: commands.filter(command => command.commandType === 'level' && command.limitation !== 'dev').map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },




















    // Search for given command
    async CommandSearch(name, commands) {

        // Check if given name is a CMD Name
        let result = commands.get(name);

        // If not, check CMD Aliases
        if (!result) {

            for ( let [key, value] of commands ) {

                if ( value.aliases === undefined ) {
                    continue;
                }

                if ( value.aliases.includes(name) ) {
                    return commands.get(key);
                }

            }

        }
        else {
            return result;
        }

    },
    



















    // Output help on the specified command
    async CommandHelp(embed, message, commands, name) {

        // Search for commands
        let command = await this.CommandSearch(name, commands);

        if (!command) {
            embed.setDescription(`Sorry, but that isn\'t a valid command.\nUse \`${PREFIX}help\` to bring up a list of all my commands!`);
            return await message.channel.send(embed);
        } else {

            // Prevent Help if User doesn't have correct Permissions for that Command
            if ( command.limitation ) {

                switch (command.limitation) {

                    case `dev`:
                        if ( message.author.id !== '156482326887530498' ) {
                            embed.setDescription(`Sorry, but you don\'t have the permissions to use/view this command!`);
                            return await message.channel.send(embed);
                        }
                        break;


                    case `owner`:
                        if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID ) {
                            embed.setDescription(`Sorry, but you don't have the permissions to use/view this command!`);
                            return await message.channel.send(embed);
                        }
                        break;

                    default:
                        break;

                }

            }




            embed.setTitle(`${command.name} command`);


            // COMMAND DETAILS

            if ( command.aliases ) {
                embed.addFields(
                    {
                        name: `Aliases`,
                        value: `\u200B ${command.aliases.join(', ')}`
                    }
                )
            }





            if ( command.description ) {
                embed.addFields(
                    {
                        name: `Description`,
                        value: `\u200B ${command.description}`
                    }
                )
            }





            if ( command.usage ) {
                embed.addFields(
                    {
                        name: `Usage`,
                        value: `\u200B ${PREFIX}${command.name} ${command.usage}`
                    }
                )
            }




            if ( command.flags ) {
                
                let flagNames = [];
                let flagDesc = [];

                for ( let i = 0; i < command.flags.length; i++ ) {

                    flagNames.push(command.flags[i][0]);
                    flagDesc.push(command.flags[i][1]);

                }

                embed.addFields(
                    {
                        name: `Flags`,
                        value: flagNames.join(`\n`),
                        inline: true
                    },
                    {
                        name: `Flag Behaviour`,
                        value: flagDesc.join(`\n`),
                        inline: true
                    }
                );

            }





            if ( command.limitation ) {
                switch (command.limitation) {

                    case 'dev':
                        embed.addFields(
                            {
                                name: `Limitations`,
                                value: `\u200B Can only be used by this Bot\'s Developer`
                            }
                        )
                        break;
                    

                    case 'owner':
                        embed.addFields(
                            {
                                name: `Limitations`,
                                value: `\u200B Can only be used by this Server\'s Owner`
                            }
                        )
                        break;


                    case 'admin':
                        embed.addFields(
                            {
                                name: `Limitations`,
                                value: `\u200B Can only be used by this Server\'s assigned Admins and the Server Owner`
                            }
                        )
                        break;


                    case 'mod':
                        embed.addFields(
                            {
                                name: `Limitations`,
                                value: `\u200B Can only be used by this Server\'s assigned Mods, Admins, and Server Owner`
                            }
                        )
                        break;


                    default:
                        break;

                }
            }



            // Send Embed
            return await message.channel.send(embed);

        }

    }
}