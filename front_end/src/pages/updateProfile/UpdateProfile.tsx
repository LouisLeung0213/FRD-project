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

// import ExploreContainer from "../../components/ExploreContainer";
// import ProfileContainer from "../../components/ProfileContainer";
import icon from "../../image/usericon.png";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";

// import "./Profile.css";

const UpdateProfile: React.FC = () => {
  const jwtKey = useSelector((state: RootState) => state.jwtKey);
  const id = useSelector((state: RootState) => state.id);
  const username = useSelector((state: RootState) => state.username);
  const nickname = useSelector((state: RootState) => state.nickname);
  const phone = useSelector((state: RootState) => state.phone);
  const email = useSelector((state: RootState) => state.email);
  const joinedTime = useSelector((state: RootState) => state.joinedTime);
  const isAdmin = useSelector((state: RootState) => state.isAdmin);
  const reduxState = useSelector((state: RootState) => state);

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
        `http://localhost:1688/users/updateUserInfo/${id}`,
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
          newJwtKey: jwtKey,
          newId: id,
          newUsername: username,
          newNickname: state.nickname,
          newPhone: state.phone,
          newEmail: state.email,
          newJoinedTime: joinedTime,
          newIsAdmin: isAdmin
        })
      );
      console.log("reduxState: ", reduxState);
      // router.push(routes.tab.profile, "forward", "pop");
      router.goBack();
      // router.push(routes.tab.profile, "forward", "replace");
    } catch (error) {
      console.log(error);
    }
  }

  const { state, item } = useIonFormState({
    nickname: nickname,
    phone: phone,
    email: email,
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
          {/* <form onSubmit={handleSubmit} className="ion-padding">
            <IonItem>
              <IonImg src={icon}></IonImg>
              <IonLabel>更改個人相片</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">帳號:</IonLabel>
              <IonInput value={username}/>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">暱稱:</IonLabel>
              <IonInput value={nickname} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">電話號碼:</IonLabel>
              <IonInput value={phone} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">電子郵件:</IonLabel>
              <IonInput value={email} />
            </IonItem>
            <IonButton className="ion-margin-top" type="submit" expand="block">
              完成
            </IonButton>
          </form>
          <div>---------我是分隔線---------</div> */}
          <IonList className="ion-padding">
            {/* {item({
              name: "username",
              renderLabel: () => (
                <>
                  <IonLabel position="floating">帳號:</IonLabel>
                </>
              ),
              renderContent: (props) => (
                <IonInput type="text" {...props}></IonInput>
              ),
            })}
            <div className="ion-text-center">
              {!isUsernameOk ? (
                <IonText color="warning">帳號呢？?</IonText>
              ) : null}
            </div> */}
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
                <IonText color="warning">暱稱呢？?</IonText>
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
                <IonText color="warning">電話號碼呢？?</IonText>
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
                <IonText color="warning">電子郵件呢???</IonText>
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
