//=============================================================================
// RTK_TroopEncounter.js  ver1.00 2016/06/26
//=============================================================================

/*:
 * @plugindesc Control to encount Troops in Map
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag_base
 * @desc Tag base name used in Troops's note.
 * @default encount_
 *
 * @help This plugin does not provide plugin commands.
 *
 * Enemy Note:
 *   <encount_sw:n>	# This enemy doesn't encount when switch #n is OFF
 */

/*:ja
 * @plugindesc マップで敵グループとの遭遇をコントロール
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag_base
 * @desc 敵グループのノート欄で使用するタグ名のベース
 * @default encount_
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * 敵キャラのメモ:
 *   <encount_sw:n>	# 指定したn番スイッチがOFFならエンカウントしない
 */

//-----------------------------------------------------------------------------


(function(_global) {
	var N = 'RTK_TroopEncounter';

	var param = PluginManager.parameters(N);
	var tag_base = param['tag_base'] || "encount_";

	var _Game_Player_meetsEncounterConditions = Game_Player.prototype.meetsEncounterConditions;
	Game_Player.prototype.meetsEncounterConditions = function(encounter) {
		var ret = _Game_Player_meetsEncounterConditions.call(this, encounter);
		if (ret) {
			var troop = $dataTroops[encounter.troopId];
			for (var l=0; l<troop.members.length; l++) {
				var enemy = $dataEnemies[troop.members[l].enemyId];
				var sw = Number((enemy.meta||{})[tag_base + "sw"]||"0");
				if (sw > 0 && !$gameSwitches._data[sw]) {
					return false;
				}
			}
		}
		return ret;
	};
})(this);

