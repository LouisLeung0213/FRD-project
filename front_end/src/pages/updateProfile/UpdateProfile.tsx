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
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  personOutline,
  paperPlaneOutline,
  lockOpenOutline,
  receiptOutline,
} from "ionicons/icons";
import { Route } from "react-router";
import Menu from "../../components/Menu";
// import ExploreContainer from "../../components/ExploreContainer";
// import ProfileContainer from "../../components/ProfileContainer";
import icon from "../../image/usericon.png";
import Invoice from "../Invoice/Invoice";
import Login from "../Login/Login";
import NotiSetUp from "../NoticeSetUp/NoticeSetUp";
import PasswordChange from "../PasswordChange/PasswordChange";
import SignUp from "../SignUp/SignUp";
// import "./Profile.css";

const updateProfile: React.FC = () => {
  async function handleSubmit() {
    const res = await fetch("/UpdateUserInfo");
  }

  return (
    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>設定帳號</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form onSubmit={handleSubmit} className="ion-padding">
            <IonItem>
              <IonImg src={icon}></IonImg>
              <IonLabel>更改個人相片</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">帳號:</IonLabel>
              <IonInput />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">暱稱:</IonLabel>
              <IonInput />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">電話號碼:</IonLabel>
              <IonInput />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">電子郵件:</IonLabel>
              <IonInput />
            </IonItem>
            <IonButton className="ion-margin-top" type="submit" expand="block">
              完成
            </IonButton>
          </form>
        </IonContent>
      </IonPage>
    </>
  );
};

export default updateProfile;
