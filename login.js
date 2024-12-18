const kakaoLoginButton = document.querySelector("#kakao");
const naverLoginButton = document.querySelector("#naver");
const userImage = document.querySelector("img");
const userName = document.querySelector("#user_name");
const logoutButton = document.querySelector("#logout_button");

let currentOAuthService = "";

const kakaoClientId = "	720d388faa8a5663493aa81b2f574bdd";
const redirectURI = "http://127.0.0.1:5500";
let kakaoAccessToken = "";

const naverClientId = "OF4S3OAn6DAWo0KJ4sVF";
const naverClientSecret = "7BFMCCyTgX";
const naverSecret = "it_is_me";
let naverAccessToken = "";

function renderUserInfo(imgURL, name) {
  userImage.src = imgURL;
  userName.textContent = name;
}

kakaoLoginButton.onclick = () => {
  location.href = `	https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`;
};

naverLoginButton.onclick = () => {
  //https://nid.naver.com/oauth2.0/authorize?client_id={클라이언트 아이디}&response_type=code&redirect_uri={개발자 센터에 등록한 콜백 URL(URL 인코딩)}&state={상태 토큰}
  location.href = `	https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&response_type=code&redirect_uri=${redirectURI}&state=${naverSecret}}`;
};

window.onload = () => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const authorizationCode = urlParams.get("code");
  const naverState = urlParams.get("state");

  if (authorizationCode) {
    if (naverState) {
      axios
        .post("http://localhost:3000/naver/login", { authorizationCode })
        .then((res) => {
          naverAccessToken = res.data;
          return axios.post("http://localhost:3000/naver/userinfo", {
            naverAccessToken,
          });
        })
        .then((res) => {
          renderUserInfo(res.data.profile_image, res.data.name);
          currentOAuthService = "naver";
        });
    } else {
      axios
        .post("http://localhost:3000/kakao/login", { authorizationCode })
        .then((res) => {
          kakaoAccessToken = res.data;
          return axios.post("http://localhost:3000/kakao/userinfo", {
            kakaoAccessToken,
          });
        })
        .then((res) => {
          renderUserInfo(res.data.profile_image, res.data.nickname);
          currentOAuthService = "kakao";
        });
    }
  }
};

logoutButton.onclick = () => {
  if (currentOAuthService === "kakao") {
    axios
      .delete("http://localhost:3000/kakao/logout", {
        data: { kakaoAccessToken },
      })
      .then((res) => {
        {
          console.log(res.data);
          renderUserInfo("", "");
        }
      });
  } else if (currentOAuthService === "naver") {
    axios
      .delete("http://localhost:3000/naver/logout", {
        data: { naverAccessToken },
      })
      .then((res) => {
        {
          console.log(res.data);
          renderUserInfo("", "");
        }
      });
  }
};
