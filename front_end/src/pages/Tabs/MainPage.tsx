import {
  createAnimation,
  IonAvatar,
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
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { API_ORIGIN } from "../../api";
import { useSocket } from "../../hooks/use-socket";
import Post, { PostObj } from "../Posts/Posts";
import {
  checkmarkDoneCircleOutline,
  chevronBackOutline,
  personOutline,
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

const MainPage: React.FC = () => {
  let [postsList, setPostsList] = useState<[any]>([] as any);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const socket = useSocket(
    useCallback((socket: Socket) => {
      socket.on("priceUpdated", (msg) => {
        console.log("msg", msg.newPrice);
        setPostsList(msg.newPrice);
        return;
      });
      return () => {};
    }, [])
  );

  useEffect(() => {
    const postsList = async () => {
      let res = await fetch(`${API_ORIGIN}/posts/showAll`);
      let result = await res.json();

      setPostsList(result);
      console.log("result", result);
    };

    postsList();
  }, []);

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
    setIsOpen(false);
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
    setIsOpen(true);
  }

  return (
    <IonPage>
      <IonContent fullscreen={true}>
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
          <Post post={currentPost as PostObj} />
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default MainPage;
