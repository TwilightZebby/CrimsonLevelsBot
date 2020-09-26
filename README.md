# CrimsonLevelsBot
Formally "CrimsonRoulette", this Discord Bot aims to be the most feature-packed Leveling Bot.

---

## Developer Command
*Can only be used by myself, TwilightZebby*

Sub-commands:

* `user <userID||@user> view <xp||level> <guildID>`
> Brings up that User's current XP amount or Level in that Guild

* `user <userID||@user> view <prefs>`
> Brings up that User's set Preferences

* `user <userID||@user> set <xp||level> <guildID> <amount>`
> Force-sets the User's XP amount in that Guild to either a given XP amount, or to match the given Level

* `user <userID||@user> set <prefOption> <prefValue>`
> Force-sets the User's `<prefOption>` to be that of the given Value

* `global view modifier`
> Displays what the current Global Modifier is for XPs

* `global view level <levelNumber>`
> Displays what the base amount of XP is required to reach that Level

* `global set modifier <float>`
> Sets the Global XP Modifier to the new FLOAT value (default 1.0)
