import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSearchbar,
  IonSlide,
  IonSlides,
  IonTitle,
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
  const [isOpen, setIsOpen] = useState(false);
  let [sellerNickname, setSellerNickname] = useState("");
  let [productTitle, setProductTitle] = useState("");
  let [productDescription, setProductDescription] = useState("");
  let [remark, setRemark] = useState("");
  let [sellerId, setSellerId] = useState("");
  let [productId, setProductId] = useState("");
  let [imageList, setImageList] = useState([]);

  let date = Date.now();
  const jwtState = useSelector((state: RootState) => state.jwt);
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

  async function acceptReq() {
    // console.log("e:", e);
    // console.log("HOTB" + date + e.id);
    let res = await fetch(`${API_ORIGIN}/storages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sellerId: sellerId,
        productId: +productId,
        receiptCode: "HOTB" + date + sellerId,
      }),
    });
    let result = await res.json();
    console.log("result:", result);
    setAcceptRequest(true);
    setIsOpen(false);
  }

  async function denyReq() {
    let res = await fetch(`${API_ORIGIN}/posts/updateStatus/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "deny",
        adminComment: remark,
      }),
    });

    let result = res.text();
    console.log("denyReuslt:", result);

    if (res.ok) {
      setAcceptRequest(true);
      setIsOpen(false);
    }
  }

  function openReq(e: any) {
    console.log("e:", e);
    setSellerNickname(e.username);
    setProductTitle(e.post_title);
    setProductDescription(e.post_description);
    setSellerId(e.user_id);
    setProductId(e.id);
    setImageList(e.json_agg);
    setIsOpen(true);
  }

  return (
    <div>
      {!!jwtState.isAdmin ? (
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
                      .map((e: any, index) => {
                        return (
                          <IonItem key={index} onClick={() => openReq(e)}>
                            貨品ID：{e.id}， 帳號名稱：{e.username}， 貨品標題：
                            {e.post_title}， 貨品描述：{e.post_description}，
                            價錢：
                            {e.original_price}。
                          </IonItem>
                        );
                      })}
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
              <IonContent className="ion-padding">
                <IonModal isOpen={isOpen}>
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle></IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setIsOpen(false)}>
                          關閉
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonList>
                    <IonItem>賣家稱呼：{sellerNickname}</IonItem>
                    <IonItem>貨品標題：{productTitle}</IonItem>
                    <IonItem>貨品描述：{productDescription}</IonItem>
                    <IonItem>
                      <IonInput
                        onIonChange={(e: any) => setRemark(e.target.value)}
                      >
                        備註：
                      </IonInput>
                    </IonItem>
                    {imageList.map((e: any) => {
                      return <IonImg src={e} alt="user post image"></IonImg>;
                    })}
                    <IonButton color="success" onClick={() => acceptReq()}>
                      確認驗證
                    </IonButton>
                    <IonButton color="danger" onClick={() => denyReq()}>
                      拒絕驗證
                    </IonButton>
                  </IonList>
                </IonModal>
              </IonContent>
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
