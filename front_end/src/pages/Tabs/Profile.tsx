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
  walletOutline,
} from "ionicons/icons";

import { Preferences } from "@capacitor/preferences";
import "./Profile.css";
import icon from "../../image/usericon.png";

import { Route, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";
import React from "react";
import { API_ORIGIN } from "../../api";
import { getValue, removeValue } from "../../service/localStorage";

const Profile: React.FC<{ user: number | null }> = (props: {
  user: number | null;
}) => {
  let jwtState = useSelector((state: RootState) => state.jwt);

  let pointsState = useSelector((state: RootState) => state.points);
  let [points, setPoints] = useState(pointsState);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProfile = async () => {
      let userId = await getValue("userId");
      let res = await fetch(`${API_ORIGIN}/profiles/${userId}`);

      let result = await res.json();
      console.log("123L:", result);
      setNickname(result.nickname);
      setUsername(result.username);
      setPoints(result.points);
      setJoinTime(moment(result.joinedTime).format("MMMM Do YYYY"));
      dispatch(
        updateJwt({
          jwtKey: jwtState.jwtKey,
          id: result.id,
          username: result.username,
          nickname: result.nickname,
          phone: result.phone,
          email: result.email,
          joinedTime: result.joinedTime,
          isAdmin: result.is_admin,
        })
      );
    };

    getProfile();
  }, []);
  //jwtKey, reduxNickname
  let [nickname, setNickname] = useState(jwtState.nickname);
  let [username, setUsername] = useState(jwtState.username);
  let [joinTime, setJoinTime] = useState(jwtState.joinedTime);

  function destroyUserInfo() {
    removeValue("Jwt");
    dispatch(
      updateJwt({
        jwtKey: null,
        id: null,
        username: null,
        nickname: null,
        phone: null,
        email: null,
        joinedTime: null,
        isAdmin: false,
      })
    );
  }

  function func() {
    console.log(jwtState);
  }
  console.log(jwtState.username, username);

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

            <IonItem routerLink="/Package">
              <IonIcon icon={walletOutline} slot="start" />
              <IonLabel>充值預授權</IonLabel>
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
            {jwtState.username === username ? (
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
            ) : null}
            <IonTitle>個人資料</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="personalInfoContainer">
            <div className="personalIconContainer">
              <img src={icon} className="personalIcon" />
            </div>
            <div>
              <div className="personalInfo">
                <IonLabel>{nickname}</IonLabel>
              </div>
              <IonLabel>可用點數: {pointsState.points}</IonLabel>
              <div>
                <IonLabel>{joinTime}</IonLabel>
              </div>
            </div>
          </div>
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

          <IonItem className="search">
            <IonIcon className="searchIcon" icon={searchOutline} />
            <IonInput placeholder="搜尋此賣家的產品"></IonInput>
          </IonItem>
          <IonItem className="portfolioContainer">
            <IonLabel>My product</IonLabel>
          </IonItem>

          <IonButton onClick={func}>Show the redux state</IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};

export default React.memo(Profile);
