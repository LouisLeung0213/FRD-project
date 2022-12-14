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
          <IonTitle>???????????????</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding" style={{ fontSize: "1.25rem" }}>
          <ul>
            <IonLabel>?????????????????????</IonLabel>
            <li>??????????????????????????????????????????</li>
            <li>?????????????????????????????????????????????</li>
            <li>??????????????????5??????????????????????????????????????????????????????</li>
            <li style={{ color: "red" }}>
              ??????! ?????????????????????????????????????????????????????????????????????
            </li>
            ????????????A???$100?????????B???$100?????????C???$100??? <br />
            ?????????????????????150??? ?????????????????????A,B??? ??????????????????????????????$100
          </ul>
        </div>
        <br />

        <IonLabel className="ion-padding">
          ????????????:{pointsState.points}
        </IonLabel>
        {item({
          name: "amount",
          renderLabel: () => (
            <IonLabel className="ion-text-center" position="floating">
              ????????????
            </IonLabel>
          ),
          renderContent: (props) => (
            <IonInput
              placeholder="?????????????????????( ?????? )"
              {...props}
            ></IonInput>
          ),
        })}
        <div className="ion-text-center">
          {state.amount !== "" &&
          state.amount.length != 0 &&
          !state.amount.match(/^\d+$/) ? (
            <IonText color="danger">?????????????????????</IonText>
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
            ??????
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
            <IonTitle>?????????</IonTitle>
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
