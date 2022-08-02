import { Sprite, _decorator, Node, Button, game } from "cc";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";

const { ccclass } = _decorator;

const cardsInit = [
  { id: 1, name: "p1" },
  { id: 2, name: "p2" },
  { id: 3, name: "p3" },
  { id: 4, name: "p4" },
  { id: 5, name: "p5" },
  { id: 6, name: "p6" },
  { id: 7, name: "p7" },
  { id: 8, name: "p8" },
  { id: 9, name: "p9" },
  { id: 10, name: "m1" },
  { id: 11, name: "m2" },
  { id: 12, name: "m3" },
  { id: 13, name: "m4" },
];

@ccclass("GameUi_Ctrl")
export class GameUi_Ctrl extends UIControllers {
  readonly source: Node = null;

  onLoad(): void {
    super.onLoad();

    this.GetCards(cardsInit);
  }

  private GetCards(cards) {
    const rootSprite = this.View["Cards"].getComponent(Sprite);
    const spriteAtlas = rootSprite.spriteAtlas;
    for (let i = 0; i < cards.length; i++) {
      const card = new Node(cards[i].name);

      const btn = card.addComponent(Button);
      btn.name = cards[i].name;
      btn.node.on(Node.EventType.TOUCH_START, this.cardClick.bind(this));
      btn.node.on(Node.EventType.MOUSE_ENTER, this.cardMouseHover.bind(this));
      btn.node.on(Node.EventType.MOUSE_LEAVE, this.cardMouseLeave.bind(this));

      const sprite = card.addComponent(Sprite);
      const cardFrame = spriteAtlas.getSpriteFrame(cards[i].name);
      sprite.spriteFrame = cardFrame;
      this.node.addChild(card);
      card.layer = this.node.layer;
      card.setScale(0.55, 0.55, 1);

      let offset = i * (card.getContentSize().width * 0.55 - 4);
      card.setPosition(-498 + offset, -270, 0);
    }
  }

  private cardClick({ target }): void {
    target.destroy();
    cardsInit.filter((el) => el.name !== target.name);
  }

  private cardMouseHover({ target }): void {
    game.canvas.style.cursor = "pointer";
    const {
      position: { x, y, z },
    } = target;
    target.setPosition({ x, y: y + 15, z });
  }

  private cardMouseLeave({ target }): void {
    game.canvas.style.cursor = "default";
    const {
      position: { x, y, z },
    } = target;
    target.setPosition({ x, y: y - 15, z });
  }
}
