import java.util.Timer;
import java.util.TimerTask;

public class ScoreManager {
    private int score = 0;

    public static void main(String[] args) {
        ScoreManager scoreManager = new ScoreManager();
        scoreManager.startScoring();
    }

    public void startScoring() {
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(new ScoreIncrementTask(), 0, 1000); // 1秒ごとにスコアを増加

    }

    private class ScoreIncrementTask extends TimerTask {
        @Override
        public void run() {
            // ここでスコアを増加
            score += 100;
            displayScore();
        }
    }

    public void displayScore() {
        System.out.println("Current Score: " + score);
    }
}