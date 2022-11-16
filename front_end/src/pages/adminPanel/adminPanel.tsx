import { IonHeader, IonItem, IonList, IonPage, IonToolbar } from "@ionic/react";
import React from "react";

const AdminPanel: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>熱拍管理處</IonToolbar>
      </IonHeader>
      <IonList>
        被檢舉的用戶
        <IonItem>Scott</IonItem>
        被檢舉的貨品
        <IonItem>IronMan Mark 42</IonItem>
      </IonList>
    </IonPage>
  );
};

export default AdminPanel;
