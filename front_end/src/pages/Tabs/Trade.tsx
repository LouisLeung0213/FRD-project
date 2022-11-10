import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
  IonButton,
} from "@ionic/react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { camera, trash, close } from "ionicons/icons";
import { images, square, triangle } from "ionicons/icons";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";

// import "./MainPage.css";

const Trade: React.FC = () => {
  const { takePhoto } = usePhotoGallery();
  defineCustomElements(window);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="ion-text-center">交易</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Trade;
