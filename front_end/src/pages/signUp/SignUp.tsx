import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import ".././Page.css";

const SignUp: React.FC = () => {
  return (
    <form className="ion-padding">
      <IonItem>
        <IonLabel position="floating">帳號:</IonLabel>
        <IonInput />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">密碼:</IonLabel>
        <IonInput type="password" />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">再次輸入密碼:</IonLabel>
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
      <IonItem lines="none">
        <IonLabel>Remember me</IonLabel>
        <IonCheckbox defaultChecked={true} slot="start" />
      </IonItem>
      <IonButton className="ion-margin-top" type="submit" expand="block">
        註冊
      </IonButton>
    </form>
  );
};

export default SignUp;
