// Playerクラスの定義
function Player() {
  this.x = 128;
  this.y = 128;
  this.speed = 5; // プレイヤーの移動速度
  this.moveUp = false;
  this.moveLeft = false;
  this.moveDown = false;
  this.moveRight = false;

  // プレイヤーの更新処理
  this.update = function() {
    // 上下左右の移動
    if (this.moveUp) {
      this.y -= this.speed;
    }
    if (this.moveLeft) {
      this.x -= this.speed;
    }
    if (this.moveDown) {
      this.y += this.speed;
    }
    if (this.moveRight) {
      this.x += this.speed;
    }
  };
}
