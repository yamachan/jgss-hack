//=============================================================================
// RTK1_Composite.js  ver1.17 2017/03/16
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Fusion items/wepons/armors.
 * @author Toshio Yamashita (yamachan)
 *
 * @param meta tag
 * @desc Meta tag name for Composition text in Note area
 * @default composite
 *
 * @param plugin command
 * @desc Base name of this plugin command
 * @default RTK1_Composite
 *
 * @param in menu
 * @desc Add Composite in menu (0:OFF 1:ON)
 * @default 0
 *
 * @param list sort
 * @desc Sort list of recipe (0:OFF 1:Name 2:ID 4:Type 8:SubType)
 * @default 0
 *
 * @param auto learn
 * @desc Learn a recipe automatically with composition in shop (0:OFF 1:ON)
 * @default 0
 *
 * @param success adjust menu
 * @desc Adjust success rate from menu (0-1)
 * @default 1
 *
 * @param charge adjust menu
 * @desc Adjust success charge from menu (0-1)
 * @default 1
 *
 * @param success adjust workroom
 * @desc Adjust success rate in workroom (0-1)
 * @default 1
 *
 * @param charge adjust workroom
 * @desc Adjust success charge in workroom (0-1)
 * @default 0
 *
 * @param success adjust shop
 * @desc Adjust success rate in shop (0-1)
 * @default 1
 *
 * @param charge adjust shop
 * @desc Adjust success charge in shop (0-1)
 * @default 1
 *
 * @help
 * Plugin to add the composite function for RPG Maker MV.
 * This plugin requires RTK1_Core plugin (1.11 or later) previously.
 *
 * NoteTags:
 *   <composite:0.95,i1,3,w2,1,a3,1,i4,500>
 *	0.95 means the success rate is 95%
 *	i1,3 means it require three item #1 (key material)
 *	w2,1 means it require one weapon #2 (material 2)
 *	a3,1 means it require one armor #3 (material 3)
 *	... (you can set more 2 materials)
 *	i4   means If you fail, you will get item #4
 *	500  means cost of this composition
 *
 * Plugin Command:
 *   RTK1_Composite learn item/weapon/armor #no[,#no]
 *   RTK1_Composite learn #uid[,#uid]
 *   RTK1_Composite forget item/weapon/armor #no[,#no]
 *   RTK1_Composite forget #uid [,#uid]
 *   RTK1_Composite sort #value
 *   RTK1_Composite open
 *
 *   RTK1_Composite add item/weapon/armor #no[,#no]
 *   RTK1_Composite add #uid[,#uid]
 *   RTK1_Composite remove item/weapon/armor #no[,#no]
 *   RTK1_Composite remove #uid[,#uid]
 *   RTK1_Composite fill [all/item/weapon/armor]
 *   RTK1_Composite complete [all/item/weapon/armor]
 *   RTK1_Composite clear [all/item/weapon/armor]
 *   RTK1_Composite shop [all/item/weapon/armor] [,en name] [,ja name]
 *   RTK1_Composite workroom [all/item/weapon/armor] [,en name] [,ja name]
 *
 *   RTK1_Composite menu on/off/toggle
 *   RTK1_Composite adjust menu/workroom/shop success/charge #value
 *
 * Manual:
 *   https://github.com/yamachan/jgss-hack/blob/master/RTK1_Composite.md
 */

/*:ja
 * @plugindesc アイテム・武器・防具の合成
 * @author Toshio Yamashita (yamachan)
 *
 * @param meta tag
 * @desc ノート欄で合成レシピを指定するタグ名
 * @default composite
 *
 * @param plugin command
 * @desc プラグインコマンドの名称
 * @default RTK1_Composite
 *
 * @param in menu
 * @desc ゲームメニューに「合成」を表示する (0:OFF 1:ON)
 * @default 0
 *
 * @param list sort
 * @desc 合成レシピの並びをソートする (0:OFF 1:名前 2:ID 4:種別 8:タイプ)
 * @default 0
 *
 * @param auto learn
 * @desc ショップで合成したレシピを自動で覚える (0:OFF 1:ON)
 * @default 0
 *
 * @param success adjust menu
 * @desc メニューからの合成における成功率を調整する(0～1)
 * @default 1
 *
 * @param charge adjust menu
 * @desc メニューからの合成における費用を調整する(0～1)
 * @default 1
 *
 * @param success adjust workroom
 * @desc 作業場での合成における成功率を調整する(0～1)
 * @default 1
 *
 * @param charge adjust workroom
 * @desc 作業場での合成における費用を調整する(0～1)
 * @default 0
 *
 * @param success adjust shop
 * @desc ショップでの合成における成功率を調整する(0～1)
 * @default 1
 *
 * @param charge adjust shop
 * @desc ショップでの合成における費用を調整する(0～1)
 * @default 1
 *
 * @help
 * RPGツクール MV 用に作成した、合成機能を実現するプラグインです。
 * このプラグインの前に RTK1_Core プラグイン(1.11以降)を読み込んでください。
 *
 * メモ欄:
 *   <composite:0.95,i1,3,w2,1,a3,1,i4,500>
 *	0.95 means the success rate is 95%
 *	i1,3 means it require three item #1 (key material)
 *	w2,1 means it require one weapon #2 (material 2)
 *	a3,1 means it require one armor #3 (material 3)
 *	... (you can set more 2 materials)
 *	i4   means If you fail, you will get item #4
 *	500  means cost of this composition
 *
 * プラグインコマンド:
 *   RTK1_Composite learn item/weapon/armor #no[,#no]
 *   RTK1_Composite learn #uid[,#uid]
 *   RTK1_Composite forget item/weapon/armor #no[,#no]
 *   RTK1_Composite forget #uid [,#uid]
 *   RTK1_Composite sort #value
 *   RTK1_Composite open
 *
 *   RTK1_Composite add item/weapon/armor #no[,#no]
 *   RTK1_Composite add #uid[,#uid]
 *   RTK1_Composite remove item/weapon/armor #no[,#no]
 *   RTK1_Composite remove #uid[,#uid]
 *   RTK1_Composite fill [all/item/weapon/armor]
 *   RTK1_Composite complete [all/item/weapon/armor]
 *   RTK1_Composite clear [all/item/weapon/armor]
 *   RTK1_Composite shop [all/item/weapon/armor] [,en name] [,ja name]
 *   RTK1_Composite workroom [all/item/weapon/armor] [,en name] [,ja name]
 *
 *   RTK1_Composite menu on/off/toggle
 *   RTK1_Composite adjust menu/workroom/shop success/charge #value
 *
 * マニュアル:
 *   https://github.com/yamachan/jgss-hack/blob/master/RTK1_Composite.ja.md
 */

function Scene_CompositeMenu() { this.initialize.apply(this, arguments); }
function Window_CompositeIndex() { this.initialize.apply(this, arguments); }
function Window_CompositeStatus() { this.initialize.apply(this, arguments); }
function Window_RTK_SingleCommand() { this.initialize.apply(this, arguments); }

(function(_global) {
	"use strict";
	if (!_global["RTK"]) {
		throw new Error('This plugin requires RTK1_Core plugin previously.');
	}
	if (RTK.VERSION_NO < 1.11) {
		throw new Error('This plugin requires version 1.11 or later of RTK1_Core plugin. the current version looks ' + RTK.VERSION_NO + ".");
	}

	var N = "RTK1_Composite";
	var NK = "RTK_CP";
	var M = RTK["CP"] = RTK._modules[N] = {};

	var param = PluginManager.parameters(N);
	M._tag = String(param['meta tag'] || "composite");
	M._command = String(param['plugin command'] || "RTK1_Composite");
	M._sort = Number(param['list sort'] || "0");
	M._auto = Number(param['auto learn'] || "0");

	M._config = M._config || {
		"menu": !!Number(param['in menu'] || "0"),
		"suM" : Number(param['success adjust menu'] || "1"),
		"chM" : Number(param['charge adjust menu'] || "1"),
		"suW" : Number(param['success adjust workroom'] || "1"),
		"chW" : Number(param['charge adjust workroom'] || "0"),
		"suS" : Number(param['success adjust shop'] || "1"),
		"chS" : Number(param['charge adjust shop'] || "1"),
		"set" : {}
	};

	M._list = M._list || [];
	M._learn = M._learn || [];
	M.recipe = function(_id) {
		return M._learn.contains(_id);
	};

	RTK.onReady(function(){
		RTK.text("Composite", "合成");
		RTK.text("Material", "材料");
		RTK.text("Charge", "費用");
		RTK.text("Success", "成功率");
		RTK.text("Execute", "実行");
		RTK.text("Quantity", "所持数");
		RTK.text("Composite Shop", "合成の店");
		RTK.text("Item Composite Shop", "アイテム合成の店");
		RTK.text("Weapon Composite Shop", "武器合成の店");
		RTK.text("Armor Composite Shop", "防具合成の店");
		RTK.text("Custom Composite Shop", "特別な合成の店");
		RTK.text("Get", "入手");
		RTK.text("Composite Workroom", "合成の作業場");
		RTK.text("Item Composite Workroom", "アイテム合成の作業場");
		RTK.text("Weapon Composite Workroom", "武器合成の作業場");
		RTK.text("Armor Composite Workroom", "防具合成の作業場");
		RTK.text("Custom Composite Workroom", "特別な合成の作業場");
		RTK.log(N + " ready", M._config);
	});
	RTK.onLoad(function(){
		M._config = RTK.load(NK + "_config") || M._config;
		M._learn = RTK.load(NK + "_learn") || M._learn;
		var v = RTK.load(NK + "_sort");
		M._sort = v === undefined ? M._sort : v;
		RTK.log(N + " load (_learn)", M._learn);
		RTK.log(N + " load (_config)", M._config);
	});
	RTK.onSave(function(){
		RTK.save(NK + "_config", M._config);
		RTK.save(NK + "_learn", M._learn);
		RTK.save(NK + "_sort", M._sort);
		RTK.log(N + " save (_learn)", M._learn);
		RTK.log(N + " save (_config)", M._config);
	});

	function filter_meta(o) {
		return o && o.meta && o.meta[M._tag];
	};
	M.id4list = function(_mode, _targetList, args, _isObject) {
		var ret = 0;
		if (args.length == 2) {
			ret = RTK.id4list(_mode, _targetList, args[1], _isObject);
		} else if (args.length == 3) {
			var a = args[1].match(/^\s*([aiw])\w+\s*$/);
			if (a) {
				var list = args[2].split(",").map(function(o){ return a[1] + String(o); });
				ret = RTK.id4list(_mode, _targetList, list, _isObject);
			}
		}
		if (_isObject && _targetList == M._list && ret > 0) {
			M._list = M._list.filter(filter_meta);
		}
	};
	M.command = function(args) {
		if (args[0] == "learn") {
			M.id4list(RTK.ADD, M._learn, args);
		} else if (args[0] == "forget") {
			M.id4list(RTK.REMOVE, M._learn, args);
		} else if (args[0] == "reset") {
			M._learn = [];
		} else if (args[0] == "fill") {
			var t = args[1] == "all" || !args[1] ? "item,weapon,armor" : args[1];
			var a = M._learn.filter(function(o){
				return (t.contains("item") && o.startsWith("i")) || (t.contains("weapon") && o.startsWith("w")) || (t.contains("armor") && o.startsWith("a"));
			});
			M._list = RTK.ids2objects(a).filter(filter_meta);
		} else if (args[0] == "add") {
			M.id4list(RTK.ADD, M._list, args, true);
		} else if (args[0] == "remove") {
			M.id4list(RTK.REMOVE, M._list, args, true);
		} else if (args[0] == "complete") {
			M._list = [];
			var t = args[1] == "all" || !args[1] ? "item,weapon,armor" : args[1];
			if (t.contains("item")) { M._list = M._list.concat($dataItems.filter(filter_meta)); }
			if (t.contains("weapon")) { M._list = M._list.concat($dataWeapons.filter(filter_meta)); }
			if (t.contains("armor")) { M._list = M._list.concat($dataArmors.filter(filter_meta)); }
		} else if (args[0] == "clear") {
			var t = args[1] == "all" || !args[1] ? "item,weapon,armor" : args[1];
			M._list = M._list.filter(function(o){
				return (!t.contains("item") && DataManager.isItem(o)) || (!t.contains("weapon") && DataManager.isWeapon(o)) || (!t.contains("armor") && DataManager.isArmor(o));
			});
		} else if (args[0] == "shop") {
			if (args[1] != "custom") {
				M.command(["complete", args[1]]);
			}
			if (args[2]) {
				M._Title = args[3] ? (RTK.jp() ? args[3] : args[2]) : args[2];
				M._Title = M._Title.replace("%20", " ");
			} else {
				M._Title = RTK.text((args[1] == "all" || !args[1] ? "" : RTK.ucfirst(args[1], " ")) + "Composite Shop");
			}
			M._mode = 0;
			SceneManager.push(Scene_CompositeMenu);
		} else if (args[0] == "workroom") {
			if (args[1] != "custom") {
				M.command(["complete", args[1]]);
			}
			if (args[2]) {
				M._Title = args[3] ? (RTK.jp() ? args[3] : args[2]) : args[2];
				M._Title = M._Title.replace("%20", " ");
			} else {
				M._Title = RTK.text((args[1] == "all" || !args[1] ? "" : RTK.ucfirst(args[1], " ")) + "Composite Workroom");
			}
			M._mode = 2;
			SceneManager.push(Scene_CompositeMenu);
		} else if (args[0] == "open") {
			M.command(["clear"]);
			M.command(["fill"]);
			if (args[1]) {
				M._Title = args[2] ? (RTK.jp() ? args[2] : args[1]) : args[1];
				M._Title = M._Title.replace("%20", " ");
			} else {
				M._Title = RTK.text("Composite");
			}
			M._mode = 1;
			SceneManager.push(Scene_CompositeMenu);
		} else if (args[0] == "menu") {
			M._config.menu = args[1] == "on" ? true : args[1] == "off" ? false : args[1] == "toggle" ? !M._config.menu : M._config.menu;
		} else if (args[0] == "adjust" && args.length == 4) {
			if (args[1] == "menu") {
				if (args[2] == "success") {
					M._config.suM = Number(args[3]);
				} else if (args[2] == "charge") {
					M._config.chM = Number(args[3]);
				}
			} else if (args[1] == "workroom") {
				if (args[2] == "success") {
					M._config.suW = Number(args[3]);
				} else if (args[2] == "charge") {
					M._config.chW = Number(args[3]);
				}
			} else if (args[1] == "shop") {
				if (args[2] == "success") {
					M._config.suS = Number(args[3]);
				} else if (args[2] == "charge") {
					M._config.chS = Number(args[3]);
				}
			}
		} else if (args[0] == "sort") {
			if (args.length == 2) {
				M._sort = Number(args[1])||0;
			}
		} else {
			throw new Error('Unknown plugin command: ' + args[0]);
		}
		RTK.log(N + " command (" + args.join(" ") + ")");
	};
	RTK.onCall(M._command, M.command.bind(this));

	// ----- Menu control -----

	var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		_Window_MenuCommand_addOriginalCommands.call(this)
		if(M._config.menu){
			this.addCommand(RTK.text("Composite"), 'RTK_CompositeCommand', true);
		};
	};
	var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		_Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('RTK_CompositeCommand', this.RTK_CompositeMenu.bind(this));
	};
	Scene_Menu.prototype.RTK_CompositeMenu = function() {
		M.command(["open"]);
	};

	// ----- Scene_CompositeMenu -----

	function _chargeable() {
		return M._mode == 1 ? M._config.chM > 0 : M._mode == 2 ? M._config.chW > 0 : M._mode == 0 ? M._config.chS > 0 : true;
	}
	function _convert(_i) {
		if (filter_meta(_i)) {
			var values = _i.meta[M._tag].split(",");
			if (values.length > 4) {
				var ret = {"f":true};
				ret.rate = Number(values[0]);
				ret.rate *= M._mode == 1 ? M._config.suM : M._mode == 2 ? M._config.suW : M._mode == 0 ? M._config.suS : 1;
				ret.rate = Math.max(ret.rate, 0);
				ret.rate = Math.min(ret.rate, 1);
				for (var l=2; l<values.length - 2; l+=2) {
					var n = Number(values[l]);
					var k = "v" + String(l / 2);
					ret[k] = [values[l - 1], n, RTK.hasId(values[l - 1])];
					ret.f = ret.f && ret[k][2] >= ret[k][1];
				}
				ret.fail = values[values.length - 2]||"0";
				ret.charge = Number(values[values.length - 1]||"0");
				ret.charge *= M._mode == 1 ? M._config.chM : M._mode == 2 ? M._config.chW : M._mode == 0 ? M._config.chS : 1;
				ret.charge = Math.max(ret.charge, 0);
				ret.f = ret.f && $gameParty.gold() >= ret.charge;
				return ret;
			}
		}
		return {"f":false};
	}
	function _composite(_i) {
		var nk = _i[NK];
		$gameParty.gainGold(- nk.charge);
		for (var l=1; l<6; l++) {
			var v = nk["v" + l];
			if (v) {
				$gameParty.gainItem(RTK.id2object(v[0]), - v[1]);
			}
		}
		if(Math.random() < nk.rate){
			SoundManager.playShop();
			var meta = _i.meta || {};
			if (meta[M._tag + " auto"] || (M._auto && !meta[M._tag + " !auto"])) {
				var id = RTK.object2id(_i);
				if (!M._learn.contains(id)) {
					M.command(["learn", id]);
				}
			}
		} else {
			SoundManager.playMiss();
			if (nk.fail == "0") {
				return null;
			} else {
				_i = RTK.id2object(nk.fail);
			}
		}
		$gameParty.gainItem(_i, 1);
		return _i;
	}

	Scene_CompositeMenu.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_CompositeMenu.prototype.constructor = Scene_CompositeMenu;
	Scene_CompositeMenu.prototype.initialize = function() { Scene_MenuBase.prototype.initialize.call(this); };

	Scene_CompositeMenu.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);

		var gw = 0;
		if (_chargeable()) {
			this._goldWindow = new Window_Gold();
			this._goldWindow.move(Graphics.boxWidth - this._goldWindow.width, 0, this._goldWindow.width, this._goldWindow.height);
			gw = this._goldWindow.width;
			this.addWindow(this._goldWindow);
		}

		this._helpWindow = new Window_Help(1);
		this._helpWindow.move(0, 0, Graphics.boxWidth - gw, this._helpWindow.height);
		this._helpWindow.setText(M._Title || RTK.text("Composite"));
		this.addWindow(this._helpWindow);

		this._indexWindow = new Window_CompositeIndex(0, this._helpWindow.height);
		this._indexWindow.setHandler('ok', function(){
			if (this._exeWindow.getState()) {
				Window_CompositeIndex.lastTopRow = this._indexWindow.topRow();
				Window_CompositeIndex.lastIndex = this._indexWindow.index();
				Window_CompositeIndex.maxItems = this._indexWindow.maxItems();
				this._indexWindow.deselect();
				this._indexWindow.deactivate();
				this._exeWindow.activate();
				this._exeWindow.select(0);
			} else {
				this._indexWindow.activate();
			}
		}.bind(this));
		this._indexWindow.setHandler('cancel', this.popScene.bind(this));

		var wy = this._helpWindow.height + this._indexWindow.height;
		var ww = Graphics.boxWidth;
		var wh = Graphics.boxHeight - wy;
		this._statusWindow = new Window_CompositeStatus(0, wy, ww, wh);

		this._exeWindow = new Window_RTK_SingleCommand(0, 0, 1, [RTK.text("Execute")]);
		this._exeWindow.move(Graphics.boxWidth - 145 - this._exeWindow.textPadding(), Graphics.boxHeight - this._exeWindow.height - this._exeWindow.textPadding(), 145, this._exeWindow.height);
		this._exeWindow._funcOkSound = function(){};
		this._exeWindow.setHandler('cancel', function(){
			this._exeWindow.deselect();
			this._exeWindow.deactivate();
			this._indexWindow.activate();
			this._indexWindow.select(Window_CompositeIndex.lastIndex);
		}.bind(this));
		this._exeWindow.setHandler('ok', function(){
			this._exeWindow.deselect();
			this._exeWindow.deactivate();
			var i = _composite(this._statusWindow._item);
			var it = i ? ("  \\I[" + i.iconIndex + "]" + i.name) : "";
			this._resultWindow._items = ["\\C[16]" + RTK.text("Get") + ":", "", it ,""];
			this._resultWindow.show();
			this._resultWindow.activate();
			this._resultWindow.select(1);
			this._resultWindow.setState(true);
		}.bind(this));
		this._statusWindow._exeWindow = this._exeWindow;

		this.addWindow(this._indexWindow);
		this.addWindow(this._statusWindow);
		this.addWindow(this._exeWindow);
		this._indexWindow.setStatusWindow(this._statusWindow);

		this._resultWindow = new Window_RTK_SingleCommand(0, 0, 4, ["","","DONE",""]);
		this._resultWindow.move(Graphics.boxWidth / 4, Graphics.boxHeight * 0.42, Graphics.boxWidth / 2, this._resultWindow.height);
		this._resultWindow.hide();
		this._resultWindow._hideCursor = true;
		this._resultWindow.setHandler('ok', function(){
			SceneManager.goto(Scene_CompositeMenu);
		});
		this._resultWindow.setHandler('cancel', function(){
			SceneManager.goto(Scene_CompositeMenu);
		});
		this.addWindow(this._resultWindow);
	};

	// ----- Window_CompositeIndex -----

	Window_CompositeIndex.prototype = Object.create(Window_Selectable.prototype);
	Window_CompositeIndex.prototype.constructor = Window_CompositeIndex;
	Window_CompositeIndex.lastTopRow = 0;
	Window_CompositeIndex.lastIndex = 0;
	Window_CompositeIndex.maxItems = 0;

	Window_CompositeIndex.prototype.initialize = function(x, y, cols, rows) {
		Window_Selectable.prototype.initialize.call(this, x||0, y||0, Graphics.boxWidth, this.fittingHeight(rows||6));
		this._maxCols = cols||3;
		M._list = M._list.filter(RTK.isTrue);
		if (M._sort > 0) {
			M._list.sort(function(a, b){
				if (a == null) { return 1 }
				if (b == null) { return 0 }
				if (M._sort & 4) {
					var an = RTK.objectType(a).replace("a","z");
					var bn = RTK.objectType(b).replace("a","z");
					if (an != bn) {
						return an > bn ? 1 : -1;
					} else if (M._sort & 8) {
						if (an == "i" && a.itypeId != b.itypeId) {
							return a.itypeId < b.itypeId ? 1 : -1;
						}
						if (an == "w" && a.wtypeId != b.wtypeId) {
							return a.wtypeId > b.wtypeId ? 1 : -1;
						}
						if (an == "z" && a.atypeId != b.atypeId) {
							return a.atypeId > b.atypeId ? 1 : -1;
						}
					}
				}
				if (M._sort & 1) {
					var sn = RTK.sortName(a, b);
					if (sn != 0) {
						return sn;
					}
				}
				if (M._sort & 2) {
					return a.id == b.id ? 0 : (a.id > b.id ? 1 : -1);
				}
				return 0;
			});
		}
		this.refresh();
		if (Window_CompositeIndex.maxItems == this.maxItems()) {
			this.setTopRow(Window_CompositeIndex.lastTopRow);
			this.select(Window_CompositeIndex.lastIndex);
		} else {
			this.setTopRow(0);
			this.select(0);
		}
		this.activate();
	};
	Window_CompositeIndex.prototype.maxCols = function() {
		return this._maxCols||3;
	};
	Window_CompositeIndex.prototype.maxItems = function() {
		return M._list ? M._list.length : 0;
	};
	Window_CompositeIndex.prototype.setStatusWindow = function(statusWindow) {
		this._statusWindow = statusWindow;
		this.updateStatus();
	};
	Window_CompositeIndex.prototype.update = function() {
		Window_Selectable.prototype.update.call(this);
		this.updateStatus();
	};
	Window_CompositeIndex.prototype.updateStatus = function() {
		var item = M._list[this.index()];
		this._currentEnabled = filter_meta(item) && item[NK] && item[NK].f;
		if (this._statusWindow) {
			this._statusWindow.setItem(item);
		}
	};
	Window_CompositeIndex.prototype.refresh = function() {
		this.createContents();
		this.drawAllItems();
	};
	Window_CompositeIndex.prototype.drawItem = function(index) {
		var item = M._list[index];
		var rect = this.itemRect(index);
		var width = rect.width - this.textPadding();

		item[NK] = _convert(item);
		if (item[NK].f) {
			this.drawItemName(item, rect.x, rect.y, width);
		} else {
			this.changePaintOpacity(false);
			this.drawItemName(item, rect.x, rect.y, width);
			this.changePaintOpacity(true);
		}
	};
	Window_CompositeIndex.prototype.processCancel = function() {
		Window_Selectable.prototype.processCancel.call(this);
		Window_CompositeIndex.lastTopRow = this.topRow();
		Window_CompositeIndex.lastIndex = this.index();
		Window_CompositeIndex.maxItems = this.maxItems();
	};
	Window_CompositeIndex.prototype.isCurrentItemEnabled = function() {
	    return this._currentEnabled;
	};

	// ----- Window_CompositeStatus -----

	Window_CompositeStatus.prototype = Object.create(Window_Base.prototype);
	Window_CompositeStatus.prototype.constructor = Window_CompositeStatus;

	Window_CompositeStatus.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, width, height);
	};
	Window_CompositeStatus.prototype.setItem = function(item) {
		if (item && this._item !== item) {
			this._item = item;
			this.refresh();
		}
	};
	Window_CompositeStatus.prototype.refresh = function() {
		var item = this._item;
		var x = this.textPadding() + Graphics.boxWidth / 3;
		var y = this.textPadding();
		var lineHeight = this.lineHeight();
		this.contents.clear();

		if (!item[NK].f) {this.changePaintOpacity(false);}
	        this.drawItemName(item, 0, y);
		this.changePaintOpacity(true);

		if (item[NK]) {
			this.changeTextColor(this.systemColor());
			this.drawText(RTK.text("Material") + ":", x * 1.1, y, 120);
			this.resetTextColor();
			y += lineHeight;

			if (item[NK].v1[2] < item[NK].v1[1]) {this.changePaintOpacity(false);}
		        this.drawItemName(RTK.id2object(item[NK].v1[0]), x, y);
			this.drawText(item[NK].v1[2] + "/" + item[NK].v1[1], x * 2, y, 60, 'right');
			y += lineHeight;
			this.changePaintOpacity(true);

			if (_chargeable()) {
				if ($gameParty.gold() < item[NK].charge) {this.changePaintOpacity(false);}
				this.changeTextColor(this.systemColor());
				this.drawText(RTK.text("Charge") + ":", this.textPadding(), y, 120);
				this.resetTextColor();
				this.drawText(item[NK].charge > 0 ? item[NK].charge : "-", this.textPadding() + 50, y, 120, 'right');
				this.changePaintOpacity(true);
			}

			if (item[NK].v2) {
				if (item[NK].v2[2] < item[NK].v2[1]) {this.changePaintOpacity(false);}
			        this.drawItemName(RTK.id2object(item[NK].v2[0]), x, y);
				this.drawText(item[NK].v2[2] + "/" + item[NK].v2[1], x * 2, y, 60, 'right');
				this.changePaintOpacity(true);
			}
			y += lineHeight;

			this.changeTextColor(this.systemColor());
			this.drawText(RTK.text("Success") + ":", this.textPadding(), y, 120);
			this.resetTextColor();
			this.drawText(Math.floor(item[NK].rate * 100) + "%", this.textPadding() + 50, y, 120, 'right');

			if (item[NK].v3) {
				if (item[NK].v3[2] < item[NK].v3[1]) {this.changePaintOpacity(false);}
			        this.drawItemName(RTK.id2object(item[NK].v3[0]), x, y);
				this.drawText(item[NK].v3[2] + "/" + item[NK].v3[1], x * 2, y, 60, 'right');
				this.changePaintOpacity(true);
			}
			y += lineHeight;

			this.changeTextColor(this.systemColor());
			this.drawText(RTK.text("Quantity") + ":", this.textPadding(), y, 120);
			this.resetTextColor();
			this.drawText(RTK.hasId(RTK.object2id(item)), this.textPadding() + 50, y, 120, 'right');

			if (item[NK].v4) {
				if (item[NK].v4[2] < item[NK].v4[1]) {this.changePaintOpacity(false);}
			        this.drawItemName(RTK.id2object(item[NK].v4[0]), x, y);
				this.drawText(item[NK].v4[2] + "/" + item[NK].v4[1], x * 2, y, 60, 'right');
				this.changePaintOpacity(true);
			}
			y += lineHeight;

			if (item[NK].v5) {
				if (item[NK].v5[2] < item[NK].v5[1]) {this.changePaintOpacity(false);}
			        this.drawItemName(RTK.id2object(item[NK].v5[0]), x, y);
				this.drawText(item[NK].v5[2] + "/" + item[NK].v5[1], x * 2, y, 60, 'right');
				this.changePaintOpacity(true);
			}

			y = this.textPadding() * 2 + lineHeight * 6;
			if (!item[NK].f) {this.changePaintOpacity(false);}
			this.drawTextEx(item.description, 0, y);
			this.changePaintOpacity(true);
		}
		this._exeWindow.setState(item[NK] && item[NK].f);
	};

	// ----- Window_RTK_SingleCommand -----

	Window_RTK_SingleCommand.prototype = Object.create(Window_Selectable.prototype);
	Window_RTK_SingleCommand.prototype.constructor = Window_RTK_SingleCommand;

	Window_RTK_SingleCommand.prototype.initialize = function(x, y, line, items) {
		this._line = line || 1;
		this._items = items || ["OK"];
		Window_Selectable.prototype.initialize.call(this, x||0, y||0, Graphics.boxWidth, this.fittingHeight(line));
		this.refresh();
		this.setTopRow(0);
		this.select(0);
		this.deselect();
		this.deactivate();
	};
	Window_RTK_SingleCommand.prototype.maxCols = function() { return 1; };
	Window_RTK_SingleCommand.prototype.maxItems = function() { return this._line; };
	Window_RTK_SingleCommand.prototype.refresh = function() {
		this.createContents();
		this.drawAllItems();
	};
	Window_RTK_SingleCommand.prototype.drawItem = function(index) {
		var rect = this.itemRect(index);
		var width = rect.width - this.textPadding();
		if (this._displayState) {
			this.drawTextEx(this._items[index], rect.x, rect.y, width);
		} else {
			this.changePaintOpacity(false);
			this.drawTextEx(this._items[index], rect.x, rect.y, width);
			this.changePaintOpacity(true);
		}
	};
	Window_RTK_SingleCommand.prototype.setState = function(_f) {
		this._displayState = _f;
		this.refresh();
	};
	Window_RTK_SingleCommand.prototype.getState = function() {
		return this._displayState;
	};
	Window_RTK_SingleCommand.prototype.updateCursor = function() {
		if (this._hideCursor) {
	        	this.setCursorRect(0, 0, 0, 0);
		} else {
			Window_Selectable.prototype.updateCursor.call(this);
		}
	};
	Window_RTK_SingleCommand.prototype.playOkSound = function() {
		if (this._funcOkSound) {
			this._funcOkSound();
		} else {
			Window_Selectable.prototype.playOkSound.call(this);
		}
	};

})(this);
