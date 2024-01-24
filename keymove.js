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
    fireBullet();
  }

  //arrowLeftキーで無敵
  if (ck === 37){
    lastKeyDownTime = Date.now();
  }

  //arrowLeftキーで弾を消去
  if (ck === 39){
    enemyBulletList = [];
  }

  //arrowupキーでスコアを加算
  if (ck === 38) {
    scoreManager.score += 1001;
    scoreManager.displayScore();
  }

  //arrowDownキーで選択肢を減らす
  if (ck === 40) {
    lADKDT = Date.now();
  }

  // Escキーが押されていたらフラグを降ろす
  if(ck === 27){run = false;}
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
