import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
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
  useIonRouter,
} from "@ionic/react";
import { useCallback, useState } from "react";
import SignUp from "../SignUp/SignUp";

import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../routes";
import { Route } from "react-router";
import Profile from "../Tabs/Profile";
import { updateJwt } from "../../redux/user/actions";
import { RootState } from "../../store";

import { useIonFormState } from "react-use-ionic-form";
import { API_ORIGIN } from "../../api";
import { Preferences } from "@capacitor/preferences";
import { setValue } from "../../service/localStorage";
import { chevronBackOutline } from "ionicons/icons";
import { useSocket } from "../../hooks/use-socket";
import { Socket } from "socket.io-client";

const Login: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);

  const dispatch = useDispatch();
  const router = useIonRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [isUsernameOk, setIsUsernameOk] = useState(true);
  const [isPasswordOk, setIsPasswordOk] = useState(true);
  const [isUserCorrect, setIsUserCorrect] = useState(true);

  let currentUserId: number = 0;

  // const [isBanned, setIsBanned] = useState(false);

  const submit = async () => {
    if (state.username.length == 0) {
      setIsUsernameOk(false);
      return;
    } else {
      setIsUsernameOk(true);
    }
    if (state.password.length == 0) {
      setIsPasswordOk(false);
      return;
    } else {
      setIsPasswordOk(true);
    }

    let res = await fetch(`${API_ORIGIN}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: state.username,
        password: state.password,
      }),
    });
    let result = await res.json();
    let token = result.access_token;
    console.log(token);
    if (token) {
      setValue("Jwt", token);

      setIsUserCorrect(true);
      let res2 = await fetch(`${API_ORIGIN}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let userInfo = await res2.json();

      setValue("userId", userInfo.id);

      let res3 = await fetch(
        `${API_ORIGIN}/information/savedBank/${userInfo.id}`
      );

      let json = await res3.json();
      let savedBankArr: any = [];

      console.log("here!", json);
      if (json.banks_id.length > 0) {
        let savedBankNameArr: any = json.bank_name_arr;
        let savedBankAccount: any = json.banks_id;
        console.log(
          "!!!!!!!!!!!!!!!!!!!!!!!!!!!",
          savedBankNameArr,
          savedBankAccount
        );

        for (let i = 0; i < json.bank_name_arr.length; i++) {
          console.log("saved bank:", json[i]);
          savedBankArr.push({
            bankName: savedBankNameArr[i].bank_name,
            bankAccount: savedBankAccount[i].bank_account,
          });
        }
        console.log("saved bank Array 2222222222:", savedBankArr);
      }

      console.log("userInfo: ", userInfo);
      dispatch(
        updateJwt({
          jwtKey: token,
          id: userInfo.id,
          username: userInfo.username,
          nickname: userInfo.nickname,
          phone: userInfo.phone,
          email: userInfo.email,
          joinedTime: userInfo.joinedTime,
          isAdmin: userInfo.is_admin,
          bankAccount: savedBankArr ? savedBankArr : null,
          icon_name: userInfo.icon_name,
          icon_src: userInfo.icon_src,
        })
      );
      // history.push(`/tab/Profile`);
      socket.emit("join-TJroom", { userId: userInfo.id });
      router.push(routes.tab.profile(":id"), "forward", "replace");
    } else {
      setIsUserCorrect(false);
      // alert(JSON.stringify("冇人識你喎...", null, 2));
    }
  };

  const socket = useSocket(
    useCallback(
      (socket: Socket) => {
        return () => {};
      },
      [submit]
    )
  );

  const { state, item } = useIonFormState({
    username: "caleb",
    password: "123",
  });

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          path={routes.tab.profile(":id")}
          exact={true}
          render={() => <Profile user={jwtState.id} />}
        />
      </IonRouterOutlet>
      <IonHeader>
        <IonToolbar>
          <IonTitle>登入</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonList className="ion-padding">
          {item({
            name: "username",
            renderLabel: () => <IonLabel position="floating">帳號:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isUsernameOk ? (
              <IonText color="warning">請輸入有效帳號</IonText>
            ) : null}
          </div>

          {item({
            name: "password",
            renderLabel: () => <IonLabel position="floating">密碼:</IonLabel>,
            renderContent: (props) => (
              <IonInput
                type="password"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    submit();
                  }
                }}
                {...props}
              ></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isPasswordOk ? (
              <IonText color="warning">請輸入有效密碼</IonText>
            ) : null}
          </div>
          <IonButton
            className="ion-margin-top"
            onClick={() => {
              submit();
            }}
            expand="block"
          >
            登入
          </IonButton>
          <div className="ion-text-center">
            {!isUserCorrect ? (
              <IonText color="warning">帳號或密碼錯誤</IonText>
            ) : null}
          </div>
          <IonButton
            className="ion-margin-top"
            expand="block"
            onClick={() => setIsOpen(true)}
          >
            註冊
          </IonButton>
        </IonList>

        <IonContent className="ion-padding">
          <IonModal isOpen={isOpen}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>註冊</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>關閉</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <SignUp onSignUp={() => setIsOpen(false)} />
          </IonModal>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Login;
