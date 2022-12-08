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
  useIonLoading,
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

const Profile: React.FC<{ id?: number }> = (props: { id?: number }) => {
  const [present, dismiss] = useIonLoading();
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   setIsLoading(true);
  //   present({
  //     message: "Loading...",
  //     duration: 2000,
  //     spinner: "crescent",
  //   });
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // }, []);

  let jwtState = useSelector((state: RootState) => state.jwt);
  let pointsState = useSelector((state: RootState) => state.points);
  let dotsState = useSelector((state: RootState) => state.dots);

  useSocket(
    useCallback((socket: Socket) => {
      socket.on("new-msg", async (data) => {
        let currentUserId = await getValue("userId");
        let userStatus = await fetch(
          `${API_ORIGIN}/users/dots/${currentUserId}`
        );
        let userDots = await userStatus.json();
        console.log("received");
        dispatch(
          updateDots({
            chatDot: userDots.chat_dots,
            noticeDot: userDots.notice_dots,
          })
        );
      });
      getValue("userId").then((userId) => {
        console.log("become TJ");
        socket.emit("leave-TJroom", userId);
        console.log("reJoin");
        socket.emit("join-TJroom", { userId });
      });
      return () => {};
    }, [])
  );

  let real_icon_src = "";
  let [showedIcon, setShowedIcon] = useState(real_icon_src as string);
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
    // setJoinTime(moment(jwtState.joinedTime).format("MMMM Do YYYY"));
    setJoinTime(jwtState.joinedTime);
  };

  const getOtherProfile = async (userId: number) => {
    let res = await fetch(`${API_ORIGIN}/users/findOne/${userId}`);
    let userInfo = await res.json();

    setNickname(userInfo.nickname);
    setUsername(userInfo.username);
    // setJoinTime(moment(userInfo.joinedTime).format("MMMM Do YYYY"));
    setJoinTime(jwtState.joinedTime?.split("T")[0]);
  };

  useEffect(() => {
    if (props.id) {
      getOtherProfile(props.id);
    } else {
      getOwnProfile();
    }
  }, [jwtState, pointsState]);

  useEffect(() => {
    const postsList = async () => {
      if (props.id) {
        let res = await fetch(`${API_ORIGIN}/posts/showSomeone/${props.id}`);
        let result = await res.json();

        setPostsList(result);
      } else {
        // let userId = await getValue("userId");
        let userId = jwtState.id;
        let res = await fetch(`${API_ORIGIN}/posts/showSomeone/${userId}`);
        let result = await res.json();
        console.log(result);
        setPostsList(result);
      }
    };

    postsList();
  }, [jwtState, isPostOpen, pointsState.points]);

  const postModal = useRef<HTMLIonModalElement>(null);
  const loadingModal = useRef<HTMLIonModalElement>(null);

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
  function dismissLoading() {
    loadingModal.current?.dismiss();
    setIsLoading(false);
  }

  function goChat(id: number) {
    router.push(routes.chatroom(id), "forward", "replace");
    dismissPost();
  }
  function afterDeal() {
    router.push(routes.tab.mainPage());
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
          <IonCard style={{ backgroundColor: "black", marginBottom: "10px" }}>
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
                {!props.id || props.id == jwtState.id ? (
                  <div className={profileStyles.personalInfo}>
                    <IonLabel>
                      <IonIcon
                        style={{ color: "gold", marginRight: "10px" }}
                        size="small"
                        icon={wallet}
                      />
                      點數 : {pointsState.points}
                    </IonLabel>
                  </div>
                ) : null}{" "}
                <div className={profileStyles.personalInfo}>
                  <IonLabel>
                    <IonIcon
                      style={{ color: "skyBlue", marginRight: "5px" }}
                      icon={calendar}
                    ></IonIcon>
                    {moment(joinTime).format("MMMM Do YYYY")}
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
                                  {post.status.toString() === "pending_in" ? (
                                    <div className={profileStyles.sold}>
                                      <span
                                        className={profileStyles.pendingText}
                                      >
                                        即將上架
                                      </span>
                                    </div>
                                  ) : null}
                                  {post.status.toString() === "sold&holding" ? (
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
                          <div className={styles.priceContainer}>
                            {!post.max ? (
                              <h1>現價：${post.original_price}</h1>
                            ) : (
                              <h1>現價：${post.max}</h1>
                            )}
                          </div>
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
            <Post
              post={currentPost as PostObj}
              goChat={goChat}
              afterDeal={afterDeal}
            />
          </IonContent>
        </IonModal>

        <IonModal
          id="loading-modal"
          ref={loadingModal}
          isOpen={isLoading}
        ></IonModal>
      </IonPage>
    </>
  );
};

export default React.memo(Profile);
