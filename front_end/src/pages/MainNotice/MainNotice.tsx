import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { connectStorageEmulator } from "firebase/storage";
import { chevronBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_ORIGIN } from "../../api";
import { routes } from "../../routes";
import { RootState } from "../../store";


type Notice = {
  receiver_id: number;
  content: string;
  post_id: number;
};

const MainNotice: React.FC= () => {
  let jwtState = useSelector((state: RootState) => state.jwt);
  const router = useIonRouter();

  const [noticeList, setNoticeList] = useState([]);

  useEffect(() => {
    const getNotice = async () => {
      let res = await fetch(`${API_ORIGIN}/main-notice/getMine/${jwtState.id}`);
      let result = await res.json();
      console.log("result",result)
      setNoticeList(result);
    };
    getNotice();
  }, []);

  function backToMain() {
    router.push('/', "forward", "replace");
  }

  function openPost(postId: number)
  {
    // router.push(routes.tab.mainPage(postId),"forward","replace")
    router.push(routes.tab.mainPage(postId),"forward","pop")
  }

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                onClick={() => {
                  backToMain();
                }}
              >
                <IonIcon size="large" icon={chevronBackOutline}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>通知</IonTitle>
          </IonToolbar>
        </IonHeader>

        {noticeList.length > 0 ? (
          <>
            {noticeList.map((notice: Notice, index) => {
              return <IonItem key={index} onClick={()=> openPost(notice.post_id)}>{notice.content}</IonItem>;
            })}
          </>
        ) : (
          <IonItem>暫時沒有任何通知喔</IonItem>
        )}
      </IonContent>
      
    </IonPage>
  );
};

export default MainNotice;
