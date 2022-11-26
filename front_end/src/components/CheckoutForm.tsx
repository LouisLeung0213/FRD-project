import { IonButton } from "@ionic/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Root } from "react-dom/client";
import { useSelector } from "react-redux";
import { API_ORIGIN, FRONT_ORIGIN } from "../api";
import { RootState } from "../store";

const CheckoutForm: React.FC<{
  clientSecret: string;
  amount: string;
}> = (props: { clientSecret: string; amount: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(props.clientSecret);
  const pointsState = useSelector((state: RootState) => state.points);
  const jwtState = useSelector((state: RootState) => state.jwt);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = props.clientSecret;
    setClientSecret(clientSecret);

    stripe.retrievePaymentIntent(clientSecret!).then(({ paymentIntent }) => {
      console.log(paymentIntent);
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("成功");
          break;
        case "processing":
          setMessage("處理中");
          break;
        case "requires_payment_method":
          setMessage("請輸入有效信用卡");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("not work");
      return;
    }

    const result = stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${FRONT_ORIGIN}/tab/Profile`,
      },
    });

    const res = fetch(`${API_ORIGIN}/payment/addPoints`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: jwtState.id,
        points: props.amount,
      }),
    });
    Promise.all([result, res]).catch((error) => {
      console.log(error);
    });
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
