<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ゲームのオプション</title>
     <style>
        label {
            display: block;
            margin-bottom: 5px;
        }
     </style>
</head>
<body>
  <h1>ゲームのオプション</h1>
    <?php
    $filename = "settings.txt";

    // データの初期化
    $user_name = "";
    $bgm = "";
    $volume = "";
    $sound_effect = "";

    if (file_exists($filename)) {
        $content = file_get_contents($filename);

        // カンマで分割して配列に格納
        $pair = explode(",", $content);

        // 各変数に値を代入
        if (count($pair) >= 4) {
            $user_name = trim($pair[0]);
            $bgm = trim($pair[1]);
            $volume = trim($pair[2]);
            $sound_effect = trim($pair[3]);
        }
    }
    ?>
    <form action="save_settings.php" method="post">
        ユーザ名の変更
        <input type="text" id="username" name="username" value="<?php echo $user_name; ?>" required><br>

         <label for="volume">音量:</label>
        <input type="range" id="volume" name="volume" min="0" max="100" value="<?php echo $volume; ?>">
        <span id="volume-display"><?php echo $volume; ?></span><br>

        <label for="bgm">BGM:</label>
        <input type="checkbox" id="bgm" name="bgm" value="yes" <?php echo ($bgm === 'yes') ? 'checked' : ''; ?>><br>

        <label for="sound_effect">効果音:</label>
        <input type="checkbox" id="sound_effect" name="sound_effect" value="yes" <?php echo ($sound_effect === 'yes') ? 'checked' : ''; ?>><br>

        <input type="submit"  onclick = "checkAndShowAlert()" value="保存">
    </form>

    <script>
      function checkAndShowAlert() {
        var usernameInput = document.getElementById('username');
        var usernameValue = usernameInput.value.trim(); // 余分な空白を取り除く

        if (usernameValue !== "") {
            showAlert();
        }
    }

      function showAlert() {
            alert("保存しました");
        }
        // 音量の変更時に表示を更新する
        document.getElementById('volume').addEventListener('input', function() {
            document.getElementById('volume-display').textContent = this.value;
        });

        // BGM関連のスクリプト
        var audio = new Audio("BGM.mp3");
        let volume = document.getElementById('volume');
        let range = document.getElementById('volume-display');
        audio.volume = volume.value / 100;

        document.getElementById('bgm').addEventListener('change', function() {
            if(this.checked) {
                audio.play();
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        });

       var audio1 = new Audio("SE.mp3");
        audio1.volume = volume.value / 100;

        document.getElementById('sound_effect').addEventListener('change', function() {
            if(this.checked) {
                audio1.play();
            } else {
                audio1.pause();
                audio1.currentTime = 0;
            }
        });

      volume.addEventListener("input", function() {
            audio.volume = volume.value / 100;
            audio1.volume = volume.value / 100;
            range.textContent = volume.value;
        }, false);
    </script>
</body>
</html>
