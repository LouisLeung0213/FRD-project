import React from "react";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonInput,
  IonImg,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";

const TradeContainer: React.FC = () => {
  return (
    <IonList>
      <IonItem>
        {/* <IonLabel>Default input</IonLabel> */}
        <IonInput></IonInput>
      </IonItem>
    </IonList>
  );
};

export default TradeContainer;
