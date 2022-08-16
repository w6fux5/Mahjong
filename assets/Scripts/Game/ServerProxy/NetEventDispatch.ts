import { Component, UI } from "cc";
import {
  EventManager,
  ProtoManager,
  NetManager,
} from "../../Framework/Manager";

import { Cmd } from "./Cmd";
import { ServiceType } from "./ServiceType";
import { UIManager } from "../../Framework/Manager/UI/UIManager";

export class NetEventDispatch extends Component {
  public static Instance: NetEventDispatch | null = null;

  onLoad(): void {
    if (NetEventDispatch.Instance) {
      this.destroy();
      return;
    }

    NetEventDispatch.Instance = this;
  }

  public Init(): void {
    EventManager.Instance.AddEventListener(
      EventManager.Instance.EventType.NET_MESSAGE,
      this,
      this.onRecvMsgByText
      // this.onRecvMsg // binary type
    );
  }

  private onRecvMsgByText(eventName: string, message: any): void {
    const { event, data } = message;
    switch (event) {
      case "getRoomList":
        console.log("[RECV]: get room list");
        break;

      case "selectRoom":
        console.log("[RECV]: select room");
        if (data.result) {
          UIManager.Instance.ShowUIView("GUI", "GameUi", true);
        }
        break;

      case "updateTable":
        console.log("[RECV]: update table");
        EventManager.Instance.Emit("updateTable", data);
        break;

      case "action":
        console.log("[RECV]: action");
        EventManager.Instance.Emit("action", data);
        break;

      case "error":
        console.log("[RECV]: Error");
        break;
      default:
        console.log("[RECV]: No Event", message);
    }

    // EventManager.Instance.Emit(ServiceType[serviceType], {
    //   cmdType,
    //   body: msgBody,
    // });
  }

  public sendMessageByText(data: any): void {
    console.log(data);
    // console.log("send", JSON.stringify(data));
    NetManager.Instance.SendDataText(JSON.stringify(data));
  }

  //======= protoBuf 二進制 ======//
  // public sendMessageByBinary(
  //   serviceType: number,
  //   cmdType: number,
  //   message: any
  // ) {
  //   console.log(serviceType, cmdType, message);
  //   // step1: message => buf
  //   // enum Cmd --->  {0: "INVALID_CMD", INVALID_CMD: 0}
  //   const messageBuf = ProtoManager.Instance.SerializeMessage(
  //     Cmd[cmdType],
  //     message
  //   );
  //   // end

  //   // step2: 依照協議封裝二進制數據包
  //   const total_len = messageBuf.length + 2 + 2 + 4;
  //   const buf = new ArrayBuffer(total_len); // 記憶體

  //   // DataView => 在 buffer 裡面寫東西的工具
  //   const dataview = new DataView(buf);

  //   // [serverType(2個字節), cmdType(2個字節), 預留(4個字節), body Buf]
  //   dataview.setInt16(0, serviceType, true); // offset, serverType
  //   dataview.setInt16(2, cmdType, true); // offset = 2, cmdType;
  //   dataview.setInt32(4, 0, true); // offset = 4, 預留;
  //   // end

  //   const uint8Buf = new Uint8Array(buf); // 相同記憶體位置
  //   uint8Buf.set(messageBuf, 8);

  //   // step3: Websocket 發送
  //   NetManager.Instance.SendDataBinary(buf);
  //   // end
  // }

  // private onRecvMsgByBinary(eventName: string, data: ArrayBuffer): void {
  //   // Get serverType and cmdType;
  //   const dataView = new DataView(data);
  //   const serviceType = dataView.getInt16(0, true);
  //   const cmdType = dataView.getInt16(2, true);
  //   // end

  //   // Get serialize binary data
  //   const uint8Buf: Uint8Array = new Uint8Array(data);
  //   const msgBuf = uint8Buf.subarray(4 + 4); // 從第八個字節開始
  //   // end

  //   // DeserializeMsg and transform binary data to javascript obj
  //   const msgBody = ProtoManager.Instance.DeserializeMsg(Cmd[cmdType], msgBuf);
  //   // end

  //   EventManager.Instance.Emit(ServiceType[serviceType], {
  //     cmdType,
  //     body: msgBody,
  //   });
  // }
}
