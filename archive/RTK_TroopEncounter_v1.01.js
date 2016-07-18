//=============================================================================
// RTK_TroopEncounter.js  ver1.01 2016/07/16
//=============================================================================

/*:
 * @plugindesc Control to encount Troops in Map
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag base
 * @desc Tag base name used in Troops's note.
 * @default encount_
 *
 * @param encount switch
 * @desc Player doesn't encount troops when this switch is OFF (0:OFF)
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 *
 * Enemy Note:
 *   <encount_sw:n>	# This enemy doesn't encount when switch #n is OFF
 *   <encount_!sw:n>	# This enemy doesn't encount when switch #n is ON
 */

/*:ja
 * @plugindesc マップで敵グループとの遭遇をコントロール
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag base
 * @desc 敵グループのノート欄で使用するタグ名のベース
 * @default encount_
 *
 * @param encount switch
 * @desc 指定したスイッチがOFFならエンカウントしない (0:OFF)
 * @default 0
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * 敵キャラのメモ:
 *   <encount_sw:n>	# 指定したn番スイッチがOFFならエンカウントしない
 *   <encount_!sw:n>	# 指定したn番スイッチがONならエンカウントしない
 */

//-----------------------------------------------------------------------------


(function(_global) {
	var N = 'RTK_TroopEncounter';

	var param = PluginManager.parameters(N);
	var tag_base = param['tag base'] || "encount_";
	var all_switch = Number(param['encount switch']||"0");

	var _Game_Player_meetsEncounterConditions = Game_Player.prototype.meetsEncounterConditions;
	Game_Player.prototype.meetsEncounterConditions = function(encounter) {
		var ret = _Game_Player_meetsEncounterConditions.call(this, encounter);
		if (ret) {
			if (all_switch > 0 && !$gameSwitches._data[all_switch]) {
				return false;
			}
			var troop = $dataTroops[encounter.troopId];
			for (var l=0; l<troop.members.length; l++) {
				var enemy = $dataEnemies[troop.members[l].enemyId];
				var sw = Number((enemy.meta||{})[tag_base + "sw"]||"0");
				if (sw > 0 && !$gameSwitches._data[sw]) {
					return false;
				}
				sw = Number((enemy.meta||{})[tag_base + "!sw"]||"0");
				if (sw > 0 && $gameSwitches._data[sw]) {
					return false;
				}
			}
		}
		return ret;
	};
})(this);

