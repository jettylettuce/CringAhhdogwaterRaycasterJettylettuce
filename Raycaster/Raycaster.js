/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Raycaster extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("HitBox", "./Raycaster/costumes/HitBox.svg", {
        x: 1.9029778039081577,
        y: 1.9029778039081577
      }),
      new Costume("BIG", "./Raycaster/costumes/BIG.svg", { x: 240, y: 180 })
    ];

    this.sounds = [new Sound("Meow", "./Raycaster/sounds/Meow.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Raycast" },
        this.whenIReceiveRaycast
      )
    ];

    this.vars.x = 241;
    this.vars.distance = 86.16952767810001;
    this.vars.scanLines = 480;
    this.vars.textureOffset = 15518;
  }

  *whenGreenFlagClicked() {
    this.costume = "BIG";
    this.size = 1;
    this.costume = "HitBox";
    this.rotationStyle = Sprite.RotationStyle.DONT_ROTATE;
    this.effects.ghost = 100;
  }

  *singleRay() {
    this.goto(this.sprites["Player"].x, this.sprites["Player"].y);
    this.warp(this.fastProximityRay)();
    while (!!this.touching(this.sprites["Level"].andClones())) {
      this.move(-0.5);
    }
    this.vars.distance = Math.hypot(
      this.sprites["Player"].x - this.x,
      this.sprites["Player"].y - this.y
    );
    this.vars.distance =
      this.vars.distance *
      Math.cos(this.degToRad(this.direction - this.stage.vars.cameraDir));
    this.vars.textureOffset = ((this.x + this.y) / 25) % 1;
    this.vars.textureOffset = Math.floor(
      this.vars.textureOffset * this.stage.vars.textureSize
    );
    this.vars.textureOffset +=
      (this.stage.vars.texture + this.stage.vars.row * 480) *
      this.stage.vars.textureSize;
    if (this.touching(this.sprites["LevelColor"].andClones())) {
      this.warp(this.drawAtXDist)(
        2000001 + this.vars.textureOffset,
        this.vars.x,
        this.vars.distance
      );
    } else {
      this.warp(this.drawAtXDist)(
        1000001 + this.vars.textureOffset,
        this.vars.x,
        this.vars.distance
      );
    }
  }

  *whenIReceiveRaycast() {
    yield* this.raycast();
  }

  *raycast() {
    this.vars.x = this.stage.vars.res / 2 - 240;
    if (this.stage.vars.res < 4) {
      this.vars.x = Math.round(this.vars.x);
    }
    this.vars.scanLines = 480 / this.stage.vars.res;
    for (let i = 0; i < this.vars.scanLines; i++) {
      this.direction =
        this.stage.vars.cameraDir +
        this.radToDeg(Math.atan(this.vars.x / this.stage.vars.dv));
      this.warp(this.singleRay)();
      this.vars.x += this.stage.vars.res;
    }
  }

  *drawAtXDist(type, x2, dist) {
    while (
      !(this.stage.vars.drawDist[this.stage.vars.drawIdx - 1 - 1] > dist)
    ) {
      this.stage.vars.drawIdx += -1;
    }
    while (!(this.stage.vars.drawDist[this.stage.vars.drawIdx - 1] < dist)) {
      this.stage.vars.drawIdx += 1;
    }
    this.stage.vars.drawType.splice(this.stage.vars.drawIdx - 1, 0, type);
    this.stage.vars.drawX.splice(this.stage.vars.drawIdx - 1, 0, x2);
    this.stage.vars.drawDist.splice(this.stage.vars.drawIdx - 1, 0, dist);
  }

  *fastProximityRay() {
    while (true) {
      if (!this.touching(this.sprites["LevelProximity"].andClones())) {
        this.move(10);
        while (!this.touching(this.sprites["LevelProximity"].andClones())) {
          this.move(10);
        }
        this.move(-6);
      }
      for (let i = 0; i < 8; i++) {
        this.move(1);
        if (this.touching(this.sprites["Level"].andClones())) {
          return;
        }
      }
    }
  }
}
