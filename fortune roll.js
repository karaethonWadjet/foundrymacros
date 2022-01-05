// ICON Narrative Play Fortune Roll
let optionsText = "";
optionsText += `<option value=0>0 [2d6kl]</option>`;
let i = 1;
for (; i < 10; i++) {
    optionsText += `<option value="${i}">${i}</option>`;
}

let confirmed = false;
let boonmod = "";
new Dialog({
    title: "FORTUNE Roll",
    content: `
            <form id="fortune-form"> <div class="form-group"> <label># of Dice</label> <div class="form-fields">
            <select name="dice-number">` + optionsText + `</select>
            </div> </div> </form> `,
    buttons: {
        one: {
        icon: '<i class="fas fa-dice"></i>',
        label: "ROLL!!",
        callback: () => confirmed = true
    },
        two: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => confirmed = false
    }
},
default: "Cancel",
    close: html => {
    if(confirmed){
        let boonmod = parseInt(html.find('[name=dice-number]')[0].value);
        disp(boonmod);}
    }}).render(true); 

async function disp(boons){
        let rollterm = ``;
        if(boons === 0){
            rollterm = `2d6kl`;
        } else if (boons === 1){
            rollterm = `1d6`;
        } else {
            rollterm = boons+`d6kh`;
        }
        
        let r = new Roll(rollterm).roll({async:false});
		
		let result_html = ChatMessage.getSpeaker({token:actor})+`'s Fortune: `;

		switch(r.total){
			case 1:
			case 2:
			case 3:
			result_html += `Poor result or outcome`
			break;
			case 4:
			case 5:
			result_html += `Expected or average result or outcome`
			break;
			case 6:
			result_html += `Good result or outcome`
			break;
			default:
			result_html += `??`
		};

        await r.toMessage({
            speaker: ChatMessage.getSpeaker({token:actor}),
            content: await r.render()+result_html,
        });
}