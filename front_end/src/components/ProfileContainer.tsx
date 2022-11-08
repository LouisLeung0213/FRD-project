import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import "./ExploreContainer.css";

// interface ContainerProps {
//   name: string;
// }

const ProfileContainer: React.FC<any> = () => {
  return (
    <IonList>
      <IonItem>
        <IonIcon icon={personCircleOutline} />
        <image></image>
        <div>...</div>
      </IonItem>
    </IonList>
  );
};

export default ProfileContainer;
