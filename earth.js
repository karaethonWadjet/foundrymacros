//GEOMANCER-EARTH
const ability = {
	image_path: `https://cdn.discordapp.com/attachments/730664861457055815/928465834421157958/barrier-stone-explosion-debris.webp`,
	ability_name: `EARTH`,
    attack: {
        attack_type: `ranged`,
        attack_roll: `d20`,
        attack_effects: [
            {   
				effect_text: `<b>Effect:</b> Attack target must save or become slow.`,
                effect_type: `target`,
                status_effect: {
                    status: `slow`,
                    save: true
                }
            },
            { 
                effect_type: `terrain`,
                effect_text: `<b>Terrain Effect:</b> Create a height 1 piece of terrain anywhere in unobstructed space in the affected area after the attack resolves.`
            }
        ],
        true_strike: false
    },
    damage: {
        on_miss: 1, //number of dice rolled, 0 indicates fray damage, -1 indicates 1 damage
        on_hit: 2,
        on_crit: 3,
        godly: false,
        piercing: false
    },
    area_damage: {
        area_type: `Arc 4 + Blast 1`,
        damage: 1,
        godly: false,
        piercing: false
    }
};
game.macros.getName('ability_execute').execute(ability);