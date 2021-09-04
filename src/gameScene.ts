import "phaser";

const WINNING_SCORE = 5; 
let BALL_VELOCITY = 200
const PADDLE_VELOCITY = 200
const PADDLE_VELOCITY_OPPONENT = 125

export class GameScene extends Phaser.Scene {
  delta: number;
  sand: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
  leftPaddle: Phaser.Physics.Arcade.Image;
  rightPaddle: Phaser.Physics.Arcade.Image;
  ball: Phaser.Physics.Arcade.Image;
  leftWall: Phaser.Physics.Arcade.Image;
  rightWall: Phaser.Physics.Arcade.Image;
  score : [number, number]
  scoreText: Phaser.GameObjects.Text

  constructor() {
  super({
      key: "GameScene"
    });
  }
  init(params): void {
    this.delta = 1000;
  }
  preload(): void {
    this.load.image("paddle", "assets/paddle.png")
    this.load.image("ball", "assets/ball.png")
  }
  create(): void {
    this.leftPaddle = this.physics.add.image(30, 600, "paddle");
    this.leftPaddle.setDisplaySize(20, 100);
    this.rightPaddle = this.physics.add.image(770, 80, "paddle");
    this.rightPaddle.setDisplaySize(20, 100);
    this.rightPaddle.body.immovable = true;
    this.leftPaddle.body.immovable = true;
    this.ball = this.physics.add.image(200, 40, "ball")
    this.ball.setDisplaySize(40,40)
    const velocity = this.getRandomVelVector()
    this.ball.setVelocity(velocity[0], velocity[1]);
    this.ball.setCollideWorldBounds(true)
    this.ball.body.bounce.set(1,1)
    this.leftPaddle.body.bounce.set(1,1)
    this.rightPaddle.body.bounce.set(1,1)
    this.physics.world.enable([this.ball, this.leftPaddle])
    this.physics.world.enable([this.ball, this.rightPaddle])

    this.leftWall = this.physics.add.image(0,0, "paddle")
    this.leftWall.setDisplaySize(10, 1500);
    this.leftWall.body.immovable = true
    this.rightWall = this.physics.add.image(800,0, "paddle")
    this.rightWall.setDisplaySize(10, 1500);
    this.rightWall.body.immovable = true

    this.score = [0,0]
    this.scoreText = this.add.text(380, 50, `${this.score[0]} - ${this.score[1]}`, { color: "#222222" })

    this.physics.add.collider(this.leftWall, this.ball, (paddle,ball) => {
      this.score[1] += 1
      this.checkScore()
      this.ball.setVisible(false)
      this.time.delayedCall(3000, this.startNextPoint, [1], this)
    })
    this.physics.add.collider(this.rightWall, this.ball, (paddle,ball) => {
      this.score[0] += 1
      this.checkScore()
      this.ball.setVisible(false)
      this.time.delayedCall(3000, this.startNextPoint, [-1], this)
    })
    this.physics.add.collider(this.leftPaddle, this.ball, (paddle,ball) => {
      BALL_VELOCITY += 10; 
      console.log(BALL_VELOCITY)
    })
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    upKey.on('down', (event) => {
      this.leftPaddle.setVelocityY(-PADDLE_VELOCITY)
    })
    upKey.on('up', (event) => {
      this.leftPaddle.setVelocityY(0)
    })
    downKey.on('down', (event) => {
      this.leftPaddle.setVelocityY(PADDLE_VELOCITY)
    })
    downKey.on('up', (event) => {
      this.leftPaddle.setVelocityY(0)
    })
  }
  getRandomVelVector() {
    const x = Math.random() * (BALL_VELOCITY/2) + 100;
    const y = Math.sqrt(BALL_VELOCITY * BALL_VELOCITY - x * x);
    return [x,y]
  }
  update() {
    this.physics.world.collide(this.ball, this.leftPaddle)
    this.physics.world.collide(this.ball, this.rightPaddle)
    this.physics.world.collide(this.ball, this.leftWall)
    this.physics.world.collide(this.ball, this.rightWall)
    this.updateScoreText()
    this.updateOpponent()
  }
  checkScore() {
    if(this.score[0] === WINNING_SCORE || this.score[1] === WINNING_SCORE) {
      this.scene.start('ScoreScene', { score : this.score }) 
    }
  }
  updateScoreText() {
    this.scoreText.setText(`${this.score[0]} - ${this.score[1]}`);
  }
  startNextPoint(direction: number) {
    this.ball.setVisible(true) 
    this.ball.setPosition(400,200)
    const velocity = this.getRandomVelVector()
    this.ball.setVelocity(velocity[0], velocity[1]);
  }
  updateOpponent() {
    if(this.ball.y >= this.rightPaddle.y) {
      this.rightPaddle.setVelocityY(PADDLE_VELOCITY_OPPONENT) 
    }
    if(this.ball.y < this.rightPaddle.y) {
      this.rightPaddle.setVelocityY(-PADDLE_VELOCITY_OPPONENT) 
    }
  }
};
