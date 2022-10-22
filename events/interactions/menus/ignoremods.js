const ignoremodsData = require("../../../database/guildData/ignoremods")

module.exports = async(interaction, client) => {
    if (!interaction.isSelectMenu()) return;
    let msg = await interaction.channel.messages.fetch(interaction.message.id)
    if (interaction.values[0] === "ignoremods") {
        
        await interaction.deferUpdate()

        const data = await ignoremodsData.findOne({
            GuildID: interaction.guild.id
        })

        if (!data) {
            let newData = new ignoremodsData({
                GuildID: interaction.guild.id       
            })

            newData.save();

            return msg.edit('Ignoremods System has been enabled! (Please note that everyone with MANAGE_MESSAGES permissions counts as a moderator)')
        } else if (data) {
            await ignoremodsData.findOneAndRemove({
                GuildID: interaction.guild.id
            })
        
            return msg.edit('Ignoremods System has been disabled!')
        }
    }
}