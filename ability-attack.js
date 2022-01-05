//ability attack [DEPRECATED]
let boons = token[0];
const controlled = canvas.tokens.controlled;
if (controlled.length > 0) {
        let actors = [];
        for (let i = 0; i < controlled.length; i++) {
            actors.push(controlled[i].actor);
        }
    let suffix = ``;
    if(boons>1){
        suffix = `+`+Math.min(boons,3)+`d6kh`;
    } else if (boons===1){
        suffix = `+1d6`;
    }
    let r = await new Roll(actors[0].data.data.attributes.attack.value+suffix).roll({async:true})

    let tar = game.user.targets;
    let [mark] = tar;
    let def = mark.actor.data.data.attributes.defense.value;

    let result_html = '';
    let return_val = 0;
    if(r.total >= 20){
        result_html = `CRITICAL HIT!`;
        return_val = 3;
    } else if(r.total >= def){
        result_html = `HIT!`;
        return_val = 1;
    } else {
        result_html = `MISS!`;
        return_val = 2;
    };
    console.log(`ability-attack: return_val = `+return_val);
    result_html = `<h2><p style="text-align:center">`+result_html+`</p></h2>`
    await r.toMessage({
        speaker: ChatMessage.getSpeaker({token:actor}),
        flavor: `<h3><p style="text-align:center">Attack Roll</p></h3>`,
        content: await r.render()+result_html,
    });
    return return_val;
}