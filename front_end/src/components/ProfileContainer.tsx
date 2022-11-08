import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonInput,
  IonImg,
} from "@ionic/react";
import "./ProfileContainer.css";
import icon from "../image/usericon.png";
import {
  chatbubblesOutline,
  searchOutline,
  heartOutline,
  ribbonOutline,
} from "ionicons/icons";

// interface ContainerProps {
//   name: string;
// }

const ProfileContainer: React.FC<any> = () => {
  return (
    <IonList>
      <IonItem>
        <IonList className="wholePersonalContainer">
          <IonList className="personalIconContainer">
            <IonImg src={icon} className="personalIcon" />
            <IonList className="iconContainer">
              <IonIcon icon={heartOutline} className="chat" />
              <IonIcon icon={chatbubblesOutline} className="chat" />
              <IonIcon icon={ribbonOutline} className="chat" />
            </IonList>
          </IonList>
          <IonList className="personalInfo">
            <IonList className="nameContainer">
              <IonLabel>Nickname</IonLabel>
              <IonLabel>@username</IonLabel>
            </IonList>
            <IonLabel>Joined since 2022.02.10</IonLabel>
          </IonList>
          <IonList className="search">
            <IonIcon className="searchIcon" icon={searchOutline} />
            <IonInput placeholder="搜尋此賣家的產品"></IonInput>
          </IonList>
          <IonList className="portfolioContainer">
            <IonLabel>My product</IonLabel>
          </IonList>
        </IonList>
      </IonItem>
    </IonList>
  );
};

export default ProfileContainer;
