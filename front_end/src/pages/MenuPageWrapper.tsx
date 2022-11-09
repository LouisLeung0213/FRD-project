import {
  IonPage,
  IonContent,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonInput,
  IonButton,
} from "@ionic/react";
import {
  personOutline,
  paperPlaneOutline,
  lockOpenOutline,
  receiptOutline,
  heartOutline,
  chatbubblesOutline,
  ribbonOutline,
  searchOutline,
  menu,
} from "ionicons/icons";

let win = window as any;

export function MenuPageWrapper(props: {
  id: string;
  title: string;
  content: any;
}) {
  function toggleMenu() {
    win[props.id + "Menu"].toggle();
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSplitPane contentId={props.id + "Page"}>
          <IonMenu contentId={props.id + "Page"} id={props.id + "Menu"}>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={toggleMenu}>Close</IonButton>
                </IonButtons>
                <IonTitle>Menu</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem routerLink="/AccountSetting" onClick={toggleMenu}>
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel>設定個人帳號</IonLabel>
                </IonItem>

                <IonItem routerLink="/NotiSetUp" onClick={toggleMenu}>
                  <IonIcon icon={paperPlaneOutline} slot="start" />
                  <IonLabel>通知設定</IonLabel>
                </IonItem>

                <IonItem routerLink="/PasswordChange">
                  <IonIcon icon={lockOpenOutline} slot="start" />
                  <IonLabel>更改密碼</IonLabel>
                </IonItem>

                <IonItem routerLink="/Invoice">
                  <IonIcon icon={receiptOutline} slot="start" />
                  <IonLabel>電子收據</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonMenu>
          <IonPage id={props.id + "Page"}>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={toggleMenu}>
                    <IonIcon slot="icon-only" icon={menu}></IonIcon>
                  </IonButton>
                </IonButtons>
                <IonTitle>{props.title}</IonTitle>
              </IonToolbar>
            </IonHeader>
            {props.content}
          </IonPage>
        </IonSplitPane>
      </IonContent>
    </IonPage>
  );
}
