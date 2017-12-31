const request = require("request-promise");
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Online");
});

const reqOptions = {
	uri: "https://www.binance.com/vote/getVote.html",
	json: true
};

client.on("message", async message => {
	if (message.content === "!votes") {
		let reply = await message.channel.send("Getting vote standings...");

		try {
			const res = await request(reqOptions);
			const totalVotes = res.voteList[0].voteCount;
			let voteOptions = res.voteList[0].optionList;
			voteOptions = voteOptions.sort((a, b) => {
				return b.voteNumber - a.voteNumber;
			}).slice(0, 5);
			reply.edit({
				embed: {
					color: 3846809,
					description: "[Binance community vote](https://www.binance.com/vote.html) (top 5)  🞄  [*How to vote*](https://www.reddit.com/r/RaiBlocks/comments/7n7xyn/vote_to_get_xrb_on_binance_howto/)",
					fields: toFields(voteOptions, totalVotes),
					footer: {
						text: getFooter(res.voteList[0].vote.endTime)
					}
				}
			});
		}
		catch (error) {
			reply.edit("Failed to get vote data.");
		}
	}
});

function toFields(voteOptions, totalVotes) {
	const emojis = [":one:", ":two:", ":three:", ":four:", ":five:"];
	return voteOptions.map((v, idx) => {
		const percentage = (v.voteNumber / totalVotes) * 100;
		return {
			name: `${emojis[idx]} ${v.optionName}`,
			value: `${v.voteNumber} (${percentage.toFixed(2)}%)`,
			inline: false
		};
	});
}

function getFooter(voteEndTime) {
	const utcNow = Math.floor(Date.now() / 1000);
	const seconds = voteEndTime - utcNow;
	if (seconds > 0) {
		const days = Math.floor((seconds % 31536000) / 86400);
		const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
		const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
		return `${days}d ${hours}h ${minutes}m remaining for vote.`;
	}
	return "Vote has ended."
}

client.login(process.env.TOKEN);

// Heroku stuff
const express = require("express");
const app = express();

app.set("port", (process.env.PORT || 5000));
//For avoidong Heroku $PORT error
app.get("/", (request, response) => {
	response.send("App is running");
}).listen(app.get("port"), () => {
	console.log("App is running, server is listening on port ", app.get("port"));
	// Ping Heroku app every 5 minutes.
	setInterval(() => {
		console.log("Pinging Heroku app to keep it awake.");
		request("https://binance-vote-bot.herokuapp.com/");
	}, 300000);
});