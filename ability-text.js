let title = token[0];
let effects = token[1];
ChatMessage.create({
	user: game.user._id,
	flavor: `<h2 style="text-align:center">`+title+`</h2>`,
	speaker: ChatMessage.getSpeaker({token: actor}),
	content: effects
});