/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class LevelColor extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Level1", "./LevelColor/costumes/Level1.svg", {
        x: 250.24925,
        y: 193.693675
      })
    ];

    this.sounds = [new Sound("pop", "./LevelColor/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];
  }

  *whenGreenFlagClicked() {
    this.goto(0, 0);
    this.effects.ghost = 100;
  }
}
