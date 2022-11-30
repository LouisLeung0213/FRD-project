import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  callOutline,
  cardOutline,
  closeCircleOutline,
  mailOutline,
  personOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";
import { API_ORIGIN } from "../../api";
import { useImageFiles } from "../../hooks/usePhotoGallery";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";
import styles from "./UpdateProfile.module.scss";
import storage from "../../firebaseConfig";
import icon from "../../image/new_usericon.jpeg";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";

const UpdateProfile: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  console.log("jwtState.icon_src: ", jwtState.icon_src);
  let real_icon_src = "";

  if (jwtState.icon_src && jwtState.icon_src.includes("$1")) {
    real_icon_src = jwtState.icon_src.split("$1").join("?");
  } else if (jwtState.icon_src) {
    real_icon_src = jwtState.icon_src;
  }
  const { photos, takePhoto } = useImageFiles();
  const [showedIcon, setShowedIcon] = useState(real_icon_src as string);
  useEffect(() => {
    let photosLength = photos.length;
    if (photosLength > 0) {
      let lastPhoto = photos[photosLength - 1];
      setShowedIcon(lastPhoto.dataUrl);
    }
  }, [photos]);

  const router = useIonRouter();
  const dispatch = useDispatch();

  let [isNicknameOk, setIsNicknameOk] = useState(true);
  let [isPhoneOk, setIsPhoneOk] = useState(true);
  let [isEmailOk, setIsEmailOk] = useState(true);
  let [banks, setBanks] = useState([]) as any;
  let [savedBanks, setSavedBanks] = useState() as any;

  let [percent, setPercent] = useState(0);

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
    return bankArr;
  }

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
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        savedBankNameArr,
        savedBankAccount
      );
      let savedBankArr: any = [];

      for (let i = 0; i < json.bank_name_arr.length; i++) {
        console.log("saved bank:", json[i]);
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

  useEffect(() => {
    async function get() {
      let bank = await getBankSelect();
      let userBank = await getSavedBank();
      console.log("user bank:", userBank);
      setSavedBanks(userBank);
      setBanks(bank);
    }
    get();
  }, []);

  async function deleteBank(account: any) {
    let result = await fetch(`${API_ORIGIN}/information/deleteBank`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountShouldDelete: account,
      }),
    });
  }

  async function updateInfo(data: any) {
    if (data.nickname.length == 0) {
      setIsNicknameOk(false);
      return;
    } else {
      setIsNicknameOk(true);
    }
    if (data.phone.length == 0) {
      setIsPhoneOk(false);
      return;
    } else {
      setIsPhoneOk(true);
    }
    if (data.email.length == 0) {
      setIsEmailOk(false);
      return;
    } else {
      setIsEmailOk(true);
    }

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

    let now = Date.now();

    let icon_url = jwtState.icon_src;
    let icon_name = jwtState.icon_name;

    function uploadBytesResumablePromise(photo: any): Promise<string> {
      return new Promise((resolve, reject) => {
        findMIMEType(photo.file.type);
        let name = `/icons/${photo.name}+${jwtState.id}+${now}`;
        const storageRef = ref(storage, name);
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
              resolve(url);
            });
          }
        );
      });
    }

    function deleteImage(icon_name: string) {
      const storage = getStorage();

      // Create a reference to the file to delete
      const desertRef = ref(storage, icon_name);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        });
    }
    try {
      let photosLength = photos.length;
      let lastPhoto = photos[photosLength - 1];
      if (jwtState.icon_name !== "/default/new_usericon.jpeg+1+1669717126192") {
        deleteImage(jwtState.icon_name!);
      }
      icon_url = await uploadBytesResumablePromise(lastPhoto);
      icon_name = `/icons/${lastPhoto.name}+${jwtState.id}+${now}`;

      let res = await fetch(
        `${API_ORIGIN}/users/updateUserInfo/${jwtState.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: state.nickname,
            phone: state.phone,
            email: state.email,
            icon_name: icon_name,
            icon_src: icon_url,
            bank_name: state.bank_name,
            bank_account: state.bank_account,
          }),
        }
      );
      let json = await res.json();

      if (json) {
        dispatch(
          updateJwt({
            jwtKey: jwtState.jwtKey,
            id: jwtState.id,
            username: jwtState.username,
            nickname: state.nickname,
            phone: state.phone,
            email: state.email,
            joinedTime: jwtState.joinedTime,
            isAdmin: jwtState.isAdmin,
            bankAccount: jwtState.bankAccount,
            icon_name: icon_name,
            icon_src: jwtState.icon_src,
          })
        );
      }

      console.log("reduxState: ", jwtState);
      // router.push(routes.tab.profile, "forward", "pop");
      router.goBack();
      // router.push(routes.tab.profile, "forward", "replace");
    } catch (error) {
      console.log(error);
    }
  }

  const { state, item } = useIonFormState({
    nickname: jwtState.nickname,
    phone: jwtState.phone,
    email: jwtState.email,
    bank_name: "",
    bank_account: "",
  });

  function showPhotos() {
    let photosLength = photos.length;
    console.log("photos: ", photos);
    console.log("photos length: ", photosLength);
    console.log("last photo: ", photos[photosLength - 1]);
  }
  console.log("bankAccount: :: ", jwtState.bankAccount);
  return (
    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle>設定帳號</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <div
            style={{
              margin: "20px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <img onClick={takePhoto} src={showedIcon}></img>
          </div>
          <IonList>
            {item({
              name: "nickname",
              renderLabel: () => (
                <>
                  <IonLabel position="floating">
                    <IonIcon
                      className={styles.tagIcon}
                      icon={personOutline}
                    ></IonIcon>
                    暱稱:
                  </IonLabel>
                </>
              ),
              renderContent: (props) => (
                <IonInput type="text" {...props}></IonInput>
              ),
            })}
            <div className="ion-text-center">
              {!isNicknameOk ? (
                <IonText color="warning">請輸入有效暱稱</IonText>
              ) : null}
            </div>
            {item({
              name: "phone",
              renderLabel: () => (
                <>
                  <IonLabel position="floating">
                    <IonIcon
                      className={styles.tagIcon}
                      icon={callOutline}
                    ></IonIcon>
                    電話號碼::
                  </IonLabel>
                </>
              ),
              renderContent: (props) => (
                <IonInput type="text" {...props}></IonInput>
              ),
            })}
            <div className="ion-text-center">
              {!isPhoneOk ? (
                <IonText color="warning">請輸入有效電話號碼</IonText>
              ) : null}
            </div>
            {item({
              name: "email",
              renderLabel: () => (
                <IonLabel position="floating">
                  <IonIcon
                    className={styles.tagIcon}
                    icon={mailOutline}
                  ></IonIcon>
                  電子郵件:
                </IonLabel>
              ),
              renderContent: (props) => (
                <IonInput
                  type="text"
                  // onKeyDown={(e) => {
                  //   if (e.key == "Enter") {
                  //     updateInfo(state);
                  //   }
                  // }}
                  {...props}
                ></IonInput>
              ),
            })}
            <div className="ion-text-center">
              {!isEmailOk ? (
                <IonText color="warning">請輸入有效電子郵件</IonText>
              ) : null}
            </div>
            <br />
            <div className="ion-padding">
              <IonLabel>已儲存的銀行戶口</IonLabel>
              {savedBanks?.map((item: any, index: number) => {
                return (
                  <>
                    <IonItem className="savedBank" key={index}>
                      <IonIcon
                        className={styles.tagIcon}
                        icon={cardOutline}
                      ></IonIcon>
                      {item.bankName}: {item.bankAccount}
                      <IonButton
                        fill="clear"
                        slot="end"
                        onClick={() => {
                          setSavedBanks(
                            savedBanks.filter((i: any) => i != item)
                          );
                          deleteBank(item.bankAccount);
                        }}
                      >
                        <IonIcon
                          size="small"
                          icon={closeCircleOutline}
                        ></IonIcon>
                      </IonButton>
                    </IonItem>
                  </>
                );
              })}
            </div>

            {item({
              name: "bank_name",
              renderLabel: () => (
                <IonLabel position="floating">新增銀行:</IonLabel>
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
            })}
            {item({
              name: "bank_account",
              renderLabel: () => (
                <IonLabel position="floating">請輸入戶口號碼:</IonLabel>
              ),
              renderContent: (props) => (
                <IonInput type="text" {...props}></IonInput>
              ),
            })}

            <IonMenuToggle>
              <IonButton
                className="ion-margin-top"
                onClick={() => {
                  updateInfo(state);
                }}
                expand="block"
              >
                完成
              </IonButton>
            </IonMenuToggle>
          </IonList>
          <IonButton onClick={showPhotos}>show</IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};

export default UpdateProfile;
