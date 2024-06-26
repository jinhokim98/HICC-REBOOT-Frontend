import axios, { AxiosError, AxiosResponse } from 'axios';
import { COOKIE_KEYS, STORE_KEYS } from '@constants/keys';
import ERROR_CODE from '@constants/error';
import { getCookie, removeCookie } from '@utils/cookie';
import ROUTE from '@constants/route';
import BASE_URL from '../config';

// error 형태, 이는 백엔드의 상황을 보고 변경
export interface IError {
  code: string;
  path: string;
  reason: string;
  status: number;
  statusCode: string;
  success: boolean;
  timestamp: string;
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (!config.headers) {
    return config;
  }

  return config;
});

interface AccessToken {
  accessToken: string;
}

interface AccessTokenRefresh {
  data: AccessToken;
}

async function reissue() {
  const refresh = getCookie(COOKIE_KEYS.REFRESH_KEY);

  const response = await axiosInstance.get<AccessTokenRefresh>('/api/auth/refresh', {
    headers: {
      'Authorization-refresh': `Bearer ${refresh}`,
    },
  });

  // 헤더에 access token 자동으로 설정
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.data.accessToken}`;

  // 끊겼던 요청들을 재처리하기위해 access token return
  return response.data.data.accessToken;
}

const getAxiosError = (error: AxiosError): AxiosResponse<IError, any> | undefined => {
  const serverError = error as AxiosError<IError>;
  return serverError.response;
};

let isAlreadyFetchingAccessToken = false;
const subscribers: Array<(token: string) => void> = [];

// 401로 에러난 함수들을 추가하는 함수
const addSubscriber = (callback: (token: string) => void) => {
  subscribers.push(callback);
};

// 액세스 토큰을 정상적으로 들고와서 원 요청을 실행
const onAccessTokenFetched = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers.splice(0);
};

// 인증 에러시 로그아웃 시킴
const removeRefreshAndSignOut = () => {
  removeCookie(COOKIE_KEYS.REFRESH_KEY);
  removeCookie(COOKIE_KEYS.IS_LOGIN);
  // 이전 페이지 저장을 위해
  sessionStorage.setItem(STORE_KEYS.PREV_PAGE, window.location.pathname);
  window.location.replace(ROUTE.LOGIN);
};

const resetTokenAndReattemptRequest = async (error: AxiosResponse<IError, any>) => {
  try {
    const retryOriginRequest = new Promise((resolve, reject) => {
      addSubscriber(async (token: string) => {
        try {
          // eslint-disable-next-line no-param-reassign
          error.config.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(error.config));
        } catch (err) {
          reject(err);
        }
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      // race condition
      isAlreadyFetchingAccessToken = true;
      const access = await reissue();
      isAlreadyFetchingAccessToken = false;

      onAccessTokenFetched(access);
    }

    return retryOriginRequest;
  } catch (newError) {
    removeRefreshAndSignOut();
    alert('로그인 후 이용할 수 있습니다.');
    return Promise.reject(newError);
  }
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const axiosError = getAxiosError(error as AxiosError);

    // 401에러 시 리프레시를 사용해서 토큰 발급 뒤 다시 요청
    if (axiosError?.data.code === ERROR_CODE.ACCESS_EXPIRED) {
      return resetTokenAndReattemptRequest(axiosError);
    }

    // 리프레시 만료 시 로그아웃 처리
    if (axiosError?.data.code === ERROR_CODE.REFRESH_EXPIRED) {
      removeRefreshAndSignOut();
      return Promise.reject(axiosError);
    }

    // 403에러 승인대기자일 때 뒤로가기
    if (axiosError?.data.code === ERROR_CODE.FORBIDDEN_APPLICANT) {
      alert('당신 아직 권한이 없군요. 곧 회장이 일을 할거에요ㅎㅎ');
      window.history.back();
      return Promise.reject(axiosError);
    }

    // 403에러 시 회장의 권한을 체크할 때 뒤로가기
    if (axiosError?.data.code === ERROR_CODE.FORBIDDEN_PRESIDENT) {
      alert('당신 회장이 아니군요. 회장이 아니면 이용할 수 없는 기능이에요.');
      window.history.back();
      return Promise.reject(axiosError);
    }

    // 회원가입 학번 중복일 때 경고창 띄움
    if (axiosError?.data.code === ERROR_CODE.STUDENT_NUMBER_DUPLICATE) {
      alert('이미 가입된 회원입니다.');
      return Promise.reject(axiosError);
    }

    // 500에러 시 경고창 띄우기
    if (axiosError?.data.code === ERROR_CODE.INTERNAL_SERVER_ERROR) {
      alert('일시적인 서버 오류입니다.');
      return Promise.reject(axiosError);
    }

    // 비밀번호 비정상적인 변경일 때 메인페이지로 돌려버리기
    if (axiosError?.data.code === ERROR_CODE.PASSWORD_RESET_NOT_FOUND) {
      alert('비정상적인 비밀번호 변경입니다.');
      window.location.replace('/');
    }

    // 비밀번호 변경에서 이메일이 일치하지 않을 때
    if (axiosError?.data.code === ERROR_CODE.EMAIL_MISMATCH) {
      alert(axiosError?.data.reason);
    }

    return Promise.reject(error);
  },
);
