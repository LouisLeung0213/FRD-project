import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
// import ExploreContainer from "../../components/ExploreContainer";

// import "./MainPage.css";

const Trade: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">MainPage</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonLabel>Default input</IonLabel>
            <IonInput></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Input with placeholder</IonLabel>
            <IonInput placeholder="Enter company name"></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Input with value</IonLabel>
            <IonInput value="121 S Pinckney St #300"></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Readonly input</IonLabel>
            <IonInput value="Madison" readonly={true}></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Disabled input</IonLabel>
            <IonInput value="53703" disabled={true}></IonInput>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Trade;
