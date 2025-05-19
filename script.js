// إضافة تأثير دخول عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");
  
    cards.forEach((card, index) => {
      // نضيف كلاس "مخفي" مؤقتًا
      card.classList.add("hidden");
  
      // بعد وقت تدريجي، نزيل "مخفي" ونضيف "ظاهر"
      setTimeout(() => {
        card.classList.remove("hidden");
        card.classList.add("visible");
      }, index * 300); // تأخير تدريجي لكل كرت
    });
  });
  

// خاص بملف الطقس  


  const apiKey = "YOUR_API_KEY"; // ← ضع مفتاح OpenWeather الخاص بك هنا

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("الرجاء إدخال اسم مدينة");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ar&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById("weatherInfo").innerHTML = `<p>لم يتم العثور على المدينة</p>`;
        return;
      }

      const weatherHtml = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><i class="fas fa-temperature-low"></i> درجة الحرارة: ${data.main.temp}°C</p>
        <p><i class="fas fa-cloud"></i> الطقس: ${data.weather[0].description}</p>
        <p><i class="fas fa-wind"></i> الرياح: ${data.wind.speed} م/ث</p>
      `;

      document.getElementById("weatherInfo").innerHTML = weatherHtml;
    })
    .catch(error => {
      console.error(error);
      document.getElementById("weatherInfo").innerHTML = `<p>حدث خطأ أثناء جلب البيانات</p>`;
    });
}
