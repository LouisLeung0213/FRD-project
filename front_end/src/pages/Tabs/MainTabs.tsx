import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonIcon,
  IonLabel,
  IonTabButton,
} from "@ionic/react";

import { Route } from "react-router";
import {
  people,
  informationCircle,
  location,
  personCircleOutline,
  duplicateOutline,
  homeOutline,
  heartCircleOutline,
  notificationsOutline,
} from "ionicons/icons";
import { IonReactRouter } from "@ionic/react-router";
import Profile from "./Profile";

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/page/Profile" render={() => <Profile />} />
      </IonRouterOutlet>
      <IonRouterOutlet>
        <Route path="/page/Post" render={() => <Profile />} />
      </IonRouterOutlet>
      <IonRouterOutlet>
        <Route path="/page/Profile" render={() => <Profile />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="Main" href="/page/Main">
          <IonIcon icon={homeOutline} />
          <IonLabel>主頁</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Hot" href="/page/hot">
          <IonIcon icon={heartCircleOutline} />
          <IonLabel>熱門</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Trade" href="/page/Trade">
          <IonIcon icon={duplicateOutline} />
          <IonLabel>交易</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Notification" href="/page/Notification">
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
