# Crimson Level Bot
*(Formally "CrimsonRoulette")*

A *free* Leveling Bot that stays a free Leveling Bot, with no music modules or the like. We also allow Users to turn off @mentions from the Bot!

---
### Required Permissions
Upon inviting the Bot to your Server, you will be asked to grant the Bot some Permissions. Don't worry, we only ask for what we need to function!

| Permission | Reason |
|--|--|
| `READ_MESSAGES`, `SEND_MESSAGES` | Required for the Bot to work at all |
| `EMBED_LINKS` | For the Bot's Message Embeds |
| `ATTACH_FILES` | For the `rank` command |
| `ADD_REACTIONS` | For the `role reset` and `reset` commands |
| `MANAGE_ROLES` | Only required if you plan on granting Roles for specific Levels |

---
### Commands
* help [command]
	* Brings up either a list of commands, or help for the specific command
	* **Server Owners** can use `help --owner` to see more commands!
* info
	* Brings up basic information about the Bot, including links to its `top.gg` page, its invite link, and its support server
    * Use the `invite` command to only bring up the Bot's Invite Link
    * Additionally, use the `support` command to bring up the Invite Link to the Bot's Support Server
* changelog
    * Where you can easily find links to the changelogs of the Bot's updates!
* ping
	* pong (returns your ping in milliseconds to the Bot)
* rank [@user]
	* Shows what your XP and Level are in the Server
    * Can also be used to see other user's XP/Level by @mentioning them or pasting their User ID
* top
	* Shows up to the top 10 Members of that Server with the highest XP amount
* prefix [newPrefix]
	* Either shows what the prefix for the Bot is in that Server, or sets a new prefix
	* *Reminder that the Bot's @mention works as a backup prefix too!*
* prefs [option] [value]
	* Brings up what *your* preferences are in the Bot
	* Can be used to set/disable your background for the `rank` command and if you allow @mentions
	* Use `prefs guide` for more info
* settings [option] [value]
	* Brings up what the Server's settings are in the Bot
	* Can be used to configure where Level up messages are sent, among other things
	* Use `settings guide` for more info
* roles [option] [value]
	* Brings up a list of any assigned Level Roles for that Server
	* Can be used to add new Roles, reassign Roles, or clear Roles
	* Use `roles guide` for more info
* reset <@user|all>
	* Used to reset XP back to zero (0) either for a specified @user or for all Members in that Server
* roulette <XPBet>
    * Gamble your XP away and either gain a boost, or risk losing some!
	* Roulette Command and it's cooldown are configurable via `settings` command

---
This bot is still in active development, so feel free to report any bugs or suggest new things via [our support server!](https://discord.gg/YuxSF39)