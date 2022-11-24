import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { API_ORIGIN } from "../../api";
import { routes } from "../../routes";

const ChatListTab: React.FC = () => {
  const [chatList, setChatList] = useState<
    { id: number; image: string; name: string; message: string }[]
  >([]);

  useEffect(() => {
    const getChatroomList = async () => {
      let res = await fetch(`${API_ORIGIN}/chatrooms`);
      let result = await res.json();

      setChatList(result);
    };

    getChatroomList();
  }, []);

  return (
    <IonPage className="ChatListTab">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chatrooms</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {chatList.map((chat) => (
            <IonItem key={chat.id} routerLink={routes.chatroom(chat.id)}>
              <IonAvatar slot="start">
                <img src={chat.image}></img>
              </IonAvatar>
              <div>
                <h1>{chat.name}</h1>
                <p>{chat.message}</p>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ChatListTab;
