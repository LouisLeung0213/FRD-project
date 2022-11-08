import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  bookmarkOutline,
  lockOpenOutline,
  lockOpenSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  peopleCircleOutline,
  personOutline,
  personSharp,
  receiptOutline,
  receiptSharp,
  trashOutline,
  trashSharp,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "設定個人帳號",
    url: "/page/AccountSetting",
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
  {
    title: "通知設定",
    url: "/page/NotificationSetting",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
  {
    title: "更改密碼",
    url: "/page/PasswordChange",
    iosIcon: lockOpenOutline,
    mdIcon: lockOpenSharp,
  },
  {
    title: "電子收據",
    url: "/page/Receipt",
    iosIcon: receiptOutline,
    mdIcon: receiptSharp,
  },
  {
    title: "登入",
    url: "/page/Login",
    iosIcon: trashOutline,
    mdIcon: trashSharp,
  },
  {
    title: "登記帳號",
    url: "/page/SignUp",
    iosIcon: peopleCircleOutline,
    mdIcon: peopleCircleOutline,
  },
];

const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

const Menu: React.FC = () => {
  const location = useLocation();
  //const [currentPage, setCurrentPage] = useState("");

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>設定</IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
