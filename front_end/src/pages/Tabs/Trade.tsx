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
  IonInput,
  IonItem,
} from "@ionic/react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { camera, trash, close } from "ionicons/icons";
import { images, square, triangle } from "ionicons/icons";
import {
  base64FromPath,
  usePhotoGallery,
  UserPhoto,
} from "../../hooks/usePhotoGallery";
import { useEffect, useState } from "react";
import {
  LibraryItem,
  PhotoLibrary,
} from "@awesome-cordova-plugins/photo-library";

import "./Trade.css";

const Trade: React.FC = () => {
  const { photos, setPhotos, takePhoto } = usePhotoGallery();
  // const { photo };
  const [photoImage, setPhotoImage] = useState([""]);

  const loadPhoto = () => {
    PhotoLibrary.requestAuthorization({
      read: true,
      write: true,
    })
      .then(() => {
        PhotoLibrary.getLibrary().subscribe({
          next: (result) => {
            console.log("result:", result);

            let photoData = (result as any).library.map(async function (
              libraryItem: LibraryItem
            ) {
              // ID of the photo
              // console.log(libraryItem.id);

              // console.log(photoData);
              // Cross-platform access to thumbnail
              // console.log(libraryItem.thumbnailURL);
              // console.log(libraryItem.fileName);
              // console.log(libraryItem.width);
              // console.log(libraryItem.height);
              // console.log(libraryItem.creationDate);
              // console.log(libraryItem.latitude);
              // console.log(libraryItem.longitude);

              // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
              // console.log(libraryItem.albumIds);
              // Cross-platform access to photo
              return await base64FromPath(libraryItem.photoURL);
            });
            setPhotoImage([...photoImage, photoData]);
            console.log(photoImage);
          },
          error: (err) => {
            console.log("could not get photos", err);
          },
          complete: () => {
            console.log("done getting photos");
          },
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadPhoto();
  }, []);

  defineCustomElements(window);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="ion-text-center">交易</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="previewWindow">
          <img className="preview" />
        </div>
        <IonGrid>
          <IonRow>
            {/* {photoImage.map((photo, index) => {
              <IonCol size="6" key={index}>
                <IonImg src={photo} />
              </IonCol>;
            })} */}
          </IonRow>
        </IonGrid>

        {/* <IonGrid>
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
        </IonGrid> */}

        {/* <IonFab vertical="top" horizontal="start" slot="fixed">
          <div style={{ display: "flex" }}>
            <IonFabButton onClick={() => takePhoto()}>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={() => pickPhoto()}>
              <IonIcon icon={trash}></IonIcon>
            </IonFabButton>
          </div>
        </IonFab> */}
      </IonContent>
    </IonPage>
  );
};

export default Trade;
