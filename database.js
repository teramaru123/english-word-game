//Canvas上に、データベースから取得した単語の表示できるやつ
var screenCanvas, info;
var run = true;
var player = new Player();
var enemy = new Enemy();
var ctx;
var own = new Image();
var enemyImage = new Image();
var bulletImage = new Image();
var bulletList = [];
var enemyBulletList = [];
var isDataReceived = false;
var gameData;

window.onload = function () {
    screenCanvas = document.getElementById('screen');
    screenCanvas.width = 256;
    screenCanvas.height = 256;
    ctx = screenCanvas.getContext('2d');

    window.addEventListener('keydown', keyDown, true);
    window.addEventListener('keyup', keyUp, true);
    screenCanvas.addEventListener('mousedown', fireBullet, true);

    info = document.getElementById('info');
    getDataFromPHP();
};

function getDataFromPHP() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "database.php", true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseData = JSON.parse(this.responseText);
            console.log("PHPからデータを受信:", responseData);

            gameData = responseData;
            isDataReceived = true;

            drawDataOnCanvas(); // データを取得した後に描画を行う
        }
    };

    xmlhttp.send();
}

function drawDataOnCanvas() {
    if (isDataReceived) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

        for (var i = 0; i < gameData.length; i++) {
            var text = gameData[i];
            // 各要素を異なるy座標に描画
            ctx.fillText(text, 128, 20 + i * 50);
        }
    }
}
