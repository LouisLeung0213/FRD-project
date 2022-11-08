import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
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
        <Route path="/page/Login" exact={true}>
          <Login />
        </Route>
        <Route path="/page/SignUp" exact={true}>
          <SignUp />
        </Route>
        <Route path="/page/MainPage" exact={true}>
          <Profile />
        </Route>
        <Route path="/page/Hot" exact={true}>
          <Profile />
        </Route>
        <Route path="/page/Trade" exact={true}>
          <Trade />
        </Route>
        <Route path="/page/Noti" exact={true}>
          <Profile />
        </Route>
        <Route path="/page/Profile" exact={true}>
          <Profile />
        </Route>
        <MainTabs />
      </IonContent>
    </IonPage>
  );
};

export default Page;
