import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTextarea,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { API_ORIGIN } from "../../api";
import { useSocket } from "../../hooks/use-socket";
import Post, { PostObj } from "../Posts/Posts";
import {
  checkmarkDoneCircleOutline,
  chevronBackOutline,
  notificationsOutline,
  personOutline,
  warningOutline,
} from "ionicons/icons";
import styles from "./MainPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from "swiper";

import "swiper/swiper.min.css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "@ionic/react/css/ionic-swiper.css";
import "swiper/swiper.min.css";
import "@ionic/react/css/ionic-swiper.css";
import { routes } from "../../routes";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store";
import { updateDot } from "../../updateDot";
import { updateDots } from "../../redux/dots/actions";
import Profile from "./Profile";
import { updatePoints } from "../../redux/points/actions";
import { removeValue } from "../../service/localStorage";
import { updateJwt } from "../../redux/user/actions";
import { useParams } from "react-router";

const MainPage: React.FC = () => {
  const [present, dismiss] = useIonLoading();
  let dotState = useSelector((state: RootState) => state.dots);
  let [postsList, setPostsList] = useState<[any]>([] as any);
  const [query, setQuery] = useState("");
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [currentProfile, setCurrentProfile] = useState(0);
  // const [pingNumber, setPingNumber] = useState(0);
  const [noticeDots, setNoticeDots] = useState(dotState.noticeDot);
  
  const dispatch = useDispatch();

  const router = useIonRouter();
  let jwtState = useSelector((state: RootState) => state.jwt);

  const socket = useSocket(
    useCallback((socket: Socket) => {
      socket.on("priceUpdated", (msg) => {
        setPostsList(msg.newPrice);
        return;
      });
      socket.on("new-post", (msg) => {
        console.log("msg", msg);
        setPostsList(msg.newPost);
        return;
      });
      socket.on("post-is-uploaded", async (msg) => {
        if (jwtState.id) {
          let result = await updateDot(jwtState.id, "notice_dots", true);
          if (!dotState.noticeDot) {
            setNoticeDots(result.notice_dots);
          }
          dispatch(
            updateDots({
              chatDot: dotState.chatDot,
              noticeDot: result.notice_dots,
            })
          );
        }
      });
      socket.on("bid-received", async (msg) => {
        if (jwtState.id) {
          let result = await updateDot(jwtState.id, "notice_dots", true);
          if (!dotState.noticeDot) {
            setNoticeDots(result.notice_dots);
          }
          dispatch(
            updateDots({
              chatDot: dotState.chatDot,
              noticeDot: result.notice_dots,
            })
          );
        }
      });
      socket.on("info-seller", async (msg) => {
        if (jwtState.id) {
          let result = await updateDot(jwtState.id, "notice_dots", true);
          if (!dotState.noticeDot) {
            setNoticeDots(result.notice_dots);
          }
          dispatch(
            updateDots({
              chatDot: dotState.chatDot,
              noticeDot: result.notice_dots,
            })
          );
        }
      });
      socket.on("ban", (msg) => {
        alert("????????????????????????????????????????????????");
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
        router.push(routes.tab.login, "forward", "replace");
      });
      socket.on("new-msg", async (data) => {
        console.log("received");
        console.log(data);
        // if (jwtState.id) {
        console.log("here");
        // let userId = await getValue("userId")
        // console.log("username", username);
        console.log(data.receiverId);
        await updateDot(+data.receiverId, "chat_dots", true);
        dispatch(
          updateDots({
            chatDot: true,
            noticeDot: dotState.noticeDot,
          })
        );
        // if (receivedMsg) {
        //   setReceivedMsg(false);
        // } else {
        //   setReceivedMsg(true);
        // }
        // console.log("fake toggle: ", receivedMsg);
        // if(data.newMSG[data.newMSG.length - 1].sender_id != userId){
        //   if(userId){

        //     let result = await updateDot(+userId, "chat_dots", true);
        //     console.log(result);
        //   } else {
        //     alert(userId)
        //     return
        //   }
        // } else {
        //  console.log('you are the sender')
        // }
        // if (dotState.noticeDot) {
        console.log("here1", dotState.chatDot);
        // setChatDots(result.chat_dots);

        // dispatch(
        //   updateDots({
        //     chatDot: result.chat_dots,
        //     noticeDot: dotState.noticeDot,
        //   })
        // );
        // if (data.newMSG[data.newMSG.length - 1].sender_id != userId) {
        //   console.log('i am the receiver')
        //   dispatch(
        //     updateDots({
        //       chatDot: true,
        //       noticeDot: dotState.noticeDot,
        //     })
        //   );
        //   // setChatDots(true);
        // } else {
        //   console.log('i am the sender')
        //   dispatch(
        //     updateDots({
        //       chatDot: false,
        //       noticeDot: dotState.noticeDot,
        //     })
        //   );
        //   // setChatDots(false);
        // }
        // } else {
        //   console.log("here2", dotState.noticeDot);

        //   setChatDots(result.chat_dots);
        //   dispatch(
        //     updateDots({
        //       chatDot: result.chat_dots,
        //       noticeDot: dotState.noticeDot,
        //     })
        //   );
        // }
        // }
      });

      return () => {};
    }, [])
  );
  
  
  let paramPostId: any = useParams()
  
  useEffect(() => {
    if(paramPostId.id){
      const postDetail = async () => {
        let res = await fetch(`${API_ORIGIN}/posts/getOnePost/${paramPostId.id}`)
        let result = await res.json()
        console.log(result)
        openPost(result)
      }
      postDetail()
    }
      const postsList = async () => {
        let res = await fetch(`${API_ORIGIN}/posts/showAll`);
        let result = await res.json();
        
        setPostsList(result);
        console.log("result", result);
      };
    
    
    const dotStatus = async () => {
      if (jwtState.id) {
        let res = await fetch(`${API_ORIGIN}/users/dots/${jwtState.id}`);
        let result = await res.json();
        console.log("dotResult", result);
        if (!result.notice_dots) {
          setNoticeDots(result.notice_dots);
        }
        dispatch(
          updateDots({
            chatDot: result.chat_dots,
            noticeDot: result.notice_dots,
          })
          );
          
      } else {
        return;
      }
    };
    postsList()
    dotStatus();
  }, []);

  const postModal = useRef<HTMLIonModalElement>(null);
  const profileModal = useRef<HTMLIonModalElement>(null);
  const reportModal = useRef<HTMLIonModalElement>(null);
  function modalDismiss() {
    postModal.current?.dismiss();
    profileModal.current?.dismiss();
    reportModal.current?.dismiss();

    setIsPostOpen(false);
    setIsProfileOpen(false);
  }
  function cancelReport() {
    reportModal.current?.dismiss();
    setIsReportOpen(false);
  }

  async function dismissReport() {
    reportModal.current?.dismiss();
    let report = await fetch(`${API_ORIGIN}/report/report`, {
      method: "POST",
      body: JSON.stringify({
        userId: true,
      }),
    });
    let result = await report.json();

    setIsReportOpen(false);
    alert("????????????????????????????????????");
  }

  // const enterAnimation = (baseEl: HTMLElement) => {
  //   const root = baseEl.shadowRoot;

  //   const backdropAnimation = createAnimation()
  //     .addElement(root?.querySelector("ion-backdrop")!)
  //     .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

  //   const wrapperAnimation = createAnimation()
  //     .addElement(root?.querySelector(".modal-wrapper")!)
  //     .keyframes([
  //       { offset: 0, opacity: "0", transform: "scale(0)" },
  //       { offset: 1, opacity: "0.99", transform: "scale(1)" },
  //     ]);

  //   return createAnimation()
  //     .addElement(baseEl)
  //     .easing("ease-out")
  //     .duration(500)
  //     .addAnimation([backdropAnimation, wrapperAnimation]);
  // };

  // const leaveAnimation = (baseEl: HTMLElement) => {
  //   return enterAnimation(baseEl).direction("reverse");
  // };

  function openPost(e: PostObj) {
    setCurrentPost(e);
    setIsPostOpen(true);
  }
  function openReport() {
    setIsReportOpen(true);
  }
  function openProfile(user_id: number) {
    setCurrentProfile(user_id);
    setIsProfileOpen(true);
  }

  function goChat(id: number) {
    modalDismiss();
    // router.push(routes.chatroom(id), "forward", "replace");
    router.push(routes.chatroom(id));
  }

  function afterDeal() {
    router.push(routes.tab.mainPage(), "forward", "replace");
    modalDismiss();
  }

  async function goNotification() {
    if (jwtState.id) {
      let res = await updateDot(jwtState.id, "notice_dots", false);
      console.log(res);
      if (res) {
        router.push(routes.mainNotice);
        dispatch(
          updateDots({
            chatDot: dotState.chatDot,
            noticeDot: false,
          })
        );
      } else {
        alert("fail to update");
        return;
      }
    } else {
      alert("????????????");
      return;
    }
  }

  function backToMainPage(){
    router.push('/')
    modalDismiss();
  }

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonLabel slot="end">
              {noticeDots ? (
                <IonBadge color="warning" className={styles.badge}>
                  !
                </IonBadge>
              ) : (
                <></>
              )}
              <IonIcon
                style={{ color: "gold" }}
                className="ion-padding"
                // className={styles.icon}
                icon={notificationsOutline}
                size="large"
                onClick={() => goNotification()}
              ></IonIcon>
            </IonLabel>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <div slot="content">
            <IonSearchbar
              debounce={1000}
              onIonChange={(ev: any) => setQuery(ev.target.value)}
            ></IonSearchbar>
            {/* <IonButton
              onClick={() => {
                present({
                  message: "?????????...",
                  duration: 3000,
                  spinner: "lines-small",
                });
              }}
            >
              loading
            </IonButton> */}
            {postsList
              .filter((postsList) => postsList.post_title.includes(query))
              .map((post: any, index) => {
                return (
                  <IonCard className={styles.postContainer} key={index}>
                    <h4 className={styles.nameText}>
                      <div onClick={() => openProfile(post.user_id)}>
                        <IonIcon
                          className={styles.personIcon}
                          icon={personOutline}
                        ></IonIcon>

                        {post.nickname}
                      </div>
                    </h4>
                    <div onClick={() => openPost(post)}>
                      <div className={styles.nameContainer}>
                        <h2 className={styles.title}>
                          {!post.admin_title
                            ? post.post_title
                            : post.admin_title}

                          {post.q_mark ? (
                            <IonIcon
                              size="large"
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
                          <h3>?????????${post.original_price}</h3>
                        ) : (
                          <h3>?????????${post.max}</h3>
                        )}
                      </div>
                    </div>
                  </IonCard>
                );
              })}
          </div>
        </IonList>
      </IonContent>

      <IonModal id="report-Modal" ref={reportModal} isOpen={isReportOpen}>
        <IonContent>
          <IonItem className="ion-padding">
            <IonLabel position="floating">
              <IonIcon style={{ color: "red" }} icon={warningOutline}></IonIcon>{" "}
              ????????????????????????
            </IonLabel>
            <IonTextarea></IonTextarea>
          </IonItem>
          <IonButtons style={{ display: "flex", justifyContent: "center" }}>
            <IonButton
              slot="center"
              onClick={() => cancelReport()}
              expand="block"
            >
              ??????
            </IonButton>
            <IonButton
              slot="center"
              style={{ color: "red" }}
              onClick={() => dismissReport()}
              expand="block"
            >
              ??????
            </IonButton>
          </IonButtons>
        </IonContent>
      </IonModal>

      <IonModal id="post-modal" ref={postModal} isOpen={isPostOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                style={{ color: "gold" }}
                onClick={() => {
                  backToMainPage()
                }}
              >
                <IonIcon size="large" icon={chevronBackOutline}></IonIcon> Back
              </IonButton>
            </IonButtons>

            <IonButtons slot="end">
              <IonButton
                id="reportNow"
                onClick={() => {
                  openReport();
                }}
              >
                <IonIcon
                  size="large"
                  style={{ color: "red" }}
                  icon={warningOutline}
                ></IonIcon>
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

      <IonModal id="profile-modal" ref={profileModal} isOpen={isProfileOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                style={{ color: "gold" }}
                onClick={() => {
                  modalDismiss();
                }}
              >
                <IonIcon size="large" icon={chevronBackOutline}></IonIcon> Back
              </IonButton>
            </IonButtons>

            <IonButtons slot="end">
              <IonButton
                id="reportNow"
                onClick={() => {
                  openReport();
                }}
              >
                <IonIcon
                  size="large"
                  style={{ color: "red" }}
                  icon={warningOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Profile id={currentProfile} />
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default MainPage;

// function dispatch(arg0: {
//   type: "update_Dots";
//   dots: import("../../redux/dots/state").UpdateDotsState;
// }) {
//   throw new Error("Function not implemented.");
// }
