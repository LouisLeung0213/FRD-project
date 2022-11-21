import {
  IonAccordion,
  IonAccordionGroup,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSlide,
  IonSlides,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  checkmarkOutline,
  closeOutline,
  cubeOutline,
  skullOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { resultingClientExists } from "workbox-core/_private";
import { RootState } from "../../store";
import { routes } from "../../routes";
import { API_ORIGIN } from "../../api";

// const slideOpts = {
//   initialSlide: 1,
//   speed: 400,
// };

const AdminPanel: React.FC = () => {
  let [reqPosts, setReqPosts] = useState<[any]>([] as any);
  let [acceptRequest, setAcceptRequest] = useState(false);
  const [query, setQuery] = useState("");

  let date = Date.now();
  const isAdmin = useSelector((state: RootState) => state.isAdmin);
  const router = useIonRouter();
  useEffect(() => {
    const getProductReq = async () => {
      let res = await fetch(`${API_ORIGIN}/posts`);
      let result = await res.json();

      setReqPosts(result);
      console.log("result", result);
    };
    getProductReq();
    setAcceptRequest(false);
  }, [acceptRequest]);
  // console.log("usersInfo:", usersInfo);

  async function acceptReq(e: any) {
    // console.log("e:", e);
    // console.log("HOTB" + date + e.id);
    let res = await fetch(`${API_ORIGIN}/storages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sellerId: +e.user_id,
        productId: +e.id,
        receiptCode: "HOTB" + date + e.id,
      }),
    });
    let result = await res.json();
    console.log("result:", result);
    setAcceptRequest(true);
  }

  function denialReq() {
    return "no";
  }

  return (
    <div>
      {!!isAdmin ? (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              熱拍管理處
              <IonButtons slot="end">
                <IonIcon
                  icon={skullOutline}
                  onClick={() =>
                    router.push(routes.blacklist, "forward", "pop")
                  }
                ></IonIcon>
                <IonIcon
                  icon={cubeOutline}
                  onClick={() => router.push(routes.storages, "forward", "pop")}
                ></IonIcon>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonAccordionGroup>
                <IonAccordion value="first">
                  <IonItem slot="header" color="light">
                    <IonLabel>HOTBID 等待驗證貨品清單</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    <IonSearchbar
                      debounce={1000}
                      onIonChange={(ev: any) => setQuery(ev.target.value)}
                    ></IonSearchbar>
                    {reqPosts
                      .filter((reqPost) => reqPost.username.includes(query))
                      .map((e: any) => {
                        return (
                          <IonItemSliding>
                            <IonItemOptions side="start">
                              <IonItemOption color="danger">
                                <IonIcon
                                  icon={closeOutline}
                                  size="large"
                                  onClick={() => denialReq()}
                                ></IonIcon>
                              </IonItemOption>
                            </IonItemOptions>
                            <IonItem key={e.id}>
                              貨品ID：{e.id}， 帳號名稱：{e.username}，
                              貨品標題：
                              {e.post_title}， 貨品描述：{e.post_description}，
                              價錢：
                              {e.original_price}。
                            </IonItem>
                            <IonItemOptions side="end">
                              <IonItemOption color="success">
                                <IonIcon
                                  icon={checkmarkOutline}
                                  size="large"
                                  onClick={() => acceptReq(e)}
                                ></IonIcon>
                              </IonItemOption>
                            </IonItemOptions>
                          </IonItemSliding>
                        );
                      })}
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </IonList>
          </IonContent>
        </IonPage>
      ) : (
        <IonPage>
          <IonContent>
            <IonItem>
              <h2>！！你沒有權限進入！！</h2>
            </IonItem>
          </IonContent>
        </IonPage>
      )}
    </div>
  );
};

export default AdminPanel;
