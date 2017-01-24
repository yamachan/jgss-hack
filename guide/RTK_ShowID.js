//=============================================================================
// RTK_ShowID.js	2016/07/31
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc アクターとエネミーにID表示するプラグイン (プラグイン作成講座のサンプル)
 * @author Toshio Yamashita (yamachan)
 *
 * @param アクター名の後にIDを表示
 * @desc アクター名の後にIDを表示する (0:OFF 1:ON)
 * @default 1
 *
 * @param エネミー名の後にIDを表示
 * @desc エネミー名の後にIDを表示する (0:OFF 1:ON)
 * @default 1
 *
 * @help
 * プラグインコマンド:
 *  RTK_ShowID show_id on
 *  RTK_ShowID show_id off
 *  RTK_ShowID show_eid on
 *  RTK_ShowID show_eid off
 *
 * アクターとエネミーにID表示するプラグインです
 *
 * 詳細はプラグイン作成講座(1)(2)を参照してください。
 * https://github.com/yamachan/jgss-hack/blob/master/README.ja.md
 */

(function(_global) {
	// ここにプラグイン処理を記載
	var N = 'RTK_ShowID';
	var param = PluginManager.parameters(N);
	var show_id = Number(param['アクター名の後にIDを表示'])||1;
	var show_eid = Number(param['エネミー名の後にIDを表示'])||1;

	var _Game_Actor_name = Game_Actor.prototype.name;
	Game_Actor.prototype.name = function() {
		var ret = _Game_Actor_name.call(this);
		var f = $gameSystem[N + "_show_id"];
		if (f === undefined ? show_id : f) {
			return ret + ":" + this.actorId();
		} else {
			return ret;
		}
	};

	var _Game_Enemy_name = Game_Enemy.prototype.name;
	Game_Enemy.prototype.name = function() {
		var ret = _Game_Enemy_name.call(this);
		var f = $gameSystem[N + "_show_eid"];
		if (f === undefined ? show_eid : f) {
			return ret + ":" + this.enemyId();
		} else {
			return ret;
		}
	};

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command == N) {
			if (args[0] == "show_id") {
				if (args[1] == "on") {
					if (show_id) {
						delete $gameSystem[N + "_show_id"];
					} else {
						$gameSystem[N + "_show_id"] = 1;
					}
				} else if (args[1] == "off") {
					if (!show_id) {
						delete $gameSystem[N + "_show_id"];
					} else {
						$gameSystem[N + "_show_id"] = 0;
					}
				}
			}
			if (args[0] == "show_eid") {
				if (args[1] == "on") {
					if (show_eid) {
						delete $gameSystem[N + "_show_eid"];
					} else {
						$gameSystem[N + "_show_eid"] = 1;
					}
				} else if (args[1] == "off") {
					if (!show_eid) {
						delete $gameSystem[N + "_show_eid"];
					} else {
						$gameSystem[N + "_show_eid"] = 0;
					}
				}
			}
		}
	};
})(this);
