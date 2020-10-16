const Discord = require("discord.js");
const fs = require('fs');
//const Canvas = require('canvas');
const Chance = require('chance');
let chance = new Chance();
const { client } = require('../constants.js');

let { PREFIX } = require('../../config.js');
const XPs = require('../leveling/xpFunctions.js');
const Levels = require('../leveling/levelFunctions.js');
const Tables = require('../tables.js');
const Error = require('../onEvents/errors.js');
const Prefixs = require('../prefixFunctions.js');
const ManageRoles = require('../leveling/roleManageFunctions.js');
const broadcastFunctions = require('../leveling/broadcastFunctions.js');

// Global variables and consts for roulette
const standardResults = [
    [
        "returnBet",
        "loseHalfBet", "loseBet", "loseDoubleBet", "loseTripleBet", "loseALevel", "loseThreeLevels",
        "winBetPlusHalf", "winDoubleBet", "winTripleBet", "winALevel", "winThreeLevels"
    ],
    [
        10,
        7, 8, 6, 5, 1, 0.3,
        7, 6, 5, 4, 1,
    ]
];
const riskyResults = [
    [
        "returnBet",

        "loseHalfBet", "loseBet", "loseDoubleBet", "loseTripleBet", "loseALevel", "loseThreeLevels",
        "loseHalfBet_Plus1Member", "loseBet_Plus1Member", "loseDoubleBet_Plus1Member", "loseTripleBet_Plus1Member", "loseALevel_Plus1Member",
        "loseHalfBet_Plus4Members", "loseBet_Plus4Members", "loseDoubleBet_Plus4Members", "loseTripleBet_Plus4Members", "loseALevel_Plus4Members",
        "loseALevel_PlusHalfGuild", "loseALevel_PlusWholeGuild",

        "winBetPlusHalf", "winDoubleBet", "winTripleBet", "winALevel", "winThreeLevels",
        "winBetPlusHalf_Plus1Member", "winDoubleBet_Plus1Member", "winTripleBet_Plus1Member", "winALevel_Plus1Member",
        "winBetPlusHalf_Plus4Members", "winDoubleBet_Plus4Members", "winTripleBet_Plus4Members", "winALevel_Plus4Members",
        "winALevel_PlusHalfGuild", "winALevel_PlusWholeGuild",
    ],
    [
        10,

        7, 8, 6, 5, 1, 0.3,
        3, 2, 2, 1, 1,
        2, 1, 1, 0.1, 0.1,
        0.00001, 0.000000001,

        7, 6, 5, 4, 1,
        3, 2, 1, 1,
        2, 1, 1, 0.1,
        0.00001, 0.000000001
    ]
];



module.exports = {
    name: `roulette`,
    description: `All the stuff for the roulette command`,




    
    /**
     * Starting point for Roulette Command (without risky flag)
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Number} bet Integer representing the XP Bet
     * @param {Number} authorXP Integer representing the Author's current XP count
     * @param {Discord.MessageEmbed} embed Discord Message Embed Object
     */
    async MainStandard(message, bet, authorXP, embed) {

        //.

    }
}