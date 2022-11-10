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
import { usePhotoGallery, UserPhoto } from "../../hooks/usePhotoGallery";
import { useState } from "react";

// import "./MainPage.css";

const Trade: React.FC = () => {
  const { photos, setPhotos, takePhoto } = usePhotoGallery();
  // const [photoImage, setPhotoImage] = useState(photos);

  defineCustomElements(window);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="ion-text-center">交易</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg
                  src={photo.webviewPath}
                  onClick={() => {
                    console.log("123");
                    console.log(photos);
                    let newPhotoArr = [
                      ...photos.filter(
                        (photo) => photos.indexOf(photo) != index
                      ),
                    ];
                    setPhotos(newPhotoArr);
                  }}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

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
