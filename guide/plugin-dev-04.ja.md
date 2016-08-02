[トップページに戻る](../README.ja.md) | [前回の入門](plugin-dev-03.ja.md) | [次回の入門](plugin-dev-05.ja.md)

# RPGツクールMV プラグイン作成入門 (4)

RPGツクールMV で利用する JavaScript ベースの Game Scripting System (JGSS) で記述したプラグイン作成のための入門資料っぽい何か、です。 JS(JavaScript)の基本知識がある方が対象です。

## これまでの入門

[作成入門 (1)](plugin-dev-01.ja.md) と [作成入門 (2)](plugin-dev-02.ja.md) では、アクターやエネミーの名前の後にIDを追加表示する、シンプルなプラグインを完成しました。  [RTK_ShowID.js](RTK_ShowID.js) で完成したソースコードを参照できます。

[作成入門 (3)](plugin-dev-03.ja.md) ではグローバル変数の定義を説明し、前提となるプラグインをチェックする関数を定義してみて、また制御文字を使えるようにする拡張について説明しました。

今回はプラグイン開発の環境に特有の、JavaScript言語の拡張のうち便利そうなものを幾つか紹介します。 今後も発見したものは追記していきますね。

## JavaScript言語の拡張について

JavaScript言語では、標準で用意されたオブジェクトの拡張も可能です。 それを提供するプラグインも数多く存在します。

開発対象におけるこれらの拡張は、その対象にあった便利なものが多く、理解してうまく利用すれば開発効率がぐっと向上します。 ある程度慣れたJavaScriptプログラマであれば、開発対象における言語拡張の有無とその詳細は、最初にチェックする重要な項目だったりします。

RPGツクールMVの開発環境においても、js フォルダにある rpg_core.js が基本オブジェクトの拡張をしています。 順にみていきましょう。

## Number クラスの拡張

数値を扱う Number クラスには、以下のような関数が追加定義されています。

| 関数名と引数 | 概要 | 利用例 |
| --- | --- | --- |
| clamp(min, max) | 数値の範囲を限定する | (6).clamp(1,5) => 5<br>(0).clamp(1,5) => 1 |
| mod(n) | 数値の剰余をとる | (105).mod(100) => 5 |
| padZero(length) | 指定した長さになるまで0で埋めた文字列にする | (11).padZero(5) => "00011" |

## String クラスの拡張

文字列を扱う String クラスには、以下のような関数が追加定義されています。

| 関数名と引数 | 概要 | 利用例 |
| --- | --- | --- |
| format(v1, v2 ,,,) | %で指定した位置に値を代入する | "%1 is %2 years old".format("Harold", 14) => "Harold is 14 years old" |
| padZero(length) | 指定した長さになるまで0で埋める | "11".padZero(5) => "00011" |
| contains(string) | 指定した文字列が含まれるか確認 | "abcde".contains("bc") => true<br>"abcde".contains("ce") => false |

## Array クラスの拡張

配列を扱う Array クラスには、以下のような関数が追加定義されています。

| 関数名と引数 | 概要 | 利用例 |
| --- | --- | --- |
| equals(array) | 配列の中身が同じかどうか確認する<br>配列を要素として含んでいる場合はそれも再帰的に比較 | [1,2].equals([1,2]) => true<br>[1,[2,3]].equals([1,[2,3]]) => true<br>[1,[2,3]].equals([1,[2,4]]) => false |
| clone() | 配列のコピーを作成する<br>浅いコピーで含まれるオブジェクトまでは複製しない | [1,[2,3]].clone() => [1,[2,3]]<br>この場合含まれる[2,3]は元の要素と同じオブジェクトになる |
| contains(element) | 指定した要素が配列に含まれるか確認 | [1,2,3].contains(2) => true<br>[1,2,3].contains(5) => false |

## データ処理に便利な関数

以下のようにデータ形式を変換したり、圧縮したりする関数も用意されています。

| 関数名と引数 | 概要 | 利用例 |
| --- | --- | --- |
| JsonEx.stringify(object) | オブジェクトをJSON文字列に変換する | JsonEx.stringify({"value":1,"flag":true}) => '{"value":1,"flag":true}' |
| JsonEx.parse(json) | JSON文字列をオブジェクトに変換する | 上記の逆変換 |
| JsonEx.makeDeepCopy(object) | 対象オブジェクトをコピーする<br>深いコピーで含まれるオブジェクトも複製する | JsonEx.makeDeepCopy([1,[2,3]]) => [1,[2,3]]<br>この場合含まれる[2,3]は元の要素とは異なったオブジェクトになる |
| LZString.compress(string) | 文字列を圧縮する | LZString.compress("source string") => 圧縮された文字列 |
| LZString.decompress(string) | 上記の逆変換 |LZString.decompress(圧縮された文字列) => "source string" |
| LZString.compressToEncodedURIComponent(string) | 文字列を圧縮しBase64表現に変換する<br>この表記はURLパラメータに指定するのに適しています | LZString.compressToEncodedURIComponent("source string") => "M4ewrgTgxgpgBMALhAlgOwOZAAA$" |
| LZString.decompressFromEncodedURIComponent(string) | 上記の逆変換 | LZString.decompressFromEncodedURIComponent("M4ewrgTgxgpgBMALhAlgOwOZAAA$") => "source string" |
| LZString.compressToBase64(string) | 文字列を圧縮しBase64表現に変換する<br>この表記はテキストメッセージに追加するのに適しています | LZString.compressToBase64("source string") => "M4ewrgTgxgpgBMALhAlgOwOZAAA=" |
| LZString.decompressFromBase64(string) | 上記の逆変換 | LZString.decompressFromBase64("M4ewrgTgxgpgBMALhAlgOwOZAAA=") => "source string" |

## その他 便利な値や関数

| 関数名と引数 | 概要 | 利用例 |
| --- | --- | --- |
| Math.randomInt(max) | 0からmax-1までの範囲の乱数を整数値で返す | Math.randomInt(max) => 0か1か2 |
| Utils.RPGMAKER_NAME | RPGツクールの名称を返す | Utils.RPGMAKER_NAME => 'MV' |
| Utils.RPGMAKER_VERSION | RPGツクールのバージョンを返す | Utils.RPGMAKER_VERSION => "1.2.0" |
| Utils.isMobileDevice() | モバイル環境なら true を返す | |
| Utils.isMobileSafari() | Mobile Safari環境なら true を返す | |
| Utils.isAndroidChrome() | Android Chrome環境なら true を返す | |
| Utils.rgbToCssColor(r, g, b) | CSSの色指定文字列を作成する | Utils.rgbToCssColor(1,2,3) => "rgb(1,2,3)" |
| Bitmap.snap(stage) | ゲーム画面をキャプチャしてbitmap画像を返す | Bitmap.snap(SceneManager._scene) => 新規作成されたゲーム画面のbitmapオブジェクト |

## 便利なシステム変数や関数

プラグイン中でよく参照する、ゲーム内のシステム変数や関数をまとめておきます。

| 関数名と引数 | 概要 | 利用例 |
| --- | --- | --- |
| DataManager.isBattleTest() | バトルテストの時に true を返す |  |
| DataManager.isEventTest() | イベントテストの時に true を返す |  |
| SceneManager._scene | 現在の Scene オブジェクト |  |

## 最後に

今回はちょっと短いですが、情報は引き続き更新していきます。 見つけた便利な関数などは順次紹介していきますね！

[トップページに戻る](../README.ja.md) | [前回の入門](plugin-dev-03.ja.md) | [次回の入門](plugin-dev-05.ja.md)
