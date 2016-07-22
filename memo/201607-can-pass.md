
# 201607-can-pass

I had used 'Game_CharacterBase.prototype.canPass' method for my plugin, but it works funny... So I try to read the code about it.

## Game_Event class

```
Game_Event
  Game_Character
    Game_CharacterBase
      Object
```

## canPass

```js
Game_CharacterBase.prototype.canPass = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }
    if (!this.isMapPassable(x, y, d)) {
        return false;
    }
    if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
    }
    return true;
};
```

```js
Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};

Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};
```

## isValid

'$gameMap.isValid' function checks the area range. It's simple.

```js
Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};
```

## isThrough

```js
Game_CharacterBase.prototype.isThrough = function() {
    return this._through;
};
Game_CharacterBase.prototype.setThrough = function(through) {
    this._through = through;
};
Game_CharacterBase.prototype.isDebugThrough = function() {
    return false;
};
```

## isMapPassable

```js
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = this.reverseDir(d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};
Game_CharacterBase.prototype.reverseDir = function(d) {
    return 10 - d;
};
```

```js
Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};
Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0200);
};
Game_Map.prototype.isShipPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0400);
};
Game_Map.prototype.isAirshipLandOk = function(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};
```

```js
Game_Map.prototype.checkPassage = function(x, y, bit) {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];
        if ((flag & 0x10) !== 0)  // [*] No effect on passage
            continue;
        if ((flag & bit) === 0)   // [o] Passable
            return true;
        if ((flag & bit) === bit) // [x] Impassable
            return false;
    }
    return false;
};
```

## isCollidedWithCharacters

```js
Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
    return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};
Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.some(function(event) {
        return event.isNormalPriority();
    });
};
Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};
```

Oops! I found the reason of funny Enemy's move.

```js
Game_Event.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.length > 0;
};
```

The 'isCollidedWithEvents' function was overwritten in 'Game_Event' class... And as the result, an event is always collided with other Events...
