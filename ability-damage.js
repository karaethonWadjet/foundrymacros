let vargs = token;
let bonus_val = vargs[5];
let boost_val = vargs[4];
let dam_val = vargs[0];
let area_flag = vargs[6]; //0 for not area, 1 for area

function damage_calc(damage,boost,bonus,die){
    if(bonus > 0 || damage+boost > 3){
        return damage+boost+bonus+die+`k`+Math.min(damage+boost,3);
    } else {
        return damage+boost+die;
    }
}

const controlled = canvas.tokens.controlled;
if (controlled.length > 0) {
        let actors = [];
        for (let i = 0; i < controlled.length; i++) {
            actors.push(controlled[i].actor);
        }
    let i = 0;
    //args 0 will be:
    //1 - miss
    //2 - hit
    //3 - crit
    let rollterm = ``;
    let die = actors[0].data.data.attributes.damage.value;
    let damage = vargs[dam_val]+``;
    if(damage.localeCompare(`critical`)===0){
        if((actors[0].data.data.attributes.job.value).localeCompare(`freelancer`)===0){
            bonus_val+=1;
        }
        rollterm = damage_calc(3, boost_val, bonus_val, die);
    } else if(damage.localeCompare(`heavy`)===0){
        rollterm = damage_calc(2, boost_val, bonus_val, die);
    } else if(damage.localeCompare(`light`)===0){
        rollterm = damage_calc(1, boost_val, bonus_val, die);
    } else if(damage.localeCompare(`fray`)===0){
        //damage = fray
        rollterm = actors[0].data.data.attributes.fray.value+``;
    } else {
        //damage is a flat calculation
        rollterm = damage;
    }
    console.log(`ability damage: rollterm = `+rollterm);
    if(rollterm.localeCompare(``)!=0){
        let descriptor = `Damage Roll`;
        if(area_flag > 0){
            descriptor = `Area Damage Roll`;
        }
        let r = await new Roll(rollterm).roll({async:true})

        await r.toMessage({
            speaker: ChatMessage.getSpeaker({token:actor}),
            flavor: `<h3><p style="text-align:center">`+descriptor+`</p></h3>`,
            content: await r.render(),
        });
    }
}