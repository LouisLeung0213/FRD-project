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
  useIonActionSheet,
  IonBackdrop,
} from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import moment, { now } from "moment";
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
import { routes } from "../../routes";
import styles from "./Posts.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from "swiper";

import "swiper/swiper.min.css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "@ionic/react/css/ionic-swiper.css";
import "swiper/swiper.min.css";
import "@ionic/react/css/ionic-swiper.css";

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
  location: "";
};

const Post: React.FC<{ post: PostObj; goChat: any; afterDeal: any }> = (props: {
  post: PostObj;
  goChat: any;
  afterDeal: any;
}) => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  const pointsState = useSelector((state: RootState) => state.points);

  const [bidPrice, setBidPrice] = useState("");
  const [bidList, setBidList] = useState([]);
  const [highestBidder, setHighestBidder] = useState("");
  const [highestBidder_id, setHighestBidder_id] = useState(0);
  const [nowPrice, setNowPrice] = useState(+props.post.original_price);
  const [adjustedPrice, setAdjustedPrice] = useState("");
  const [bidStatus, setBidStatus] = useState(false);

  let numReg = /^\d+$/;
  const router = useIonRouter();

  const confirmModal = useRef<HTMLIonModalElement>(null);

  const socket = useSocket(
    useCallback(
      (socket: Socket) => {
        console.log("join room", props.post.id);
        socket.emit("join-room", props.post.id);
        socket.on("newBidReceived", (msg) => {
          console.log("Still in room");
          if (msg.newBidContent != "") {
            if (msg.newBidContent[0].post_id) {
              if (msg.newBidContent[0].post_id != +props.post.id) {
                console.log("wrong, bye bye");
                return;
              }
            }
          }
          setBidList(msg.newBidContent);
          setHighestBidder(msg.newBidContent[0].nickname);
          setNowPrice(msg.newBidContent[0].bid_pric);
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
  // console.log("props.post.q_mark:", props.post.q_mark);
  // console.log("rendering, socket:", socket);
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
    // console.log("props.post.json_agg", props.post.json_agg);
    //console.log("props original price:", props.post.original_price);
    //console.log("now price :", nowPrice);

    //console.log(jwtState.id);
    const bidRecord = async () => {
      let res = await fetch(`${API_ORIGIN}/bid/bidList/${props.post.id}`);
      let result = await res.json();
      // console.log(props);
      // console.log(result);
      setBidList(result);
      if (!result[0]) {
        setHighestBidder("");
      } else {
        setHighestBidder(result[0].nickname);
        setHighestBidder_id(result[0].buyer_id);
      }
      if (!result[0]) {
        if (nowPrice == props.post.original_price) {
          setNowPrice(props.post.original_price);
          setAdjustedPrice(props.post.original_price.toString());
        }
        setAdjustedPrice(nowPrice.toString());
      } else {
        setNowPrice(result[0].bid_price);
        setAdjustedPrice(result[0].bid_price.toString());
      }
    };
    bidRecord();
    if (props.post.status.toString() == "selling") {
      setBidStatus(true);
    }
  }, [nowPrice]);

  async function getChatDetail() {
    // alert(`props.post.id: ${props.post.id}, jwtState.id: ${jwtState.id}`)
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
    //console.log(result);
    if ("id" in result[0]) {
      props.goChat(result[0].id);
    } else {
      alert("cannot open chatroom");
    }
  }

  function goAfterDeal() {
    props.afterDeal();
  }

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  const [present] = useIonActionSheet();

  async function makeDeal() {
    return new Promise<boolean>((resolve, reject) => {
      present({
        header: "確認成交 ?",
        buttons: [
          {
            text: "成交",
            role: "confirm",
          },
          {
            text: "取消",
            role: "cancel",
          },
        ],
        onWillDismiss: async (ev) => {
          if (ev.detail.role === "confirm") {
            console.log(nowPrice);
            console.log(highestBidder_id);
            let dealRes = await fetch(
              `${API_ORIGIN}/payment/capturePaymentIntent`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  bidPrice: nowPrice,
                  post_id: props.post.id,
                  bidder_id: highestBidder_id,
                }),
              }
            );
            let result = await dealRes.json();
            // console.log("deal: ", result);
            if (result.status == 200) {
              goAfterDeal();
            }
          } else {
            reject();
          }
        },
      });
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

    let res = await fetch(`${API_ORIGIN}/bid/bidding`, {
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
    // console.log(result);
    if (result.status == "19") {
      alert("出價不可低過最高價");
      return;
    } else if (result.status == "09") {
      alert("出價不可比原價更低");
      return;
    } else {
      alert("出價成功");
      setBidPrice("");
      return;
    }
  }

  async function adjustPrice() {
    if (!adjustedPrice.match(numReg) || adjustedPrice == "") {
      alert("請輸入有效金額");
      return;
    }

    let res = await fetch(`${API_ORIGIN}/bid/updateBidding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: props.post.id,
        updatedPrice: adjustedPrice,
      }),
    });
    let result = await res.json();

    setBidList([]);
    setAdjustedPrice(nowPrice.toString());

    setNowPrice(+adjustedPrice);

    confirmModal.current?.dismiss();
    alert("調整底價成功");

    //console.log("New adjusted price: ", adjustedPrice);
  }

  function dismissConfirm() {
    confirmModal.current?.dismiss();
  }

  return (
    <IonList className={styles.post_modal}>
      {/* <IonBackdrop
        visible={false}
      ></IonBackdrop> */}
      {!props.post.admin_title ? (
        <>
          <h2 className="ion-padding">
            {props.post.post_title}
            {props.post.q_mark ? (
              <IonIcon
                style={{
                  marginLeft: "10px",
                  paddingTop: "3px",
                  color: "#3880ff",
                }}
                icon={checkmarkDoneCircleOutline}
              ></IonIcon>
            ) : null}
          </h2>
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
            {props.post.status.toString() == "sold&holding" || props.post.status.toString() == "sold&out" ? (
              <span style={{ color: "red", marginLeft: "15px" }}>
                貨品已售出
              </span>
            ) : null}
          </h2>
        </>
      )}
      <Swiper
        modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom]}
        autoplay={true}
        keyboard={true}
        pagination={true}
        slidesPerView={1}
        //scrollbar={true}
        zoom={true}
        effect={"fade"}
        className={styles.slide}
      >
        {props.post.json_agg.map((e: any, index) => {
          return (
            <SwiperSlide className={styles.image_slide} key={index}>
              <img className="image" src={e}></img>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {!jwtState.id ? null : jwtState.id == props.post.user_id ? null : (
        <IonItem onClick={() => getChatDetail()}>
          <IonLabel>聯絡賣家 : {props.post.nickname}</IonLabel>

          <IonIcon
            style={{ color: "skyBlue" }}
            icon={chatbubbles}
            size="large"
            slot="start"
          ></IonIcon>
        </IonItem>
      )}
      <h3 className="ion-padding">
        產品描述:{" "}
        {props.post.admin_comment
          ? props.post.admin_comment
          : props.post.post_description}
      </h3>
      {props.post.location !== "" && props.post.location != "notAvailable" ? (
        <IonItem>取貨地點 : {props.post.location}</IonItem>
      ) : null}
      <IonItem style={{ color: "gold" }}>
        <IonIcon style={{ color: "red" }} icon={flame}></IonIcon> 現價: ${"   "}
        {nowPrice}
      </IonItem>
      <IonItem>{props.post.q_mark}</IonItem>
      <IonItem>
        <IonIcon style={{ color: "#fcd92b" }} icon={calendar}></IonIcon>
        <h5>上架時間：{moment(props.post.post_time).format("MMMM Do YYYY")}</h5>
      </IonItem>
      {!props.post.q_mark || bidStatus == false ? null : (
        <>
          <IonItem>
            <h3>現時最高出價者：{highestBidder}</h3>
          </IonItem>
          {bidList.map((e: any, index) => {
            return (
              <div className={styles.ionCardContainer} key={index}>
                <IonCard>
                  {e.nickname}: $ {e.bid_price}
                </IonCard>
              </div>
            );
          })}
          <IonItem className="inputBox">
            {highestBidder_id ==
            jwtState.id ? null : !jwtState.id ? null : jwtState.id !==
              props.post.user_id ? (
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
            ) : null}
          </IonItem>
          {!bidPrice.match(numReg) && bidPrice !== "" ? (
            <div className="ion-text-center">
              <IonText color="warning">請輸入有效數字</IonText>
            </div>
          ) : null}
        </>
      )}

      {!jwtState.id ? null : jwtState.id == props.post.user_id && bidStatus ? (
        <>
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
            ) : null}
          </IonItem>

          <IonModal
            id={styles.adjustPriceConfirm_modal}
            ref={confirmModal}
            trigger="confirm"
          >
            <IonContent className="ion-padding" scroll-y="false">
              <ul>
                <li style={{ margin: "3rem 0" }}>
                  如確定調整此貨品的底價，截至目前所有對此貨品的投標將會清空，所有已保留的預授權將會全數歸還給投標者。
                </li>
              </ul>
              <IonItem>
                <IonLabel position="floating">請輸入週整後底價</IonLabel>
                <IonInput
                  value={adjustedPrice}
                  placeholder="請輸入"
                  onIonChange={(e: any) => setAdjustedPrice(e.target.value)}
                ></IonInput>
              </IonItem>
              {!adjustedPrice.match(numReg) && adjustedPrice !== "" ? (
                <div className="ion-text-center">
                  <IonText color="warning">請輸入有效數字</IonText>
                </div>
              ) : null}
            </IonContent>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <IonButton onClick={() => dismissConfirm()}>返回</IonButton>
              <IonButton onClick={() => adjustPrice()}>確定</IonButton>
            </div>
          </IonModal>
        </>
      ) : null}
    </IonList>
  );
};

export default Post;
