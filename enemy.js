function Enemy() {
  this.x = 50;
  this.y = 50;
  this.speed = 2;

  this.update = function() {
    this.x += this.speed;

    if (this.x > screenCanvas.width) {
      this.x = 0;
    }

    if (Math.random() < 0.02) {
      var enemyBullet = new EnemyBullet(this.x, this.y);
      enemyBulletList.push(enemyBullet);
    }
  };
}

function EnemyBullet(x, y) {
  this.x = x;
  this.y = y;

  this.speed = 1;

  this.move = function() {
    this.y += this.speed;
  };

  this.draw = function() {
    ctx.drawImage(bulletImage, this.x, this.y,10,10);
  };
}
