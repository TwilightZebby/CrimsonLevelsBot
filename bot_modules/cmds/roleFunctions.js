const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const { client } = require('../constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../leveling/xpFunctions.js');
const Levels = require('../leveling/levelFunctions.js');
const Tables = require('../tables.js');
const Error = require('../onEvents/errors.js');
const Prefixs = require('../prefixFunctions.js');

module.exports = {
    name: `roles`,
    description: `All the sub-commands and handlers for the Reward Roles`,




    /**
     * Brings up a list of all the Rewards Roles, if any
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.MessageEmbed} embed Discord Message Embed Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListRoles(message, embed) {

        // Fetch Roles for Guild
        let guildRoleDatabase = await Tables.GuildRoles.findAll(
            {
                where: {
                    guildID: message.guild.id
                },
                order: [
                    [ 'level', 'ASC' ]
                ]
            }
        ).catch(async (err) => {
            await Error.LogCustom(err, `Attempted GuildRoles data fetch for ${message.guild.name}`);
            return await Error.LogToUser(message.channel, `I was unable to fetch the Roles data for Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
        });

        

        if ( !guildRoleDatabase || !guildRoleDatabase.length ) {

            // NO ROLES FOUND FOR GUILD

            embed.setTitle(`${message.guild.name} Level Roles`)
            .setDescription(`*No Roles have been assigned for this Server!*`)
            .addFields(
                {
                    name: `Additional Information`,
                    value: `Use \`${PREFIX}role guide\` for more info on how to use this command`
                }
            );

            return await message.channel.send(embed);

        }
        else {

            // ROLE(s) FOUND FOR GUILD

            let roleListArray = [];
            let failedRoleCount = 0;

            for ( let i = 0; i < guildRoleDatabase.length; i++ ) {

                let temp = guildRoleDatabase[i].dataValues;
                
                // Check Role still exists
                let tempRoleObject = null;

                try {
                    tempRoleObject = await message.guild.roles.fetch(temp.roleID);
                } catch (err) {
                    tempRoleObject = "fail";
                }



                if (tempRoleObject === null || tempRoleObject === "fail") {

                    // Role DOES NOT exist
                    failedRoleCount++;
                    continue;

                }
                else {

                    // Role does exist
                    roleListArray.push(`**Level ${temp.level}:** ${tempRoleObject.toString()}`);
                    continue;

                }

            }



            // Construct Embed
            embed.setTitle(`${message.guild.name} Level Roles`)
            .addFields(
                {
                    name: `\u200B`,
                    value: `\u200B`
                },
                {
                    name: `Additional Information`,
                    value: `Use \`${PREFIX}role guide\` for more info on how to use this command`
                }
            );

            // Check length of Description
            let descriptionCheck = roleListArray.join(`\n`);

            if ( descriptionCheck.length > 2048 ) {
                embed.setDescription(`*[Unable to show all assigned Roles due to how many there are for this Server!]*`);
            }
            else {
                embed.setDescription(descriptionCheck);
            }

            return await message.channel.send(embed);

        }

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.MessageEmbed} embed Discord Message Embed Object
     * 
     * @returns {Prmoise<Discord.Message>} wrapped Message
     */
    async Guide(message, embed) {

        embed.setTitle(`Role Command Guide`)
        .addFields(
            {
                name: `List Assigned Roles`,
                value: `To view all the currently assigned Roles (if any), use \`${PREFIX}role\``
            },
            {
                name: `Add/Assign/Update a Role`,
                value: `To assign a new Role to a Level, or update an existing assigned Level, use \`${PREFIX}role add levelNumber @role\`
                (EXAMPLE: \`${PREFIX}role add 5 @Beginner\`)`
            },
            {
                name: `Remove/Unassign a Role`,
                value: `To remove a Role from the database, use \`${PREFIX} role remove levelNumber\`
                (EXAMPLE: \`${PREFIX}role remove 5)`
            },
            {
                name: `Reset/Remove all Roles`,
                value: `To wipe all **your** assigned Roles from the database, use \`${PREFIX}role reset\``
            },
            {
                name: `Extra Information`,
                value: `• In order for me to be able to grant/revoke assigned Roles, I need the \`MANAGE_ROLES\` Permission.
                • Additionally, my highest Role needs to be *above* all assigned Roles for me to be able to grant them!
                • You are able to use either an @role mention or the Role's ID when assigning a new Role too`
            }
        );

        return await message.channel.send(embed);

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<String>} args User inputted Arguments
     * @param {Discord.MessageEmbed} embed Discord Message Embed Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async AddRole(message, args, embed) {

        // First check args
        if ( !args || !args.length ) {
            return await Error.LogToUser(message.channel, `I couldn't see either a Level Number or @role in that!`);
        }
        else if (args.length <= 1) {
            return await Error.LogToUser(message.channel, `Seems like you're missing either the Level Number or the @role in that!`);
        }
        else {

            // Attempt converting of STRING to INT for levelNumber
            let levelNumber = Number(args.shift());

            if (isNaN(levelNumber)) {
                return await Error.LogToUser(message.channel, `Looks like that given level number wasn't a number! Please try again...`);
            }

            levelNumber = Math.floor(levelNumber);


            // Check levelNumber isn't greater than 200
            if ( levelNumber >= 201 ) {
                return await Error.LogToUser(message.channel, `Seems like you are trying to assign a Role for a Level *above* my maximum!
                (The maximum Level is 200)`);
            }



            // Now attempt to fetch Role
            const roleArg = args.shift();
            let fetchedRole = null;

            try {
                fetchedRole = await message.guild.roles.fetch(roleArg);
            } catch (err) {
                fetchedRole = "fail";
            }

            if ( fetchedRole === null || fetchedRole === "fail" ) {
                
                try {
                    fetchedRole = await message.guild.roles.fetch(roleArg.slice(3, roleArg.length - 1));
                } catch (err) {
                    fetchedRole = "stillFail";
                }

                if ( fetchedRole === null || fetchedRole === "fail" || fetchedRole === "stillFail" ) {
                    return await Error.LogToUser(message.channel, `I wasn't able to find the given Role! Please try again using either an @role mention or the Role's ID`);
                }

            }



            // Save to Database
            let checkRoleDB = await Tables.GuildRoles.findAll(
                {
                    where: {
                        guildID: message.guild.id,
                        level: levelNumber
                    }
                }
            ).catch(async (err) => {
                await Error.LogCustom(err, `Attempted to search for a Role in Guild ${message.guild.name}`);
            });


            if ( checkRoleDB.length < 1 ) {

                // Level doesn't already exist for this Guild,
                // thus, assign NEW role

                await Tables.GuildRoles.create(
                    {
                        guildID: message.guild.id,
                        roleID: fetchedRole.id,
                        level: levelNumber
                    }
                ).catch(async (err) => {
                    await Error.LogCustom(err, `Attempted GuildRoles data creation for ${message.guild.name}`);
                    return await Error.LogToUser(message.channel, `I was unable to assign the Role data for Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
                });


                // Confirmation Embed
                embed.setTitle(`${message.guild.name} Level Roles`)
                .setDescription(`Successfully assigned the Role ${fetchedRole.toString()} to Level ${levelNumber}`);

                return await message.channel.send(embed);

            }
            else {

                // Level DOES exist already for this Guild,
                // thus, update previous Role

                await Tables.GuildRoles.update(
                    {
                        roleID: fetchedRole.id
                    },
                    {
                        where: {
                            guildID: message.guild.id,
                            level: levelNumber
                        }
                    }
                ).catch(async (err) => {
                    await Error.LogCustom(err, `Attempted GuildRoles data update for ${message.guild.name}`);
                    return await Error.LogToUser(message.channel, `I was unable to update the Role data for Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
                });


                embed.setTitle(`${message.guild.name} Level Roles`)
                .setDescription(`Successfully updated Level ${levelNumber} to use the Role ${fetchedRole.toString()} instead of \<\@\&${checkRoleDB[0].dataValues.roleID}\>`);

                return await message.channel.send(embed);

            }

        }

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<String>} args User inputted Arguments
     * @param {Discord.MessageEmbed} embed Discord Message Embed Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async RemoveRole(message, args, embed) {

        // First check args
        if ( !args || !args.length ) {
            return await Error.LogToUser(message.channel, `I couldn't see a Level Number in that!`);
        }
        else {

            // Attempt converting of STRING to INT for levelNumber
            let levelNumber = Number(args.shift());

            if (isNaN(levelNumber)) {
                return await Error.LogToUser(message.channel, `Looks like that given level number wasn't a number! Please try again...`);
            }

            levelNumber = Math.floor(levelNumber);


            // Check levelNumber isn't greater than 200
            if ( levelNumber >= 201 ) {
                return await Error.LogToUser(message.channel, `Seems like you are trying to remove a Role for a Level *above* my maximum!
                (The maximum Level is 200)`);
            }



            // Check to see if there's an existing Role to remove
            let roleCheck = await Tables.GuildRoles.findAll(
                {
                    where: {
                        guildID: message.guild.id,
                        level: levelNumber
                    }
                }
            ).catch(async (err) => {
                await Error.LogCustom(err, `Attempted GuildRoles data removal for ${message.guild.name}`);
                return await Error.LogToUser(message.channel, `I was unable to remove the Role data for Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
            });


            if ( roleCheck.length < 1 ) {
                return await Error.LogToUser(message.channel, `There isn't any Role assigned at Level ${levelNumber} for me to remove!`);
            }
            else {

                // Clear Role
                await Tables.GuildRoles.destroy(
                    {
                        where: {
                            guildID: message.guild.id,
                            level: levelNumber
                        }
                    }
                ).catch(async (err) => {
                    await Error.LogCustom(err, `Attempted GuildRoles data removal for ${message.guild.name}`);
                    return await Error.LogToUser(message.channel, `I was unable to remove the Role data for Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
                });


                // Output
                embed.setTitle(`${message.guild.name} Level Roles`)
                .setDescription(`Successfully unassigned the Role \<\@\&${roleCheck[0].dataValues.roleID}\> from Level ${levelNumber}`);

                return await message.channel.send(embed);

            }
        }

    },
    
    



















    /**
     * Checks the inputted User Mention or ID to see if it's valid
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Discord.MessageEmbed} embed Discord Message Embed Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ResetRoles(message, embed) {

        // Send confirmation message
        embed.setTitle(`Reset Level Roles Confirmation`)
        .setDescription(`Please click the ✅ emoji reaction on this message to confirm that you do indeed want to wipe all the assigned Roles from this Server's Database`);

        const confirmationMessage = await message.channel.send(embed);
        await confirmationMessage.react('✅').catch(async (err) => {
            await Error.Log(err);
        });


        // Wait for reaction
        const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
        const collector = confirmationMessage.createReactionCollector(filter, {
            time: 10000
        })
        .on("collect", (reaction, user) => {
            collector.stop("confirmed");
        })
        .on("end", async (collected, reason) => {

            if ( ["time", "idle"].includes(reason) ) {

                embed.setTitle(`⌛ Confirmation Timed Out`)
                .setDescription(`You were too slow to respond, sorry! (Trigger this again using \`${PREFIX}role reset\` if need be)`);

                await confirmationMessage.edit(embed);
                return await confirmationMessage.reactions.removeAll();

            }
            else if ( ["user", "confirmed"].includes(reason) ) {

                await Tables.GuildRoles.destroy(
                    {
                        where: {
                            guildID: message.guild.id
                        }
                    }
                ).catch(async (err) => {
                    
                    await Error.LogCustom(err, `Attempted GuildRoles data removal for ${message.guild.name}`);

                    embed.setColor('#9c0000')
                    .setTitle(`⚠️ An error has occurred!`)
                    .setDescription(`I was unable to remove the Role data for Guild **${message.guild.name}**\nIf this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);

                    return await confirmationMessage.edit(embed);

                });


                embed.setTitle(`Reset Level Roles`)
                .setDescription(`Successfully cleared all previously assigned Roles for this Server ( ${message.guild.name} )`);
                return await confirmationMessage.edit(embed);

            }

        });

    },
}