//=============================================================================
// RTK_ActionLimit.js  ver1.01 2016/08/18
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Set action's usable limit by note tag
 * @author Toshio Yamashita (yamachan)
 *
 * @param meta tag
 * @desc Meta tag name for Condition text in Note area
 * @default condition
 *
 * @help This plugin does not provide plugin commands.
 *
 * NoteTags:
 *   <condition switch:n>	# Can use this when #n switch is ON
 *   <condition actor:n,m,,>	# Actors (ID: n,m,,) can use this
 *   <condition class:n,m,,>	# Classes (ID: n,m,,) can use this
 *   <condition max:n>		# Can use #n times in a battle
 *
 * If you add the prefix "v" to the number n, it means a value in the game variables.
 * e.g. <condition switch:v10> Can use this when the switch selected by the game variable #10 is ON.
 * e.g. <condition actor:v10> An actor selected by the game variable #10 can use this.
 */

/*:ja
 * @plugindesc メモ欄のタグでアクションの実行回数などを制限する
 * @author Toshio Yamashita (yamachan)
 *
 * @param meta tag
 * @desc ノート欄で使用条件を指定するタグ名
 * @default condition
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * スキル・アイテムのメモ:
 *   <condition switch:n>	# n番スイッチがONのときだけ戦闘で利用できる
 *   <condition actor:n,m,,>	# n,m,,番のアクターだけが戦闘で利用できる
 *   <condition class:n,m,,>	# n,m,,番のクラスだけが戦闘で利用できる
 *   <condition max:n>		# 1度の戦闘でn回だけ利用できる
 *
 * 単独の数値 n の前に "v" を付与すると、その番号が示すゲーム変数の値が代わりに利用される
 * 例) <condition switch:v10> は変数10番に入っている値に対応するスイッチがONのときだけ利用できる
 * 例) <condition actor:v10> は変数10番に入っている値に対応するアクターだけが利用できる
 */

(function(_global) {
	var N = 'RTK_ActionLimit';
	var param = PluginManager.parameters(N);
	var tag = String(param['meta tag'] || "condition");
	var items = [];
	var skills = [];


	function conv(_s, _default) {
		if (_s.match(/^\s*[\d.]+\s*$/)) {
			return Number(_s);
		}
		var ret = _s.match(/^\s*v([\d.]+)\s*$/i);
		if (ret) {
			return $gameVariables.value(Number(ret[1]));
		}
		return _default;
	}
	function check(_s, _v) {
		if ("string" != typeof _v || _v == "") {
			return false;
		}
		_v = _v.toLowerCase();
		return String(_s||"").split(",").some(function(v){
			return v.toLowerCase() == _v;
		});
	}
	function count(_i, _t) {
		var ret = 0;
		if (BattleManager._phase == "input") {
			for (var l=0; l<BattleManager._actorIndex; l++) {
				var actor = $gameParty.members()[l];
				if (actor._actionState == "waiting") {
					actor._actions.forEach(function(a){
						if (a._item && a._item._dataClass == _t && a._item._itemId == _i) {
							ret++;
						}
					});
				}
			}
		}
		return ret;
	}

	var _Scene_Battle_create = Scene_Battle.prototype.create;
	Scene_Battle.prototype.create = function() {
		_Scene_Battle_create.call(this);
		items = [];
		skills = [];
	};

	var _Game_BattlerBase_isOccasionOk = Game_BattlerBase.prototype.isOccasionOk;
	Game_BattlerBase.prototype.isOccasionOk = function(item) {
		var ret = _Game_BattlerBase_isOccasionOk.call(this, item);

		if (ret && $gameParty.inBattle()) {
			var meta = item && (item.meta || {});
			if (meta[tag + " switch"]) {
				var v = conv(meta[tag + " switch"], 0);
				if (v > 0) {
					if (!$gameSwitches.value(v)) {
						return false;
					}
				}
			}
			if (meta[tag + " max"]) {
				var v = conv(meta[tag + " max"], 0);
				if (v > 0) {
					if (DataManager.isItem(item)) {
						items[item.id] = items[item.id] === undefined ? 0 : items[item.id];
						if (items[item.id] + count(item.id, "item") >= v) {
							return false;
						}
					} else if (DataManager.isSkill(item)) {
						skills[item.id] = skills[item.id] === undefined ? 0 : skills[item.id];
						if (skills[item.id] + count(item.id, "skill") >= v) {
							return false;
						}
					}
				}
			}
			if (BattleManager.actor()) {
				if (meta[tag + " actor"]) {
					var v = conv(meta[tag + " actor"], 0);
					if (v) {
						if (v != BattleManager.actor().actor().id) {
							return false;
						}
					} else {
						if(!check(meta[tag + " actor"], String(BattleManager.actor().actor().id))) {
							return false;
						}
					}
				}
				if (meta[tag + " class"]) {
					var v = conv(meta[tag + " class"], 0);
					if (v) {
						if (v != BattleManager.actor()._classId) {
							return false;
						}
					} else {
						if (check(meta[tag + " class"], String(BattleManager.actor()._classId))) {
							return false;
						}
					}
				}
			}
		}
		return ret;
	};

	var _Game_Party_consumeItem = Game_Party.prototype.consumeItem;
	Game_Party.prototype.consumeItem = function(item) {
		var ret = _Game_Party_consumeItem.call(this, item);
		if ($gameParty.inBattle()) {
			var meta = item && (item.meta || {});
			if (meta[tag + " max"]) {
				items[item.id] = items[item.id] === undefined ? 1 : items[item.id] + 1;
			}
		}
		return ret;
	};

	var _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
	Game_BattlerBase.prototype.paySkillCost = function(skill) {
		var ret = _Game_BattlerBase_paySkillCost.call(this, skill);
		if ($gameParty.inBattle()) {
			var meta = skill && (skill.meta || {});
			if (meta[tag + " max"]) {
				skills[skill.id] = skills[skill.id] === undefined ? 1 : skills[skill.id] + 1;
			}
		}
		return ret;
	};

})(this);
