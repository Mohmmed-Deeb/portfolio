const apiKey = "API_KEY=87f0f704d59de0464ec36d9eb088080f";


function getWeather() {
  const city = document.getElementById("cityInput").value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        document.getElementById("weatherResult").innerHTML = `
          <h2>${data.name}</h2>
          <p>الحرارة: ${data.main.temp}°C</p>
          <p>الوصف: ${data.weather[0].description}</p>
          <p>الرطوبة: ${data.main.humidity}%</p>
        `;
      } else {
        document.getElementById("weatherResult").innerHTML = "المدينة غير صحيحة.";
      }
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      document.getElementById("weatherResult").innerHTML = "حدث خطأ. حاول مرة أخرى.";
    });
}
