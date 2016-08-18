//=============================================================================
// RTK_ActionLimit.js  ver1.00 2016/08/18
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
 *   <condition max:n>		# Can use #n times in a battle (Item only)
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
 *   <condition max:n>		# 1度の戦闘でn回だけ利用できる (アイテムのみ)
 *
 * 単独の数値 n の前に "v" を付与すると、その番号が示すゲーム変数の値が代わりに利用される
 * 例) <condition switch:v10> は変数10番に入っている値に対応するスイッチがONのときだけ利用できる
 * 例) <condition actor:v10> は変数10番に入っている値に対応するアクターだけが利用できる
 */

(function(_global) {
	var N = 'RTK_ActionLimit';
	var param = PluginManager.parameters(N);
	var tag = String(param['meta tag'] || "condition");

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

	var _Scene_Battle_create = Scene_Battle.prototype.create;
	Scene_Battle.prototype.create = function() {
		_Scene_Battle_create.call(this);
		$gameTemp[N + "_items"] = [];
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
						var tmp = $gameTemp[N + "_items"];
						if (tmp) {
							tmp[item.id] = tmp[item.id] === undefined ? 0 : tmp[item.id];
							if (tmp[item.id] >= v) {
								return false;
							}
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
						ret = ret && v == BattleManager.actor()._classId;
					} else {
						ret = ret && check(meta[tag + " class"], String(BattleManager.actor()._classId));
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
				var tmp = $gameTemp[N + "_items"];
				if (tmp) {
					tmp[item.id] = tmp[item.id] === undefined ? 1 : tmp[item.id] + 1;
				}
			}
		}
		return ret;
	};
})(this);
