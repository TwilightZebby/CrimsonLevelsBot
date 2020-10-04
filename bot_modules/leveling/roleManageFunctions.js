const Discord = require('discord.js');
const { client } = require('../constants.js');
const { sequelize } = require('../constants.js');
const Tables = require('../tables.js');
const Errors = require('../onEvents/errors.js');
const LevelAmounts = require('../levels.json');
const XPs = require('./xpFunctions.js');
const Levels = require('./levelFunctions.js');

module.exports = {

    /**
     * Returns the User's Level calculated from the given XP
     * 
     * @param {Discord.GuildMember} member Discord Guild Member Object
     * @param {Discord.Guild} guild Discord Guild Object
     * @param {Number} xp User's new XP Total
     * @param {Number} level User's Level based off XP Total
     * @param {Boolean} [isLevelDown] true if the User Leveled DOWN, otherwise ignore
     */
    async Main(member, guild, xp, level, isLevelDown) {

        // Fetch all assigned Roles in Guild from DB, if any
        let assignedRoles = await Tables.GuildRoles.findAll(
            {
                where: {
                    guildID: guild.id
                }
            }
        ).catch(async (err) => {
            return await Errors.LogCustom(err, `Attempted GuildRole data fetch for ${guild.name}`);
        });


        if (assignedRoles.length < 1) {
            // There wasn't any saved Roles for this Guild, so RETURN
            return;
        }
        else {

            // Check for MANAGE_ROLES permission
            let botGuildMember = await guild.members.fetch(client.user.id);
            let manageRoleCheck = botGuildMember.hasPermission('MANAGE_ROLES', {
                checkAdmin: true
            });

            if (manageRoleCheck) {

                // DOES have MANAGE_ROLE Permission

                if ( isLevelDown ) {

                    // User is Leveling DOWN
                    // TODO - will do once Roulette Command has been re-added

                }
                else {

                    // User is Leveling UP
                    return await this.LevelUp(member, guild, xp, level, assignedRoles);

                }

            }
            else {

                // Does NOT have MANAGE_ROLE Permission
                let guildOwner = await guild.members.fetch(guild.ownerID);

                try {
                    let guildOwnerDM = await guildOwner.createDM();
                    guildOwnerDM.send(`Buzz! Seems like you have Level Roles assigned in the Server **${guild.name}**, but I don't have the \`MANAGE_ROLES\` permission!\nI can't grant Level Roles without it!`);
                } catch (err) {
                    return await Errors.LogCustom(err, `Attempted DM to **${guildOwner.user.username}#${guildOwner.user.discriminator}** - who owns the Guild **${guild.name}** (ID: ${guild.id})`);
                }

            }

        }
    },
    
    



















    /**
     * Returns the User's Level calculated from the given XP
     * 
     * @param {Discord.GuildMember} member Discord Guild Member Object
     * @param {Discord.Guild} guild Discord Guild Object
     * @param {Number} xp User's new XP Total
     * @param {Number} level User's Level based off XP Total
     * @param {*} assignedRoles The fetched Database containing all this Guild's assigned Roles
     */
    async LevelUp(member, guild, xp, level, assignedRoles) {

        // Check if User's Level has a Role assigned to it
        let currentLevelSearch = assignedRoles.find(element => element.dataValues.level === level);

        if (currentLevelSearch === undefined) {
            
            // No Role found for that Level, so do NOTHING
            return;

        }
        else {

            // Role found for that Level, so grant it

            let levelRole = null;
            try {
                levelRole = await guild.roles.fetch(currentLevelSearch.dataValues.roleID);
            } catch (err) {
                levelRole = "fail";
            }


            if (levelRole === null || levelRole === "fail") {
                // Unable to fetch Role, so RETURN
                return;
            }
            else {

                // Fetched Role
                await member.roles.add(levelRole, `Leveled up to a new Level Role!`); // Grant new Role

                // Check for any lower Roles to remove
                let lowerLevelSearch = assignedRoles.filter(element => element.dataValues.level < level);

                if (!lowerLevelSearch.length || lowerLevelSearch.length < 1) {

                    // No Lower Level Roles were found
                    return;

                }
                else {

                    // Lower Level Roles found, attempt removal of them IF THE MEMBER HAS THEM
                    let lowerLevelRoles = [];

                    for (let i = 0; i < lowerLevelSearch.length; i++) {

                        // Fetch Roles
                        let tempRoleObject = null;

                        try {
                            tempRoleObject = await guild.roles.fetch(lowerLevelSearch[i].dataValues.roleID);
                        } catch (err) {
                            tempRoleObject = "fail";
                        }

                        if ( tempRoleObject === null || tempRoleObject === "fail" ) {
                            // Unable to fetch Role
                            continue;
                        }
                        else {
                            // Fetched Role
                            lowerLevelRoles.push(tempRoleObject);
                            continue;
                        }

                    }


                    if (!lowerLevelRoles.length || lowerLevelRoles.length < 1) {
                        // No Roles were fetched
                        return;
                    }
                    else {
                        
                        // Check if Member has Role
                        // If Member DOES, then revoke Role
                        // Otherwise, continue on

                        let MemberCurrentRoles = member.roles.cache;

                        for ( let i = 0; i < lowerLevelRoles.length; i++ ) {

                            // Check for Role
                            let hasRole = MemberCurrentRoles.has(lowerLevelRoles[i].id);

                            if (!hasRole) {
                                // Does NOT have Role, continue
                                continue;
                            }
                            else {
                                // DOES have Role
                                await member.roles.remove(lowerLevelRoles[i], `Leveled up to a new Role, revoking previous one`); // Revoke Role
                                continue;
                            }

                        }

                    }

                }

            }

        }

    },

};
