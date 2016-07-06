//=============================================================================
// RTK1_TestSuite.js  ver1.11 2016/07/06
//=============================================================================

/*:
 * @plugindesc TestSuite for RTK1 library.
 * @author Toshio Yamashita (yamachan)
 *
 * @help
 * This plugin does not provide plugin commands.
 * Don't include this plugin in the production game.
 */


//-----------------------------------------------------------------------------

(function(_global) {
	if (!_global["RTK"]) {
		throw new Error('This plugin requires RTK1_Core plugin previously.');
	}
	if (RTK.VERSION_NO < 1.11) {
		throw new Error('This plugin requires version 1.08 or later of RTK1_Core plugin. the current version looks ' + RTK.VERSION_NO + ".");
	}

	var N = 'RTK1_TestSuite';
	RTK.TS = this;

	RTK.onReady(function(){
		RTK.log(N + " ready");
	});

	function func_testSuite(){

		RTK.log(N + " start ----- (" + RTK._aeCount + ")");

		RTK.log(N + " Basic Game Functions ----- (" + RTK._aeCount + ")");

		obj = RTK.id2object("i1");
		RTK.ae(true, DataManager.isItem(obj));
		RTK.ae(1,obj.id);

		id = RTK.object2id(obj);
		RTK.ae("i1", id);

		RTK.log(N + "   RTK.id4list -- (" + RTK._aeCount + ")");

		list = [];
		ret = RTK.id4list(RTK.ADD, list, "w1");
		RTK.ae(1, ret);
		RTK.ae("w1", list.join());
		ret = RTK.id4list(RTK.ADD, list, "i1-3");
		RTK.ae(3, ret);
		RTK.ae("w1,i1,i2,i3", list.join());
		ret = RTK.id4list(RTK.REMOVE, list, "i2");
		RTK.ae(-1, ret);
		RTK.ae("w1,i1,i3", list.join());
		ret = RTK.id4list(RTK.ADD, list, "a1,a3,a4");
		RTK.ae(3, ret);
		RTK.ae("w1,i1,i3,a1,a3,a4", list.join());
		ret = RTK.id4list(RTK.REMOVE, list, "a3-4");
		RTK.ae(-2, ret);
		RTK.ae("w1,i1,i3,a1", list.join());

		obj = RTK.id2object("w1");
		list = [];
		ret = RTK.id4list(RTK.ADD, list, ["i1","i2",obj]);
		RTK.ae(3, ret);
		RTK.ae("i1,i2,w1", list.join());

		RTK.log(N + " end ----- (" + RTK._aeCount + ")");
	}

	RTK.onStart(func_testSuite.bind(this));
})(this);

