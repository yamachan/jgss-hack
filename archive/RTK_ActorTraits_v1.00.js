//=============================================================================
// RTK_ActorTraits.js	2016/08/03
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc アクターに特徴を追加するプラグインコマンド
 * @author Toshio Yamashita (yamachan)
 *
 * @help
 * アクターに特徴を追加するプラグインコマンドを追加します。
 * プラグインコマンド:
 *  RTK_ActorTraits list	# 現在のアクターの特徴をコンソールにリスト表示する
 *  RTK_ActorTraits add n {}	# n番のアクターに {} の特徴を追加
 *  RTK_ActorTraits remove n {}	# n番のアクターから {} の特徴を削除
 *
 * 特徴を表現するオブジェクト {} は、いったんアクターに設定して list コマンドで調査してください
 * 例) {"code":43,"dataId":13,"value":1} は 13番のスキルを使えるようにする
 * 例) {"code":51,"dataId":7,"value":1} は 7番の種類の武器を装備できるようにする
 */

(function(_global) {
	var N = 'RTK_ActorTraits';
	var param = PluginManager.parameters(N);

	var _DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(contents) {
		var ret = _DataManager_extractSaveContents.call(this, contents);
		var list = $gameSystem[N]||[];
		for (var l=0; l<list.length; l++) {
			if (list[l] && list[l].length > 0) {
				list[l].forEach(function(json){
					$gameActors.actor(l).actor().traits.push(JsonEx.parse(json));
				});
			}
		}
		return ret;
	};

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command == N) {
			if (args[0] == "list") {
				$gameParty.allMembers().forEach(function(actor){
					console.log(actor.name());
					actor.actor().traits.forEach(function(trait){
						console.log(JsonEx.stringify(trait));
					});
				});
			}
			if (args[0] == "add" && args.length > 2) {
				var id = Number(args[1]) || 0;
				var json = args.slice(2).join(" ");
				if (id > 0 && json != "") {
					var gsys = $gameSystem[N]||[];
					var dat = gsys[id]||[];
					if (!dat.contains(json)) {
						dat.push(json);
						gsys[id] = dat;
						$gameSystem[N] = gsys;
						$gameActors.actor(id).actor().traits.push(JsonEx.parse(json));
					}
				}
			}
			if (args[0] == "remove" && args.length > 2) {
				var id = Number(args[1]) || 0;
				var json = args.slice(2).join(" ");
				if (id > 0 && json != "") {
					var gsys = $gameSystem[N]||[];
					var dat = gsys[id]||[];
					if (dat.contains(json)) {
						dat.splice(dat.indexOf(json),1);
						gsys[id] = dat.length == 0 ? undefined : dat;
						$gameSystem[N] = gsys;
						$gameActors.actor(id).actor().traits = $gameActors.actor(id).actor().traits.filter(function(o){
							return JsonEx.stringify(o) != json;
						});
					}
				}
			}
		}
	};
})(this);
