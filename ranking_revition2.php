<?php
$f = file_get_contents("settings.txt");
$con = array();
$con = explode(",", $f);
$name=$con[0];
if( isset($_GET['score']) && isset($_GET['answer']) && isset($_GET['result']) ){
   $result = $_GET['answer']. "/". $_GET['result'];
   $fw = fopen("ranking.txt", "a"); // 追記する
   fwrite( $fw, date("y/m/d H:i:s").",".$name.",".$_GET['score']. ",". $result. "\n");
   fclose($fw);
}
?>
