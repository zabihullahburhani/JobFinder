// ===== ثبت کارفرما =====
const employerForm = document.getElementById("employerForm");
if (employerForm) {
  employerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const job = {
      name: document.getElementById("empName").value,
      phone: document.getElementById("empPhone").value,
      jobType: document.getElementById("empJobType").value,
      desc: document.getElementById("empDesc").value
    };
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    jobs.push(job);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    alert("فرصت کاری ثبت شد ✅");
    employerForm.reset();
  });
}

// ===== ثبت کارگر =====
const workerForm = document.getElementById("workerForm");
if (workerForm) {
  workerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const worker = {
      name: document.getElementById("wName").value,
      skill: document.getElementById("wSkill").value,
      exp: document.getElementById("wExp").value,
      phone: document.getElementById("wPhone").value
    };
    const workers = JSON.parse(localStorage.getItem("workers") || "[]");
    workers.push(worker);
    localStorage.setItem("workers", JSON.stringify(workers));
    alert("کارگر ثبت شد ✅");
    workerForm.reset();
  });
}

// ===== نمایش لیست کارها =====
const jobList = document.getElementById("jobList");
if (jobList) {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  if (jobs.length === 0) {
    jobList.innerHTML = "<p>هیچ فرصت کاری ثبت نشده است.</p>";
  } else {
    jobList.innerHTML = jobs.map(j => `
      <div style="border-bottom:1px solid #ddd;padding:10px 0;">
        <h3>${j.jobType}</h3>
        <p><b>کارفرما:</b> ${j.name}</p>
        <p><b>توضیحات:</b> ${j.desc}</p>
        <p><b>تماس:</b> ${j.phone}</p>
      </div>
    `).join("");
  }
}

// ===== نمایش لیست کارگران =====
const workerList = document.getElementById("workerList");
if (workerList) {
  const workers = JSON.parse(localStorage.getItem("workers") || "[]");
  if (workers.length === 0) {
    workerList.innerHTML = "<p>هیچ کارگری ثبت نشده است.</p>";
  } else {
    workerList.innerHTML = workers.map(w => `
      <div style="border-bottom:1px solid #ddd;padding:10px 0;">
        <h3>${w.name}</h3>
        <p><b>مهارت:</b> ${w.skill}</p>
        <p><b>تجربه:</b> ${w.exp} سال</p>
        <p><b>تماس:</b> ${w.phone}</p>
      </div>
    `).join("");
  }
}
