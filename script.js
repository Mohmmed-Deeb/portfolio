
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

// ===============================================================================================


// خاص ملف المدرسة 

window.onload = loadData;

// الزر اليدوي
// document.getElementById("manualForm").addEventListener("submit", function (e) {
//   e.preventDefault();
//   const formData = new FormData(this);
//   const row = [];
//   for (const value of formData.values()) row.push(value);
//   addRow(row);
//   saveData();
//   document.getElementById("approveButton").style.display = "inline-block"; // ⬅️ إظهار زر الاعتماد
//   this.reset();
//   closeModal();

// });

// فتح المودال عند الضغط على زر "إدخال يدوي"
document.getElementById("openModalBtn").addEventListener("click", function () {
  document.getElementById("manualModal").style.display = "block";
});

// إغلاق المودال عند الضغط على زر ×
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("manualModal").style.display = "none";
});

// إغلاق المودال عند الضغط خارج النافذة
window.addEventListener("click", function (e) {
  if (e.target === document.getElementById("manualModal")) {
    document.getElementById("manualModal").style.display = "none";
  }
});

// عند إرسال النموذج اليدوي
document.getElementById("manualForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const row = [];

  // تحويل البيانات إلى مصفوفة مرتبة بنفس ترتيب الأعمدة
  for (const value of formData.values()) {
    row.push(value || "aa"); // إذا فاضي حط "aa"
  }

  // إضافة الصف إلى الجدول
  const table = document.getElementById("dataTable").querySelector("tbody");
  const tr = document.createElement("tr");
  row.forEach((val) => {
    const td = document.createElement("td");
    td.textContent = val;
    tr.appendChild(td);
  });
  table.appendChild(tr);

  // حفظ البيانات إلى localStorage
  const allData = JSON.parse(localStorage.getItem("schoolData") || "[]");
  allData.push(row);
  localStorage.setItem("schoolData", JSON.stringify(allData));

  // إعادة تعيين النموذج وإغلاق المودال
  this.reset();
  document.getElementById("manualModal").style.display = "none";
});


function addRow(data) {
  const table = document.getElementById("dataTable").querySelector("tbody");
  const row = document.createElement("tr");
  data.forEach((val) => {
    const cell = document.createElement("td");
    cell.textContent = val || "aa"; // تعبئة الخلايا الفارغة
    row.appendChild(cell);
  });

  document.getElementById("openModalBtn").addEventListener("click", function () {
  document.getElementById("manualModal").style.display = "block";
});


  // زر حذف مخصص
  const deleteCell = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => {
    row.remove();
    saveData();
  };
  deleteCell.appendChild(deleteBtn);
  row.appendChild(deleteCell);

  table.appendChild(row);
  // document.getElementById("saveDataBtn").style.display = "inline-block";  يجعل زر الاعتماد ظاهر دائما 
}

function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveData() {
  const rows = document.querySelectorAll("#dataTable tbody tr");
  const allData = Array.from(rows).map((row) =>
    Array.from(row.children).slice(0, 21).map((cell) => cell.textContent)
  );
  localStorage.setItem("schoolData", JSON.stringify(allData));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("schoolData") || "[]");
  data.forEach((row) => addRow(row));
}



// رفع ملف Excel
document.getElementById("excelUpload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 2) {
      alert("الملف لا يحتوي على بيانات");
      return;
    }

    rows.slice(1).forEach((row) => {
      const fullRow = new Array(21).fill("0"); // 21 عمودًا
      row.forEach((cell, i) => {
        fullRow[i] = cell ? String(cell) : "0";
      });
      addRow(fullRow);
    });

    saveData();
    document.getElementById("saveDataBtn").style.display = "inline-block";
    alert("✅ تم رفع الملف بنجاح!");
  };
  reader.readAsArrayBuffer(file);
});



// دالة حفظ البيانات واعتمادها

document.getElementById("saveDataBtn").addEventListener("click", () => {
  saveData();
  alert("✅ تم اعتماد البيانات وحفظها!");
  document.getElementById("saveDataBtn").style.display = "none"; // ✅ إخفاء الزر بعد الاعتماد
});

// حذف جميع البينات
function clearAllData() {
  if (confirm("هل أنت متأكد من حذف جميع البيانات؟")) {
    localStorage.removeItem("schoolData");
    document.querySelector("#dataTable tbody").innerHTML = "";
    document.getElementById("saveDataBtn").style.display = "none";
  }
}

// تصدير ملف إكسل
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [];

  const headers = Array.from(document.querySelectorAll("#dataTable thead th")).map((th) => th.textContent);
  ws_data.push(headers.slice(0, 21)); // بدون عمود الحذف

  const rows = document.querySelectorAll("#dataTable tbody tr");
  rows.forEach((row) => {
    const rowData = Array.from(row.children).slice(0, 21).map((cell) => cell.textContent);
    ws_data.push(rowData);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "البيانات");
  XLSX.writeFile(wb, "school_data.xlsx");
}

// تصدير ملف PDF



(function () {
  const font = `
AAEAAAAPAIAAAwBwR1NVQ0EAAAAAgAAAAYAAAAYGNtYXAAAwAAAAEAAAAXZ2x5ZgAAAAEAAAAB
AAAAJGhlYWQAAAEAAAAAMAAAADZoaGVhAAACAAAAAQAAAAkaG10eAAABAAAAAEAAAAMa2VybgAA
BQAAAAgAAAAUCm1heHAAAPgAAAAgAAAAgbmFtZQAA+AAAAAQAAAAk3nBvc3QAAD4AAAAHAAAAIAAA
AAEAAAABAQAAAAAAAAABAAAD6P//AAD6////AAAABAAAAAAAAAAAAAAAAAAAAP//AAEAAAABAAAA
AAAAAAAAAAAAAAAAAAEAAAABAQAAAAAAAAAFAAAAAQAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
  `.replace(/\s+/g, '');

  window.jspdf.jsPDF.API.events.push([
    'addFonts',
    function () {
      this.addFileToVFS('Amiri-Regular.ttf', font);
      this.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    },
  ]);
})();

async function exportToPDF() {
  const { jsPDF } = window.jspdf;

  // إنشاء ملف PDF بالعرض
  const doc = new jsPDF({ orientation: "landscape" });

  // تفعيل الخط العربي "Amiri"
  doc.setFont("Amiri");
  doc.setFontSize(12);

  // تفعيل دعم اللغة العربية واتجاه RTL
  if (doc.useArabic) {
    doc.useArabic(); // من مكتبة jspdf-arabic
  }

  let y = 10;

  // العنوان الرئيسي
  doc.text("نموذج الإحصاء المدرسي", 280 / 2, y, {
    align: "center",
  });
  y += 10;

  // قراءة رؤوس الجدول
  const headers = Array.from(document.querySelectorAll("#dataTable thead th"))
    .map((th) => th.textContent.trim())
    .slice(0, 21);

  // قراءة الصفوف
  const rows = Array.from(document.querySelectorAll("#dataTable tbody tr")).map((row) =>
    Array.from(row.children).slice(0, 21).map((cell) => cell.textContent.trim())
  );

  const colWidth = 280 / headers.length;
  doc.setFontSize(6);

  // كتابة رؤوس الأعمدة
  headers.forEach((h, i) => {
    doc.text(h, 10 + i * colWidth, y, { align: "right" });
  });

  y += 5;

  // كتابة البيانات
  rows.forEach((row) => {
    row.forEach((cell, i) => {
      doc.text(cell || "ـ", 10 + i * colWidth, y, { align: "right" });
    });
    y += 5;
    if (y > 190) {
      doc.addPage();
      y = 10;
    }
  });

  y += 10;
  doc.setFontSize(10);
  doc.text("توقيع المدير: أبو الطارق", 270, y, { align: "right" });

  // حفظ الملف
  doc.save("school_data.pdf");
}

// خاص دالة البحث

// فتح مودال البحث
document.getElementById("openSearchModalBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  // في حال كان حقل البحث فارغا
    if (query === "") {
    // عرض مودال تنبيهي
    Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "📌 يجب الكتابة في مربع البحث أولاً",
      confirmButtonText: "حسنًا",
      confirmButtonColor: "#3085d6"
    });
    return;
  }
  const allData = JSON.parse(localStorage.getItem("schoolData") || "[]");

  // فلترة النتائج بناءً على الاسم أو رقم الهوية
  const results = allData.filter(
    (row) =>
      (row[1] && row[1].toLowerCase().includes(query)) || // الاسم
      (row[4] && row[4].toLowerCase().includes(query)) || // الاسم
      (row[2] && row[2].toString().includes(query))   ||    // رقم الهوية
      (row[3] && row[3].toString().includes(query))       // رقم الهوية
  );

  const tableBody = document.querySelector("#searchResultsTable tbody");
  tableBody.innerHTML = "";

  if (results.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;">🚫 لا توجد نتائج</td></tr>`;
  } else {
    // تقسيم النتائج حسب الشعبة
    const groups = { "الشمالية": [], "الوسطى": [], "الجنوبية": [], "غير محددة": [] };

    results.forEach((row, index) => {
      const shoba = row[3] ? row[3].trim() : "غير محددة";
      if (!groups[shoba]) {
        groups[shoba] = [];
      }
      groups[shoba]
      .push({ index, row });
    });

      let globalIndex = 1; // هذا لتسلسل النتائج كرقم عام


    // عرض النتائج لكل شعبة
    for (let shoba in groups) {
      if (groups[shoba].length > 0) {
        const headerRow = document.createElement("tr");

        headerRow.innerHTML = ``;
        tableBody.appendChild(headerRow);

        groups[shoba].forEach((item) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${globalIndex}</td>
            <td>${item.row[0] || ""}</td>
            <td>${item.row[1] || ""}</td>
            <td>${item.row[2] || ""}</td>
            <td>${item.row[3] || ""}</td>
            <td>${item.row[4] || ""}</td>
            <td>${item.row[16] || ""}</td>
            <td>${item.row[18] || ""}</td>
            <td>${item.row[19] || ""}</td>
            <td>${item.row[20] || ""}</td>
          `;
          tableBody.appendChild(tr);
          globalIndex++; // زد العداد

        });
      }
    }


    
    // عدد النتائج
    const countRow = document.createElement("tr");
    countRow.innerHTML = `<td colspan="10" style="text-align:right; font-weight:bold; padding-top: 10px;">🔢 عدد النتائج: ${results.length}</td>`;
    tableBody.appendChild(countRow);
  }

  document.getElementById("searchModal").style.display = "block";
});



// إغلاق مودال البحث
document.getElementById("closeSearchModal").addEventListener("click", () => {
  document.getElementById("searchModal").style.display = "none";
});

// دالة البحث
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const data = JSON.parse(localStorage.getItem("schoolData") || "[]");

  // نفلتر الصفوف حسب الاسم أو رقم الهوية أو رقم الجوال
  const filtered = data.filter((row) => {
    const name = (row[1] || "").toString().toLowerCase();     // الاسم
    const id = (row[2] || "").toString().toLowerCase();       // رقم الهوية
    const phone = (row[3] || "").toString().toLowerCase();    // رقم الجوال
    return (
      name.includes(query) ||
      id.includes(query) ||
      phone.includes(query)
    );
  });

filtered.sort((a, b) => {
  const valA = parseInt(a[0]) || 0;
  const valB = parseInt(b[0]) || 0;
  return valA - valB;
});
 

  if (filtered.length === 0) {
    resultsTable.innerHTML = `<tr><td colspan="9" style="text-align:center;">لا توجد نتائج</td></tr>`;
    return;
  }

// عرض النتائج داخل جدول البحث


  // عرض النتائج


  filtered.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>       <!-- المسلسل -->
      <td>${row[0] || "aa"}</td>  <!-- الترقيم -->
      <td>${row[1] || "aa"}</td>  <!-- الاسم -->
      <td>${row[2] || "aa"}</td>  <!-- رقم الهوية -->
      <td>${row[3] || "aa"}</td>  <!-- رقم الجوال -->
      <td>${row[4] || "aa"}</td>  <!--  اسم الشريك -->
      <td>${row[15] || "aa"}</td>  <!--  الحالة الاجتماعية -->
      <td>${row[18] || "aa"}</td>  <!--  اسم المندوب -->
      <td>${row[20] || "aa"}</td>  <!--  الشعبة -->
    `;
    resultsTable.appendChild(tr);
  });
});

// دالة طباعة النتائج 


function printSearchResults() {
  const content = document.getElementById("searchResultsTable").outerHTML;
  const printWindow = window.open("", "", "width=1000,height=700");
  printWindow.document.write(`
    <html dir="rtl">
      <head>
        <title>طباعة نتائج البحث</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #3498db; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center;">نتائج البحث</h2>
        ${content}
        <p style="margin-top: 30px; text-align: left;">توقيع الإدارة: أبو الطارق</p>
        <script>
          window.onload = function () {
            window.print();
            window.onafterprint = function () {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
}

// اخفاء زر اعتماد البيانات
document.getElementById("approveButton").style.display = "none";



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++