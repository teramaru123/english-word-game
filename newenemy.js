function Enemy() {
  this.x = 50;
  this.y = 50;
  this.size = 12;
  this.bulletsize = 5;
  this.nextx = 0;
  this.nexty = 0;
  this.speedx = 0.1;
  this.sppedy = 0.1;

  function GenerateRandomPosition(){
    this.nextx = Math.random() * window.innerHeight/2;
    this.nexty = Math.random() * window.innerHeight/2-20;
  }

  GenerateRandomPosition.call(this);  // 初回のランダムな位置を生成

  this.update = function() {
    var dx = this.nextx - this.x;
    var dy = this.nexty - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 15) {
      // 目標に到達したら新しいランダムな位置に移動
      this.speedx = dx / 300;
      this.speedy = dy / 300;
      this.x += this.speedx;
      this.y += this.speedy;
    }else{
      GenerateRandomPosition.call(this);
    }

    if (Math.random() < 0.01) {
      var aimAngle = Math.atan2(player.y - this.y, player.x - this.x);
      var enemyBullet = new EnemyBullet(this.x + this.size/2, this.y + this.size/2, aimAngle,this.bulletsize);
      enemyBulletList.push(enemyBullet);
    }
  };
}

function EnemyBullet(x, y,angle,size) {
  this.x = x;
  this.y = y;
  this.size = size;

  this.speed = 1;
  if(Math.random() <= 0.2){
    this.angle = angle;
  }else{
    this.angle = Math.random() * Math.PI * 2; //ランダムな方向性
  }


  this.move = function() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  };

  this.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.drawImage(bulletImage, -5, -5, this.size, this.size);
    ctx.restore();
  }
}

function Item(x,y,image){
  this.x = x;
  this.y = y;
  this.speed = 2;

  this.move = function(){
    this.y += this.speed;
  }

  this.draw = function(){
    ctx.drawImage(image,this.x,this.y);
  }
}
