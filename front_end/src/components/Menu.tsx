import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { Route, useLocation } from "react-router-dom";
import {
  bookmarkOutline,
  lockOpenOutline,
  lockOpenSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  peopleCircleOutline,
  personOutline,
  personSharp,
  receiptOutline,
  receiptSharp,
  trashOutline,
  trashSharp,
} from "ionicons/icons";
import "./Menu.css";
import Invoice from "../pages/Invoice/Invoice";
import Login from "../pages/Login/Login";
import NotiSetUp from "../pages/NoticeSetUp/NoticeSetUp";
import PasswordChange from "../pages/PasswordChange/PasswordChange";
import SignUp from "../pages/SignUp/SignUp";
import UpdateProfile from "../pages/updateProfile/UpdateProfile";
import NoticeSetUp from "../pages/NoticeSetUp/NoticeSetUp";

const Menu: React.FC = () => {
  return (
    <>
      <IonRouterOutlet>
        <Route
          path="/AccountSetting"
          exact={true}
          render={() => <UpdateProfile />}
        />
        <Route
          path="/NoticeSetUp"
          exact={true}
          render={() => <NoticeSetUp />}
        />
        <Route
          path="/PasswordChange"
          exact={true}
          render={() => <PasswordChange />}
        />
        <Route path="/Invoice" exact={true} render={() => <Invoice />} />
        <Route path="/Login" exact={true} render={() => <Login />} />
        <Route path="/SignUp" exact={true} render={() => <SignUp />} />
      </IonRouterOutlet>

      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>設定</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonMenuToggle>
              <IonItem routerLink="/AccountSetting">
                <IonIcon icon={personOutline} />
                <IonLabel>設定個人帳號</IonLabel>
              </IonItem>

              <IonItem routerLink="/NotiSetUp">
                <IonIcon icon={paperPlaneOutline} />
                <IonLabel>通知設定</IonLabel>
              </IonItem>

              <IonItem routerLink="/PasswordChange">
                <IonIcon icon={lockOpenOutline} />
                <IonLabel>更改密碼</IonLabel>
              </IonItem>

              <IonItem routerLink="/Invoice">
                <IonIcon icon={receiptOutline} />
                <IonLabel>電子收據</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
};

export default Menu;
