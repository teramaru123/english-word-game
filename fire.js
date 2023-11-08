var Bullet = function(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 5;

  this.move = function() {
    this.y -= this.speed;
    if (this.y < 0) {
      bulletList.splice(bulletList.indexOf(this), 1);
    }
  }

  this.draw = function() {
    ctx.drawImage(bulletImage, this.x, this.y, 10, 10);
  }
}

function mouseClick(event) {
  var bullet = new Bullet(mouse.x, mouse.y);
  bulletList.push(bullet);
}
