const apiKey = "87f0f704d59de0464ec36d9eb088080f";
function fetchWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) return alert('يرجى إدخال اسم المدينة');

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;

  axios.get(url)
    .then(response => {
      const data = response.data;
      const weatherMain = data.weather[0].main.toLowerCase();
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      document.getElementById('weather-info').innerHTML = `
        <img src="${iconUrl}" alt="Weather icon" />
        <p>☁️ <strong>الحالة:</strong> ${data.weather[0].description}</p>
        <p>🌡️ <strong>الحرارة:</strong> ${data.main.temp}°C</p>
        <p>💧 <strong>الرطوبة:</strong> ${data.main.humidity}%</p>
        <p>💨 <strong>الرياح:</strong> ${data.wind.speed} م/ث</p>
      `;

      updateBackgroundAndSound(weatherMain, data.sys.sunrise, data.sys.sunset);
    })
    .catch(error => {
      console.error(error);
      alert('⚠️ تعذر جلب بيانات الطقس. تأكد من اسم المدينة.');
    });
}

// دالة لتحويل الوقت من الـ Unix Timestamp إلى الوقت المحلي
function convertUnixToLocalTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // تحويل إلى ملي ثانية
  return date.getHours();
}

function updateBackgroundAndSound(condition, sunrise, sunset) {
  const currentHour = new Date().getHours(); // الوقت الحالي
  const sunriseHour = convertUnixToLocalTime(sunrise);
  const sunsetHour = convertUnixToLocalTime(sunset);

  const isDayTime = currentHour >= sunriseHour && currentHour < sunsetHour;

  const backgrounds = {
    clear: isDayTime ? 'url(https://images.unsplash.com/photo-1501973801540-537f08ccae7b)' : 'url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0)',
    clouds: isDayTime ? 'url(https://images.unsplash.com/photo-1508711040459-1c8e70db4c48)' : 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9)',
    rain: isDayTime ? 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9)' : 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9)', // نفس الخلفية للريح
    thunderstorm: isDayTime ? 'url(https://images.unsplash.com/photo-1500674425229-f692875b0ab7)' : 'url(https://images.unsplash.com/photo-1500674425229-f692875b0ab7)', // نفس الخلفية للريح
    snow: isDayTime ? 'url(https://images.unsplash.com/photo-1608889175195-f2c41e99a626)' : 'url(https://images.unsplash.com/photo-1608889175195-f2c41e99a626)', // نفس الخلفية
  };

  for (const key in backgrounds) {
    if (condition.includes(key)) {
      document.body.style.backgroundImage = backgrounds[key];
      break;
    }
  }

  playSound(condition, isDayTime);
}

function playSound(condition, isDayTime) {
  const sounds = {
    clear: isDayTime ? 'sunny' : 'wind',
    clouds: isDayTime ? 'wind' : 'wind',
    rain: 'rain',
    thunderstorm: 'thunder',
    snow: 'wind',
  };

  // إيقاف جميع الأصوات
  Object.values(sounds).forEach(id => {
    const audio = document.getElementById(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  for (const key in sounds) {
    if (condition.includes(key)) {
      const audio = document.getElementById(sounds[key]);
      if (audio) audio.play();
      break;
    }
  }
}

document.getElementById('weather-btn').addEventListener('click', fetchWeather);