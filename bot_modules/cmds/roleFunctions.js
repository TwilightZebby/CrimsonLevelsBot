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
                name: `Add/Assign a Role`,
                value: `To assign a new Role to a Level, use \`${PREFIX}role add levelNumber @role\`
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
}