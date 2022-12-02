import React, { useCallback, useEffect, useState } from "react";
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonRouter,
  useIonToast,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import { PushNotifications } from "@capacitor/push-notifications";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import {
  homeOutline,
  duplicateOutline,
  heartCircleOutline,
  notificationsOutline,
  personCircleOutline,
  options,
  planetOutline,
  chatbubblesOutline,
  flashOffOutline,
} from "ionicons/icons";

import MainPage from "./pages/Tabs/MainPage";

import Profile from "./pages/Tabs/Profile";

import { routes } from "../src/routes";
import Notices from "./pages/Tabs/Notices";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import NoticeSetUp from "./pages/NoticeSetUp/NoticeSetUp";
import Invoice from "./pages/Invoice/Invoice";
import PasswordChange from "./pages/PasswordChange/PasswordChange";
import Login from "./pages/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
/* DeepLink Setup */
// import AppUrlListener from "./pages/AppUrlListener";
import { FirebaseDynamicLinks } from "@pantrist/capacitor-firebase-dynamic-links";

import PickPhoto from "./pages/Tabs/PickPhoto";
import Storages from "./pages/Storages/Storages";
import Blacklist from "./pages/Blacklist/Blacklist";

import ChatroomPage from "./pages/Chatroom/ChatroomPage";

import Package from "./pages/Payment/Package";
import { getValue } from "./service/localStorage";
import { API_ORIGIN } from "./api";
import { updateJwt } from "./redux/user/actions";
import Chatroom from "./pages/Chatroom/Chatroom";
import { updatePoints } from "./redux/points/actions";
import MainNotice from "./pages/MainNotice/MainNotice";
import { useSocket } from "./hooks/use-socket";
import { Socket } from "socket.io-client";
import { updateDot } from "./updateDot";
import { updateDots } from "./redux/dots/actions";
import styles from "./App.module.css";

setupIonicReact();
const App: React.FC = () => {
  let jwtState = useSelector((state: RootState) => state.jwt);
  let dotState = useSelector((state: RootState) => state.dots);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const router = useIonRouter();
  const [chatDots, setChatDots] = useState(false);
  let notiMSG: string;
  const [present] = useIonToast();

  const presentToast = (position: "top") => {
    present({
      message: notiMSG,
      duration: 10000,
      position: position,
    });
  };

  useSocket(
    useCallback((socket: Socket) => {
      socket.on("post-is-uploaded", async (data) => {
        console.log("received", data);
        notiMSG = data.msg;
        presentToast("top");
      });
      socket.on("bid-received", async (data) => {
        console.log("bid-received", data);
        notiMSG = data.msg;
        presentToast("top");
      });
      socket.on("info-seller", async (data) => {
        notiMSG = data.msg;
        presentToast("top");
      });
      socket.on("new-msg", async (data) => {
        console.log("received");
        if (jwtState.id) {
          let result = await updateDot(jwtState.id, "chat_dots", true);
          setChatDots(result.status);
          dispatch(
            updateDots({
              chatDot: result.status,
              noticeDot: dotState.noticeDot,
            })
          );
        }
      });
      return () => {};
    }, [])
  );

  const getProfile = async () => {
    let userId = await getValue("userId");
    let token = await getValue("Jwt");

    console.log("id:", userId, "token:", token);
    let res = await fetch(`${API_ORIGIN}/profiles/${userId}`);

    let userInfo = await res.json();
    console.log("userInfo: ", userInfo);

    let arr = [];

    for (let i = 0; i < userInfo.bankInfo.length; i++) {
      arr.push(userInfo.bankInfo[i]);
    }
    dispatch(
      updateJwt({
        jwtKey: token,
        id: userInfo.userInfo.id,
        username: userInfo.userInfo.username,
        nickname: userInfo.userInfo.nickname,
        phone: userInfo.userInfo.phone,
        email: userInfo.userInfo.email,
        joinedTime: userInfo.userInfo.joinedTime,
        isAdmin: userInfo.userInfo.is_admin,
        bankAccount: arr,
        icon_name: userInfo.userInfo.icon_name,
        icon_src: userInfo.userInfo.icon_src,
      })
    );

    dispatch(
      updatePoints({
        points: userInfo.userInfo.points,
      })
    );

    dispatch(
      updateDots({
        chatDot: userInfo.userInfo.chat_dots,
        noticeDot: userInfo.userInfo.notice_dots,
      })
    );
    console.log("!!!!!!!!!!!!!!!!!!!", jwtState);
    return userInfo.userInfo.username;
  };

  useIonViewDidEnter(() => {
    console.log("hi");
  });

  useEffect(() => {
    // setLoginLoad(true);

    const get = async () => {
      let jwtResult = await getProfile();
      setUsername(jwtResult);
      console.log(jwtResult);
    };

    get();

    const registerNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== "granted") {
        throw new Error("User denied permissions!");
      }

      await PushNotifications.register();
    };

    const addListeners = async () => {
      await registerNotifications();

      await PushNotifications.addListener("registration", (token) => {
        console.log("Registration token: ", token.value);
        alert(JSON.stringify(token.value));
      });

      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Push notification received: ", notification);
        }
      );

      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          console.log(
            "Push notification action performed",
            notification.actionId,
            notification.inputValue
          );
        }
      );
    };
    addListeners();

    function listenToDeepLinkOpen() {
      FirebaseDynamicLinks.addListener("deepLinkOpen", (data: any) => {
        console.log("deeplink:", data);
      });
    }

    listenToDeepLinkOpen();
  }, []);

  let profileHref;

  if (!jwtState.id) {
    profileHref = "/tab/Login";
  }
  if (jwtState.id) {
    profileHref = `/tab/Profile/${jwtState.id}`;
  }

  useEffect(() => {
    console.log(jwtState.username);
  }, [jwtState.username]);

  return (
    <IonApp>
      <IonReactRouter>
        {/*DeepLink Setup start*/}
        {/* <AppUrlListener></AppUrlListener> */}
        {/*DeepLink Setup end */}
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Redirect to={routes.tab.mainPage} />
          </Route>
          <Route
            path={routes.menu.accountSetting}
            exact={true}
            render={() => <UpdateProfile />}
          ></Route>
          <Route
            path={routes.menu.noticeSetting}
            exact={true}
            render={() => <NoticeSetUp />}
          />
          <Route
            path={routes.menu.passwordChange}
            exact={true}
            render={() => <PasswordChange />}
          />
          <Route
            path={routes.menu.invoice}
            exact={true}
            render={() => <Invoice />}
          />

          <Route
            path={routes.storages}
            exact={true}
            render={() => <Storages />}
          />
          <Route
            path={routes.blacklist}
            exact={true}
            render={() => <Blacklist />}
          />

          <Route
            path={routes.chatroomPage}
            exact={true}
            render={() => <ChatroomPage />}
          />
          <Route
            path={routes.chatroom(":id")}
            exact={true}
            render={() => <Chatroom />}
          />
          {/* 
          <Route
            path={routes.payment}
            exact={true}
            render={() => <Payment />}
          /> */}

          <Route
            path={routes.package}
            exact={true}
            render={() => <Package />}
          />
          <Route
            path={routes.mainNotice}
            exact={true}
            render={() => <MainNotice />}
          />

          <Route path="/tab">
            <IonTabs>
              <IonRouterOutlet>
                <Switch>
                  <Route
                    path={routes.tab.mainPage}
                    exact={true}
                    render={() => <MainPage />}
                  />

                  <Route
                    path={routes.tab.pickPhoto}
                    exact={true}
                    render={() => <PickPhoto />}
                  />

                  <Route
                    path={routes.tab.notices}
                    exact={true}
                    render={() => <Notices />}
                  />
                  <Route
                    path={routes.tab.profile(":id")}
                    exact={true}
                    render={() => <Profile />}
                  />
                  <Route
                    path={routes.tab.login}
                    exact={true}
                    render={() => <Login />}
                  />
                  <Route
                    path={routes.tab.adminPanel}
                    exact={true}
                    render={() => <AdminPanel />}
                  />
                </Switch>
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="MainPage" href="/tab/MainPage">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>主頁</IonLabel>
                </IonTabButton>
                {!!jwtState.jwtKey ? (
                  <IonTabButton tab="PickPhoto" href={routes.tab.pickPhoto}>
                    <IonIcon icon={duplicateOutline} />
                    <IonLabel>交易</IonLabel>
                  </IonTabButton>
                ) : (
                  <IonTabButton tab="PickPhoto" href={routes.tab.pickPhoto}>
                    <IonIcon icon={duplicateOutline} />
                    <IonLabel>交易</IonLabel>
                  </IonTabButton>
                )}
                {!!jwtState.jwtKey ? (
                  <IonTabButton
                    tab="Notices"
                    href={routes.tab.notices}
                    onClick={() => setChatDots(false)}
                  >
                    {chatDots ? (
                      <IonBadge color="warning" className={styles.badge}>
                        !
                      </IonBadge>
                    ) : (
                      <></>
                    )}
                    <IonIcon icon={chatbubblesOutline} />
                    <IonLabel>聊天</IonLabel>
                  </IonTabButton>
                ) : null}

                <IonTabButton tab="Profile" href={profileHref}>
                  <IonIcon icon={personCircleOutline} />
                  <IonLabel>個人資料</IonLabel>
                </IonTabButton>

                {jwtState.isAdmin ? (
                  <IonTabButton tab="AdminPanel" href={routes.tab.adminPanel}>
                    <IonIcon icon={planetOutline} />
                    <IonLabel>管理員</IonLabel>
                  </IonTabButton>
                ) : null}
              </IonTabBar>
            </IonTabs>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
