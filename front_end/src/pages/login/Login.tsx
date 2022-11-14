import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SetStateAction, useEffect, useState } from "react";
import SignUp from "../SignUp/SignUp";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { stringify } from "querystring";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../routes";
import { Route, useLocation } from "react-router";
import Profile from "../Tabs/Profile";
import { login } from "../../redux/user/actions";
import { LoginState } from "../../redux/user/state";
import { RootState } from "../../store";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const jwtKey = useSelector((state: RootState) => state.jwtKey);
  const setJwtKey: any = () => {};
  const dispatch = useDispatch();
  const history = useHistory();

  let [profileHref, setProfileHref] = useState("/tab/Login");
  let [isLogin, setIsLogin] = useState(false);

  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  let initialValues = {
    username: "",
    password: "",
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = async (data: any) => {
    let res = await fetch(`http://localhost:1688/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    });
    let result = await res.json();
    if (result.access_token) {
      console.log("result.access_token: ", result.access_token);
      dispatch(login(result.access_token));
      history.push(`/tab/Profile`);

      console.log("jwtKey: ", jwtKey, "login", isLogin);
      // setProfileHref("/tab/Profile");
    } else {
      alert(JSON.stringify("冇人識你喎...", null, 2));
    }
  };

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          path={routes.tab.profile}
          exact={true}
          render={() => <Profile />}
        />
      </IonRouterOutlet>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>登入</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="floating">帳號:</IonLabel>
            <IonInput
              {...register("username", { required: "填帳號名呀on9" })}
            />
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <IonTitle color="warning" size="small">
                  {message}
                </IonTitle>
              )}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">密碼:</IonLabel>
            <IonInput
              type="password"
              {...register("password", { required: "傻hi密碼呢" })}
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => (
                <IonTitle color="warning" size="small">
                  {message}
                </IonTitle>
              )}
            />
          </IonItem>
          {/* <IonItem lines="none">
             <IonLabel>Remember me</IonLabel>
             <IonCheckbox defaultChecked={true} slot="start" />
           </IonItem> */}
          <IonButton
            className="ion-margin-top"
            type="submit"
            expand="block"
            routerLink={profileHref}
          >
            登入
          </IonButton>
        </form>
        <IonContent className="ion-padding">
          <IonButton expand="block" onClick={() => setIsOpen(true)}>
            註冊
          </IonButton>
          <IonModal isOpen={isOpen}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>註冊</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>關閉</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <SignUp />
          </IonModal>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Login;
