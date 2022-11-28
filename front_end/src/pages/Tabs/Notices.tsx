import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import "./Notices.css";

const Notices: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>通知</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen={true}>
        <IonItem>最新資訊</IonItem>
        <IonItem>沒有最新消息</IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Notices;
