//=============================================================================
// RTK1_MapLocalVariables.js  ver1.15 2016/07/17
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Use selected variables as map local ones
 * @author Toshio Yamashita (yamachan)
 *
 * @param start number
 * @desc ID of the first one in the map local variables
 * @default 0
 *
 * @param end number
 * @desc ID of the last one in the map local variables
 * @default 0
 *
 * @help
 * Plugin to use selected variables as map local ones
 * This plugin requires RTK1_Core plugin (1.14 or later) previously.
 *
 * Plugin Command:
 *   RTK1_MapLocalVariables clear	# Clear all map local variables by 0
 *   RTK1_MapLocalVariables recover	# Recover all map local variables to the map entry
 *
 * Script or Script value:
 *  RTK.MLV.get(#n)			# Get value of #n th map local variable
 *  RTK.MLV.set(#n, #value)		# Set value of #n th map local variable
 *  RTK.MLV.clear()			# Clear all map local variables by 0
 *  RTK.MLV.clear(#s,#e)		# Clear all map local variables from #s to #e by 0
 *  RTK.MLV.recover()			# Recover all map local variables to the map entry
 *
 * Manual:
 *   https://github.com/yamachan/jgss-hack/blob/master/RTK1_MapLocalVariables.md
 */

/*:ja
 * @plugindesc 指定した範囲のゲーム変数をマップローカル変数として利用する
 * @author Toshio Yamashita (yamachan)
 *
 * @param start number
 * @desc マップローカル変数に使用する範囲の最初のID
 * @default 0
 *
 * @param end number
 * @desc マップローカル変数に使用する範囲の最後のID
 * @default 0
 *
 * @help
 * RPGツクール MV 用に作成した、マップローカル変数を実現するプラグインです。
 * このプラグインの前に RTK1_Core プラグイン(1.14以降)を読み込んでください。
 *
 * プラグインコマンド:
 *   RTK1_MapLocalVariables clear	# マップローカル変数を0クリアする
 *   RTK1_MapLocalVariables recover	# マップローカル変数を今回のマップ起動時の状態に戻す
 *
 * 利用できるスクリプトおよびスクリプト値:
 *  RTK.MLV.get(#n)			# マップローカル変数 n番目の値を得る
 *  RTK.MLV.set(#n, #value)		# マップローカル変数 n番目に #value を設定する
 *  RTK.MLV.clear()			# マップローカル変数を0クリアする
 *  RTK.MLV.clear(#s, #e)		# マップローカル変数 #s～#e 番目を0クリアする
 *  RTK.MLV.recover()			# マップローカル変数を今回のマップ起動時の状態に戻す
 *
 * マニュアル:
 *   https://github.com/yamachan/jgss-hack/blob/master/RTK1_MapLocalVariables.ja.md
 */


(function(_global) {
	"use strict";
	if (!_global["RTK"]) {
		throw new Error('This plugin requires RTK1_Core plugin previously.');
	}
	if (RTK.VERSION_NO < 1.15) {
		throw new Error('This plugin requires version 1.15 or later of RTK1_Core plugin. the current version looks ' + RTK.VERSION_NO + ".");
	}

	var N = "RTK1_MapLocalVariables";
	var NK = "RTK_MLV";
	var M = RTK["MLV"] = RTK._modules[N] = {};

	var param = PluginManager.parameters(N);
	M._start = Number(param['start number'] || "0");
	M._end = Number(param['end number'] || "0");
	M._data = M._data || {};
	M._id = 0;
	M._info = null;

	if (M._start < 1 || M._end < 1 || M._start > M._end) {
		return;  // will not affect the game :-)
	}

	M.save = function(_id) {
		_id = _id || M._id;
		if (_id > 0 && $dataMapInfos[_id]) {
			var start = M._start;
			for (var l=M._start; l<=M._end; l++) { // Skip head 0 values
				if ($gameVariables.value(l) != 0) {
					break;
				}
				start++;
			}
			var list = [];
			for (var l=start; l<=M._end; l++) {
				list.push($gameVariables.value(l));
			}
			while (list.length > 0 && list[list.length - 1] == 0) { // Remove tail 0 values
				list.pop() ;
			}
			if (list.length < 1) {
				delete M._data["s" + _id];
				delete M._data[String(_id)];
				return 0;
			}
			if (start == M._start) {
				delete M._data["s" + _id];
			} else {
				M._data["s" + _id] = start;
			}
			M._data[String(_id)] = list;
			return list.length;
		}
		return -1;
	};
	M.clear = function(_start, _end) {
		_start = _start || M._start;
		_end = _end || M._end;
		for (var l=_start; l<=_end; l++) {
			$gameVariables.setValue(l, 0);
		}
	}
	M.recover = function(_id) {
		_id = _id || M._id;
		if (_id > 0 && $dataMapInfos[_id]) {
			var start = Math.max(M._data["s" + _id]||0, M._start);
			var list = M._data[String(_id)];
			M.clear(M._start, M._end);
			if (start > 0 && start <= M._end && list) {
				for (var l=start; l<=M._end; l++) {
					$gameVariables.setValue(l, list[l - start]);
				}
				return M._end - start + 1;
			} else {
				return 0;
			}
		}
		return -1;
	}
	M.get = function(_no, _id) {
		_id = _id || M._id;
		if (_id == M._id) {
			return $gameVariables.value(M._start - 1 + _no);
		} else {
		}
	}
	M.set = function(_no, _value, _id) {
		_id = _id || M._id;
		if (_id == M._id) {
			$gameVariables.setValue(M._start - 1 + _no, _value);
		} else {
		}
	}

	RTK.onMapStart(function(_id){
		if (M._id != _id && $dataMapInfos[_id]) {
			if (M._id > 0) {
				M.save(M._id);
			}
			M._id = _id;
			M._info = $dataMapInfos[_id];
			M.recover();
		}
		RTK.log(N + " mapStart [" + _id + "]");
	});

	RTK.onLoad(function(){
		M._data = RTK.load(NK + "_data") || M._data;
		RTK.log(N + " load (_data)", M._data);
	});
	RTK.onSave(function(){
		if (M._id > 0) {
			M.save(M._id);
		}
		RTK.save(NK + "_data", M._data);
		RTK.log(N + " save (_data)", M._data);
	});

	M.command = function(args) {
		if (args[0] == "clear") {
			M.clear();
		} else if (args[0] == "recover") {
			M.recover();
		}
		RTK.log(N + " command (" + args.join(" ") + ")");
	};
	RTK.onCall(N, M.command.bind(this));
})(this);

/* 実装予定メモ
 *   RTK1_MapLocalVariables clear 1-3	# マップローカル変数 1～3 番目を0クリアする (実装中)
 *  RTK.MLV.get(n, #map)		# IDが #map である他のマップの マップローカル変数 n番目の値を得る (実装中)
 *  RTK.MLV.set(n, #value, #map)	# IDが #map である他のマップの マップローカル変数 n番目 #value を設定する(実装中)


 */
