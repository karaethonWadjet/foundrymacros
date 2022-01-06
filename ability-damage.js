let dmg_val = token[0];
let boost_val = token[1];
let bonus_val = token[2];
let area_flag = token[3]; //0 for not area, 1 for area

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
    let rollterm = ``;
	let basedie = 0;
	switch(dmg_val){
		case `critical`:
			if((actors[0].data.data.attributes.job.value).localeCompare(`freelancer`)===0){
				bonus_val+=1;
			}
			basedie++;
		case `heavy`:
			basedie++;
		case `light`:
			basedie++;
			let die = actors[0].data.data.attributes.damage.value;
			rollterm = damage_calc(basedie,boost_val,bonus_val,die);
		break;
		case `fray`: //damage = fray
			rollterm = actors[0].data.data.attributes.fray.value+``;
		break;
		default: //damage is a flat calculation
			rollterm = dmg_val;
	}
    if(rollterm.localeCompare(``)!=0){
        let descriptor = `<h3>`;
        if(area_flag > 0){
            descriptor += `Area`;
        }
		descriptor += `Damage Roll:</h3>`;
        let r = await new Roll(rollterm).roll({async:true});
		let dmg_res = await r.render();
		return descriptor + dmg_res;
    }
}