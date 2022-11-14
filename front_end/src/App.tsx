import React, { useEffect } from "react";
import {
  IonApp,
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
} from "ionicons/icons";
import Hot from "./pages/Tabs/Hot";
import MainPage from "./pages/Tabs/MainPage";

import Profile from "./pages/Tabs/Profile";
import Trade from "./pages/Tabs/Trade";
import { routes } from "../src/routes";
import Notices from "./pages/Tabs/Notices";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import NoticeSetUp from "./pages/NoticeSetUp/NoticeSetUp";
import Invoice from "./pages/Invoice/Invoice";
import PasswordChange from "./pages/PasswordChange/PasswordChange";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import { RootState } from "./store";
setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const addListeners = async () => {
      await PushNotifications.addListener("registration", (token) => {
        console.log("Registration token: ", token.value);
      });
    };
    addListeners();
  }, []);

  let profileHref = "/tab/Login";
  
  let jwtKey = useSelector((state: RootState) => state.jwtKey);
  let nickname = useSelector((state: RootState) => state.nickname);
  if (!nickname){
    nickname = ""
  }
  if (jwtKey) {
    profileHref = `/tab/Profile`;
  }


  return (
    <IonApp>
      <IonReactRouter>
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
                  path={routes.tab.trade}
                  exact={true}
                  render={() => <Trade />}
                />
                <Route
                  path={routes.tab.notices}
                  exact={true}
                  render={() => <Notices />}
                />
                <Route
                  path={routes.tab.profile}
                  exact={true}
                  render={() => <Profile user={nickname}/>}
                />
                <Route
                  path={routes.tab.login}
                  exact={true}
                  render={() => <Login />}
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
                <IonTabButton tab="Trade" href="/tab/Trade">
                  <IonIcon icon={duplicateOutline} />
                  <IonLabel>交易</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Notices" href="/tab/Notices">
                  <IonIcon icon={notificationsOutline} />
                  <IonLabel>通知</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Profile" href={profileHref}>
                  <IonIcon icon={personCircleOutline} />
                  <IonLabel>個人資料</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
