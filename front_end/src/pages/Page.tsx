import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Redirect, Route, useParams } from "react-router";
import SignUp from "./signUp/SignUp";
import "./Page.css";
import MainTabs from "./Tabs/MainTabs";
import Login from "./login/Login";
import Profile from "./Tabs/Profile";
import { chatbubbleOutline, heartCircleOutline } from "ionicons/icons";
import Trade from "./Tabs/Trade";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonList className="pageHeader">
            <IonTitle>{name}</IonTitle>
            <IonIcon icon={heartCircleOutline} className="icon" />
            <IonIcon icon={chatbubbleOutline} className="icon" />
          </IonList>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <MainTabs />
      </IonContent>
    </IonPage>
  );
};

export default Page;
