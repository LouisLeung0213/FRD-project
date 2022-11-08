import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
// import ExploreContainer from "../../components/ExploreContainer";
// import ProfileContainer from "../../components/ProfileContainer";
import UpdateInfo from "../../components/UpdateProfileContainer";
// import "./Profile.css";

const updateProfile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>更改個人資料</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Profile</IonTitle>
            </IonToolbar>
          </IonHeader> */}
        <UpdateInfo />
      </IonContent>
    </IonPage>
  );
};

export default updateProfile;
