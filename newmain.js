// - global -------------------------------------------------------------------
var screenCanvas, info;
var basic = 256;
var run = true;
var player = new Player();
var enemy = new Enemy();
var ctx; // コンテキスト格納
var own = new Image(); // 自機画像
var enemyImage = new Image();
var bulletImage = new Image(); // 弾画像
var invincibleImage = new Image();
var deleteImage = new Image();
var reduceImage = new Image();
var addscoreImage = new Image();
var bulletList = [];
var enemyBulletList = [];
var invincibleList = [];
var invincibleLeft = 0;
var deleteList = [];
var deleteLeft = 0;
var reduceList = [];
var reduceLeft = 0;
var addscoreList = [];
var shotSound = new Audio('shot.mp3'); // "shot.mp3" ファイルを読み込む
var lALKDT = 0;
var lADKDT = 0;
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
  // screenCanvasの初期化
  screenCanvas = document.getElementById('screen');
  ctx = screenCanvas.getContext('2d');
  player.x = reSet(player.x,basic,window.innerHeight/2);
  player.y = reSet(player.y,basic,window.innerHeight-window.innerHeight/5);
  player.size = reSet(player.size,basic,window.innerHeight);
  enemy.size = reSet(enemy.size,basic,window.innerHeight);
  player.bulletsize = reSet(player.bulletsize,basic,window.innerHeight);
  enemy.bulletsize = reSet(enemy.bulletsize,basic,window.innerHeight);
  basic = window.innerHeight;



  // イベントの登録
  window.addEventListener('keydown', keyDown, true);
  window.addEventListener('keyup', keyUp, true);
  window.addEventListener('resize', resizeCanvas, false); // ウィンドウリサイズ時のイベント追加

  // エレメント関連
  info = document.getElementById('info');

  // ゲームループの前に一度実行しておく
  resizeCanvas();
  console.log(screenCanvas);

  // 画像初期化
  own.src = "own.png";
  enemyImage.src = "enemy.png";
  bulletImage.src = "bullet.png";
  invincibleImage.src = "own.png";
  deleteImage.src = "enemy.png";
  reduceImage.src = "own.png";
  addscoreImage.src = "enemy.png";

  var scoreManager = new ScoreManager();
  scoreManager.startScoring();
  // keymove.js で参照できるように scoreManager をグローバルに設定
  window.scoreManager = scoreManager;

  gameloop();

  // ループ処理を呼び出す
  function gameloop(){
    // ウィンドウの幅と高さを取得
    var windowHeight = window.innerHeight;

    screenCanvas.height = windowHeight - 50;
    // HTMLを更新
    info.innerHTML = "現在のスコア: " + scoreManager.score;

    // screenクリア
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);



    // 自機、敵機の画像を表示
    ctx.drawImage(own, player.x, player.y, player.size, player.size);
    ctx.drawImage(enemyImage, enemy.x, enemy.y ,enemy.size,enemy.size);

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
        enemyBulletList[i].x  > player.x &&
        enemyBulletList[i].x  < player.x + player.size &&
        enemyBulletList[i].y  > player.y  &&
        enemyBulletList[i].y  < player.y + player.size &&
        Date.now() - lALKDT > 3000
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

      if(!bulletList[i]){
        continue;
      }
      // 敵に弾が当たったかを判定
      if (bulletList[i].x > enemy.x - enemy.size &&
        bulletList[i].x < enemy.x + enemy.size &&
        bulletList[i].y > enemy.y - enemy.size &&
        bulletList[i].y < enemy.y + enemy.size) {
          // 当たった場合の処理
          bulletList.splice(i, 1); // 弾を削除
          scoreManager.score += 110; // スコア加算
          scoreManager.displayScore(); // スコア表示更新
          if(Math.random() < 0.1){
            if(Math.random() < 0.25){
            var invincible = new Item(enemy.x,enemy.y,invincibleImage);
            invincibleList.push(invincible);
          }else if(Math.random() < 0.5){
            var sakujyo = new Item(enemy.x,enemy.y,deleteImage);
            deleteList.push(sakujyo);
          }else if(Math.random() < 0.75){
            var reduce = new Item(enemy.x,enemy.y,reduceImage);
            reduceList.push(reduce);
          }else{
            var addscore = new Item(enemy.x,enemy.y,addscoreImage);
            addscoreList.push(addscore);
          }
          }
        }
      }

      //無敵アイテムの取得
      for (var i = invincibleList.length-1; i >= 0 ; i--) {
        invincibleList[i].move();

        // アイテムが画面外に出たら削除
        if (invincibleList[i].y < 0) {
          invincibleList.splice(i, 1);
        } else {
          invincibleList[i].draw();
        }

        if(!invincibleList[i]){
          continue;
        }
        // 自分にアイテムが当たったかを判定
        if (invincibleList[i].x  > player.x &&
          invincibleList[i].x  < player.x + player.size &&
          invincibleList[i].y  > player.y  &&
          invincibleList[i].y  < player.y + player.size ) {
            // 当たった場合の処理
            invincibleList.splice(i, 1); // 弾を削除
            invincibleLeft += 1;
          }
        }

        //弾削除アイテムの取得
        for (var i = deleteList.length-1; i >= 0 ; i--) {
          deleteList[i].move();

          // アイテムが画面外に出たら削除
          if (deleteList[i].y < 0) {
            deleteList.splice(i, 1);
          } else {
            deleteList[i].draw();
          }

          if(!deleteList[i]){
            continue;
          }
          // 自分にアイテムが当たったかを判定
          if (deleteList[i].x  > player.x &&
            deleteList[i].x  < player.x + player.size &&
            deleteList[i].y  > player.y  &&
            deleteList[i].y  < player.y + player.size ) {
              // 当たった場合の処理
              deleteList.splice(i, 1); // 弾を削除
              deleteLeft += 1;
            }
          }

          //選択肢削除アイテムの取得
          for (var i = reduceList.length-1; i >= 0 ; i--) {
            reduceList[i].move();

            // アイテムが画面外に出たら削除
            if (reduceList[i].y < 0) {
              reduceList.splice(i, 1);
            } else {
              reduceList[i].draw();
            }

            if(!reduceList[i]){
              continue;
            }
            // 自分にアイテムが当たったかを判定
            if (reduceList[i].x  > player.x &&
              reduceList[i].x  < player.x + player.size &&
              reduceList[i].y  > player.y  &&
              reduceList[i].y  < player.y + player.size ) {
                // 当たった場合の処理
                reduceList.splice(i, 1); // 弾を削除
                reduceLeft += 1;
              }
            }

            //スコア加算アイテムの取得
            for (var i = addscoreList.length-1; i >= 0 ; i--) {
              addscoreList[i].move();

              // アイテムが画面外に出たら削除
              if (addscoreList[i].y < 0) {
                addscoreList.splice(i, 1);
              } else {
                addscoreList[i].draw();
              }

              if(!addscoreList[i]){
                continue;
              }
              // 自分にアイテムが当たったかを判定
              if (addscoreList[i].x  > player.x &&
                addscoreList[i].x  < player.x + player.size &&
                addscoreList[i].y  > player.y  &&
                addscoreList[i].y  < player.y + player.size ) {
                  // 当たった場合の処理
                  addscoreList.splice(i, 1); // 弾を削除
                  scoreManager.score += 1001;
                }
              }

        // プレイヤー、敵機の移動処理
        player.update();
        enemy.update();

        // プレイヤーがキャンバス外に出ないように制限
        player.x = Math.max(10, Math.min(player.x, screenCanvas.width - 10));
        player.y = Math.max(10, Math.min(player.y, screenCanvas.height - 10));

        // 自機の位置に応じてanswer変数に値を格納
        if(Date.now() - lADKDT >= 5000){
          // 背景を四色で薄めの半透明に塗る
          ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
          ctx.fillRect(0, 0, screenCanvas.width / 2, screenCanvas.height / 2);

          ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
          ctx.fillRect(screenCanvas.width / 2, 0, screenCanvas.width / 2, screenCanvas.height / 2);

          ctx.fillStyle = "rgba(255, 255, 0, 0.1)";
          ctx.fillRect(screenCanvas.width / 2, screenCanvas.height / 2, screenCanvas.width / 2, screenCanvas.height / 2);

          ctx.fillStyle = "rgba(0, 128, 0, 0.1)";
          ctx.fillRect(0, screenCanvas.height / 2, screenCanvas.width / 2, screenCanvas.height / 2);
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
        }else{
          ctx.fillStyle = "rgba(255,0,0,0.1)";
          ctx.beginPath();
          ctx.moveTo(screenCanvas.width / 2 , screenCanvas.height /2);
          ctx.arc(screenCanvas.width / 2 + 50, screenCanvas.height / 2, screenCanvas.height , 0, 2 * Math.PI / 3);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(0,255,0,0.1)";
          ctx.beginPath();
          ctx.moveTo(screenCanvas.width / 2, screenCanvas.height / 2);
          ctx.arc(screenCanvas.width / 2 + 50, screenCanvas.height / 2, screenCanvas.height , 2 * Math.PI / 3, 4 * Math.PI / 3);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(0,0,255,0.1)";
          ctx.beginPath();
          ctx.moveTo(screenCanvas.width / 2, screenCanvas.height / 2);
          ctx.arc(screenCanvas.width / 2 + 50, screenCanvas.height / 2, screenCanvas.height , 4 * Math.PI / 3, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();

          var playerAngle = Math.atan2(player.y - screenCanvas.height / 2, player.x - (screenCanvas.width / 2 + 50));
          playerAngle = (playerAngle + 2 * Math.PI) % (2 * Math.PI); // 負の値を正の値に変換
          if (playerAngle >= 0 && playerAngle < 2 * Math.PI / 3) {
            // color1の領域
            ans = 1;
          } else if (playerAngle >= 2 * Math.PI / 3 && playerAngle < 4 * Math.PI / 3) {
            // color2の領域
            ans = 2;
          } else {
            // color3の領域
            ans = 3;
          }
        }

        // フラグにより再帰呼び出し
        if(run){requestAnimationFrame(gameloop);}
      }

      // ウィンドウリサイズ時の処理
      function resizeCanvas() {
        screenCanvas.width = window.innerHeight / 2; // 縦幅はウィンドウの高さと同じ
        screenCanvas.height = window.innerHeight;
        screenCanvas.style.left = (window.innerWidth - screenCanvas.width) / 2 + 'px'; // キャンバスをウィンドウの中央に配置
        player.x = reSet(player.x,basic,window.innerHeight);
        player.y = reSet(player.y,basic,window.innerHeight);
        player.size = reSet(player.size,basic,window.innerHeight);
        enemy.nextx = reSet(enemy.nextx,basic,window.innerHeight);
        enemy.nexty = reSet(enemy.nexty,basic,window.innerHeight);
        enemy.x = reSet(enemy.x,basic,window.innerHeight);
        enemy.y = reSet(enemy.y,basic,window.innerHeight);
        enemy.size = reSet(enemy.size,basic,window.innerHeight);
        for (var i = enemyBulletList.length-1; i >= 0 ; i--) {
          enemyBulletList[i].size = reSet(enemy.bulletsize,basic,window.innerHeight);
        }
        enemy.bulletsize = reSet(enemy.bulletsize,basic,window.innerHeight);
        for (var i = bulletList.length-1; i >= 0 ; i--) {
          bulletList[i].size = reSet(player.bulletsize,basic,window.innerHeight);
        }
        player.bulletsize = reSet(player.bulletsize,basic,window.innerHeight);
        basic = window.innerHeight;
      }


    };
