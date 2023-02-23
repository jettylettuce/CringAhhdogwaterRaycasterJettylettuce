import { Project } from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import Stage from "./Stage/Stage.js";
import Player from "./Player/Player.js";
import Raycaster from "./Raycaster/Raycaster.js";
import Level from "./Level/Level.js";
import LevelProximity from "./LevelProximity/LevelProximity.js";
import LevelColor from "./LevelColor/LevelColor.js";
import Entities from "./Entities/Entities.js";
import Pen from "./Pen/Pen.js";
import Collectables from "./Collectables/Collectables.js";
import Scanner from "./Scanner/Scanner.js";

const stage = new Stage({ costumeNumber: 1 });

const sprites = {
  Player: new Player({
    x: -18,
    y: -30,
    direction: 45,
    costumeNumber: 1,
    size: 150,
    visible: true,
    layerOrder: 8
  }),
  Raycaster: new Raycaster({
    x: 78.10961971596267,
    y: -4.247505013046981,
    direction: 75.0000000004458,
    costumeNumber: 1,
    size: 1.3888888888888888,
    visible: true,
    layerOrder: 1
  }),
  Level: new Level({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 7
  }),
  LevelProximity: new LevelProximity({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 6
  }),
  LevelColor: new LevelColor({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: true,
    layerOrder: 2
  }),
  Entities: new Entities({
    x: 113,
    y: -45,
    direction: 90,
    costumeNumber: 1,
    size: 600,
    visible: false,
    layerOrder: 5
  }),
  Pen: new Pen({
    x: -495,
    y: 0,
    direction: 90,
    costumeNumber: 1,
    size: 240,
    visible: false,
    layerOrder: 3
  }),
  Collectables: new Collectables({
    x: 46,
    y: 45,
    direction: 90,
    costumeNumber: 1,
    size: 400,
    visible: false,
    layerOrder: 4
  }),
  Scanner: new Scanner({
    x: 240,
    y: 115,
    direction: 90,
    costumeNumber: 1,
    size: 1.3888888888888888,
    visible: false,
    layerOrder: 9
  })
};

const project = new Project(stage, sprites, {
  frameRate: 30 // Set to 60 to make your project run faster
});
export default project;
