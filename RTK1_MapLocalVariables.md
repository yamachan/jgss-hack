[Japanese version](RTK1_MapLocalVariables.ja.md)

# [RTK1_MapLocalVariables](RTK1_MapLocalVariables.js) Plugin

Plugin to use selected variables as map local ones for RPG Maker MV.

Download:  [RTK1_MapLocalVariables.js](https://raw.githubusercontent.com/yamachan/jgss-hack/master/RTK1_MapLocalVariables.js)

## Overview

This plugin depends on [RTK1_Core plugin](RTK1_Core.jp.md). Please include it before this plugin, as follows;

![Screen shot - Pligin Manager](i/RTK1_MapLocalVariables-01.png)

The default plugin parameters are 0, the plugin doesn't avtive in this setting.


![Screen shot - Plugin](i/RTK1_MapLocalVariables-02.png)

## Overview

まずはマップでローカルに使用する変数の範囲を決めてください。 このマニュアルでは変数 15 ～ 20 をマップローカル変数に利用することにします。

変数の範囲をプラグインパラメータで指定してください。

![Screen shot - Plugin](i/RTK1_MapLocalVariables-03.png)

それにあわせて、その範囲の変数にわかりやすい名前を付けておくことをお勧めします。 このマニュアルでは "Map local A" から "Map local F" まで名前を付けてみました。

![Screen shot - Plugin](i/RTK1_MapLocalVariables-04.png)

マップローカル変数は、マップごとに用意され、0以外の値はセーブファイルにも保存されます。 セーブファイルの肥大化を防ぐためにも、変数の数はあまり多く設定せず、また不要になった値は 0 クリアしておきましょう。

## How about map local variables?

マップローカル変数に指定しても、通常の変数とほとんど変わりません。イベントなどで同様に利用できます。ただし通常の変数に対し、以下の点が異なります。

* マップを移動するとマップローカル変数は値が変化します
  * そのマップに初めて入った時、マップローカル変数は全て0クリアされます
  * マップを移動する際、マップローカル変数はプラグインによって保存されます
  * そのマップに2度目以降に入った時、前回保存したマップローカル変数の値が復活します

基本的には、そのマップでしか使用しない値で、かつ保存される必要があるものをマップローカル変数に格納します。

## 理解のために

例えば、以下のように変数の値を表示するだけのシンプルなイベントを作成し、コピー＆ペーストで各マップに配置します。

![Screen shot - Event edit](i/RTK1_MapLocalVariables-05.png)

マップ上にゲーム変数を設定するイベントを追加し、上記のイベントで値を確認します。

![Screen shot - Event message](i/RTK1_MapLocalVariables-06.png)

そして異なったマップに移動し、変数が 0 クリアされているのを確認します。

![Screen shot - Event message](i/RTK1_MapLocalVariables-07.png)

そしてこの例のマップでは、左上のシスターに話しかけると変数 17 に 7 を設定するようになっています。 話しかけて結果を確認します。

![Screen shot - Event message](i/RTK1_MapLocalVariables-08.png)

これでふたつのマップを移動し、それぞれの看板で異なった変数値が表示されることを確認してください。 これらの値はセーブして再起動しても変わらないはずです。

これらの変数はマップごとに違った値を扱える別の存在になった、つまりはマップローカル変数になったということです。

## Update history

| version | date | require | update |
| --- | --- | --- | --- |
| ver1.15 | 2016/07/17 | [RTK1_Core](RTK1_Core.ja.md)<br>ver1.15 or later | Open |

## License

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php)

You don't need to display my copyright, if you keep my comments in .js files. Of course, I'll be happy, when you will display it. :-)
