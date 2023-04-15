const roleData = require("../../database/guildData/autorole");

module.exports = async (member) => {
  let data;
  try {
    data = await roleData
      .findOne({
        GuildID: member.guild.id,
      })
      .catch((err) => console.log(err));
  } catch (error) {}
  if (data) {
    let role = data.Role;
    let arole = member.guild.roles.cache.get(role);

    // Check if bot has permission to add roles
    if (!member.guild.me.hasPermission("MANAGE_ROLES")) {
      // If not, send an error message and return
      return console.log("I do not have permission to add roles.");
    }

    // Check if role exists and member is not already in the role
    if (role && arole && !member.roles.cache.has(arole.id)) {
      try {
        member.roles.add(arole);
      } catch (error) {}
    }
  }
};
