// - global -------------------------------------------------------------------
var screenCanvas, info;
var run = true;
var mouse = new Point();
var ctx; //コンテキスト格納
var own = new Image(); //自機画像
var bulletImage = new Image(); //弾画像
var bulletList = [];




// - main ---------------------------------------------------------------------
window.onload = function(){
  var i;

  // スクリーンの初期化
  screenCanvas = document.getElementById('screen');
  screenCanvas.width = 256;
  screenCanvas.height = 256;

  //2dコンテキスト
  ctx = screenCanvas.getContext('2d');

  // イベントの登録
  screenCanvas.addEventListener('mousemove', mouseMove, true);
  window.addEventListener('keydown', keyDown, true);
  screenCanvas.addEventListener('mousedown', mouseClick, true);

  // エレメント関連
  info = document.getElementById('info');

  //画像初期化
  own.src = "own.png";
  bulletImage.src = "bullet.png";

  gameloop();

  // ループ処理を呼び出す
  function gameloop(){
    // HTMLを更新
    info.innerHTML = mouse.x + ' : ' + mouse.y;

    // screenクリア
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

    // 自機の画像を表示
    ctx.drawImage(own,mouse.x-10,mouse.y-10);

    // 弾の描画
    for (var i = bulletList.length-1; i >= 0 ; i--) {
      bulletList[i].move();

      // 弾が画面外に出たら削除
      if (bulletList[i].y < 0) {
        bulletList.splice(i, 1);
      }

      bulletList[i].draw();
    }

    // フラグにより再帰呼び出し
    if(run){requestAnimationFrame(gameloop);}
  };
};

// - event --------------------------------------------------------------------
function mouseMove(event){
  // マウスカーソル座標の更新
  mouse.x = event.clientX - screenCanvas.offsetLeft;
  mouse.y = event.clientY - screenCanvas.offsetTop;
}


function keyDown(event){
  // キーコードを取得
  var ck = event.keyCode;

  // Escキーが押されていたらフラグを降ろす
  if(ck === 27){run = false;}
}
