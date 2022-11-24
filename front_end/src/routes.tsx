export let routes = {
  tab: {
    mainPage: "/tab/MainPage",
    hot: "/tab/Hot",
    pickPhoto: "/tab/PickPhoto",

    notices: "/tab/Notices",
    profile: "/tab/Profile",
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
  chatrooms: "/Chatrooms",
  chatroom: (id: string | number) => `/chatroom/${id}`,
  payment: "/Payment",
};
