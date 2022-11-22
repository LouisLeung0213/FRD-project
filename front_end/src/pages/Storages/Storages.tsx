import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline, expandOutline } from "ionicons/icons";
// import { checkmarkOutline, closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { routes } from "../../routes";
import { RootState } from "../../store";
import moment from "moment";
// import { useIonFormState } from "react-use-ionic-form";
// import SignUp from "../SignUp/SignUp";
import { API_ORIGIN } from "../../api";

const Storages: React.FC = () => {
  const userId = useSelector((state: RootState) => state.id);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");
  let [productList, setProductList] = useState<[any]>([] as any);
  let [verifyList, setVerifyList] = useState<[any]>([] as any);
  let [productDescription, setProductDescription] = useState("");
  let [sellerId, setSellerId] = useState("");
  let [sellerNickname, setSellerNickname] = useState("");
  let [productTitle, setProductTitle] = useState("");
  let [receiptCode, setReceiptCode] = useState("");
  let [productId, setProductId] = useState("");
  let [refresh, setFresh] = useState(false);

  useEffect(() => {
    const getStorages = async () => {
      let res = await fetch(`${API_ORIGIN}/storages`);
      let result = await res.json();

      setProductList(result);
      console.log("setProductList:", result);
    };

    const getVerifyList = async () => {
      let res = await fetch(`${API_ORIGIN}/posts/showVerify`);
      let result = await res.json();

      setVerifyList(result);
      console.log("getVerifyList:", result);
    };
    getVerifyList();
    getStorages();
    setFresh(false);
  }, [refresh]);

  async function readyToPost(productId: number) {
    // console.log("e:", e);
    // console.log("HOTB" + date + e.id);
    let res = await fetch(`${API_ORIGIN}/posts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: productId,
        postTitle: productTitle,
        postDescription: productDescription,
      }),
    });

    if (res.ok) {
      setIsOpen(false);
      setFresh(true);
    }
  }
  async function openDetail(e: any) {
    let res = await fetch(`${API_ORIGIN}/storages/${e.id}`);
    let result = await res.json();

    console.log("opene:", e);
    setSellerId(result.seller_id);
    setSellerNickname(result.nickname);
    setProductTitle(result.post_title);
    setProductDescription(result.post_description);
    setReceiptCode(result.receipt_code);
    setProductId(e.id);
    setIsOpen(true);
    console.log("productId", productId);
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
                <IonSearchbar
                  debounce={1000}
                  onIonChange={(ev: any) => setQuery(ev.target.value)}
                ></IonSearchbar>
                {verifyList
                  .filter((verifyList) =>
                    verifyList.receipt_code.includes(query)
                  )
                  .map((e: any) => {
                    return (
                      <IonItem key={e.id} onClick={() => openDetail(e)}>
                        <IonLabel>貨品標題：{e.post_title}</IonLabel>
                        <></>
                        <IonLabel>收據號碼：{e.receipt_code}</IonLabel>
                        {/* <IonIcon
                          slot="end"
                          icon={expandOutline}
                          size="large"
                          onClick={() => openDetail(e)}
                        ></IonIcon> */}
                      </IonItem>
                    );
                  })}
              </div>
            </IonAccordion>
            <IonContent className="ion-padding">
              <IonModal isOpen={isOpen}>
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>{receiptCode}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => setIsOpen(false)}>
                        關閉
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonList>
                  <IonItem>賣家ID：{sellerId}</IonItem>
                  <IonItem>賣家稱呼：{sellerNickname}</IonItem>
                  <IonItem>
                    貨品標題：
                    <IonInput
                      value={productTitle}
                      onIonChange={(e: any) => setProductTitle(e.target.value)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    貨品描述：
                    <IonInput
                      value={productDescription}
                      onIonChange={(e: any) =>
                        setProductDescription(e.target.value)
                      }
                    ></IonInput>
                  </IonItem>
                  <IonButton onClick={() => readyToPost(+productId)}>
                    完成驗證
                  </IonButton>
                </IonList>
              </IonModal>
            </IonContent>
            <IonAccordion value="second">
              <IonItem slot="header" color="light">
                <IonLabel>HOTBID 貨倉清單</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                <IonSearchbar
                  debounce={1000}
                  onIonChange={(ev: any) => setQuery2(ev.target.value)}
                ></IonSearchbar>
                {productList
                  .filter((productList) =>
                    productList.receipt_code.includes(query2)
                  )
                  .map((e: any) => {
                    return (
                      <IonItemSliding>
                        <IonItem key={e.product_id}>
                          賣家名稱：{e.nickname}，EMAIL：
                          {e.email}，電話號碼：{e.phone}，電子收據號碼：
                          {e.receipt_code}，入倉時間：
                          {moment(e.in_time).format("MMMM Do YYYY, h:mm:ss a")}
                        </IonItem>
                        <IonItemOptions>
                          <IonItemOption color="danger">
                            <IonIcon icon={closeOutline} size="large"></IonIcon>
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
  );
};

export default Storages;
