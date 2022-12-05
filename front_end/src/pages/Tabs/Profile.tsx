import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
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
  heart,
  chatbubble,
  wallet,
  calendar,
} from "ionicons/icons";

import profileStyles from "./Profile.module.css";
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
import { updateDot } from "../../updateDot";
import { updateDots } from "../../redux/dots/actions";

const Profile: React.FC = () => {
  let jwtState = useSelector((state: RootState) => state.jwt);
  let pointsState = useSelector((state: RootState) => state.points);
  let dotsState = useSelector((state: RootState) => state.dots);

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
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const router = useIonRouter();

  const dispatch = useDispatch();
  let params: any = useParams();

  //jwtKey, reduxNickname

  const getOwnProfile = async () => {
    let userId = await getValue("userId");
    let res = await fetch(`${API_ORIGIN}/profiles/${userId}`);

    let userInfo = await res.json();
    dispatch(
      updatePoints({
        points: userInfo.userInfo.points,
      })
    );
    setNickname(jwtState.nickname);
    setUsername(jwtState.username);
    setPoints(pointsState.points);
    setJoinTime(moment(jwtState.joinedTime).format("MMMM Do YYYY"));
  };

  const getOtherProfile = async (userId: number) => {
    let userInfo = await fetch(`${API_ORIGIN}/users/findOne/${userId}`);
    console.log("userInfo: ", userInfo);
  };

  useEffect(() => {
    if (params.id == jwtState.id) {
      // console.log("ownFile", params.id);
      getOwnProfile();
    } else {
      if (params.id !== jwtState.id) {
        // console.log("otherFile,", params.id);
        getOtherProfile(params.id);
      }
    }
  }, [jwtState, pointsState]);

  useEffect(() => {
    const postsList = async () => {
      if (params.id) {
        let res = await fetch(`${API_ORIGIN}/posts/showSomeone/${params.id}`);
        let result = await res.json();
        setPostsList(result);
      } else {
        let res = await fetch(`${API_ORIGIN}/posts/showSomeone/${jwtState.id}`);
        let result = await res.json();
        setPostsList(result);
      }
    };

    postsList();
  }, [jwtState, isPostOpen, pointsState.points]);

  const postModal = useRef<HTMLIonModalElement>(null);

  function destroyUserInfo() {
    removeValue("Jwt");
    removeValue("userId");
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
    dispatch(
      updateDots({
        chatDot: false,
        noticeDot: false,
      })
    );
    dispatch(
      updatePoints({
        points: 0,
      })
    );
  }

  function openPost(e: PostObj) {
    setCurrentPost(e);
    setIsPostOpen(true);
  }

  function dismissPost() {
    postModal.current?.dismiss();
    setIsPostOpen(false);
  }

  function goChat(id: number) {
    router.push(routes.chatroom(id), "forward", "replace");
    dismissPost();
  }

  function func() {
    console.log("Current pointsState: ", pointsState.points);
    console.log("Current jwtState: ", jwtState);
    console.log("current Dots", dotsState);
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

            <IonItem routerLink={`/Invoice/${jwtState.id}`}>
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
          <IonCard
            style={{ backgroundColor: "#0f0f619a", marginBottom: "10px" }}
          >
            <div className={profileStyles.personalIconContainer}>
              <img src={showedIcon} className={profileStyles.personalIcon} />
            </div>
            <IonCardHeader>
              <div className={profileStyles.personalInfo_name}>
                <IonIcon
                  style={{ color: "gold" }}
                  size="small"
                  icon={ribbonOutline}
                  className={profileStyles.miniIcon}
                />
                <IonLabel>{nickname}</IonLabel>
              </div>
            </IonCardHeader>

            <IonCardContent>
              <div className={profileStyles.personalInfoContainer}>
                <div className={profileStyles.personalInfo}>
                  <IonLabel>
                    <IonIcon
                      style={{ color: "gold", marginRight: "10px" }}
                      size="small"
                      icon={wallet}
                    />
                    點數 : {pointsState.points}
                  </IonLabel>
                </div>{" "}
                <div className={profileStyles.personalInfo}>
                  <IonLabel>
                    <IonIcon
                      style={{ color: "skyBlue", marginRight: "5px" }}
                      icon={calendar}
                    ></IonIcon>
                    {joinTime}
                  </IonLabel>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonLabel className="ion-text-center">
            <h1>
              <IonIcon icon={cubeOutline}></IonIcon> 拍賣產品
            </h1>
          </IonLabel>
          {/* <IonButton onClick={func}>Show the redux state</IonButton> */}
          <IonSearchbar
            debounce={1000}
            onIonChange={(ev: any) => setQuery(ev.target.value)}
          ></IonSearchbar>{" "}
          <div>
            <IonList>
              <div className={profileStyles.productContainer}>
                {postsList
                  .filter((postsList) => postsList.post_title.includes(query))
                  .map((post: any) => {
                    return (
                      <IonCard
                        className={styles.postContainer}
                        key={post.id}
                        onClick={() => openPost(post)}
                      >
                        <IonCardTitle className={styles.title}>
                          {!post.admin_title
                            ? post.post_title
                            : post.admin_title}

                          {post.q_mark ? (
                            <IonIcon
                              className={styles.q_mark_icon}
                              icon={checkmarkDoneCircleOutline}
                            ></IonIcon>
                          ) : null}
                        </IonCardTitle>

                        <IonCardContent>
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
                                  {post.status.toString() != "selling" ? (
                                    <div className={profileStyles.sold}>
                                      <span className={profileStyles.soldText}>
                                        此貨品已售出
                                      </span>
                                    </div>
                                  ) : null}
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>

                          {/* <img src={post.json_agg}></img> */}

                          {!post.max ? (
                            <h1>現價：${post.original_price}</h1>
                          ) : (
                            <h1>現價：${post.max}</h1>
                          )}
                        </IonCardContent>
                      </IonCard>
                    );
                  })}
              </div>
            </IonList>
          </div>
        </IonContent>

        <IonModal
          id="post-modal"
          ref={postModal}
          isOpen={isPostOpen}
          // enterAnimation={enterAnimation}
          // leaveAnimation={leaveAnimation}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton
                  onClick={() => {
                    dismissPost();
                  }}
                >
                  <IonIcon size="large" icon={chevronBackOutline}></IonIcon>{" "}
                  Back
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
