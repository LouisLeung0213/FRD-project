import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Route, useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import SignUp from "./SignUp";
import "./Page.css";

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
        <Route path="/page/SignUp" exact={true}>
          <SignUp />
        </Route>
      </IonContent>
    </IonPage>
  );
};

export default Page;
