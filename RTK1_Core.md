[Japanese version](RTK1_Core.ja.md)

# [RTK1_Core](RTK1_Core.js) Plugin

Core functions of RTK1 library for RPG Maker MV.

Download: [RTK1_Core.js](https://raw.githubusercontent.com/yamachan/jgss-hack/master/RTK1_Core.js)

## Overview

RTK1_Core Plugin is Core function library for RTK1　series plugins (RTK1_*.js). It includes some useful functions for development, so please feel free to use it.

![Screen shot - Pligin Manager](i/RTK1_Core-01.png)

The parameters are set by 0. Normally, you don't need to change it.

![Screen shot - Plugin](i/RTK1_Core-02.png)

If you need more information, please read following;

## language parameter

Language parameter shows your RPG Maker MV's language. The default value is "0:Auto detect", and normally you don't need to change it.

![Screen shot - Parameter](i/RTK1_Core-03.png)

In "0:Auto detect" mode, plugin checks some terms in database, then automatically set "1:English" or "2:Japanese".

For example, you develop a game in Japanese environment, but change some terms into English, then plugin can get it wrong to select "1:English" value. In this case, you need to set language parameter by "2:Japanese" demonstratively.

## debug parameter

You can use the debug mode, when debug parameter is set by 1.

![Screen shot - Parameter](i/RTK1_Core-04.png)

In the debug mode, you can see RTK1 series plugin's log messages in test console.

![Screen shot - Game and log](i/RTK1_Core-05.png)

RTK.log() function is useful. It's a simple console log command, but it works only in the debug mode. Please feel free to use it.

If it gets a String as the 1st argument, it will pass it to console.log() function. If it gets an Object as the 1st argument, it will pass it to console.dir() function. It can get a String as the 1st argument, then an Object as the 2nd argument.

RTK.trace() function is also useful. It outputs the stack trace to console. It don't need an argument, but you can set a String for the label output.

## json parameter

In PC enviroment, you can find some save files in 'save' folder. These files are compressed, so not easy to read for us.

![Screen shot - Parameter](i/RTK1_Core-06.png)

If you set json parameter by 1, plugin will automatically create uncompressed version of save files in same place. These files are useful for your development work.

## onReady service

You can implement your init function easily with using RTK.onReady() function, as follows;

```js
RTK.onReady(function(){
  // your init code here
});
```

onReady service will wait the initiation of game data, then sets up itself, finally calls all registered functions in a sequential order.

You don't worry about init timing and order with this service.

## onCall service

To implement your original plugin command, you need to replace (hook) Game_Interpreter.prototype.pluginCommand(command, args) function. But you can implement it easily with RTK.onCall() function, as follows;

```js
RTK.onCall(command, function(args){
  // your plugin command code here
});
```

With RTK.onCall() function, your code will be simple because you don't need to check command match. As the result, it will reduce the processing cost with skipping unncesessary functions.

If you have a function which processes more than 2 command String, you can refer the 2nd argument, as follwos;

```js
RTK.onCall(command, function(args, command){
  // your plugin command code here
});
```

## Persistent service

This service extends save data, to keep plugin original data in it. The function is simple as follows; (key is String, value is your original data)

```js
RTK.save(key, value);
var value = RTK.load(key);
```

For example, if you want to keep "myData" variable in save data, you should initiate it in your plugin;

```js
var myData = RTK.load("myData") || "default value";
```

At the game start, there is no save data, so you should set the default value with "||" operator. Then you can save the value as follows;

```js
myData = "saved value";
RTK.save("myData", myData);
```

Let's see the json data with using this plugin's json parameter. You will find your value in the end of the file;

```js
{
  "system":{
  //... (中略) ...
  },
  "RTK1_Core":{
    "myData":"saved value"
  }
}
```
If you don't need the value anymore, just delete it.

```js
RTK.del(key);
```

In addtion, please use pack/unpack function which convert game variables into an Array value. (dataArray is Array、startVariable and endVariable are numbers which shows game variables)

```js
var dataArray = RTK.pack(startVariable, endVariable);
RTK.unpack(startVariable, dataArray);
```

For example. with using these functions, you can save game variables 100-119 easily as follows;

```js
RTK.save("backup100-119", RTK.pack(100,119));
```

To recover game variables 100-119, your code should be;

```js
RTK.unpack(100, RTK.load("backup100-119"));
```

By the way, RTK.unpack is also useful when you want to set lots of default values in event script. For example, the following script sets value 8 to game valiables 1-5.

```js
RTK.unpack(1, [8,8,8,8,8]);
```

## onStart service

This onStart service looks similar with onReady service above. But this service will be called later than onReady service. This service will be called just before Scene_Map start.

```js
RTK.onStart(function(isNewGame){
  // your start code here
});
```

The registered function will be called with one argument (isNewGame) which will be true in new game, will be false in loaded game.

The important difference from onReady service is - this onStart timing is after loading save data. So if you want to use Persistent service (RTK.load function) to initiate your plugin setting, you　should use this onStart service. onReady is too early to refer the saved information.

## Simple text control service

We can set both English and Japanese comments in plugin file, but we feel a little bit difficulty about text resources which depend on the language in the code.

RTK.text provides a simple mechanism to control text resources which depend on the language in the code. For example, you can relate English text to Japanese text as follows;

```js
RTK.text("Yes", "はい");
RTK.text("No", "いいえ");
```

After this code, you can use RTK.text("Yes") in spite of "Yes". The rule of text selection in RTK.text function is as follows;

1. If the English argument doesn't have a related Japanese text, just return the English argument.
2. If RTK1_Option_EnJa plugin is found, the text selection depends on its language setting.
3. The text selection depends on the environment's language setting (RTK.\_lang).

After you register the necessary relationship among English text and Japanese text, you don't need to care about the language with using RTK.text function.

By the way, the text selection in RTK.text is not case sensitive. So RTK.text("Yes") and RTK.text("yes") have a same reault.

## License

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php)

You don't need to display my copyright, if you keep my comments in .js files. Of course, I'll be happy, when you will display it. :-)
