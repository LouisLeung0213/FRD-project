import {
  createAnimation,
  IonAvatar,
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
import { checkmarkDoneCircleOutline } from "ionicons/icons";
import "./MainPage.css";

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

  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector("ion-backdrop")!)
      .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector(".modal-wrapper")!)
      .keyframes([
        { offset: 0, opacity: "0", transform: "scale(0)" },
        { offset: 1, opacity: "0.99", transform: "scale(1)" },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing("ease-out")
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction("reverse");
  };

  function openPost(e: PostObj) {
    setCurrentPost(e);
    setIsOpen(true);
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonList>
          <div className="ion-padding" slot="content">
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
                    className="postContainer"
                    key={post.id}
                    onClick={() => openPost(post)}
                  >
                    <h4 className="nameText">{post.nickname}</h4>
                    <h3
                      className="ion-padding title"
                      style={{
                        color: "#fcd92b",
                        margin: "0px",
                        padding: "0px",
                      }}
                    >
                      {!post.admin_title ? post.post_title : post.admin_title}

                      {post.q_mark ? (
                        <IonIcon
                          className="q_mark_icon"
                          style={{ color: "#3880ff" }}
                          icon={checkmarkDoneCircleOutline}
                        ></IonIcon>
                      ) : null}
                    </h3>
                    <img src={post.json_agg[0]}></img>

                    {!post.max ? (
                      <IonLabel>現價：${post.original_price}</IonLabel>
                    ) : (
                      <IonLabel>現價：${post.max}</IonLabel>
                    )}
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
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>HOT BID</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => dismiss()}>Close</IonButton>
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
