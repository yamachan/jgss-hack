//=============================================================================
// RTK1_Core.js  ver1.00 2016/06/19
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
RTK.VERSION_NO = 1;

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

// ----- Basic Functions -----

RTK.cloneObject = function(_o) {
	if (null == _o || typeof _o != "object") {
		return null;
	}
	var o = _o.constructor();
	for (var k in _o) {
		if (_o.hasOwnProperty(k)) o[k] = _o[k];
	}
	return o;
};

// ----- Init -----

(function(_global) {
	var N = 'RTK1_Core';

	var param = PluginManager.parameters(N);
	RTK._lang = Number(param['language'] || 0);
	RTK._debug = Number(param['debug'] || 0);
	RTK._json = Number(param['json'] || 0);

	function RTK_init(){
		if ($dataSystem && $dataSystem.terms && $dataSystem.terms.basic && $dataSystem.terms.commands && $dataSystem.terms.messages) {
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
	var _Scene_Boot_checkPlayerLocation = Scene_Boot.prototype.checkPlayerLocation;
	Scene_Boot.prototype.checkPlayerLocation = function() {
		_Scene_Boot_checkPlayerLocation.call(this);
		RTK_init();
	};

	if (RTK._json) {
		var _StorageManager_saveToLocalFile = StorageManager.saveToLocalFile;
		StorageManager.saveToLocalFile = function(savefileId, json) {
			_StorageManager_saveToLocalFile.call(this, savefileId, json);
			var fs = require('fs');
			var dirPath = this.localFileDirectoryPath();
			var filePath = this.localFilePath(savefileId);
			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath);
			}
			fs.writeFileSync(filePath + ".json", json);
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

})(this);

