//=============================================================================
// RTK_EnemySight.js  ver1.00 2016/07/02
//=============================================================================

/*:
 * @plugindesc Set switch when map event see the player
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag name
 * @desc Tag name used in Event's note.
 * @default sight
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
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * イベントのメモ:
 *   <sight:n,s>	# 距離n以内にプレイヤーを発見するとsスイッチがON
 *			# n : 距離 (タイル単位)
 *			# s : A-D (セルフスイッチ), 1-999 (スイッチ)
 */

//-----------------------------------------------------------------------------

(function(_global) {
	var N = 'RTK_Test';

	var param = PluginManager.parameters(N);
	var tag_name = param['tag name'] || "sight";

	var _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
	Game_Event.prototype.updateSelfMovement = function() {
		_Game_Event_updateSelfMovement.call(this);

		function _f(_d) {
			switch (this._directionFix ? this._originalDirection : this._direction) {
			case 2: // down
				if (this.x == $gamePlayer.x && this.y < $gamePlayer.y && $gamePlayer.y - this.y <= _d) {
					return true;
				}
				break;
			case 4: // left
				if (this.y == $gamePlayer.y && $gamePlayer.x < this.x && this.x - $gamePlayer.x  <= _d) {
					return true;
				}
				break;
			case 6: // right
				if (this.y == $gamePlayer.y && this.x < $gamePlayer.x && $gamePlayer.x - this.x <= _d) {
					return true;
				}
				break;
			case 8: // up
				if (this.x == $gamePlayer.x && this.y > $gamePlayer.y && this.y - $gamePlayer.y <= _d) {
					return true;
				}
				break;
			};
			return false;
		};

		var m = this.event().meta[tag_name];
		if (m) {
			var r = m.match(/\s*(\d+),\s*([A-D])\s*/);
			if (r) {
				var k = [this._mapId, this._eventId, r[2]];
				if (!$gameSelfSwitches._data[k]) {
					r = _f.call(this, Number(r[1]));
					if (r) {
						$gameSelfSwitches.setValue(k, r);
					}
				}
				return;
			}
			r = m.match(/\s*(\d+),\s*(\d+)\s*/);
			if (r) {
				var k = Number(r[2]);
				if (!$gameSwitches.value(k)) {
					r = _f.call(this, Number(r[1]));
					if (r) {
						$gameSwitches.setValue(k, r);
					}
				}
			}
		}
	};

})(this);
