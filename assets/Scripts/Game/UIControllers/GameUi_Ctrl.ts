import {
  Sprite,
  _decorator,
  Node,
  Button,
  game,
  Prefab,
  NodePool,
  Tween,
  Vec3,
  Vec2,
  Quat,
  UITransform,
  color,
  Color,
} from "cc";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";
import { NetEventDispatch } from "../ServerProxy/NetEventDispatch";
import { EventManager } from "../../Framework/Manager/EventManager";
import { ResourceManager } from "../../Framework/Manager/ResourceManager";
import { RecvDataFromServer } from "../ServerProxy/AuthProxy/Interfaces";
import { UIManager } from "../../Framework/Manager/UI/UIManager";
import { GameManager } from "../GameManager";
import { TimerManager } from "../../Framework/Manager/TimerManager";

const { ccclass } = _decorator;

const DUMMY_BING_PAI = [
  {
    id: 13,
    pai: "m4",
    aka: false,
    lieDown: false,
  },
  {
    id: 7,
    pai: "m2",
    aka: false,
    lieDown: false,
  },
  {
    id: 36,
    pai: "p1",
    aka: false,
    lieDown: false,
  },
  {
    id: 42,
    pai: "p2",
    aka: false,
    lieDown: false,
  },
  {
    id: 49,
    pai: "p4",
    aka: false,
    lieDown: false,
  },
  {
    id: 68,
    pai: "p9",
    aka: false,
    lieDown: false,
  },
  {
    id: 14,
    pai: "m4",
    aka: false,
    lieDown: false,
  },
  {
    id: 19,
    pai: "m5",
    aka: false,
    lieDown: false,
  },
  {
    id: 57,
    pai: "m6",
    aka: false,
    lieDown: false,
  },
  {
    id: 17,
    pai: "m5",
    aka: false,
    lieDown: false,
  },
  {
    id: 53,
    pai: "p5",
    aka: false,
    lieDown: false,
  },
  {
    id: 12,
    pai: "m4",
    aka: false,
    lieDown: false,
  },
  {
    id: 96,
    pai: "s7",
    aka: true,
    lieDown: false,
  },
];

const DUMMY_ZIMO_PAI = () => ({
  id: Math.random(),
  pai: "m1",
  aka: false,
  lieDown: false,
});

const DUMMY_FULOU = [
  {
    id: Math.random(),
    pai: "m4",
    aka: true,
    lieDown: false,
  },
  {
    id: Math.random(),
    pai: "m5",
    aka: false,
    lieDown: false,
  },
  {
    id: Math.random(),
    pai: "m6",
    aka: false,
    lieDown: false,
  },
];

let DUMMY_RIGHT_BING_PAI = 13;
let DUMMY_LEFT_BING_PAI = 13;
let DUMMY_TOP_BING_PAI = 13;

const rightArr = [];
const leftArr = [];
const topArr = [];
const mainArr = [];

interface PaiType {
  id: number;
  pai: string;
  aka: boolean;
  lieDown: boolean;
}

type Seat = "Main" | "Right" | "Left" | "Top";

@ccclass("GameUi_Ctrl")
export class GameUi_Ctrl extends UIControllers {
  private bingPaiWidth_Main: number =
    130 * GameManager.Instance.BingPaiScale_Main;
  private bingPaiWidth_Top: number =
    60 * GameManager.Instance.BingPaiScale_Other;
  // private BingPaiWidth_LR: number = 70 * GameManager.Instance.BingPaiScale_Other;
  private bingPaiHeight_LR: number =
    110 * GameManager.Instance.BingPaiScale_Other;

  //==== ZimoPai ====//
  private zimoPaiOffsetX_Main: number = 25;
  private zimoPaiStartY_Main: number = 50;
  private zimoPaiOffsetX_LR: number = 1.02;
  private zimoPaiOffsetY_LR: number = 1.05;
  private zimoPaiOffsetX_Top: number = 10;
  private zimoPaiOffsetY_Top: number = 15;
  //==== end ====//

  //==== FulouPai ====//
  private fulouStartX: number = 423;
  private fulouStartY: number = -320;
  private fulouStartZ: number = 0;
  private fulouOffset: number = -7;
  //==== end ====//

  //==== BingPai ====//
  private bingpaiStartX_Main: number = -500;
  private bingpaiStartY_Main: number = -270;
  private bingpaiStartZ_Main: number = 0;
  private bingpaiOffsetX_Main: number = -4;

  private bingPaiStartX_Right: number = 482;
  private bingPaiStartY_Right: number = -144;
  private bingPaiStartZ_Right: number = 0;
  private bingPaiOffsetX_Right: number = 5.55;
  private bingPaiOffsetY_Right: number = -36;

  private bingPaiStartX_Left: number = -405;
  private bingPaiStartY_Left: number = 217;
  private bingPaiStartZ_Left: number = 0;
  private bingPaiOffsetX_Left: number = 5.6;
  private bingPaiOffsetY_Left: number = -36;

  private bingPaiStartX_Top: number = 275;
  private bingPaiStartY_Top: number = 265;
  private bingPaiStartZ_Top: number = 0;
  private bingPaiOffsetX_Top: number = -2;
  private bingPaiOffsetY_Top: number = 0;
  //==== end ====//

  //==== HePai ====
  private hePaiRow: number = 6;

  private hePaiProgressRate_LR: number = 0.8;

  private hePaiStartX_Main: number = -102;
  private haiStartY_Main: number = -45;
  private heePaiStartZ_Main: number = 0;

  private hePaiStartX_Top: number = 100;
  private hePaiStartY_Top: number = 107;
  private hePaiStartZ_Top: number = 0;

  private hePaiStartX_Right: number = 105;
  private hePaiStartY_Right: number = -35;
  private hePaiStartZ_Right: number = 0;

  private hePaiStartX_Left: number = -105;
  private hePaiStartY_Left: number = -35;
  private hePaiStartZ_Left: number = 0;

  private hePaiWidth_LR: number = 80 * GameManager.Instance.HePaiScale;
  private hePaiOffsetX_LR: number = -1;
  private hePaiOffsetY_LR: number = -10;

  private hePaiHeight_TB: number = 80 * GameManager.Instance.HePaiScale;
  private hePaiOffsetX_TB: number = -1;
  private hePaiOffsetY_TB: number = -10;
  //==== end ====//

  onLoad(): void {
    super.onLoad();

    //==== BingPai Test ====//
    this.bingPaiInit_Main(DUMMY_BING_PAI);

    this.bingPaiInit_Other(
      DUMMY_RIGHT_BING_PAI,
      "Right",
      this.bingPaiStartX_Right,
      this.bingPaiStartY_Right,
      this.bingPaiStartZ_Right,
      this.bingPaiOffsetX_Right,
      this.bingPaiOffsetY_Right
    );

    this.bingPaiInit_Other(
      DUMMY_RIGHT_BING_PAI,
      "Left",
      this.bingPaiStartX_Left,
      this.bingPaiStartY_Left,
      this.bingPaiStartZ_Left,
      this.bingPaiOffsetX_Left,
      this.bingPaiOffsetY_Left
    );

    this.bingPaiInit_Other(
      DUMMY_RIGHT_BING_PAI,
      "Top",
      this.bingPaiStartX_Top,
      this.bingPaiStartY_Top,
      this.bingPaiStartZ_Top,
      this.bingPaiOffsetX_Top,
      this.bingPaiOffsetY_Top
    );

    //==== End ====//

    //==== ZimoPai Test ====//
    this.getZimoPai_Main(DUMMY_ZIMO_PAI());
    this.getZimoPai_Other("Top");
    this.getZimoPai_Other("Right");
    this.getZimoPai_Other("Left");
    //==== End ====//

    //==== FulouPai Test ====//
    // this.putFulou(DUMMY_FULOU);
    //==== End ====//

    //==== HePai Test ====//
    const rightID = setInterval(() => {
      if (rightArr.length === 24) {
        clearInterval(rightID);
        return;
      }
      rightArr.push({
        id: Math.random() * 100,
        pai: "z2",
        aka: Math.random() > 0.99,
        lieDown: false,
      });

      const rightHePaiList = GameManager.Instance.setHePaiNodeList(
        rightArr,
        "Right",
        "Top",
        this.bingPaiStartX_Right,
        Math.abs(this.bingPaiStartY_Right)
      );

      this.hePai_LR(
        "right",
        rightHePaiList,
        this.hePaiStartX_Right,
        this.hePaiStartY_Right,
        this.hePaiStartZ_Right,
        this.hePaiOffsetX_LR,
        this.hePaiOffsetY_LR,
        this.hePaiWidth_LR
      );
      const list = GameManager.Instance.SetZimoPai_Other("Right");
      this.bingPaiMove_Other(list, "Right");

      setTimeout(() => {
        this.getZimoPai_Other("Right");
      }, 500);
    }, 1000);

    const leftID = setInterval(() => {
      if (leftArr.length === 24) {
        clearInterval(leftID);
        return;
      }
      leftArr.push({
        id: Math.random() * 100,
        pai: "z2",
        aka: Math.random() > 0.92,
        lieDown: false,
      });

      const leftHePaiList = GameManager.Instance.setHePaiNodeList(
        leftArr,
        "Left",
        "Main",
        this.bingPaiStartX_Left,
        this.bingPaiStartY_Left
      );

      this.hePai_LR(
        "left",
        leftHePaiList,
        this.hePaiStartX_Left,
        this.hePaiStartY_Left,
        this.hePaiStartZ_Left,
        this.hePaiOffsetX_LR,
        this.hePaiOffsetY_LR,
        this.hePaiWidth_LR
      );

      const list = GameManager.Instance.SetZimoPai_Other("Left");
      this.bingPaiMove_Other(list, "Left");
      setTimeout(() => {
        this.getZimoPai_Other("Left");
      }, 500);
    }, 1000);

    const topID = setInterval(() => {
      if (topArr.length === 24) {
        clearInterval(topID);
        return;
      }
      topArr.push({
        id: Math.random() * 100,
        pai: "z2",
        aka: Math.random() > 0.92,
        lieDown: false,
      });

      const topHePaiList = GameManager.Instance.setHePaiNodeList(
        topArr,
        "Top",
        "Left",
        this.bingPaiStartX_Left,
        this.bingPaiStartY_Left
      );

      this.hePai_TB(
        "top",
        topHePaiList,
        this.hePaiStartX_Top,
        this.hePaiStartY_Top,
        this.hePaiStartZ_Top,
        this.hePaiOffsetX_TB,
        this.hePaiOffsetY_TB,
        this.hePaiHeight_TB
      );

      const list = GameManager.Instance.SetZimoPai_Other("Top");
      this.bingPaiMove_Other(list, "Top");

      setTimeout(() => {
        this.getZimoPai_Other("Top");
      }, 500);
    }, 1000);

    //==== End ====//

    setTimeout(() => {
      console.log(this.node.children);
    }, 25000);
  }

  private bingPaiInit_Main(list: PaiType[]) {
    const bingPaiList = GameManager.Instance.BingPaiInit_Main(list);

    if (bingPaiList?.length) {
      bingPaiList.forEach((el, i) => {
        const offset = i * (this.bingPaiWidth_Main + this.bingpaiOffsetX_Main);
        el.setPosition(
          this.bingpaiStartX_Main + offset,
          this.bingpaiStartY_Main,
          this.bingpaiStartZ_Main
        );
        const btn = el.getComponent(Button);
        this.btnAddEvent(btn, i);
        this.node.addChild(el);
      });
    }
  }

  private bingPaiInit_Other(
    bingPaiCount: number,
    abName: "Left" | "Right" | "Top",
    startX: number,
    startY: number,
    startZ: number,
    offsetX: number,
    offsetY: number
  ): void {
    const listNode = GameManager.Instance.BingPaiInit_Other(
      bingPaiCount,
      abName
    );

    listNode.forEach((node, index) => {
      this.node.addChild(node);
      let x: number = startX,
        y: number = startY,
        z: number = startZ;

      if (abName === "Right") {
        node.setSiblingIndex(1);
        x = startX - index * offsetX;
        y =
          startY +
          index *
            (node.getComponent(UITransform).height *
              GameManager.Instance.BingPaiScale_Other +
              offsetY);
      }

      if (abName === "Left") {
        x = startX - index * offsetX;
        y =
          startY -
          index *
            (node.getComponent(UITransform).height *
              GameManager.Instance.BingPaiScale_Other +
              offsetY);
      }

      if (abName === "Top") {
        x =
          startX -
          index *
            (node.getComponent(UITransform).width *
              GameManager.Instance.BingPaiScale_Other +
              offsetX);
      }

      node.setPosition(x, y, z);
    });
  }

  private getZimoPai_Main(zimoPai: PaiType): void {
    const zimoPaiNode = GameManager.Instance.getZimoPai_Main(zimoPai);
    const btn = zimoPaiNode.getComponent(Button);
    this.btnAddEvent(btn);
    const bingpaiLength = GameManager.Instance.GetBingPaiListSize("Main");
    const x =
      this.bingpaiStartX_Main +
      bingpaiLength * (this.bingPaiWidth_Main + this.bingpaiOffsetX_Main) +
      this.zimoPaiOffsetX_Main;
    const y = this.bingpaiStartY_Main + this.zimoPaiStartY_Main;
    const z = this.bingpaiStartZ_Main;

    zimoPaiNode.setPosition(x, y, z);
    const t = new Tween(zimoPaiNode);

    t.to(0.1, {
      position: new Vec3(x, this.bingpaiStartY_Main, z),
    }).start();

    this.node.addChild(zimoPaiNode);
  }

  private getZimoPai_Other(seat: "Top" | "Right" | "Left"): void {
    const zimoPaiNode = GameManager.Instance.GetZimoPai_Other(seat);
    let { x, y, z } = zimoPaiNode.getPosition();

    const scale = GameManager.Instance.BingPaiScale_Other;
    const bingPaiSize = GameManager.Instance.GetBingPaiListSize(seat);

    if (seat === "Top") {
      zimoPaiNode.setPosition(
        x -
          zimoPaiNode.getComponent(UITransform).width * scale -
          this.zimoPaiOffsetX_Top,
        y + this.zimoPaiOffsetY_Top,
        z
      );
      x =
        x -
        zimoPaiNode.getComponent(UITransform).width * scale -
        this.zimoPaiOffsetX_Top;
    }

    if (seat === "Left") {
      y =
        (y -
          (zimoPaiNode.getComponent(UITransform).height * scale +
            this.bingPaiOffsetY_Left)) *
        this.zimoPaiOffsetY_LR;
      x =
        this.bingPaiStartX_Left -
        bingPaiSize * this.zimoPaiOffsetX_LR * this.bingPaiOffsetX_Left;
      zimoPaiNode.setPosition(x, y, z);
    }

    if (seat === "Right") {
      y =
        (y +
          (zimoPaiNode.getComponent(UITransform).height * scale +
            this.bingPaiOffsetY_Right)) *
        this.zimoPaiOffsetY_LR;
      x =
        this.bingPaiStartX_Right -
        bingPaiSize * this.zimoPaiOffsetX_LR * this.bingPaiOffsetX_Right;

      zimoPaiNode.setPosition(x, y, z);
    }

    const t = new Tween(zimoPaiNode);

    t.to(0.1, {
      position: new Vec3(x, y, z),
    }).start();

    // this.node.addChild(zimoPaiNode);
  }

  private hePai_LR(
    seat: "right" | "left",
    list: Node[],
    startX: number,
    startY: number,
    startZ: number,
    offsetX: number,
    offsetY: number,
    hePaiSize: number
  ): void {
    let w: number = 0;
    let j: number = 0;

    list.forEach((el, index) => {
      const changeRow = index % this.hePaiRow === 0 && index > 0;
      if (changeRow) {
        ++w;
        j = 0;
      }

      let x: number, y: number, z: number;

      const preNode = list[index - 1];
      let preNodeY = startY;

      if (preNode) {
        preNodeY = preNode.getPosition().y;
      }

      if (seat === "right") {
        x = startX + w * (hePaiSize + offsetX) - j * this.hePaiProgressRate_LR;
      }

      if (seat === "left") {
        x = startX - w * (hePaiSize + offsetX) + j * this.hePaiProgressRate_LR;
      }

      y = changeRow
        ? startY +
          el.getComponent(UITransform).height *
            GameManager.Instance.HePaiScale +
          offsetY
        : preNodeY +
          el.getComponent(UITransform).height *
            GameManager.Instance.HePaiScale +
          offsetY;

      z = startZ;

      this.node.addChild(el);
      el.parent = this.node;
      el.setSiblingIndex(list.length - index);

      const t = new Tween(el);

      t.to(0.2, {
        position: new Vec3(x, y, z),
      }).start();

      j++;
    });
  }
  private hePai_TB(
    seat: "top" | "main",
    list: Node[],
    startX: number,
    startY: number,
    startZ: number,
    offsetX: number,
    offsetY: number,
    hePaiHeight: number
  ): void {
    let row: number = 0;

    list.forEach((el, index) => {
      this.node.addChild(el);
      const startRow = index % this.hePaiRow === 0 || index === 0;

      if (startRow && index !== 0) {
        row++;
      }

      let x: number = startX,
        y: number = startY,
        z: number = startZ;

      const preNode = list[index - 1];
      let preNodeX = startX;

      if (preNode) {
        preNodeX = preNode.getPosition().x;
      }

      if (seat === "top") {
        el.setSiblingIndex(1);

        x = startRow
          ? startX -
            el.getComponent(UITransform).width * GameManager.Instance.HePaiScale
          : preNodeX -
            (el.getComponent(UITransform).width *
              GameManager.Instance.HePaiScale +
              offsetX);

        y = startY + row * (hePaiHeight + offsetY);
      }

      if (seat === "main") {
        x = startRow
          ? startX +
            el.getComponent(UITransform).width * GameManager.Instance.HePaiScale
          : preNodeX +
            (el.getComponent(UITransform).width *
              GameManager.Instance.HePaiScale +
              offsetX);

        y = startY - row * (hePaiHeight + offsetY);
      }

      const t = new Tween(el);

      t.to(0.2, {
        position: new Vec3(x, y, z),
      }).start();
    });
  }

  private putFulou(fulouList: PaiType[]): void {
    const fulouNodeList = GameManager.Instance.setFulouPaiList(fulouList);

    fulouNodeList.forEach((node, index) => {
      this.btnRemoveEvent(node);
      const ui = node.getComponent(UITransform);
      ui.setAnchorPoint(0, 0);

      let preNodeX = this.fulouStartX;

      if (fulouNodeList[index - 1]) {
        preNodeX = fulouNodeList[index - 1].getPosition().x;
      }

      node.setPosition(
        fulouNodeList[index - 1]
          ? preNodeX -
              (node.getComponent(UITransform).width *
                GameManager.Instance.FulouPaiScale_Main +
                this.fulouOffset)
          : preNodeX,
        this.fulouStartY,
        this.fulouStartZ
      );
    });

    const bingPaiList = GameManager.Instance.MainBingPaiList;
    this.bingPaiMove_Main(bingPaiList);
  }

  private putToMainHePai(mainArr: PaiType[], target: Node): void {
    const { id, pai, aka, lieDown } = target;
    mainArr.push({ id, pai, aka, lieDown });

    const list = GameManager.Instance.setHePaiNodeList(
      mainArr,
      "Main",
      "Right"
    );

    this.hePai_TB(
      "main",
      list,
      this.hePaiStartX_Main,
      this.haiStartY_Main,
      this.heePaiStartZ_Main,
      this.hePaiOffsetX_TB,
      this.hePaiOffsetY_TB,
      this.hePaiHeight_TB
    );

    target.destroy();
  }

  private bingPaiMove_Main(nodeList: Node[]): void {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].pauseSystemEvents(true);
      const t = new Tween(nodeList[i]);
      t.to(0.15, {
        position: new Vec3(
          this.bingpaiStartX_Main +
            i * (this.bingPaiWidth_Main + this.bingpaiOffsetX_Main),
          this.bingpaiStartY_Main,
          this.bingpaiStartZ_Main
        ),
      })
        .call(() => {
          nodeList[i].resumeSystemEvents(true);
        })
        .start();
    }
  }

  private bingPaiMove_Other(nodeList: Node[], seat: Seat): void {
    for (let i = 0; i < nodeList.length; i++) {
      let x: number, y: number, z: number;

      const t = new Tween(nodeList[i]);

      if (seat === "Top") {
        x =
          this.bingPaiStartX_Top -
          i * (this.bingPaiWidth_Top + this.bingPaiOffsetX_Top);
        y = this.bingPaiStartY_Top;
        z = this.bingPaiStartZ_Top;
      }

      if (seat === "Left") {
        x = this.bingPaiStartX_Left - i * this.bingPaiOffsetX_Left;
        y =
          this.bingPaiStartY_Left -
          i * (this.bingPaiHeight_LR + this.bingPaiOffsetY_Left);
        z = this.bingPaiStartZ_Left;
      }

      if (seat === "Right") {
        x = this.bingPaiStartX_Right - i * this.bingPaiOffsetX_Right;
        y =
          this.bingPaiStartY_Right +
          i * (this.bingPaiHeight_LR + this.bingPaiOffsetY_Right);
        z = this.bingPaiStartZ_Right;
      }

      t.to(0.15, {
        position: new Vec3(x, y, z),
      }).start();
    }
  }

  private paiClick = ({ target }): void => {
    if (!GameManager.Instance.isAction) return;
    GameManager.Instance.isAction = false;

    // 打牌後將排放到 he pai
    this.putToMainHePai(mainArr, target);

    // 如果有自摸牌，就將 zimoPai 放到 bingPai
    const list = GameManager.Instance.SetZimoPai_Main(target);
    this.bingPaiMove_Main(list);

    // 獲取自摸牌
    setTimeout(() => {
      this.getZimoPai_Main(DUMMY_ZIMO_PAI());
    }, 500);

    setTimeout(() => {
      // console.log("[Main BingPai: ]", GameManager.Instance.MainBingPaiList);
      // console.log("[Right BingPai: ]", GameManager.Instance.RightBingPaiList);
      // console.log("[Left BingPai: ]", GameManager.Instance.LeftBingPaiList);
      // console.log("[Top BingPai: ]", GameManager.Instance.TopBingPaiList);
      // console.log("[HePai: ]", GameManager.Instance.mainHePaiList);
      // console.log("[Zimo: ]", GameManager.Instance.mainZimoPai);

      GameManager.Instance.isAction = true;
    }, 1000);
  };

  private paiMouseHover = ({ target }): void => {
    if (!GameManager.Instance.isAction) return;

    game.canvas.style.cursor = "pointer";
    const { x, y, z } = target.position;
    const t = new Tween(target);
    t.to(0.05, { position: new Vec3(x, y + 15, z) }).start();
  };

  private paiMouseLeave = ({ target }): void => {
    if (!GameManager.Instance.isAction) return;

    game.canvas.style.cursor = "default";
    const { x } = target.position;
    const t = new Tween(target);
    t.to(0.05, {
      position: new Vec3(x, this.bingpaiStartY_Main, this.bingpaiStartZ_Main),
    }).start();
  };

  private btnAddEvent = (btn: Button, i?: number): void => {
    btn.node.on(Node.EventType.TOUCH_START, this.paiClick);
    btn.node.on(Node.EventType.MOUSE_ENTER, this.paiMouseHover);
    btn.node.on(Node.EventType.MOUSE_LEAVE, this.paiMouseLeave);
  };

  private btnRemoveEvent = (node: Node, i?: number): void => {
    node.off(Node.EventType.TOUCH_START, this.paiClick);
    node.off(Node.EventType.MOUSE_ENTER, this.paiMouseHover);
    node.off(Node.EventType.MOUSE_LEAVE, this.paiMouseLeave);
  };
}
