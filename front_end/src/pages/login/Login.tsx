import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import SignUp from "../SignUp/SignUp";

// import "./Login.css";

const Login: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        <form className="ion-padding">
          <IonItem>
            <IonLabel position="floating">帳號:</IonLabel>
            <IonInput />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">密碼:</IonLabel>
            <IonInput type="password" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Remember me</IonLabel>
            <IonCheckbox defaultChecked={true} slot="start" />
          </IonItem>
          <IonButton className="ion-margin-top" type="submit" expand="block">
            登入
          </IonButton>
        </form>
        <IonContent className="ion-padding">
          <IonButton expand="block" onClick={() => setIsOpen(true)}>
            註冊
          </IonButton>
          <IonModal isOpen={isOpen}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>註冊</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>關閉</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <SignUp />
          </IonModal>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Login;
