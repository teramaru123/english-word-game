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

// ScoreManager クラス
class ScoreManager {
  constructor() {
    this.score = 0;
    this.scoreInterval = null; // スコア増加の setInterval を管理するための変数を追加
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

    for (var i = enemyBulletList.length-1; i >= 0 ; i--) {
      enemyBulletList[i].move();

      if (enemyBulletList[i].y > screenCanvas.height) {
        enemyBulletList.splice(i, 1);
      } else {
        enemyBulletList[i].draw();
      }

      if (
        enemyBulletList[i].x > player.x - 10 &&
        enemyBulletList[i].x < player.x + 10 &&
        enemyBulletList[i].y > player.y - 10 &&
        enemyBulletList[i].y < player.y + 10
      ) {
        // 当たった場合の処理
        run = false;
        scoreManager.stopScoring(); // スコア増加の setInterval を停止
        alert('ゲームオーバー\nスコア：'+ scoreManager.getCurrentScore());
          $.get("ranking.php?&score=" + scoreManager.getCurrentScore(), function(){
              ranking();
          });

        // アラートを閉じてから別のページに遷移
        setTimeout(function () {
          window.location.href = './uncon.html';  // 遷移先のURLを指定
        }, 10);
        return;
      }

        function ranking() {
            _d = new Date().getTime(); //キャッシュ回避のため日時を利用する
            $.get("6ranking.php?_d=" + _d, function(data){
                var a = data.split("\n"); //改行で区切る
                var table = "<table border=1 cellspacing=0 cellpadding=2>";
                table += "<tr><td>順位</td><td>時間</td><td>名前</td><td>日時</td></tr>";
                for(i=0;i<a.length-1;i++){
                    var b = a[i].split(","); //カンマで区切る
                    table += "<tr><td>" + (i+1) + "</td><td>" + b[2] + "</td><td>"
                        + b[1] + "</td><td>" + b[0] + "</td></tr>";
                }
                table += "</table>";
                document.getElementById("ranking").innerHTML = table;
            });
        }

    }

    // プレイヤー、敵機の移動処理
    player.update();
    enemy.update();

    // プレイヤーがキャンバス外に出ないように制限
    player.x = Math.max(10, Math.min(player.x, screenCanvas.width - 10));
    player.y = Math.max(10, Math.min(player.y, screenCanvas.height - 10));


    // フラグにより再帰呼び出し
    if(run){requestAnimationFrame(gameloop);}
  }

};
