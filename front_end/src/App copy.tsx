import React from "react";
import {
  IonApp,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router-dom";

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
  triangle,
  ellipse,
  square,
  homeOutline,
  duplicateOutline,
  heartCircleOutline,
  notificationsOutline,
  personCircleOutline,
} from "ionicons/icons";
import Hot from "./pages/Tabs/Hot";
import MainPage from "./pages/Tabs/MainPage";
import Noti from "./pages/Tabs/Notices";
import Profile from "./pages/Tabs/Profile";
import Trade from "./pages/Tabs/Trade";
import { routes } from "../src/routes";
import Notices from "./pages/Tabs/Notices";
import { MenuPageWrapper } from "./pages/MenuPageWrapper";
setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact={true} path="/">
              <Redirect to={routes.tab.mainPage} />
            </Route>
            <Route
              path="/AccountSetting"
              render={() => (
                <MenuPageWrapper
                  title="todo title"
                  id="AccountSettingPage"
                  content={
                    <IonContent>
                      <h1>todo</h1>
                    </IonContent>
                  }
                />
              )}
            ></Route>
            <Route path="/tab">
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
                  render={() => <Profile />}
                />
              </IonRouterOutlet>
            </Route>
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
            <IonTabButton tab="Profile" href="/tab/Profile">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>個人資料</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
