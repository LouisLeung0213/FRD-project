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

const PasswordChange: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>更改密碼</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>TODO</IonItem>
      </IonContent>
    </IonPage>
  );
};

export default PasswordChange;
