function keyDown(event){
  // キーコードを取得
  var ck = event.keyCode;

  // WASDキーに対する移動
  switch(ck){
    case 87: // Wキー
    player.moveUp = true;
    break;
    case 65: // Aキー
    player.moveLeft = true;
    break;
    case 83: // Sキー
    player.moveDown = true;
    break;
    case 68: // Dキー
    player.moveRight = true;
    break;
  }

  // スペースキーで弾を発射
  if (ck === 32) { // 32はスペースキーのキーコード
    player.fire();
  }

  //arrowLeftキーで無敵
  if (ck === 37 && invincibleLeft > 0){
    lALKDT = Date.now();
    invincibleLeft -= 1;
    invincibleSound.play();
  }

  //arrowRiightキーで弾を消去
  if (ck === 39 && deleteLeft > 0){
    enemyBulletList = [];
    deleteLeft -= 1;
    deleteSound.play();
  }

  if (ck === 40 && reduceLeft > 0) {
    lADKDT = Date.now();
    reduceLeft -=1;
    reduceSound.play();
  }

  // Escキーが押されていたらフラグを降ろす
  if(ck === 27){
    run = false;
    scoreManager.stopScoring();
  }
}

function keyUp(event){
  // キーコードを取得
  var ck = event.keyCode;

  // WASDキーの押下解除に対する処理
  switch(ck){
    case 87: // Wキー
    player.moveUp = false;
    break;
    case 65: // Aキー
    player.moveLeft = false;
    break;
    case 83: // Sキー
    player.moveDown = false;
    break;
    case 68: // Dキー
    player.moveRight = false;
    break;
  }
}
