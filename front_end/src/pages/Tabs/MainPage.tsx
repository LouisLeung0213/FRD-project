import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import "./MainPage.css";

const MainPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">MainPage</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Main page" />
      </IonContent>
    </IonPage>
  );
};

export default MainPage;
