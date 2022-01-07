//GEOMANCER-BIO
const ability = {
	image_path: `https://cdn.discordapp.com/attachments/730664861457055815/928467667172618323/explosion-lava-stone-green.webp`,
    ability_name: `BIO`,
	attack: {
		attack_type: `ranged`,
		attack_roll: `d20`,
		attack_effects: [
            {   //effect 1
                effect_text: `<b>Effect:</b> Inflict poisoned on your attack target. If your target was already poisoned, deal bonus damage.`,
                effect_type: `condition`,
                effect_target: `target`,
                condition: {
                    criteria: `check poisoned function`, //check for condition as true against target
                    is_true: `bonus damage`, //add a bonus die to damage roll
                    is_false: `inflict poisoned on enemy` 
                    //game.macros.getName('inflict-status').execute(tar, `poisoned`)
                },
            },
        ],
        true_strike: false
    },
    damage: {
        on_miss: -1, //number of dice rolled, 0 indicates fray damage, -1 indicates 1 damage
        on_hit: 1,
        on_crit: 2,
        godly: false,
        piercing: false
    },
	area_damage: {
        area_type: `Cross 2, Range 6`,
		damage: 0,
		godly: false,
        piercing: false
	}
};

game.macros.getName('ability_execute').execute(ability);