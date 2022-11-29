import {
  IonAvatar,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { navigateOutline } from "ionicons/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { resultingClientExists } from "workbox-core/_private";
import { API_ORIGIN } from "../../api";
import { routes } from "../../routes";
import { RootState } from "../../store";

type PostDetail = {
  post_title: string;
  original_price: string;
  max: number;
  json_agg: string[];
};

type MSG = {
  chatroom_id: number;
  content: string;
  sender_id: number;
  send_time: string;
  // icon_src: string;
};

const Chatroom: React.FC = () => {
  let jwtState = useSelector((state: RootState) => state.jwt);

  const [chatList, setChatList] = useState<
    { id: number; image: string; name: string; message: string }[]
  >([]);
  const [postDetail, setPostDetail] = useState({
    post_title: "",
    original_price: "",
    max: 0,
    json_agg: [""],
  } as PostDetail);
  const [currentMsg, setCurrentMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  let chatroomId: any = useParams();

  useEffect(() => {
    console.log("chat", chatroomId.id);
    const getChatroomMsg = async () => {
      let res = await fetch(`${API_ORIGIN}/chatroom/msg/${chatroomId.id}`);
      let result = await res.json();
      setMsgList(result);
    };

    const getChatroomDetail = async () => {
      let res = await fetch(
        `${API_ORIGIN}/chatroom/roomDetail/${chatroomId.id}`
      );
      let result = await res.json();
      console.log("result", result);
      setPostDetail(result);
    };
    getChatroomMsg();
    getChatroomDetail();
  }, []);

  async function sendMsg(msg: string) {
    let send = await fetch(`${API_ORIGIN}/chatroom/send/${chatroomId.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg, senderId: jwtState.id }),
    });
    let result = await send.json();
    if (!("id" in result)) {
      alert("something wrong");
      return;
    }
    console.log("msg", result);
  }

  return (
    <IonPage className="ChatListTab">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chatroom</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonAvatar>
              <img src={postDetail.json_agg[0]} />
            </IonAvatar>
            <IonLabel>{postDetail.post_title}</IonLabel>
            <IonLabel>HK${postDetail.original_price}</IonLabel>
          </IonItem>
          {msgList.length > 0 ? (
            <>
              {msgList.map((msg: MSG) => {
                return (
                  <>
                    {msg.sender_id == jwtState.id ? (
                      <>
                        <IonLabel>{moment(msg.send_time).format("L")}</IonLabel>
                        ：
                        <IonLabel>
                          {moment(msg.send_time).format("LT")}
                        </IonLabel>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <IonAvatar>
                            <img src=""></img>
                          </IonAvatar>
                          <IonLabel>{msg.content}</IonLabel>
                        </div>
                      </>
                    ) : (
                      <>
                        <IonLabel>{moment(msg.send_time).format("L")}</IonLabel>
                        ：
                        <IonLabel>
                          {moment(msg.send_time).format("LT")}
                        </IonLabel>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <IonAvatar>
                            <img src=""></img>
                          </IonAvatar>
                          <IonLabel>{msg.content}</IonLabel>
                        </div>
                      </>
                    )}
                  </>
                );
              })}
            </>
          ) : (
            <>
              <IonItem>沒有對話紀錄</IonItem>
            </>
          )}
          <IonLabel></IonLabel>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonItem>
            <IonInput
              value={currentMsg}
              onIonChange={(e: any) => setCurrentMsg(e.target.value)}
            ></IonInput>
            <IonIcon
              icon={navigateOutline}
              onClick={() => sendMsg(currentMsg)}
            ></IonIcon>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Chatroom;
