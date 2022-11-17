import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { routes } from "../../routes";

const Storages: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          熱拍儲物室
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.tab.adminPanel}></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <></>
      </IonContent>
    </IonPage>
  );
};

export default Storages;
