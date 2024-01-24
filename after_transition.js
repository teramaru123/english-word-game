// ファイルパス
      const filePath = './settings.txt'; // ファイル名を適切に変更
      var bgm = new Audio("BGM.mp3");

      // XMLHttpRequestを使用してファイルを非同期で読み込む
      const xhr = new XMLHttpRequest();
      xhr.open('GET', filePath, true);

      // 配列を外部で定義
      var array;

      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
              const data = xhr.responseText;

              // データをコンマで分割して配列に格納
              array = data.split(',');

              // 配列が定義されているかどうかを確認してから条件分岐
              if (array && array.length > 1 && array[1].trim().toLowerCase() === "yes") {
                  playBGM();
              } else {
                  bgm.pause();
                  bgm.currentTime = 0;
              }
          }
      };

      // リクエストの送信
      xhr.send();

      // BGMを再生する関数
      function playBGM() {
          bgm.play().then(_ => {
              // ユーザーの操作が成功した場合の処理
          })
          .catch(error => {
              // エラーが発生した場合の処理
              console.error("BGM play failed:", error);
          });
      }

      // ページが読み込まれたら自動的に音楽再生
      document.addEventListener('DOMContentLoaded', function() {
          playBGM();
      });
