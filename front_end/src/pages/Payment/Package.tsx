import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  CardElement,
  CardNumberElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { Root } from "react-dom/client";
import { useSelector, useDispatch } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";
import { Router } from "workbox-routing";
import { API_ORIGIN } from "../../api";
import CheckoutForm from "../../components/CheckoutForm";
import { updatePoints } from "../../redux/points/actions";
import { updateJwt } from "../../redux/user/actions";
import { routes } from "../../routes";
import { getValue } from "../../service/localStorage";
import { RootState } from "../../store";
import "./Package.css";

let pubKey = async () => {
  let res = await fetch(`${API_ORIGIN}/payment/stripeConfig`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let key = await res.json();
  console.log(key.key);
  return loadStripe(key.key);
};

const stripePromise = pubKey();

const Package: React.FC = () => {
  const [isPointsOk, setIsPointsOk] = useState(false);
  const router = useIonRouter();
  const pointsState = useSelector((state: RootState) => state.points);
  const jwtState = useSelector((state: RootState) => state.jwt);
  const dispatch = useDispatch();
  const paymentIntentModal = useRef<HTMLIonModalElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [getClientSecret, setGetClientSecret] = useState(false);

  const { state, item } = useIonFormState({
    amount: "",
  });

  //get client_secret

  async function getIdSecret() {
    let totalAmount = +state.amount * 100;
    console.log("totalAmount::", totalAmount);
    setGetClientSecret(true);
    let result = await fetch(`${API_ORIGIN}/payment/paymentIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount,
        payment_method_types: "card",
        payment_method: "card",
      }),
    });
    let paymentAuthorizationInfo = await result.json();

    console.log(paymentAuthorizationInfo.result.client_secret);

    console.log("client_secret", paymentAuthorizationInfo.result.client_secret);

    setClientSecret(paymentAuthorizationInfo.result.client_secret);
    setIsLoading(false);
  }
  //get remain points of account
  async function getUserPoints() {
    let token = await getValue("Jwt");
    let res = await fetch(`${API_ORIGIN}/profiles/${jwtState.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let userInfo = await res.json();
    console.log(userInfo);
    dispatch(
      updateJwt({
        jwtKey: token,
        id: userInfo.userInfo.id,
        username: userInfo.userInfo.username,
        nickname: userInfo.userInfo.nickname,
        phone: userInfo.userInfo.phone,
        email: userInfo.userInfo.email,
        joinedTime: userInfo.userInfo.joinedTime,
        isAdmin: userInfo.userInfo.is_admin,
        bankAccount: userInfo.bankInfo.bank_account,
        icon_name: userInfo.userInfo.icon_name,
        icon_src: userInfo.userInfo.icon_src,
      })
    );

    dispatch(
      updatePoints({
        points: userInfo.userInfo.points,
      })
    );
  }

  useEffect(() => {
    getUserPoints();
  }, []);

  const submitForm = async (data: any) => {
    let numReg = /^\d+$/;
    if (data.amount.match(numReg) && data.amount.length > 0) {
      setIsPointsOk(true);
    } else {
      setIsPointsOk(false);
    }
  };

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>充值預授權</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding" style={{ fontSize: "1.25rem" }}>
          <ul>
            <IonLabel>充值前注意事項</IonLabel>
            <li>此金額只是授權預授權涷結資金</li>
            <li>預授權只會於賣家確認成交後過數</li>
            <li>為保障買家，5日後如果未成功使用預授權將會自動取消</li>
            <li style={{ color: "red" }}>
              注意! 當扣除點後，點數會以戶口餘下每組預授權金額總和
            </li>
            例如充值A：$100，充值B：$100，充值C：$100。 <br />
            若交易金額為＄150， 扣款蓋括預授權A,B， 成交後點數餘額將會為$100
          </ul>
        </div>
        <br />

        <IonLabel className="ion-padding">
          戶口餘額:{pointsState.points}
        </IonLabel>
        {item({
          name: "amount",
          renderLabel: () => (
            <IonLabel className="ion-text-center" position="floating">
              充值金額
            </IonLabel>
          ),
          renderContent: (props) => (
            <IonInput
              placeholder="請輸入充值金額( 港幣 )"
              {...props}
            ></IonInput>
          ),
        })}
        <div className="ion-text-center">
          {state.amount !== "" &&
          state.amount.length != 0 &&
          !state.amount.match(/^\d+$/) ? (
            <IonText color="danger">請輸入有效金額</IonText>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem ",
          }}
        >
          <IonButton id="paymentIntent-dialog" onClick={() => getIdSecret()}>
            發送
          </IonButton>
        </div>
      </IonContent>

      <IonModal
        id="paymentIntent-modal"
        ref={paymentIntentModal}
        trigger="paymentIntent-dialog"
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => paymentIntentModal.current?.dismiss()}>
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>預授權</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            {clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  amount={state.amount}
                />
              </Elements>
            ) : null}
          </IonItem>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

//
export default Package;
