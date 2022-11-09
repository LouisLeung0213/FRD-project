import {
  IonBackButton,
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

// import ExploreContainer from "../../components/ExploreContainer";
// import ProfileContainer from "../../components/ProfileContainer";
import icon from "../../image/usericon.png";

// import "./Profile.css";

const UpdateProfile: React.FC = () => {
  async function handleSubmit() {
    const res = await fetch("/UpdateUserInfo");
  }

  return (
    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
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

export default UpdateProfile;
