import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { cubeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
// import { resultingClientExists } from "workbox-core/_private";
import { RootState } from "../../store";
import { routes } from "../../routes";

const AdminPanel: React.FC = () => {
  interface Users {
    id: number;
    nickname: string;
  }

  let [usersInfo, setUsersInfo] = useState([]);

  const isAdmin = useSelector((state: RootState) => state.isAdmin);
  const currentUserId: any = useSelector((state: RootState) => state.id);
  const router = useIonRouter();

  useEffect(() => {
    const getAllUser = async () => {
      let res = await fetch(`http://localhost:1688/admin`);
      let result = await res.json();
      // console.log(result);
      setUsersInfo(result);
      // for (let user of result) {
      //   setUsersInfo([...usersInfo, { id: user.id, nickname: user.nickname }]);
      // }
    };
    getAllUser();
  }, []);
  // console.log("usersInfo:", usersInfo);

  async function banUser(e: any) {
    console.log("e:", e);
    let res = await fetch(`http://localhost:1688/admin/${currentUserId}`, {
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
    <div>
      {!!isAdmin ? (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              熱拍管理處
              <IonButtons slot="end">
                <IonIcon
                  icon={cubeOutline}
                  onClick={() => router.push(routes.storages, "forward", "pop")}
                ></IonIcon>
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
      ) : (
        <IonPage>
          <IonContent>
            <IonItem>
              <h2>！！你沒有權限進入！！</h2>
            </IonItem>
          </IonContent>
        </IonPage>
      )}
    </div>
  );
};

export default AdminPanel;
