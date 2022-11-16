import {
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { resultingClientExists } from "workbox-core/_private";
import { RootState } from "../../store";

const AdminPanel: React.FC = () => {
  interface Users {
    id: number;
    nickname: string;
  }

  let [usersInfo, setUsersInfo] = useState([]);

  useEffect(() => {
    const getAllUser = async () => {
      let res = await fetch(`http://localhost:1688/admin`);
      let result = await res.json();
      console.log(result);
      setUsersInfo(result);
      // for (let user of result) {
      //   setUsersInfo([...usersInfo, { id: user.id, nickname: user.nickname }]);
      // }
    };
    getAllUser();
  }, []);
  console.log("usersInfo:", usersInfo);

  const isAdmin = useSelector((state: RootState) => state.is_admin);

  return (
    <div>
      {!!isAdmin ? (
        <IonPage>
          <IonHeader>
            <IonToolbar>熱拍管理處</IonToolbar>
          </IonHeader>
          <IonContent>
            <div>
              {usersInfo.map((e: Users) => {
                return (
                  <IonCard>
                    {e.id}:{e.nickname}
                  </IonCard>
                );
              })}
            </div>
            <IonList>
              <IonLabel> HOTBID 用戶清單</IonLabel>
              {/* {usersInfo.map((user) => {
                return(<div> id:{user}</div>) 
              })} */}
              被檢舉的用戶
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
