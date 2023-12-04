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
  var bullet = new Bullet(playerX, playerY);
  bulletList.push(bullet);
  // shotSound.play(); // (必要に応じて音声の再生を追加する)
}

// 別のスクリプトで使うために関数をエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Bullet: Bullet,
    fireBullet: fireBullet
  };
}
