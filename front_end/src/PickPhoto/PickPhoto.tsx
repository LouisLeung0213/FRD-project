import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonThumbnail,
  IonToolbar,
} from "@ionic/react";
import {
  camera,
  cube,
  imagesOutline,
  personCircle,
  trash,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
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
import { useIonFormState } from "react-use-ionic-form";

type ImageItem = {
  file: File;
  dataUrl: string;
};

const PickPhoto: React.FC = () => {
  const { photos, setPhotos, takePhoto } = usePhotoGallery();
  const [items, setItems] = useState<ImageItem[]>([]);
  const modal = useRef<HTMLIonModalElement>(null);
  const [modalShow, setModalShow] = useState(false);

  function dismiss() {
    modal.current?.dismiss();
    setModalShow(true);
  }

  const tags = ["Disney", "模型", "限量版", "Marvel"];

  const [isDescriptionOk, setIsDescriptionOk] = useState(true);
  const [isStartPriceOk, setStartPriceOk] = useState(true);

  const { state, item } = useIonFormState({
    description: "",
    tags: "",
    startPrice: "",
    dealPrice: "",
    qualityPlan: "",
    promotion: "",
  });

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
            <IonItem
              className="buttonList"
              style={{ margin: "0px auto", width: "fit-content" }}
            >
              <IonButton
                style={{ margin: "1.5rem" }}
                onClick={() => takePhoto()}
              >
                <IonIcon icon={camera}></IonIcon>
              </IonButton>
              <IonButton
                style={{ margin: "1.5rem" }}
                onClick={() => pickImages()}
              >
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
                      <img src={item.dataUrl} key={index} />
                      <IonFab slot="fixed" vertical="bottom" horizontal="end">
                        <IonFabButton
                          onClick={() => {
                            console.log("123");
                            let newItemArr = [
                              ...items.filter(
                                (item) => items.indexOf(item) !== index
                              ),
                            ];
                            setItems(newItemArr);
                          }}
                          color="danger"
                          size="small"
                        >
                          <IonIcon src={trash}></IonIcon>
                        </IonFabButton>
                      </IonFab>
                    </SwiperSlide>
                  );
                })}

                {photos.map((photo, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      style={{ width: "120px", height: "120px" }}
                    >
                      <img src={photo.webviewPath} key={index} />
                      <IonFab slot="fixed" vertical="bottom" horizontal="end">
                        <IonFabButton
                          onClick={() => {
                            console.log("456");
                            let newPhotoArr = [
                              ...photos.filter(
                                (photo) => photos.indexOf(photo) !== index
                              ),
                            ];
                            setPhotos(newPhotoArr);
                          }}
                          color="danger"
                          size="small"
                        >
                          <IonIcon src={trash}></IonIcon>
                        </IonFabButton>
                      </IonFab>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {item({
              name: "description",

              renderLabel: () => (
                <IonLabel position="floating">產品描述</IonLabel>
              ),
              renderContent: (props) => (
                <IonTextarea
                  className="description"
                  placeholder="請輸入物品詳情"
                  {...props}
                ></IonTextarea>
              ),
            })}
            <br />

            {item({
              name: "tags",
              label: "tags",
              renderLabel: () => (
                <IonLabel position="floating">加入標籤</IonLabel>
              ),
              renderContent: (props) => (
                <IonSelect multiple {...props}>
                  {tags.map((tag) => (
                    <IonSelectOption key={tag} value={tag}>
                      {tag}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              ),
            })}
            <br />

            {item({
              name: "startPrice",
              renderLabel: () => <IonLabel position="floating">底價</IonLabel>,
              renderContent: (props) => (
                <IonInput
                  placeholder="請輸入底價 ( 港幣 )"
                  {...props}
                ></IonInput>
              ),
            })}
            <br />

            {item({
              name: "dealPrice",
              renderLabel: () => (
                <IonLabel position="floating">目標價</IonLabel>
              ),
              renderContent: (props) => (
                <IonInput
                  placeholder="請輸入目標成交價 ( 港幣 )"
                  {...props}
                ></IonInput>
              ),
            })}

            <br />

            {item({
              name: "qualityPlan",
              renderLabel: () => <IonLabel>加入認證計劃</IonLabel>,
              renderContent: (props) => (
                <IonCheckbox
                  value="qualityPlan"
                  slot="start"
                  id="open-custom-dialog"
                ></IonCheckbox>
              ),
            })}
            <br />
            <IonModal
              id="example-modal"
              ref={modal}
              trigger="open-custom-dialog"
            >
              <div className="wrapper">
                <IonItem className="ion-padding">
                  <IonText>
                    將產品存放於門市倉庫，經公司認證產品狀況，給予買家信心。
                    <br />
                    帖子將於遞交後進入審批狀態，並於賣家把產品交予公司檢查後才發怖。
                  </IonText>
                </IonItem>

                <IonButton slot="center" onClick={dismiss} expand="block">
                  我明白了
                </IonButton>
              </div>
            </IonModal>

            {item({
              name: "promotion",
              renderLabel: () => <IonLabel>自動調整底價</IonLabel>,
              renderContent: (props) => (
                <IonCheckbox
                  value="promotion"
                  slot="start"
                  id="open-custom-dialog"
                ></IonCheckbox>
              ),
            })}
            <IonLabel># 如產品於7日內無投標活動, 將底價調低5%</IonLabel>
          </div>
        </>
      </IonContent>
    </IonPage>
  );
};

export default PickPhoto;
