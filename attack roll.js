// JavaScript source code
let optionsText = "";
optionsText += `<option value=0>Neutral</option>`;
let i = 3;
for (; i > 0; i--) {
    optionsText += `<option value="${i}">+${i} Boon</option>`;
}
i = -1;
for (; i > -4; i--) {
    optionsText += `<option value="${i}">${i} Curse</option>`;
}

let confirmed = false;
let boonmod = "";
new Dialog({
    title: "Attack Roll",
    content: `
            <form id="attack-form"> <div class="form-group"> <label>Boons and Curses</label> <div class="form-fields">
            <select name="slot-level">` + optionsText + `</select>
            </div> </div> </form> `,
    buttons: {
        one: {
        icon: '<i class="fas fa-check"></i>',
        label: "Attack",
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
        let boonmod = parseInt(html.find('[name=slot-level]')[0].value);
        disp(boonmod);}
    }}).render(true); 

async function disp(nummod){
    let atkmod = "";
    if(nummod != 0){
        atkmod = "+"+nummod+"d6kh";
    }
    const controlled = canvas.tokens.controlled;

    if (controlled.length > 0) {
        let actors = [];
        for (let i = 0; i < controlled.length; i++) {
            actors.push(controlled[i].actor);
        }
        let r = new Roll(actors[0].data.data.attributes.attack.value+atkmod).roll({async:false});

        let tar = game.user.targets;
        let [mark] = tar;
        let def = mark.actor.data.data.attributes.defense.value;

        let result_html = ``;

        if(r.total >= 20){
            result_html += `CRITICAL HIT!`
        } else if(r.total >= def){
            result_html += `HIT!`
        } else {
            result_html += `MISS!`
        };
        result_html = `<h2><p style="text-align:center">`+result_html+`</p></h2>`
        await r.toMessage({
            speaker: ChatMessage.getSpeaker({token:actor}),
            content: await r.render()+result_html,
        });
    }
}