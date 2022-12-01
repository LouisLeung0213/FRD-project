import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  heartOutline,
  chatbubbleOutline,
  ribbonOutline,
  searchOutline,
  lockOpenOutline,
  paperPlaneOutline,
  personOutline,
  receiptOutline,
  logOutOutline,
  walletOutline,
  cubeOutline,
} from "ionicons/icons";

import "./Profile.scss";
import icon from "../../image/usericon.png";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";
import React from "react";
import { API_ORIGIN } from "../../api";
import { getValue, removeValue } from "../../service/localStorage";
import { updatePoints } from "../../redux/points/actions";
import { useParams } from "react-router";
import { useSocket } from "../../hooks/use-socket";
import { Socket } from "socket.io-client";
import { routes } from "../../routes";

const Profile: React.FC<{ user: number | undefined }> = (props: {
  user: number | undefined;
}) => {
  let jwtState = useSelector((state: RootState) => state.jwt);
  // if (jwtState.icon_src && jwtState.icon_src.includes("$1")) {
  //   real_icon_src = jwtState.icon_src.split("$1").join("?");
  // } else if (jwtState.icon_src) {
  //   real_icon_src = jwtState.icon_src;
  // }

  let pointsState = useSelector((state: RootState) => state.points);

  let real_icon_src = "";
  useEffect(() => {
    if (jwtState.icon_src && jwtState.icon_src.includes("$1")) {
      real_icon_src = jwtState.icon_src.split("$1").join("?");
    } else if (jwtState.icon_src) {
      real_icon_src = jwtState.icon_src;
    }
    setShowedIcon(real_icon_src);
  }, [jwtState]);

  let [nickname, setNickname] = useState(jwtState.nickname);
  let [username, setUsername] = useState(jwtState.username);
  let [joinTime, setJoinTime] = useState(jwtState.joinedTime);
  let [showedIcon, setShowedIcon] = useState(real_icon_src as string);
  let [points, setPoints] = useState(pointsState.points);
  const dispatch = useDispatch();
  let params: any = useParams();

  //jwtKey, reduxNickname

  const getOwnProfile = async () => {
    let userId = await getValue("userId");
    setNickname(jwtState.nickname);
    setUsername(jwtState.username);
    setPoints(pointsState.points);
    setJoinTime(moment(jwtState.joinedTime).format("MMMM Do YYYY"));
  };

  const getOtherProfile = async () => {
    //TODO
  };

  useEffect(() => {
    if (props.user === jwtState.id || params.id == jwtState.id) {
      getOwnProfile();
    } else {
      getOtherProfile();
    }
  }, [jwtState, pointsState]);

  //jwtKey, reduxNickname

  function destroyUserInfo() {
    removeValue("Jwt");
    dispatch(
      updateJwt({
        jwtKey: null,
        id: undefined,
        username: undefined,
        nickname: undefined,
        phone: undefined,
        email: undefined,
        joinedTime: undefined,
        isAdmin: false,
        bankAccount: [{}],
        icon_name: undefined,
        icon_src: undefined,
      })
    );
  }

  function func() {
    console.log("Current pointsState: ", pointsState.points);
    // console.log(pointsState);
  }
  return (
    <>
      <IonMenu contentId="profile">
        <IonHeader>
          <IonToolbar>
            <IonTitle>設定</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <IonList>
            <IonItem routerLink={routes.menu.accountSetting}>
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
              <img src={showedIcon} className="personalIcon" />
            </div>
            <div className="personalInfo">
              <div className="personalInfo_name">
                <IonLabel>{nickname}</IonLabel>
              </div>
              <IonLabel>可用點數: {pointsState.points}</IonLabel>
              <div>
                <IonLabel>{joinTime}</IonLabel>
              </div>
            </div>
          </div>
          <div className="">
            <IonList>
              <IonItem>
                <IonIcon icon={heartOutline} className="chat" />
              </IonItem>
              <IonItem>
                <IonIcon icon={chatbubbleOutline} className="chat" />
              </IonItem>
              <IonItem>
                <IonIcon icon={ribbonOutline} className="chat" />
              </IonItem>
            </IonList>
          </div>

          <IonItem className="search">
            <IonIcon className="searchIcon" icon={searchOutline} />
            <IonInput placeholder="搜尋此賣家的產品"></IonInput>
          </IonItem>
          <IonItem className="portfolioContainer">
            <IonLabel>
              <IonIcon icon={cubeOutline}></IonIcon> 拍賣產品
            </IonLabel>
          </IonItem>

          <IonButton onClick={func}>Show the redux state</IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};

export default React.memo(Profile);
