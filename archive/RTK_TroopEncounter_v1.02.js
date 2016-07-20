//=============================================================================
// RTK_TroopEncounter.js  ver1.02 2016/07/18
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
 * @param amulet states
 * @desc Player doesn't encount if an actor has these states (0:OFF)
 * @default 0
 *
 * @help Plugin to control to encount Troops in Map
 *
 * Plugin Command:
 *  RTK_TroopEncounter items 4,5,6	# Replace amulet items by 4,5,6
 *  RTK_TroopEncounter items reset	# Reset amulet items
 *  RTK_TroopEncounter states 4,5,6	# Replace amulet states by 4,5,6
 *  RTK_TroopEncounter states reset	# Reset amulet states
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
 * @param amulet items
 * @desc 指定したアイテムを所持していたらエンカウントしない (0:OFF)
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
 *  RTK_TroopEncounter states 4,5,6	# エンカウントしない状態を 4,5,6 に置き換える
 *  RTK_TroopEncounter states reset	# エンカウントしない状態を初期値に戻す
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
	var amulet_items = param['amulet items']||"0"
	var amulet_states = param['amulet states']||"0"

	function convItems(_v) {
		return (_v||"0").split(",").map(function(o){ return Number(o)||0; }).filter(function (o, i, a){ return o>0 && a.indexOf(o)===i; });
	}
	var items = convItems(amulet_items);
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
			var a = $gameSystem[N + "_states"] || states;
			for (var l=0; l<a.length; l++) {
				if (hasState(a[l])) { return false; }
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

/*
Game_Unit.prototype.aliveMembers = function() {
    return this.members().filter(function(member) {
        return member.isAlive();
    });
};
Game_Unit.prototype.tgrSum = function() {
    return this.aliveMembers().reduce(function(r, member) {
        return r + member.tgr;
    }, 0);
};
Game_Party.prototype.highestLevel = function() {
    return Math.max.apply(null, this.members().map(function(actor) {
        return actor.level;
    }));
};
Game_Party.prototype.partyAbility = function(abilityId) {
    return this.battleMembers().some(function(actor) {
        return actor.partyAbility(abilityId);
    });
};
Game_Battler.prototype.addState = function(stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

*/
