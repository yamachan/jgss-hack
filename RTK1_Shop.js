//=============================================================================
// RTK1_Shop.js  ver1.14 2016/07/16
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Enhance normal shop function.
 * @author Toshio Yamashita (yamachan)
 *
 * @param buy rate
 * @desc Calcurate buy price with this rate
 * @default 1
 *
 * @param sell rate
 * @desc Calcurate sell price with this rate
 * @default 0.5
 *
 * @param difficulty buy rate
 * @desc Calcurate buy price with RTK1_Difficulty plugin
 * @default 0
 *
 * @param difficulty sell rate
 * @desc Calcurate sell price with RTK1_Difficulty plugin
 * @default 0
 *
 * @help
 * Plugin to enhance normal shop function.
 * This plugin requires RTK1_Core plugin (1.14 or later) previously.
 *
 * Plugin Command:
 *   RTK1_Shop open i2-5,w1-2
 *   RTK1_Shop open i2-5,w1-2 true
 *   RTK1_Shop open i2-5,w1-2 true shop%20name
 *
 *   RTK1_Shop clear
 *   RTK1_Shop add i1-8
 *   RTK1_Shop remove i2
 *   RTK1_Shop open
 *   RTK1_Shop open none false shop%20name
 *
 *   RTK1_Shop buy 2
 *   RTK1_Shop buy switch 9
 *   RTK1_Shop sell 0.6
 *   RTK1_Shop sell switch 10
 *
 * Manual:
 *   https://github.com/yamachan/jgss-hack/blob/master/RTK1_Shop.md
 */

/*:ja
 * @plugindesc 通常のショップ機能の拡張
 * @author Toshio Yamashita (yamachan)
 *
 * @param buy rate
 * @desc 商品の価格はこの数値を掛けたものに調整されます
 * @default 1
 *
 * @param sell rate
 * @desc 商品の売価はこの数値を掛けたものに調整されます
 * @default 0.5
 *
 * @param difficulty buy rate
 * @desc 商品の価格は難易度とこの数値を掛けたもので調整されます
 * @default 0
 *
 * @param difficulty sell rate
 * @desc 商品の売価は難易度とこの数値を掛けたもので調整されます
 * @default 0
 *
 * @help
 * RPGツクール MV 用に作成した、通常のショップ機能を拡張するプラグインです。
 * このプラグインの前に RTK1_Core プラグイン(1.14以降)を読み込んでください。
 *
 * プラグインコマンド:
 *   RTK1_Shop open i2-5,w1-2
 *   RTK1_Shop open i2-5,w1-2 true
 *   RTK1_Shop open i2-5,w1-2 true shop%20name
 *
 *   RTK1_Shop clear
 *   RTK1_Shop add i1-8
 *   RTK1_Shop remove i2
 *   RTK1_Shop open
 *   RTK1_Shop open none false shop%20name
 *
 *   RTK1_Shop buy 2
 *   RTK1_Shop buy switch 9
 *   RTK1_Shop sell 0.6
 *   RTK1_Shop sell switch 10
 *
 * マニュアル:
 *   https://github.com/yamachan/jgss-hack/blob/master/RTK1_Shop.ja.md
 */


(function(_global) {
	"use strict";
	if (!_global["RTK"]) {
		throw new Error('This plugin requires RTK1_Core plugin previously.');
	}
	if (RTK.VERSION_NO < 1.14) {
		throw new Error('This plugin requires version 1.14 or later of RTK1_Core plugin. the current version looks ' + RTK.VERSION_NO + ".");
	}

	var N = "RTK1_Shop";
	var NK = "RTK_SH";
	var M = RTK["SH"] = RTK._modules[N] = {};

	var param = PluginManager.parameters(N);
	M._d_buy = Number(param['difficulty buy rate'] || "0");
	M._d_sell = Number(param['difficulty sell rate'] || "0");

	M._config = M._config || {
		"buy": Number(param['buy rate'] || "1"),
		"sell" : Number(param['sell rate'] || "0.5"),
		"set" : {}
	};

	M.difficulty = function() {
		if (RTK.DF) {
			return RTK.DF.difficulty();
		}
		return 0;
	};

	RTK.onLoad(function(){
		M._config = RTK.load(NK + "_config") || M._config;
		RTK.log(N + " load (_config)", M._config);
	});
	RTK.onSave(function(){
		RTK.save(NK + "_config", M._config);
		RTK.log(N + " save (_config)", M._config);
	});

	M._list = [];
	function filter_new(o) {
		return o && !M._list.contains(o);
	};
	M.command = function(args) {
		if (args[0] == "open") {
			if (args.length > 1) {
				if (args[1] == "none") {
					
				} else {
					M.command(["clear"]);
					M.command(["add", args[1]]);
				}
			}
			var purchaseOnly = args.length > 2 && args[2] == "true";
			M._title = (args.length > 3 ? args[3] : "").replace(/%20/g, " ");
			SceneManager.push(Scene_Shop);
		        SceneManager.prepareNextScene(M._list, purchaseOnly);
		} else if (args[0] == "add" && args.length > 1) {
			RTK.id4list(RTK.ADD, M._list, args[1], true, M._config.set);
		} else if (args[0] == "remove" && args.length > 1) {
			RTK.id4list(RTK.REMOVE, M._list, args[1], true, M._config.set);
		} else if (args[0] == "clear") {
			var t = args[1] == "all" || !args[1] ? "item,weapon,armor" : args[1];
			M._list = M._list.filter(function(o){
				return (!t.contains("item") && DataManager.isItem(o)) || (!t.contains("weapon") && DataManager.isWeapon(o)) || (!t.contains("armor") && DataManager.isArmor(o));
			});
		} else if (args[0] == "complete") {
			var t = args[1] == "all" || !args[1] ? "item,weapon,armor" : args[1];
			if (t.contains("item")) { M._list = M._list.concat($dataItems.filter(filter_new)); }
			if (t.contains("weapon")) { M._list = M._list.concat($dataWeapons.filter(filter_new)); }
			if (t.contains("armor")) { M._list = M._list.concat($dataArmors.filter(filter_new)); }
		} else if (args[0] == "max_id" && args.length == 2) {
			var v = Number(args[1]||"0");
			if (v > 0) { M._list = M._list.filter(function(o){ return o && o.id && o.id <= v; }); }
		} else if (args[0] == "min_id" && args.length == 2) {
			var v = Number(args[1]||"0");
			if (v > 0) { M._list = M._list.filter(function(o){ return o && o.id && o.id >= v; }); }
		} else if (args[0] == "max_price" && args.length == 2) {
			var v = Number(args[1]||"0");
			if (v >= 0) { M._list = M._list.filter(function(o){ return o && (o.price||0) <= v; }); }
		} else if (args[0] == "min_price" && args.length == 2) {
			var v = Number(args[1]||"0");
			if (v >= 0) { M._list = M._list.filter(function(o){ return o && (o.price||0) >= v; }); }
		} else if (args[0] == "buy" || args[0] == "sell") {
			var rate = -1;
			if (args.length == 3 && (args[1] == "sw" || args[1] == "switch")) {
				var v = Number(args[2]) || 0;
				if (v == v && v > 0) {
					rate = $gameVariables._data[v];
				}
			} else if (args.length == 2) {
				rate = Number(args[1]);
			}
			if (rate !== undefined && rate == rate && rate >= 0) {
				if (args[0] == "buy") { M._config.buy = rate; } else { M._config.sell = rate; }
			}
		} else if (args[0] == "set" && args.length == 2) {
			var key = args[1].replace(/%20/g, " ");
			if (M._config.set[key] && M._list.length == 0) {
				delete M._config.set[key];
			} else {
				M._config.set[key] = RTK.objects2ids(M._list).join(",");
			}
		}
		RTK.log(N + " command (" + args.join(" ") + ")");
	};
	RTK.onCall(N, M.command.bind(this));

	var _Scene_Shop_sellingPrice = Scene_Shop.prototype.sellingPrice;
	Scene_Shop.prototype.sellingPrice = function() {
		var ret = _Scene_Shop_sellingPrice.call(this);
		return Math.floor(ret * 2 * M._config.sell * (1 - M._d_sell * M.difficulty()));
	};

	var _Scene_Shop_createHelpWindow = Scene_Shop.prototype.createHelpWindow;
	Scene_Shop.prototype.createHelpWindow = function() {
		_Scene_Shop_createHelpWindow.call(this);
		M._title_win = M._title||"";
		M._title = "";
		this._helpWindow.clear = function(){
			this.setText(M._title_win);
		};
	};

	var _Window_ShopBuy_makeItemList = Window_ShopBuy.prototype.makeItemList;
	Window_ShopBuy.prototype.makeItemList = function() {
		if (this._shopGoods == M._list) {
			this._data = M._list.filter(function(o){ return o.price > 0; });
			this._price = this._data.map(function(o){ return Math.floor(o.price * M._config.buy * (1 + M._d_buy * M.difficulty())); });
		} else {
			_Window_ShopBuy_makeItemList.call(this);
			this._price = this._price.map(function(p){
				return Math.floor(p * M._config.buy * (1 + M._d_buy * M.difficulty()));
			});
		}
	};

})(this);
