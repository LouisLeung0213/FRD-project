import {
  IonButtons,
  IonContent,
  IonHeader,
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

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <MainTabs />
      </IonContent>
    </IonPage>
  );
};

export default Page;
