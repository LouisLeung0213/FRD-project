import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

// import "./Login.css";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>登入</IonTitle>
        </IonToolbar>
      </IonHeader>
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
      </IonContent>
    </IonPage>
  );
};

export default Login;
