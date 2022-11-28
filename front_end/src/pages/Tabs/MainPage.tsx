import {
  createAnimation,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
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
import { useEffect, useRef, useState } from "react";
import { API_ORIGIN } from "../../api";
import Post, { PostObj } from "../Post/Post";
import "./MainPage.css";

const MainPage: React.FC = () => {
  let [postsList, setPostsList] = useState<[any]>([] as any);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <div className="ion-padding" slot="content">
            <IonSearchbar
              debounce={1000}
              onIonChange={(ev: any) => setQuery(ev.target.value)}
            ></IonSearchbar>
            {postsList
              .filter((postsList) => postsList.post_title.includes(query))
              .map((e: any) => {
                return (
                  <IonItem key={e.id} onClick={() => openPost(e)}>
                    <img src={e.json_agg[0]}></img>
                    {!e.admin_title ? (
                      <IonLabel>{e.post_title}</IonLabel>
                    ) : (
                      <IonLabel>{e.admin_title}</IonLabel>
                    )}
                    <IonLabel>${e.original_price}</IonLabel>
                    <IonLabel>{e.nickname}</IonLabel>
                  </IonItem>
                );
              })}
          </div>
        </IonList>
        <IonModal
          id="post-modal"
          ref={modal}
          isOpen={isOpen}
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
        >
          <IonContent>
            <IonToolbar>
              <IonTitle>HOTBID</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => dismiss()}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
            <Post post={currentPost as PostObj} />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MainPage;
