function Enemy() {
  this.x = 50;
  this.y = 50;
  this.nextx = 0;
  this.nexty = 0;
  this.speed = 0.1;

  function GenerateRandomPosition(){
    this.nextx = Math.random() * 128;
    this.nexty = Math.random() * 128;
  }

  GenerateRandomPosition.call(this);  // 初回のランダムな位置を生成

  this.update = function() {
    var dx = this.nextx - this.x;
        var dy = this.nexty - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            // 目標に到達したら新しいランダムな位置に移動
            GenerateRandomPosition.call(this);
        }

    if (Math.random() < 0.15) {
      var enemyBullet = new EnemyBullet(this.x, this.y);
      enemyBulletList.push(enemyBullet);
    }
  };
}

function EnemyBullet(x, y) {
  this.x = x;
  this.y = y;

  this.speed = 1;
  this.angle = Math.random() * Math.PI * 2; //ランダムな方向性

  this.move = function() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  };

  this.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.drawImage(bulletImage,-5, -5, 10, 10);
    ctx.restore();
  };
}
