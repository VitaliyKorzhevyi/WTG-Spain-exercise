//* -------- Отримую значенння з JSON ------
$.ajax({
  url: "./json/cities.json",
  dataType: "json",
  success: function (data) {
    $(".city-select").select2({
      data: data.cities.map((city) => ({ id: city.id, text: city.name })),
    });
  },
});

$.ajax({
  url: "./json/types.json",
  dataType: "json",
  success: function (data) {
    $(".type-select").select2({
      data: data.houseTypes.map((type) => ({ id: type.id, text: type.name })),
    });
  },
});

//* -------- За кліком на кнопку додаю рядок ------
const addButton = document.querySelector("#add-row-button");
const tableBody = document.querySelector("tbody");
let rowCount = 1;

addButton.addEventListener("click", () => {
  const newRowHtml = `
    <tr>
      <td>${rowCount++}</td>
      <td><input type="text" name="id" /></td>
      <td><input type="number" name="price" /></td>
      <td>
        <select class="js-data-example-ajax city-select" name="city" style="width: 120px">
        </select>
      </td>
      <td>
        <select class="js-data-example-ajax type-select" name="type" style="width: 120px">
        </select>
      </td>
      <td>
        <button>Copy</button>
        <button class="delete-button">Delete</button>
      </td>
    </tr>
  `;

  tableBody.insertAdjacentHTML("beforeend", newRowHtml);

  const lastRow = tableBody.lastElementChild;
  const citySelect = lastRow.querySelector(".city-select");
  const typeSelect = lastRow.querySelector(".type-select");

  $.ajax({
    url: "./json/cities.json",
    dataType: "json",
    success: function (data) {
      $(citySelect).select2({
        data: data.cities.map((city) => ({ id: city.id, text: city.name })),
      });
    },
  });

  $.ajax({
    url: "./json/types.json",
    dataType: "json",
    success: function (data) {
      $(typeSelect).select2({
        data: data.houseTypes.map((type) => ({ id: type.id, text: type.name })),
      });
    },
  });
});

// Оновлюю номера
function deleteRow(row) {
  row.parentNode.removeChild(row);
  const rows = tableBody.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].querySelector("td:first-child").textContent = i + 1;
  }
}

tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-button")) {
    const row = target.parentNode.parentNode;
    deleteRow(row);
  }
});

// Price

tableBody.addEventListener("change", (event) => {
  const target = event.target;
  
  if (target.name === "price" && target.closest(".all-price") !== null) {
    
    const confirmed = confirm("Чи впевнені ви, що хочете відредагувати усі значення стовбця?");
    
    if (confirmed) {
      const allRows = tableBody.querySelectorAll("tr");
      for (let i = 0; i < allRows.length; i++) {
        const row = allRows[i];
        if (row.querySelector("td:first-child").textContent !== "All") {
          const input = row.querySelector('input[name="price"]');
          if (input.closest(".all-price") === null) {
            input.value = target.value;
          }
        }
      }
      target.closest(".all-price").value = "";
    
    } else {
    
      for (let i = 0; i < allRows.length; i++) {
    
        const row = allRows[i];
        if (row.querySelector("td:first-child").textContent !== "All") {
          const input = row.querySelector('input[name="price"]');
          input.value = input.getAttribute("data-previous-value");
        }
      }
    }
    target.closest(".all-price").value = "";
  } else if (target.name === "price") {
    target.setAttribute("data-previous-value", target.value);    
  }
});

// CITY



//* -------- Дії викликані по кнопці  "Copy" ------
tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-button")) {
  const row = target.parentNode.parentNode;
  deleteRow(row);
  } else if (target.tagName === "BUTTON" && target.textContent === "Copy") {
  const rowToCopy = target.parentNode.parentNode;
  const newRow = rowToCopy.cloneNode(true);  
 
  newRow.querySelector("td:nth-child(2) input").value = "";

  tableBody.appendChild(newRow);

  const rows = tableBody.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].querySelector("td:first-child").textContent = i + 1;
  }
}
});


// ------------------------

// tableBody.addEventListener("change", (event) => {
//   const target = event.target;
  
//   // Проверяем, что был изменен список городов в строке All
//   if (target.classList.contains("city-select") && target.closest("tr").querySelector("td:first-child").getAttribute("value") === "all") {
    
//     // Проверяем выбранную опцию
//     if (target.value !== "city") {
//       // Вызываем модальное окно с подтверждением
//       const confirmed = confirm("Are you sure you want to change the value in the entire column?");
      
//       if (!confirmed) {
//         // Если пользователь отказался от изменения, возвращаем предыдущее значение списка
//         const previousValue = target.getAttribute("data-previous-value");
//         target.value = previousValue;
//         return;
//       }
//     }
    
//     // Сохраняем выбранное значение для последующей проверки
//     target.setAttribute("data-previous-value", target.value);
//   }
// });