// 弾のクラス定義
function Bullet(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 5;

  this.move = function() {
    this.y -= this.speed;
  }

  this.draw = function() {
    ctx.drawImage(bulletImage, this.x, this.y, 10, 10);
  }
}

// 弾を発射する関数
function fireBullet() {
  var bullet = new Bullet(mouse.x, mouse.y);
  bulletList.push(bullet);
}
