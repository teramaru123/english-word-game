<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ホーム画面</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }

        canvas {
            display: block;
            margin: auto;
            cursor: default;
            border: 2px solid #000; /* Canvasを境界で囲むためのスタイル */
            position: absolute;
            z-index: -1;
        }

        h3 {
            text-align: center;
            margin-top: 20px;
            color: #333; /* ユーザ名の色 */
        }

        #video {
            display: none;
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
    <h3>ユーザ名: <?php echo $user_name ?></h3>
    <canvas id="myCanvas"></canvas>
    <video id="video" autoplay muted loop>
        <source src="background.mp4" type="video/mp4">
    </video>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');

             video.addEventListener('loadedmetadata', function () {
            setCanvasSize();
        });

        video.addEventListener('play', function () {
            drawFrame();
        });


            function drawFrame() {
                if (video.paused || video.ended) {
                    return;
                }

                // 動画を描画
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // テキストと矩形を描画
                drawTextAndRect();

                requestAnimationFrame(drawFrame);
             }

            function drawTextAndRect() {
                context.globalAlpha = 0.9; // 透明度を設定


                var fontSize1 = Math.min(canvas.width / 31, canvas.height / 12);
                context.font = 'bold ' + fontSize1 + 'px Arial';
                context.strokeStyle='red';
                context.fillStyle = 'red';
                context.strokeText('VOCABULARY STRIKE!', canvas.width / 3, canvas.height / 5);
                context.fillText('VOCABULARY STRIKE!', canvas.width / 3, canvas.height / 5);

                // 矩形を描画
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

                    // 矩形のスタイルを適用
                    context.fillStyle = "white";
                    context.fillRect(x, y, canvas.width / 5, canvas.height / 6);
                    context.strokeStyle = "red";
                    context.strokeRect(x, y, canvas.width / 5, canvas.height / 6);

                    // テキストのスタイルを適用
                    var fontSize = Math.min(canvas.width / 62, canvas.height / 23);
                    context.font = 'bold ' + fontSize + 'px Arial';
                    //context.fillStyle = "#333";
                    context.fillStyle = "black";

                    var text;
                    if (i === 1) {
                        text = "過去のスコア";
                    } else if (i === 2){
                        text = "オンラインランキング";
                    } else if (i === 3) {
                        text = "オプション";
                    } else if (i === 4) {
                        text = "ゲームスタート";
                    }
                    var textX = x + (canvas.width / 5 - context.measureText(text).width) / 2;
                    var textY = y + (canvas.height / 6) / 2;
                    context.fillText(text, textX, textY);
                }

                context.globalAlpha = 1; // 透明度を元に戻す
            }

            canvas.addEventListener("click", function (event) {
                var rect = canvas.getBoundingClientRect();
                var clickX = event.clientX - rect.left;
                var clickY = event.clientY - rect.top;

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

                var rectCount = 4;
                var row1Count = 3;
                var spacing = canvas.width / (row1Count + 1);
                var row1Y = (canvas.height / 6) * 1.7;
                var row2Y = (canvas.height / 6) * 3.5;

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

            video.playbackRate = 0.75; // 動画再生速度を遅くする場合は、0.5などの値
            if(video.paused){
            video.play().then(function () {
                // 自動再生が成功した場合のコード
            }).catch(function (error) {
                console.error('動画再生エラー:', error);
            });
          }
            // 最初の描画
            setCanvasSize();
            drawFrame();
        });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                setCanvasSize();
            }, 250); // 250ミリ秒の遅延でresize後の最後のイベントだけを処理
        });

        function setCanvasSize() {
            var canvas = document.getElementById('myCanvas');
            var video = document.getElementById('video');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            video.width = window.innerWidth;
            video.height = window.innerHeight;
        }
    </script>
</body>
</html>
            
          

              
