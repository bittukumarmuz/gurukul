/* ============================================================
   script.js — Aditya Ranker Gurukul
   ============================================================ */

/* ===== 1. NAVBAR SCROLL ===== */
window.addEventListener('scroll', function () {
  var nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  var btn = document.getElementById('scrollTop');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
});

/* ===== 2. HAMBURGER DROPDOWN ===== */
function toggleDropdown() {
  var ham  = document.getElementById('hamburger');
  var menu = document.getElementById('dropdownMenu');
  if (!ham || !menu) return;
  ham.classList.toggle('open');
  menu.classList.toggle('open');
}
function closeDropdown() {
  var ham  = document.getElementById('hamburger');
  var menu = document.getElementById('dropdownMenu');
  if (ham) ham.classList.remove('open');
  if (menu) menu.classList.remove('open');
}
// Sidebar stubs (in case any page calls these)
function toggleSidebar() { toggleDropdown(); }
function closeSidebar()  { closeDropdown();  }

// Close dropdown on outside click
document.addEventListener('click', function (e) {
  var ham  = document.getElementById('hamburger');
  var menu = document.getElementById('dropdownMenu');
  if (!ham || !menu) return;
  if (!ham.contains(e.target) && !menu.contains(e.target)) {
    ham.classList.remove('open');
    menu.classList.remove('open');
  }
});

/* ===== 3. SCROLL REVEAL ===== */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ===== 4. SMOOTH SCROLL HELPER ===== */
function scrollTo(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ===== 5. FLOATING PARTICLES ===== */
(function () {
  var container = document.getElementById('particles');
  if (!container) return;
  for (var i = 0; i < 18; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    var size = Math.random() * 8 + 4;
    p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (Math.random() * 100) + '%;animation-duration:' + (Math.random() * 15 + 10) + 's;animation-delay:' + (Math.random() * 10) + 's;opacity:' + (Math.random() * 0.4 + 0.1) + ';';
    container.appendChild(p);
  }
})();

/* ===== 6. TAB SWITCHING (Features section) ===== */
function switchTab(name) {
  var tabs = ['admission', 'notes', 'doubts', 'result']; // admission add kiya
  document.querySelectorAll('.tab-btn').forEach(function (b, i) {
    b.classList.toggle('active', tabs[i] === name);
  });
  document.querySelectorAll('.tab-content').forEach(function (t) {
    t.classList.remove('active');
  });
  var el = document.getElementById('tab-' + name);
  if (el) el.classList.add('active');
}

function handleAdmission(form) {
  var name    = document.getElementById('studentName').value.trim();
  var father  = document.getElementById('fatherName').value.trim();
  var contact = document.getElementById('contact').value.trim();
  var cls     = document.getElementById('classSelect').value;
  var village = document.getElementById('village').value.trim();

  if (!name || !father || !contact || !cls || !village) {
    alert('⚠️ Sabhi * fields bharo!'); return false;
  }
  if (contact.length !== 10 || isNaN(contact)) {
    alert('⚠️ 10-digit number daalo!'); return false;
  }

  var btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Bhej rahe hain...';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(function(r) {
    if (r.ok) {
      form.reset();
      document.getElementById('admissionSuccess').style.display = 'block';
      btn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
      btn.style.background = 'linear-gradient(135deg,#059669,#047857)';
      setTimeout(function() {
        document.getElementById('admissionSuccess').style.display = 'none';
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    } else {
      document.getElementById('admissionError').style.display = 'block';
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
      btn.disabled = false;
    }
  })
  .catch(function() {
    document.getElementById('admissionError').style.display = 'block';
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
    btn.disabled = false;
  });
  return false;
}



/* ===== 7. NOTES — "Not Available" popup ===== */
function notesNA() {
  var popup = document.createElement('div');
  popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:16px;padding:30px 36px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.2);z-index:9999;max-width:300px;width:90%;';
  popup.innerHTML =
    '<div style="font-size:2.2rem;margin-bottom:10px;">📭</div>' +
    '<h3 style="color:var(--primary);margin-bottom:7px;font-size:1.1rem;">Notes Available Nahi Hain</h3>' +
    '<p style="color:var(--gray);font-size:0.87rem;margin-bottom:18px;">Jald hi upload honge! WhatsApp pe contact karein.</p>' +
    '<button onclick="this.parentElement.remove()" style="background:var(--accent);color:#fff;border:none;padding:9px 22px;border-radius:25px;cursor:pointer;font-weight:600;">OK</button>';
  document.body.appendChild(popup);
}

/* ===== 8. DOUBT SYSTEM ===== */
var doubtCounter = 100;

function submitDoubt() {
  var name = document.getElementById('doubtName').value.trim();
  var cls  = document.getElementById('doubtClass').value;
  var text = document.getElementById('doubtText').value.trim();
  if (!name || !cls || !text) { alert('⚠️ Teeno fields bharo!'); return; }

  doubtCounter++;
  var id = 'dyn-' + doubtCounter;

  var item = document.createElement('div');
  item.className = 'doubt-item';
  item.dataset.id = id;
  item.innerHTML =
    '<button class="delete-doubt" onclick="deleteDoubt(\'' + id + '\')"><i class="fas fa-times"></i></button>' +
    '<div class="doubt-meta"><i class="fas fa-user"></i> ' + name + ' &nbsp;·&nbsp; <strong>' + cls + '</strong> &nbsp;·&nbsp; <i class="fas fa-clock"></i> 5 din 0 ghante</div>' +
    '<div class="doubt-q">' + text + '</div>' +
    '<div class="doubt-actions-row">' +
      '<button class="btn-ans-toggle" onclick="toggleReplies(\'' + id + '\')"><i class="fas fa-comment-dots"></i> Replies (0)</button>' +
      '<button class="btn-reply-open" onclick="openReplyBox(\'' + id + '\')"><i class="fas fa-reply"></i> Reply</button>' +
    '</div>' +
    '<div class="reply-list" id="replies-' + id + '" style="display:none;"></div>' +
    '<div class="reply-box" id="replybox-' + id + '">' +
      '<textarea rows="2" id="replytext-' + id + '" placeholder="Reply likhein..."></textarea>' +
      '<div class="reply-send-row">' +
        '<input type="text" id="replyname-' + id + '" placeholder="Aapka naam"/>' +
        '<button class="reply-btn" onclick="addReply(\'' + id + '\')"><i class="fas fa-paper-plane"></i> Send</button>' +
      '</div>' +
    '</div>';

  var list = document.getElementById('doubtsList');
  list.prepend(item);
  document.getElementById('noDoubts').style.display = 'none';

  document.getElementById('doubtName').value = '';
  document.getElementById('doubtClass').value = '';
  document.getElementById('doubtText').value = '';

  // Auto-delete after 5 days
  setTimeout(function () { deleteDoubt(id); }, 5 * 24 * 60 * 60 * 1000);
  alert('✅ Doubt submit ho gaya!');
}

function toggleReplies(id) {
  var list = document.getElementById('replies-' + id);
  if (!list) return;
  list.style.display = list.style.display === 'none' ? 'flex' : 'none';
  list.style.flexDirection = 'column';
}

function openReplyBox(id) {
  var box = document.getElementById('replybox-' + id);
  if (box) box.classList.toggle('open');
}

function addReply(id) {
  var text = document.getElementById('replytext-' + id).value.trim();
  var name = document.getElementById('replyname-' + id).value.trim() || 'Anonymous';
  if (!text) { alert('Reply likhein!'); return; }
  var list = document.getElementById('replies-' + id);
  var div = document.createElement('div');
  div.className = 'reply-item';
  div.innerHTML = '<div class="reply-meta"><i class="fas fa-user" style="color:var(--accent2);"></i> ' + name + '</div>' + text;
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.appendChild(div);
  // Update count
  var btns = document.querySelectorAll('[data-id="' + id + '"] .btn-ans-toggle');
  btns.forEach(function(btn){
    var cur = parseInt((btn.textContent.match(/\d+/) || [0])[0]) + 1;
    btn.innerHTML = '<i class="fas fa-comment-dots"></i> Replies (' + cur + ')';
  });
  document.getElementById('replytext-' + id).value = '';
  document.getElementById('replybox-' + id).classList.remove('open');
}

function deleteDoubt(id) {
  var item = document.querySelector('[data-id="' + id + '"]');
  if (!item) return;
  item.style.opacity = '0';
  item.style.transform = 'translateX(20px)';
  item.style.transition = 'all 0.3s';
  setTimeout(function () {
    item.remove();
    if (document.querySelectorAll('.doubt-item').length === 0) {
      var nd = document.getElementById('noDoubts');
      if (nd) nd.style.display = 'block';
    }
  }, 300);
}

/* ===== 9. RESULT CHECKER ===== */
var resultsDB = {
  '1024':{name:'Anjali Sharma',cls:'Class 10',maths:98,science:99,hindi:97,english:98,social:100,total:492,grade:'A+',status:'PASS'},
  '1087':{name:'Rohan Verma',cls:'Class 10',maths:95,science:97,hindi:96,english:98,social:97,total:483,grade:'A+',status:'PASS'},
  '2031':{name:'Priya Yadav',cls:'Class 12',maths:92,science:98,hindi:96,english:95,social:97,total:478,grade:'A+',status:'PASS'},
  '1153':{name:'Suresh Kumar',cls:'Class 10',maths:93,science:94,hindi:95,english:96,social:99,total:477,grade:'A+',status:'PASS'},
  '2108':{name:'Kavita Singh',cls:'Class 12',maths:91,science:93,hindi:97,english:95,social:98,total:474,grade:'A+',status:'PASS'},
  '1209':{name:'Amit Patel',cls:'Class 10',maths:90,science:92,hindi:94,english:93,social:94,total:463,grade:'A',status:'PASS'}
};

function checkResult() {
  var roll = document.getElementById('rollInput').value.trim();
  var display  = document.getElementById('resultDisplay');
  var notFound = document.getElementById('resultNotFound');
  display.classList.remove('show');
  notFound.style.display = 'none';
  if (!roll) { alert('Roll number daalo!'); return; }
  var r = resultsDB[roll];
  if (!r) { notFound.style.display = 'block'; return; }
  document.getElementById('resultGrade').textContent = r.grade;
  document.getElementById('resultStatus').innerHTML = '<span style="color:' + (r.status === 'PASS' ? '#059669' : '#dc2626') + '">' + r.status + '</span>';
  document.getElementById('resultRows').innerHTML =
    '<div class="result-row"><span class="label">Student Name</span><span class="value">' + r.name + '</span></div>' +
    '<div class="result-row"><span class="label">Roll Number</span><span class="value">' + roll + '</span></div>' +
    '<div class="result-row"><span class="label">Class</span><span class="value">' + r.cls + '</span></div>' +
    '<div class="result-row"><span class="label">Mathematics</span><span class="value">' + r.maths + '/100</span></div>' +
    '<div class="result-row"><span class="label">Science</span><span class="value">' + r.science + '/100</span></div>' +
    '<div class="result-row"><span class="label">Hindi</span><span class="value">' + r.hindi + '/100</span></div>' +
    '<div class="result-row"><span class="label">English</span><span class="value">' + r.english + '/100</span></div>' +
    '<div class="result-row"><span class="label">Social Science</span><span class="value">' + r.social + '/100</span></div>' +
    '<div class="result-row"><span class="label">Total</span><span class="value" style="color:var(--accent);font-size:1.05rem;">' + r.total + '/500</span></div>' +
    '<div class="result-row"><span class="label">Percentage</span><span class="value">' + (r.total / 5).toFixed(1) + '%</span></div>';
  display.classList.add('show');
}

// Enter key for result
document.addEventListener('DOMContentLoaded', function () {
  var ri = document.getElementById('rollInput');
  if (ri) ri.addEventListener('keydown', function (e) { if (e.key === 'Enter') checkResult(); });
});

/* ===== 10. WHATSAPP QUICK MESSAGE ===== */
function sendWhatsApp() {
  var name = document.getElementById('qName').value.trim();
  var msg  = document.getElementById('qMsg').value.trim();
  if (!name || !msg) { alert('Naam aur message dono bharo!'); return; }
  var text = encodeURIComponent('Namaste Aditya Sir! Mera naam ' + name + ' hai. ' + msg);
  // ★ APNA NUMBER DAALO: 917255013438 ki jagah (e.g. 917255013438)
  window.open('https://wa.me/917255013438?text=' + text, '_blank');
}

/* ===== 11. MODAL ===== */
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
function switchModalTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(function (t) { t.classList.remove('active'); });
  document.querySelectorAll('.modal-form').forEach(function (f) { f.classList.remove('active'); });
  document.getElementById('mtab-' + tab).classList.add('active');
  document.getElementById('mf-' + tab).classList.add('active');
}

/* ===== 12. ACTIVE NAV HIGHLIGHT ON SCROLL ===== */

