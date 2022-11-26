import React, { useEffect, useState } from "react";
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
} from "ionicons/icons";
import Hot from "./pages/Tabs/Hot";
import MainPage from "./pages/Tabs/MainPage";

import Profile from "./pages/Tabs/Profile";
import Trade from "./pages/Trade/Trade";
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

import ChatListTab from "./pages/Chatroom/Chatroom";
import ChatroomPage from "./pages/Chatroom/ChatroomPage";

import Package from "./pages/Payment/Package";
import { getValue } from "./service/localStorage";
import { API_ORIGIN } from "./api";
import { updateJwt } from "./redux/user/actions";

setupIonicReact();

const App: React.FC = () => {
  const dispatch = useDispatch();
  const getProfile = async () => {
    let userId = await getValue("userId");
    let token = await getValue("Jwt");

    console.log("id:", userId, "token:", token);
    let res = await fetch(`${API_ORIGIN}/profiles/${userId}`);

    let userInfo = await res.json();
    console.log("userInfo: ", userInfo);
    dispatch(
      updateJwt({
        jwtKey: token,
        id: userInfo.id,
        username: userInfo.username,
        nickname: userInfo.nickname,
        phone: userInfo.phone,
        email: userInfo.email,
        joinedTime: userInfo.joinedTime,
        isAdmin: userInfo.is_admin,
      })
    );
  };

  useEffect(() => {
    getProfile();

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

  let profileHref = "/tab/Login";

  let jwtState = useSelector((state: RootState) => state.jwt);

  console.log("redux ID : ", jwtState.id);
  if (!jwtState.id) {
    jwtState.id = null;
  }
  if (jwtState) {
    profileHref = `/tab/Profile`;
  }

  return (
    <IonApp>
      <IonReactRouter>
        {/*DeepLink Setup start*/}
        {/* <AppUrlListener></AppUrlListener> */}
        {/*DeepLink Setup end */}
        <IonRouterOutlet>
          <Route exact={true} path="/">
            <Redirect to={routes.tab.mainPage} />
          </Route>
          <Route
            path={routes.menu.accountSetting}
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
          <Route path={routes.trade} exact={true} render={() => <Trade />} />
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

          {/* chatrooms demo */}
          <Route
            path={routes.chatrooms}
            exact={true}
            render={() => <ChatListTab />}
          />

          <Route path={routes.chatroom(":id")}>
            <ChatroomPage />
          </Route>
<<<<<<< HEAD
          {/* 
=======
>>>>>>> c7a29088964d05be806eed745667b9af424d4699
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

          <Route path="/tab">
            <IonTabs>
              <IonRouterOutlet>
                <Route
                  path={routes.tab.mainPage}
                  exact={true}
                  render={() => <MainPage />}
                />
                <Route
                  path={routes.tab.hot}
                  exact={true}
                  render={() => <Hot />}
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
                  path={routes.tab.profile}
                  exact={true}
                  render={() => <Profile user={jwtState.id} />}
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
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="MainPage" href="/tab/MainPage">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>主頁</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Hot" href="/tab/Hot">
                  <IonIcon icon={heartCircleOutline} />
                  <IonLabel>熱門</IonLabel>
                </IonTabButton>
                {!!jwtState.id ? (
                  <IonTabButton tab="PickPhoto" href={routes.tab.pickPhoto}>
                    <IonIcon icon={duplicateOutline} />
                    <IonLabel>交易</IonLabel>
                  </IonTabButton>
                ) : null}

                <IonTabButton tab="Notices" href="/tab/Notices">
                  <IonIcon icon={notificationsOutline} />
                  <IonLabel>通知</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Profile" href={profileHref}>
                  <IonIcon icon={personCircleOutline} />
                  <IonLabel>個人資料</IonLabel>
                </IonTabButton>

                {!!jwtState.isAdmin ? (
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
