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
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonRouter,
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
  checkmarkDoneCircleOutline,
  chevronBackOutline,
} from "ionicons/icons";

import "./Profile.scss";
import icon from "../../image/usericon.png";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
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
import styles from "./MainPage.module.css";
import Post, { PostObj } from "../Posts/Posts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from "swiper";

const Profile: React.FC<{ user: number | undefined }> = (props: {
  user: number | undefined;
}) => {
  let jwtState = useSelector((state: RootState) => state.jwt);
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
  let [postsList, setPostsList] = useState<[any]>([] as any);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const router = useIonRouter();

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

  const getOtherProfile = async (userId: number) => {
    let userInfo = await fetch(`${API_ORIGIN}/users/findOne/${userId}`)
    console.log("userInfo: ", userInfo)
  };

  useEffect(() => {
    if (props.user === jwtState.id || params.id == jwtState.id) {
      getOwnProfile();
    } else {
      if (props.user){
        getOtherProfile(props.user)
      }
    }
  }, [jwtState, pointsState]);

  useEffect(() => {
    const postsList = async () => {
      if (props.user){
        let res = await fetch(`${API_ORIGIN}/posts/showSomeone/${props.user}`);
        let result = await res.json();
        setPostsList(result);
      } else {
        let res = await fetch(`${API_ORIGIN}/posts/showSomeone/${jwtState.id}`);
        let result = await res.json();
        setPostsList(result);
      }
    };

    postsList();
  }, [jwtState]);

  const modal = useRef<HTMLIonModalElement>(null);


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

  function openPost(e: PostObj) {
    setCurrentPost(e);
    setIsOpen(true);
  }

  function dismiss() {
    modal.current?.dismiss();
    setIsOpen(false);
  }

  function goChat(id: number) {
    router.push(routes.chatroom(id), "forward", "replace");
    dismiss();
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
          <IonList>
          <div slot="content">
            <IonSearchbar
              debounce={1000}
              onIonChange={(ev: any) => setQuery(ev.target.value)}
            ></IonSearchbar>
            {postsList
              .filter((postsList) => postsList.post_title.includes(query))
              .map((post: any) => {
                return (
                  // <IonItem key={e.id} onClick={() => openPost(e)}>
                  //   <img src={e.json_agg[0]}></img>
                  //   {!e.admin_title ? (
                  //     <IonLabel>{e.post_title}</IonLabel>
                  //   ) : (
                  //     <IonLabel>{e.admin_title}</IonLabel>
                  //   )}
                  //   {!post.max ? (
                  //     <IonLabel>${post.original_price}</IonLabel>
                  //   ) : (
                  //     <IonLabel>${post.max}</IonLabel>
                  //   )}
                  //   <IonLabel>{e.nickname}</IonLabel>
                  // </IonItem>
                  <div
                    className={styles.postContainer}
                    key={post.id}
                    onClick={() => openPost(post)}
                  >
                    <div className={styles.nameContainer}>
                      <h4 className={styles.nameText}>
                        <IonIcon
                          className={styles.personIcon}
                          icon={personOutline}
                        ></IonIcon>
                        {post.nickname}
                      </h4>
                      <h2 className={styles.title}>
                        {!post.admin_title ? post.post_title : post.admin_title}

                        {post.q_mark ? (
                          <IonIcon
                            className={styles.q_mark_icon}
                            icon={checkmarkDoneCircleOutline}
                          ></IonIcon>
                        ) : null}
                      </h2>
                    </div>
                    <Swiper
                      modules={[
                        Autoplay,
                        Keyboard,
                        Pagination,
                        Scrollbar,
                        Zoom,
                      ]}
                      autoplay={true}
                      keyboard={true}
                      pagination={true}
                      slidesPerView={1}
                      //scrollbar={true}
                      zoom={true}
                      effect={"fade"}
                      className={styles.slide}
                    >
                      {post.json_agg.map((photo: any, index: any) => {
                        return (
                          <SwiperSlide
                            className={styles.image_slide}
                            key={index}
                          >
                            <img src={photo} key={index} />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                    {/* <img src={post.json_agg}></img> */}
                    <div className={styles.priceContainer}>
                      {!post.max ? (
                        <h3>現價：${post.original_price}</h3>
                      ) : (
                        <h3>現價：${post.max}</h3>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </IonList>

        </IonContent>

        <IonModal
        id="post-modal"
        ref={modal}
        isOpen={isOpen}
        // enterAnimation={enterAnimation}
        // leaveAnimation={leaveAnimation}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                onClick={() => {
                  dismiss();
                }}
              >
                <IonIcon size="large" icon={chevronBackOutline}></IonIcon> Back
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Post post={currentPost as PostObj} goChat={goChat} />
        </IonContent>
      </IonModal>

      </IonPage>
    </>
  );
};

export default React.memo(Profile);
