import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import { camera, imagesOutline, trash } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { base64FromPath, usePhotoGallery } from "../../hooks/usePhotoGallery";
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
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type ImageItem = {
  file: File;
  dataUrl: string;
};

const PickPhoto: React.FC = () => {
  const { photos, setPhotos, takePhoto } = usePhotoGallery();
  const [items, setItems] = useState<ImageItem[]>([]);
  const qualityModal = useRef<HTMLIonModalElement>(null);
  const previewModal = useRef<HTMLIonModalElement>(null);
  //const [modalShow, setModalShow] = useState(false);
  const id = useSelector((state: RootState) => state.id);

  function dismiss() {
    qualityModal.current?.dismiss();
    previewModal.current?.dismiss();
  }

  const tags = ["Disney", "模型", "限量版", "Marvel"];

  const [isTitleOk, setTitleOk] = useState(true);
  const [isDescriptionOk, setIsDescriptionOk] = useState(true);
  const [isStartPriceOk, setStartPriceOk] = useState(true);
  const [isDealPriceOk, setIsDealPriceOk] = useState(true);

  const { state, item } = useIonFormState({
    title: "",
    description: "",
    tags: [""],
    startPrice: "",
    dealPrice: "",
    qualityPlan: false,
    promotion: false,
  });

  const onSubmit = async (data: any) => {
    console.log(state);
    if (data.title.length == 0) {
      setTitleOk(false);
    } else {
      setTitleOk(true);
    }
    let numReg = /^\d+$/;
    if (data.description.length == 0) {
      setIsDescriptionOk(false);
    } else {
      setIsDescriptionOk(true);
    }
    if (data.startPrice.length == 0 || !data.startPrice.match(numReg)) {
      setStartPriceOk(false);
      dismiss();
    } else {
      setStartPriceOk(true);
    }
    if (data.dealPrice.length > 0 && !data.dealPrice.match(numReg)) {
      setIsDealPriceOk(false);
      dismiss();
      return;
    } else {
      setIsDealPriceOk(true);
    }

    console.log("pass");

    let res = await fetch(`http://localhost:1688/postItem/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        tags: data.tags,
        startPrice: data.startPrice,
        dealPrice: data.dealPrice,
        qualityPlan: data.qualityPlan,
        promotion: data.promotion,
      }),
    });

    dismiss();
  };

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
            <IonButton className="but" id="preview-dialog">
              發佈
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <>
          <IonModal
            id="preview-modal"
            ref={previewModal}
            trigger="preview-dialog"
          >
            <IonContent className="ion-padding">
              <IonText>
                請再次確認帖文內容。
                <br />
                底價在帖文發佈後將不可更改。
              </IonText>
            </IonContent>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <IonButton slot="center" onClick={dismiss}>
                返回
              </IonButton>
              <IonButton slot="center" onClick={() => onSubmit(state)}>
                發佈
              </IonButton>
            </div>
          </IonModal>

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
              name: "title",
              renderLabel: () => <IonLabel position="floating">標題</IonLabel>,
              renderContent: (props) => (
                <IonInput placeholder="請輸入帖文標題" {...props}></IonInput>
              ),
            })}
            <div className="ion-text-center">
              {!isTitleOk ? <IonText color="danger">請加入標題</IonText> : null}
            </div>
            <br />

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
            <div className="ion-text-center">
              {!isDescriptionOk ? (
                <IonText color="danger">請輸入產品描述</IonText>
              ) : null}
            </div>
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
            <div className="ion-text-center">
              {!isStartPriceOk ? (
                <IonText color="danger">請輸入有效底價</IonText>
              ) : null}
            </div>
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
            <IonLabel># 不會在帖文中顯示</IonLabel>
            <div className="ion-text-center">
              {!isDealPriceOk ? (
                <IonText color="danger">請輸入有效目標成交價</IonText>
              ) : null}
            </div>

            <br />
            <br />

            {item({
              name: "qualityPlan",
              renderLabel: () => <IonLabel>加入認證計劃</IonLabel>,
              renderContent: (props) => (
                <IonCheckbox
                  slot="start"
                  id="open-custom-dialog"
                  {...props}
                ></IonCheckbox>
              ),
            })}
            <br />
            <IonModal
              id="qualityPlan-modal"
              ref={qualityModal}
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
                  slot="start"
                  id="open-custom-dialog"
                  {...props}
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
