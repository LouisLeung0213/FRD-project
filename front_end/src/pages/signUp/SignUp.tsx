import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from "@ionic/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";
import { updateJwt } from "../../redux/user/actions";
import { useHistory } from "react-router-dom";

import "./SignUp.css";

const SignUp: React.FC<{ onSignUp: () => void }> = (props: {
  onSignUp: () => void;
}) => {
  const [isUsernameOk, setIsUsernameOk] = useState(true);
  const [isPasswordOk, setIsPasswordOk] = useState(true);
  const [isRePasswordOk, setIsRePasswordOk] = useState(true);
  const [isNicknameOk, setIsNicknameOk] = useState(true);
  const [isPhoneOk, setIsPhoneOk] = useState(true);
  const [isEmailOk, setIsEmailOk] = useState(true);

  const dispatch = useDispatch();
  const history = useHistory();

  async function handleSubmit() {
    const res = await fetch("/signUp");
  }

  const register = async (data: any) => {
    if (data.username.length == 0) {
      setIsUsernameOk(false);
      return;
    } else {
      setIsUsernameOk(true);
    }
    if (data.password.length == 0) {
      setIsPasswordOk(false);
      return;
    } else {
      setIsPasswordOk(true);
    }
    if (data.rePassword !== data.password) {
      setIsRePasswordOk(false);
      return;
    } else {
      setIsRePasswordOk(true);
    }
    if (data.nickname.length == 0) {
      setIsNicknameOk(false);
      return;
    } else {
      setIsNicknameOk(true);
    }
    if (data.phone.length == 0) {
      setIsPhoneOk(false);
      return;
    } else {
      setIsPhoneOk(true);
    }
    if (data.email.length == 0) {
      setIsEmailOk(false);
      return;
    } else {
      setIsEmailOk(true);
    }

    try {
      let res = await fetch(`http://localhost:1688/users/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
          nickname: state.nickname,
          phone: state.phone,
          email: state.email,
        }),
      });
      let result = await res.json();
      console.log("result.statusCode: ", result.statusCode);

      if (result.statusCode == 401) {
        alert(JSON.stringify("有人用左呢個帳號名喇, 改過啦", null, 2));
        return;
      }
      if (result.statusCode == 400) {
        alert(JSON.stringify("你個email都唔拿係email嚟既", null, 2));
        return;
      }
      alert(JSON.stringify("success!", null, 2));

      let res2 = await fetch(`http://localhost:1688/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
        }),
      });
      let result2 = await res2.json();
      let token = result2.access_token;

      let res3 = await fetch(`http://localhost:1688/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let userInfo = await res3.json();

      dispatch(
        updateJwt({
          newJwtKey: token,
          newUsername: userInfo.username,
          newPassword: userInfo.password,
          newNickname: userInfo.nickname,
          newPhone: userInfo.phone,
          newEmail: userInfo.email,
          newJoinedTime: userInfo.joinedTime,
          newIsAdmin: userInfo.isAdmin,
        })
      );

      props.onSignUp();
      history.push(`/tab/Profile`);
    } catch (error) {
      alert(JSON.stringify("sth wrong", null, 2));
    }
  };

  const { state, item } = useIonFormState({
    username: "",
    password: "",
    rePassword: "",
    nickname: "",
    phone: "",
    email: "",
  });

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonList className="ion-padding">
          {item({
            name: "username",
            renderLabel: () => <IonLabel position="floating">帳號:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          {!isUsernameOk ? (
            <div className="ion-text-center">
              <IonText color="warning">帳號呢？?</IonText>
            </div>
          ) : null}
          {item({
            name: "password",
            renderLabel: () => <IonLabel position="floating">密碼:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          {!isPasswordOk ? (
            <div className="ion-text-center">
              <IonText color="warning">密碼呢？?</IonText>
            </div>
          ) : null}

          {item({
            name: "rePassword",
            renderLabel: () => (
              <IonLabel position="floating">再次輸入密碼:</IonLabel>
            ),
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          {!isRePasswordOk ? (
            <div className="ion-text-center">
              <IonText color="warning">密碼confirm呢??</IonText>
            </div>
          ) : null}

          {item({
            name: "nickname",
            renderLabel: () => <IonLabel position="floating">暱稱:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          {!isNicknameOk ? (
            <div className="ion-text-center">
              <IonText color="warning">暱稱呢？?</IonText>
            </div>
          ) : null}

          {item({
            name: "phone",
            renderLabel: () => (
              <IonLabel position="floating">電話號碼:</IonLabel>
            ),
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          {!isPhoneOk ? (
            <div className="ion-text-center">
              <IonText color="warning">電話號碼呢？?</IonText>
            </div>
          ) : null}

          {item({
            name: "email",
            renderLabel: () => (
              <IonLabel position="floating">電子郵件:</IonLabel>
            ),
            renderContent: (props) => (
              <IonInput type="text" {...props}></IonInput>
            ),
          })}
          {!isEmailOk ? (
            <div className="ion-text-center">
              <IonText color="warning">電子郵件呢？?</IonText>
            </div>
          ) : null}
          <IonButton
            className="ion-margin-top"
            onClick={() => {
              register(state);
            }}
            expand="block"
          >
            註冊
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
