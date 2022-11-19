import {
  IonAccordion,
  IonAccordionGroup,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
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

const AdminPanel: React.FC = () => {
  let [reqPosts, setReqPosts] = useState([]);
  let [acceptRequest, setAcceptRequest] = useState(false);

  let date = Date.now();
  const isAdmin = useSelector((state: RootState) => state.isAdmin);
  const router = useIonRouter();
  useEffect(() => {
    const getProductReq = async () => {
      let res = await fetch(`http://localhost:1688/posts`);
      let result = await res.json();

      setReqPosts(result);
    };
    getProductReq();
    setAcceptRequest(false);
  }, [acceptRequest]);
  // console.log("usersInfo:", usersInfo);

  async function acceptReq(e: any) {
    // console.log("e:", e);
    // console.log("HOTB" + date + e.id);
    let res = await fetch(`http://localhost:1688/storages`, {
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
                    {reqPosts.map((e: any) => {
                      return (
                        <IonItem key={e.id}>
                          貨品ID：{e.id}， 用戶ID：{e.user_id}， 貨品標題：
                          {e.post_title}， 貨品描述：{e.post_description}，
                          價錢：
                          {e.original_price}， 最低價：{e.min_price}。
                          <IonIcon
                            icon={checkmarkOutline}
                            size="large"
                            onClick={() => acceptReq(e)}
                          ></IonIcon>
                          <IonIcon
                            icon={closeOutline}
                            size="large"
                            onClick={() => denialReq()}
                          ></IonIcon>
                        </IonItem>
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
