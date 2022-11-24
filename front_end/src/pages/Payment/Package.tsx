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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { useIonFormState } from "react-use-ionic-form";
import { Router } from "workbox-routing";
import { API_ORIGIN } from "../../api";
import CheckoutForm from "../../components/CheckoutForm";
import { routes } from "../../routes";
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
  const paymentIntentModal = useRef<HTMLIonModalElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const { state, item } = useIonFormState({
    amount: "",
  });

  async function getIdSecret() {
    let result = await fetch(`${API_ORIGIN}/payment/paymentIntent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: state.amount,
      }),
    });
    let paymentAuthorizationInfo = await result.json();

    console.log(paymentAuthorizationInfo.client_secret);

    console.log("client_secret", paymentAuthorizationInfo.client_secret);

    setClientSecret(paymentAuthorizationInfo.client_secret);
    setIsLoading(false);
  }

  useEffect(() => {
    getIdSecret();
  }, []);
  useEffect(() => {
    getIdSecret();
  }, []);

  const submitForm = async (data: any) => {
    let numReg = /^\d+$/;
    if (data.amount.match(numReg) && data.amount.length > 0) {
      setIsPointsOk(true);
    } else {
      setIsPointsOk(false);
    }

    // if (isPointsOk === true) {
    //   router.push(routes.);
    // }
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
        <div className="ion-padding">
          <ul>
            <IonLabel>充值前注意事項</IonLabel>
            <li>此金額只是授權預授權涷結資金</li>
            <li>預授權只會於賣家確認成交後過數</li>
            <li>為保障買家，5日後如果未成功使用預授權將會自動取消</li>
          </ul>
        </div>
        <br />
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
          <IonButton id="paymentIntent-dialog">發送</IonButton>
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
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            ) : null}
          </IonItem>
          <div>
            <IonButton strong={true} onClick={() => submitForm(state)}>
              Confirm
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

//
export default Package;
