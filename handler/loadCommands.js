function loadCommands(client) {
  const fs = require("fs");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Load Status");

  let i = 0;
  const commandFolders = fs.readdirSync("./Commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      i++
      const command = require(`../Commands/${folder}/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
        table.addRow(file, "✔️");
      } else {
        table.addRow(
          file,
          "❌ => Missing a help.name or help.name is not in string"
        );
        continue;
      }
      if (command.aliases && Array.isArray(command))
        command.aliases.forEach((alias) =>
          client.aliases.set(alias, command.name)
        );
    }
    console.log(table.toString());
  }
  var data = JSON.stringify({commands:i})
  fs.writeFile('commands.json',data,finished)
  function finished(err) {
    console.log(`Loaded ${i} Commands`)
  }
}

module.exports = {
  loadCommands,
};
