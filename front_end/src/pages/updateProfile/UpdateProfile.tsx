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
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";
import { API_ORIGIN } from "../../api";

// import ExploreContainer from "../../components/ExploreContainer";
// import ProfileContainer from "../../components/ProfileContainer";
import icon from "../../image/usericon.png";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";

// import "./Profile.css";

const UpdateProfile: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);

  const pointsStates = useSelector((state: RootState) => state.points);

  const router = useIonRouter();
  const dispatch = useDispatch();

  let [isNicknameOk, setIsNicknameOk] = useState(true);
  let [isPhoneOk, setIsPhoneOk] = useState(true);
  let [isEmailOk, setIsEmailOk] = useState(true);

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
          }),
        }
      );
      let json = await res.json();
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
        })
      );
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
  });

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
        <IonContent>
          <IonList className="ion-padding">
            {item({
              name: "nickname",
              renderLabel: () => (
                <>
                  {" "}
                  <IonImg src={icon}></IonImg>
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
        </IonContent>
      </IonPage>
    </>
  );
};

export default UpdateProfile;
