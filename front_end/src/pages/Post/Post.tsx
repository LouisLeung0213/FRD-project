import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonButton,
  IonText,
  IonCard,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { API_ORIGIN } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useSocket } from "../../hooks/use-socket";
import { Socket } from "socket.io-client";

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

const Post: React.FC<{ post: PostObj }> = (props: { post: PostObj }) => {
  const jwtState = useSelector((state: RootState) => state.jwt);

  const [bidPrice, setBidPrice] = useState("");
  const [bidIsSubmitted, setBidIsSubmitted] = useState(false);
  const [bidList, setBidList] = useState([]);
  const [highestBidder, setHighestBidder] = useState("");
  const [nowPrice, setNowPrice] = useState(0);
  let numReg = /^\d+$/;

  const socket = useSocket(
    useCallback(
      (socket: Socket) => {
        console.log("join room", props.post.id);
        socket.emit("join-room", props.post.id);
        socket.on("newBidReceived", (msg) => {
          console.log("received", msg);
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

  console.log("rendering, socket:", socket);

  useEffect(() => {
    console.log(jwtState.id);
    const bidRecord = async () => {
      let res = await fetch(`${API_ORIGIN}/bid/bidList/${props.post.id}`);
      let result = await res.json();
      console.log(props);
      console.log(result);
      setBidList(result);
      if (!("nickname" in result)) {
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

  async function submitBid() {
    if (!bidPrice.match(numReg)) {
      console.log("are u on9?");
      alert("請輸入有效金額");
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
      }),
    });
    let result = await res.json();
    console.log(result);
    if (result.status == "19") {
      alert("你出既價低過最高價喎");

      return;
    } else if (result.status == "09") {
      alert("你出價低過原價喎");
      return;
    } else {
      alert("出價成功");
      setBidIsSubmitted(true);
      return;
    }
  }

  return (
    <IonList>
      <IonItem>{props.post.username}</IonItem>
      <IonItem>{props.post.nickname}</IonItem>
      {props.post.json_agg.map((e: any, index) => {
        return (
          <IonItem key={index}>
            <img src={e}></img>
          </IonItem>
        );
      })}
      {!props.post.admin_title ? (
        <>
          <IonLabel>{props.post.post_title}</IonLabel>
          <IonLabel>{props.post.post_description}</IonLabel>
        </>
      ) : (
        <>
          <IonLabel>{props.post.admin_title}</IonLabel>
          <IonLabel>{props.post.admin_comment}</IonLabel>
        </>
      )}
      <IonItem>${nowPrice}</IonItem>
      <IonItem>{props.post.q_mark}</IonItem>
      <IonItem>
        上架時間：{moment(props.post.post_time).format("MMMM Do YYYY")}
      </IonItem>
      {!props.post.q_mark ? null : (
        <>
          <IonItem>現時最高出價者：{highestBidder}</IonItem>
          {bidList.map((e: any, index) => {
            return (
              <IonCard key={index}>
                {e.nickname}: $ {e.bid_price}
              </IonCard>
            );
          })}
          <IonItem>
            {!jwtState.id ? null : (
              <>
                <IonInput
                  placeholder="請輸入金額"
                  onIonChange={(e: any) => setBidPrice(e.target.value)}
                ></IonInput>
                {!bidPrice.match(numReg) && bidPrice !== "" ? (
                  <div className="ion-text-center">
                    <IonText color="warning">請輸入有效數字</IonText>
                  </div>
                ) : null}
                <IonButton onClick={() => submitBid()}>出價</IonButton>
              </>
            )}
          </IonItem>
        </>
      )}
    </IonList>
  );
};

export default Post;
