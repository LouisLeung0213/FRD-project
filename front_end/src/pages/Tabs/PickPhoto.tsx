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
import "./PickPhoto.css";
import { useIonFormState } from "react-use-ionic-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { API_ORIGIN } from "../../api";

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
  const id = useSelector((state: RootState) => state.id);

  function dismiss() {
    qualityModal.current?.dismiss();
    previewModal.current?.dismiss();
  }

  const tags = ["Disney", "模型", "限量版", "Marvel"];
  const locationSelections = ["荃灣西"];

  const [isQualityPlan, setIsQualityPlan] = useState(false);
  const [isTitleOk, setTitleOk] = useState(true);
  const [isDescriptionOk, setIsDescriptionOk] = useState(true);
  const [isStartPriceOk, setStartPriceOk] = useState(true);
  const [isLocationOk, setIsLocationOk] = useState(true);

  const { state, item } = useIonFormState({
    title: "",
    description: "",
    tags: [""],
    startPrice: "",
    location: "",
    qualityPlan: false,
    promotion: false,
  });

  function formAppend() {
    let data = state;
    let formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.tags.length > 0) {
      data.tags.forEach((tag: string) => {
        formData.append("tags", tag);
      });
    }
    formData.append("startPrice", data.startPrice);
    formData.append("location", data.location);
    formData.append("qualityPlan", data.qualityPlan ? "t" : "f");
    formData.append("promotion", data.promotion ? "t" : "f");

    // if (blobData.length != 0) {
    //   blobData.forEach((blobPhoto) => formData.append("photo", blobPhoto));
    // }
    for (let photo of photos) {
      formData.append("photo", photo.file);
    }
    // if (items.length != 0) {
    //   items.forEach((image) => {
    //     formData.append("image", image.dataUrl);
    //   });
    // }
    console.log("Form Data: ", formData);
    return formData;
  }

  //console.log(items);
  const submitForm = async (data: any) => {
    console.log(state.title);
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
      dismiss();
    } else {
      setIsLocationOk(true);
    }

    if (data.startPrice.length == 0 || !data.startPrice.match(numReg)) {
      setStartPriceOk(false);
      dismiss();
    } else {
      setStartPriceOk(true);
    }

    console.log("pass");

    let formDataUpload = formAppend();

    console.log("state.title =  ", state.title);

    let res = await fetch(`${API_ORIGIN}/posts/postItem`, {
      method: "POST",
      // headers: {
      //   "Content-type": "multipart/form-data",
      // },
      body: formDataUpload,
      // body: JSON.stringify({
      //   title: state.title,
      //   description: state.description,
      //   tags: state.tags,
      //   startPrice: state.startPrice,
      //   location: state.location,
      //   qualityPlan: state.qualityPlan,
      //   promotion: state.promotion,
      // }),
    });
    let result = await res.json();
    console.log(result);

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
                      <img src={photo.dataUrl} key={index} />
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
                        如選擇認證計劃，將默認接受以下規條：
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
