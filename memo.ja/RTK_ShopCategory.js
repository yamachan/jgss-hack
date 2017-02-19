//=============================================================================
// RTK_ShopCategory.js	2017/02/19
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc ショップにカテゴリ選択を追加する
 * @author Toshio Yamashita (yamachan)
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *    https://github.com/yamachan/jgss-hack/blob/master/memo.ja/201702-window2.md
 */

(function(_global) {
	// ここにプラグイン処理を記載
	var cat_h = 64;
	var my_select = 0;
	var my_scene;

	// ----- MyWindow : New class -----

	function MyWindow() {
		this.initialize.apply(this, arguments);
	}

	MyWindow.prototype = Object.create(Window_HorzCommand.prototype);
	MyWindow.prototype.constructor = MyWindow;

	MyWindow.prototype.initialize = function(width, y) {
		this._windowWidth = width;
		Window_HorzCommand.prototype.initialize.call(this, 0, y);
	};
	MyWindow.prototype.windowWidth = function() {
		return this._windowWidth;
	};
	MyWindow.prototype.maxCols = function() {
		return 3;
	};
	MyWindow.prototype.makeCommandList = function() {
		this.addCommand(TextManager.item,    'item');
		this.addCommand(TextManager.weapon,   'weapon');
		this.addCommand(TextManager.armor, 'armor');
	};
	MyWindow.prototype.select = function(index) {
		var ret = Window_Selectable.prototype.select.call(this, index);
		my_select = index < 0 ? my_select : index;
		my_scene._buyWindow.refresh();
		return ret;
	};

	// ----- Window_ShopBuy : Over write -----

	Window_ShopBuy.prototype.initialize = function(x, y, height, shopGoods) {
		var width = this.windowWidth();
		y += cat_h;
		height -= cat_h;
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this._shopGoods = shopGoods;
		this._money = 0;
		this.refresh();
		this.select(0);
	};
	Window_ShopBuy.prototype.makeItemList = function() {
		this._data = [];
		this._price = [];
		this._shopGoods.forEach(function(goods) {
			var item = null;
			if (my_select == goods[0]) {
				switch (goods[0]) {
					case 0:
						item = $dataItems[goods[1]];
						break;
					case 1:
						item = $dataWeapons[goods[1]];
						break;
					case 2:
						item = $dataArmors[goods[1]];
						break;
				}
			}
			if (item) {
				this._data.push(item);
				this._price.push(goods[2] === 0 ? item.price : goods[3]);
			}
		}, this);
	};

	// ----- Scene_Shop : Over write -----

	var _Scene_Shop_create = Scene_Shop.prototype.create;
	Scene_Shop.prototype.create = function() {
		var ret = _Scene_Shop_create.call(this);
		this.createMyWindow();
		return ret;
	};
	Scene_Shop.prototype.createMyWindow = function() {
		my_scene = this;
		this._myWindow = new MyWindow(456, this._statusWindow.y);
		this._myWindow.hide();
		this._myWindow.setHandler('item', this.onMyWindowSelect.bind(this));
		this._myWindow.setHandler('weapon', this.onMyWindowSelect.bind(this));
		this._myWindow.setHandler('armor', this.onMyWindowSelect.bind(this));
		this._myWindow.setHandler('cancel', this.onMyWindowCancel.bind(this));
		this.addWindow(this._myWindow);
	}
	Scene_Shop.prototype.onMyWindowSelect = function() {
		this._myWindow.deselect();
		this._buyWindow.select(0);
		this._buyWindow.activate();
	};
	Scene_Shop.prototype.onMyWindowCancel = function() {
		this._commandWindow.activate();
		this._dummyWindow.show();
		this._buyWindow.hide();
		this._myWindow.hide();
		this._statusWindow.hide();
		this._statusWindow.setItem(null);
		this._helpWindow.clear();
	};

	Scene_Shop.prototype.activateBuyWindow = function() {
		this._buyWindow.setMoney(this.money());
		this._buyWindow.show();
		this._buyWindow.deselect();
		this._myWindow.show();
		this._myWindow.activate();
		this._statusWindow.show();
	};
	Scene_Shop.prototype.onBuyCancel = function() {
		this._buyWindow.deselect();
		this._myWindow.select(my_select);
		this._myWindow.activate();
	};
	Scene_Shop.prototype.endNumberInput = function() {
		this._numberWindow.hide();
		switch (this._commandWindow.currentSymbol()) {
			case 'buy':
				this._buyWindow.show();
				this._buyWindow.activate();
				break;
			case 'sell':
				this.activateSellWindow();
				break;
		}
	};

})(this);
