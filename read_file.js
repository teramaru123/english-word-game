// テキストファイルを取得
var txt = new XMLHttpRequest();

// テキストファイルへのパス
txt.open("GET", "L1.txt", false);

// テキストファイル読み込み失敗時のエラー対応
try {
  txt.send(null);
} catch (err) {
  console.log(err);
}

// 配列を定義
var txtArray = [];

// 改行ごとに配列化
var lines = txt.responseText.split(/\r\n|\n/);
var a =[];//数字　0001,0002...
var b =[];//英単語
var c =[];//意味

//数字、英単語、意味をそれぞれ別の配列に格納
//Math.floor()で切り捨て
for (var i = 0; i < lines.length; ++i) {
  if(i %3== 0){
   a[Math.floor(i / 3)] = lines[i];
 }
 else if(i %3== 1){
  b[Math.floor(i/3)] = lines[i];
 }
 else{
  c[Math.floor(i/3)] = lines[i];
 }

}
