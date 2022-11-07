import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Redirect, Route, useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
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
        <Route path="/page/Login" exact={true}>
          <Login />
        </Route>
        <Route path="/page/SignUp" exact={true}>
          <SignUp />
        </Route>
        <MainTabs />
      </IonContent>
    </IonPage>
  );
};

export default Page;
