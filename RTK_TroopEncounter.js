//=============================================================================
// RTK_TroopEncounter.js  ver1.03 2016/07/21
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
 * @param amulet items
 * @desc Player doesn't encount with these items (0:OFF)
 * @default 0
 *
 * @param amulet weapons
 * @desc Player doesn't encount with these weapons (0:OFF)
 * @default 0
 *
 * @param amulet armors
 * @desc Player doesn't encount with these armors (0:OFF)
 * @default 0
 *
 * @param amulet states
 * @desc Player doesn't encount if an actor has these states (0:OFF)
 * @default 0
 *
 * @help Plugin to control to encount Troops in Map
 *
 * Plugin Command:
 *  RTK_TroopEncounter items 4,5,6	# Replace amulet items by 4,5,6
 *  RTK_TroopEncounter items reset	# Reset amulet items
 *  RTK_TroopEncounter weapons 4,5,6	# Replace amulet weapons by 4,5,6
 *  RTK_TroopEncounter weapons reset	# Reset amulet weapons
 *  RTK_TroopEncounter armors 4,5,6	# Replace amulet armors by 4,5,6
 *  RTK_TroopEncounter armors reset	# Reset amulet armors
 *  RTK_TroopEncounter states 4,5,6	# Replace amulet states by 4,5,6
 *  RTK_TroopEncounter states reset	# Reset amulet states
 *
 * Enemy Note:
 *   <encount_sw:n>	# This enemy doesn't encount when switch #n is OFF
 *   <encount_!sw:n>	# This enemy doesn't encount when switch #n is ON
 *   <encount_lv:n>	# Level n or later member is required to encount this enemy
 *   <encount_!lv:n>	# Level n or later member can't encount this enemy
 *   <encount_%lv:n>	# Party's max level must be multiple of n to encount this enemy
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
 * @param amulet items
 * @desc 指定したアイテムを所持していたらエンカウントしない (0:OFF)
 * @default 0
 *
 * @param amulet weapons
 * @desc 指定した武器を装備or所持していたらエンカウントしない (0:OFF)
 * @default 0
 *
 * @param amulet armors
 * @desc 指定した防具を装備or所持していたらエンカウントしない (0:OFF)
 * @default 0
 *
 * @param amulet states
 * @desc 指定した状態のアクターが居たらエンカウントしない (0:OFF)
 * @default 0
 *
 * @help マップで敵グループとの遭遇をコントロールするプラグイン
 *
 * プラグインコマンド:
 *  RTK_TroopEncounter items 4,5,6	# エンカウントしないアイテムを 4,5,6 に置き換える
 *  RTK_TroopEncounter items reset	# エンカウントしないアイテムを初期値に戻す
 *  RTK_TroopEncounter weapons 4,5,6	# エンカウントしない武器を 4,5,6 に置き換える
 *  RTK_TroopEncounter weapons reset	# エンカウントしない武器を初期値に戻す
 *  RTK_TroopEncounter armors 4,5,6	# エンカウントしない防具を 4,5,6 に置き換える
 *  RTK_TroopEncounter armors reset	# エンカウントしない防具を初期値に戻す
 *  RTK_TroopEncounter states 4,5,6	# エンカウントしない状態を 4,5,6 に置き換える
 *  RTK_TroopEncounter states reset	# エンカウントしない状態を初期値に戻す
 *
 * 敵キャラのメモ:
 *   <encount_sw:n>	# 指定したn番スイッチがOFFならエンカウントしない
 *   <encount_!sw:n>	# 指定したn番スイッチがONならエンカウントしない
 *   <encount_lv:n>	# レベルn以上のメンバーが居ないとエンカウントしない
 *   <encount_!lv:n>	# レベルn以上のメンバーが居るとエンカウントしない
 *   <encount_%lv:n>	# パーティの最高レベルがnの倍数でないとエンカウントしない
 */

//-----------------------------------------------------------------------------


(function(_global) {
	var N = 'RTK_TroopEncounter';

	var param = PluginManager.parameters(N);
	var tag_base = param['tag base'] || "encount_";
	var all_switch = Number(param['encount switch']||"0");
	var amulet_items = param['amulet items']||"0"
	var amulet_weapons = param['amulet weapons']||"0"
	var amulet_armors = param['amulet armors']||"0"
	var amulet_states = param['amulet states']||"0"

	function convItems(_v) {
		return (_v||"0").split(",").map(function(o){ return Number(o)||0; }).filter(function (o, i, a){ return o>0 && a.indexOf(o)===i; });
	}
	var items = convItems(amulet_items);
	var weapons = convItems(amulet_weapons);
	var armors = convItems(amulet_armors);
	var states = convItems(amulet_states);

	function hasState(_id) {
		return $gameParty.aliveMembers().some(function(actor){
			return actor.isStateAffected(_id);
		});
	}

	var _Game_Player_meetsEncounterConditions = Game_Player.prototype.meetsEncounterConditions;
	Game_Player.prototype.meetsEncounterConditions = function(encounter) {
		var ret = _Game_Player_meetsEncounterConditions.call(this, encounter);
		if (ret) {
			if (all_switch > 0 && !$gameSwitches._data[all_switch]) {
				return false;
			}
			var a = $gameSystem[N + "_items"] || items;
			for (var l=0; l<a.length; l++) {
				if ($gameParty._items[a[l]]) { return false; }
			}
			a = $gameSystem[N + "_weapons"] || weapons;
			for (var l=0; l<a.length; l++) {
				if ($gameParty.hasItem($dataWeapons[a[l]], true)) { return false; }
			}
			a = $gameSystem[N + "_armors"] || armors;
			for (var l=0; l<a.length; l++) {
				if ($gameParty.hasItem($dataArmors[a[l]], true)) { return false; }
			}
			a = $gameSystem[N + "_states"] || states;
			for (var l=0; l<a.length; l++) {
				if (hasState(a[l])) { return false; }
			}
			var lv = $gameParty.highestLevel();
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
				sw = Number((enemy.meta||{})[tag_base + "lv"]||"0");
				if (sw > 0 && lv < sw) {
					return false;
				}
				sw = Number((enemy.meta||{})[tag_base + "!lv"]||"0");
				if (sw > 0 && lv >= sw) {
					return false;
				}
				sw = Number((enemy.meta||{})[tag_base + "%lv"]||"0");
				if (sw > 1 && lv % sw) {
					return false;
				}
			}
		}
		return ret;
	};

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command == N) {
			if (args[0] == "items") {
				if (args[1] == "reset" || args[1] == amulet_items) {
					delete $gameSystem[N + "_items"];
				} else {
					$gameSystem[N + "_items"] = convItems(args[1]);
				}
			} else if (args[0] == "weapons") {
				if (args[1] == "reset" || args[1] == amulet_weapons) {
					delete $gameSystem[N + "_weapons"];
				} else {
					$gameSystem[N + "_weapons"] = convItems(args[1]);
				}
			} else if (args[0] == "armors") {
				if (args[1] == "reset" || args[1] == amulet_armors) {
					delete $gameSystem[N + "_armors"];
				} else {
					$gameSystem[N + "_armors"] = convItems(args[1]);
				}
			} else if (args[0] == "states") {
				if (args[1] == "reset" || args[1] == amulet_states) {
					delete $gameSystem[N + "_states"];
				} else {
					$gameSystem[N + "_states"] = convItems(args[1]);
				}
			}
		}
	};

})(this);
