import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
// import { checkmarkOutline, closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { routes } from "../../routes";
import { RootState } from "../../store";
import moment from "moment";
import { API_ORIGIN } from "../../api";

const Storages: React.FC = () => {
  let [productList, setProductList] = useState([]);
  const isAdmin = useSelector((state: RootState) => state.isAdmin);

  useEffect(() => {
    const getStorages = async () => {
      let res = await fetch(`${API_ORIGIN}/storages`);
      let result = await res.json();

      setProductList(result);
      console.log(result);
    };
    getStorages();
  }, []);

  async function acceptReq(e: any) {
    // console.log("e:", e);
    // console.log("HOTB" + date + e.id);
    let res = await fetch(`${API_ORIGIN}/posts/${isAdmin}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: e.product.id,
        postTitle: e.post_title,
        postDescription: e.post_description,
      }),
    });
    let result = await res.json();
    console.log("result:", result);
  }

  function denialReq() {
    return "no";
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          熱拍儲物室
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.tab.adminPanel}></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonAccordionGroup>
            <IonAccordion value="first">
              <IonItem slot="header" color="light">
                <IonLabel>HOTBID 等待上架貨品清單</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                {productList.map((e: any) => {
                  return (
                    <IonItem key={e.product_id}>
                      賣家名稱：{e.nickname}，用戶ID：{e.seller_id}，貨品標題：
                      <IonInput>{e.post_title}</IonInput>
                      貨品描述：<IonInput>{e.post_description}</IonInput>
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
            <IonAccordion value="second">
              <IonItem slot="header" color="light">
                <IonLabel>HOTBID 已收到貨品清單</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                {productList.map((e: any) => {
                  return (
                    <IonItem key={e.product_id}>
                      賣家名稱：{e.nickname}，EMAIl：
                      {e.email}，電話號碼：{e.phone}，電子收據號碼：
                      {e.receipt_code}，入倉時間：
                      {moment(e.in_time).format("MMMM Do YYYY, h:mm:ss a")}
                    </IonItem>
                  );
                })}
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Storages;
