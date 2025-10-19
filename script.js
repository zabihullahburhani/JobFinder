// script.js - manages localStorage, search, export/import
(function(){
  // Utilities
  function $(id){return document.getElementById(id)}
  function saveToStorage(key, arr){localStorage.setItem(key, JSON.stringify(arr||[]))}
  function readFromStorage(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}}

  /* ---------- Employer form ---------- */
  const employerForm = $('employerForm')
  if (employerForm){
    employerForm.addEventListener('submit', function(e){
      e.preventDefault()
      const job = {
        id: Date.now(),
        name: $('empName').value.trim(),
        phone: $('empPhone').value.trim(),
        jobType: $('empJobType').value.trim(),
        rate: $('empRate').value.trim(),
        desc: $('empDesc').value.trim()
      }
      const jobs = readFromStorage('jobs')
      jobs.unshift(job)
      saveToStorage('jobs', jobs)
      renderJobs()
      employerForm.reset()
      scrollToId('jobList')
    })
    $('downloadJobs')?.addEventListener('click', function(){
      const jobs = readFromStorage('jobs')
      downloadJSON(jobs, 'jobs.json')
    })
  }

  /* ---------- Worker form ---------- */
  const workerForm = $('workerForm')
  if (workerForm){
    workerForm.addEventListener('submit', function(e){
      e.preventDefault()
      const worker = {
        id: Date.now(),
        name: $('wName').value.trim(),
        skill: $('wSkill').value.trim(),
        exp: $('wExp').value.trim(),
        rate: $('wRate').value.trim(),
        phone: $('wPhone').value.trim()
      }
      const workers = readFromStorage('workers')
      workers.unshift(worker)
      saveToStorage('workers', workers)
      renderWorkers()
      workerForm.reset()
      scrollToId('workerList')
    })
    $('downloadWorkers')?.addEventListener('click', function(){
      const workers = readFromStorage('workers')
      downloadJSON(workers, 'workers.json')
    })
  }

  /* ---------- Render lists ---------- */
  function renderJobs(list){
    const container = $('jobList')
    if (!container) return
    const jobs = list || readFromStorage('jobs')
    if (!jobs.length) {
      container.innerHTML = '<p class="muted">هیچ فرصت کاری ثبت نشده است.</p>'
      return
    }
    container.innerHTML = jobs.map(j => `
      <div class="item">
        <h3>${escapeHtml(j.jobType || 'بدون عنوان')}</h3>
        <p><strong>کارفرما:</strong> ${escapeHtml(j.name)}</p>
        ${j.rate?`<p><strong>نرخ:</strong> ${escapeHtml(j.rate)}</p>`:''}
        <p>${escapeHtml(j.desc || '')}</p>
        <p><strong>تماس:</strong> ${escapeHtml(j.phone)}</p>
      </div>
    `).join('')
  }

  function renderWorkers(list){
    const container = $('workerList')
    if (!container) return
    const workers = list || readFromStorage('workers')
    if (!workers.length){
      container.innerHTML = '<p class="muted">هیچ کارگری ثبت نشده است.</p>'
      return
    }
    container.innerHTML = workers.map(w => `
      <div class="item">
        <h3>${escapeHtml(w.name)}</h3>
        <p><strong>مهارت:</strong> ${escapeHtml(w.skill)}</p>
        ${w.rate?`<p><strong>نرخ:</strong> ${escapeHtml(w.rate)}</p>`:''}
        <p><strong>تجربه:</strong> ${escapeHtml(w.exp)} سال</p>
        <p><strong>تماس:</strong> ${escapeHtml(w.phone)}</p>
      </div>
    `).join('')
  }

  /* ---------- Search ---------- */
  const jobSearchInput = $('jobSearchInput')
  if (jobSearchInput){
    $('jobSearchBtn').addEventListener('click', function(){
      const q = jobSearchInput.value.trim().toLowerCase()
      const jobs = readFromStorage('jobs').filter(j => (j.jobType||'').toLowerCase().includes(q) || (j.name||'').toLowerCase().includes(q) || (j.desc||'').toLowerCase().includes(q))
      renderJobs(jobs)
    })
    $('jobClearBtn').addEventListener('click', function(){
      jobSearchInput.value=''
      renderJobs()
    })
  }

  const workerSearchInput = $('workerSearchInput')
  if (workerSearchInput){
    $('workerSearchBtn').addEventListener('click', function(){
      const q = workerSearchInput.value.trim().toLowerCase()
      const workers = readFromStorage('workers').filter(w => (w.skill||'').toLowerCase().includes(q) || (w.name||'').toLowerCase().includes(q))
      renderWorkers(workers)
    })
    $('workerClearBtn').addEventListener('click', function(){
      workerSearchInput.value=''
      renderWorkers()
    })
  }

  /* ---------- Helpers: export/import JSON ---------- */
  function downloadJSON(obj, filename){
    const data = JSON.stringify(obj || [], null, 2)
    const blob = new Blob([data], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Allow optional import via dropping a .json onto page (for advanced users)
  window.addEventListener('dragover', function(e){e.preventDefault()})
  window.addEventListener('drop', function(e){
    e.preventDefault()
    if (!e.dataTransfer) return
    const f = e.dataTransfer.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = function(evt){
      try{
        const data = JSON.parse(evt.target.result)
        // If array of jobs or workers, detect by keys
        if (Array.isArray(data) && data.length){
          if (data[0].hasOwnProperty('jobType')) {
            saveToStorage('jobs', data)
            renderJobs()
            alert('داده‌های کارها درج شدند.')
          } else if (data[0].hasOwnProperty('skill')) {
            saveToStorage('workers', data)
            renderWorkers()
            alert('داده‌های کارگران درج شدند.')
          } else {
            alert('فایل JSON شناخته نشد.')
          }
        } else {
          alert('فایل JSON خالی یا نامعتبر است.')
        }
      }catch(err){ alert('خطا در خواندن فایل: ' + err.message) }
    }
    reader.readAsText(f)
  })

  /* ---------- Small helpers ---------- */
  function escapeHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
  function scrollToId(id){ const el = $(id); if(el) el.scrollIntoView({behavior:'smooth'}) }

  // initial render on pages
  renderJobs()
  renderWorkers()

})();