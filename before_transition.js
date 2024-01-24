//formタグには必ずid = "gameForm"を付けてください。(例 <form id="gameForm" action="sample.html" method="post">)また、settings.txtを同じディレクトリにおいておく必要があります。
// ファイルパス
    const filePath = './settings.txt'; // ファイル名を適切に変更
    const form = document.getElementById('gameForm');

    form.addEventListener('submit', function(event) {
      // ページ遷移を一時的に防ぐ
      event.preventDefault();

      // XMLHttpRequestを使用してファイルを非同期で読み込む
      const xhr = new XMLHttpRequest();
      xhr.open('GET', filePath, true);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const data = xhr.responseText;

          // データをコンマで分割して配列に格納
          const array = data.split(',');

          // 配列が定義されているかどうかを確認してから条件分岐
          if (array && array.length > 1 && array[1].trim().toLowerCase() === "yes") {
            // BGMを再生
            playBGM();

            // ページ遷移
            setTimeout(function() {
              form.submit();
            }, 1); // 適切な待機時間を設定してください
          } else {
            // BGMを停止
            bgm.pause();
            bgm.currentTime = 0;

            // ページ遷移
            form.submit();
          }
        }
      };

      // リクエストの送信
      xhr.send();
    });

    var bgm = new Audio("BGM.mp3");

    // BGMを再生する関数
    function playBGM() {
      bgm.play().then(_ => {
        // ユーザーの操作が成功した場合の処理
      }).catch(error => {
        // エラーが発生した場合の処理
        console.error("BGM play failed:", error);
      });
    }
