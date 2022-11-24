import {
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import "./Hot.css";

const Hot: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2 123456789</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonItem>TODO</IonItem>
      </IonContent>
    </IonPage>
  );
};

//
export default Hot;
