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
var ans = 0; //プレイヤーの回答を格納

class ScoreManager {
  constructor() {
    this.score = 0;
    this.scoreInterval = null;
  }

  startScoring() {
    this.scoreInterval = setInterval(() => {
      this.score += 100;
      this.displayScore();
    }, 10);
  }

  stopScoring() {
    clearInterval(this.scoreInterval);
  }

  displayScore() {
    info.innerHTML = "現在のスコア: " + this.score;
  }

  getCurrentScore() {
    return this.score;
  }
}

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
  enemyImage.src = "enemy.png";
  bulletImage.src = "bullet.png";

  var scoreManager = new ScoreManager();
  scoreManager.startScoring();
  // keymove.js で参照できるように scoreManager をグローバルに設定
  window.scoreManager = scoreManager;


  gameloop();

  // ループ処理を呼び出す
  function gameloop(){
    // HTMLを更新
    info.innerHTML = "現在のスコア: " + scoreManager.score + "<br>位置: " + ans;

    // screenクリア
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

    // 背景を半透明に
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fillRect(0, 0, screenCanvas.width / 2, screenCanvas.height / 2);

    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fillRect(screenCanvas.width / 2, 0, screenCanvas.width / 2, screenCanvas.height / 2);

    ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
    ctx.fillRect(0, screenCanvas.height / 2, screenCanvas.width / 2, screenCanvas.height / 2);

    ctx.fillStyle = "rgba(0, 128, 0, 0.2)";
    ctx.fillRect(screenCanvas.width / 2, screenCanvas.height / 2, screenCanvas.width / 2, screenCanvas.height / 2);

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

    // 自機の位置に応じてanswer変数に値を格納
    if (player.x <= screenCanvas.width / 2 && player.y <= screenCanvas.height / 2) {
      // 左上
      ans = 1;
    } else if (player.x > screenCanvas.width / 2 && player.y <= screenCanvas.height / 2) {
      // 右上
      ans = 2;
    } else if (player.x > screenCanvas.width / 2 && player.y > screenCanvas.height / 2) {
      // 右下
      ans = 3;
    } else if (player.x <= screenCanvas.width / 2 && player.y > screenCanvas.height / 2) {
      // 左下
      ans = 4;
    }


    // フラグにより再帰呼び出し
    if(run){requestAnimationFrame(gameloop);}
  }

};
