/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Pen extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("dog", "./Pen/costumes/dog.jpg", { x: 225, y: 225 }),
      new Costume("also dog", "./Pen/costumes/also dog.png", {
        x: 180,
        y: 272
      }),
      new Costume("maxresdefault", "./Pen/costumes/maxresdefault.jpg", {
        x: 480,
        y: 270
      })
    ];

    this.sounds = [new Sound("pop", "./Pen/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.BROADCAST, { name: "Paint" }, this.whenIReceivePaint)
    ];

    this.vars.distance2 = 1.4505386715070934;
    this.vars.height = 2865.778086268886;
    this.vars.x5 = -18662.998642901064;
    this.vars.type5 = 1;
    this.vars.row2 = 507;
    this.vars.dy3 = -10.01907081560563;
    this.vars.scanIdx = 30878;
    this.vars.bright = 24.22888358916667;
    this.vars.scaledTextureSize = 32;
    this.vars.skip = 480;
    this.vars.y2 = -128.14410643975205;
  }

  *whenIReceivePaint() {
    this.visible = false;
    yield* this.draw();
  }

  *draw() {
    this.clearPen();
    this.penSize = this.stage.vars.res;
    this.penColor.h = 53;
    this.vars.row2 = 1;
    for (let i = 0; i < this.stage.vars.drawX.length; i++) {
      this.warp(this.drawRow)();
      this.vars.row2 += 1;
    }
  }

  *drawRow() {
    this.vars.type5 = this.stage.vars.drawType[this.vars.row2 - 1];
    this.vars.x5 = this.stage.vars.drawX[this.vars.row2 - 1];
    this.vars.distance2 = this.stage.vars.drawDist[this.vars.row2 - 1];
    this.vars.height = (10 * this.stage.vars.dv) / this.vars.distance2;
    if (this.vars.type5 < 10) {
      this.warp(this.stampEntity)(this.vars.x5, 0);
      return;
    }
    this.vars.y2 = 1.5 * this.vars.height - this.stage.vars.res / 2;
    this.goto(this.vars.x5, this.vars.y2);
    this.vars.height = this.vars.height * 2.5 - this.stage.vars.res;
    this.vars.dy3 = 0 - this.vars.height / this.stage.vars.textureSize;
    this.vars.scanIdx = this.vars.type5 % 1000000;
    this.vars.bright = 35 - this.vars.distance2 / 3;
    if (this.vars.type5 > 2000001) {
      this.vars.bright += -25;
    }
    this.penColor.a = 1 - 100 / 100;
    this.penDown = true;
    this.vars.scaledTextureSize = this.vars.height / this.stage.vars.res;
    if (this.vars.scaledTextureSize < 12) {
      this.vars.scaledTextureSize = 8;
    } else {
      if (this.vars.scaledTextureSize < 24) {
        this.vars.scaledTextureSize = 16;
      } else {
        if (this.vars.scaledTextureSize < 48) {
          this.vars.scaledTextureSize = 32;
        } else {
          this.vars.scaledTextureSize = this.stage.vars.textureSize;
        }
      }
    }
    this.vars.skip = Math.floor(
      this.stage.vars.textureSize / this.vars.scaledTextureSize
    );
    this.vars.dy3 = this.vars.dy3 * this.vars.skip;
    this.vars.skip = this.vars.skip * 480;
    for (let i = 0; i < this.vars.scaledTextureSize; i++) {
      this.penColor = Color.num(this.stage.vars.scan[this.vars.scanIdx - 1]);
      this.penColor.v += this.vars.bright;
      this.vars.scanIdx += this.vars.skip;
      this.vars.y2 += this.vars.dy3;
      this.y = this.vars.y2;
    }
    this.penDown = false;
  }

  *stampEntity(x6, y3) {
    if (this.vars.type5 > 0) {
      this.size = this.vars.height;
      this.costume = this.vars.type5;
      this.goto(x6, y3);
      if (Math.abs(x6 - this.x) < 1) {
        this.effects.brightness = 40 - this.vars.distance2 / 1.5;
        this.stamp();
      }
    }
  }
}
