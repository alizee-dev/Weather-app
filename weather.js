// to fix :
// comment afficher les datas pertinentes? En itérant sur la liste, les données par jour s'écrasent jusqu'a la derniere. L'affichage de la description et de l'icone ne correspond qu'a la derniere donnée du jour j'imagine?
// les minimums et max en fin de journée sont presqu'égaux car trop peu de datas pour établir une prévision fiable
// j'ai oublié mes .catch((error) =>'

/* The Mission
You have been sent abroad for a 10-month work mission. 
Your family and friends back home ask you about the weather where you live ALL. THE. TIME.
Enough is enough, you decide to build a small web application for them so that you can free your time to talk about more interesting topics.

Specifications
🌱 Must haves

In the home page the user can enter the city of his/her choice (think of the right HTML elements here)
On clicking the SUBMIT button or pressing ENTER the application will display the weather for the next 5 days
The application must be responsive and mobile friendly */

//////////////////////////////////////////////// FONCTIONS UTILES ///////////////////////////////

const getIconUrl = (iconCode) => {
  return "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
};

const convertTimeStamp = (timeStamp) => {
  let date = new Date(timeStamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "long",
    weekday: "long",
    year: "numeric",
    day: "numeric",
  });
};

// console.log(convertTimeStamp(1688223600));

const mean = (array) => {
  let sum = 0;
  let result = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  result = sum / array.length;
  return result;
};

const CalculMinTemperatures = (array) => {
  let min = array[0];
  for (i = 0; i < array.length; i++) {
    if (array[i] < min) {
      min = array[i];
    }
  }
  return min;
};
// min temperatue over 5 days

//problème : pour j === dataList.length n'est pas pris en compte. A la dernière itération, des données sont exclues de dailyTemp et donc min temp
const minTemperature = (dataList) => {
  let dailyTemp = [];
  let minTemp = [];

  for (let j = 0; j < dataList.length - 1; j++) {
    let day = convertTimeStamp(dataList[j].dt).slice(0, 2);
    if (day != convertTimeStamp(dataList[j + 1].dt).slice(0, 2)) {
      dailyTemp.push(dataList[j].main.temp);
      minTemp.push(CalculMinTemperatures(dailyTemp));
      dailyTemp = [];
    } else {
      dailyTemp.push(dataList[j].main.temp);
    }
  }
  return minTemp;
};

// const minTemperature = (dataList) => {
//   let dailyTemp = [];
//   let minTemp = [];

//   for (let j = 0; j < dataList.length; j++) {
//     let day = convertTimeStamp(dataList[j].dt).slice(0, 2);
//     if (
//       day != convertTimeStamp(dataList[j + 1].dt).slice(0, 2) ||
//       j === dataList.length - 1
//     ) {
//       dailyTemp.push(dataList[j].main.temp);
//       minTemp.push(CalculMinTemperatures(dailyTemp));
//       dailyTemp = [];
//     } else {
//       dailyTemp.push(dataList[j].main.temp);
//     }
//   }
//   return minTemp;
// };

const calculMaxTemperatures = (array) => {
  let max = array[0]; /// il faudrait en faire une focn
  for (i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }
  return max;
};
// min temperatue over 5 days

const maxTemperature = (dataList) => {
  let dailyTemp = [];
  let maxTemp = [];

  for (let j = 0; j < dataList.length - 1; j++) {
    let day = convertTimeStamp(dataList[j].dt).slice(0, 2);
    if (day != convertTimeStamp(dataList[j + 1].dt).slice(0, 2)) {
      dailyTemp.push(dataList[j].main.temp);
      maxTemp.push(calculMaxTemperatures(dailyTemp));
      dailyTemp = [];
    } else {
      dailyTemp.push(dataList[j].main.temp);
    }
  }
  return maxTemp;
};

// pour appliquer cette fonction à une autre donnée ilfaut
// changer dataList[j].main.temp avec la donnée ciblée dataList[j].main.humidity
//=> la fonction renvoie un table de 5 éléments avec les moyennes des données fournies
const meanTempPerDay = (dataList) => {
  let temptab = [];
  let DaysMeanTemp = [];
  for (let j = 0; j < dataList.length - 1; j++) {
    let day = convertTimeStamp(dataList[j].dt).slice(0, 2);
    if (day != convertTimeStamp(dataList[j + 1].dt).slice(0, 2)) {
      temptab.push(dataList[j].main.temp);
      DaysMeanTemp.push(mean(temptab));
      temptab = [];
    } else {
      temptab.push(dataList[j].main.temp);
    }
  }
  return DaysMeanTemp;
};

const removeCityCardDef = () => {
  cityCardDef = document.getElementById("cityCardDef");
  cityCardDef.remove();
};

// const removeOldCity = () => {
//   oldCity = document.querySelector(".oldCity");
//   oldCity.remove();
// };

/////////////////////////////////////////////////// CODE ////////////////////////////////////////

/////////////Ville par defaut/////////////////////////
var myKey = config.Key_openWeather;

fetch(
  `http://api.openweathermap.org/geo/1.0/direct?q=Brussels&limit=1&appid=` +
    myKey
)
  .then((response) => response.json())
  .then((data) => {
    const lat = data[0].lat;
    const long = data[0].lon;
    // console.log(data);
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=` +
        myKey
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const day = {};
        day.name = "Brussels";
        day.dateTime = new Date(data.list[0].dt * 1000);
        day.description = data.list[0].weather[0].description;
        day.temperature = Math.round(data.list[0].main.temp);
        // temperatures a modifier

        const cityNameDef = document.getElementById("cityNameDef");
        cityNameDef.innerText = day.name;

        const dateDef = document.getElementById("dateDef");
        dateDef.innerText = day.dateTime.toLocaleString("en-US", {
          month: "long",
          weekday: "long",
          year: "numeric",
          day: "numeric",
        });

        const tempDef = document.getElementById("tempDef");
        tempDef.innerText = day.temperature + "°c";

        const descriptionDef = document.getElementById("descriptionDef");
        descriptionDef.innerText = day.description;

        const iconDef = document.getElementById("iconDef");
        iconDef.src =
          "https://openweathermap.org/img/wn/" +
          data.list[0].weather[0].icon +
          "@2x.png";
      });
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors de la récupération des coordonnées géographiques pour Bruxelles:",
      error
    );
  });

/// EventListeners, clean la page (pour pouvoir afficher les données de la ville entrée, sans conflit)+ extraction des données météo  ///

const inputDef = document.getElementById("inputDef");
const input = document.getElementById("searchField");
const cityCard = document.getElementById("cityCard");

inputDef.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchWeatherData();
    input.style.display = "block";
    cityCard.style.display = "block";
  }
});

/////////////Ville entrée dans la barre de recherche/////////////////////////
const fetchWeatherData = () => {
  setTimeout(removeCityCardDef, 500);

  const key_unsplash = config.key_Unsplash;

  let input = document.querySelector(".input");
  let city = input.value;

  fetch(
    "https://api.unsplash.com/photos/random/?client_id=" +
      key_unsplash +
      `&query=${city}`
  )
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      const body = document.querySelector("body");
      body.style.backgroundImage = `url(${data.urls.regular})`;
      body.classList.toggle("styleBody");
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des images pour la ville recherchée:",
        error
      );
    });

  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=` +
      myKey
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        // console.log(data);
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=` +
            myKey
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            console.log(data.list);

            const days = [];

            // Avec le "data.list.length -1", on exclue les datas de la derniere liste ---------> bugs avant minuit : plus que 4 jours. Nécessité de tout push si les dates sont différentes OU si on est arrivé à la fin des datas.
            // for (let i = 0; i < data.list.length -1; i++) {
            //   let currentDay = convertTimeStamp(data.list[i].dt).slice(0, 2);
            //   let nextDay = convertTimeStamp(data.list[i + 1].dt).slice(0, 2);

            //   if (currentDay !== nextDay) {

            for (let i = 0; i < data.list.length-1; i++) {
              // -------------------------------> bug apres minuit : 6 jours en console.log (7p, 4*8p, 1p) (6p, 3*8, 2) (5p, 4*8, 3)
              let currentDay = convertTimeStamp(data.list[i].dt).slice(0, 2);
              let nextDay = convertTimeStamp(data.list[i + 1]?.dt).slice(0, 2);

              if (currentDay !== nextDay || i === data.list.length - 1) {
                let dayOfWeek = getDayOfWeek(data.list[i].dt);
                let description = data.list[i].weather[0].description;

                days.push({
                  nameDay: dayOfWeek,
                  description: description,
                  icon:
                    "https://openweathermap.org/img/wn/" +
                    data.list[i].weather[0].icon +
                    "@2x.png",
                });
              }
            }

            function getDayOfWeek(timestamp) {
              const date = new Date(timestamp * 1000);
              const options = { weekday: "long" };
              return date.toLocaleDateString("en-US", options);
            }

            console.log(days);
            // console.log(meanTempPerDay(data.list));
            console.log(minTemperature(data.list));
            console.log(maxTemperature(data.list));

            days.forEach((day, index) => {
              day.min = Math.round(minTemperature(data.list)[index]);
              day.max = Math.round(maxTemperature(data.list)[index]);
            });

            let city = document.getElementById("cityName");
            city.innerText = input.value;
            city.style.textTransform = "capitalize";

            let date = document.getElementById("date");
            date.innerText = new Date(data.list[0].dt * 1000).toLocaleString(
              "en-US",
              {
                month: "long",
                weekday: "long",
                year: "numeric",
                day: "numeric",
              }
            );

            let temp = document.getElementById("temp");
            temp.innerText = Math.round(data.list[0].main.temp) + "°c";

            let description = document.getElementById("description");
            description.innerText = data.list[0].weather[0].description;

            let icon = document.getElementById("icon");
            icon.src =
              "https://openweathermap.org/img/wn/" +
              data.list[0].weather[0].icon +
              "@2x.png";

            // const min = document.getElementById("min");
            // min.innerText = Math.round(minTemperature(data.list)[0]);

            // const max = document.getElementById("max");
            // max.innerText = Math.round(maxTemperature(data.list)[0]);

            const minMax = document.getElementById("minMax");
            minMax.innerText =
              Math.round(minTemperature(data.list)[0]) +
              "/" +
              Math.round(maxTemperature(data.list)[0]) +
              "°c";

            const forecastWind = document.getElementById("wind");
            forecastWind.innerText = data.list[0].wind.speed + " m/s";

            const humidity = document.getElementById("humidity");
            humidity.innerText = data.list[0].main.humidity + " %";

            const visibility = document.getElementById("visibility");
            visibility.innerText = data.list[0].visibility / 1000 + " km";

            const createForecasts = (forecast) => {
              const forecasts = document.getElementById("forecasts");
              const dailyForecast = document.createElement("div");
              dailyForecast.setAttribute("class", "dailyForecast");

              const dayNameForecast = document.createElement("p");
              dayNameForecast.id = "dayNameForecast";
              dayNameForecast.innerText = forecast.nameDay;

              const iconForecast = document.createElement("img");
              iconForecast.id = "iconForecast";
              iconForecast.src = forecast.icon;

              const tempForecast = document.createElement("div");
              tempForecast.id = "tempForecast";

              const minMaxForecast = document.createElement("p");
              minMaxForecast.id = "minMaxForecast";
              minMaxForecast.innerText =
                forecast.min + "/" + forecast.max + "°c";

              // const minForecast = document.createElement("p");
              // minForecast.id = "minForecast";
              // minForecast.innerText = forecast.min;

              // const maxForecast = document.createElement("p");
              // maxForecast.id = "maxForecast";
              // maxForecast.innerText = forecast.max;

              // tempForecast.appendChild(minForecast);
              // tempForecast.appendChild(maxForecast);

              tempForecast.appendChild(minMaxForecast);

              dailyForecast.append(dayNameForecast);
              dailyForecast.append(iconForecast);
              dailyForecast.append(tempForecast);

              forecasts.append(dailyForecast);
            };

            days.slice(1).forEach((forecast) => {
              createForecasts(forecast);
            });
          });
      }
    });

  // const inputDef = document.getElementById("inputDef")
  // inputDef.classList.toggle("input")
  const searchInput = document.querySelector("#input");
  searchInput.classList.toggle("input");

  const submit = document.querySelector("#submit");
  submit.classList.toggle("submit");
};

const submitBtn = document.querySelector("#submitDef");
submitBtn.addEventListener("click", () => {
  fetchWeatherData();
  input.style.display = "block";
  cityCard.style.display = "block";
});

// // const submit = document.querySelector("#submit");
// submit.addEventListener("click", () => {
//   cityCard.classList.toggle("oldCity")
//   setTimeout(removeOldCity(), 500)
//   fetchWeatherData();
//   // input.style.display = "block";
//   // cityCard.style.display = "block";
// })

let unsplashKey = config.key_Unsplash;
let unsplashUrl =
  "https://api.unsplash.com/photos/random/?client_id=" +
  unsplashKey +
  "&query=Bruxelles";

const body = document.querySelector("body");
let background = document.createElement("img");
body.append(background);

fetch(unsplashUrl)
  .then((response) => response.json())
  .then((data) => {
    // console.log(data)
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors de la récupération des images :",
      error
    );
  });

///////////////////////////////////////////////////////////////////////////// APPRENTISSAGES ///////////////////////////////////////

// 1. Créer des fonctions pour alléger le code principal
// 2. SelectByClassName ----------------> collection HTML : impossible d'itérer dessus avec un forEach.
//    QuerySelectorAll  ----------------> NodeList donc ok pour le forEach
//    EXEMPLE :
//      inputs.forEach((input) => {
//        input.addEventListener("keypress", (event) => {
//          if (event.key === "Enter") {
//            fetchWeatherData();
//          }
//        });
//      });
// 3. json viewer extension

// ////////////////////////////////////////////////////////////////////////// SOURCES ///////////////////////////////////////////////////////////////////////////////////////////////////////////

//  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//  https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey} --> non
//  api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key} ---> ok mais nécessite une autre api pour fetch les min et max
//  json viewer extension
//  tuto css : https://www.youtube.com/watch?v=WZNG8UomjSI
//  tuto random picture unsplash : https://www.youtube.com/watch?v=e8p1zSNmK7Q
//  idées de petites apps à réaliser https://github.com/AsmrProg-YT/100-days-of-javascript/tree/master/Day%20%2310%20-%20Weather%20App
//  how to hide apiKey : https://medium.com/@oreillyalan88/how-to-hide-api-keys-from-github-7a14d1bf80c
