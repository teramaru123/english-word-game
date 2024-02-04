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
var lastKeyDownTime = 0;
var answerArray = []; //解答を格納
var cnt = 0; //解答格納時に使用
var cnt1 = 0;　//正誤を格納
var ans = 0;　//プレイヤーの回答を格納
var ctx1;
var resultArray = []; //解答の正誤を格納、1or0
var meanArray = [];//解答の意味を格納
var lALKDT = 0;
var lADKDT = 0;
var run1;
var  animationFrameId;
var array3 = [];
var tid = null;
var st,en;//タイマーに使用
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
    st = new Date().getTime();
    timer();
  // スクリーンの初期化
  screenCanvas = document.getElementById('screen');
  screenCanvas1 = document.getElementById('screen1');

  // 2dコンテキスト
  ctx = screenCanvas.getContext('2d');
  ctx1 = screenCanvas1.getContext('2d');

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
//  screenCanvas.addEventListener('mousedown', fireBullet, true);
 window.addEventListener('resize', resizeCanvas, false); // ウィンドウリサイズ時のイベント追加
  // エレメント関連
    info = document.getElementById('info');

     resizeCanvas();
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
        screenCanvas1.height = windowHeight - 50;
    // HTMLを更新
      info.innerHTML = "現在のスコア: " + scoreManager.score + "<br>位置: " + ans;

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
        Date.now() - lastKeyDownTime > 3000
      ) {
        // 当たった場合の処理
          run = false;
          scoreManager.stopScoring(); // スコア増加の setInterval を停止
          alert('ゲームオーバー\nスコア：'+ scoreManager.getCurrentScore());
          var score = scoreManager.getCurrentScore();
          _d = new Date().getTime(); //キャッシュ回避のため日時を利用する
          var cnt = 0;
          for (var i = 0; i < resultArray.length; i++) {
              if ( resultArray[i] == 1 ) {
                  cnt++;
              }
          }
          $.get("ranking.php?&score=" + scoreManager.getCurrentScore() + "&answer=" + cnt + "&result=" + resultArray.length, function(){
             // ranking();
          });




        // アラートを閉じてから別のページに遷移
          setTimeout(function () {
              //ローカルストレージに保存し、リザルト画面で用いる
              localStorage.setItem('resultArray', JSON.stringify(resultArray));//正誤
              localStorage.setItem('answerArray', JSON.stringify(answerArray));//正解の英単語
              localStorage.setItem('meanArray', JSON.stringify(meanArray));//問題
              localStorage.setItem('score', JSON.stringify(score));
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

// 自機の位置に応じてanswer変数に値を格納
    if (player.x <= screenCanvas.width / 2 && player.y <= screenCanvas.height / 2) {
      // 左上
      ans = 0;
    } else if (player.x > screenCanvas.width / 2 && player.y <= screenCanvas.height / 2) {
      // 右上
      ans = 1;
    } else if (player.x > screenCanvas.width / 2 && player.y > screenCanvas.height / 2) {
      // 右下
      ans = 2;
    } else if (player.x <= screenCanvas.width / 2 && player.y > screenCanvas.height / 2) {
      // 左下
      ans = 3;
    }



    // プレイヤーがキャンバス外に出ないように制限
    player.x = Math.max(10, Math.min(player.x, screenCanvas.width - 10));
    player.y = Math.max(10, Math.min(player.y, screenCanvas.height - 10));


    // フラグにより再帰呼び出し
      if(run){
          requestAnimationFrame(gameloop);
      }

    }

// 最初に10秒後に show() を実行
setTimeout(function () {
    show();

    // 以降は25秒おきに show() を実行する interval
    const intervalId = setInterval(function () {
        show();
    }, 25000); // 25000ミリ秒＝25秒ごとに show() を実行
}, 10000); // 10000ミリ秒＝10秒後に show() を実行

  //何秒おきに表示、何秒表示するのかによって変動、現時点では10秒おきに15秒表示にしている、25秒周期で削除
    var interval1Id =setInterval(clear,25000);
};

function show() {
    info.innerHTML = "現在のスコア: " + scoreManager.score + "<br>位置: " + ans;
    const min = 0;//以上
    const max = 4;//未満
    var array = [];//4択を表示
    var barray = [];//3択に使用
    var carray = [];
    var j = 0;
    var cnt2 = 0;//正解以外から2単語抽出するとき使用
    var temp = -1;//正解以外から2単語抽出するとき使用
    var answer = Math.floor(Math.random() * (max - min) + min); //0～3でランダムに正解の番号を生成

    const min1 = 0;//以上
    const max1 = 1000;//未満 テキストファイルの単語数に合わせた方が良いかも

        // L1.txt(テキストファイル)の中身を配列にしたものをランダムに4つ抽出
    for(var i = 0; i < 4; i++){
        var rn = Math.floor(Math.random() * (max1 - min1) + min1);
        array[i] = b[rn];
        barray[i] = b[rn];
        if(i == answer){
            meanArray[cnt] = c[rn];
            carray[cnt] = b[rn];
        }
    }

    //4択からanswer抜きの2つを選択
    while(cnt2 < 2){
        var r = Math.floor(Math.random() * (max - min) + min);//0～3
        if(answer != r && temp != r){
            array3[j] = barray[r];
            j++;
            cnt2++;
            temp = r;
        }
    }
    array3[2] = carray[cnt];
     var pos = Math.floor(Math.random() * 3 + 1);//3択時の正解番号生成 0～2
   // countdown();制限時間を表示//まだ動かない
    loop();

    function loop(){
        run1 = true;
        // screen1クリア
        ctx1.clearRect(0, 0, screenCanvas1.width, screenCanvas1.height);
        //縦、横線を描く
        ctx1.strokeStyle = 'black';
        ctx1.beginPath();
        ctx1.moveTo(screenCanvas1.width / 2,0);
        ctx1.lineTo(screenCanvas1.width / 2,screenCanvas1.height);
        ctx1.closePath();
        ctx1.stroke();
        ctx1.beginPath();
        ctx1.moveTo(0,screenCanvas1.height / 2);
        ctx1.lineTo(screenCanvas1.width,screenCanvas1.height / 2);
        ctx1.closePath();
        ctx1.stroke();

         // 背景を半透明に
    ctx1.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx1.fillRect(0, 0, screenCanvas1.width / 2, screenCanvas1.height / 2);

    ctx1.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx1.fillRect(screenCanvas1.width / 2, 0, screenCanvas1.width / 2, screenCanvas1.height / 2);

    ctx1.fillStyle = "rgba(255, 255, 0, 0.2)";
    ctx1.fillRect(0, screenCanvas1.height / 2, screenCanvas1.width / 2, screenCanvas1.height / 2);

    ctx1.fillStyle = "rgba(0, 128, 0, 0.2)";
        ctx1.fillRect(screenCanvas1.width / 2, screenCanvas1.height / 2, screenCanvas1.width / 2, screenCanvas1.height / 2);

        ctx1.textAlign = "center";
   　　 ctx1.textBaseline = "middle";
        ctx1.fillStyle = "black";
        ctx1.font = "20px Arial";
        //4択
        if(Date.now() - lADKDT >= 15000){
            for(i = 0; i < 4; i++){

                if(i == 0){
                    ctx1.fillText(array[i],screenCanvas1.width / 4, screenCanvas1.height / 4 );
                }
                else if(i == 1){
                    ctx1.fillText(array[i], screenCanvas1.width * 3 / 4, screenCanvas1.height / 4);
                }
                else if(i == 2){
                    ctx1.fillText(array[i], screenCanvas1.width * 3 / 4, screenCanvas1.height * 3  / 4);
                }
                else{

                    ctx1.fillText(array[i], screenCanvas1.width / 4, screenCanvas1.height * 3  / 4);
                }
                if(answer == i){
                    ctx1.fillText(meanArray[cnt],screenCanvas1.width / 2, screenCanvas1.height / 10 );
                    answerArray[cnt] = array[i];
                }
            }
        }
        //3択
        else{
             ctx1.clearRect(0, 0, screenCanvas1.width, screenCanvas1.height);
      ctx1.fillStyle = "rgba(255,0,0,0.1)";
  ctx1.beginPath();
  ctx1.moveTo(screenCanvas1.width / 2 , screenCanvas1.height /2);
  ctx1.arc(screenCanvas1.width / 2 + 50, screenCanvas1.height / 2, screenCanvas1.height , 0, 2 * Math.PI / 3);
  ctx1.closePath();
  ctx1.fill();

  ctx1.fillStyle = "rgba(0,255,0,0.1)";
  ctx1.beginPath();
  ctx1.moveTo(screenCanvas1.width / 2, screenCanvas1.height / 2);
  ctx1.arc(screenCanvas1.width / 2 + 50, screenCanvas1.height / 2, screenCanvas1.height , 2 * Math.PI / 3, 4 * Math.PI / 3);
  ctx1.closePath();
  ctx1.fill();

  ctx1.fillStyle = "rgba(0,0,255,0.1)";
  ctx1.beginPath();
  ctx1.moveTo(screenCanvas1.width / 2, screenCanvas1.height / 2);
  ctx1.arc(screenCanvas1.width / 2 + 50, screenCanvas1.height / 2, screenCanvas1.height , 4 * Math.PI / 3, 2 * Math.PI);
  ctx1.closePath();
  ctx1.fill();

 ctx1.textAlign = "center";
 ctx1.textBaseline = "middle";
 ctx1.fillStyle = "black";
 ctx1.font = "20px Arial";
            for(i = 0; i < 3; i++){
                if(i == (pos % 3)){
                    ctx1.fillText(array3[i], screenCanvas1.width * 3 / 4, screenCanvas1.height / 4);//　位置2
                    if(i == 2){
                        answer = 2;
                    }
                }
                   else if(i == ((pos + 1) % 3)){
                       ctx1.fillText(array3[i], screenCanvas1.width * 3 / 4, screenCanvas1.height * 3 / 4);//位置0
                       if(i == 2){
                        answer = 0;
                    }
                }
                   else if(i == ((pos + 2) % 3)){
                       ctx1.fillText(array3[i], screenCanvas1.width / 4, screenCanvas1.height / 2);//位置1
                       if(i == 2){
                        answer = 1;
                    }
                }
                ctx1.fillText(meanArray[cnt],screenCanvas1.width / 2, screenCanvas1.height / 10 );//問題表示
            }
       var playerAngle = Math.atan2(player.y - screenCanvas1.height / 2, player.x - (screenCanvas1.width / 2 + 50));
    playerAngle = (playerAngle + 2 * Math.PI) % (2 * Math.PI); // 負の値を正の値に変換
    if (playerAngle >= 0 && playerAngle < 2 * Math.PI / 3) {
      // color1の領域
      ans = 0;
    } else if (playerAngle >= 2 * Math.PI / 3 && playerAngle < 4 * Math.PI / 3) {
      // color2の領域
      ans = 1;
    } else {
      // color3の領域
      ans = 2;
    }
        }

        // フラグにより再帰呼び出し
        if(run1){
             animationFrameId = requestAnimationFrame(loop);
         }
    }

    setTimeout(function () {
        judge(answer);
    }, 10000); // 10000ミリ秒＝10秒後に judge() を実行

}


function clear(){
    cnt++;
    run1 = false;
     cancelAnimationFrame(animationFrameId);
    // screen1クリア
    ctx1.clearRect(0, 0, screenCanvas1.width, screenCanvas1.height);



}

function judge(answer){
     var displayTextElement = document.getElementById('displayText');
        var judgeAnswer = answer;

    if(ans == judgeAnswer){
        console.log("正解");
        displayTextElement.textContent = "正解!";
        resultArray[cnt1] = 1;
    }
    else{
        console.log("不正解");
         displayTextElement.textContent = "不正解!";
        resultArray[cnt1] = 0;
    }
    cnt1++;
    setTimeout(hideResult, 5000);
}

function ranking() {
            _d = new Date().getTime(); //キャッシュ回避のため日時を利用する
    $.get("ranking.php?_d=" + _d);
}

// ウィンドウリサイズ時の処理
      function resizeCanvas() {
          screenCanvas.width = window.innerHeight / 2; // 縦幅はウィンドウの高さと同じ
          screenCanvas1.width = window.innerHeight / 2; // 縦幅はウィンドウの高さと同じ
          screenCanvas.height = window.innerHeight;
          screenCanvas1.height = window.innerHeight;
          screenCanvas.style.left = (window.innerWidth - screenCanvas.width) / 2 + 'px'; // キャンバスをウィンドウの中央に配置
          screenCanvas1.style.left = (window.innerWidth - screenCanvas1.width) / 2 + 'px'; // キャンバスをウィンドウの中央に配置
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
function timer(){
en = new Date().getTime();
time = (en - st) / 1000;
document.getElementById("timer").innerHTML = time;
tid = setTimeout("timer()", 1);
}
function hideResult() {
    var displayTextElement = document.getElementById('displayText');
            displayTextElement.textContent = '';
}
/*制限時間を表示する関数まだ動かない
function countdown() {
    var sec = 10;
     document.getElementById("time").innerHTML = sec;

  // インターバルを設定してカウントダウンを実行
  var interval = setInterval(function() {
      // カウントを表示
      document.getElementById("time").innerHTML = sec;
    console.log(sec);
    // カウントを減らす
    sec--;

    // カウントが0になったらインターバルをクリアして終了
    if (sec < 0) {
      clearInterval(interval);
      console.log("カウントダウン終了");
    }
  }, 1000); // 1000ミリ秒ごとに実行
}
*/
