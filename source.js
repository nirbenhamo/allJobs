//elements
const container = document.querySelector(".container");
const brand_btn = document.querySelector("#brand");
const nav_jobs_btn = document.querySelector("#jobs_btn");
const nav_home_btn = document.querySelector("#home_btn");
const row_div = document.createElement("div");
row_div.setAttribute("class", "row align-items-center");
const navbarDropdown = document.querySelector("#navbarDropdown");
const dropdown = document.querySelector("#dropdown-ul");
const saved_jobs_nav_btn = document.querySelector("#saved_jobs_btn");
const search_input = document.querySelector("#search_input");
const search_btn = document.querySelector("#search_btn");
let input_value;
// function that save data to the local Storage.
const saveToLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// function that return data from the local Storage.
const getDataFromLS = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

//arry that conain the jobs data
const jobs_arr = getDataFromLS("jobs") ? getDataFromLS("jobs") : [];

//arry that conain the searched jobs data
let jobs_by_search_arr = getDataFromLS("jobs by search")
  ? getDataFromLS("jobs by search")
  : [];

//arry that conain the jobs categories
let categories_arr = [];

//arry that conain the saved jobs
let saved_jobs_arr = getDataFromLS("saved_jobs")
  ? getDataFromLS("saved_jobs")
  : [];

// function that create card from the jobs data.
function buildCard(obj) {
  const col_div = document.createElement("div");
  col_div.setAttribute("class", "col");

  const main_div = document.createElement("div");
  main_div.setAttribute("class", "card main_div");

  const company_name = document.createElement("p");
  company_name.setAttribute("class", "company_name");
  company_name.innerHTML = `company name: ${obj.company_name}`;

  const img = document.createElement("img");
  img.setAttribute("class", "card-img-top logo");
  img.src = `${obj.company_logo}`;

  const body_div = document.createElement("div");
  body_div.setAttribute("class", "card-body body_div");

  const h5 = document.createElement("h5");
  h5.setAttribute("class", "card-title");
  h5.textContent = `${obj.title}`;

  const p = document.createElement("p");
  p.setAttribute("class", "card-text");
  p.innerHTML = `${obj.description}`;

  const info_btn = document.createElement("a");
  info_btn.setAttribute("class", "btn btn-success info_btn");
  info_btn.href = `${obj.url}`;
  info_btn.textContent = "see this job";

  const save_btn = document.createElement("a");
  save_btn.setAttribute("class", "btn btn-primary");
  save_btn.textContent = "save job ⭐";

  // add card to saved jobs
  save_btn.addEventListener("click", () => {
    saved_jobs_arr.push(obj);
    saveToLS("saved_jobs", saved_jobs_arr);
    save_btn.style = "display:none";
    remove_btn.style = "display: inline";
  });

  const remove_btn = document.createElement("a");
  remove_btn.setAttribute("class", "btn btn-danger");
  remove_btn.textContent = "remove 🗑️";
  remove_btn.style = "display:none";

  // remove card frome saved jobs
  remove_btn.addEventListener("click", () => {
    remove_btn.style = "display:none";
    save_btn.style = "display: inline";
    saved_jobs_arr = saved_jobs_arr.filter((job) => job.id !== obj.id);
    saveToLS("saved_jobs", saved_jobs_arr);
    saved_jobs_arr.forEach((job) => buildCard(job));
  });

  if (saved_jobs_arr.find((job) => job.id == obj.id)) {
    save_btn.style = "display:none";
    remove_btn.style = "display: inline";
  } else {
    remove_btn.style = "display:none";
    save_btn.style = "display: inline";
  }

  const type_job_p = document.createElement("p");
  type_job_p.setAttribute("class", "type_job_p");
  type_job_p.innerHTML = `Type: ${obj.job_type}`;

  body_div.append(save_btn, remove_btn, info_btn);
  main_div.append(company_name, img, h5, p, body_div, type_job_p);
  col_div.append(main_div);
  row_div.append(col_div);
}

// function that get the jobes data from the remote API

const jobsData = async () => {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?limit=30");
    const data = await res.json();
    const jobs_data = data.jobs;
    saveToLS("jobs", jobs_data);
  } catch (error) {
    console.log(error);
  }
};

jobsData();

// nav buttons -

nav_jobs_btn.addEventListener("click", () => {
  container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
  setTimeout(() => {
    container.innerHTML = ``;
    row_div.innerHTML = ``;
    container.append(row_div);
    jobs_arr.forEach((job) => {
      buildCard(job);
    });
  }, 3000);
});

//home button
nav_home_btn.addEventListener("click", () => {
  container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
  setTimeout(() => {
    container.innerHTML = `<h1>Welcome !!</h1>
    <p>buy some time and spend it here 😉</p>
    <hr>
    <br><br>
    <p>Enjoy ❤️</p>
    <div class="row align-items-center">`;
  }, 3000);
});

// logo
brand_btn.addEventListener("click", () => {
  container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
  setTimeout(() => {
    container.innerHTML = `<h1>Welcome !!</h1>
    <p>buy some time and spend it here 😉</p>
    <hr>
    <br><br>
    <p>Enjoy ❤️</p>
    <div class="row align-items-center">`;
  }, 3000);
});

// category drop list
const getCategories = async () => {
  const res = await fetch("https://remotive.com/api/remote-jobs/categories");
  const data = await res.json();
  const categories_data = data.jobs;
  for (let i = 0; i < categories_data.length; i++) {
    categories_arr.push(categories_data[i].name);
  }
};

getCategories();

// creat the drop list buttons and creat the jobs cards
navbarDropdown.addEventListener("click", () => {
  categories_arr.forEach((cat) => {
    const li = document.createElement("li");
    const li_link = document.createElement("a");
    li_link.setAttribute("class", "dropdown-item");
    li_link.innerHTML = cat;
    li.append(li_link);
    dropdown.append(li);

    let jobs_data = [];
    li_link.addEventListener("click", async () => {
      container.innerHTML = `<div class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;

      try {
        const res = await fetch(
          `https://remotive.com/api/remote-jobs?category=${cat}`
        );
        const data = await res.json();
        jobs_data = data.jobs;

        setTimeout(() => {
          container.innerHTML = " ";
          row_div.innerHTML = " ";
          container.append(row_div);
          jobs_data.forEach((job) => {
            buildCard(job);
          });
        }, 3000);
        console.log(jobs_data);
      } catch (error) {
        console.log(error);
      }
    });
  });
});

// saved jobs nav button

saved_jobs_nav_btn.addEventListener("click", () => {
  container.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
  setTimeout(() => {
    if (saved_jobs_arr.length > 0) {
      container.innerHTML = " ";
      row_div.innerHTML = " ";
      container.append(row_div);

      // function that create card from the saved jobs data.
      function buildCard2(obj) {
        const col_div = document.createElement("div");
        col_div.setAttribute("class", "col");

        const main_div = document.createElement("div");
        main_div.setAttribute("class", "card main_div");

        const company_name = document.createElement("p");
        company_name.setAttribute("class", "company_name");
        company_name.innerHTML = `company name: ${obj.company_name}`;

        const img = document.createElement("img");
        img.setAttribute("class", "card-img-top logo");
        img.src = `${obj.company_logo}`;

        const body_div = document.createElement("div");
        body_div.setAttribute("class", "card-body body_div");

        const h5 = document.createElement("h5");
        h5.setAttribute("class", "card-title");
        h5.textContent = `${obj.title}`;

        const p = document.createElement("p");
        p.setAttribute("class", "card-text");
        p.innerHTML = `${obj.description}`;

        const info_btn = document.createElement("a");
        info_btn.setAttribute("class", "btn btn-success info_btn");
        info_btn.href = `${obj.url}`;
        info_btn.textContent = "see this job";

        const remove_btn = document.createElement("a");
        remove_btn.setAttribute("class", "btn btn-danger");
        remove_btn.textContent = "remove 🗑️";

        // remove card frome saved jobs
        remove_btn.addEventListener("click", () => {
          saved_jobs_arr = saved_jobs_arr.filter((job) => job.id !== obj.id);
          saveToLS("saved_jobs", saved_jobs_arr);
          col_div.remove();
        });

        const type_job_p = document.createElement("p");
        type_job_p.setAttribute("class", "type_job_p");
        type_job_p.innerHTML = `Type: ${obj.job_type}`;

        body_div.append(remove_btn, info_btn);
        main_div.append(company_name, img, h5, p, body_div, type_job_p);
        col_div.append(main_div);
        row_div.append(col_div);
      }
      saved_jobs_arr.forEach((job) => buildCard2(job));
    } else {
      container.innerHTML = " ";
      row_div.innerHTML = "there is no saved jobs ";
      container.append(row_div);
    }
  }, 3000);
});

// navbar search

// search_btn.addEventListener("click", () => {
//   container.innerHTML = `<div class="d-flex justify-content-center">
//   <div class="spinner-border text-primary" role="status">
//     <span class="visually-hidden">Loading...</span>
//   </div>
// </div>`;
//   setTimeout(async () => {
//     input_value = search_input.value;

//     if (input_value) {
//       const searched_jobs = async () => {
//         try {
//           const res = await fetch(`https://remotive.com/api/remote-jobs?category=${input_value}`);
//           const data = await res.json();
//           const search_jobs_data = data.jobs;
//           saveToLS("jobs by search", search_jobs_data);
//           console.log(jobs_by_search_arr);
//           buildCard(jobs_by_search_arr);
//         } catch (error) {
//           console.log(error);
//         }
//         container.innerHTML = " ";
//         row_div.innerHTML = " ";
//         container.append(row_div);
//         await searched_jobs();
//       };
//     } else {
//       container.textContent = `No Results for "${input_value}"`;
//     }
//   }, 3000);
// });
let x;
search_btn.addEventListener("click",async ()=>{
const dataBySearch = async ()=>{
   try {
  
    const res = await fetch(`https://remotive.com/api/remote-jobs?category=${input_value}`);
    const data = await res.json();
    saveToLS("jobs by search",data.jobs)
    x = data.jobs
  } catch (error) {
    console.log(error);
  }
}
})
dataBySearch();
console.log(jobs_by_search_arr);