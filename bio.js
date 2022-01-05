//format is [hit damage]-[miss damage]-[crit damage]-[area type]-[area damage]-[effect]-[name]
game.macros.getName('ability-template').execute(
{token: [`light`,`1`,`heavy`,`Cross 2, Range 6`,`fray`,`<b>Effect:</b> Inflict <i>poisoned</i> on your attack target. If your target was already <i>poisoned</i>, deal <b>bonus damage</b>.`,`BIO`]}
);