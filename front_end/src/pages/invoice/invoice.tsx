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
import { API_ORIGIN } from "../../api";

const Invoice: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  let [invoiceList, setInvoiceList] = useState([]);
  let [pickUpInvoiceList, setPickUpInvoiceList] = useState([]);

  useEffect(() => {
    const getInvoice = async () => {
      let res = await fetch(`${API_ORIGIN}/invoice/${jwtState.id}`);
      let result = await res.json();
      setInvoiceList(result);
      console.log("storage invoice:", result);

      let res2 = await fetch(
        `${API_ORIGIN}/invoice/dealInvoice/${jwtState.id}`
      );
      let pickUpInvoice = await res2.json();
      console.log(pickUpInvoice);
      setPickUpInvoiceList(pickUpInvoice);
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
            </div>
          </IonAccordion>
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel>提貨電子收據</IonLabel>
            </IonItem>
            <div className="ion-padding invoiceContainer" slot="content">
              {pickUpInvoiceList.map((item: any) => {
                return (
                  <IonItem key={item.product_id} className="ion-padding">
                    收據號碼：
                    {item.receipt_code}
                    <br />
                    貨品名稱：
                    {item.post_title}
                    <br />
                    存倉時間：
                    {moment(item.in_time).format("MMMM Do YYYY, h:mm:ss a")}
                  </IonItem>
                );
              })}
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Invoice;
