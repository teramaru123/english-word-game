<?php
 $file = file("ranking.txt");
 foreach($file as $f){
 list($date, $name, $score) = explode(',', rtrim($f));
 $db[$date.','.$name] = $score;
 }
 arsort($db); //スコアが高い順にソートする
 foreach($db as $key => $val) {
 echo "$key,$val\n";
 }
?>
