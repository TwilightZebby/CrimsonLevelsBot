const Discord = require('discord.js');

const { client } = require('../constants.js');
let { PREFIX } = require('../../config.js');
const Prefixs = require('../prefixFunctions.js');

module.exports = {
    name: `help`,
    description: `Outputs Help message, changes dependant on inputs and who triggered command`,




    /**
     * Returns all the commands a standard User can use
     * 
     * @param {Discord.MessageEmbed} embed The Discord Embed to insert the cmd list into
     * @param {Discord.Message} message The Discord Message OBJ to return the Embed to
     * @param {Array<Object>} commands All the commands stored in the Bot
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListCommands(embed, message, commands) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

        embed.setTitle(`Command List`)
        .setDescription(`__Definitions__
        < > means that is required.
        [ ] means that is optional.
        | means either/or.
        **Do __NOT__ include these symbols when typing out the commands!**
        *Server Owners can use \`${PREFIX}help --owner\` to see commands that they can use!*`)
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
                name: `Management Commands`,
                value: commands.filter(command => command.commandType === 'management' && !command.limitation).map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },




















    /**
     * Returns all the commands this Bot's developer can use
     * 
     * @param {Discord.MessageEmbed} embed The Discord Message Embed to insert the Commands into
     * @param {Discord.Message} message The Message object to return the Embed to
     * @param {Array<Object>} commands All the Commands stored in the Bot
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListDevCommands(embed, message, commands) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

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
                name: `Management Commands`,
                value: commands.filter(command => command.commandType === 'management').map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },
    



















    /**
     * Returns all the Commands a Guild Owner can use
     * 
     * @param {Discord.MessageEmbed} embed The Discord Message Embed to insert the Commands into
     * @param {Discord.Message} message The Message Object to return the Embed to
     * @param {Array<Object>} commands All the Commands the Bot has
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListOwnerCommands(embed, message, commands) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

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
                name: `Management Commands`,
                value: commands.filter(command => command.commandType === 'management' && command.limitation !== 'dev').map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },
        



















    /**
     * Returns all the Commands Admins can use
     * 
     * @param {Discord.MessageEmbed} embed The Discord Message Embed to insert the Commands into
     * @param {Discord.Message} message The Message Object to return the Embed to
     * @param {Array<Object>} commands All the Commands the Bot has
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListAdminCommands(embed, message, commands) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

        embed.setTitle(`Command List (Server Admin\'s List)`)
        .setDescription(`__Definitions__
        < > means that is required.
        [ ] means that is optional.
        | means either/or.
        **Do __NOT__ include these symbols when typing out the commands!**`)
        .addFields(
            {
                name: `General Commands`,
                value: commands.filter(command => command.commandType === 'general' && command.limitation !== 'dev' && command.limitation !== 'owner').map(command => command.name).join(', ')
            },
            {
                name: `Level Commands`,
                value: commands.filter(command => command.commandType === 'level' && command.limitation !== 'dev' && command.limitation !== 'owner').map(command => command.name).join(', ')
            },
            {
                name: `Management Commands`,
                value: commands.filter(command => command.commandType === 'management' && command.limitation !== 'dev' && command.limitation !== 'owner').map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },
            



















    /**
     * Returns all the Commands Mods can use
     * 
     * @param {Discord.MessageEmbed} embed The Discord Message Embed to insert the Commands into
     * @param {Discord.Message} message The Message Object to return the Embed to
     * @param {Array<Object>} commands All the Commands the Bot has
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListModCommands(embed, message, commands) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

        embed.setTitle(`Command List (Server Admin\'s List)`)
        .setDescription(`__Definitions__
        < > means that is required.
        [ ] means that is optional.
        | means either/or.
        **Do __NOT__ include these symbols when typing out the commands!**`)
        .addFields(
            {
                name: `General Commands`,
                value: commands.filter(command => command.commandType === 'general' && command.limitation !== 'dev' && command.limitation !== 'owner' && command.limitation !== 'admin').map(command => command.name).join(', ')
            },
            {
                name: `Level Commands`,
                value: commands.filter(command => command.commandType === 'level' && command.limitation !== 'dev' && command.limitation !== 'owner' && command.limitation !== 'admin').map(command => command.name).join(', ')
            },
            {
                name: `Management Commands`,
                value: commands.filter(command => command.commandType === 'management' && command.limitation !== 'dev' && command.limitation !== 'owner' && command.limitation !== 'admin').map(command => command.name).join(', ')
            },
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );



        return await message.channel.send(embed);

    },




















    /**
     * Searches for an existing Command in this Bot
     * 
     * @param {String} name The name, or aliases, of the Command
     * @param {Array<Object>} commands All the commands in this Bot
     * 
     * @returns {Object} command object
     */
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
    



















    /**
     * Returns details of the Command, such as the Cmd's purpose, how it works, etc
     * 
     * @param {Discord.MessageEmbed} embed The Message Embed to insert the help into
     * @param {Discord.Message} message The Message obj to return the Embed to
     * @param {Array<Object>} commands All the commands in the Bot
     * @param {String} name Name of the specific Command we want details on
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async CommandHelp(embed, message, commands, name) {

        // Check for custom Prefix
        PREFIX = await Prefixs.Fetch(message.guild.id);

        // Search for commands
        let command = await this.CommandSearch(name, commands);

        if (!command) {
            embed.setDescription(`Sorry, but that isn\'t a valid command.\nUse \`${PREFIX}help\` to bring up a list of all my commands!`);
            return await message.channel.send(embed);
        } else {

            // Prevent Help if User doesn't have correct Permissions for that Command
            if ( command.limitation ) {

                switch (command.limitation) {

                    case 'mod':
                        let adminPermissionCheck = message.member.hasPermission("ADMINISTRATOR", {checkAdmin: true});
                        let manageGuildPermissionCheck = message.member.hasPermission("MANAGE_GUILD", {checkAdmin: true});
                        let banMembersPermissionCheck = message.member.hasPermission("BAN_MEMBERS", {checkAdmin: true});
                        if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID && !adminPermissionCheck && !manageGuildPermissionCheck && !banMembersPermissionCheck ) {
                            embed.setDescription(`Sorry, but you don\'t have the permissions to use/view this command!`);
                            return await message.channel.send(embed);
                        }
                        break;

                    
                    case 'admin':
                        let adminPermCheck = message.member.hasPermission("ADMINISTRATOR", {checkAdmin: true});
                        if ( message.author.id !== '156482326887530498' && message.author.id !== message.guild.ownerID && !adminPermCheck ) {
                            embed.setDescription(`Sorry, but you don\'t have the permissions to use/view this command!`);
                            return await message.channel.send(embed);
                        }
                        break;


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
                                value: `\u200B Can only be used by this Guild's Owner and those with the \`ADMINISTRATOR\` Permission`
                            }
                        )
                        break;


                    case 'mod':
                        embed.addFields(
                            {
                                name: `Limitations`,
                                value: `\u200B Can only be used by this Guild's Owner, and those with either the \`ADMINISTRATOR\` or \`MANAGE_SERVER\` or \`BAN_MEMBERS\` Permissions`
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