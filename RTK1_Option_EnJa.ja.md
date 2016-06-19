[English version](RTK1_Option_EnJa.md)

# [RTK1_Option_EnJa](RTK1_Option_EnJa.js) プラグイン

RPGツクール MV 用に作成した、英語/日本語環境の切り替えを実現するプラグインです。

ダウンロード: [RTK1_Option_EnJa.js](https://raw.githubusercontent.com/yamachan/jgss-hack/master/RTK1_Option_EnJa.js)

## 概要

私は英語版のRPG Maker MVを利用していますが、自作のゲームを英語が苦手な息子にプレイして貰うためこのプラグインを作成してみました。 組み込むだけでシステム部分の言語を簡単に切り替えできるようになりますので、ぜひ利用してみてください。

[RTK1_Core プラグイン](RTK1_Core.jp.md) を前提としていますので、先に読み込んでください。

![Screen shot - Pligin Manager](i/RTK1_Option_EnJa-01.png)

パラメータは全て 0 のまま特に変更する必要はありません。

![Screen shot - Plugin](i/RTK1_Option_EnJa-02.png)

これで完了です！

オープニング画面、もしくはゲーム中にあるオプションから、英語/日本語の切り替えが可能になります。 システムが用意した基本的な用語が切り替わります。

![Screen shot - Game option](i/RTK1_Option_EnJa-03.png)

英語モードでの動作例がこちら。

![Screen shot - Game english](i/RTK1_Option_EnJa-04.png)

日本語モードでの動作例がこちら。

![Screen shot - Game japanese](i/RTK1_Option_EnJa-05.png)

システム部分だけでは物足りない、アバター名やゲーム中のメッセージも英語化/日本語化したい！と望まれるのであれば、以下の拡張方法を読んでみてください。

## switch パラメータ

英語/日本語どちらが選択されているか、ゲーム中に参照したい場合には switch パラメーターを利用します。 例えば英語モードの時は英語のメッセージを、日本語のときは日本語のメッセージを表示したい場合などに便利です。

プラグイン設定で switch パラメーターに 0 以外の値を設定してください。 以下の例では 8 を指定しています。

![Screen shot - Parameter](i/RTK1_Option_EnJa-06.png)

この設定した値に対応するスイッチが、言語状態に連動して変化します。 日本語環境なら ON になり、英語環境なら OFF になります。

そして、指定した8番目のスイッチにわかりやすい名前 (例: Japanese_Mode) を付けておきましょう。

![Screen shot - Switch Selector](i/RTK1_Option_EnJa-07.png)

そしてイベントの条件分岐で8番目のスイッチ(Japanese_Mode)を利用してメッセージの内容を変化させます。

![Screen shot - Event](i/RTK1_Option_EnJa-08.png)

日本語モードでの動作例がこちら。

![Screen shot - Event japanese](i/RTK1_Option_EnJa-10.png)

英語モードでの動作例がこちら。

![Screen shot - Event english](i/RTK1_Option_EnJa-11.png)

小規模なゲームであれば、この方法でゲーム内のメッセージ等の英語/日本語対応するのがわかりやすくて良いでしょう。

## 言語切り替え用 プラグインコマンド

言語の切り替え用のプラグインコマンドを用意しました。 英語モードに切り替えるには以下のどちらかを使用します。

* RTK1_Option_EnJa english
* RTK1_Option_EnJa en

日本語モードに切り替えるには以下のどちらかを使用します。

* RTK1_Option_EnJa japanese
* RTK1_Option_EnJa ja

以下はこれらを利用したイベントの例です。 金髪の女性に話しかけると、言語の切り替えをするかどうか質問されます。 さきほど説明したスイッチも利用しています。

![Screen shot - Event](i/RTK1_Option_EnJa-12.png)

以下が日本語モードでの実行画面です。 「はい」と答えるとプラグインコマンドを使用して英語モードに切り替えます。

![Screen shot - Event japanese](i/RTK1_Option_EnJa-13.png)

以下が英語モードでの実行画面です。 「Yes」と答えるとプラグインコマンドを使用して日本語モードに切り替えます。

![Screen shot - Event english](i/RTK1_Option_EnJa-14.png)

## hide パラメータ

勝手に言語を変更されて困る場合には、メニューから隠す...(書き途中)

## ゲームデータの拡張

アクター名やクラス名などの日本語化... (書き途中)

![Screen shot - Game japanese](i/RTK1_Option_EnJa-09.png)

## ゲームデータの拡張に関する注意点

イベントでアバターの名前やニックネームを変更する場合に注意が必要... (書き途中)

## message パラメータ

メッセージ表示の拡張... (書き途中)

## 辞書管理用 プラグインコマンド


## ライセンス

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php) です。

提供されるjsファイルからコメント等を削除しないのであれば、著作権表示は不要です。 むろん表示いただくのは歓迎します！
