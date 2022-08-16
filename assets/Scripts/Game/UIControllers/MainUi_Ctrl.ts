import { _decorator } from "cc";
import { EventManager, NetManager, UIManager } from "../../Framework/Manager";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";
import { AuthProxy } from "../ServerProxy";
import { NetEventDispatch } from "../ServerProxy/NetEventDispatch";
const { ccclass } = _decorator;

@ccclass("MainUi_Ctrl")
export class MainUi_Ctrl extends UIControllers {
  // private version: Label | null = null;

  private wsUrl: string = "ws://192.168.0.200:7001?token=";

  onLoad(): void {
    super.onLoad();
    this.AddButtonListener("StartBtn", this, this.onGameStartClick);
    this.AddButtonListener("StartBtn2", this, this.onGameStartClick2);
    this.AddButtonListener("StartBtn3", this, this.onGameStartClick3);
    this.AddButtonListener("StartBtn4", this, this.onGameStartClick4);

    // this.version = this.View["Version"].getComponent(Label);
    // this.version.string = "3.1.2";

    EventManager.Instance.AddEventListener(
      EventManager.Instance.EventType.LOGIN_SUCCESS,
      this,
      this.LoginSuccess
    );
    EventManager.Instance.AddEventListener(
      EventManager.Instance.EventType.LOGIN_FAIL,
      this,
      this.LoginFail
    );
  }

  onDestroy(): void {
    EventManager.Instance.RemoveEventListener(
      EventManager.Instance.EventType.LOGIN_SUCCESS,
      this,
      this.LoginSuccess
    );

    EventManager.Instance.RemoveEventListener(
      EventManager.Instance.EventType.LOGIN_FAIL,
      this,
      this.LoginFail
    );
  }

  private onGameStartClick(): void {
    console.log("click!");
    // AuthProxy.Instance.Login("aaauid", "cba6d03e1fd441455bb89f289ca10035");
    // UIManager.Instance.ShowUIView("GUI", "GameUi", true);
    // AuthProxy.Instance.UserNameLogin({ userName: "Mike!!", password: "1234!!" });
  }
  private onGameStartClick2(): void {
    console.log("click!");
    // AuthProxy.Instance.Login("bbbuid", "cba6d03e1fd441455bb89f289ca10035");
  }

  private onGameStartClick3(): void {
    console.log("click!");
    // AuthProxy.Instance.Login("cccuid", "cba6d03e1fd441455bb89f289ca10035");
  }

  private onGameStartClick4(): void {
    console.log("click!");
    UIManager.Instance.ShowUIView("GUI", "GameUi", true);

    // AuthProxy.Instance.Login("ddduid", "cba6d03e1fd441455bb89f289ca10035");
  }

  private LoginSuccess(eventName: string, userUuid: string): void {
    if (!userUuid) return;

    this.wsUrl = `${this.wsUrl}${userUuid}`;
    // this.node.addComponent(NetManager).Init(this.wsUrl);


    // setTimeout(() => {
    //   const data = {
    //     event: "selectRoom",
    //     room: 3,
    //   };

    //   NetEventDispatch.Instance.sendMessageByText(data);
    // }, 1000);

    // setTimeout(() => {
    //   const ready = {
    //     event: "ready",
    //   };

    //   NetEventDispatch.Instance.sendMessageByText(ready);
    //   UIManager.Instance.ShowUIView("GUI", "GameUi", true);
    // }, 2000);
  }

  private LoginFail(eventName: string, error: any): void {
    console.log(error);
  }
}
