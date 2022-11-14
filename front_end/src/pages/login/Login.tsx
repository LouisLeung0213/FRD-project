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
  IonList,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonText,
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
import { Route } from "react-router";
import Profile from "../Tabs/Profile";
import { updateJwt } from "../../redux/user/actions";
import { UpdateJwtState } from "../../redux/user/state";
import { RootState } from "../../store";
import { useHistory } from "react-router-dom";
import { useIonFormState } from "react-use-ionic-form";

const Login: React.FC = () => {
  const jwtKey = useSelector((state: RootState) => state.jwtKey);
  const nickname = useSelector((state: RootState) => state.nickname);
  const dispatch = useDispatch();
  const history = useHistory();

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
    let token = result.access_token;
    if (token) {
      let res2 = await fetch(`http://localhost:1688/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let userInfo = await res2.json();

      dispatch(
        updateJwt({
          newJwtKey: token,
          newUsername: userInfo.username,
          newNickname: userInfo.nickname,
          newJoinedTime: userInfo.joinedTime,
        })
      );
      history.push(`/tab/Profile`);
    } else {
      alert(JSON.stringify("冇人識你喎...", null, 2));
    }
  };

  const { state, item } = useIonFormState({
    username: "",
    password: "",
  });

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          path={routes.tab.profile}
          exact={true}
          render={() => <Profile user={nickname} />}
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
        <IonList className="ion-padding">
          {item({
            name: "username",
            renderLabel: () => (
              <IonLabel position="floating">帳號:</IonLabel>
            ),
            renderContent: (props) => <IonInput {...props}></IonInput>,
          })}
          {item({
            name: "password",
            renderLabel: () => (
              <IonLabel position="floating">密碼:</IonLabel>
            ),
            renderContent: (props) => (
              <IonInput
                onKeyDown={(e) => {
                  if (e.key == "Enter" && state.password.length > 8) {
                    onSubmit(state);
                  }
                }}
                {...props}
              ></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {state.password.length < 8 && state.password.length >= 1 ? (
              <IonText color="warning">
                Password should consist of at least 8 chars
              </IonText>
            ) : null}
          </div>
          <IonButton className="ion-margin-top" onClick={() => {onSubmit(state)}} expand="block">
            登入
          </IonButton>
        </IonList>
        <div>我是分隔線</div>

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
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  console.log("s");
                }
              }}
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
          <IonButton className="ion-margin-top" type="submit" expand="block">
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
