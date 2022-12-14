import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
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
  useIonRouter,
} from "@ionic/react";
import {
  caretBackOutline,
  caretForwardOutline,
  chevronBackOutline,
  chevronForwardOutline,
  navigateOutline,
} from "ionicons/icons";
import moment from "moment";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Socket } from "socket.io-client";
import { resultingClientExists } from "workbox-core/_private";
import { API_ORIGIN } from "../../api";
import { useSocket } from "../../hooks/use-socket";
import { updateDots } from "../../redux/dots/actions";
import { routes } from "../../routes";
import { RootState } from "../../store";
import { updateDot } from "../../updateDot";
import chatroomStyles from "./Chatroom.module.css";

type PostDetail = {
  post_id: number;
  post_title: string;
  original_price: string;
  max: number;
  json_agg: string[];
};

type MSG = {
  id: number;
  chatroom_id: number;
  content: string;
  sender_id: number;
  send_time: string;
  icon_src: string;
};

const Chatroom: React.FC = () => {
  const [newWsMessageId, setNewWsMessageId] = useState(null);
  const router = useIonRouter();
  const dispatch = useDispatch();
  let dotState = useSelector((state: RootState) => state.dots);

  let jwtState = useSelector((state: RootState) => state.jwt);
  let chatroomId: any = useParams();

  useSocket(
    useCallback(
      (socket: Socket) => {
        socket.on("new-msg", (data) => {
          console.log("whoAmI", jwtState);
          console.log("received", data);
          setMsgList(data.newMSG);
          setNewWsMessageId(data.newMSG[data.newMSG.length - 1].id);
        });
        socket.on("are-u-here", async (data) => {
          console.log("i am here");
          console.log(jwtState.id);
          if (jwtState.id) {
            await updateDot(jwtState.id, "chat_dots", false);
          }
          // setChatDots(false)
          dispatch(
            updateDots({
              chatDot: false,
              noticeDot: dotState.noticeDot,
            })
          );
        });
        socket.emit("join-chat-room", chatroomId.id);
        return () => {
          socket.emit("leave-chat-room", chatroomId.id);
        };
      },
      [chatroomId.id]
    )
  );

  useLayoutEffect(() => {
    if (!newWsMessageId) return;
    let ionCard = document.querySelector(
      `[dataset-message-id="${newWsMessageId}"]`
    );
    // console.log({ newWsMessageId, ionCard });

    if (ionCard) {
      ionCard.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [newWsMessageId]);

  // const [chatList, setChatList] = useState<
  //   { id: number; image: string; name: string; message: string }[]
  // >([]);
  const [postDetail, setPostDetail] = useState({
    post_id: 0,
    post_title: "",
    original_price: "",
    max: 0,
    json_agg: [""],
  } as PostDetail);
  const [currentMsg, setCurrentMsg] = useState("");
  const [msgList, setMsgList] = useState([]) as any;

  useEffect(() => {
    console.log("chat", chatroomId.id);
    const getChatroomMsg = async () => {
      let res = await fetch(`${API_ORIGIN}/chatroom/msg/${chatroomId.id}`);
      let result = await res.json();
      console.log("msg:", result);
      setMsgList(result);
      if (result.length > 0) {
        let latestMSG = document.querySelector(
          `[dataset-message-id="${result[result.length - 1].id}"]`
        );

        if (latestMSG) {
          latestMSG.scrollIntoView({
            block: "end",
          });
        }
      }
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

  function backToMain() {
    router.push("/", "forward", "replace");
  }

  function backToChat() {
    router.push(routes.tab.notices, "forward", "replace");
  }

  async function sendMsg(msg: string) {
    console.log("chatroomId", chatroomId.id);
    let send = await fetch(`${API_ORIGIN}/chatroom/send/${chatroomId.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg, senderId: jwtState.id }),
    });
    let result = await send.json();
    if (!("receiver_id" in result)) {
      console.log(result);
      alert("something wrong");
      return;
    }
    console.log("msg", result);
    setCurrentMsg("");
    console.log("jwtState", jwtState);
  }

  function realIcon(photoUrl: string) {
    if (photoUrl.includes("$1")) {
      return photoUrl.split("$1").join("?");
    } else {
      return photoUrl;
    }
  }

  function goToPost(postId: number){
    router.push(routes.tab.mainPage(postId),'forward','pop')
  }

  return (
    <IonPage className="ChatListTab">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                backToMain();
              }}
            >
              <IonIcon size="large" icon={chevronBackOutline}></IonIcon> ??????
            </IonButton>
          </IonButtons>
          <IonTitle>Chatroom</IonTitle>

          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                backToChat();
              }}
            >
              ?????????
              <IonIcon size="large" icon={chevronForwardOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <div className={chatroomStyles.productTitle}>
            <IonAvatar style={{ width: "3rem", height: "3rem" }} onClick={()=> {
              goToPost(postDetail.post_id)
            }}>
              <img src={postDetail.json_agg[0]} />
            </IonAvatar>
            <div
              style={{
                color: "gold",
                fontSize: "15px",
                margin: "8px",
                display: "flex",
                textAlign: "center",
              }}
            >
              {postDetail.post_title}
            </div>
            <IonLabel>HK${postDetail.original_price}</IonLabel>
          </div>
          {msgList.length > 0 ? (
            <>
              {msgList.map((msg: MSG) => {
                return (
                  <div
                    key={msg.id}
                    dataset-message-id={msg.id}
                    className={chatroomStyles.talkDiv}
                  >
                    {msg.sender_id == jwtState.id ? (
                      <>
                        <div>
                          <div className={chatroomStyles.timeDiv}>
                            {moment(msg.send_time).format("DD/MM")}
                            <span style={{ width: "0.5rem" }}></span>
                            {moment(msg.send_time).format("LT")}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            alignItems: "center",
                          }}
                        >
                          <IonAvatar>
                            <img src={realIcon(msg.icon_src)}></img>

                          </IonAvatar>
                          <IonIcon
                            icon={caretForwardOutline}
                            className={chatroomStyles.ownTick}
                          ></IonIcon>
                          <div className={chatroomStyles.ownChatContentDiv}>
                            <p className={chatroomStyles.chatContent}>
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className={chatroomStyles.timeDiv}>
                            {moment(msg.send_time).format("DD/MM")}
                            <span style={{ width: "0.5rem" }}></span>
                            {moment(msg.send_time).format("LT")}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <IonAvatar>
                              <img src={realIcon(msg.icon_src)}></img>
                            </IonAvatar>
                            <IonIcon
                              icon={caretBackOutline}
                              className={chatroomStyles.otherTick}
                            ></IonIcon>
                            <div className={chatroomStyles.otherChatContentDiv}>
                              <p className={chatroomStyles.chatContent}>
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <IonItem>??????????????????</IonItem>
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
