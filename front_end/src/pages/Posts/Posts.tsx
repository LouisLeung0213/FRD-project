import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonButton,
  IonText,
  IonCard,
  IonContent,
  useIonRouter,
  IonModal,
} from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { API_ORIGIN } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useSocket } from "../../hooks/use-socket";
import { Socket } from "socket.io-client";
import {
  calendar,
  chatbubble,
  chatbubbleOutline,
  chatbubbles,
  checkmarkDoneCircleOutline,
  flame,
} from "ionicons/icons";
import "./Posts.css";
import { routes } from "../../routes";

export type PostObj = {
  admin_comment: "";
  admin_title: "";
  auto_adjust_plan: false;
  id: 0;
  json_agg: [];
  nickname: "";
  original_price: 0;
  post_description: "";
  post_time: "";
  post_title: "";
  q_mark: false;
  status: "";
  user_id: 0;
  username: "";
};

const Post: React.FC<{ post: PostObj; goChat: any }> = (props: {
  post: PostObj;
  goChat: any;
}) => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  const pointsState = useSelector((state: RootState) => state.points);

  const [bidPrice, setBidPrice] = useState("");
  const [bidIsSubmitted, setBidIsSubmitted] = useState(false);
  const [bidList, setBidList] = useState([]);
  const [highestBidder, setHighestBidder] = useState("");
  const [nowPrice, setNowPrice] = useState(0);
  let numReg = /^\d+$/;
  const router = useIonRouter();

  const confirmModal = useRef<HTMLIonModalElement>(null);

  const socket = useSocket(
    useCallback(
      (socket: Socket) => {
        console.log("join room", props.post.id);
        socket.emit("join-room", props.post.id);
        socket.on("newBidReceived", (msg) => {
          console.log("received", msg.newBidContent);
          if (msg.newBidContent[0].post_id != +props.post.id) {
            console.log("wrong, bye bye");
            return;
          }
          console.log("newBidList", msg);
          setBidList(msg.newBidContent);
          setHighestBidder(msg.newBidContent[0].nickname);
          setNowPrice(msg.newBidContent[0].bid_price);
          return;
        });
        return () => {
          console.log("leave room", props.post.id);
          socket.emit("leave-room", props.post.id);
        };
      },
      [props.post.id]
    )
  );
  console.log("props.post.q_mark:", props.post.q_mark);
  console.log("rendering, socket:", socket);
  const bidRecord = async () => {
    let res = await fetch(`${API_ORIGIN}/bid/bidList/${props.post.id}`);
    let result = await res.json();

    setBidList(result);
    if (!result[0].nickname) {
      setHighestBidder("");
    } else {
      setHighestBidder(result[0].nickname);
    }
  };

  useEffect(() => {
    console.log("props.post.json_agg", props.post.json_agg);

    console.log(jwtState.id);
    const bidRecord = async () => {
      let res = await fetch(`${API_ORIGIN}/bid/bidList/${props.post.id}`);
      let result = await res.json();
      console.log(props);
      console.log(result);
      setBidList(result);
      if (!result[0]) {
        setHighestBidder("");
      } else {
        setHighestBidder(result[0].nickname);
      }
      if (!result[0]) {
        setNowPrice(props.post.original_price);
      } else {
        setNowPrice(result[0].bid_price);
      }
    };
    bidRecord();

    setBidIsSubmitted(false);
  }, []);

  async function getChatDetail() {
    let res = await fetch(
      `${API_ORIGIN}/chatroom/createRoom/${props.post.id}/${jwtState.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: props.post.user_id,
        }),
      }
    );
    let result = await res.json();
    console.log(result);
    if ("id" in result[0]) {
      props.goChat(result[0].id);
    } else {
      alert("cannot open chatroom");
    }
  }

  async function makeDeal() {
    console.log(nowPrice);

    let dealRes = await fetch(`${API_ORIGIN}/payment/capturePaymentIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bidPrice: nowPrice,
        postId: props.post.id,
      }),
    });
  }

  async function submitBid() {
    if (!bidPrice.match(numReg)) {
      alert("請輸入有效金額");
      return;
    }
    if (pointsState.points < bidPrice) {
      alert("點數不足，請充值預授權!");
      return;
    }

    let res = await fetch(`${API_ORIGIN}/bid/biding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: props.post.id,
        buyerId: jwtState.id,
        bidPrice: bidPrice,
        sellerId: props.post.user_id,
        buyerNickname: jwtState.nickname,
        postTitle: props.post.admin_title,
      }),
    });
    let result = await res.json();
    console.log(result);
    if (result.status == "19") {
      alert("出價不可低過最高價");
      return;
    } else if (result.status == "09") {
      alert("出價不可比原價更低");
      return;
    } else {
      alert("出價成功");
      setBidIsSubmitted(true);
      setBidPrice("");
      return;
    }
  }

  function adjustPrice() {
    confirmModal.current?.dismiss();
    console.log("adjustPrice TODO");
  }

  function dismissConfirm() {
    confirmModal.current?.dismiss();
  }

  return (
    <IonList className="post-modal">
      {!props.post.admin_title ? (
        <>
          <h2 className="ion-padding">{props.post.post_title}</h2>
          <h2 className="ion-padding">{props.post.post_description}</h2>
        </>
      ) : (
        <>
          <h2 className="ion-padding title" style={{ color: "#fcd92b" }}>
            {props.post.admin_title}
            {props.post.q_mark ? (
              <IonIcon
                size="large"
                className="q_mark_icon"
                style={{ color: "#3880ff" }}
                icon={checkmarkDoneCircleOutline}
              ></IonIcon>
            ) : null}
          </h2>
        </>
      )}

      {props.post.json_agg.map((e: any, index) => {
        return (
          <div className="imageDiv" key={index}>
            <img className="image" src={e}></img>
          </div>
        );
      })}
      <IonItem onClick={() => getChatDetail()}>
        <IonLabel>聯絡賣家 : {props.post.nickname}</IonLabel>

        <IonIcon
          style={{ color: "skyBlue" }}
          icon={chatbubbles}
          size="large"
          slot="start"
        ></IonIcon>
      </IonItem>
      <h3 className="ion-padding">產品描述: {props.post.admin_comment}</h3>
      <IonItem>
        <IonIcon style={{ color: "red" }} icon={flame}></IonIcon> 現價: $
        {nowPrice}
      </IonItem>
      <IonItem>{props.post.q_mark}</IonItem>
      <IonItem>
        <IonIcon style={{ color: "#fcd92b" }} icon={calendar}></IonIcon>
        <h5>上架時間：{moment(props.post.post_time).format("MMMM Do YYYY")}</h5>
      </IonItem>
      {!props.post.q_mark ? null : (
        <>
          <IonItem>
            <h3>現時最高出價者：{highestBidder}</h3>
          </IonItem>
          {bidList.map((e: any, index) => {
            return (
              <div className="ionCardContainer" key={index}>
                <IonCard>
                  {e.nickname}: $ {e.bid_price}
                </IonCard>
              </div>
            );
          })}
          <IonItem className="inputBox">
            {!jwtState.id ? null : jwtState.id == props.post.user_id ? (
              <>
                <IonButton id="confirm">調整底價</IonButton>
                <IonButton
                  onClick={() => {
                    makeDeal();
                  }}
                >
                  成交！！
                </IonButton>
              </>
            ) : (
              <>
                <IonInput
                  value={bidPrice}
                  placeholder="請輸入金額"
                  onIonChange={(e: any) => setBidPrice(e.target.value)}
                ></IonInput>

                <IonButton
                  onClick={() => {
                    submitBid();
                  }}
                >
                  出價
                </IonButton>
              </>
            )}
          </IonItem>
          {!bidPrice.match(numReg) && bidPrice !== "" ? (
            <div className="ion-text-center">
              <IonText color="warning">請輸入有效數字</IonText>
            </div>
          ) : null}

          <IonModal
            id="adjustPriceConfirm-modal"
            ref={confirmModal}
            trigger="confirm"
          >
            <IonContent className="ion-padding">
              <ul>
                <li>
                  如確定調整此貨品的底價，截至目前所有對此貨品的投標將會清空，所有已保留的預售權將會全數歸還給投標者。
                </li>
              </ul>
            </IonContent>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <IonButton onClick={() => dismissConfirm()}>返回</IonButton>
              <IonButton onClick={() => adjustPrice()}>確定</IonButton>
            </div>
          </IonModal>
        </>
      )}
    </IonList>
  );
};

export default Post;
