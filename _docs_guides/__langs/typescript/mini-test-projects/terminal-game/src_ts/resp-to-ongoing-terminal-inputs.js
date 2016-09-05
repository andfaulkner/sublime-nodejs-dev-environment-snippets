/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/keypress/keypress.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />
"use strict";
var _ = require('lodash');
console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
Keypress(process.stdin);
var stdin = process.stdin;
// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);
// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();
// i don't want binary, do you?
stdin.setEncoding('utf8');
// var position = { x: 2, y: 2 };
var player = {
    position: { x: 2, y: 2 },
    setNewPosition: function (key, position) {
        switch (key) {
            case 'a':
                return { y: position.y, x: (position.x - 1) };
            case 'd':
                return { y: position.y, x: (position.x + 1) };
            case 'w':
                return { y: (position.y - 1), x: position.x };
            case 's':
                return { y: (position.y + 1), x: position.x };
            default:
                return position;
        }
    }
};
var gridTiles = {
    numTiles: {
        x: 8,
        y: 8
    }
};
var grid = {
    margins: {
        left: _.repeat(' ', (process.stdout.columns - ((gridTiles.numTiles.x * 2) + 1)) / 2),
        top: _.repeat('\n', (process.stdout.rows - ((gridTiles.numTiles.y * 2) + 1)) / 2)
    },
    numTiles: {
        x: 8,
        y: 8
    },
    drawLine: {
        horizontalEdge: function (width) { return console.log(grid.margins.left + '=' + _.repeat('=', (width * 2))); },
        innerSolid: function (width) { return console.log(grid.margins.left + '‖' + _.repeat('-|', width - 1) + '-‖'); },
        innerWithGaps: function (width, posToDrawPlayer) {
            if (posToDrawPlayer === void 0) { posToDrawPlayer = null; }
            if (posToDrawPlayer === null) {
                return console.log(grid.margins.left + '‖' + _.repeat(' |', width - 1) + ' ‖');
            }
            var outString = grid.margins.left + '‖';
            for (var i = 0; i < width - 1; i++) {
                outString = (posToDrawPlayer === i) ? outString + 'A|' : outString + ' |';
            }
            console.log(outString + ((posToDrawPlayer === width - 1) ? 'A‖' : ' ‖'));
        }
    },
    draw: function (width, height, pos) {
        grid.drawLine.horizontalEdge(width);
        _.times(height, function (index) {
            if (index !== 0) {
                grid.drawLine.innerSolid(width);
            }
            return (index === (pos.y))
                ? grid.drawLine.innerWithGaps(width, pos.x)
                : grid.drawLine.innerWithGaps(width);
        });
        grid.drawLine.horizontalEdge(width);
    }
};
var screen = {
    clear: function () { return process.stdout.write('\033c'); },
    redraw: function (grid, key, pos) {
        console.log(grid.margins.top);
        grid.draw(grid.numTiles.x, grid.numTiles.y, pos);
        console.log('');
    }
};
var redraw = function (key, pos) {
    console.log(grid.margins.top);
    grid.draw(grid.numTiles.x, grid.numTiles.y, pos);
    console.log('');
};
var sharedState = {
    firstDrawn: false,
    time: 0,
    grid: {},
    key: '',
    player: {
        position: {
            x: 0,
            y: 0
        }
    }
};
// EVENT LOOP
stdin.on('data', function (key) {
    screen.clear();
    player.position = player.setNewPosition(key, player.position);
    screen.redraw(grid, key, player.position);
    var firstDrawn = true;
    var time = sharedState.time;
    sharedState = { grid: grid, key: key, player: player, firstDrawn: firstDrawn, time: time };
    if (key === '\u0003') {
        console.log('exiting app...');
        process.exit();
    }
    // process.stdout.write(key);
});
function gameLoop() {
    if (sharedState.firstDrawn) {
        screen.redraw(sharedState.grid, sharedState.key, sharedState.player.position);
    }
    // console.log('tick!');
    setTimeout(gameLoop, 5000);
}
gameLoop();
//# sourceMappingURL=resp-to-ongoing-terminal-inputs.js.map