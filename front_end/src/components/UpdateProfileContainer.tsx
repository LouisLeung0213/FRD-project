import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import icon from "../image/usericon.png";
// import "./SignUp.css";

const UpdateInfo: React.FC = () => {
  async function handleSubmit() {
    const res = await fetch("/UpdateUserInfo");
  }

  return (
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
  );
};

export default UpdateInfo;
