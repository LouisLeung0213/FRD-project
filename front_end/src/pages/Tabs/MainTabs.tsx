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
import { people, informationCircle, location } from "ionicons/icons";
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
        <IonTabButton tab="Profile" href="/page/Profile">
          <IonIcon icon={people} />
          <IonLabel>個人資料</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Post" href="/page/Post">
          <IonIcon icon={location} />
          <IonLabel>賣野</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Profile" href="/page/Profile">
          <IonIcon icon={informationCircle} />
          <IonLabel>About</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
