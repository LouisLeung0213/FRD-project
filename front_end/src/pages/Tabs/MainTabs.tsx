import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonIcon,
  IonLabel,
  IonTabButton,
} from "@ionic/react";

import { Redirect, Route, useParams } from "react-router";
import {
  personCircleOutline,
  duplicateOutline,
  homeOutline,
  heartCircleOutline,
  notificationsOutline,
} from "ionicons/icons";

import Profile from "./Profile";
import Hot from "./Hot";
import Trade from "./Trade";
import Noti from "./Noti";
import MainPage from "./MainPage";
import Login from "../login/Login";
import SignUp from "../signUp/SignUp";
import UpdateProfile from "../updateProfile/UpdateProfile";

const MainTabs: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route
          path="/page/AccountSetting"
          exact={true}
          render={() => <UpdateProfile />}
        />
        <Route path="/page/Login" exact={true} render={() => <Login />} />
        <Route path="/page/SignUp" exact={true} render={() => <SignUp />} />
        <Route path="/page/MainPage" exact={true} render={() => <MainPage />} />

        <Route path="/page/Hot" exact={true} render={() => <Hot />} />

        <Route path="/page/Trade" exact={true} render={() => <Trade />} />

        <Route path="/page/Noti" exact={true} render={() => <Noti />} />

        <Route path="/page/Profile" exact={true} render={() => <Profile />} />
        <Redirect to={`/page/${name}`} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="MainPage" href="/page/MainPage">
          <IonIcon icon={homeOutline} />
          <IonLabel>主頁</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Hot" href="/page/Hot">
          <IonIcon icon={heartCircleOutline} />
          <IonLabel>熱門</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Trade" href="/page/Trade">
          <IonIcon icon={duplicateOutline} />
          <IonLabel>交易</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Noti" href="/page/Noti">
          <IonIcon icon={notificationsOutline} />
          <IonLabel>通知</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Profile" href="/page/Profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>個人資料</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
