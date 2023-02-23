/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Collectables extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("HitBox", "./Collectables/costumes/HitBox.svg", {
        x: 1.9029778039081577,
        y: 1.9029778039081577
      })
    ];

    this.sounds = [
      new Sound("pop", "./Collectables/sounds/pop.wav"),
      new Sound("Collect", "./Collectables/sounds/Collect.wav")
    ];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Entity Tick" },
        this.whenIReceiveEntityTick
      ),
      new Trigger(
        Trigger.BROADCAST,
        { name: "Toggle Map" },
        this.whenIReceiveToggleMap
      ),
      new Trigger(Trigger.CLONE_START, this.startAsClone)
    ];

    this.vars.vx2 = -7.778174593199999;
    this.vars.vy2 = 98.2878425868;
    this.vars.type6 = 0;
  }

  *whenGreenFlagClicked() {
    this.rotationStyle = Sprite.RotationStyle.DONT_ROTATE;
    this.goto(46, 45);
    this.effects.ghost = 100;
    this.size = 400;
    this.effects.color = -10;
    this.stage.vars.stars = 0;
    this.effects.color = 200;
  }

  *whenIReceiveEntityTick() {
    this.vars.vx2 = this.x - this.sprites["Player"].x;
    this.vars.vy2 = this.y - this.sprites["Player"].y;
    yield* this.rotateView(this.vars.vx2, this.vars.vy2);
  }

  *rotateView(x7, y4) {
    this.vars.vx2 =
      x7 * Math.cos(this.degToRad(this.stage.vars.cameraDir)) -
      y4 * Math.sin(this.degToRad(this.stage.vars.cameraDir));
    this.vars.vy2 =
      x7 * Math.sin(this.degToRad(this.stage.vars.cameraDir)) +
      y4 * Math.cos(this.degToRad(this.stage.vars.cameraDir));
    if (this.vars.vy2 > 0) {
      this.warp(this.drawAtXDist)(
        this.vars.type6,
        this.vars.vx2 * (this.stage.vars.dv / this.vars.vy2),
        this.vars.vy2
      );
    }
  }

  *drawAtXDist(type7, x8, dist3) {
    while (
      !(this.stage.vars.drawDist[this.stage.vars.drawIdx - 1 - 1] > dist3)
    ) {
      this.stage.vars.drawIdx += -1;
    }
    while (!(this.stage.vars.drawDist[this.stage.vars.drawIdx - 1] < dist3)) {
      this.stage.vars.drawIdx += 1;
    }
    this.stage.vars.drawType.splice(this.stage.vars.drawIdx - 1, 0, type7);
    this.stage.vars.drawX.splice(this.stage.vars.drawIdx - 1, 0, x8);
    this.stage.vars.drawDist.splice(this.stage.vars.drawIdx - 1, 0, dist3);
  }

  *spawnOf(count2, type8) {
    this.visible = true;
    this.vars.type6 = type8;
    for (let i = 0; i < count2; i++) {
      this.goto(this.random(-240, 240), this.random(-180, 180));
      while (
        !!(
          this.touching(this.sprites["Level"].andClones()) ||
          this.touching(this.sprites["Entities"].andClones())
        )
      ) {
        this.goto(this.random(-240, 240), this.random(-180, 180));
      }
      this.createClone();
    }
    this.vars.type6 = 0;
    this.visible = false;
  }

  *whenIReceiveToggleMap() {
    this.effects.ghost = this.stage.vars.mapGhost;
  }

  *tryMove(dx3, dy4) {
    this.x += dx3;
    this.y += dy4;
    if (
      this.touching(this.sprites["Level"].andClones()) ||
      this.touching(this.sprites["Entities"].andClones())
    ) {
      this.x += 0 - dx3;
      this.y += 0 - dy4;
    }
  }

  *move(steps3) {
    this.warp(this.tryMove)(
      steps3 * Math.sin(this.degToRad(this.direction)),
      0
    );
    this.warp(this.tryMove)(
      0,
      steps3 * Math.cos(this.degToRad(this.direction))
    );
  }

  *startAsClone() {
    this.stage.vars.stars += 1;
    while (true) {
      if (this.touching(this.sprites["Player"].andClones())) {
        yield* this.startSound("Collect");
        this.stage.vars.stars += -1;
        this.deleteThisClone();
      }
      yield;
    }
  }
}
