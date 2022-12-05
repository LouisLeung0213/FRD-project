import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_ORIGIN } from "../../api";
import { routes } from "../../routes";
import { RootState } from "../../store";

import noticesStyles from "./Notices.module.css";

const Notices: React.FC = () => {
  let jwtState = useSelector((state: RootState) => state.jwt) as any;
  const [chatList, setChatList] = useState([]) as any;
  const router = useIonRouter();

  useEffect(() => {
    const getChatList = async () => {
      let res = await fetch(`${API_ORIGIN}/chatroom/allRoom/${jwtState.id}`);
      let result = await res.json();
      console.log("result", result);
      setChatList(result);
    };
    getChatList();
  }, []);

  function realIcon(photoUrl: string) {
    if (photoUrl.includes("$1")) {
      return photoUrl.split("$1").join("?");
    } else {
      return photoUrl;
    }
  }

  function goChatroom(chatroomId: number) {
    router.push(routes.chatroom(chatroomId), "forward", "replace");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>聊天室</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen={true}>
        {chatList.length > 0 ? (
          <>
            {chatList.map((chat: any) => {
              return (
                <div key={chat.id} className={noticesStyles.chatDiv}>
                  {jwtState.id == chat.seller_id ? (
                    <div onClick={() => goChatroom(chat.id)}>
                      <IonAvatar>
                        <img src={realIcon(chat.buyer_icon)}></img>
                      </IonAvatar>
                      <div>{chat.buyer_nickname}</div>
                      <div>{chat.post_title}</div>
                      <div>{chat.latest_content}</div>
                      <div slot="end">
                        <div>{chat.latest_send_times}</div>
                        <IonAvatar>
                          <img src={chat.image}></img>
                        </IonAvatar>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => goChatroom(chat.id)}>
                      <IonAvatar>
                        <img src={realIcon(chat.seller_icon)}></img>
                      </IonAvatar>
                      <div>{chat.seller_nickname}</div>
                      <div>{chat.post_title}</div>
                      <div>{chat.latest_content}</div>
                      <div slot="end">
                        <div>{chat.latest_send_times}</div>
                        <IonAvatar>
                          <img src={chat.image}></img>
                        </IonAvatar>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            <IonItem>暫時沒有人找你喔</IonItem>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Notices;
