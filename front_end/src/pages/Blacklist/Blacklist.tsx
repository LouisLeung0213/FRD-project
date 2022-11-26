import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_ORIGIN } from "../../api";
import { routes } from "../../routes";
import { RootState } from "../../store";

const Blacklist: React.FC = () => {
  interface Users {
    id: number;
    nickname: string;
  }

  let [usersInfo, setUsersInfo] = useState([]);
  const jwtState: any = useSelector((state: RootState) => state.jwt);

  useEffect(() => {
    const getAllUser = async () => {
      let res = await fetch(`${API_ORIGIN}/admin`);
      let result = await res.json();
      // console.log(result);
      setUsersInfo(result);
      // for (let user of result) {
      //   setUsersInfo([...usersInfo, { id: user.id, nickname: user.nickname }]);
      // }
    };
    getAllUser();
  }, []);
  async function banUser(e: any) {
    console.log("e:", e);
    let res = await fetch(`${API_ORIGIN}/admin/${jwtState.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: +e.id,
      }),
    });
    let result = await res.text();
    console.log(result);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          熱拍懲教處
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.tab.adminPanel}></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonLabel> HOTBID 用戶清單</IonLabel>
          <div>
            {usersInfo.map((e: Users) => {
              return (
                <IonCard key={e.id} onClick={() => banUser(e)}>
                  {e.id}:{e.nickname}
                </IonCard>
              );
            })}
          </div>
          <IonLabel>被檢舉的用戶</IonLabel>
          <IonItem>Scott</IonItem>
          被檢舉的貨品
          <IonItem>IronMan Mark 42</IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Blacklist;
