// Отримую значенння з JSON
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

// за кліком на кнопку додаю рядок
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

tableBody.addEventListener("change", (event) => {
    const target = event.target;
    if (target.name === "price" && target.closest(".all-price") !== null) {
      const allRows = tableBody.querySelectorAll("tr");
      for (let i = 0; i < allRows.length; i++) {
        const row = allRows[i];
        if (row.querySelector("td:first-child").textContent !== "All") {
          const input = row.querySelector('input[name="price"]');
          input.value = target.value;
        }
      }
  
      const confirmed = confirm("Чи впевнені ви, що хочете відредагувати усі значення стовбця?");
      if (confirmed) {
        const allInput = target.parentNode.parentNode.querySelectorAll('input[name="price"]');
        for (let i = 0; i < allInput.length; i++) {
          allInput[i].value = "";
        }
      } else {
       
        for (let i = 0; i < allRows.length; i++) {
          const row = allRows[i];
          if (row.querySelector("td:first-child").textContent !== "All") {
            const input = row.querySelector('input[name="price"]');
            input.value = input.getAttribute("data-previous-value");
          }
        }
      }
    } else if (target.name === "price") {
      // Зберігаю минулий стан
      target.setAttribute("data-previous-value", target.value);
    }
  });

//   $(document).ready(function() {
//     $('.city-select').on('change', function() {
//       var selectedCity = $(this).val();
//       console.log(selectedCity);
//     });
//   });


