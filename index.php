<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ホーム画面</title>
    <style>
      canvas {
        display: block;
        margin: auto;
        margin-top: 50px;
        cursor: default;
      }
    </style>
</head>
<body>
  <?php
$filename = "settings.txt";
$content = file_get_contents($filename);
$pair = explode(",", $content);
$user_name = trim($pair[0]);

?>
  <h3> ユーザ名:<?php echo $user_name ?></h3>
  <canvas id="myCanvas"></canvas>

    <script>
        function setCanvasSize() {
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;


            var fontSize1 = Math.min(canvas.width / 31, canvas.height / 12);
            context.font = fontSize1 + "px Times";
            context.fillStyle = "blue";
            context.fillText("VOCABULARY STRIKE!", canvas.width / 3, canvas.height / 10);


              //短形を描画
            var rectCount = 4;
            var row1Count = 3;
            var spacing = canvas.width / (row1Count + 1);
            var row1Y = (canvas.height / 6) * 1.7;
            var row2Y = (canvas.height / 6) * 3.5;

            for (var i = 1; i <= rectCount; i++) {
                var x, y;

                if (i <= row1Count) {
                    x = (i - 0.4) * spacing;
                    y = row1Y;
                } else {
                    x = (i - row1Count + 0.6) * spacing;
                    y = row2Y;
                }
                context.strokeRect(x, y, canvas.width / 5, canvas.height / 5);

                var fontSize = Math.min(canvas.width / 62, canvas.height / 23);
                context.font = fontSize + "px Arial";
                context.fillStyle = "black";

                var text, link;
                if (i === 1) {
                    text = "過去のスコア";

                } else if (i === 2) {
                    text = "オンラインランキング";

                } else if (i === 3) {
                    text = "オプション";

                } else if (i === 4) {
                    text = "ゲームスタート";

                }
                var textX = x + (canvas.width / 5 - context.measureText(text).width) / 2;
                var textY = y + (canvas.height / 5) / 2;
                context.fillText(text, textX, textY);
            }

            canvas.addEventListener("click", function (event) {
                var rect = canvas.getBoundingClientRect();
                var clickX = event.clientX - rect.left;
                var clickY = event.clientY - rect.top;

                for (var i = 1; i <= rectCount; i++) {
                    var x, y;

                    if (i <= row1Count) {
                        x = (i - 0.4) * spacing;
                        y = row1Y;
                    } else {
                        x = (i - row1Count + 0.6) * spacing;
                        y = row2Y;
                    }

                    if (
                        clickX >= x && clickX <= x + canvas.width / 5 &&
                        clickY >= y && clickY <= y + canvas.height / 5
                    ) {
                        var link;
                        if (i === 1) {
                            link = "pastScore.html";
                        } else if (i === 2) {
                            link = "onlinRanking.html";
                        } else if (i === 3) {
                            link = "option.php";
                        } else if (i === 4) {
                            link = "gameStart.html";
                        }
                        window.location.href = link;
                    }
                }
            });

            // マウスポインタの形を設定
            canvas.addEventListener("mousemove", function(event) {
              var rect = canvas.getBoundingClientRect();
              var mouseX = event.clientX - rect.left;
              var mouseY = event.clientY - rect.top;

              var isOverRect = false;

              // マウスが短形の範囲内にあるかチェック
              for (var i = 1; i <= rectCount; i++) {
                var x, y;

                if (i <= row1Count) {
                  x = (i - 0.4) * spacing;
                  y = row1Y;
                } else {
                  x = (i - row1Count + 0.6) * spacing;
                  y = row2Y;
                }

                if (
                  mouseX >= x && mouseX <= x + canvas.width / 5 &&
                  mouseY >= y && mouseY <= y + canvas.height / 5
                ) {
                  isOverRect = true;
                  break;
                }
              }

              // マウスポインタの形を設定
              if (isOverRect) {
                canvas.style.cursor = "pointer";
              } else {
                canvas.style.cursor = "default";
              }
            });
        }

        setCanvasSize();

        window.addEventListener('resize', setCanvasSize);
    </script>
</body>
</html>
