export let routes = {
  tab: {
    mainPage: "/tab/MainPage",
    pickPhoto: "/tab/PickPhoto",
    notices: "/tab/Notices",
    profile: (id: string | number) => `/tab/Profile/${id}`,
    login: "/tab/Login",
    adminPanel: "/tab/AdminPanel",
  },
  menu: {
    accountSetting: "/AccountSetting",
    noticeSetting: "/NoticeSetUp",
    passwordChange: "/PasswordChange",
    invoice: "/Invoice",
    signUp: "/SignUp",
  },
  storages: "/Storages",
  trade: "/Trade",
  blacklist: "/Blacklist",
  chatroomPage: "/ChatroomPage",
  chatroom: (id: string | number) => `/chatroom/${id}`,
  post: (id: string | number) => `/post/${id}`,
  payment: "/Payment",
  package: "/Package",
};
