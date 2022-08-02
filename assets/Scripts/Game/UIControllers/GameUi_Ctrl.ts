import {
  Sprite,
  _decorator,
  Node,
  SpriteAtlas,
  find,
  instantiate,
  director,
} from "cc";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";

const { ccclass } = _decorator;

const cards = [
  { id: 1, name: "m1" },
  { id: 2, name: "m2" },
  { id: 3, name: "m3" },
  { id: 4, name: "m4" },
  { id: 5, name: "m5" },
  { id: 6, name: "m6" },
  { id: 7, name: "m7" },
  { id: 8, name: "m8" },
  { id: 9, name: "m9" },
];

@ccclass("GameUi_Ctrl")
export class GameUi_Ctrl extends UIControllers {
  readonly source: Node = null;

  onLoad(): void {
    super.onLoad();
    const parentSprite = this.View["Cards"].getComponent(Sprite);
    const spriteAtlas = parentSprite.spriteAtlas;
    const cardFrames = spriteAtlas.getSpriteFrames();
    // console.log(spriteAtlas);
    // console.log(cardFrames);

    for (let i = 0; i < cards.length; i++) {
      const card = new Node();
      const sprite = card.addComponent(Sprite);
      const cardFrame = spriteAtlas.getSpriteFrame(cards[i].name);
      console.log(cardFrame);
      sprite.spriteFrame = cardFrame;
      this.node.addChild(card);
      card.layer = this.node.layer;
      card.setScale(0.55, 0.55, 1);

      let offset = i * (card.getContentSize().width * 0.55);
      console.log(offset);
      // if (i > 0) offset -= 3;
      card.setPosition(-492 + offset, -260, 0);
    }
  }
}
