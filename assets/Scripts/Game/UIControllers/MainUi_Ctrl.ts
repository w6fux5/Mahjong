import { _decorator } from "cc";
import { EventManager, NetManager, UIManager } from "../../Framework/Manager";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";
import { AuthProxy } from "../ServerProxy";
const { ccclass } = _decorator;

@ccclass("MainUi_Ctrl")
export class MainUi_Ctrl extends UIControllers {
  // private version: Label | null = null;

  private wsUrl: string = "ws://192.168.0.200:7001?token=";

  onLoad(): void {
    super.onLoad();
    this.AddButtonListener("StartBtn", this, this.onGameStartClick);

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
    AuthProxy.Instance.Login();
    // AuthProxy.Instance.UserNameLogin({ userName: "Mike!!", password: "1234!!" });
  }

  private LoginSuccess(eventName: string, userUuid: string): void {
    if (!userUuid) return;

    this.wsUrl = `${this.wsUrl}${userUuid}`;
    this.node.addComponent(NetManager).Init(this.wsUrl);
    UIManager.Instance.ShowUIView("GUI", "GameUi", true);
  }

  private LoginFail(eventName: string, error: any): void {
    console.log(error);
  }
}
