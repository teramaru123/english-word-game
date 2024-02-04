<?php
 $file = file("ranking.txt");
 foreach($file as $f){
 list($date, $name, $score, $result) = explode(',', rtrim($f));
 $db[$date.','.$name. ','. $result] = $score;
 }
 arsort($db); //タイムが短い順にソートする
 foreach($db as $key => $val) {
 echo "$key,$val\n";
 }
?>
