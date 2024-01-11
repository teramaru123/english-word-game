// - global -------------------------------------------------------------------
var screenCanvas, info;
var run = true;
var player = new Player();
var enemy = new Enemy();
var ctx; // コンテキスト格納
var own = new Image(); // 自機画像
var enemyImage = new Image();
var bulletImage = new Image(); // 弾画像
var bulletList = [];
var enemyBulletList = [];
var shotSound = new Audio('shot.mp3'); // "shot.mp3" ファイルを読み込む
var lastKeyDownTime = 0;
// ScoreManager クラス
class ScoreManager {
  constructor() {
    this.score = 0;
    this.scoreInterval = null; // スコア増加の setInterval を管理するための変数 を追加
  }

  startScoring() {
    this.scoreInterval = setInterval(() => {
      this.score += 100;
      this.displayScore();
    }, 10);
  }

  stopScoring() {
    clearInterval(this.scoreInterval); // スコア増加の setInterval をクリア
  }

  displayScore() {
    info.innerHTML = "現在のスコア: " + this.score;
  }

  getCurrentScore(){
    return this.score;
  }
}

// - main ---------------------------------------------------------------------
window.onload = function(){
  // スクリーンの初期化
  screenCanvas = document.getElementById('screen');
  screenCanvas1 = document.getElementById('screen1');

  screenCanvas.width = 256;
  screenCanvas.height = 256;

  screenCanvas1.width = 256;
  screenCanvas1.height = 256;


  // 2dコンテキスト
  ctx = screenCanvas.getContext('2d');
  ctx1 = screenCanvas1.getContext('2d');
  // イベントの登録
  window.addEventListener('keydown', keyDown, true);
  window.addEventListener('keyup', keyUp, true);
  screenCanvas.addEventListener('mousedown', fireBullet, true);

  // エレメント関連
  info = document.getElementById('info');

  // 画像初期化
  own.src = "own.png";
  enemyImage.src = "enemy.png";
  bulletImage.src = "bullet.png";

  const scoreManager = new ScoreManager();
  scoreManager.startScoring();
  // keymove.js で参照できるように scoreManager をグローバルに設定
  window.scoreManager = scoreManager;

  gameloop();

  // ループ処理を呼び出す
  function gameloop(){
    // HTMLを更新
    info.innerHTML = "現在のスコア: " + scoreManager.score;

    // screenクリア
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

    // 自機、敵機の画像を表示
    ctx.drawImage(own, player.x-10, player.y-10);
    ctx.drawImage(enemyImage, enemy.x-10, enemy.y-10);


    for (var i = enemyBulletList.length-1; i >= 0 ; i--) {

      if (enemyBulletList[i].y > screenCanvas.height) {
        enemyBulletList.splice(i, 1);
      } else {
        enemyBulletList[i].draw();
      }

      if (!enemyBulletList[i]) {
        continue; // 要素が存在しない場合はスキップ
      }

      if (
        enemyBulletList[i].x > player.x - 10 &&
        enemyBulletList[i].x < player.x + 10 &&
        enemyBulletList[i].y > player.y - 10 &&
        enemyBulletList[i].y < player.y + 10 &&
        Date.now() - lastKeyDownTime > 3000
      ) {
        // 当たった場合の処理
        run = false;
        scoreManager.stopScoring(); // スコア増加の setInterval を停止
        alert('ゲームオーバー\nスコア：'+ scoreManager.getCurrentScore());

        // アラートを閉じてから別のページに遷移
        setTimeout(function () {
          window.location.href = './result.html';  // 遷移先のURLを指定
        }, 10);
        return;
      }
      enemyBulletList[i].move();

    }

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

    // プレイヤー、敵機の移動処理
    player.update();
    enemy.update();

    // プレイヤーがキャンバス外に出ないように制限
    player.x = Math.max(10, Math.min(player.x, screenCanvas.width - 10));
    player.y = Math.max(10, Math.min(player.y, screenCanvas.height - 10));


    // フラグにより再帰呼び出し
      if(run){
          requestAnimationFrame(gameloop);
      }

  }

   var intervalId = setInterval(show,5000);
    var interval1Id =setInterval(clear,10000);
};

function show() {
    const min = 1;//以上
    const max = 5;//未満
    var randomNumber = Math.floor(Math.random() * (max - min) + min);

    for(var i = 1; i <= 4; i++){
        ctx1.strokeStyle = '#0000ff';
        ctx1.beginPath();
        ctx1.moveTo(128,0);
        ctx1.lineTo(128,256);
        ctx1.closePath();
        ctx1.stroke();
        ctx1.beginPath();
        ctx1.moveTo(0,128);
        ctx1.lineTo(256,128);
        ctx1.closePath();
        ctx1.stroke();
        const min1 = 0;//以上
        const max1 = 1000;//未満

        // L1.txtの中身を配列にしたものをランダムに4つ表示する
        var rn = Math.floor(Math.random() * (max1 - min1) + min1);


        ctx1.textAlign = "center";
    ctx1.textBaseline = "middle";
    ctx1.fillStyle = "red";
    ctx1.font = "20px Arial";
        if(i == 1){
            ctx1.fillText(b[rn],screenCanvas1.width / 4, screenCanvas1.height / 4 );
        }
        else if(i == 2){
            ctx1.fillText(b[rn], screenCanvas1.width * 3 / 4, screenCanvas1.height / 4);
        }
        else if(i == 3){
            ctx1.fillText(b[rn], screenCanvas1.width / 4, screenCanvas1.height * 3  / 4);
        }
        else{
            ctx1.fillText(b[rn], screenCanvas1.width * 3  / 4, screenCanvas1.height * 3  / 4);
        }
    }
}

function clear(){
    // screen1クリア
    ctx1.clearRect(0, 0, screenCanvas1.width, screenCanvas1.height);

}
