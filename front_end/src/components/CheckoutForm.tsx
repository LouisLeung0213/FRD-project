import { IonButton } from "@ionic/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { API_ORIGIN, FRONT_ORIGIN } from "../api";

const CheckoutForm: React.FC<{ clientSecret: string }> = (props: {
  clientSecret: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    //TODO
    const clientSecret = props.clientSecret;
    setClientSecret(clientSecret);
    // new URLSearchParams(window.location.search).get(
    //   "payment_intent_client_secret"
    // );
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

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${FRONT_ORIGIN}/tab/Profile`,
      },
    });
    console.log(result);

    // const res = await fetch(`${API_ORIGIN}/users/addPoints`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body:JSON.stringify({
    //     points:
    //   })
    // });

    // let succeedPayment = await res.json();

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
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
