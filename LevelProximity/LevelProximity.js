/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class LevelProximity extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Level1", "./LevelProximity/costumes/Level1.svg", {
        x: 254.24925,
        y: 198.693665
      })
    ];

    this.sounds = [new Sound("pop", "./LevelProximity/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];
  }

  *whenGreenFlagClicked() {
    this.goto(0, 0);
    this.effects.ghost = 100;
  }
}
