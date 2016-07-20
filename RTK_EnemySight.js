//=============================================================================
// RTK_EnemySight.js  ver1.02 2016/07/20
//=============================================================================

/*:
 * @plugindesc Set switch when map event see the player
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag name
 * @desc Tag name used in Event's note.
 * @default sight
 *
 * @param followers
 * @desc Follwers are also found by enemies (0:OFF 1:ON)
 * @default 0
 *
 * @param sight through
 * @desc Event can sight through the blocks (0:OFF 1:ON)
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 *
 * Event Note:
 *   <sight:n,s>	# Switch s is ON when event see player within n
 *			# n : eyeshot max (# of Tiles)
 *			# s : A-D (self switch), 1-999 (switch)
 */

/*:ja
 * @plugindesc マップでイベントがプレイヤーを見かけるとスイッチをON
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag name
 * @desc イベントのメモ欄で使用するタグ名
 * @default sight
 *
 * @param followers
 * @desc フォロワーも発見の対象になる (0:OFF 1:ON)
 * @default 0
 *
 * @param sight through
 * @desc 障害物を透視してプレイヤーが見えてしまう (0:OFF 1:ON)
 * @default 0
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * イベントのメモ:
 *   <sight:n,s>	# 距離n以内にプレイヤーを発見するとsスイッチがON
 *			# n : 距離 (タイル単位)
 *			# s : A-D (セルフスイッチ), 1-999 (スイッチ)
 *
 * 解説ページ:
 * https://github.com/yamachan/jgss-hack/blob/master/RTK_EnemySight.ja.md
 */

//-----------------------------------------------------------------------------

(function(_global) {
	var N = 'RTK_EnemySight';

	var param = PluginManager.parameters(N);
	var tag_name = param['tag name'] || "sight";
	var followers = Number(param['followers'] || "0");
	var st = Number(param['sight through'] || "0");

	function _check(_d, _x, _y) {
		var dir = this._directionFix ? this._originalDirection : this._direction;
		switch (dir) {
		case 2: // down
			if (this.x == _x && this.y < _y && _y - this.y <= _d) {
				if (!st) {
					for (var y=this.y; y<_y - 1; y++) {
						if (!this.canPass(_x, y, dir)) { return false; }
					}
				}
				return true;
			}
			break;
		case 4: // left
			if (this.y == _y && _x < this.x && this.x - _x  <= _d) {
				if (!st) {
					for (var x=this.x; x>_x + 1; x--) {
						if (!this.canPass(x, _y, dir)) { return false; }
					}
				}
				return true;
			}
			break;
		case 6: // right
			if (this.y == _y && this.x < _x && _x - this.x <= _d) {
				if (!st) {
					for (var x=this.x; x<_x - 1; x++) {
						if (!this.canPass(x, _y, dir)) { return false; }
					}
				}
				return true;
			}
			break;
		case 8: // up
			if (this.x == _x && this.y > _y && this.y - _y <= _d) {
				if (!st) {
					for (var y=this.y; y>_y + 1; y--) {
						if (!this.canPass(_x, y, dir)) { return false; }
					}
				}
				return true;
			}
			break;
		};
		return false;
	};

	function _checkAll(_d) {
		var r = _check.call(this, _d, $gamePlayer.x, $gamePlayer.y);
		return r || (followers && $gamePlayer.followers()._data.some(function(f){
			return _check.call(this, _d, f.x, f.y);
		}, this));
	}

	var _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
	Game_Event.prototype.updateSelfMovement = function() {
		_Game_Event_updateSelfMovement.call(this);

		var m = this.event().meta[tag_name];
		if (m) {
			var r = m.match(/\s*(\d+),\s*([A-D])\s*/);
			if (r) {
				var k = [this._mapId, this._eventId, r[2]];
				if (!$gameSelfSwitches._data[k]) {
					if (_checkAll.call(this, Number(r[1]))) {
						$gameSelfSwitches.setValue(k, r);
					}
				}
				return;
			}
			r = m.match(/\s*(\d+),\s*(\d+)\s*/);
			if (r) {
				var k = Number(r[2]);
				if (!$gameSwitches.value(k)) {
					if (_checkAll.call(this, Number(r[1]))) {
						$gameSwitches.setValue(k, r);
					}
				}
			}
		}
	};
})(this);
