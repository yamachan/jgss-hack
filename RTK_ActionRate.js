//=============================================================================
// RTK_ActionRate.js  ver1.01 2016/08/07
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Set action's success rate by note tag
 * @author Toshio Yamashita (yamachan)
 *
 * @help This plugin does not provide plugin commands.
 *
 * NoteTags:
 *   <mrf value:n>	# Magic Reflection Rate: use n value
 *   <mrf rate:n>	# Magic Reflection Rate: multiple with n value
 *   <cnt value:n>	# Counter Attack Rate: use n value
 *   <cnt rate:n>	# Counter Attack Rate: multiple with n value
 *   <eva value:n>	# Physical/Magic Evasion Rate: use n value
 *   <eva rate:n>	# Physical/Magic Evasion Rate: multiple with n value
 *   <cri value:n>	# Critical Evasion Rate: use n value
 *   <cri rate:n>	# Critical Evasion Rate: multiple with n value
 *
 * If you add the prefix "v" to the number n, it means a value in the game variables.
 * e.g. <mrf value:v10> will replace the Magic Reflection Rate by the game variable #10.
 */

/*:ja
 * @plugindesc メモ欄のタグでアクションの成功レートを調整する
 * @author Toshio Yamashita (yamachan)
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * スキル・アイテムのメモ:
 *   <mrf value:n>	# アクション実行時に対象の魔法反射率をnにする
 *   <mrf rate:n>	# アクション実行時に対象の魔法反射率をn倍する
 *   <cnt value:n>	# アクション実行時に対象の物理反撃率をnにする
 *   <cnt rate:n>	# アクション実行時に対象の物理反撃率をn倍する
 *   <eva value:n>	# アクション実行時に対象の物理・魔法回避率をnにする
 *   <eva rate:n>	# アクション実行時に対象の物理・魔法回避率をn倍する
 *   <cri value:n>	# アクション実行時にクリティカル発生率をnにする
 *   <cri rate:n>	# アクション実行時にクリティカル発生率をn倍する
 *
 * 数値 n の前に "v" を付与すると、その番号が示すゲーム変数の値が代わりに利用される
 * 例) <mrf value:v10> は変数10番に入っている値が魔法反射率として使用される
 */

(function(_global) {
	var N = 'RTK_ActionRate';
	var param = PluginManager.parameters(N);

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
	function f(_key, _value, _this) {
		var meta = _this.item() && (_this.item().meta || {});
		if (meta[_key + " value"] !== undefined) {
			return conv(meta[_key + " value"], _value);
		}
		if (meta[_key + " rate"] !== undefined) {
			return _value * conv(meta[_key + " rate"], 1);
		}
		return _value;
	}

	var _Game_Action_itemMrf = Game_Action.prototype.itemMrf;
	Game_Action.prototype.itemMrf = function(target) {
		var ret = _Game_Action_itemMrf.call(this, target);
		return f("mrf", ret, this);
	};

	var _Game_Action_itemCnt = Game_Action.prototype.itemCnt;
	Game_Action.prototype.itemCnt = function(target) {
		var ret = _Game_Action_itemCnt.call(this, target);
		return f("cnt", ret, this);
	};

	var _Game_Action_itemEva = Game_Action.prototype.itemEva;
	Game_Action.prototype.itemEva = function(target) {
		var ret = _Game_Action_itemEva.call(this, target);
		return f("eva", ret, this);
	};

	var _Game_Action_itemCri = Game_Action.prototype.itemCri;
	Game_Action.prototype.itemCri = function(target) {
		var ret = _Game_Action_itemCri.call(this, target);
		return f("cri", ret, this);
	};
})(this);
