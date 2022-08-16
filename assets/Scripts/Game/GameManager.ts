import {
  _decorator,
  Component,
  Sprite,
  NodePool,
  Node,
  SpriteAtlas,
  Button,
  Layers,
  SpriteFrame,
  Vec2,
  UITransform,
  math,
  instantiate,
} from "cc";
import { ResourceManager } from "../Framework/Manager/ResourceManager";

interface PaiType {
  id: number;
  pai: string;
  aka: boolean;
  lieDown: boolean;
}

// type Seat = "RightHePai" | "TopHePai" | "LeftHePai" | "MainHePai";
type Seat = "Right" | "Top" | "Left" | "Main";

export class GameManager extends Component {
  public static Instance: GameManager | null = null;

  public isAction: boolean = true;

  // Fulou
  public FulouPaiScale_Main: number = 0.8;
  private FulouPaiList_Main: Node[] = [];

  // Zimo
  public MainZimoPai: Node | null = null;
  public TopZimoPai: Node | null = null;
  public LeftZimoPai: Node | null = null;
  public RightZimoPai: Node | null = null;

  // BingPai
  public MainBingPaiList: Node[] = [];
  public RightBingPaiList: Node[] = [];
  public LeftBingPaiList: Node[] = [];
  public TopBingPaiList: Node[] = [];
  public BingPaiScale_Main: number = 0.55;
  public BingPaiScale_Other: number = 0.6;

  // HePai
  public MainHePaiList: Node[] = [];
  public RightHePaiList: Node[] = [];
  public LeftHePaiList: Node[] = [];
  public TopHePaiList: Node[] = [];
  public HePaiScale: number = 0.55;

  onLoad(): void {
    if (GameManager.Instance) {
      this.destroy();
      return;
    }

    GameManager.Instance = this;
  }

  public setHePaiNodeList(
    list: PaiType[],
    seat: Seat,
    preSeat: Seat,
    startX?: number,
    startY?: number
  ): Node[] | null {
    list.forEach((el) => {
      const node = new Node(`${seat}HePai`);
      node.id = el.id;
      node.aka = el.aka;
      node.pai = el.pai;
      node.layer = Layers.Enum["UI_2D"];
      node.setScale(this.HePaiScale, this.HePaiScale, 1);
      // node.setPosition(startX, startY, 0);

      const sprite = node.addComponent(Sprite);
      const spriteFrame = node.aka
        ? this.getFrame(el.pai, `${preSeat}HePai`)
        : this.getFrame(el.pai, `${seat}HePai`);
      sprite.spriteFrame = spriteFrame;

      const ui = node.getComponent(UITransform);

      let x: number = startX,
        y: number = startY,
        z: number = 0,
        dropBingPaiCoordinate: math.Vec3 | null;

      switch (seat) {
        case `Right`:
          ui.setAnchorPoint(0, 1);
          this.RightHePaiList.push(node);
          this.RightHePaiList = this.resetArray(this.RightHePaiList);

          dropBingPaiCoordinate =
            this.RightBingPaiList[
              this.RightBingPaiList.length - 1
            ].getPosition();
          x = dropBingPaiCoordinate.x;
          y = dropBingPaiCoordinate.y;
          z = dropBingPaiCoordinate.z;
          break;

        case `Left`:
          ui.setAnchorPoint(1, 1);
          this.LeftHePaiList.push(node);
          this.LeftHePaiList = this.resetArray(this.LeftHePaiList);

          dropBingPaiCoordinate = this.LeftBingPaiList[0].getPosition();
          x = dropBingPaiCoordinate.x;
          y = dropBingPaiCoordinate.y;
          z = dropBingPaiCoordinate.z;
          break;

        case `Top`:
          ui.setAnchorPoint(0, 0);
          this.TopHePaiList.push(node);
          this.TopHePaiList = this.resetArray(this.TopHePaiList);

          dropBingPaiCoordinate = this.TopBingPaiList[0].getPosition();
          x = dropBingPaiCoordinate.x;
          y = dropBingPaiCoordinate.y;
          z = dropBingPaiCoordinate.z;
          break;

        case `Main`:
          ui.setAnchorPoint(1, 1);
          this.MainHePaiList.push(node);
          this.MainHePaiList = this.resetArray(this.MainHePaiList);
          const mainNode = this.MainBingPaiList.find((el) => el.id === node.id);
          if (mainNode) {
            dropBingPaiCoordinate = mainNode.getPosition();
            x = dropBingPaiCoordinate.x;
            y = dropBingPaiCoordinate.y;
            z = dropBingPaiCoordinate.z;
            mainNode.destroy();
          } else {
            const last = this.MainBingPaiList[this.MainBingPaiList.length - 1];
            dropBingPaiCoordinate = last.getPosition();
            x = dropBingPaiCoordinate.x;
            y = dropBingPaiCoordinate.y;
            z = dropBingPaiCoordinate.z;
          }

          this.MainBingPaiList = this.MainBingPaiList.filter(
            (el) => el.id !== node.id
          );
          break;

        default:
          throw new Error("setHePaiNodeList Error");
      }

      node.setPosition(x, y, z);
    });

    const seatText: string = seat.split("H")[0];
    const randomIndex = this.getRandomIndex(
      0,
      this[`${seatText}BingPaiList`].length - 1
    );

    switch (seat) {
      case "Right":
        const rightNode = this.RightBingPaiList.splice(randomIndex, 1);
        if (rightNode.length) rightNode[0].destroy();
        return this.RightHePaiList;

      case "Left":
        const leftNode = this.LeftBingPaiList.splice(randomIndex, 1);
        if (leftNode.length) leftNode[0].destroy();

        return this.LeftHePaiList;

      case "Top":
        const topNode = this.TopBingPaiList.splice(randomIndex, 1);
        if (topNode.length) topNode[0].destroy();
        return this.TopHePaiList;

      case "Main":
        return this.MainHePaiList;

      default:
        throw new Error("setHePaiNodeList Error");
    }
  }

  //==== Fulou Pai ====//
  public setFulouPaiList(list: PaiType[]): Node[] {
    const idMap = list.map((el) => el.id);

    this.FulouPaiList_Main = this.MainBingPaiList.filter((el) =>
      idMap.includes(el.id)
    );

    this.FulouPaiList_Main.forEach((el) => {
      list.forEach((li) => {
        if (li.id === el.id) {
          el.aka = li.aka;
          el.pai = li.pai;
        }
      });
      el.setScale(this.FulouPaiScale_Main, this.FulouPaiScale_Main, 1);
      const sprite = el.getComponent(Sprite);
      const spriteFrame = el.aka
        ? this.getFrame(el.name, "MainFulou_H")
        : this.getFrame(el.name, "MainFulou");
      sprite.spriteFrame = spriteFrame;

      this.removeFromBingPai(el, "MainBingPaiList");
    });

    return this.FulouPaiList_Main;
  }

  //==== ZimoPai ====//
  public getZimoPai_Main(zimoPai: PaiType): Node {
    const node = new Node("MainZimoPai");
    node.pai = zimoPai.pai;
    node.id = zimoPai.id;
    node.aka = zimoPai.aka;
    node.setScale(this.BingPaiScale_Main, this.BingPaiScale_Main, 1);
    node.layer = Layers.Enum["UI_2D"];
    const sprite = node.addComponent(Sprite);
    node.addComponent(Button);
    sprite.spriteFrame = this.getFrame(zimoPai.pai, "MainBingPaiList");
    this.MainZimoPai = node;
    return node;
  }

  public GetZimoPai_Other(seat: Seat): Node {
    const target = `${seat}ZimoPai`;

    const lastNode =
      this[`${seat}BingPaiList`][this[`${seat}BingPaiList`].length - 1];

    const node = instantiate(lastNode);

    this[target] = node;

    node.parent = lastNode.parent;

    if (seat === "Left") {
      console.log(node.getSiblingIndex(), 'Left')

      node.setSiblingIndex(lastNode.getSiblingIndex() + 1);
    }

    if (seat === "Right") {
      // node.setSiblingIndex(lastNode.getSiblingIndex());
      console.log(node.getSiblingIndex(), 'Right')
      node.setSiblingIndex(1);
      // node.setSiblingIndex(lastNode.getSiblingIndex() + 1);
    }

    node.name = target;
    this[target] = node;
    return node;
  }

  public SetZimoPai_Main(target: Node): Node[] {
    let list = null;
    if (target.name !== "MainZimoPai") {
      list = this.PutToBingPai(this.MainZimoPai, "Main");
    }
    this.ClearZimoPai("Main");
    return list || this.MainBingPaiList;
  }

  public SetZimoPai_Other(seat: Seat): Node[] {
    if (!this[`${seat}ZimoPai`]) return this[`${seat}BingPaiList`];
    const list = this.PutToBingPai(this[`${seat}ZimoPai`], seat);
    this.ClearZimoPai(seat);
    return list;
  }

  public ClearZimoPai(seat: Seat): void {
    if (!this[`${seat}ZimoPai`]) return;
    this[`${seat}ZimoPai`] = null;
  }
  //==== End ====//

  //==== BingPai ====//
  public BingPaiInit_Main(list: PaiType[]): Node[] {
    list.forEach((el: PaiType, i: number) => {
      const node = new Node("MainBingpai");
      node.pai = el.pai;
      node.id = el.id;
      node.aka = el.aka;

      node.setScale(this.BingPaiScale_Main, this.BingPaiScale_Main, 1);
      node.layer = Layers.Enum["UI_2D"];
      const sprite = node.addComponent(Sprite);
      node.addComponent(Button);
      sprite.spriteFrame = this.getFrame(el.pai, "MainBingPaiList");
      this.MainBingPaiList.push(node);
    });
    return this.MainBingPaiList;
  }

  public BingPaiInit_Other(
    bingPaiCount: number,
    seat: "Left" | "Right" | "Top"
  ): Node[] {
    const target = `${seat}BingPaiList`;

    const frame = this.getFrame("bingPai", target);

    for (let i = 0; i < bingPaiCount; i++) {
      const node = new Node(`${seat}BingPai`);
      node.layer = Layers.Enum["UI_2D"];
      node.setScale(this.BingPaiScale_Other, this.BingPaiScale_Other, 1);
      const sprite = node.addComponent(Sprite);
      const ui = node.getComponent(UITransform);
      sprite.spriteFrame = frame;
      this[target].push(node);

      if (seat === "Left") {
        ui.setAnchorPoint(1, 0);
      }

      if (seat === "Right") {
        ui.setAnchorPoint(0, 1);
      }

      if (seat === "Top") {
        ui.setAnchorPoint(0, 0);
      }
    }

    return this[target];
  }

  public removeFromBingPai(
    node: Node,
    name:
      | "MainBingPaiList"
      | "RightBingPaiList"
      | "LeftBingPaiList"
      | "TopBingPaiList"
  ): Node[] {
    this[name] = this[name].filter((el) => el.uuid !== node.uuid);
    return this[name];
  }

  public GetBingPaiListSize(seat: "Main" | "Right" | "Left" | "Top"): number {
    // return this.MainBingPaiList.length;
    return this[`${seat}BingPaiList`].length;
  }

  public PutToBingPai(node: Node, seat: Seat): Node[] {
    node.name = `${seat}Bingpai`;
    this[`${seat}BingPaiList`].push(node);
    return this[`${seat}BingPaiList`];
    // return this.MainBingPaiList;
  }

  //==== End ====//

  //
  //==== Get Frame ==== //
  public getFrame(name: string, abName: string): SpriteFrame {
    const mainHeAtlas = ResourceManager.Instance.getAtlas("Mahjong", abName);
    return mainHeAtlas[name];
  }

  private resetArray(arr: any[]): any[] {
    let map = new Map();
    let newArr = [];

    for (let i = 0; i < arr.length; i++) {
      if (!map.has(arr[i].id)) {
        map.set(arr[i].id, true);
        newArr.push(arr[i]);
      }
    }

    return newArr;
  }

  private getRandomIndex = (min: number, max: number): number => {
    return Math.floor(Math.random() * max) + min;
  };
}
