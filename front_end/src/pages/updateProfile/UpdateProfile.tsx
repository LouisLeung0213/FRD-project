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

import icon from "../../image/usericon.png";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";
import styles from "./UpdateProfile.module.scss";

const UpdateProfile: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  const { photos, takePhoto } = useImageFiles();
  const pointsStates = useSelector((state: RootState) => state.points);

  const router = useIonRouter();
  const dispatch = useDispatch();

  let [isNicknameOk, setIsNicknameOk] = useState(true);
  let [isPhoneOk, setIsPhoneOk] = useState(true);
  let [isEmailOk, setIsEmailOk] = useState(true);
  let [banks, setBanks] = useState([]) as any;
  let [savedBanks, setSavedBanks] = useState() as any;

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
    console.log("state: ", state);
    try {
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
    icon: jwtState.icon_src,
    nickname: jwtState.nickname,
    phone: jwtState.phone,
    email: jwtState.email,
    bank_name: "",
    bank_account: "",
  });

  function showPhotos() {
    console.log("photos: ", photos);
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
          <IonList>
            {item({
              name: "nickname",
              renderContent: (props) => (
                <div
                  style={{ padding: "0px" }}
                  className="icon"
                  onClick={takePhoto}
                  {...props}
                >
                  <img src={icon}></img>
                </div>
              ),
            })}
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
