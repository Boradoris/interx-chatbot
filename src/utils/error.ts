/* 
  handleError 함수:
  - Axios 오류 객체를 받아 에러 유형에 따라 세분화하여 throw 합니다.
  - 서버에서 에러 응답이 온 경우(error.response), 요청은 했으나 응답이 없을 경우(error.request),
    그리고 요청 설정 중 발생한 기타 에러를 구분합니다.
*/
export const handleError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response;
    const code = data.code;
    const message = data.message || "서버에 문제가 생겼습니다.";

    throw { status, code, message };
  } else {
    throw { status: 500, code: 500, message: "서버와 연결할 수 없습니다." };
  }
};
