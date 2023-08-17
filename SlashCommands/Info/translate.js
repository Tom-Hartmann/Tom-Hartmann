const axios = require("axios");
const { ApplicationCommandOptionType, MessageEmbed } = require("discord.js");

module.exports = {
  name: "translate",
  description: "Translates text to a specified language",
  options: [
    {
      name: "target_language",
      type: ApplicationCommandOptionType.String,
      description:
        "The language to translate to (e.g., 'EN' for English, 'DE' for German)",
      required: true,
    },
    {
      name: "text",
      type: ApplicationCommandOptionType.String,
      description: "The text to translate",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    const targetLanguage = interaction.options.getString("target_language");
    const text = interaction.options.getString("text");

    const deepLURL = `https://api-free.deepl.com/v2/translate`;
    const params = {
      auth_key: "YOUR_DEEPL_API_KEY", // replace this with your actual DeepL API key
      text: text,
      target_lang: targetLanguage,
    };

    try {
      const response = await axios.post(deepLURL, params);
      const translatedText = response.data.translations[0].text;

      const embed = new MessageEmbed()
        .setTitle("Translation")
        .addField("Original", text, false)
        .addField("Translated", translatedText, false);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Failed to translate text: ${error}`);
      await interaction.reply({
        content: "Sorry, I could not translate the text.",
        ephemeral: true,
      });
    }
  },
};
