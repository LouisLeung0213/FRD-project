import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTabButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  heartOutline,
  chatbubblesOutline,
  ribbonOutline,
  searchOutline,
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
// import ExploreContainer from "../../components/ExploreContainer";

import "./Profile.css";
import icon from "../../image/usericon.png";
import Menu from "../../components/Menu";
import { Route, useLocation } from "react-router";
import Invoice from "../Invoice/Invoice";
import Login from "../Login/Login";
import NotiSetUp from "../NoticeSetUp/NoticeSetUp";
import PasswordChange from "../PasswordChange/PasswordChange";
import SignUp from "../SignUp/SignUp";
import UpdateProfile from "../updateProfile/UpdateProfile";

const Profile: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <IonPage>
        <IonContent fullscreen>
          <IonSplitPane contentId="profile">
            <IonMenu contentId="profile">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Menu</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem routerLink="/AccountSetting">
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>設定個人帳號</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/NotiSetUp">
                    <IonIcon icon={paperPlaneOutline} slot="start" />
                    <IonLabel>通知設定</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/PasswordChange">
                    <IonIcon icon={lockOpenOutline} slot="start" />
                    <IonLabel>更改密碼</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/Invoice">
                    <IonIcon icon={receiptOutline} slot="start" />
                    <IonLabel>電子收據</IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonMenu>
            <IonPage id="profile">
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                  </IonButtons>
                  <IonTitle>個人資料</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem className="wholePersonalContainer">
                    <IonItem className="personalIconContainer">
                      <IonImg src={icon} className="personalIcon" />
                      <IonItem className="iconContainer">
                        <IonIcon icon={heartOutline} className="chat" />
                        <IonIcon icon={chatbubblesOutline} className="chat" />
                        <IonIcon icon={ribbonOutline} className="chat" />
                      </IonItem>
                    </IonItem>
                    <IonItem className="personalInfo">
                      <IonItem className="nameContainer">
                        <IonLabel>Nickname</IonLabel>
                        <IonLabel>@username</IonLabel>
                      </IonItem>
                      <IonLabel>Joined since 2022.02.10</IonLabel>
                    </IonItem>
                    <IonItem className="search">
                      <IonIcon className="searchIcon" icon={searchOutline} />
                      <IonInput placeholder="搜尋此賣家的產品"></IonInput>
                    </IonItem>
                    <IonItem className="portfolioContainer">
                      <IonLabel>My product</IonLabel>
                    </IonItem>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPage>
          </IonSplitPane>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Profile;
