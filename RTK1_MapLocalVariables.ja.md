[English version](RTK1_MapLocalVariables.md)

# [RTK1_Shop](RTK1_MapLocalVariables.js) プラグイン

RPGツクール MV 用に作成した、標準のショップ機能を実現するプラグインです。

ダウンロード: [RTK1_Shop.js](https://raw.githubusercontent.com/yamachan/jgss-hack/master/RTK1_MapLocalVariables.js)

## 概要

[RTK1_Core プラグイン](RTK1_Core.ja.md) を前提としていますので、先に読み込んでください。 なるべく新しいバージョンをダウンロードして使うようにしてください。

![Screen shot - Pligin Manager](i/RTK1_MapLocalVariables-01.png)

パラメータの初期値は0になっていて、この状態だと本プラグインは無効になっています。

![Screen shot - Plugin](i/RTK1_MapLocalVariables-02.png)

## 基本的な使い方

まずはマップでローカルに使用する変数の範囲を決めてください。 このマニュアルでは変数 15 ～ 20 をマップローカル変数に利用することにします。

変数の範囲をプラグインパラメータで指定してください。

![Screen shot - Plugin](i/RTK1_MapLocalVariables-03.png)

それにあわせて、その範囲の変数にわかりやすい名前を付けておくことをお勧めします。 このマニュアルでは "Map local A" から "Map local F" まで名前を付けてみました。

![Screen shot - Plugin](i/RTK1_MapLocalVariables-04.png)

マップローカル変数は、マップごとに用意され、0以外の値はセーブファイルにも保存されます。 セーブファイルの肥大化を防ぐためにも、変数の数はあまり多く設定せず、また不要になった値は 0 クリアしておきましょう。

## マップローカル変数とは？

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

## 更新履歴

| バージョン | 公開日 | 必須ライブラリ | 更新内容 |
| --- | --- | --- | --- |
| ver1.15 | 2016/07/17 | [RTK1_Core](RTK1_Core.ja.md)<br>ver1.15 以降 | 公開 |

## ライセンス

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php) です。

提供されるjsファイルからコメント等を削除しないのであれば、著作権表示は不要です。 むろん表示いただくのは歓迎します！
