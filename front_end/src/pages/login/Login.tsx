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
  useIonLoading,
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
import { API_ORIGIN, FRONT_ORIGIN } from "../../api";
import { Preferences } from "@capacitor/preferences";
import { setValue } from "../../service/localStorage";
import { chevronBackOutline } from "ionicons/icons";
import { useSocket } from "../../hooks/use-socket";
import { Socket } from "socket.io-client";
import { Root } from "react-dom/client";
import { updatePoints } from "../../redux/points/actions";
import { updateDots } from "../../redux/dots/actions";

const Login: React.FC = () => {
  const jwtState = useSelector((state: RootState) => state.jwt);
  const pointsState = useSelector((state: RootState) => state.points);
  const dispatch = useDispatch();
  const router = useIonRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const [isUsernameOk, setIsUsernameOk] = useState(true);
  const [isPasswordOk, setIsPasswordOk] = useState(true);
  const [isUserCorrect, setIsUserCorrect] = useState(true);

  const [present, dismiss] = useIonLoading();

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

    present({
      message: '?????????...',
      cssClass: 'custom-loading',
      spinner: 'crescent'
    })

    let res = await fetch(`${API_ORIGIN}/auth/login`, {
      method: "POST",
      // referrer: FRONT_ORIGIN,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: state.username,
        password: state.password,
      }),
    });
    let result = await res.json();
    console.log('this is login result', result)
    let token = result.access_token;
    
    console.log(token);
    if(result.banned_id){
      alert('?????????????????????')
      dismiss()
      return
    }
    if (token) {
      console.log('here success login')
      console.log("token",token)
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
      console.log("userInfo", userInfo)
      let res3 = await fetch(
        `${API_ORIGIN}/information/savedBank/${userInfo.id}`
      );

      let json = await res3.json();
      let savedBankArr: any = [];

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

      let getPointsInfoJson = await fetch(
        `${API_ORIGIN}/profiles/${userInfo.id}`
      );
      let getPointsInfo = await getPointsInfoJson.json();
      setUserId(userInfo.id);
      console.log("userInfo: ", getPointsInfo);
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
      dispatch(
        updatePoints({
          points: getPointsInfo.userInfo.points,
        })
      );
      dispatch(
        updateDots({
          chatDot: userInfo.chat_dots,
          noticeDot: userInfo.notice_dots
        })
      );   
      // history.push(`/tab/Profile`);
      socket.emit("join-TJroom", { userId: userInfo.id });
      router.push(routes.tab.profile(userInfo.id), "forward", "replace");
      dismiss()
    } else {
      console.log("wrong username or password")
      setIsUserCorrect(false);
      dismiss()
      // alert(JSON.stringify("???????????????...", null, 2));
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
    username: "",
    password: "",
  });

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          path={routes.tab.profile(userId)}
          exact={true}
          render={() => <Profile />}
        />
      </IonRouterOutlet>
      <IonHeader>
        <IonToolbar>
          <IonTitle>??????</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonList className="ion-padding">
          {item({
            name: "username",
            renderLabel: () => <IonLabel position="floating">??????:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isUsernameOk ? (
              <IonText color="warning">?????????????????????</IonText>
            ) : null}
          </div>

          {item({
            name: "password",
            renderLabel: () => <IonLabel position="floating">??????:</IonLabel>,
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
              <IonText color="warning">?????????????????????</IonText>
            ) : null}
          </div>
          <IonButton
            className="ion-margin-top"
            onClick={() => {
              submit();
            }}
            expand="block"
          >
            ??????
          </IonButton>
          <div className="ion-text-center">
            {!isUserCorrect ? (
              <IonText color="warning">?????????????????????</IonText>
            ) : null}
          </div>
          <IonButton
            className="ion-margin-top"
            expand="block"
            onClick={() => setIsOpen(true)}
          >
            ??????
          </IonButton>
        </IonList>

        <IonContent className="ion-padding">
          <IonModal isOpen={isOpen}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>??????</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>??????</IonButton>
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
