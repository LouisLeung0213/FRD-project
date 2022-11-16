import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTabButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  heartOutline,
  chatbubblesOutline,
  ribbonOutline,
  searchOutline,
  lockOpenOutline,
  lockOpenSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  peopleCircleOutline,
  personOutline,
  personSharp,
  receiptOutline,
  receiptSharp,
  trashOutline,
  trashSharp,
  logInOutline,
  logOutOutline,
} from "ionicons/icons";
// import ExploreContainer from "../../components/ExploreContainer";

// import "./Profile.css";
import icon from "../../image/usericon.png";

import { Route, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";
import React from "react";
// import { userInfo } from "os";

const Profile: React.FC<{ user: number | null }> = (props: {
  user: number | null;
}) => {
  let jwtKey = useSelector((state: RootState) => state.jwtKey);
  let currentUsername = useSelector((state: RootState) => state.username);
  let reduxNickname = useSelector((state: RootState) => state.nickname);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProfile = async () => {
      let res = await fetch(`http://localhost:1688/profiles/${props.user}`);
      // let res = await fetch(`http://localhost:1688/profiles/2`);
      let result = await res.json();
      setNickname(result.nickname);
      setUsername(result.username);
      setJoinTime(moment(result.joinedTime).format("MMMM Do YYYY"));
    };

    getProfile();
  }, [jwtKey, reduxNickname]);

  let [nickname, setNickname] = useState("");
  let [username, setUsername] = useState("");
  let [joinTime, setJoinTime] = useState("");

  function destroyUserInfo() {
    dispatch(
      updateJwt({
        newJwtKey: null,
        newId: null,
        newUsername: null,
        newNickname: null,
        newPhone: null,
        newEmail: null,
        newJoinedTime: null,
        newIsAdmin: false,
      })
    );
  }
  let state = useSelector((state: RootState) => state);
  function func() {
    console.log(state);
  }

  return (
    <>
      <IonMenu contentId="profile">
        <IonHeader>
          <IonToolbar>
            <IonTitle>設定</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem routerLink="/AccountSetting">
              <IonIcon icon={personOutline} slot="start" />
              <IonLabel>設定個人帳號</IonLabel>
            </IonItem>

            <IonItem routerLink="/NoticeSetUp">
              <IonIcon icon={paperPlaneOutline} slot="start" />
              <IonLabel>通知設定</IonLabel>
            </IonItem>

            <IonItem routerLink="/PasswordChange">
              <IonIcon icon={lockOpenOutline} slot="start" />
              <IonLabel>更改密碼</IonLabel>
            </IonItem>

            <IonItem routerLink="/Invoice">
              <IonIcon icon={receiptOutline} slot="start" />
              <IonLabel>電子收據</IonLabel>
            </IonItem>

            <IonMenuToggle>
              <IonItem
                onClick={destroyUserInfo}
                routerLink="/tab/Login"
                routerDirection="root"
              >
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>登出</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="profile">
        <IonHeader>
          <IonToolbar>
            {currentUsername === username ? (
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
            ) : null}
            <IonTitle>個人資料</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonItem className="personalIconContainer">
              <IonImg src={icon} className="personalIcon" />
            </IonItem>
            <IonList>
              <IonItem>
                <IonIcon icon={heartOutline} className="chat" />
              </IonItem>
              <IonItem>
                <IonIcon icon={chatbubblesOutline} className="chat" />
              </IonItem>
              <IonItem>
                <IonIcon icon={ribbonOutline} className="chat" />
              </IonItem>
            </IonList>
            <IonItem className="personalInfo">
              <IonLabel>{nickname}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>@{username}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Joined since {joinTime}</IonLabel>
            </IonItem>
            <IonItem className="search">
              <IonIcon className="searchIcon" icon={searchOutline} />
              <IonInput placeholder="搜尋此賣家的產品"></IonInput>
            </IonItem>
            <IonItem className="portfolioContainer">
              <IonLabel>My product</IonLabel>
            </IonItem>
          </IonList>
          <IonButton onClick={func}>Show the redux state</IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};

export default React.memo(Profile);
