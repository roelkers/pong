import 'phaser';
import { GameScene } from './gameScene';
import { ScoreScene } from './scoreScene';
import { WelcomeScene } from './welcomeScene';

const config = {
  title: "Pong",
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#eeeeee",
  scene: [WelcomeScene, GameScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
};

export class StarfallGame extends Phaser.Game {
  constructor() {
    super(config);
  }
}

const game = new Phaser.Game(config);
