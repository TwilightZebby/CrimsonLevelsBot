const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');
const canvasExtras = require("canvas-extras");
const { client } = require('../constants.js');
const ns = require('number-string');

let { PREFIX } = require('../../config.js');
const BaseLevels = require('../levels.json');
const XPs = require('../leveling/xpFunctions.js');
const Levels = require('../leveling/levelFunctions.js');
const Tables = require('../tables.js');
const Error = require('../onEvents/errors.js');
const Prefixs = require('../prefixFunctions.js');
const Devs = require('../cmds/devFunctions.js');


// Arrays so Bot knows if the Text Colour needs changing or not
// ANY backgrounds not listed in these will use the full default white font colour
const darkenAllFont = [
    'pastel', 'agender', 'aromantic', 'demiromantic', 'pansexual', 'transgender', 'rainbow', 'gay', 'lesbian', 'screech', 'dragon'
];
const darkenJustUsername = [
    'genderfluid', 'nonBinary', 'straightAlly'
];
const darkenJustLevels = [
    'asexual'
];


const allBackgrounds = [];
const standardBackgrounds = [];
const prideBackgrounds = [];
const gradientBackgrounds = [];

const standardBGs = fs.readdirSync('./backgrounds/standard').filter(file => file.endsWith('.png'));
for (const file of standardBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    standardBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING);

}

const prideBGs = fs.readdirSync('./backgrounds/pride').filter(file => file.endsWith('.png'));
for (const file of prideBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    prideBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING);

}

const gradientBGs = fs.readdirSync('./backgrounds/gradient').filter(file => file.endsWith('.png'));
for (const file of gradientBGs) {

    // Add to Array
    let tempSTRING = file.toString();
    let tempSTRINGLength = tempSTRING.length;
    tempSTRING = tempSTRING.substr(0, tempSTRINGLength - 4);

    gradientBackgrounds.push(tempSTRING);
    allBackgrounds.push(tempSTRING)

}




// CANVAS

// Apply Text
const applyText = (canvas, text, ctx) => {

    // Base Font Size
    let fontSize = 70;

    do {
        // Change font size based on String Length
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return new result
    return ctx.font;

};

module.exports = {
    name: `backgrounds`,
    description: `Generation of Rank Backgrounds`,





    /**
     * Generates the Rank Card to show the User their own current XP/Level
     * 
     * @param {Discord.Message} message Discord Message Object
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async GenerateAuthorCard(message) {

        // Fetch Database
        let userRankPref = await Tables.UserPrefs.findOrCreate({
            where: {
                userID: message.author.id
            }
        }).catch(async err => {
            return await Error.LogToUser(message.channel, `I was unable to fetch your Preferences. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
        });

        userRankPref = userRankPref[0].dataValues.rankBackground;


        let currentXP = await XPs.FetchXP(message);
        let currentLevel = await Levels.FetchLevel(currentXP);

        // Add commas if need be
        currentXP = ns.toClean(currentXP, {
            thousandSeperator: ",",
        });










        if (userRankPref === `disable`) {

            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);

            return await message.channel.send(`\n> You currently have **${currentXP}** XP, and are Level **${currentLevel}**!\n> Progress to next level: ${levelProgress}%`);

        } else {

            




            // Generate Background
            


            let backgroundPath;
            if (standardBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/standard/${userRankPref}.png`;
            } else if (prideBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/pride/${userRankPref}.png`;
            } else if (gradientBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/gradient/${userRankPref}.png`;
            }




            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);





            // CANVAS
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const canvasBackground = await Canvas.loadImage(backgroundPath);
            ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);


            // Apply text based on colour needed
            if (darkenAllFont.includes(userRankPref)) {

                // DISPLAY NAME
                ctx.font = applyText(canvas, message.member.displayName, ctx);
                ctx.fillStyle = '#000000';
                ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

                // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#000000');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            } else if (darkenJustUsername.includes(userRankPref)) {

                // DISPLAY NAME
                ctx.font = applyText(canvas, message.member.displayName, ctx);
                ctx.fillStyle = '#000000';
                ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

                // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#ffffff');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            } else if (darkenJustLevels.includes(userRankPref)) {

                // DISPLAY NAME
                ctx.font = applyText(canvas, message.member.displayName, ctx);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

                // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#000000');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            } else {

                // DISPLAY NAME
                ctx.font = applyText(canvas, message.member.displayName, ctx);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);
                
                // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#ffffff');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            }


            // User Profile Picture
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({
                format: 'png'
            }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            // Output!
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank.png`);
            return await message.channel.send(``, attachment);

        }

    },
    






















    /**
     * Generates the Rank Card for an [at]mentioned User
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<String>} args args array containing the mentioned User
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async GenerateCardMentioned(message, args) {

        // Attempt to get User
        const user = await Devs.UserCheck(args[0]);

        if (user === "fail") {
            return await Error.LogToUser(message.channel, `That wasn't a valid User! Please try again...`);
        }

        // If its a Bot, RETURN
        if (user.bot) {
            return await Error.LogToUser(message.channel, `I do not store XP for other Bots!`);
        }

        // System Message Check
        if (user.flags.has('SYSTEM')) {
            return await Error.LogToUser(message.channel, `I cannot store XP for Discord's SYSTEM MESSAGES Account!`)
        }

        // Also get Member object as well
        const userMember = await message.guild.members.fetch(user);






        // Fetch Database
        let userRankPref = await Tables.UserPrefs.findOrCreate({
            where: {
                userID: user.id
            }
        }).catch(async err => {
            return await Error.LogToUser(message.channel, `I was unable to fetch ${user.toString()} Preferences. If this issue continues, please contact TwilightZebby on [my Support Server](https://discord.gg/YuxSF39)`);
        });

        userRankPref = userRankPref[0].dataValues.rankBackground;


        let currentXP = await XPs.FetchXP(message, userMember);
        let currentLevel = await Levels.FetchLevel(currentXP);

        // Add commas if need be
        currentXP = ns.toClean(currentXP, {
            thousandSeperator: ",",
        });










        if (userRankPref === `disable`) {

            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message, userMember);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);

            return await message.channel.send(`${user.toString()}\n> You currently have **${currentXP}** XP, and are Level **${currentLevel}**!\n> Progress to next level: ${levelProgress}%`, {
                allowedMentions: {
                    parse: []
                }
            });

        } else {

            let backgroundPath;
            if (standardBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/standard/${userRankPref}.png`;
            } else if (prideBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/pride/${userRankPref}.png`;
            } else if (gradientBackgrounds.includes(userRankPref)) {
                backgroundPath = `./backgrounds/gradient/${userRankPref}.png`;
            }




            // CALCULATE PROGRESS TO NEXT LEVEL
            let currentXPINT = await XPs.FetchXP(message, userMember);
            let levelDifference = BaseLevels[`l${currentLevel + 1}`] - BaseLevels[`l${currentLevel}`];
            let userDifference = currentXPINT - BaseLevels[`l${currentLevel}`];
            let levelProgress = Math.floor(( userDifference / levelDifference ) * 100);





            // CANVAS
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const canvasBackground = await Canvas.loadImage(backgroundPath);
            ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);


            // Apply text based on colour needed
            if (darkenAllFont.includes(userRankPref)) {

                // DISPLAY NAME
                ctx.font = applyText(canvas, userMember.displayName, ctx);
                ctx.fillStyle = '#000000';
                ctx.fillText(userMember.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

		        // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#000000');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            } else if (darkenJustUsername.includes(userRankPref)) {

                // DISPLAY NAME
                ctx.font = applyText(canvas, userMember.displayName, ctx);
                ctx.fillStyle = '#000000';
                ctx.fillText(userMember.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

		        // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#ffffff');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            } else if (darkenJustLevels.includes(userRankPref)) {

                // DISPLAY NAME
                ctx.font = applyText(canvas, userMember.displayName, ctx);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(userMember.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

		        // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#000000');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#000000';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            } else {

                // DISPLAY NAME
                ctx.font = applyText(canvas, userMember.displayName, ctx);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(userMember.displayName, canvas.width / 2.5, canvas.height / 3.0);

                // XPs
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`XP: ${currentXP}`, canvas.width / 2.5, canvas.height / 1.6);

                // LEVELS
                ctx.font = '28px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Level: ${currentLevel}`, canvas.width / 2.5, canvas.height / 2.0);

		        // PROGRESS BAR (thanks to canvas-extras)
                // https://www.npmjs.com/package/canvas-extras
                ctx.beginPath();
                ctx.progressBar(levelProgress, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#ffffff');
                ctx.closePath();

                // LABELS FOR PROGRESS BAR
                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel}`, canvas.width / 2.8, canvas.height / 1.21);

                ctx.font = '24px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`L${currentLevel + 1}`, canvas.width / 1.14, canvas.height / 1.21);

            }


            // User Profile Picture
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const avatar = await Canvas.loadImage(user.displayAvatarURL({
                format: 'png'
            }));
            ctx.drawImage(avatar, 25, 25, 200, 200);

            // Output!
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank.png`);
            return await message.channel.send(``, attachment);

        }

    },
        






















    /**
     * Used for generating a preview of the Rank Card
     * 
     * @param {Discord.Message} message Discord Message Object
     * @param {Array<String>} args args array containing the arguments
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async GenerateCardPreview(message, args) {

        // First check for a BG name
        if ( !args[2] ) {
            return await Error.LogToUser(message.channel, `I couldn't find any given Background Names! Please try again, making sure you use the format: \`${PREFIX}prefs rank preview backgroundName\``);
          }

          // Now look for the background
          let backgroundValue = args[2];

          if ( !allBackgrounds.includes(backgroundValue) ) {
            return await Error.LogToUser(message.channel, `That background doesn't exist! Please try again, making sure you have typed the background's name exactly as it appears in \`${PREFIX}prefs rank list\``);
          }

          // Generate Background preview

          let backgroundPath;
          if ( standardBackgrounds.includes(backgroundValue) ) {
            backgroundPath = `./backgrounds/standard/${backgroundValue}.png`;
          }
          else if ( prideBackgrounds.includes(backgroundValue) ) {
            backgroundPath = `./backgrounds/pride/${backgroundValue}.png`;
          }
          else if ( gradientBackgrounds.includes(userRankPref) ) {
            backgroundPath = `./backgrounds/gradient/${backgroundValue}.png`;
          }


          // CANVAS
          const canvas = Canvas.createCanvas(700, 250);
          const ctx = canvas.getContext('2d');
          const canvasBackground = await Canvas.loadImage(backgroundPath);
          ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);


          // Apply text based on colour needed
          if ( darkenAllFont.includes(backgroundValue) ) {

            // DISPLAY NAME
            ctx.font = applyText(canvas, message.member.displayName, ctx);
            ctx.fillStyle = '#000000';
            ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

            // XPs
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`XP`, canvas.width / 2.5, canvas.height / 1.6);

            // LEVELS
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`Level`, canvas.width / 2.5, canvas.height / 2.0);

            // PROGRESS BAR (thanks to canvas-extras)
            // https://www.npmjs.com/package/canvas-extras
            ctx.beginPath();
            ctx.progressBar(25, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#000000');
            ctx.closePath();

            // LABELS FOR PROGRESS BAR
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`L0`, canvas.width / 2.8, canvas.height / 1.21);

            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`L1`, canvas.width / 1.14, canvas.height / 1.21);

          }
          else if ( darkenJustUsername.includes(backgroundValue) ) {

            // DISPLAY NAME
            ctx.font = applyText(canvas, message.member.displayName, ctx);
            ctx.fillStyle = '#000000';
            ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

            // XPs
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`XP`, canvas.width / 2.5, canvas.height / 1.6);

            // LEVELS
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Level`, canvas.width / 2.5, canvas.height / 2.0);

            // PROGRESS BAR (thanks to canvas-extras)
            // https://www.npmjs.com/package/canvas-extras
            ctx.beginPath();
            ctx.progressBar(25, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#ffffff');
            ctx.closePath();

            // LABELS FOR PROGRESS BAR
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`L0`, canvas.width / 2.8, canvas.height / 1.21);

            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`L1`, canvas.width / 1.14, canvas.height / 1.21);

          }
          else if ( darkenJustLevels.includes(backgroundValue) ) {

            // DISPLAY NAME
            ctx.font = applyText(canvas, message.member.displayName, ctx);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

            // XPs
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`XP`, canvas.width / 2.5, canvas.height / 1.6);

            // LEVELS
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`Level`, canvas.width / 2.5, canvas.height / 2.0);

            // PROGRESS BAR (thanks to canvas-extras)
            // https://www.npmjs.com/package/canvas-extras
            ctx.beginPath();
            ctx.progressBar(25, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#000000');
            ctx.closePath();

            // LABELS FOR PROGRESS BAR
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`L0`, canvas.width / 2.8, canvas.height / 1.21);

            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.fillText(`L1`, canvas.width / 1.14, canvas.height / 1.21);

          }
          else {

            // DISPLAY NAME
            ctx.font = applyText(canvas, message.member.displayName, ctx);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(message.member.displayName, canvas.width / 2.5, canvas.height / 3.0);

            // XPs
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`XP`, canvas.width / 2.5, canvas.height / 1.6);

            // LEVELS
            ctx.font = '28px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Level`, canvas.width / 2.5, canvas.height / 2.0);

            // PROGRESS BAR (thanks to canvas-extras)
            // https://www.npmjs.com/package/canvas-extras
            ctx.beginPath();
            ctx.progressBar(25, 100, canvas.width / 2.3, canvas.height / 1.35, 300, 25, '#ab0202', '#ffffff');
            ctx.closePath();

            // LABELS FOR PROGRESS BAR
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`L0`, canvas.width / 2.8, canvas.height / 1.21);

            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`L1`, canvas.width / 1.14, canvas.height / 1.21);

          }


          // User Profile Picture
          ctx.strokeStyle = '#74037b';
          ctx.strokeRect(0, 0, canvas.width, canvas.height);

          ctx.beginPath();
          ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'png' }));
          ctx.drawImage(avatar, 25, 25, 200, 200);

          // Output!
          const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `rank_background_${backgroundValue}_preview.png`);
          return await message.channel.send(`Here's your preview of the **${backgroundValue}** Rank Background!`, attachment);

    }
}