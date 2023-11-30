<?php
    $username = $_POST["username"];
    $bgm = isset($_POST["bgm"]) ? 'yes' : 'no';
    $volume = $_POST["volume"];
    $soundEffect = isset($_POST["sound_effect"]) ? 'yes' : 'no';

    // ファイルに保存

    $fw = fopen("settings.txt", "w");
    fwrite($fw, $username.",");
    fwrite($fw, $bgm.",");
    fwrite($fw, $volume.",");
    fwrite($fw, $soundEffect."\n");
    fclose($fw);
    header('Location:option.php');
?>
