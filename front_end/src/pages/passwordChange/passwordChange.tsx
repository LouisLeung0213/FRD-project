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
  IonMenuToggle,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useIonFormState } from "react-use-ionic-form";
import { RootState } from "../../store";

const PasswordChange: React.FC = () => {
  let [isOldPasswordOk, setIsOldPasswordOk] = useState(true);
  let [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState(true);
  let [isNewPasswordNotSame, setIsNewPasswordNotSame] = useState(true);
  let [isNewPasswordOk, setIsNewPasswordOk] = useState(true);
  let [isReNewPasswordOk, setIsReNewPasswordOk] = useState(true);
  let [isReNewPasswordSame, setIsReNewPasswordSame] = useState(true);

  let id = useSelector((state: RootState) => state.id);

  const router = useIonRouter();

  async function updatePassword(data: any) {
    if (data.oldPassword.length == 0) {
      setIsOldPasswordOk(false);
      return;
    } else {
      setIsOldPasswordOk(true);
    }
    if (data.newPassword.length == 0) {
      setIsNewPasswordOk(false);
      return;
    } else {
      setIsNewPasswordOk(true);
    }
    if (data.newPassword == data.oldPassword) {
      setIsNewPasswordNotSame(false);
      return;
    } else {
      setIsNewPasswordOk(true);
    }
    if (data.reNewPassword.length == 0) {
      setIsReNewPasswordOk(false);
      return;
    } else {
      setIsReNewPasswordOk(true);
    }
    if (data.reNewPassword !== data.newPassword) {
      setIsReNewPasswordSame(false);
      return;
    } else {
      setIsReNewPasswordSame(true);
    }

    let res = await fetch(`http://localhost:1688/users/updatePassword/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
      }),
    });
    let json = await res.json();

    if (json.message == "Wrong old password") {
      setIsOldPasswordCorrect(false);
      return;
    }

    router.goBack();
    // router.push(routes.tab.profile, "forward", "replace");
  }

  const { state, item } = useIonFormState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>更改密碼</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-padding">
          {item({
            name: "oldPassword",
            renderLabel: () => (
              <>
                {" "}
                <IonLabel position="floating">舊密碼:</IonLabel>
              </>
            ),
            renderContent: (props) => (
              <IonInput type="password" {...props}></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isOldPasswordOk ? (
              <IonText color="warning">舊密碼呢？?</IonText>
            ) : null}
          </div>
          <div className="ion-text-center">
            {!isOldPasswordCorrect ? (
              <IonText color="warning">舊密碼唔啱wo??</IonText>
            ) : null}
          </div>
          {item({
            name: "newPassword",
            renderLabel: () => <IonLabel position="floating">新密碼:</IonLabel>,
            renderContent: (props) => (
              <IonInput type="password" {...props}></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isNewPasswordOk ? (
              <IonText color="warning">新密碼呢？?</IonText>
            ) : null}
          </div>
          <div className="ion-text-center">
            {!isNewPasswordNotSame ? (
              <IonText color="warning">新密碼同舊密碼一樣wo, 改改佢啦</IonText>
            ) : null}
          </div>
          {item({
            name: "reNewPassword",
            renderLabel: () => (
              <IonLabel position="floating">確認新密碼:</IonLabel>
            ),
            renderContent: (props) => (
              <IonInput
                type="password"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    updatePassword(state);
                  }
                }}
                {...props}
              ></IonInput>
            ),
          })}
          <div className="ion-text-center">
            {!isReNewPasswordOk ? (
              <IonText color="warning">確認新密碼呢???</IonText>
            ) : null}
          </div>
          <div className="ion-text-center">
            {!isReNewPasswordSame ? (
              <IonText color="warning">
                新密碼同確認新密碼唔一樣wo, 改改佢啦
              </IonText>
            ) : null}
          </div>
          <IonMenuToggle>
            <IonButton
              className="ion-margin-top"
              onClick={() => {
                updatePassword(state);
              }}
              expand="block"
            >
              完成
            </IonButton>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PasswordChange;
