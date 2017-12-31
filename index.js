const request = require("request-promise");
const Discord = require("discord.js");
const settings = require("./settings.json");

const client = new Discord.Client();
client.on("ready", () => {
	console.log("Online");
});

const timeout = ms => new Promise(res => setTimeout(res, ms))

const reqOptions = {
	uri: "https://www.binance.com/vote/getVote.html",
	json: true
};

client.on("message", async message => {
	if (message.content === "!votes") {
		console.log("display votes");
		let reply = await message.channel.send("thanks");
		const res = await request(reqOptions);
		const voteOptions = res.voteList[0].optionList;
		console.log(voteOptions);
		reply.edit(JSON.stringify(voteOptions));
	}
});

client.login(settings.token);