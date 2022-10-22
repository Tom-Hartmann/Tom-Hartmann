module.exports = {
    name: 'timeout',
    description: 'Timeout users.',
    botPerms: ["MODERATE_MEMBERS"],
    userPerms: ["MODERATE_MEMBERS"],
    options: [
        {
            name: 'member',
            description: 'Member to timeout',
            type: 'USER',
            required: 'true'
        },
        {
            name: 'time',
            description: 'How long you want to timeout the member',
            type: 'INTEGER',
            required: 'true'
        },
        {
            name: 'reason',
            description: 'A reason for the timeout',
            type: 'STRING',
            required: 'false'
        }
    ],
    run: async(client, interaction, args) => {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason');
        const time = interaction.options.getInteger('time');

        if(!time) return interaction.followUp({content:" Given time is not valid, it is necessary that you provide valid time!"})
        const response = await member.timeout(time,reason)
        if(!response) return interaction.followUp({content: "I am sorry but for some reason I am unable to timeout this member."})
        return interaction.followUp({content: `${member} has been timed out for ${ms(time, {long:true})}`})
    }
}