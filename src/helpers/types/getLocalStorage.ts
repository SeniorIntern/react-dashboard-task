type LocalStorageKeys = "user" | "token";

export const getLocalStorage = (keyName: LocalStorageKeys) => {
  let res;
  switch (keyName) {
    case "token":
      res = returnToken();
      break;

    case "user":
      res = returnUser();
      break;

    default:
      break;
  }
  return res;
};

const returnToken = () => {
  if (typeof localStorage !== "undefined") {
    const lsUser = localStorage.getItem("user");
    if (typeof lsUser === "string") {
      const token = JSON.parse(lsUser);
      return token.accessToken;
    } else
      return {
        status: false,
        message: "Key - not found in localStorage!",
      };
  }
};

const returnUser = () => {
  if (typeof localStorage !== "undefined") {
    const lsUser = localStorage.getItem("user");

    if (typeof lsUser === "string") {
      const user = JSON.parse(lsUser);
      return user;
    } else
      return {
        status: false,
        message: "Key - not found in localStorage!",
      };
  }
};
