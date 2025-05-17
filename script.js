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
      }, index * 200); // تأخير تدريجي لكل كرت
    });
  });
  