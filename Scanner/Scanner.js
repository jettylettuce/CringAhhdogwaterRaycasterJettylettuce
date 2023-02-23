/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Scanner extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("dot", "./Scanner/costumes/dot.png", { x: 2, y: 2 }),
      new Costume("black screen", "./Scanner/costumes/black screen.png", {
        x: 480,
        y: 360
      }),
      new Costume("Textures32", "./Scanner/costumes/Textures32.png", {
        x: 480,
        y: 360
      })
    ];

    this.sounds = [new Sound("pop", "./Scanner/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Scan Pass" },
        this.whenIReceiveScanPass
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Scan Complete" },
        this.whenIReceiveScanComplete
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Begin Scan" },
        this.whenIReceiveBeginScan
      )
    ];

    this.vars.color = 8421504;
    this.vars.i = 1;
    this.vars.scanIdx2 = 30721;
    this.vars.tick31 = 0;
    this.vars.ghostValues = [5.9, 12.1, 24.7, 50, 100];
    this.vars.colours = [
      0,
      524288,
      2048,
      526336,
      16,
      524304,
      2064,
      526352,
      -526352,
      -2064,
      522224,
      1046512,
      -524304,
      -16,
      524272,
      1048560,
      -522256,
      2032,
      526320,
      1050608,
      -520208,
      4080,
      528368,
      1052656,
      -526336,
      -2048,
      522240,
      1046528,
      -524288,
      1048576,
      -522240,
      1050624,
      -520192,
      4096,
      528384,
      1052672,
      -526320,
      -2032,
      522256,
      1046544,
      -524272,
      1048592,
      -522224,
      1050640,
      -520176,
      4112,
      528400,
      1052688,
      -526304,
      -2016,
      522272,
      1046560,
      -524256,
      32,
      524320,
      1048608,
      -522208,
      2080,
      526368,
      1050656,
      -520160,
      4128,
      528416,
      1052704
    ];
  }

  *scan() {
    this.y = 179;
    this.vars.scanIdx2 = 1;
    for (let i = 0; i < 2 * this.stage.vars.textureSize; i++) {
      this.x = -239;
      for (let i = 0; i < 480; i++) {
        if (!this.touching(Color.num(this.vars.color))) {
          this.vars.color = 2 * this.stage.vars.scan[this.vars.scanIdx2 - 1];
          this.vars.i = 1;
          while (
            !this.touching(
              Color.num(this.vars.color + this.vars.colours[this.vars.i - 1])
            )
          ) {
            this.vars.i += 1;
          }
          this.vars.color += this.vars.colours[this.vars.i - 1];
        }
        this.stage.vars.scan.splice(this.vars.scanIdx2 - 1, 1, this.vars.color);
        this.vars.scanIdx2 += 1;
        this.x += 1;
      }
      this.y += -1;
    }
  }

  *startAsClone() {
    this.moveAhead();
    this.size = 100;
    this.goto(0, 0);
  }

  *whenIReceiveScanPass() {
    if (this.costumeNumber > 2) {
      return;
    }
    if (this.costumeNumber > 1) {
      this.stage.vars.scanPass += 1;
      this.visible = true;
      this.effects.ghost = this.vars.ghostValues[this.stage.vars.scanPass - 1];
      return;
    }
    if (this.stage.vars.scanPass == 1) {
      yield* this.initialScan();
    } else {
      yield* this.scan();
    }
  }

  *initialScan() {
    this.y = 179;
    for (let i = 0; i < 2 * this.stage.vars.textureSize; i++) {
      this.x = -239;
      for (let i = 0; i < 480; i++) {
        this.vars.i = 1;
        while (!this.touching(Color.num(this.vars.colours[this.vars.i - 1]))) {
          this.vars.i += 1;
        }
        this.stage.vars.scan.push(this.vars.colours[this.vars.i - 1]);
        this.x += 1;
      }
      this.y += -1;
    }
  }

  *setupColoursListFromDepth(color2, depth) {
    this.vars.color = color2;
    for (let i = 0; i < depth; i++) {
      for (let i = 0; i < depth; i++) {
        for (let i = 0; i < depth; i++) {
          if (!this.vars.colours.includes(this.vars.color)) {
            this.vars.colours.push(this.vars.color);
          }
          this.vars.color += 524288;
        }
        this.vars.color += 2048 - 524288 * depth;
      }
      this.vars.color += 16 - 2048 * depth;
    }
  }

  *whenIReceiveScanComplete() {
    this.visible = false;
    this.deleteThisClone();
  }

  *whenIReceiveBeginScan() {
    this.stage.vars.textureSize = 32;
    this.visible = true;
    this.size = 100;
    this.costume = "Textures32";
    this.createClone();
    this.costume = "black screen";
    this.createClone();
    this.size = 1;
    this.costume = "dot";
    this.stage.vars.scanPass = 0;
    this.stage.vars.scan = [];
    yield* this.wait(0);
    for (let i = 0; i < 5; i++) {
      yield* this.broadcastAndWait("Scan Pass");
      yield;
    }
    this.stage.vars.time = this.timer;
    yield* this.broadcastAndWait("Scan Complete");
  }
}
