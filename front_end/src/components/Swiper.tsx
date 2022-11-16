import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from "swiper";

import "swiper/swiper.min.css";
import "swiper/modules/autoplay/autoplay.min.css";
import "swiper/modules/keyboard/keyboard.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/scrollbar/scrollbar.min.css";
import "swiper/modules/zoom/zoom.min.css";
import "@ionic/react/css/ionic-swiper.css";
import "swiper/swiper.min.css";
import "@ionic/react/css/ionic-swiper.css";
import { IonPage, IonContent } from "@ionic/react";

const SwiperCompon: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <Swiper
          modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom]}
          autoplay={true}
          keyboard={true}
          pagination={true}
          scrollbar={true}
          zoom={true}
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};
export default SwiperCompon;
