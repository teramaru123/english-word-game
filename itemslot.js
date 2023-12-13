import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.List;

public class ItemSlot implements KeyListener {
    private List<Integer> items;
    private int currentIndex;

    public ItemSlot() {
        items = new ArrayList<>();
        items.add(1); //現在実装予定のアイテム３つ
        items.add(2);
        items.add(3);
        currentIndex = 0;
    }

    public void useItem() {
        if (!items.isEmpty()) {
            int currentItem = items.get(currentIndex);
            System.out.println("アイテム使用");
        } else {
            System.out.println("アイテムがありません！");
        }
    }

    public void nextItem() {
        if (!items.isEmpty()) {
            currentIndex = (currentIndex + 1) % items.size();
            System.out.println("アイテム使用");
        } else {
            System.out.println("アイテムがありません！");
        }
    }

    public void previousItem() {
        if (!items.isEmpty()) {
            currentIndex = (currentIndex - 1 + items.size()) % items.size();
            System.out.println("アイテム使用");
        } else {
            System.out.println("アイテムがありません！");
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int keyCode = e.getKeyCode();

        if (keyCode == KeyEvent.VK_1) {
            useItem();
        } else if (keyCode == KeyEvent.VK_2) {
            nextItem();
        } else if (keyCode == KeyEvent.VK_Q) {
            previousItem();
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
	//空
    }

    @Override
    public void keyReleased(KeyEvent e) {
        //空
    }
}