//=============================================================================
// RTK1_Core.js  ver1.15 2016/07/17
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Core functions of RTK1 library for RPG Maker MV.
 * @author Toshio Yamashita (yamachan)
 *
 * @param language
 * @desc Set your RPG Maker MV's language.
 * (0:Auto detect 1:English 2:Japanese)
 * @default 0
 *
 * @param debug
 * @desc Debug mode (0:OFF 1:ON)
 * @default 0
 *
 * @param json
 * @desc Also save uncompressed JSON file (0:OFF 1:ON)
 * @default 0
 *
 * @param tagname for sort
 * @desc Altername name for sort (mainly for Japanese Yomigana)
 * @default ja_sortname
 *
 * @help This plugin does not provide plugin commands.
 * 
 * https://github.com/yamachan/jgss-hack/blob/master/RTK1_Core.md
 */

/*:ja
 * @plugindesc RPG ツクール MV 用に作成された RTK1 ライブラリの基本機能です
 * @author Toshio Yamashita (yamachan)
 *
 * @param language
 * @desc RPG ツクール自体の言語設定は？
 * (0:自動設定 1:英語 2:日本語)
 * @default 0
 *
 * @param debug
 * @desc デバッグ用モード (0:OFF 1:ON)
 * @default 0
 *
 * @param json
 * @desc 非圧縮jsonデータも保存する (0:OFF 1:ON)
 * @default 0
 *
 * @param tagname for sort
 * @desc ソート時に代用する名称用のタグ名 (主に読み仮名用)
 * @default ja_sortname
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * https://github.com/yamachan/jgss-hack/blob/master/RTK1_Core.ja.md
 */

//-----------------------------------------------------------------------------

/**
 * The static class that defines core functions.
 *
 * @class RTK
 */
function RTK() {
    throw new Error('This is a static class');
}

/**
 * The revision number of the RTK1 library.
 *
 * @static
 * @property VERSION_NO
 * @type Number
 * @final
 */
RTK.VERSION_NO = 1.15;

// ----- for Services -----

RTK._inits = [];
RTK.onReady = function(_func){
	if ("function" == typeof _func) {
		RTK._inits.push(_func);
	}
};

RTK._ready = false;
RTK._modules = {};

RTK._calls = {};
RTK.onCall = function(_command, _func){
	if (typeof _command == "string" && _command.length > 0 && typeof _func == "function") {
		RTK._calls[_command] = _func;
	}
};

RTK._starts = [];
RTK.onStart = function(_func){ if ("function" == typeof _func) RTK._starts.push(_func); };
RTK._save = [];
RTK.onSave = function(_func){ if ("function" == typeof _func) RTK._save.push(_func); };
RTK._load = [];
RTK.onLoad = function(_func){ if ("function" == typeof _func) RTK._load.push(_func); };
RTK._mapStart = [];
RTK.onMapStart = function(_func){ if ("function" == typeof _func) RTK._mapStart.push(_func); };

// ----- for Debug -----

RTK.log = function(_v, _o) {
	if (this._debug && console && _v) {
		if (typeof _v == "string" || typeof _v == "number") {
			console.log(_v);
		} else {
			console.dir(_v);
		}
		if (_o) {
			console.dir(_o);
		}
	}
};
RTK.trace = function(_v) {
	RTK.log(_v);
	if (this._debug && Error.captureStackTrace) {
		var o = {};
		Error.captureStackTrace(o, RTK.trace);
		console.dir(o.stack);
	}
};
RTK._aeCount = 0;
RTK.ae = RTK.assertEquals = function(_a, _b) {
	RTK._aeCount++;
	if (_a !== _b ) {
		throw new Error("RTK.assertEquals(" + RTK._aeCount + "): expect " + String(_a) + ", but " + String(_b));
	}
};

// ----- Basic JS Functions -----

RTK.cloneObject = function(_o, o) {
	if (null == _o || typeof _o != "object") {
		return null;
	}
	o = (null != o && typeof _o == "object") ? o : _o.constructor();
	for (var k in _o) {
		if (_o.hasOwnProperty(k)) o[k] = _o[k];
	}
	return o;
};
RTK.ucfirst = function(_s, _footer) {
	if ("string" == typeof _s) {
		return _s.charAt(0).toUpperCase() + _s.slice(1) + (_footer && _s != "" ? _footer : "");
	}
	return "";
}
RTK.isTrue = function(_v) { return !!_v; };
RTK.isFalse = function(_v) { return !_v; };

// ----- Basic Game Functions -----

RTK.objectType = function(_o) {
	return DataManager.isItem(_o) ? "i" : DataManager.isWeapon(_o) ? "w" : DataManager.isArmor(_o) ? "a" : DataManager.isSkill(_o) ? "s" : "";
}
RTK.object2id = function(_o) {
	var t = RTK.objectType(_o);
	return t ? t + _o.id : "";
};
RTK.id2object = function(_id) {
	if ("string" == typeof _id) {
		var a = _id.match(/^\s*([aisw])(\d+)\s*$/i);
		if (a) {
			return (a[1] == "i" ? $dataItems : a[1] == "w" ? $dataWeapons : a[1] == "a" ? $dataArmors : $dataSkills)[a[2]];
		}
	}
	return undefined;
};
RTK.objects2ids = function(_a) {
	return _a instanceof Array ? _a.map(RTK.object2id).filter(RTK.isTrue) : null;
};
RTK.ids2objects = function(_a) {
	if (_a instanceof Array) {
		return _a.map(RTK.id2object).filter(RTK.isTrue);
	}
	return null;
};
RTK.hasId = function(_id, _n) {
	_n = _n||1;
	if ("string" == typeof _id) {
		var a = _id.match(/^\s*([aiw])(\d+)\s*$/i);
		if (a) {
			var list = a[1] == "i" ? $gameParty._items : a[1] == "w" ? $gameParty._weapons : $gameParty._armors;
			var n = list[Number(a[2])];
			return n >= _n ? n : 0;
		}
	}
	return 0;
};

RTK.ADD = 1;
RTK.REMOVE = 2;
RTK.id4list = function(_mode, _targetList, _value, _isObject, _setList) {
	var count = 0;
	if (_value && _value instanceof Array) {
		for (var l=0; l<_value.length; l++) {
			count += RTK.id4list(_mode, _targetList, _value[l], _isObject, _setList);	
		}
		return count;
	}
	if (_value && "object" == typeof _value) {
		var type = RTK.objectType(_value);
		if (type != "" && _value.id) {
			return RTK.id4list(_mode, _targetList, type + _value.id, _isObject, _setList);	
		}
	}
	if ("string" == typeof _value && _value != "") {
		var keys = _value.match(/^\s*([aiw])(\d+)\s*$/);
		if (keys) {
			var id = keys[1] + keys[2];
			var object = RTK.id2object(id);
			var item = _isObject ? object : id;
			if (_mode == RTK.ADD) {
				if (object && !_targetList.contains(item)) {
					_targetList.push(item);
					return 1;
				}
			} else if (_mode == RTK.REMOVE) {
				if (object && _targetList.contains(item)) {
					_targetList.splice(_targetList.indexOf(item), 1);
					return -1;
				}
			}
			return 0;
		}
		keys = _value.match(/^\s*([aiw])(\d+)\-(\d+)\s*$/);
		if (keys) {
				var start = Math.floor(Number(keys[2]));
				var end = Math.floor(Number(keys[3]));
				if (start > 0 && end > 0 && start < end) {
					for (var l=start; l<=end; l++) {
						count += RTK.id4list(_mode, _targetList, keys[1] + l, _isObject, _setList);
					}
					return count;
				}
				return 0;
		}
		keys = _value.split(",");
		if (keys.length > 1) {
			keys.forEach(function(o){
				count += RTK.id4list(_mode, _targetList, o, _isObject, _setList);
			});
			return count;
		}
		if (_setList && _setList[_value]) {
			return RTK.id4list(_mode, _targetList, _setList[_value], _isObject, _setList);
		}
		return 0;
	}
};

// ----- Init -----

(function(_global) {
	var N = 'RTK1_Core';

	var param = PluginManager.parameters(N);
	RTK._lang = Number(param['language'] || 0);
	RTK._debug = Number(param['debug'] || 0);
	RTK._json = Number(param['json'] || 0);
	RTK._sortnameTag = param['tagname for sort'] || "ja_sortname";

	function RTK_init(){
		if ($dataItems && $dataSystem && $dataSystem.terms && $dataSystem.terms.basic && $dataSystem.terms.commands && $dataSystem.terms.messages && $dataMapInfos) {
			if (RTK._lang == 0) {
				if (!$dataSystem.terms.basic[0].match(/^[\s!-~]+$/) || !$dataSystem.terms.commands[0].match(/^[\s!-~]+$/)) {
					RTK._lang = 1;
				}
			} else {
				RTK._lang--;
			}
			for (var l=0; l<RTK._inits.length; l++) {
				if ("function" == typeof RTK._inits[l]) {
					RTK._inits[l]();
				}
			}
			RTK._ready = true;
			RTK.log(N + " ready (_lang:" + RTK._lang + ", _debug:" + RTK._debug + ", _json:" + RTK._json + ")");
		} else {
			setTimeout(RTK_init, 100);
		}
	};
	var _Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function() {
		_Scene_Boot_start.call(this);
		RTK_init();
	};

	var _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
	Scene_Title.prototype.commandNewGame = function() {
		_Scene_Title_commandNewGame.call(this);
		for (var l=0; l<RTK._starts.length; l++) {
			if ("function" == typeof RTK._starts[l]) {
				RTK._starts[l](1);
			}
		}
		RTK.log(N + " start [new game] (_lang:" + RTK._lang + ", _ready:" + RTK._ready + ")");
	};
	var _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
	Scene_Load.prototype.onLoadSuccess = function() {
		_Scene_Load_onLoadSuccess.call(this);
		for (var l=0; l<RTK._starts.length; l++) {
			if ("function" == typeof RTK._starts[l]) {
				RTK._starts[l](0);
			}
		}
		RTK.log(N + " start [load game] (_lang:" + RTK._lang + ", _ready:" + RTK._ready + ")");
	};
	var _Scene_Battle_start = Scene_Battle.prototype.start;
	Scene_Battle.prototype.start = function() {
		_Scene_Battle_start.call(this);
		if (DataManager.isBattleTest()) {
			for (var l=0; l<RTK._starts.length; l++) {
				if ("function" == typeof RTK._starts[l]) {
					RTK._starts[l](2);
				}
			}
			RTK.log(N + " start [battle test] (_lang:" + RTK._lang + ", _ready:" + RTK._ready + ")");
		}
	};
	var _Scene_Map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		_Scene_Map_start.call(this);
		if (DataManager.isEventTest()) {
			for (var l=0; l<RTK._starts.length; l++) {
				if ("function" == typeof RTK._starts[l]) {
					RTK._starts[l](3);
				}
			}
			RTK.log(N + " start [event test] (_lang:" + RTK._lang + ", _ready:" + RTK._ready + ")");
		}
	};

	var _SceneManager_onSceneStart = SceneManager.onSceneStart;
	SceneManager.onSceneStart = function() {
		_SceneManager_onSceneStart.call(this);
		if ($gameMap.mapId() > 0) {
			for (var l=0; l<RTK._mapStart.length; l++) {
				if ("function" == typeof RTK._mapStart[l]) {
					RTK._mapStart[l]($gameMap.mapId());
				}
			}
			RTK.log(N + " mapStart [" + $gameMap.mapId() + "] (_lang:" + RTK._lang + ", _ready:" + RTK._ready + ")");
		}
	};

	// ----- json option -----

	RTK.writeFileSync = function(_f, _d, _fo){
		var fs = require('fs');
		var dirPath = StorageManager.localFileDirectoryPath();
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
		}
		fs.writeFileSync((_fo ? dirPath : "") + _f, _d);
		RTK.log(N + ".writeFileSync: " + (_fo ? dirPath : "") + _f);
	};
	if (RTK._json) {
		var _StorageManager_saveToLocalFile = StorageManager.saveToLocalFile;
		StorageManager.saveToLocalFile = function(savefileId, json) {
			_StorageManager_saveToLocalFile.call(this, savefileId, json);
			var filePath = this.localFilePath(savefileId);
			RTK.writeFileSync(filePath + ".json", json)
		};
	}

	// ----- Plugin command -----

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (RTK._calls[command]) {
			RTK._calls[command].call(this, args, command);
		}
	};

	// ----- Persistent data -----

	RTK._data = RTK._data || {};
	RTK.save = function(_k, _v) {
		if ("string" == typeof _k && _k != "" && _v !== undefined) {
			RTK._data[_k] = _v;
		}
	};
	RTK.load = function(_k) {
		return RTK._data[_k];
	};
	RTK.del = function(_k) {
		if (RTK._data[_k] !== undefined) {
			delete RTK._data[_k];
		}
	};
	RTK.pack = function(_s, _e) {
		if (_s < _e && _s > 0 && _e > 0 && _s <= $gameVariables._data.length && _e <= $gameVariables._data.length) {
			var ret = [];
			for (var l=_s; l<=_e; l++) {
				ret.push($gameVariables._data[l]);
			}
			return ret;
		}
		return undefined;
	};
	RTK.unpack = function(_s, _a) {
		if (_s > 0 && _a instanceof Array&& _s + _a.length <= $gameVariables._data.length) {
			for (var l=0; l<_a.length; l++) {
				$gameVariables._data[_s + l] = _a[l];
			}
		}
	}

	var _DataManager_makeSaveContents = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function() {
		var contents = _DataManager_makeSaveContents.call(this);
		contents.RTK1_Core = RTK._data;
		for (var l=0; l<RTK._save.length; l++) {
			if ("function" == typeof RTK._save[l]) {
				RTK._save[l](contents);
			}
		}
		RTK.log(N + " makeSaveContents: RTK._data", RTK._data);
		return contents;
	};

	var _DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(contents) {
		_DataManager_extractSaveContents.call(this, contents);
		if (contents && contents.RTK1_Core) {
			RTK._data = contents.RTK1_Core;
		}
		for (var l=0; l<RTK._load.length; l++) {
			if ("function" == typeof RTK._load[l]) {
				RTK._load[l](contents);
			}
		}
		RTK.log(N + "extractSaveContents: RTK._data", RTK._data);
	};

	// ----- Simple text control -----

	RTK._text = RTK._text || {};
	RTK.jp = function(){
		return RTK.EJ ? RTK.EJ._langSelect : RTK._lang == 1;
	};
	RTK.text = function(_e, _j){
		if ("string" == typeof _e && _e != "") {
			var key = _e.toLowerCase();
			if (_j !== undefined) {
				RTK._text[key] = _j;
			}
			return RTK.jp() ? (RTK._text[key]||_e) : _e;
		}
		return undefined;
	};
	RTK.sortName = function(_a, _b) {
		var a = _a || {};
		var b = _b || {};
		a = a._sortName || a.name || "";
		b = b._sortName || b.name || "";
		if (RTK.jp()) {
			a = (_a.meta && _a.meta[RTK._sortnameTag]) ? _a.meta[RTK._sortnameTag] : a;
			b = (_b.meta && _b.meta[RTK._sortnameTag]) ? _b.meta[RTK._sortnameTag] : b;
		}
		return a == b ? 0 : a > b ? 1 : -1;
	};

	// ----- Enhance option menu -----

	var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
	Window_Options.prototype.cursorRight = function(wrap) {
		var symbol = this.commandSymbol(this.index());
		var m = symbol.match(/RTK(\d+)Select$/);
		if (m) {
			var value = this.getConfigValue(symbol) + 1;
			value.clamp(0, Number(m[1]) - 1);
			this.changeValue(symbol, value);
		} else {
			_Window_Options_cursorRight.call(this, wrap);
		}
	};

	var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
	Window_Options.prototype.cursorLeft = function(wrap) {
		var symbol = this.commandSymbol(this.index());
		var m = symbol.match(/RTK(\d+)Select$/);
		if (m) {
			var value = this.getConfigValue(symbol) - 1;
			value.clamp(0, Number(m[1]) - 1);
			this.changeValue(symbol, value);
		} else {
			_Window_Options_cursorLeft.call(this, wrap);
		}
	};

	// ----- Experimental (not official) -----

	RTK.getFileText = function(src){
		var req = new XMLHttpRequest();
		req.open("GET", src, false);
		req.send(null);
		return req.responseText;
	};

	RTK.pluginAuthors = function(plugins) {
		plugins = plugins ? plugins : $plugins;
		plugins.forEach(function(plugin) {
			if (!plugin.author) {
				var txt = RTK.getFileText(PluginManager._path + plugin.name + '.js');
				var ret = txt.match(/@author ([^\f\n\r]+)/);
				if (ret && ret[1] != "") {
					plugin.author = ret[1];
				}
			}
		});
	};

	RTK.command = function(_v) {
		if ("string" == typeof _v && _v != "" && $gameMap && $gameMap._interpreter) {
			var args = _v.split(" ");
			var command = args.shift();
			$gameMap._interpreter.pluginCommand(command, args);
		}
	};

})(this);

