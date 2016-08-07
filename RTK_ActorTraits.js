//=============================================================================
// RTK_ActorTraits.js  ver 1.01 2016/08/03
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Plugin commands to add traits against actors
 * @author Toshio Yamashita (yamachan)
 *
 * @help
 * Add plugin commands to add traits against actors.
 * Plugin commands:
 *  RTK_ActorTraits list	# List actors' current traits to the console
 *  RTK_ActorTraits add n {}	# Add {} trait against #n actor
 *  RTK_ActorTraits remove n {}	# Remove {} trait from #n actor
 *  RTK_ActorTraits clear n	# Remove #n actor's all addtional traits
 *  RTK_ActorTraits clear all	# Remove all actors' all addtional traits
 *
 * The prefix "n" shows the actor's id. This is a default, so you can omit it.
 * e.g. RTK_ActorTraits add n3 {} => Add {} trait against #3 actor
 *
 * The prefix "v" shows the game valiable. The value will be used as the actor #.
 * 例) RTK_ActorTraits add v10 {} => Add {} trait against the actor which is found by the game valiable #10.
 *
 * The prefix "p" shows the party member. The value will be used as the order # of the party member list.
 * 例) RTK_ActorTraits add p1 {} => Add {} trait against the 1st actor in the party.
 *
 * To know the correct trait object value {}, set the trait to an actor, then use "list" command
 * e.g. {"code":43,"dataId":13,"value":1} is to enable to use #13 skill
 * e.g. {"code":51,"dataId":7,"value":1} is to enable to equip #7 weapon
 * e.g. {"code":52,"dataId":3,"value":1} is to enable to equip #3 armor
 */

/*:ja
 * @plugindesc アクターに特徴を追加するプラグインコマンド
 * @author Toshio Yamashita (yamachan)
 *
 * @help
 * アクターに特徴を追加するプラグインコマンドを追加します。
 * プラグインコマンド:
 *  RTK_ActorTraits list	# 現在のアクターの特徴をコンソールにリスト表示する
 *  RTK_ActorTraits add n {}	# n番のアクターに {} の特徴を追加
 *  RTK_ActorTraits remove n {}	# n番のアクターから {} の特徴を削除
 *  RTK_ActorTraits clear n	# n番のアクターの特徴を初期状態に戻す
 *  RTK_ActorTraits clear all	# 全てのアクターの特徴を初期状態に戻す
 *
 * n番を示す数値の前に "n" を付与すると、その番号が対象アクターのIDになる
 * これはデフォルトの動作のためこの "n" は省略可能です
 * 例) RTK_ActorTraits add n3 {} は3番のアクターに {} の特徴を追加する
 *
 * n番を示す数値の前に "v" を付与すると、その番号が示すゲーム変数の値がアクターの番号になる
 * 例) RTK_ActorTraits add v10 {} は変数10番に入っている値が示すアクターに {} の特徴を追加する
 *
 * n番を示す数値の前に "p" を付与すると、パーティメンバーの n 番目のアクターが対象になる
 * 例) RTK_ActorTraits add p1 {} はパーティ先頭のアクターに {} の特徴を追加する
 *
 * 特徴を表現するオブジェクト {} は、いったんアクターに設定して list コマンドで調査してください
 * 例) {"code":43,"dataId":13,"value":1} は 13番のスキルを使えるようにする
 * 例) {"code":51,"dataId":7,"value":1} は 7番の種類の武器を装備できるようにする
 * 例) {"code":52,"dataId":3,"value":1} は 3番の種類の防具を装備できるようにする
 */

(function(_global) {
	var N = 'RTK_ActorTraits';
	var param = PluginManager.parameters(N);
	var backup = [];

	var _DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(contents) {
		var ret = _DataManager_extractSaveContents.call(this, contents);
		var list = $gameSystem[N]||[];
		for (var l=0; l<list.length; l++) {
			if (list[l] && list[l].length > 0) {
				if (!backup[l]) {
					backup[l] = $gameActors.actor(l).actor().traits.clone();
				}
				list[l].forEach(function(json){
					$gameActors.actor(l).actor().traits.push(JsonEx.parse(json));
				});
			}
		}
		return ret;
	};

	function convId(_s) {
		if (_s.match(/^\d+$/)) {
			return Number(_s) || 0;;
		}
		var ret = _s.match(/^n(\d+)$/i);
		if (ret) {
			return Number(ret[1]) || 0;
		}
		ret = _s.match(/^v(\d+)$/i);
		if (ret) {
			return $gameVariables.value(Number(ret[1]));
		}
		ret = _s.match(/^p(\d+)$/i);
		if (ret) {
			var actor = $gameParty.allMembers()[Number(ret[1]) - 1];
			if (actor) {
				return actor.actor().id
			}
		}
		return 0;
	}
	function clearTrait(_id) {
		if (_id > 0 && backup[_id]) {
			$gameActors.actor(_id).actor().traits = backup[_id];
			backup[_id] = undefined;
			var gsys = $gameSystem[N]||[];
			if (gsys[_id]) {
				gsys[_id] = undefined;
				$gameSystem[N] = gsys;
			}
		}
	}

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
				var id = convId(args[1]);
				var json = args.slice(2).join(" ");
				if (id > 0 && json != "") {
					var gsys = $gameSystem[N]||[];
					var dat = gsys[id]||[];
					if (!dat.contains(json)) {
						if (!backup[id]) {
							backup[id] = $gameActors.actor(id).actor().traits.clone();
						}
						dat.push(json);
						gsys[id] = dat;
						$gameSystem[N] = gsys;
						$gameActors.actor(id).actor().traits.push(JsonEx.parse(json));
					}
				}
			}
			if (args[0] == "remove" && args.length > 2) {
				var id = convId(args[1]);
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
			if (args[0] == "clear" && args.length > 1) {
				if (args[1] == "all") {
					for (var l=1; l<backup.length; l++) {
						if (backup[l]) {
							clearTrait(l);
						}
					}
				} else {
					clearTrait(convId(args[1]));
				}
			}
		}
	};
})(this);
