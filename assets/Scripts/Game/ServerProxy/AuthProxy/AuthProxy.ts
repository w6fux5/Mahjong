/**
 *  純數據，不需要用組建的模式
 */
import axios from "../../../../../node_modules/axios/dist/axios.min.js";

import { Component } from "cc";
import { EventManager } from "../../../Framework/Manager";
import { NetEventDispatch } from "../NetEventDispatch";

import { ServiceType } from ".././ServiceType";
import { Cmd } from "../Cmd";

import { UserNameLogin, RecvDataFromServer } from "./Interfaces";

export class AuthProxy extends Component {
  public static Instance: AuthProxy = new AuthProxy();

  public Init(): void {
    EventManager.Instance.AddEventListener(
      ServiceType[ServiceType.Auth],
      this,
      this.RecvDataFromServer
    );
  }

  private RecvDataFromServer(eventName: string, data: object): void {
    console.log(data);
    console.log(eventName);
  }

  public Login(uid: string, hash: string): void {
    axios
      .post("http://192.168.0.200:7001/api/v1/login", {
        uid,hash})
      .then((data: any) => {
        EventManager.Instance.Emit(
          EventManager.Instance.EventType.LOGIN_SUCCESS,
          data.data.result.userUuid
        );
      })
      .catch((error: any) => {
        EventManager.Instance.Emit(
          EventManager.Instance.EventType.LOGIN_FAIL,
          error
        );
      });
  }

  // public UserNameLogin({ userName, password }: UserNameLogin): void {
  //   // const md5Pwd = hex_md5(password);
  //   NetEventDispatch.Instance.sendMessageByBinary(
  //     ServiceType.Auth,
  //     Cmd.UnameLoginReq,
  //     {
  //       userName,
  //       password,
  //     }
  //   );
  // }
}
