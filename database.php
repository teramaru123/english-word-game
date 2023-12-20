<?php
session_start();
$con = mysqli_connect('localhost','i468yano','') or die("接続失敗");
mysqli_select_db($con, 'i468yano') or die("選択失敗");
mysqli_query($con, 'SET NAMES utf8');
$word = $_POST['word'];
$word = addslashes($word);
$sql = "SELECT * FROM svl5000 WHERE word = '$word'";
$res = mysqli_query($con, $sql) or die("エラー");

while(1){
$r = rand(1000, 5999);
if( !isset($d[$r]) ) break;
}



$level = (int)($r / 1000);
$id = $r % 1000 + 1;
$sql = "SELECT * FROM svl5000 WHERE level=$level and id=$id";
$res = mysqli_query($con, $sql) or die("エラー");
$db = mysqli_fetch_assoc($res);

$meaning = $db['meaning'];
$word =$db['word'];
$rp = rand(1, 4);
$_SESSION['level'] = $level;
$_SESSION['id'] = $id;
$_SESSION['answer'] = $rp;

$data;
$array = array();

for($i = 1; $i <= 4; $i++){
if( $i == $rp ) {
$data =$level.$meaning.$word;
}else{
$r = rand(1000,5999);
$id = $r % 1000 + 1;
$sql = "SELECT * FROM svl5000 WHERE level=$level and id=$id";
$res = mysqli_query($con, $sql) or die("エラー");
$db = mysqli_fetch_assoc($res);
$data=$level.$db['meaning'];
}
$array[] = $data;
}
mysqli_close($con);

echo json_encode($array);
?>
