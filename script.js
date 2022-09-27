let apikey = "2414cbc4fc443346154c1ec2cce53087";
let api;
const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-text"),
  inputField = inputPart.querySelector(".inputField"),
  wIcon = document.querySelector(".weather-part img"),
  locationBtn = inputPart.querySelector("#getCurrentLocation");

inputField.addEventListener("keyup", (e) => {
  if ((e.keyCode == 13) & (inputField.value != "")) {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    //if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser not support geolocation api");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
  fetchData();
}
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} is not valid city name`;
    infoTxt.classList.replace("pending", "error");
  } else {
    console.log(info);

    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;
    // change icoon
    if (id == 800) {
      wIcon.src = "images/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "images/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "images/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "images/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "images/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "images/rain.svg";
    }
    //
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    document.querySelector("#description").innerText = description;
    wrapper.querySelector(".location").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp  .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span.numb").innerText = `${humidity} %`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    backFormInput();
  }
}

function backFormInput() {
  btnBack = document.getElementById("back");
  btnBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
  });
}
