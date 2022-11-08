import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import "./Hot.css";

const Hot: React.FC = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2 123456789</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hot</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </>
  );
};

export default Hot;
