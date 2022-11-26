import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { API_ORIGIN } from "../../api";
import "./MainPage.css";

const MainPage: React.FC = () => {
  let [postsList, setPostsList] = useState<[any]>([] as any);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const postsList = async () => {
      let res = await fetch(`${API_ORIGIN}/posts/showAll`);
      let result = await res.json();

      setPostsList(result);
      console.log("result", result);
    };

    postsList();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <div className="ion-padding" slot="content">
            <IonSearchbar
              debounce={1000}
              onIonChange={(ev: any) => setQuery(ev.target.value)}
            ></IonSearchbar>
            {postsList
              .filter((postsList) => postsList.post_title.includes(query))
              .map((e: any) => {
                return (
                  <IonItem key={e.id}>
                    <img src={e.json_agg[0]}></img>
                    {!e.admin_title ? (
                      <IonLabel>{e.post_title}</IonLabel>
                    ) : (
                      <IonLabel>{e.admin_title}</IonLabel>
                    )}
                    <IonLabel>${e.original_price}</IonLabel>
                    <IonLabel>{e.nickname}</IonLabel>
                  </IonItem>
                );
              })}
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MainPage;
