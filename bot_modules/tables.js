const Sequlize = require('sequelize');
const { sequelize } = require('./constants.js');












// ********** BLOCKLIST
// Stores Users, Channels, Roles that have been blocked in that Guild

/** @type {Sequlize.Model} */
exports.BlockList = sequelize.define('blocklist', {
    guildID: {
        type: Sequlize.STRING,
        primaryKey: true,
        allowNull: false
    },
    blockedID: {
        type: Sequlize.STRING,
        primaryKey: true,
        allowNull: false
    },
    blockType: {
        type: Sequlize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});












// ********** USER XP
// Stores User's XP per-Guild

/** @type {Sequlize.Model} */
exports.UserXP = sequelize.define('userxp', {
    userID: {
        type: Sequlize.STRING,
        primaryKey: true,
        allowNull: false
    },
    guildID: {
        type: Sequlize.STRING,
        primaryKey: true,
        allowNull: false
    },
    xp: {
        type: Sequlize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    userName: {
        type: Sequlize.STRING,
        defaultValue: `Unknown_Username`,
        allowNull: false
    }
}, {
    freezeTableName: true
});












// ********** USER PREFS
// Stores all the User-specific settings (like backgrounds)

/** @type {Sequlize.Model} */
exports.UserPrefs = sequelize.define('userprefs', {
    userID: {
        type: Sequlize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    rankBackground: {
        type: Sequlize.STRING,
        defaultValue: "default",
        allowNull: false
    },
    levelBackground: {
        type: Sequlize.STRING,
        defaultValue: "false",
        allowNull: false
    },
    mentions: {
        type: Sequlize.STRING,
        defaultValue: "true",
        allowNull: false
    }
}, {
    freezeTableName: true
});












// ********** SERVER CONFIG
// Stores all the Server-specific settings

/** @type {Sequlize.Model} */
exports.GuildConfig = sequelize.define('guildconfig', {
    guildID: {
        type: Sequlize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    prefix: {
        type: Sequlize.STRING,
        defaultValue: "c!",
        allowNull: false
    },
    broadcastChannel: {
        type: Sequlize.STRING,
        defaultValue: "disable",
        allowNull: false
    },
    levelUpMessage: {
        type: Sequlize.STRING,
        defaultValue: "{user} has levelled up to Level {level}!",
        allowNull: false
    },
    levelDownMessage: {
        type: Sequlize.STRING,
        defaultValue: "{user} has fallen down to Level {level}!",
        allowNull: false
    },
    roulette: {
        type: Sequlize.STRING,
        defaultValue: "true",
        allowNull: false
    },
    rouletteCooldown: {
        type: Sequlize.INTEGER,
        defaultValue: 43200,
        allowNull: false
    }
}, {
    freezeTableName: true
});












// ********** SERVER ROLES
// Stores any Level Reward Roles the Server has

/** @type {Sequlize.Model} */
exports.GuildRoles = sequelize.define('guildroles', {
    guildID: {
        type: Sequlize.STRING,
        primaryKey: true,
        allowNull: false
    },
    roleID: {
        type: Sequlize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    level: {
        type: Sequlize.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});
