import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTextarea,
  IonThumbnail,
  IonToolbar,
} from "@ionic/react";
import { camera, cube, imagesOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { base64FromPath, usePhotoGallery } from "../hooks/usePhotoGallery";
import { selectImage, fileToBase64String } from "@beenotung/tslib/file";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from "swiper";

import "swiper/swiper.min.css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "@ionic/react/css/ionic-swiper.css";
import "swiper/swiper.min.css";
import "@ionic/react/css/ionic-swiper.css";
import "./PickPhoto.css";

type ImageItem = {
  file: File;
  dataUrl: string;
};

const PickPhoto: React.FC = () => {
  const { photos, setPhotos, takePhoto } = usePhotoGallery();
  const [items, setItems] = useState<ImageItem[]>([]);

  async function pickImages() {
    let files = await selectImage({
      multiple: true,
      accept: "image/*",
    });
    for (let file of files) {
      console.log("file:", file);
      let dataUrl = await fileToBase64String(file);

      setItems((items) => {
        return [...items, { file, dataUrl }];
      });
    }
  }

  defineCustomElements(window);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton className="but" routerLink="/tab/Trade">
              繼續
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <>
          <div>
            <IonItem className="buttonList">
              <IonButton onClick={() => takePhoto()}>
                <IonIcon icon={camera}></IonIcon>
              </IonButton>
              <IonButton onClick={() => pickImages()}>
                <IonIcon icon={imagesOutline} />
              </IonButton>
            </IonItem>

            <div className="ion-padding">
              <Swiper
                modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom]}
                autoplay={true}
                keyboard={true}
                // pagination={true}
                slidesPerView={3}
                scrollbar={true}
                zoom={true}
                effect={"fade"}
              >
                {items.map((item, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      style={{ width: "120px", height: "120px" }}
                    >
                      <img
                        src={item.dataUrl}
                        key={index}
                        onClick={() => {
                          console.log("123");
                          let newItemArr = [
                            ...items.filter(
                              (item) => items.indexOf(item) !== index
                            ),
                          ];
                          setItems(newItemArr);
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
                {photos.map((photo, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      style={{ width: "120px", height: "120px" }}
                    >
                      <img
                        src={photo.webviewPath}
                        key={index}
                        onClick={() => {
                          console.log("456");
                          let newPhotoArr = [
                            ...photos.filter(
                              (photo) => photos.indexOf(photo) !== index
                            ),
                          ];
                          setPhotos(newPhotoArr);
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            <IonItem className="photoList ion-padding-bottom">
              <IonLabel position="floating">產品描述</IonLabel>
              <IonTextarea
                className="description"
                placeholder="請輸入物品詳情"
              ></IonTextarea>
            </IonItem>
            <IonItem className="ion-padding-bottom">
              <IonLabel position="floating">標籤</IonLabel>
              <IonInput placeholder="#"></IonInput>
            </IonItem>

            <IonItem className="ion-padding-bottom">
              <IonLabel position="floating">底價</IonLabel>
              <IonInput placeholder="請輸入底價"></IonInput>
            </IonItem>
            <IonItem className="ion-padding-bottom">
              <IonLabel position="floating">成交價</IonLabel>
              <IonInput placeholder="請輸入目標成交價"></IonInput>
            </IonItem>
          </div>
        </>
      </IonContent>
    </IonPage>
  );
};

export default PickPhoto;
