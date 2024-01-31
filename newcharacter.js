// Playerクラスの定義
function Player() {
  this.x = 128;
  this.y = 256;
  this.size = 10;
  this.bulletsize = 5;
  this.speed = 2; // プレイヤーの移動速度
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

  this.fire = function(){
    var bullet = new Bullet(player.x,player.y,this.bulletsize);
    bulletList.push(bullet);
  }
}

// 弾を発射する関数
function Bullet(x,y,size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speed = 5;

  this.move = function(){
    this.y -= this.speed;
  };

  this.draw = function() {
    ctx.drawImage(bulletImage, this.x, this.y, this.size, this.size);
  }
  shotSound.play();
}
