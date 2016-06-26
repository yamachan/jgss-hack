//=============================================================================
// RTK_VariablePacker.js  ver1.00 2016/06/26
//=============================================================================

/*:
 * @plugindesc Plugin command to pack/unpack variables
 * @author Toshio Yamashita (yamachan)
 *
 * @help
 *
 * Plugin Command:
 *   VariablePacker pack 4,2,1	# pack value 4-5 (length=2) to 1
 *   VariablePacker unpack 1,4	# unpack 1 into 4-
 */

/*:ja
 * @plugindesc 変数をパック/アンパックするプラグインコマンド
 * @author Toshio Yamashita (yamachan)
 *
 * @help
 *
 * プラグインコマンド:
 *   VariablePacker pack 4,2,1	# 変数4～5(サイズが2)を1にパック
 *   VariablePacker unpack 1,4	# 変数1から4～にアンパック
 */

//-----------------------------------------------------------------------------


(function(_global) {
	var N = 'RTK_VariablePacker';

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command == "VariablePacker" && args.length == 2) {
			var a = args[1].split(",");
			if (args[0] == "pack" && a.length == 3) {
				var start = Number(a[0]);
				var len = Number(a[1]);
				var target = Number(a[2]);
				if (start > 0 && len > 0 && target > 0 && start + len <= $gameVariables._data.length) {
					var v = [];
					for (var l=0; l<len; l++) {
						v.push($gameVariables._data[start + l]);
					}
					$gameVariables._data[target] = v;
				}
			} else if (args[0] == "unpack" && a.length == 2) {
				var target = Number(a[0]);
				var start = Number(a[1]);
				if (target > 0 && start > 0 && target <= $gameVariables._data.length) {
					var v = $gameVariables._data[target];
					if (v instanceof Array && start + v.length <= $gameVariables._data.length) {
						for (var l=0; l<v.length; l++) {
							$gameVariables._data[start + l] = v[l];
						}
					}
				}
			}
		}
	};
})(this);

