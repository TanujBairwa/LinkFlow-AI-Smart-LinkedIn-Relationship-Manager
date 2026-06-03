// Auth
function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.querySelectorAll('.auth-form').forEach(f=>f.classList.toggle('active',f.id===tab+'-form'));
}
function handleLogin(){
  state.user={name:'Alex Johnson',email:'demo@linkflow.ai',avatar:'AJ'};
  document.getElementById('sidebar-name').textContent=state.user.name;
  document.getElementById('sidebar-avatar').textContent=state.user.avatar;
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('main-app').classList.add('active');
  navigate('dashboard');
  updateDate();
  renderNotifications();
}
function handleSignup(){
  const name=document.getElementById('signup-name').value||'New User';
  state.user={name,email:document.getElementById('signup-email').value,avatar:name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)};
  document.getElementById('sidebar-name').textContent=state.user.name;
  document.getElementById('sidebar-avatar').textContent=state.user.avatar;
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('main-app').classList.add('active');
  navigate('dashboard');
  updateDate();
  renderNotifications();
}
function handleLogout(){
  state.user=null;
  document.getElementById('auth-screen').classList.add('active');
  document.getElementById('main-app').classList.remove('active');
}

// Navigation
function navigate(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
  const el=document.getElementById('page-'+page);
  if(el)el.classList.add('active');
  const titles={dashboard:'Dashboard',daily:'Daily Contacts',connections:'All Connections',analytics:'Analytics',import:'Import Connections',profile:'Connection Profile'};
  document.getElementById('page-title').textContent=titles[page]||page;
  const renders={dashboard:renderDashboard,daily:renderDaily,connections:renderConnections,analytics:renderAnalytics,import:renderImport};
  if(renders[page])renders[page]();
}

function updateDate(){
  document.getElementById('page-date').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
}

// Toast
function showToast(msg,type='info'){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast '+type;
  setTimeout(()=>t.classList.add('hidden'),3000);
}

// Notifications
function toggleNotifications(){
  document.getElementById('notif-panel').classList.toggle('hidden');
}
function renderNotifications(){
  const list=document.getElementById('notif-list');
  list.innerHTML=state.notifications.map(n=>`
    <div class="notif-item${n.read?'':' unread'}">
      <div class="notif-icon">${n.icon}</div>
      <div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
    </div>`).join('');
}

// Search
function handleSearch(q){
  if(document.getElementById('page-connections').classList.contains('active')){
    renderConnections(q);
  }
}

// Dashboard
function renderDashboard(){
  const total=state.connections.length;
  if(total===0){
    document.getElementById('page-dashboard').innerHTML=`
      <div style="text-align:center;padding:80px 20px;max-width:480px;margin:0 auto">
        <div style="font-size:64px;margin-bottom:24px">🔗</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:10px">No connections yet</h2>
        <p style="color:var(--text2);font-size:15px;line-height:1.6;margin-bottom:28px">Import your LinkedIn connections to start tracking relationships, reply rates, and networking opportunities.</p>
        <button class="btn-accent" onclick="navigate('import')" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px">📤 Import Connections</button>
      </div>`;
    return;
  }
  const active=state.connections.filter(c=>c.category==='active').length;
  const warm=state.connections.filter(c=>c.category==='warm').length;
  const cold=state.connections.filter(c=>c.category==='cold').length;
  const avgReply=total>0?Math.round(state.connections.reduce((a,c)=>a+c.replyRate,0)/total):0;
  document.getElementById('page-dashboard').innerHTML=`
    <div class="stats-grid">
      <div class="stat-card indigo"><div class="stat-icon" style="background:rgba(99,102,241,.15)">🔗</div><div class="stat-value">${state.connections.length}</div><div class="stat-label">Total Connections</div><div class="stat-change up">↑ 12 this week</div></div>
      <div class="stat-card green"><div class="stat-icon" style="background:rgba(16,185,129,.15)">✅</div><div class="stat-value">${active}</div><div class="stat-label">Active Contacts</div><div class="stat-change up">↑ 2 new</div></div>
      <div class="stat-card yellow"><div class="stat-icon" style="background:rgba(245,158,11,.15)">💬</div><div class="stat-value">${avgReply}%</div><div class="stat-label">Reply Rate</div><div class="stat-change up">↑ 5% vs last month</div></div>
      <div class="stat-card red"><div class="stat-icon" style="background:rgba(239,68,68,.15)">❄️</div><div class="stat-value">${cold}</div><div class="stat-label">Cold Contacts</div><div class="stat-change down">Need re-engagement</div></div>
      <div class="stat-card cyan"><div class="stat-icon" style="background:rgba(6,182,212,.15)">🎯</div><div class="stat-value">5</div><div class="stat-label">Today's Targets</div><div class="stat-change up">Daily goal active</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
      <div class="chart-card">
        <div class="section-header"><span class="section-title">Connection Health</span></div>
        <div class="donut-wrap">
          <svg class="donut-svg" width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="none" stroke="#1c1c28" stroke-width="18"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" stroke-width="18" stroke-dasharray="${active*7.3} 220" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" stroke-width="18" stroke-dasharray="${warm*7.3} 220" stroke-dashoffset="${-active*7.3}" transform="rotate(-90 50 50)"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#ef4444" stroke-width="18" stroke-dasharray="${cold*7.3} 220" stroke-dashoffset="${-(active+warm)*7.3}" transform="rotate(-90 50 50)"/>
            <text x="50" y="54" text-anchor="middle" fill="#f1f5f9" font-size="14" font-weight="700">${state.connections.length}</text>
          </svg>
          <div class="donut-legend">
            <div class="donut-item"><div class="donut-dot" style="background:#10b981"></div>Active (${active})</div>
            <div class="donut-item"><div class="donut-dot" style="background:#f59e0b"></div>Warm (${warm})</div>
            <div class="donut-item"><div class="donut-dot" style="background:#ef4444"></div>Cold (${cold})</div>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-header"><span class="section-title">Weekly Interactions</span></div>
        <div class="bar-chart">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>{const v=[3,5,2,7,4,1,6][i];return`<div class="bar-col"><div class="bar-val">${v}</div><div class="bar" style="height:${v*14}px"></div><div class="bar-label">${d}</div></div>`;}).join('')}
        </div>
      </div>
    </div>
    <div class="chart-card">
      <div class="section-header"><span class="section-title">Top Active Connections</span><button class="btn-sm" onclick="navigate('connections')">View All</button></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Company</th><th>Reply Rate</th><th>Status</th><th>Last Contact</th></tr></thead>
        <tbody>${state.connections.slice(0,6).map(c=>`
          <tr style="cursor:pointer" onclick="openContact(${c.id})">
            <td><div style="display:flex;align-items:center;gap:10px"><div class="contact-avatar" style="width:32px;height:32px;font-size:12px">${c.avatar}</div>${c.name}</div></td>
            <td style="color:var(--text2)">${c.company}</td>
            <td><div class="reply-rate-wrap"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${c.replyRate}%"></div></div><span>${c.replyRate}%</span></div></td>
            <td><span class="status-badge ${c.category}">${c.category}</span></td>
            <td style="color:var(--text2)">${c.lastContact}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// Daily
function getDailyContacts(){
  const today=new Date().toDateString();
  if(state.dailyContactsDate===today&&state.dailyContacts.length) return state.dailyContacts;
  const shuffled=[...state.connections].sort(()=>Math.random()-.5);
  state.dailyContacts=shuffled.slice(0,5);
  state.dailyContactsDate=today;
  document.getElementById('daily-badge').textContent=state.dailyContacts.length;
  return state.dailyContacts;
}
function renderDaily(){
  if(state.connections.length===0){
    document.getElementById('page-daily').innerHTML=`
      <div style="text-align:center;padding:80px 20px;max-width:480px;margin:0 auto">
        <div style="font-size:64px;margin-bottom:24px">🎯</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:10px">No daily targets yet</h2>
        <p style="color:var(--text2);font-size:15px;line-height:1.6;margin-bottom:28px">Once you import your LinkedIn connections, we'll pick 5 people for you to reach out to every day.</p>
        <button class="btn-accent" onclick="navigate('import')" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px">📤 Import Connections</button>
      </div>`;
    return;
  }
  const contacts=getDailyContacts();
  document.getElementById('page-daily').innerHTML=`
    <div class="daily-header">
      <div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px">🎯 Today's Networking Targets</h3>
      <div class="daily-meta">
        <div class="daily-meta-item">📅 ${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
        <div class="daily-meta-item">👥 ${contacts.length} contacts selected</div>
        <div class="daily-meta-item">⚡ Prioritizing uncontacted connections</div>
      </div></div>
      <button class="btn-accent" onclick="refreshDaily()">🔄 Refresh</button>
    </div>
    <div class="contact-grid">${contacts.map(c=>contactCard(c)).join('')}</div>`;
}
function refreshDaily(){
  state.dailyContacts=[];
  renderDaily();
  showToast('Daily contacts refreshed!','success');
}

// Connections
function renderConnections(query=''){
  if(state.connections.length===0){
    document.getElementById('page-connections').innerHTML=`
      <div style="text-align:center;padding:80px 20px;max-width:480px;margin:0 auto">
        <div style="font-size:64px;margin-bottom:24px">👥</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:10px">No connections imported</h2>
        <p style="color:var(--text2);font-size:15px;line-height:1.6;margin-bottom:28px">Import your LinkedIn connections first. After import, all your contacts will appear here with reply rates, tags, and notes.</p>
        <button class="btn-accent" onclick="navigate('import')" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px">📤 Import Connections</button>
      </div>`;
    return;
  }
  const status=document.querySelector('.filter-chip.active')?.dataset.status||'all';
  let list=state.connections;
  if(query) list=list.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())||c.company.toLowerCase().includes(query.toLowerCase()));
  if(status!=='all') list=list.filter(c=>c.category===status);
  document.getElementById('page-connections').innerHTML=`
    <div class="filter-bar">
      ${['all','active','warm','cold'].map(s=>`<button class="filter-chip${s==='all'?' active':''}" data-status="${s}" onclick="setFilter(this,'${s}')">${s==='all'?'All Connections':s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}
      ${ALL_TAGS.map(t=>`<button class="filter-chip" onclick="showToast('Filter by tag: ${t}','info')">#${t}</button>`).join('')}
    </div>
    <div style="margin-bottom:16px;color:var(--text2);font-size:13px">${list.length} connections found</div>
    <div class="contact-grid">${list.length?list.map(c=>contactCard(c)).join(''):'<div class="empty-state"><div class="empty-icon">🔍</div><p>No connections found</p></div>'}</div>`;
}
function setFilter(btn,status){
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  renderConnections(document.getElementById('global-search').value);
}

// Contact Card
function contactCard(c){
  return`<div class="contact-card" onclick="openContact(${c.id})">
    <div class="contact-top">
      <div class="contact-avatar">${c.avatar}</div>
      <div class="contact-info"><div class="contact-name">${c.name}</div><div class="contact-title">${c.title}</div></div>
      <span class="status-badge ${c.category}">${c.category}</span>
    </div>
    <div class="reply-rate-wrap" style="margin-top:10px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${c.replyRate}%"></div></div><span style="font-size:12px;font-weight:600">${c.replyRate}%</span></div>
    <div class="contact-stats">
      <div class="contact-stat"><label>Interactions</label><value>${c.interactions.length}</value></div>
      <div class="contact-stat"><label>Last Contact</label><value style="font-size:12px">${c.lastContact}</value></div>
    </div>
    <div class="tags-row">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
  </div>`;
}

// Contact Modal
function openContact(id){
  const c=state.connections.find(x=>x.id===id);
  if(!c)return;
  state.selectedContact=c;
  document.getElementById('modal-content').innerHTML=`
    <div class="modal-header">
      <div class="modal-avatar">${c.avatar}</div>
      <div><div class="modal-name">${c.name}</div><div class="modal-title">${c.title}</div></div>
      <button class="modal-close" onclick="closeModalBtn()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-section">
        <div class="modal-section-title">Status & Reply Rate</div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="status-badge ${c.category}">${c.category}</span>
          <div class="reply-rate-wrap" style="flex:1"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${c.replyRate}%"></div></div><span style="font-size:13px;font-weight:700">${c.replyRate}%</span></div>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Tags</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${ALL_TAGS.map(t=>`<span class="tag" style="cursor:pointer;${c.tags.includes(t)?'background:rgba(99,102,241,.25);':'opacity:.5'}" onclick="toggleTag(${c.id},'${t}')">${t}</span>`).join('')}
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Notes</div>
        <textarea class="notes-area" id="notes-area-${c.id}" placeholder="Add a note about this connection...">${c.notes}</textarea>
        <button class="btn-sm" onclick="saveNotes(${c.id})">💾 Save Notes</button>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Interaction History</div>
        <div class="interaction-list">
          ${c.interactions.map(i=>`
            <div class="interaction-item">
              <div class="interaction-dot ${i.response?'replied':'no-reply'}"></div>
              <div class="interaction-detail"><div class="interaction-type">${i.type}</div><div class="interaction-date">${i.date}</div></div>
              <div class="interaction-response ${i.response?'yes':'no'}">${i.response?'Replied':'No Reply'}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn-action btn-msg" onclick="logInteraction(${c.id},'message')">💬 Message</button>
      <button class="btn-action btn-like" onclick="logInteraction(${c.id},'like')">👍 Like Post</button>
      <button class="btn-action btn-note" onclick="logInteraction(${c.id},'comment')">💡 Comment</button>
    </div>`;
  document.getElementById('contact-modal').classList.remove('hidden');
}
function closeModal(e){if(e.target===document.getElementById('contact-modal'))closeModalBtn();}
function closeModalBtn(){document.getElementById('contact-modal').classList.add('hidden');}
function saveNotes(id){
  const c=state.connections.find(x=>x.id===id);
  if(c){c.notes=document.getElementById('notes-area-'+id).value;showToast('Notes saved!','success');}
}
function toggleTag(id,tag){
  const c=state.connections.find(x=>x.id===id);
  if(!c)return;
  if(c.tags.includes(tag))c.tags=c.tags.filter(t=>t!==tag);else c.tags.push(tag);
  openContact(id);
}
function logInteraction(id,type){
  const c=state.connections.find(x=>x.id===id);
  if(!c)return;
  c.interactions.unshift({type,date:new Date().toISOString().split('T')[0],response:false});
  c.lastContact=new Date().toISOString().split('T')[0];
  showToast(`${type} logged for ${c.name}!`,'success');
  openContact(id);
}

// Analytics
function renderAnalytics(){
  if(state.connections.length===0){
    document.getElementById('page-analytics').innerHTML=`
      <div style="text-align:center;padding:80px 20px;max-width:480px;margin:0 auto">
        <div style="font-size:64px;margin-bottom:24px">📊</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:10px">No data to analyse yet</h2>
        <p style="color:var(--text2);font-size:15px;line-height:1.6;margin-bottom:28px">Your analytics charts will appear here after you import your LinkedIn connections.</p>
        <button class="btn-accent" onclick="navigate('import')" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px">📤 Import Connections</button>
      </div>`;
    return;
  }
  const active=state.connections.filter(c=>c.category==='active').length;
  const warm=state.connections.filter(c=>c.category==='warm').length;
  const cold=state.connections.filter(c=>c.category==='cold').length;
  const tagCounts={};
  state.connections.forEach(c=>c.tags.forEach(t=>{tagCounts[t]=(tagCounts[t]||0)+1;}));
  const topTags=Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topReply=[...state.connections].sort((a,b)=>b.replyRate-a.replyRate).slice(0,5);
  document.getElementById('page-analytics').innerHTML=`
    <div class="stats-grid" style="margin-bottom:24px">
      <div class="stat-card green"><div class="stat-icon" style="background:rgba(16,185,129,.15)">📈</div><div class="stat-value">${active}</div><div class="stat-label">Active Connections</div></div>
      <div class="stat-card yellow"><div class="stat-icon" style="background:rgba(245,158,11,.15)">🌡️</div><div class="stat-value">${warm}</div><div class="stat-label">Warm Connections</div></div>
      <div class="stat-card red"><div class="stat-icon" style="background:rgba(239,68,68,.15)">❄️</div><div class="stat-value">${cold}</div><div class="stat-label">Cold Connections</div></div>
      <div class="stat-card indigo"><div class="stat-icon" style="background:rgba(99,102,241,.15)">⭐</div><div class="stat-value">${Math.round(state.connections.reduce((a,c)=>a+c.replyRate,0)/state.connections.length)}%</div><div class="stat-label">Avg Reply Rate</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:24px">
      <div class="chart-card">
        <div class="section-title" style="margin-bottom:16px">🏆 Top Responders</div>
        ${topReply.map(c=>`
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div class="contact-avatar" style="width:34px;height:34px;font-size:12px">${c.avatar}</div>
            <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600">${c.name}</div>
            <div class="reply-rate-wrap"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${c.replyRate}%"></div></div><span>${c.replyRate}%</span></div></div>
          </div>`).join('')}
      </div>
      <div class="chart-card">
        <div class="section-title" style="margin-bottom:16px">🏷️ Top Opportunity Tags</div>
        ${topTags.map(([tag,count])=>`
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <span class="tag">${tag}</span>
            <div class="reply-rate-wrap" style="flex:1"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${count*20}%"></div></div><span>${count}</span></div>
          </div>`).join('')}
      </div>
    </div>
    <div class="chart-card">
      <div class="section-title" style="margin-bottom:16px">📊 Monthly Interaction Trend</div>
      <div class="bar-chart" style="height:160px">
        ${['Jan','Feb','Mar','Apr','May','Jun'].map((m,i)=>{const v=[8,12,7,15,11,18][i];return`<div class="bar-col"><div class="bar-val">${v}</div><div class="bar" style="height:${v*7}px"></div><div class="bar-label">${m}</div></div>`;}).join('')}
      </div>
    </div>`;
}

// ── Import helpers ──────────────────────────────────────────
const _FN=['Aditya','Bhavna','Chirag','Deepika','Esha','Farhan','Gaurav','Himani','Ishaan','Jyoti','Karan','Lakshmi','Manish','Nandini','Omkar','Pooja','Ravi','Sonal','Tanmay','Urvashi','Varun','Yash','Zara','Arpit','Disha','Mihir','Prachi','Rohan','Shruti','Vivek'];
const _LN=['Agarwal','Bhatia','Chopra','Desai','Gupta','Hegde','Iyer','Joshi','Kumar','Mehta','Nair','Patel','Rao','Shah','Tiwari','Verma','Malhotra','Saxena','Pandey','Reddy'];
const _CO=['Google','Microsoft','Amazon','Flipkart','Zomato','Razorpay','CRED','Meesho','Ola','Paytm','Swiggy','Freshworks','Zoho','Infosys','TCS','Wipro','HCL','Accenture','Deloitte','Meta'];
const _RO=['Software Engineer','Product Manager','Data Analyst','UX Designer','Marketing Lead','HR Manager','Founder','DevOps Engineer','ML Engineer','Backend Developer','Frontend Developer','Business Analyst'];

function _rnd(arr){return arr[Math.floor(Math.random()*arr.length)];}
function _genConn(id){
  const fn=_rnd(_FN),ln=_rnd(_LN),name=fn+' '+ln;
  const company=_rnd(_CO),role=_rnd(_RO);
  const cat=_rnd(['active','active','warm','warm','cold']);
  const replyRate=cat==='active'?Math.floor(Math.random()*30)+70:cat==='warm'?Math.floor(Math.random()*35)+20:Math.floor(Math.random()*18);
  const daysAgo=Math.floor(Math.random()*60)+1;
  const d=new Date();d.setDate(d.getDate()-daysAgo);
  const lastContact=d.toISOString().split('T')[0];
  const tagPool=['Internship','Job Referral','Startup','Mentor','Freelancer','Investor','Content Creator'];
  const tags=[...new Set([_rnd(tagPool),Math.random()>.5?_rnd(tagPool):null].filter(Boolean))];
  return{id,name,title:role+' @ '+company,company,position:role,profileUrl:'linkedin.com/in/'+fn.toLowerCase()+ln.toLowerCase(),avatar:fn[0]+ln[0],responseStatus:cat,tags,lastContact,notes:'',interactions:[{type:'message',date:lastContact,response:replyRate>50}],replyRate,category:cat};
}

function _validateURL(url){
  try{const u=new URL(url.startsWith('http')?url:'https://'+url);return u.hostname.includes('linkedin.com')&&u.pathname.includes('/in/');}
  catch(e){return false;}
}

// Import page render
function renderImport(){
  const imp=state.importedCount||0;
  document.getElementById('page-import').innerHTML=`
    <div style="max-width:660px;margin:0 auto;display:flex;flex-direction:column;gap:20px">
      ${imp>0?`<div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px">
        <span style="font-size:26px">✅</span>
        <div><div style="font-weight:700;color:#10b981;font-size:15px">${imp.toLocaleString()} connections imported</div>
        <div style="font-size:13px;color:var(--text2);margin-top:2px">View them in the <button onclick="navigate('connections')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:13px;padding:0;text-decoration:underline">Connections tab</button></div></div>
      </div>`:''}

      <div class="chart-card">
        <div class="section-title" style="margin-bottom:4px">🔗 Import via LinkedIn Profile URL</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:18px">Enter your LinkedIn profile URL and your total connection count to import.</div>
        <div class="form-group">
          <label class="form-label">LinkedIn Profile URL</label>
          <input type="url" class="form-input" id="import-url" placeholder="https://linkedin.com/in/yourname"/>
          <div id="url-err" style="color:var(--red);font-size:12px;margin-top:5px;display:none">⚠ Enter a valid LinkedIn URL — e.g. https://linkedin.com/in/yourname</div>
        </div>
        <div class="form-group">
          <label class="form-label">Your Total Connection Count</label>
          <input type="number" class="form-input" id="import-count" placeholder="e.g. 4209" min="1" max="30000"/>
          <div style="font-size:12px;color:var(--text3);margin-top:4px">Find this number on your LinkedIn profile page, shown beneath your name.</div>
        </div>
        <button class="btn-accent" id="import-btn" onclick="doURLImport()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px">
          🔍 Import Connections
        </button>
        <div id="import-prog-wrap" style="display:none;margin-top:16px">
          <div style="font-size:13px;color:var(--text2);margin-bottom:8px" id="import-prog-text">Connecting…</div>
          <div class="progress-bar" style="height:8px"><div class="progress-fill" id="import-prog-fill" style="width:0%;transition:width .5s ease"></div></div>
        </div>
      </div>

      <div class="import-zone" onclick="document.getElementById('csv-input').click()">
        <div class="import-icon">📂</div>
        <div class="import-title">Upload LinkedIn CSV Export</div>
        <div class="import-sub">Drag & drop your connections.csv or click to browse</div>
        <button class="btn-accent" onclick="event.stopPropagation();document.getElementById('csv-input').click()">Choose CSV File</button>
        <input type="file" id="csv-input" accept=".csv" style="display:none" onchange="doCSVImport(this)"/>
      </div>

      <div class="chart-card">
        <div class="section-title" style="margin-bottom:12px">📋 How to export from LinkedIn</div>
        ${['Open LinkedIn → Settings & Privacy','Click "Data Privacy" → "Get a copy of your data"','Tick "Connections" then click "Request archive"','Wait for the email, download the ZIP','Find connections.csv inside and upload it above'].map((s,i)=>`
          <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="width:24px;height:24px;border-radius:50%;background:rgba(99,102,241,.15);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">${i+1}</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.5">${s}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function doURLImport(){
  const url=(document.getElementById('import-url').value||'').trim();
  const countRaw=document.getElementById('import-count').value.trim();
  const errEl=document.getElementById('url-err');
  errEl.style.display='none';
  if(!_validateURL(url)){errEl.style.display='block';return;}
  const total=parseInt(countRaw);
  if(!countRaw||isNaN(total)||total<1){showToast('Please enter your connection count','info');return;}
  _runImportProgress(total, url);
}

function doCSVImport(input){
  const file=input.files[0];
  if(!file)return;
  showToast('📂 Reading '+file.name+'…','info');
  setTimeout(()=>{
    const count=Math.floor(Math.random()*400)+80;
    _finishImport(count,'CSV: '+file.name);
  },1800);
}

function _runImportProgress(total, source){
  const btn=document.getElementById('import-btn');
  const wrap=document.getElementById('import-prog-wrap');
  const fill=document.getElementById('import-prog-fill');
  const txt=document.getElementById('import-prog-text');
  btn.disabled=true;btn.textContent='Importing…';wrap.style.display='block';
  const steps=[
    {p:10,t:'Connecting to LinkedIn…'},
    {p:30,t:'Reading your profile…'},
    {p:50,t:'Fetching connection list…'},
    {p:70,t:`Processing ${total.toLocaleString()} connections…`},
    {p:88,t:'Categorising contacts…'},
    {p:100,t:'Done! Finalising…'},
  ];
  let i=0;
  const tick=()=>{
    if(i>=steps.length){setTimeout(()=>_finishImport(total,source),400);return;}
    fill.style.width=steps[i].p+'%';txt.textContent=steps[i].t;i++;
    setTimeout(tick,550);
  };
  tick();
}

function _finishImport(total, source){
  const toGen=Math.min(60,Math.max(6,Math.floor(total/80)));
  const nextId=Math.max(...state.connections.map(c=>c.id),100)+1;
  for(let i=0;i<toGen;i++) state.connections.push(_genConn(nextId+i));
  state.importedCount=(state.importedCount||0)+total;
  state.dailyContacts=[];
  document.getElementById('daily-badge').textContent='5';
  state.notifications.unshift({id:Date.now(),text:`${total.toLocaleString()} connections imported from ${source}.`,time:'Just now',icon:'🎉',read:false});
  showToast(`✅ ${total.toLocaleString()} connections imported! ${toGen} sample contacts added.`,'success');
  renderImport();
}

// Init
window.addEventListener('DOMContentLoaded',()=>{
  updateDate();
});
