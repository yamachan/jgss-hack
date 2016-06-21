//=============================================================================
// RTK1_Option_EnJa.js  ver1.01 2016/06/21
//=============================================================================

/*:
 * @plugindesc Plugin to select English/Japanese language in Option menu.
 * @author Toshio Yamashita (yamachan)
 *
 * @param switch
 * @desc Switch number : ON is Japanese, OFF is English
 * (0:OFF 1-999:Switch No.)
 * @default 0
 *
 * @param hide
 * @desc Hide Language in Option screen (0:OFF 1:ON)
 * @default 0
 *
 * @param message
 * @desc Expand text message with dictionary (0:OFF 1:ON)
 * @default 0
 *
 * @param meta_ja
 * @desc Meta tag name for Japanese text in Note area
 * @default ja
 *
 * @param meta_en
 * @desc Meta tag name for English text in Note area
 * @default en
 *
 * @param separator
 * @desc Separator string for setName,Nickname,Profile
 * @default ||
 *
 * @param 2nd_language
 * @desc The name of 2nd language
 * @default Japanese
 *
 * @help
 * This plugin requires RTK1_Core plugin previously.
 *
 * Plugin Command:
 *   RTK1_Option_EnJa english    # Change to English mode
 *   RTK1_Option_EnJa japanese   # Change to Japanese mode
 *
 * https://github.com/yamachan/jgss-hack/blob/master/RTK1_Option_EnJa.md
 */

/*:ja
 * @plugindesc オプションメニューで言語を英語と日本語で切り替えるプラグイン
 * @author Toshio Yamashita (yamachan)
 *
 * @param switch
 * @desc Switch番号 : ONは日本語、OFFは英語
 * (0:OFF 1-999:Switch番号)
 * @default 0
 *
 * @param hide
 * @desc 言語切り替えをオプションメニューから隠します (0:OFF 1:ON)
 * @default 0
 *
 * @param message
 * @desc テキストメッセージを拡張します (0:OFF 1:ON)
 * @default 0
 *
 * @param meta_ja
 * @desc ノート欄で日本語テキストを指定するタグ名
 * @default ja
 *
 * @param meta_en
 * @desc ノート欄で英語テキストを指定するタグ名
 * @default en
 *
 * @param separator
 * @desc Name,Nickname,Profileを指定するときの区切り文字
 * @default ||
 *
 * @param 2nd_language
 * @desc 本プラグインで追加表示する言語の名称
 * @default Japanese
 *
 * @help
 * このプラグインの前に RTK1_Core プラグインを読み込んでください。
 *
 * プラグインコマンド:
 *   RTK1_Option_EnJa english    # 英語モードにする
 *   RTK1_Option_EnJa japanese   # 日本語モードにする
 *
 * https://github.com/yamachan/jgss-hack/blob/master/RTK1_Option_EnJa.ja.md
 */

//-----------------------------------------------------------------------------

(function(_global) {
	if (!_global["RTK"]) {
		throw new Error('This plugin requires RTK1_Core.js plugin previously.');
	}

	var N = "RTK1_Option_EnJa";
	var NK = "RTK_EJ";
	var M = RTK._modules[N] = {};

	var param = PluginManager.parameters(N);
	M._switch = Number(param['switch'] || 0);
	M._hide = Number(param['hide'] || 0);
	M._message = Number(param['message'] || 0);
	M._meta_ja = param['meta_ja'] || "ja";
	M._meta_en = param['meta_en'] || "en";
	M._separator = param['separator'] || "||";
	M._2nd_language = param['2nd_language'] || "Japanese";

	// ----- Init resource -----

	var terms_E, actors_E, classes_E, items_E, weapons_E, armors_E, enemies_E, troops_E, skills_E, states_E;
	var terms_J, actors_J, classes_J, items_J, weapons_J, armors_J, enemies_J, troops_J, skills_J, states_J;

	RTK.onReady(function(){
		if (RTK._lang == 1) {
			terms_J = $dataSystem.terms;
			actors_J = $dataActors;
			classes_J = $dataClasses;
			items_J = $dataItems;
			weapons_J = $dataWeapons;
			armors_J = $dataArmors;
			enemies_J = $dataEnemies;
			troops_J = $dataTroops;
			skills_J = $dataSkills;
			states_J = $dataStates;

			terms_E = M._terms_E;
			actors_E = updateGameData($dataActors, M._actors, M._meta_en);
			classes_E = updateGameData($dataClasses, M._classes, M._meta_en);
			items_E = updateGameData($dataItems, M._items, M._meta_en);
			weapons_E = updateGameData($dataWeapons, M._weapons, M._meta_en);
			armors_E = updateGameData($dataArmors, M._armors, M._meta_en);
			enemies_E = updateGameData($dataEnemies, M._enemies, M._meta_en);
			troops_E = updateGameData($dataTroops, M._troops, M._meta_en);
			skills_E = updateGameData($dataSkills, M._skills, M._meta_en);
			states_E = updateGameData($dataStates, M._states, M._meta_en);
		} else {
			terms_E = $dataSystem.terms;
			actors_E = $dataActors;
			classes_E = $dataClasses;
			items_E = $dataItems;
			weapons_E = $dataWeapons;
			armors_E = $dataArmors;
			enemies_E = $dataEnemies;
			troops_E = $dataTroops;
			skills_E = $dataSkills;
			states_E = $dataStates;

			terms_J = M._terms_J;
			actors_J = updateGameData($dataActors, M._actors, M._meta_ja);
			classes_J = updateGameData($dataClasses, M._classes, M._meta_ja);
			items_J = updateGameData($dataItems, M._items, M._meta_ja);
			weapons_J = updateGameData($dataWeapons, M._weapons, M._meta_ja);
			armors_J = updateGameData($dataArmors, M._armors, M._meta_ja);
			enemies_J = updateGameData($dataEnemies, M._enemies, M._meta_ja);
			troops_J = updateGameData($dataTroops, M._troops, M._meta_ja);
			skills_J = updateGameData($dataSkills, M._skills, M._meta_ja);
			states_J = updateGameData($dataStates, M._states, M._meta_ja);
		}
		RTK.onCall(N, function(args){
			if (args.length == 1 && args[0].match(/^en(?:glish)?$/i)) {
				RTK.terms_change(false);
				ConfigManager.save();
			} else if (args.length == 1 && args[0].match(/^ja(?:panese)?$/i)) {
				RTK.terms_change(true);
				ConfigManager.save();
			}
		});
		RTK.log(N + " ready (_switch:" + M._switch + ", _hide:" + M._hide + ", _message:" + M._message + ")");
	});

	function cloneObject(_s) {
		if (!_s) { return null; }
		if (_s.cloneFrom) { return _s; }
		var o = RTK.cloneObject(_s);
		o._cloneFrom = _s;
		return o;
	};
	function updateObject(_o, _v) {
		if (!_o) {return; }
		if ("string" == typeof _v ) {
			var a = _v.split(",");
			if (a[0] != "") {
				_o.name = a[0];
			}
			if (a.length > 1 && a[1] != "") {
				if (_o.nickname !== undefined) {
					_o.nickname = a[1];
				} else if (_o.description !== undefined) {
					_o.description = a[1];
				} else {
					if (_o.note !== undefined) {
						_o.note = a[1];
					}
					return;
				}
			}
			if (a.length > 2 && a[2] != "") {
				if (_o.profile !== undefined) {
					_o.profile = a[2];
				} else {
					if (_o.note !== undefined) {
						_o.note = a[2];
					}
					return;
				}
			}
			if (a.length > 3 && a[3] != "") {
				if (_o.note !== undefined) {
					_o.note = a[3];
				}
			}
		} else {
		}
	};
	function updateGameData(_list, _data, _meta) {
		_list = _list.clone();

		// ----- Apply meta values -----
		for (var l=0; l<_list.length; l++) {
			if (_list[l] && _list[l].meta) {
				var s = _list[l].meta[_meta];
				if ("string" == typeof s && s != "") {
					_list[l] = cloneObject(_list[l]);
					updateObject(_list[l], s);
				}
			}
		}

		// ----- Apply translated values -----
		var id = 1;
		for (var l=0; l<_data.length; l++) {
			var d = _data[l];
			if ("string" == typeof d && d != "") {
				_list[id] = cloneObject(_list[id]);
				updateObject(_list[id], d);
			} else if ("object" == typeof d) {
				if (d.id) {
					id = d.id;
				}
			}
			id++;
		}
		return _list;
	};

	// ----- Enhance option menu -----

	Object.defineProperty(ConfigManager, 'langSelect', {
	    get: function() {
	        return M._langSelect;
	    },
	    set: function(_value) {
	        M._langSelect = _value;
	    },
	    configurable: true
	});
	var _ConfigManager_makeData = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		var config = _ConfigManager_makeData.call(this);
		config.langSelect = this.langSelect;
		return config;
	};

	var _ConfigManager_applyData = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		_ConfigManager_applyData.call(this, config);
		this.langSelect = this.readFlag(config, 'langSelect');
	};

	var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
	Window_Options.prototype.makeCommandList = function() {
		_Window_Options_makeCommandList.call(this);
		if (M._hide == 0) {
			this.addCommand(ConfigManager.langSelect ? "言語" : "Language", "langSelect");
		}
	};
	var _Window_Options_statusText = Window_Options.prototype.statusText;
	Window_Options.prototype.statusText = function(index) {
		var symbol = this.commandSymbol(index);
		if (symbol == "langSelect") {
			if (this.getConfigValue(symbol) == "1") {
				return M._2nd_language;
			} else {
				return "English";
			}
		}
		return _Window_Options_statusText.call(this, index);
	};

	// ----- Switch resource -----

	RTK.terms_change = function(_lang) {
		if (RTK._ready) {
			if (_lang === undefined) {
				_lang = ConfigManager.langSelect;
			} else {
				ConfigManager.langSelect = _lang;
			}
			if (_lang) {
				if ($dataSystem.terms != terms_J) {
					$dataSystem.terms = terms_J;
					$dataActors = actors_J;
					$dataClasses = classes_J;
					$dataItems = items_J;
					$dataWeapons = weapons_J;
					$dataArmors = armors_J;
					$dataEnemies = enemies_J;
					$dataTroops = troops_J;
					$dataSkills = skills_J;
					$dataStates = states_J;
				}
			} else {
				if ($dataSystem.terms != terms_E) {
					$dataSystem.terms = terms_E;
					$dataActors = actors_E;
					$dataClasses = classes_E;
					$dataItems = items_E;
					$dataWeapons = weapons_E;
					$dataArmors = armors_E;
					$dataEnemies = enemies_E;
					$dataTroops = troops_E;
					$dataSkills = skills_E;
					$dataStates = states_E;
				}
			}
			if (M._switch > 0) {
				$gameSwitches.setValue(M._switch, _lang);
			}
			RTK.log(N + ".terms_change (_lang:" + _lang + ")");
		}
	};

	var _Scene_Title_create = Scene_Title.prototype.create;
	Scene_Title.prototype.create = function() {
		RTK.terms_change();
		_Scene_Title_create.call(this);
	};
	var _Scene_Options_terminate = Scene_Options.prototype.terminate;
	Scene_Options.prototype.terminate = function() {
		_Scene_Options_terminate.call(this);
		RTK.terms_change();
	};
	var _DataManager_createGameObjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
		_DataManager_createGameObjects.call(this);
		if (M._switch > 0) {
			$gameSwitches.setValue(M._switch, ConfigManager.langSelect);
		}
	};

	// ----- Game_Actor support -----
	var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
	Game_Actor.prototype.initMembers = function() {
		_Game_Actor_initMembers.call(this);
		this[NK + "n"] = "";
		this[NK + "nn"] = "";
		this[NK + "p"] = "";
	};
	var _Game_Actor_setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId) {
		_Game_Actor_setup.call(this, actorId);
		if (RTK._ready) {
			this._name = actors_E[this._actorId].name;
			this._nickname = actors_E[this._actorId].nickname;
			this._profile = actors_E[this._actorId].profile;
			this[NK + "n"] = actors_J[this._actorId].name;
			this[NK + "nn"] = actors_J[this._actorId].nickname;
			this[NK + "p"] = actors_J[this._actorId].profile;
		} else {
			this[NK + "n"] = this._name;
			this[NK + "nn"] = this._nickname;
			this[NK + "p"] = this._profile;
		}
	};
	var _Game_Actor_name = Game_Actor.prototype.name;
	Game_Actor.prototype.name = function() {
		_Game_Actor_name.call(this);
		return ConfigManager.langSelect ? this[NK + "n"] : this._name;
	};
	var _Game_Actor_setName = Game_Actor.prototype.setName;
	Game_Actor.prototype.setName = function(name) {
		var a = name.split(M._separator);
		if (a.length == 2) {
			_Game_Actor_setName.call(this, a[0]);
			this[NK + "n"] = a[1];
		} else {
			_Game_Actor_setName.call(this, name);
			this[NK + "n"] = name;
		}
	};
	var _Game_Actor_nickname = Game_Actor.prototype.nickname;
	Game_Actor.prototype.nickname = function() {
		_Game_Actor_nickname.call(this);
		return ConfigManager.langSelect ? this[NK + "nn"] : this._nickname;
	};
	var _Game_Actor_setNickname = Game_Actor.prototype.setNickname;
	Game_Actor.prototype.setNickname = function(nickname) {
		var a = nickname.split(M._separator);
		if (a.length == 2) {
			_Game_Actor_setNickname.call(this, a[0]);
			this[NK + "nn"] = a[1];
		} else {
			_Game_Actor_setNickname.call(this, nickname);
			this[NK + "nn"] = nickname;
		}
	};
	var _Game_Actor_profile = Game_Actor.prototype.profile;
	Game_Actor.prototype.profile = function() {
		_Game_Actor_profile.call(this);
		return ConfigManager.langSelect ? this[NK + "p"] : this._profile;
	};
	var _Game_Actor_setProfile = Game_Actor.prototype.setProfile;
	Game_Actor.prototype.setProfile = function(profile) {
		var a = profile.split(M._separator);
		if (a.length == 2) {
			_Game_Actor_setProfile.call(this, a[0]);
			this[NK + "p"] = a[1];
		} else {
			_Game_Actor_setProfile.call(this, profile);
			this[NK + "p"] = profile;
		}
	};

	// ----- Terms' default values -----

	/* 
	 * If you use English version of RPG Maker MV, following "terms_E" list will not be used, will be replaced by your words in Terms tab of database tool.
	 * In this case, you only need to update "terms_J" list, if you don't like the default Japansese terms settings.
	 * 
	 * もし日本語版のRPGツクールMVを利用している場合、以下に定義されている terms_J 配列は利用されず、データベース機能の用語タブで設定した値で上書きされます。
	 * もし標準の英語表記が好ましくない場合、あなたは terms_E 配列を修正することでゲーム中の英語モードの用語を修正することができます。
	 */

	M._terms_E = {
		"basic":["Level","Lv","HP","HP","MP","MP","TP","TP","EXP","EXP"],
		"commands":["Fight","Escape","Attack","Guard","Item","Skill","Equip","Status","Formation","Save","Game End","Options","Weapon","Armor","Key Item","Equip","Optimize","Clear","New Game","Continue",null,"To Title","Cancel",null,"Buy","Sell"],
		"params":["Max HP","Max MP","Attack","Defense","M.Attack","M.Defense","Agility","Luck","Hit","Evasion"],
		"messages":{"actionFailure":"There was no effect on %1!","actorDamage":"%1 took %2 damage!","actorDrain":"%1 was drained of %2 %3!","actorGain":"%1 gained %2 %3!","actorLoss":"%1 lost %2 %3!","actorNoDamage":"%1 took no damage!","actorNoHit":"Miss! %1 took no damage!","actorRecovery":"%1 recovered %2 %3!","alwaysDash":"Always Dash","bgmVolume":"BGM Volume","bgsVolume":"BGS Volume","buffAdd":"%1's %2 went up!","buffRemove":"%1's %2 returned to normal!","commandRemember":"Command Remember","counterAttack":"%1 counterattacked!","criticalToActor":"A painful blow!!","criticalToEnemy":"An excellent hit!!","debuffAdd":"%1's %2 went down!","defeat":"%1 was defeated.","emerge":"%1 emerged!","enemyDamage":"%1 took %2 damage!","enemyDrain":"%1 was drained of %2 %3!","enemyGain":"%1 gained %2 %3!","enemyLoss":"%1 lost %2 %3!","enemyNoDamage":"%1 took no damage!","enemyNoHit":"Miss! %1 took no damage!","enemyRecovery":"%1 recovered %2 %3!","escapeFailure":"However, it was unable to escape!","escapeStart":"%1 has started to escape!","evasion":"%1 evaded the attack!","expNext":"To Next %1","expTotal":"Current %1","file":"File","levelUp":"%1 is now %2 %3!","loadMessage":"Load which file?","magicEvasion":"%1 nullified the magic!","magicReflection":"%1 reflected the magic!","meVolume":"ME Volume","obtainExp":"%1 %2 received!","obtainGold":"%1\\G found!","obtainItem":"%1 found!","obtainSkill":"%1 learned!","partyName":"%1's Party","possession":"Possession","preemptive":"%1 got the upper hand!","saveMessage":"Save to which file?","seVolume":"SE Volume","substitute":"%1 protected %2!","surprise":"%1 was surprised!","useItem":"%1 uses %2!","victory":"%1 was victorious!"}
	};
	M._terms_J = {
		"basic":["レベル","Lv","ＨＰ","HP","ＭＰ","MP","ＴＰ","TP","経験値","EXP"],
		"commands":["戦う","逃げる","攻撃","防御","アイテム","スキル","装備","ステータス","並び替え","セーブ","ゲーム終了","オプション","武器","防具","大事なもの","装備","最強装備","全て外す","ニューゲーム","コンティニュー",null,"タイトルへ","やめる",null,"購入する","売却する"],
		"params":["最大ＨＰ","最大ＭＰ","攻撃力","防御力","魔法力","魔法防御","敏捷性","運","命中率","回避率"],
		"messages":{"actionFailure":"%1には効かなかった！","actorDamage":"%1は %2 のダメージを受けた！","actorDrain":"%1は%2を %3 奪われた！","actorGain":"%1の%2が %3 増えた！","actorLoss":"%1の%2が %3 減った！","actorNoDamage":"%1はダメージを受けていない！","actorNoHit":"ミス！　%1はダメージを受けていない！","actorRecovery":"%1の%2が %3 回復した！","alwaysDash":"常時ダッシュ","bgmVolume":"BGM 音量","bgsVolume":"BGS 音量","buffAdd":"%1の%2が上がった！","buffRemove":"%1の%2が元に戻った！","commandRemember":"コマンド記憶","counterAttack":"%1の反撃！","criticalToActor":"痛恨の一撃！！","criticalToEnemy":"会心の一撃！！","debuffAdd":"%1の%2が下がった！","defeat":"%1は戦いに敗れた。","emerge":"%1が出現！","enemyDamage":"%1に %2 のダメージを与えた！","enemyDrain":"%1の%2を %3 奪った！","enemyGain":"%1の%2が %3 増えた！","enemyLoss":"%1の%2が %3 減った！","enemyNoDamage":"%1にダメージを与えられない！","enemyNoHit":"ミス！　%1にダメージを与えられない！","enemyRecovery":"%1の%2が %3 回復した！","escapeFailure":"しかし逃げることはできなかった！","escapeStart":"%1は逃げ出した！","evasion":"%1は攻撃をかわした！","expNext":"次の%1まで","expTotal":"現在の%1","file":"ファイル","levelUp":"%1は%2 %3 に上がった！","loadMessage":"どのファイルをロードしますか？","magicEvasion":"%1は魔法を打ち消した！","magicReflection":"%1は魔法を跳ね返した！","meVolume":"ME 音量","obtainExp":"%1 の%2を獲得！","obtainGold":"お金を %1\\G 手に入れた！","obtainItem":"%1を手に入れた！","obtainSkill":"%1を覚えた！","partyName":"%1たち","possession":"持っている数","preemptive":"%1は先手を取った！","saveMessage":"どのファイルにセーブしますか？","seVolume":"SE 音量","substitute":"%1が%2をかばった！","surprise":"%1は不意をつかれた！","useItem":"%1は%2を使った！","victory":"%1の勝利！"}
	};

	// ----- Translated values -----

	/* If you need to translate not only Terms but also other obejct names, please use this section.
	 *
	 * You can use String, String list or Object in each list_* Array.
	 *	String - It overwrites the name attribute of the target data object.
	 *	String list - Its elements overwrite the target data object. It depends on target type.
	 *		Actor: name, nickname, profile, note
	 * 		Others: name, description, note
	 *	Object - Its attributes overwrite the target data object.
	 *
	 * Hint: The object's "id" attribute will affect the fetch function.
	 * 	It means you can skip elements with id attribute, as follows;
	 * 	var list_actors = ["name of 1st actor", {"name":"name of 100th actor","id":100}, ["name of 101th actor,nickname of 101th actor"]];
	*/

	M._actors = [
	//	"ハロルド",
	//	"セレス",
	//	"マーシャ",
	//	"ルシウス"
	];

	M._classes = [
	//	"勇者",
	//	"戦士",
	//	"魔法使い",
	//	"僧侶"
	];

	M._items = [];
	M._weapons = [];
	M._armors = [];
	M._enemies = [];
	M._troops = [];
	M._skills = [];
	M._states = [];
})(this);

