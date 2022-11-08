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
        <IonItem className="wholePersonalContainer">
          <IonItem className="personalIconContainer">
            <IonImg src={icon} className="personalIcon" />
            <IonItem className="iconContainer">
              <IonIcon icon={heartOutline} className="chat" />
              <IonIcon icon={chatbubblesOutline} className="chat" />
              <IonIcon icon={ribbonOutline} className="chat" />
            </IonItem>
          </IonItem>
          <IonItem className="personalInfo">
            <IonItem className="nameContainer">
              <IonLabel>Nickname</IonLabel>
              <IonLabel>@username</IonLabel>
            </IonItem>
            <IonLabel>Joined since 2022.02.10</IonLabel>
          </IonItem>
          <IonItem className="search">
            <IonIcon className="searchIcon" icon={searchOutline} />
            <IonInput placeholder="搜尋此賣家的產品"></IonInput>
          </IonItem>
          <IonItem className="portfolioContainer">
            <IonLabel>My product</IonLabel>
          </IonItem>
        </IonItem>
      </IonItem>
    </IonList>
  );
};

export default ProfileContainer;
