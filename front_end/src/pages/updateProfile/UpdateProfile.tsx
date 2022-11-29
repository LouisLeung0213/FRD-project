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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";
import { API_ORIGIN } from "../../api";
import { useImageFiles } from "../../hooks/usePhotoGallery";

import icon from "../../image/usericon.png";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";

const UpdateProfile: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  const { photos, takePhoto } = useImageFiles();
  const pointsStates = useSelector((state: RootState) => state.points);

  const router = useIonRouter();
  const dispatch = useDispatch();

  let [isNicknameOk, setIsNicknameOk] = useState(true);
  let [isPhoneOk, setIsPhoneOk] = useState(true);
  let [isEmailOk, setIsEmailOk] = useState(true);
  let [banks, setBanks] = useState([]);
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

  useEffect(() => {
    async function get() {
      let bank = await getBankSelect();
      console.log(bank);
      setBanks(bank);
    }
    get();
  }, []);

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
                  <IonLabel position="floating">暱稱:</IonLabel>
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
                <IonLabel position="floating">電話號碼::</IonLabel>
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
                <IonLabel position="floating">電子郵件:</IonLabel>
              ),
              renderContent: (props) => (
                <IonInput
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      updateInfo(state);
                    }
                  }}
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
              {jwtState.bankAccount?.map((item) => {
                return <IonItem>{item}</IonItem>;
              })}
            </div>
            <br />
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
