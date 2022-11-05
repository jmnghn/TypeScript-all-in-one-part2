import { AnyAction, Dispatch } from "redux";

export type LoginRequestData = { nickname: string; password: string };

export const logIn = (data: LoginRequestData) => {
  // async action creator
  return (dispatch: Dispatch<AnyAction>, getState: () => any) => {
    // async action
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(
          logInSuccess({
            userId: 1,
            nickname: "zerocho",
          })
        );
      }, 2000);
    } catch (e) {
      dispatch(logInFailure(e));
    }
  };
};

export type LogInRequestAction = {
  type: "LOG_IN_REQUEST";
  data: LoginRequestData;
};
const logInRequest = (data: LoginRequestData): LogInRequestAction => {
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};

export type LogInSuccessData = {
  userId: number;
  nickname: string;
};
export type LogInSuccessAction = {
  type: "LOG_IN_SUCCESS";
  data: LogInSuccessData;
};

const logInSuccess = (data: LogInSuccessData): LogInSuccessAction => {
  return {
    type: "LOG_IN_SUCCESS",
    data,
  };
};

const logInFailure = (error: unknown) => {
  return {
    type: "LOG_IN_FAILURE",
    error,
  };
};

export type LogoutAction = {
  type: "LOG_OUT";
};
export const logOut = (): LogoutAction => {
  return {
    // action
    type: "LOG_OUT",
  };
};

export default {
  logIn,
  logOut,
};
