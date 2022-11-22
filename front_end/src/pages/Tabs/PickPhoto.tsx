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
  useIonRouter,
} from "@ionic/react";
import { add, camera, imagesOutline, trash } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useImageFiles, usePhotoGallery } from "../../hooks/usePhotoGallery";
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
import "./PickPhoto.scss";
import { useIonFormState } from "react-use-ionic-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { API_ORIGIN } from "../../api";

import { routes } from "../../routes";

type ImageItem = {
  file: File;
  dataUrl: string;
};

const PickPhoto: React.FC = () => {
  // const { blobData, photos, setPhotos, takePhoto } = usePhotoGallery();
  const { photos, setPhotos, takePhoto } = useImageFiles();
  const [items, setItems] = useState<ImageItem[]>([]);
  const qualityModal = useRef<HTMLIonModalElement>(null);
  const previewModal = useRef<HTMLIonModalElement>(null);
  //const [modalShow, setModalShow] = useState(false);
  const userId = useSelector((state: RootState) => state.id);
  const router = useIonRouter();
  function dismiss() {
    qualityModal.current?.dismiss();
    previewModal.current?.dismiss();
  }

  const locationSelections = ["荃灣西"];

  const [isTitleOk, setTitleOk] = useState(true);
  const [isDescriptionOk, setIsDescriptionOk] = useState(true);
  const [isStartPriceOk, setStartPriceOk] = useState(true);
  const [isLocationOk, setIsLocationOk] = useState(true);
  const [isBankAccountOk, setIsBankAccountOk] = useState(true);

  const { state, item } = useIonFormState({
    title: "",
    description: "",
    tags: "",
    startPrice: "",
    location: "",
    bankAccount: "",
    qualityPlan: false,
    promotion: false,
  });

  function formAppend() {
    let data = state;
    let formData = new FormData();
    formData.append("user_id", userId ? userId + "" : "");
    formData.append("title", data.title);
    formData.append("description", data.description);

    formData.append("tags", data.tags);

    formData.append("startPrice", data.startPrice);
    formData.append("location", data.location);
    formData.append("bankAccount", data.bankAccount);

    formData.append("qualityPlan", data.qualityPlan ? "t" : "f");
    formData.append("promotion", data.promotion ? "t" : "f");

    for (let photo of photos) {
      formData.append("photo", photo.file);
    }

    console.log("Form Data: ", formData);
    return formData;
  }

  //console.log(items);
  const submitForm = async (data: any) => {
    console.log(state.title);
    let ok = false;
    function checkStatus() {
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
      if (data.qualityPlan == true && !data.location) {
        setIsLocationOk(false);
      } else {
        setIsLocationOk(true);
      }
      if (
        data.qualityPlan == true &&
        !data.bankAccount &&
        !data.bankAccount.match(numReg)
      ) {
        setIsBankAccountOk(false);
      } else {
        setIsBankAccountOk(true);
      }
      if (data.startPrice.length == 0 || !data.startPrice.match(numReg)) {
        setStartPriceOk(false);
      } else {
        setStartPriceOk(true);
      }
      dismiss();
      return;
    }
    checkStatus();

    console.log("pass");

    let formDataUpload = formAppend();

    console.log("state.title =  ", state.title);

    let res = await fetch(`${API_ORIGIN}/posts/postItem`, {
      method: "POST",

      body: formDataUpload,
    });
    let result = await res.json();
    console.log(result);
    if (result.status === 200) {
      router.push(routes.tab.mainPage, "forward", "replace");
    }

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
    <IonPage className="PickPhoto">
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
      <IonContent className="ion-padding" fullscreen={true}>
        <>
          <IonModal
            id="preview-modal"
            ref={previewModal}
            trigger="preview-dialog"
          >
            <IonContent className="ion-padding">
              <ul>
                <li>請再次確認帖文內容。</li>
                <br />
                <li>被投標後，否決投標前價格將不可更改。</li>
                <br />
              </ul>
            </IonContent>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <IonButton slot="center" onClick={dismiss}>
                返回
              </IonButton>
              <IonButton slot="center" onClick={() => submitForm(state)}>
                發佈
              </IonButton>
            </div>
          </IonModal>

          <div>
            <div className="photoButtonDiv ">
              <IonButton slot="start" onClick={() => takePhoto()}>
                <IonIcon icon={imagesOutline}></IonIcon>
              </IonButton>
              <IonLabel className="label">加入物品照片</IonLabel>
            </div>
            <div>
              <Swiper
                modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom]}
                autoplay={true}
                keyboard={true}
                //pagination={true}
                slidesPerView={3}
                scrollbar={true}
                zoom={true}
                effect={"fade"}
                className="slide "
              >
                {photos.map((photo, index) => {
                  return (
                    <SwiperSlide key={index} className="image-box">
                      <img src={photo.dataUrl} key={index} />
                      <IonFab
                        slot="fixed"
                        vertical="bottom"
                        horizontal="center"
                      >
                        <IonFabButton
                          className="preview-box"
                          onClick={() => {
                            console.log("456");
                            setPhotos(photos.filter((p) => p != photo));
                            // let newPhotoArr = [
                            //   ...photos.filter(
                            //     (photo) => photos.indexOf(photo) !== index
                            //   ),
                            // ];
                            // setPhotos(newPhotoArr);
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
                <SwiperSlide className="image-box add-box" onClick={takePhoto}>
                  <IonIcon icon={add}></IonIcon>
                </SwiperSlide>
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

              renderLabel: () => (
                <IonLabel position="floating">加入標籤 #</IonLabel>
              ),
              renderContent: (props) => (
                <IonInput
                  className="tags"
                  placeholder="請於標籤前加入#"
                  {...props}
                ></IonInput>
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
            <br />
            {item({
              name: "qualityPlan",
              renderLabel: () => <IonLabel>加入認證拍賣計劃</IonLabel>,
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
                    <ul>
                      <li>
                        將產品存放於門市倉庫，經公司認證產品狀況，給予買家信心。
                      </li>
                      <br />
                      <li>
                        帖子將於遞交後進入審批狀態，並於賣家把產品交予公司檢查後才發怖。
                      </li>
                      <br />
                      <li>
                        請注意收貨時會檢查圖片是否真實反映貨品狀態，請使用近照，否則將貨品上架及不會收取。
                      </li>
                      <br />
                      <li>
                        如選擇認證拍賣計劃，將默認接受以下規條：
                        <ol>
                          <li>賣家需把貨品交予門市檢查後帖子才會公佈。</li>
                          <li>更改產品描述需等待批核。</li>
                          <li>貨品在一個月後將會根據重量收取存倉費。</li>
                          <ul>
                            <li> ＜1kg: 每月$20 </li>
                            <li> ＜3kg: 每月$40 </li>
                            <li> ＜5kg: 每月$70 </li>
                            <li> ＞5kg: 每月$150 </li>
                          </ul>
                          <li>
                            被投標後，投標需於3日內確認成交與否，3日後投標將會失效！
                          </li>
                        </ol>
                      </li>
                    </ul>
                  </IonText>
                </IonItem>

                <IonButton slot="center" onClick={dismiss} expand="block">
                  我明白了
                </IonButton>
              </div>
            </IonModal>
            {state.qualityPlan === true ? (
              item({
                name: "location",
                renderLabel: () => (
                  <IonLabel position="floating">請選擇存放於門市:</IonLabel>
                ),
                renderContent: (props) => (
                  <IonSelect {...props}>
                    {locationSelections.map((location) => (
                      <IonSelectOption key={location} value={location}>
                        {location}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                ),
              })
            ) : (
              <div></div>
            )}
            <div className="ion-text-center">
              {!isLocationOk ? (
                <IonText color="danger">請選擇門市</IonText>
              ) : null}
            </div>
            <br />
            {state.qualityPlan === true ? (
              item({
                name: "bankAccount",
                renderLabel: () => (
                  <IonLabel position="floating">請輸入銀行戶口:</IonLabel>
                ),
                renderContent: (props) => <IonInput {...props}></IonInput>,
              })
            ) : (
              <div></div>
            )}
            <div className="ion-text-center">
              {!isBankAccountOk ? (
                <IonText color="danger">請輸入有效銀行戶口</IonText>
              ) : null}
            </div>
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
            <IonLabel># 如產品於7日內無投標活動，將自動底價調低5%</IonLabel>
          </div>
        </>
      </IonContent>
    </IonPage>
  );
};

export default PickPhoto;
