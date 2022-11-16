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
} from "@ionic/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";

// import ExploreContainer from "../../components/ExploreContainer";
// import ProfileContainer from "../../components/ProfileContainer";
import icon from "../../image/usericon.png";
import { RootState } from "../../store";

// import "./Profile.css";

const UpdateProfile: React.FC = () => {
  const username = useSelector((state: RootState) => state.username);
  const nickname = useSelector((state: RootState) => state.nickname);
  const phone = useSelector((state: RootState) => state.phone);
  const email = useSelector((state: RootState) => state.email);

  let [isUsernameOk, setIsUsernameOk] = useState(true)
  let [isNicknameOk, setIsNicknameOk] = useState(true)
  let [isPhoneOk, setIsPhoneOk] = useState(true)
  let [isEmailOk, setIsEmailOk] = useState(true)

  async function handleSubmit() {


    // const res = await fetch("/UpdateUserInfo");
  }

  async function updateInfo(state: any) {
    console.log(state);
    
  }

  const { state, item } = useIonFormState({
    username: username,
    nickname: nickname,
    phone: phone,
    email: email
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
          <form onSubmit={handleSubmit} className="ion-padding">
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
          <div>---------我是分隔線---------</div>
          <IonList className="ion-padding">
          {item({
            name: "username",
            renderLabel: () => <IonLabel position="floating">帳號:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" value="{username}" {...props}></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isUsernameOk ? (
              <IonText color="warning">帳號呢？?</IonText>
            ) : null}
          </div>
          {item({
            name: "nickname",
            renderLabel: () => <IonLabel position="floating">暱稱:</IonLabel>,
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
            renderLabel: () => <IonLabel position="floating">電話號碼::</IonLabel>,
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
            renderLabel: () => <IonLabel position="floating">電子郵件:</IonLabel>,
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
          <IonButton
            className="ion-margin-top"
            onClick={() => {
              updateInfo(state);
            }}
            expand="block"
          >
            完成
          </IonButton>
        </IonList>




        </IonContent>
      </IonPage>
    </>
  );
};

export default UpdateProfile;
