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
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  add,
  arrowRedo,
  camera,
  images,
  imagesOutline,
  trash,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import {
  ImageFile,
  useImageFiles,
  usePhotoGallery,
} from "../../hooks/usePhotoGallery";
//import { selectImage, fileToBase64String } from "@beenotung/tslib/file";
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
import styles from "./PickPhoto.module.scss";
import { useIonFormState } from "react-use-ionic-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { API_ORIGIN } from "../../api";

import { routes } from "../../routes";

//firebase storage
import storage from "../../firebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from "firebase/storage";

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
  const jwtState = useSelector((state: RootState) => state.jwt);
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
  const [isPhotoOk, setIsPhotoOk] = useState(true);
  const [percent, setPercent] = useState(0);
  const [bankState, setBankState] = useState(jwtState.bankAccount) as any;
  const [banks, setBanks] = useState([]) as any;
  const [savedBanks, setSavedBanks] = useState() as any;

  const { state, item } = useIonFormState({
    title: "",
    description: "",
    tags: "",
    startPrice: "",
    location: "",
    bankAccount: { bankName: "", bankAccount: "" },
    newBankName: "",
    newBankAccount: "",
    qualityPlan: false,
    promotion: false,
  });

  async function getSavedBank() {
    let result = await fetch(
      `${API_ORIGIN}/information/savedBank/${jwtState.id}`
    );

    let json = await result.json();
    console.log("here!", json);

    if (json.banks_id.length > 0) {
      let savedBankNameArr: any = json.bank_name_arr;
      let savedBankAccount: any = json.banks_id;
      console.log(
        "!!!!!!!!in pick   photo!!!!!!!!!!",
        savedBankNameArr,
        savedBankAccount
      );
      let savedBankArr: any = [];

      for (let i = 0; i < json.bank_name_arr.length; i++) {
        // console.log("saved bank:", json[i]);
        savedBankArr.push({
          bankName: savedBankNameArr[i].bank_name,
          bankAccount: savedBankAccount[i].bank_account,
        });
      }
      console.log("saved bank Array 2222222222:", savedBankArr);
      return savedBankArr;
    } else {
      return;
    }
  }

  async function getBankSelect() {
    let result = await fetch(`${API_ORIGIN}/information/banks`, {
      method: "GET",
    });
    let banks = await result.json();
    let bankArr: any = [];

    for (let bank of banks) {
      console.log(bank.bank_name);
      bankArr.push(bank.bank_name);
    }

    setBanks(bankArr);
  }

  useEffect(() => {
    async function get() {
      await getBankSelect();
      let userBank = await getSavedBank();
      setSavedBanks(userBank);
    }
    get();
    console.log(bankState, "on99", savedBanks);
  }, []);

  function findMIMEType(ext: string) {
    if (ext == "image/jpeg") {
      return {
        contentType: "image/jpeg",
      };
    } else if (ext == "image/png") {
      return {
        contentType: "image/jpeg",
      };
    } else if (ext == "image/webp") {
      return {
        contentType: "image/jpeg",
      };
    } else {
      alert("格式錯誤");
      return;
    }
  }

  function formAppend() {
    let data = state;
    let formData = new FormData();

    formData.append("user_id", jwtState.id ? jwtState.id + "" : "");
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("tags", data.tags);

    formData.append("startPrice", data.startPrice);
    formData.append("location", data.location);

    formData.append("qualityPlan", data.qualityPlan ? "t" : "f");
    formData.append("promotion", data.promotion ? "t" : "f");

    formData.append("bankName", data.bankAccount.bankName);
    formData.append("bankAccount", data.bankAccount.bankAccount);

    //new bank
    formData.append("newBankName", data.newBankName);
    formData.append("newBankAccount", data.newBankAccount);

    console.log("Form Data: ", formData);
    return formData;
  }

  //console.log(items);
  const submitForm = async (data: any) => {
    let ok = true;
    function checkStatus() {
      if (photos.length < 1) {
        setIsPhotoOk(false);
        ok = false;
      } else {
        setIsPhotoOk(true);
      }

      if (data.title.length == 0) {
        setTitleOk(false);
        ok = false;
      } else {
        setTitleOk(true);
      }
      let numReg = /^\d+$/;
      if (data.description.length == 0) {
        setIsDescriptionOk(false);
        ok = false;
      } else {
        setIsDescriptionOk(true);
      }
      if (data.qualityPlan == true && !data.location) {
        setIsLocationOk(false);
        ok = false;
      } else {
        setIsLocationOk(true);
      }
      if (
        data.qualityPlan == true &&
        (data.bankAccount.bank_name == "" || data.bankAccount.bankAccount == "")
      ) {
        setIsBankAccountOk(false);
        ok = false;
      } else if (
        data.qualityPlan == true &&
        (data.bankAccount.bank_name != "" || data.bankAccount.bankAccount != "")
      ) {
        setIsBankAccountOk(true);
      }
      if (data.startPrice.length == 0 || !data.startPrice.match(numReg)) {
        setStartPriceOk(false);
        ok = false;
      } else {
        setStartPriceOk(true);
      }

      dismiss();
      return;
    }

    checkStatus();

    console.log("pass");
    // console.log("ok", ok);

    // console.log("photos", photos);
    let photoQTY = 0;

    if (!photos) {
      alert("不能沒有圖片");
      return;
    } else if (photos.length > 1) {
      photoQTY = photos.length;
    } else if (photos.length == 1) {
      photoQTY = photos.length;
    }
    let urls = [];

    function uploadBytesResumablePromise(photo: any): Promise<string> {
      return new Promise((resolve, reject) => {
        // console.log(photo.file.type);
        findMIMEType(photo.file.type);
        const storageRef = ref(
          storage,
          `/files/${photo.name}+${jwtState.id}+${Date.now()}`
        );
        const uploadTask = uploadBytesResumable(storageRef, photo.file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercent(percent);
          },
          (err) => console.log(err),
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              console.log("url", url);
              // setUrls((prevState) => [...prevState, url]);
              resolve(url);
            });
          }
        );
      });
    }

    for (let photo of photos) {
      let url = await uploadBytesResumablePromise(photo);
      urls.push(url);
    }
    // console.log("finished for loop");
    // console.log({ urls });

    let formDataUpload = formAppend();
    formDataUpload.append("photo_qty", photoQTY as any);
    // console.log("url", urls);
    for (let url of urls) {
      formDataUpload.append("photo", url);
    }
    // console.log(formDataUpload.getAll("photo"));
    let res = await fetch(`${API_ORIGIN}/posts/postItem`, {
      method: "POST",

      body: formDataUpload,
    });
    let result = await res.json();
    // console.log(result);
    if (result.status == 200) {
      router.push(routes.tab.mainPage);
      console.log("done");
    }

    // photos.map((photo) => {
    //   const storageRef = ref(storage, `/files/${photo.name}`);
    //   const uploadTask = uploadBytesResumable(storageRef, photo.file);
    //   promises.push(uploadTask);
    //   uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //       const percent = Math.round(
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //       );

    //       // update progress
    //       setPercent(percent);
    //     },
    //     (err) => console.log(err),
    //     () => {
    //       // download url
    //       getDownloadURL(uploadTask.snapshot.ref).then((url) => {
    //         console.log("url", url);
    //         setUrls((prevState) => [...prevState, url]);
    //       });
    //     }
    //   );
    // });

    // Promise.all(promises)
    //   .then(async () => {
    //     let formDataUpload = formAppend();
    //     console.log("url", urls);
    //     for (let url of urls) {
    //       formDataUpload.append("photo", url);
    //     }
    //     console.log(formDataUpload.getAll("photo"));
    //     let res = await fetch(`${API_ORIGIN}/posts/postItem`, {
    //       method: "POST",

    //       body: formDataUpload,
    //     });
    //     let result = await res.json();
    //     console.log(result);
    //     if (result.status === 200) {
    //       router.push(routes.tab.mainPage, "forward", "replace");
    //       console.log("done");
    //     }
    //   })
    //   .catch((err) => console.log("err", err));

    dismiss();
  };

  // console.log("state.title =  ", state.title);
  // if (firebaseIsOk) {
  //   let res = await fetch(`${API_ORIGIN}/posts/postItem`, {
  //     method: "POST",

  //     body: formDataUpload,
  //   });
  //   let result = await res.json();
  //   console.log(result);
  //   if (result.status === 200) {
  //     router.push(routes.tab.mainPage, "forward", "replace");
  //     console.log("done");
  //   }
  // }

  // async function pickImages() {
  //   let files = await selectImage({
  //     multiple: true,
  //     accept: "image/*",
  //   });
  //   for (let file of files) {
  //     console.log("file:", file);
  //     let dataUrl = await fileToBase64String(file);

  //     setItems((items) => {
  //       return [...items, { file, dataUrl }];
  //     });
  //   }
  // }

  defineCustomElements(window);
  return (
    <IonPage className={styles.PickPhoto}>
      <IonHeader>
        <IonToolbar>
          <IonButton
            className={styles.preview_but}
            fill="clear"
            slot="end"
            id="preview_dialog"
          >
            <IonIcon style={{ color: "#fcd92b" }} icon={arrowRedo}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen={true}>
        <>
          <IonModal
            id={styles.preview_modal}
            ref={previewModal}
            trigger="preview_dialog"
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
              <IonButton onClick={dismiss}>返回</IonButton>
              <IonButton onClick={() => submitForm(state)}>發佈</IonButton>
            </div>
          </IonModal>

          <div>
            <div className={styles.photoButtonDiv}>
              <IonIcon
                style={{ color: "#fcd92b" }}
                size="large"
                icon={images}
              ></IonIcon>

              <p className={styles.label}>加入圖片</p>
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
                className={styles.slide}
              >
                <SwiperSlide className={styles.image_box} onClick={takePhoto}>
                  <IonIcon icon={add}></IonIcon>
                </SwiperSlide>
                {photos.map((photo, index) => {
                  return (
                    <SwiperSlide key={index} className={styles.image_box}>
                      <img src={photo.dataUrl} key={index} />
                      <IonFab
                        slot="fixed"
                        vertical="bottom"
                        horizontal="center"
                      >
                        <IonFabButton
                          className={styles.preview_box}
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
              </Swiper>
              <div className="ion-text-center">
                {!isDescriptionOk ? (
                  <IonText color="danger">請加入至少一張物品照片</IonText>
                ) : null}
              </div>
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
                  className={styles.description}
                  placeholder="請輸入物品詳情"
                  {...props}
                ></IonTextarea>
              ),
            })}
            {!isDescriptionOk ? (
              <div className="ion-text-center">
                <IonText color="danger">請輸入產品描述</IonText>
              </div>
            ) : null}
            <br />
            {item({
              name: "tags",

              renderLabel: () => (
                <IonLabel position="floating">加入標籤 #</IonLabel>
              ),
              renderContent: (props) => (
                <IonInput
                  className={styles.tags}
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
              {!isStartPriceOk ||
              (state.startPrice != "" && !state.startPrice.match(/^\d+$/)) ? (
                <IonText color="danger">請輸入有效底價</IonText>
              ) : null}
            </div>
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
              <div className={styles.wrapper}>
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
                        請注意收貨時會檢查圖片是否真實反映貨品狀態，請使用近照，否則貨品將不會
                        上架及不會收取。
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
            {state.qualityPlan === true
              ? item({
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
              : null}
            {!isLocationOk ? (
              <>
                <div className="ion-text-center">
                  <IonText color="danger">請選擇門市</IonText>{" "}
                </div>
                <br />
              </>
            ) : null}

            {state.qualityPlan === true
              ? item({
                  name: "bankAccount",
                  renderLabel: () => (
                    <IonLabel position="floating">請選擇銀行戶口:</IonLabel>
                  ),
                  renderContent: (props) => (
                    <IonSelect {...props}>
                      {savedBanks.map((account: any) => (
                        <IonSelectOption key={account} value={account}>
                          {account.bankName}: {account.bankAccount}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  ),
                })
              : null}
            {state.qualityPlan === true
              ? item({
                  name: "newBankName",
                  renderLabel: () => (
                    <IonLabel position="floating">新增銀行</IonLabel>
                  ),
                  renderContent: (props) => (
                    <IonSelect {...props}>
                      {banks.map((bank: any) => (
                        <IonSelectOption key={bank} value={bank}>
                          {bank}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  ),
                })
              : null}
            {state.qualityPlan === true
              ? item({
                  name: "newBankAccount",
                  renderLabel: () => (
                    <IonLabel position="floating">輸入戶口</IonLabel>
                  ),
                  renderContent: (props) => (
                    <IonInput placeholder="新增銀行" {...props}></IonInput>
                  ),
                })
              : null}

            {!isBankAccountOk ? (
              <>
                <div className="ion-text-center">
                  <IonText color="danger">請選擇銀行戶口</IonText>
                </div>
                <br />
              </>
            ) : null}
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
