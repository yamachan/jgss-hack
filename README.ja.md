[English version](README.md)

# jgss-hack

RPGツクールMV と JavaScript ベースの Game Scripting System (JGSS) を対象とした私の勉強メモ、および作成したプラグインの保存・公開用の GitHub リポジトリです。

## RTK1系 プラグイン

| プラグイン | 説明ページ | 概要 |
|:-----------|:-----------:|:-------------|
| [RTK1_Core](RTK1_Core.js) | [英語](RTK1_Core.md) / [日本語](RTK1_Core.ja.md) | RTK1系ライブラリの基本(Core)部分 |
| [RTK1_Option_EnJa](RTK1_Option_EnJa.js) | [英語](RTK1_Option_EnJa.md) / [日本語](RTK1_Option_EnJa.ja.md) | オプションメニューで英語/日本語環境の切り替え |
| [RTK1_Composite](RTK1_Composite.js) | [英語](RTK1_Composite.md) / [日本語](RTK1_Composite.ja.md) | アイテム・武器・防具の合成メニュー＆ショップ |
| [RTK1_Shop](RTK1_Shop.js) | [英語](RTK1_Shop.md) / [日本語](RTK1_Shop.ja.md) | 標準のショップ機能を拡張<br>購入時のカテゴリ表示、価格の調整、販売リストの管理など |
| [RTK1_MapLocalVariables](RTK1_MapLocalVariables.js) | [英語](RTK1_MapLocalVariables.md) / [日本語](RTK1_MapLocalVariables.ja.md) | マップローカル変数を提供 |

## 単独 プラグイン

| プラグイン | 説明ページ | description |
|:-----------|:-----------:|:-------------|
| [RTK_TroopEncounter](RTK_TroopEncounter.js) | [日本語](RTK_TroopEncounter.ja.md) | マップでの敵との遭遇をコントロール |
| [RTK_VariablePacker](RTK_VariablePacker.js) | N/A | 変数をパック/アンパックするプラグインコマンド |
| [RTK_EnemySight](RTK_EnemySight.js) | [日本語](RTK_EnemySight.ja.md) | マップでイベントがプレイヤーを見かけるとスイッチをON |
| [RTK_EventMatch](RTK_EventMatch.js) | [日本語](RTK_EventMatch.ja.md) | マップでイベントの条件が全て揃うとスイッチをON |
| [RTK_ActorTraits](RTK_ActorTraits.js) | N/A | アクターに特徴を追加するプラグインコマンド |
| [RTK_ActionRate](RTK_ActionRate.js) | N/A | メモ欄のタグでアクションの成功レートを調整する |

## 資料

| タイトル | 概要 |
|:-----------|:-----------|
| [RPGツクールMV プラグイン作成入門 (1)](guide/plugin-dev-01.ja.md) | 簡単なプラグインを作成してみる<br>パラメータとコマンドを実装してみる |
| [RPGツクールMV プラグイン作成入門 (2)](guide/plugin-dev-02.ja.md) | 状態をセーブファイルに保存する<br>エネミーも対象にしてみる<br>プラグインとしてとりあえず完成させる |
| [RPGツクールMV プラグイン作成入門 (3)](guide/plugin-dev-03.ja.md) | グローバル変数の定義<br>前提となるプラグインをチェックする<br>制御文字を使いたい、にもいろいろある |
| [RPGツクールMV プラグイン作成入門 (4)](guide/plugin-dev-04.ja.md) | プラグイン開発の環境に特有のJavaScript言語の拡張のうち便利そうなものを幾つか紹介 |
| [RPGツクールMV プラグイン作成入門 (5)](guide/plugin-dev-05.ja.md) | 画面表示の仕組みを理解しよう |

## ライセンス

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php) です。

提供されるjsファイルからコメント等を削除しないのであれば、著作権表示は不要です。 むろん表示いただくのは歓迎します！
