import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  heartOutline,
  chatbubblesOutline,
  ribbonOutline,
  searchOutline,
} from "ionicons/icons";
// import ExploreContainer from "../../components/ExploreContainer";

import "./Profile.css";
import icon from "../../image/usericon.png";

const Profile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>個人資料</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonImg src={icon} className="personalIcon" />
            <IonIcon icon={heartOutline} className="chat" />
            <IonIcon icon={chatbubblesOutline} className="chat" />
            <IonIcon icon={ribbonOutline} className="chat" />
          </IonItem>
          <IonItem className="personalInfo">
            <IonLabel>Nickname</IonLabel>
            <IonLabel>@username</IonLabel>
            <IonLabel>Joined since 2022.02.10</IonLabel>
          </IonItem>
          <IonItem className="search">
            <IonIcon className="searchIcon" icon={searchOutline} />
            <IonInput placeholder="搜尋此賣家的產品"></IonInput>
          </IonItem>
          <IonItem className="portfolioContainer">
            <IonLabel>My product</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
