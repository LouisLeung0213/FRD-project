import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./Invoice.css";
import moment from "moment";

const Invoice: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  let [invoiceList, setInvoiceList] = useState([]);
  useEffect(() => {
    const getInvoice = async () => {
      let res = await fetch(`http://localhost:1688/invoice/${jwtState.id}`);
      let result = await res.json();
      setInvoiceList(result);
      console.log("invoice:", result);
    };

    getInvoice();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>電子收據</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel>存貨電子收據</IonLabel>
            </IonItem>
            <div className="ion-padding invoiceContainer" slot="content">
              {invoiceList.map((e: any) => {
                return (
                  <IonItem key={e.product_id} className="ion-padding">
                    收據號碼：
                    {e.receipt_code}
                    <br />
                    貨品名稱：
                    {e.post_title}
                    <br />
                    存倉時間：
                    {moment(e.in_time).format("MMMM Do YYYY, h:mm:ss a")}
                  </IonItem>
                );
              })}
              {/* <IonLabel className="invoiceNumber"></IonLabel>
              賣家：
              <IonLabel className="sellerName">Louis</IonLabel>
              買家：
              <IonLabel className="buyerName">Scott</IonLabel>
              拍賣物品：
              <IonLabel>[HotToy] IronMan-Mark-42</IonLabel>
              成交金額：
              <IonLabel className="soldPrice">$8964</IonLabel>
              成交日期：
              <IonLabel className="soldTime">2022-03-01 03:33 am</IonLabel> */}
            </div>
          </IonAccordion>
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel>已成交電子收據</IonLabel>
            </IonItem>
            <div className="ion-padding invoiceContainer" slot="content">
              <IonLabel className="invoiceNumber">YOUBUYTHISITEM0201</IonLabel>
              賣家：
              <IonLabel className="sellerName">Louis</IonLabel>
              買家：
              <IonLabel className="buyerName">Scott</IonLabel>
              拍賣物品：
              <IonLabel>[HotToy] IronMan-Mark-41</IonLabel>
              成交金額：
              <IonLabel className="soldPrice">$8963</IonLabel>
              成交日期：
              <IonLabel className="soldTime">2022-02-01 02:22 am</IonLabel>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Invoice;
