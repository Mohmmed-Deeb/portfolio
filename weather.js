const apiKey = "87f0f704d59de0464ec36d9eb088080f"; // استبدل بـ API Key الخاص بك

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

      document.getElementById('weatherResult').innerHTML = `
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

function convertUnixToLocalTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.getHours();
}

function updateBackgroundAndSound(condition, sunrise, sunset) {
  const currentHour = new Date().getHours();
  const sunriseHour = convertUnixToLocalTime(sunrise);
  const sunsetHour = convertUnixToLocalTime(sunset);
  const isDayTime = currentHour >= sunriseHour && currentHour < sunsetHour;

  const backgrounds = {
    clear: isDayTime
      ? 'url(https://images.unsplash.com/photo-1501973801540-537f08ccae7b)'
      : 'url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0)',
    clouds: isDayTime
      ? 'url(https://images.unsplash.com/photo-1508711040459-1c8e70db4c48)'
      : 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9)',
    rain: 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9)',
    thunderstorm: 'url(https://images.unsplash.com/photo-1500674425229-f692875b0ab7)',
    snow: 'url(https://images.unsplash.com/photo-1608889175195-f2c41e99a626)',
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
    clouds: 'wind',
    rain: 'rain',
    thunderstorm: 'thunder',
    snow: 'wind',
  };

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


// دالة لعرض التاريخ بشكل تلقائي
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long', // الجمعة
    year: 'numeric',
    month: 'long',   // مايو
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const dateString = now.toLocaleDateString('EG', options);
  const timeString = now.toLocaleTimeString('EG', { hour: '2-digit', minute: '2-digit', hour12: false });

  const fullString = `${dateString} - 🕒 ${timeString}`;

  const dateElement = document.getElementById('today-date');
  if (dateElement) {
    dateElement.textContent = fullString;
  }
}

// استدعاء الدالة عند تحميل الصفحة + تحديث كل دقيقة
document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 60000); // يحدث كل دقيقة
});

function updateDateTime() {
  const now = new Date();

  // التاريخ
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const dateString = now.toLocaleDateString('ar-EG', options);

  // الوقت
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  // عرض التاريخ
  const dateElement = document.getElementById('today-date');
  if (dateElement) {
    dateElement.textContent = dateString;
  }

  // عرض الساعة الرقمية
  const clockElement = document.getElementById('digital-clock');
  if (clockElement) {
    clockElement.textContent = timeString;
  }
}

// تشغيلها عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 60000); // تحديث كل دقيقة
});
