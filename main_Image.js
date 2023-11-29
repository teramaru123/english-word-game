// - global -------------------------------------------------------------------
var screenCanvas, info;
var run = true;
var player = new Player();
var ctx; // コンテキスト格納
var own = new Image(); // 自機画像
var bulletImage = new Image(); // 弾画像
var bulletList = [];
var shotSound = new Audio('shot.mp3'); // "shot.mp3" ファイルを読み込む

// - main ---------------------------------------------------------------------
window.onload = function(){
  // スクリーンの初期化
  screenCanvas = document.getElementById('screen');
  screenCanvas.width = 256;
  screenCanvas.height = 256;

  // 2dコンテキスト
  ctx = screenCanvas.getContext('2d');

  // イベントの登録
  window.addEventListener('keydown', keyDown, true);
  window.addEventListener('keyup', keyUp, true);
  screenCanvas.addEventListener('mousedown', fireBullet, true);

  // エレメント関連
  info = document.getElementById('info');

  // 画像初期化
  own.src = "own.png";
  bulletImage.src = "bullet.png";

  gameloop();

  // ループ処理を呼び出す
  function gameloop(){
    // HTMLを更新
    info.innerHTML = player.x + ' : ' + player.y;

    // screenクリア
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

    // 自機の画像を表示
    ctx.drawImage(own, player.x-10, player.y-10);

    // 弾の描画と移動
    for (var i = bulletList.length-1; i >= 0 ; i--) {
      bulletList[i].move();

      // 弾が画面外に出たら削除
      if (bulletList[i].y < 0) {
        bulletList.splice(i, 1);
      } else {
        bulletList[i].draw();
      }
    }

    // プレイヤーの移動処理
    player.update();

    // プレイヤーがキャンバス外に出ないように制限
    player.x = Math.max(10, Math.min(player.x, screenCanvas.width - 10));
    player.y = Math.max(10, Math.min(player.y, screenCanvas.height - 10));

    // フラグにより再帰呼び出し
    if(run){requestAnimationFrame(gameloop);}
  }
};
