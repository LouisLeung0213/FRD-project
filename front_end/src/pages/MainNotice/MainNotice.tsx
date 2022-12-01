import { useEffect } from "react";
import { useSelector } from "react-redux";
import { API_ORIGIN } from "../../api";
import { RootState } from "../../store";

const MainNotice: React.FC = () => {
  let jwtState = useSelector((state: RootState) => state.jwt);

  useEffect(() => {
    const getNoti = async () => {
      let res = await fetch(`${API_ORIGIN}/main-notice/getMine/${jwtState.id}`);
      let result = await res.json();
    };
    getNoti();
  }, []);

  return <></>;
};

export default MainNotice;
