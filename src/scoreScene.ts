import "phaser";
export class ScoreScene extends Phaser.Scene {
  score: [number,number];
  result: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  constructor() {
    super({
      key: "ScoreScene"
    });
  }
  init(params: any): void {
    this.score = params.score;
  }
  create(): void {
    var resultText: string = `Final score: ${this.score[0]} - ${this.score[1]}`;
    this.result = this.add.text(200, 250, resultText,
      { font: '48px Arial Bold', color: '#222222'});
    var hintText: string = "Click to restart";
    this.hint = this.add.text(300, 350, hintText,
      { font: '24px Arial Bold',  });
    this.input.on('pointerdown', function (/*pointer*/) {
      this.scene.start("GameScene");
    }, this);
  }
};
