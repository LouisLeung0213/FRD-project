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
import "./Invoice.css";

const Invoice: React.FC = () => {
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
              <IonLabel>電子收據 - 2022-03-01</IonLabel>
            </IonItem>
            <div className="ion-padding invoiceContainer" slot="content">
              <IonLabel className="invoiceNumber">YOUBUYTHISITEM0301</IonLabel>
              賣家：
              <IonLabel className="sellerName">Louis</IonLabel>
              買家：
              <IonLabel className="buyerName">Scott</IonLabel>
              拍賣物品：
              <IonLabel>[HotToy] IronMan-Mark-42</IonLabel>
              成交金額：
              <IonLabel className="soldPrice">$8964</IonLabel>
              成交日期：
              <IonLabel className="soldTime">2022-03-01 03:33 am</IonLabel>
            </div>
          </IonAccordion>
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel>電子收據 - 2022-02-01</IonLabel>
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
          <IonAccordion value="third">
            <IonItem slot="header" color="light">
              <IonLabel>電子收據 - 2022-01-01</IonLabel>
            </IonItem>
            <div className="ion-padding invoiceContainer" slot="content">
              <IonLabel className="invoiceNumber">YOUBUYTHISITEM0101</IonLabel>
              賣家：
              <IonLabel className="sellerName">Louis</IonLabel>
              買家：
              <IonLabel className="buyerName">Scott</IonLabel>
              拍賣物品：
              <IonLabel>[HotToy] IronMan-Mark-41</IonLabel>
              成交金額：
              <IonLabel className="soldPrice">$8961</IonLabel>
              成交日期：
              <IonLabel className="soldTime">2022-01-01 01:11 am</IonLabel>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Invoice;
