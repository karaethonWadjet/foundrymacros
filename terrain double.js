const controlled = canvas.tokens.controlled;
    if (controlled.length > 0) {
        let actors = [];
        for (let i = 0; i < controlled.length; i++) {
            actors.push(controlled[i].actor);
        }
        let r = new Roll("1d100").roll({async:false});

        let result_html = ``;

        if(r.total <= 10){
            result_html += `YES!`
		}
		else {
            result_html += `No dubs :(`
        };
        result_html = `<h3><p style="text-align:center">`+result_html+`</p></h3>`
        await r.toMessage({
			flavor: `<h2><p style="text-align:center">Domain Double?</p></h2>`,
            speaker: ChatMessage.getSpeaker({token:actor}),
            content: await r.render()+result_html,
        });
    }