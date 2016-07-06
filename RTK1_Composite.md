[Japanese version](RTK1_Composite.ja.md)

# [RTK1_Composite](RTK1_Composite.js) Plugin

Plugin to add the composite function for RPG Maker MV.

Download: [RTK1_Composite.js](https://raw.githubusercontent.com/yamachan/jgss-hack/master/RTK1_Composite.js) (ver1.10 2016/07/06)

## Overview

This plugin depends on [RTK1_Core plugin](RTK1_Core.jp.md). Please include it before this plugin, as follows;

![Screen shot - Pligin Manager](i/RTK1_Composite-01.png)

Normally, you don't need to change parameters.

![Screen shot - Plugin](i/RTK1_Composite-02.png)

## 1st step

With this plugin player can use "Composite" in game menu.

![Screen shot - Game menu](i/RTK1_Composite-03.png)

But at first, player doesn't know any composite recipe, so "Composite" list is empty.

![Screen shot - Composite menu](i/RTK1_Composite-04.png)

Let's open the database menu of RPG Maker MV, chose any target item, weapon or armor - for example, item "Potion Ex". Then let's input following tag into the note area of the target . This will be the composite recipe of this.

```
<composite:1,i1,2,0,0>
```
![Screen shot - Database item](i/RTK1_Composite-05.png)

Please don't touch the 1st value '1', and the last 2 values '0,0'. I will explain about them in later section.

In this section, the 2nd and 3rd values 'i1,2' is important. These values show the necessary matelials of this composition.

In the values 'i1,2', the first "i1" value is a shorten version of "item which id is 1". It shows the ID 1 item in the databese, "Potion". The following value "2" means it requires 2 portions for this composition.

In the result, 'i1,2' means "2 Portions".

OK. Let's try to test the following sample.

```
<composite:1,i1,2,w1,1,a1,1,0,0>
```

You should check "i1,2,w1,1,a1,1" part.

Same as "i1", "w1" is a shorten version of "weapon which id is 1", and "a1" is a shorten version of "armor which id is 1" So this recipe means that it requires 2 Portions, 1 Sword and 1 Shield. Is it clear?

In this plugin, you can set 5 necessary matelials for one composition recipe. It must have at least one necessary matelial.

Then, let's back to the event setting - add an autorun event to set up the player's item bag in your map. Then, let's use the following plugin command;

```
RTK1_Composite learn i6
```
\# You can set more than 2 items with "," separator.

![Screen shot - Event edit](i/RTK1_Composite-06.png)

Finished! Now, player knows the composition recipe of i6 (item which id is 6 - means Portion Ex).

![Screen shot - Composite menu ja](i/RTK1_Composite-07.png)

Now, player can composite a Potion Ex from 2 Portions anytime from the game menu.

By the way, this plugin can work with English/Japanese language switch [RTK1_Option_EnJa plugin](RTK1_Option_EnJa.md). The following screenshot is in Japanese mode.

![Screen shot - Composite menu ja](i/RTK1_Composite-07.ja.png)

## Forget recipes

Onece player learn a composition recipe, it will be kept after saving game.

But sometimes, we need a temporary event recipe which should be forgot after the event. For this purpose, this plugin has "forget" plugin command, as follows;

```
RTK1_Composite forget i6
```

## Set charge cost

You can set the charge cost in a composition recipe.

```
<composite:1,i1,2,0,0>
```

Let's change the last value '0', to '50'.

```
<composite:1,i1,2,0,50>
```

Yes, the last value means the charge cost. You can see the 50G cost in the game;

![Screen shot - Composite menu](i/RTK1_Composite-08.png)

## Set success rate

You can set the success rate for a composition recipe.

```
<composite:1,i1,2,0,50>
```

Let's change the first value '1', to '0.5'.

```
<composite:0.5,i1,2,0,50>
```

Yes, the first value (from 0 to 1) means the success rate. You can see the 50% rate in the game;

![Screen shot - Composite menu](i/RTK1_Composite-09.png)

In the current recipe, you will get nothing when the composition fails. You will lose money and materials.


## Get something when fail to composite

You don't want to lose everything? OK, you can change a composition recipe again.

```
<composite:0.5,i1,2,0,50>
```

Let's see the last value but two, '0'. It's the value for composition fail.'0' means nothing, so let's change it to 'i1'.

```
<composite:0.5,i1,2,i1,50>
```

With this recipe, you will get 1 Portion when the composition fails, as follows;

![Screen shot - Composite menu](i/RTK1_Composite-10.png)

That's all to use basic functions of this plugin. I hope you will enjoy to develop your game with it.

## Shop function

OK, let's start an advanced level.

You can use "Composite shop" with using the following plugin command;

```
RTK1_Composite shop
```

Player will see the followng shop menu;

![Screen shot - Composite shop](i/RTK1_Composite-11.png)

The shop function automatically create the list of composite recipe. It means all composite recipe will be shown in the shop. You must check the recipes will not break your rule or scenario.

In addition, an additional item/weapon/armor argument will show the specialty shop for them;

```
RTK1_Composite shop item
```

![Screen shot - Composite shop](i/RTK1_Composite-12.png)

### Change shop name

(TBD)

```
RTK1_Composite shop item en_name
RTK1_Composite shop item en_name ja_name
RTK1_Composite shop all en_name ja_name
```

### Select Shop

Control the shop's recipe (TBD)

```
RTK1_Composite clear
RTK1_Composite add i6
RTK1_Composite remove i6
RTK1_Composite shop custom
RTK1_Composite shop custom en_name ja_name
```


## License

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php)

You don't need to display my copyright, if you keep my comments in .js files. Of course, I'll be happy, when you will display it. :-)
