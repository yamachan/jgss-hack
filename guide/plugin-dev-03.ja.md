[トップページに戻る](../README.ja.md) | [前回の入門](plugin-dev-02.ja.md)

# RPGツクールMV プラグイン作成入門 (3)

RPGツクールMV で利用する JavaScript ベースの Game Scripting System (JGSS) で記述したプラグイン作成のための入門資料っぽい何か、です。 JS(JavaScript)の基本知識がある方が対象です。

## 前回のまとめ

[作成入門 (1)](plugin-dev-01.ja.md) と [作成入門 (2)](plugin-dev-02.ja.md) では、アクターやエネミーの名前の後にIDを追加表示する、シンプルなプラグインを完成しました。  [RTK_ShowID.js](RTK_ShowID.js) で完成したソースコードを参照できます。

今回はプラグイン開発の際によく使う、Tips的な事柄を幾つか紹介します。

## グローバル変数の定義

これまで説明してきた範囲では、プラグインのコードは全て以下の関数スコープ内で記述してきました。 外部とはプラグインコマンドのみでやりとりしていました。

```js
(function(_global) {
  	// ここにプラグイン処理を記載
})(this);
```

しかしプラグインの提供するサービスによっては、関数や変数値に直接アクセスできたほうが便利なことがあります。 この場合にはあえて、グローバル変数として定義します。

グローバル変数の場合、他プラグインとの競合を避けるためにも、ユニークな名前付けが重要です。 しかし多くのユニークな名前を考えるのは大変なので、通常は 「ひとつのユニークなグローバル変数(オブジェクト)」 を定義します。 そして提供する関数や変数は、そのグローバルオブジェクトの要素として実装していきます。

例えば僕の作成しているJGGSプラグインは、全てファイル名が RTK で始まります。 そして共通で RTK というグローバル変数を定義し、利用するようにしています。 いまのところ RTK が他のプラグインと被ったことはないですし、もしこれから多くの方に使っていただけるとしたら、将来も被る危険性は少なそうです。

また通常、同じ名前のプラグインは同時に読み込まれませんので、プラグインと同名のグローバル変数を定義するのも良いでしょう。

今回はサンプルとして "RTK_Sample" というグローバルオブジェクトを定義してみます。 わかりやすいコードとしては、以下があるでしょう。

```js
var RTK_Sample = {};
(function(_global) {
  	// ここにプラグイン処理を記載
})(this);
```

またプラグイン処理と同じ場所に定義を記述することもできます。 \_global 変数が提供されていることを利用して、以下のように記載します。

```js
(function(_global) {
  	// ここにプラグイン処理を記載
    _global["RTK_Sample"] = {};
})(this);
```

更に細かく言えば、この同じ名前を他のプラグインで定義している可能性もゼロではないので、より安全なコードは以下になります。

```js
(function(_global) {
  	// ここにプラグイン処理を記載
    _global["RTK_Sample"] = _global["RTK_Sample"] || {};
})(this);
```

今回はより安全な、このコードを利用しましょう。

## 前提となるプラグインをチェックする

あるプラグインを作成するとき、事前に別のプラグインが導入されていることを前提とする場合があります。

例えば僕のアイテム・武器・防具の合成を実現するプラグイン [RTK1_Composite](../RTK1_Composite.ja.md) は、開発をサポートする [RTK1_Core](../RTK1_Core.ja.md) プラグインを前提としています。

RTK1_Core プラグインは RTK というグローバルオブジェクトを定義しますので、RTK1_Composite 側では、プラグインの最初で以下のように RTKオブジェクトの存在を確認しています。 もし存在していなければ、その旨をエラー処理(Errorオブジェクトを生成してthrowする)して終了するようになっています。

```js
  if (!_global["RTK"]) {
    throw new Error('This plugin requires RTK1_Core plugin previously.');
  }
```

ここは \_global 引数が役立つ場面で、以下のように単に if 文で存在チェックすると、RTK が存在しない場合に変数の未定義でエラーになってしまいます。

```js
  if (!RTK) {
    throw new Error('This plugin requires RTK1_Core plugin previously.');
  }
```

しかしこの方法は、グローバル領域に何か定義するプラグインを前提としています。 グローバル領域に何も痕跡を残さない「上品な」プラグインの場合には、検出に少し工夫が必要です。 まずは以下の関数をみてください。

```js
PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};
```

この関数から以下の3点がわかります。

* PluginManager.\_parameters にプラグインのパラメータが保存されている
* プラグイン名は小文字に変換されて参照に利用される
* PluginManager.parameters 関数はエラー時に空オブジェクト{}を返すので確認には不向き

よい機会ですから、上記の関数をベースに、プラグインの導入を確認する関数に書き換えてみましょう。 そして今回のプラグインでその関数を提供してみましょう。

```js
(function(_global) {
  	// ここにプラグイン処理を記載
    _global["RTK_Sample"] = _global["RTK_Sample"] || {};
    RTK_Sample.hasPlugin = function(_name){
      return !!PluginManager._parameters[_name.toLowerCase()];      
    }
})(this);
```

この関数(RTK_Sample.hasPlugin)を使えば、前提となるプラグインが導入済みかどうかを簡単に調べることができます。 前回作成した RTK_ShowID プラグインが導入されているかどうかを、コンソールから確認してみましょう。

![Screen shot - console](i/plugin-dev-03-01.png)

## 制御文字を使いたい、にもいろいろある

イベントでメッセージを表示するとき、制御文字って便利ですよね。 でも制御文字って使える場所が限られていて 「ここの場所でも使いたい！」 って要望がよくあります。 最近ですと某掲示板で

> マップ表示名に制御文字\\n[n]を使いたい

というご要望があがったりしていました。

内部的に、制御文字を使える場合は drawTextEx() 関数、使えない場合は drawText() 関数が使われているようです。 なので該当の部分だけ、drawTextEx() 関数を使用してあげれば、たいてい解決したりします。

極端な話、マップ表示名に制御文字を使いたいだけであれば、以下の一行でもいちおう動作したりはします。 いや、動作するように見えなくもないです。

```js
Window_MapName.prototype.drawText = Window_MapName.prototype.drawTextEx;
```

記法のマナーとか以前に、実はこの2つの関数に互換性はありません。 それぞれの引数を比べると違いがわかります。

```js
Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

Window_Base.prototype.drawTextEx = function(text, x, y) {
    // 定義は省略
};
```

実際にマップ名の表示をしている部分を参照すると、問題点がはっきりしますね。 drawText() 関数を drawTextEx() 関数に置き換えるだけだと、align が無いので表示文字列がセンタリング(中央に寄せて表示)されないのです。

```js
Window_MapName.prototype.refresh = function() {
    this.contents.clear();
    if ($gameMap.displayName()) {
        var width = this.contentsWidth();
        this.drawBackground(0, 0, width, this.lineHeight());
        this.drawText($gameMap.displayName(), 0, 0, width, 'center');
    }
};
```

さて、ここで対応策を考えましょう。 元の依頼は \\n[n] を使いたい、つまりは値の置き換えを使いたがっています。 複雑な表示制御ではありません。

drawTextEx() 関数の処理を追いかけると、値の置き換えを実行してくれる関数があることに気がつきます。

```js
Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};
```

これをさきほどの refresh 関数に組み込んでみましょう。

```js
Window_MapName.prototype.refresh = function() {
    this.contents.clear();
    if ($gameMap.displayName()) {
        var width = this.contentsWidth();
        this.drawBackground(0, 0, width, this.lineHeight());
        this.drawText(this.convertEscapeCharacters($gameMap.displayName()), 0, 0, width, 'center');
    }
};
```

これでご要望に応え、マップ名表示で制御文字が使えるようになりました！ 最初の一歩としては上出来ではないでしょうか？

### さらにその先へ？

さきほどの 「マップ名表示で制御文字が使える」 お題、確かに動作に問題はありません。 しかし 「マナーの良い」 競合しないプラグインを考えた場合、ちょっとだけ気になることがあります。

そう、さきほどの例では refresh 関数を置きかえていました。 どうしても仕方ない場合を除き、関数の置き換えはなるべく避けたいものです。 なんとかならないでしょうか？

こういった場合には注目すべきポイントがありまして、「書き換えた部分に最も近い部分」 が利用可能なことがおおいです。 今回は drawText() 関数が近いですね。 うまく利用できないでしょうか？

以下のように利用しちゃいましょう。

```js
var _Window_MapName_drawText = Window_MapName.prototype.drawText;
Window_MapName.prototype.drawText = function(text, x, y, maxWidth, align) {
    text = this.convertEscapeCharacters(text);
    return _Window_MapName_drawText.call(this, text, x, y, maxWidth, align);
};
```

これであれば既存の関数の置き換えはせず、拡張だけで済んでしまいます。 より競合しにくい 「マナーの良い」 コードだと言えそうです。

### さらにさらにその先へ？

マナーを気にすると、更に先があります。 しかしここまで必要かどうかは、個人の価値観に依存するような気もします… このセクションは話半分で流し読んでください。 お好きな方のみ楽しんでください。

さきほどのコードは確かにマップ名表示では競合しなさそうですが、まだ心配があります。 Window_MapName クラスが他で利用されていないか、ということです。

ちょっとした1行のテキストを表示できる機能は便利なので、マップ名表示以外に使っている場合があるかもしれません。 またこのクラスを継承して、自分なりの表示クラスを定義する方もいるでしょう。 つまり Window_MapName というクラスを自分が勝手に変更して本当に誰にも迷惑をかけないか、という非常にレアな心配をするわけです。

そんな小心者の方、まあ僕もそうですが、以下のような利用する側のコードも検討しては如何でしょうか？

```js
Scene_Map.prototype.createMapNameWindow = function() {
    this._mapNameWindow = new Window_MapName();
    this.addChild(this._mapNameWindow);
};
```

これに以下のように追加すれば、さきほどと同じ効果が発揮できます。

```js
var _Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow;
Scene_Map.prototype.createMapNameWindow = function() {
    _Scene_Map_createMapNameWindow.call(this);
    this._mapNameWindow.drawText = function(text, x, y, maxWidth, align) {
      text = this.convertEscapeCharacters(text);
      return Window_MapName.prototype.drawText.call(this, text, x, y, maxWidth, align);
    }
};
```

変なコードですか？ マナー気にしすぎ開発者の裏技 「インスタンスでの関数置き換え」 を使ってます。 確かに少しマニアックなコードではあります。

Window_MapName.prototype.drawText　を変更すると、Window_MapName クラスを利用する全てに影響します。 ならばクラスは変更せず、インスタンスを生成するまで待って、そのインスタンスだけを変更してしまえ！という技です。

例えばタイ焼きの金型があって、100個のタイ焼きを作るとします。 ちょっとデザインを変えたい場合、金型を変えてしまうと100個全てのタイ焼きが影響されます。 そこで実際にタイ焼きを焼いてしまい、1個のタイ焼きに対して目的の修正をしてしまいます。 …あまり良い例えではないですかね。

まあともかく、これでマップ画面で使われる Window_MapName に限り、制御文字に対応することが可能になったわけです。 他で Window_MapName を使っても影響はゼロです。

うーむ、やはりマニアックすぎて、入門っぽくなくなってしまいましたね… 次回から気をつけたいとおもいます。

## 今回のコード

今回、ご紹介したプラグインのコードをあわせると、以下のようになります。

```js
//=============================================================================
// RTK_Test.js	2016/07/31
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc テスト用プラグイン
 * @author Toshio Yamashita (yamachan)
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * テスト用に作成したものなので、実際に利用する場合には適当にリネームしてください
 */

(function(_global) {
	// ここにプラグイン処理を記載
	var N = 'RTK_Test';
	var param = PluginManager.parameters(N);

	_global["RTK_Sample"] = _global["RTK_Sample"] || {};
	RTK_Sample.hasPlugin = function(_name){
		return !!PluginManager._parameters[_name.toLowerCase()];      
	}

	var _Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow;
	Scene_Map.prototype.createMapNameWindow = function() {
		_Scene_Map_createMapNameWindow.call(this);
		this._mapNameWindow.drawText = function(text, x, y, maxWidth, align) {
			text = this.convertEscapeCharacters(text);
			return Window_MapName.prototype.drawText.call(this, text, x, y, maxWidth, align);
		}
	};
})(this);
```

ではまた！

[トップページに戻る](../README.ja.md) | [前回の入門](plugin-dev-02.ja.md)
