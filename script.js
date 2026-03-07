/* ============================================================
   AICT Global Services — Script (v7)
   Regulatory Map, Scope Finder, Programs, Reference Library,
   Stepper, Guided Inquiry, Chatbot, Modals, Scroll Spy,
   Scroll Reveal
   ============================================================ */

// === REGULATORY MAP: many-to-many relationship graph ===

var MAP_EDGES = {
  'pipeda': ['m-priv', 'c-27001'],
  'prov': ['m-priv', 'c-27001'],
  'aida': ['m-ai', 'm-aisys', 'c-42001'],
  'defproc': ['m-def', 'c-cpcsc', 'c-27001'],
  'govproc': ['m-gov', 'c-cyber', 'c-27001'],
  'm-priv': ['pipeda', 'prov', 'c-27001'],
  'm-ai': ['aida', 'c-42001'],
  'm-def': ['defproc', 'c-cpcsc', 'c-27001'],
  'm-gov': ['govproc', 'c-cyber', 'c-27001'],
  'm-cloud': ['c-27001'],
  'm-aisys': ['aida', 'c-42001'],
  'c-27001': ['pipeda', 'prov', 'm-priv', 'defproc', 'm-def', 'govproc', 'm-gov', 'm-cloud'],
  'c-42001': ['aida', 'm-ai', 'm-aisys'],
  'c-cyber': ['govproc', 'm-gov'],
  'c-cpcsc': ['defproc', 'm-def']
};

var allMapEls = document.querySelectorAll('.rm-i, .rm-l');
var mapById = {};
allMapEls.forEach(function(el) { mapById[el.dataset.id] = el; });

function hlMap(id) {
  var connected = new Set([id]);
  if (MAP_EDGES[id]) MAP_EDGES[id].forEach(function(x) { connected.add(x); });
  allMapEls.forEach(function(el) {
    el.classList.toggle('hl', connected.has(el.dataset.id));
  });
}

function clrMap() {
  allMapEls.forEach(function(el) { el.classList.remove('hl'); });
}

allMapEls.forEach(function(el) {
  el.addEventListener('mouseenter', function() { hlMap(el.dataset.id); });
  el.addEventListener('mouseleave', clrMap);
});

// Click map item -> scroll to program
function mapClick(pid) {
  document.getElementById(pid).scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(function() { tP(pid); }, 400);
}


// === SCOPE FINDER ===

var SD = {
  // AICT accredited scope
  '27001': { n: 'ISO/IEC 27001', t: 'Certification', cl: '#2563EB', tg: ['saas', 'ai', 'govt', 'def', 'sme', 'pii', 'msp', 'health', 'fin', 'crit', 'edu', 'iot', 'mfg', 'telco', 'energy', 'cloud', 'auto'] },
  '42001': { n: 'ISO/IEC 42001', t: 'Certification', cl: '#7C3AED', tg: ['ai', 'edu'] },
  'cs':    { n: 'CyberSecure Canada', t: 'Certification', cl: '#059669', tg: ['govt', 'sme', 'ai', 'iot', 'mfg', 'telco', 'energy'] },
  'cpcsc': { n: 'CPCSC', t: 'Inspection', cl: '#D97706', tg: ['def'] },
  // Certification extensions
  '27701': { n: 'ISO/IEC 27701', t: 'Certification', cl: '#2563EB', tg: ['saas', 'pii', 'health', 'fin', 'edu', 'telco', 'cloud'] },
  '27017': { n: 'ISO/IEC 27017', t: 'Extension', cl: '#2563EB', tg: ['saas', 'msp', 'telco', 'cloud'] },
  '27018': { n: 'ISO/IEC 27018', t: 'Extension', cl: '#2563EB', tg: ['saas', 'pii', 'msp', 'telco', 'cloud'] },
  '27019': { n: 'ISO/IEC 27019', t: 'Extension', cl: '#2563EB', tg: ['energy'] },
  // Related management systems
  '20000': { n: 'ISO/IEC 20000-1', t: 'Certification', cl: '#0369A1', tg: ['saas', 'msp', 'telco', 'cloud'] },
  '22301': { n: 'ISO 22301', t: 'Certification', cl: '#0369A1', tg: ['saas', 'msp', 'health', 'fin', 'crit', 'mfg', 'telco', 'energy', 'cloud', 'auto'] },
  '62443': { n: 'IEC 62443', t: 'Assessment', cl: '#D97706', tg: ['crit', 'iot', 'mfg', 'telco', 'energy', 'auto'] },
  // Industry standards
  'soc2':  { n: 'SOC 2', t: 'Assurance', cl: '#64748B', tg: ['saas', 'msp', 'fin', 'edu', 'telco', 'cloud'] },
  'csa':   { n: 'CSA STAR', t: 'Attestation', cl: '#64748B', tg: ['saas', 'msp', 'cloud'] },
  'pci':   { n: 'PCI DSS', t: 'Certification', cl: '#64748B', tg: ['fin'] },
  'nerc':  { n: 'NERC CIP', t: 'Regulatory', cl: '#64748B', tg: ['energy'] },
  'tisax': { n: 'TISAX', t: 'Assessment', cl: '#64748B', tg: ['iot', 'mfg', 'auto'] },
  // Additional standards
  'pbmm':  { n: 'PBMM', t: 'Assessment', cl: '#64748B', tg: ['govt', 'msp', 'def'] },
  'swift': { n: 'SWIFT CSP', t: 'Compliance', cl: '#64748B', tg: ['fin'] },
  'cc':    { n: 'Common Criteria', t: 'Evaluation', cl: '#64748B', tg: ['def', 'govt', 'iot'] },
  'fips':  { n: 'FIPS 140-3', t: 'Validation', cl: '#64748B', tg: ['def', 'govt'] }
};

var selT = [];

function tO(el) {
  el.classList.toggle('on');
  var t = el.dataset.t;
  if (selT.indexOf(t) !== -1) {
    selT = selT.filter(function(x) { return x !== t; });
  } else {
    selT.push(t);
  }
  uF();
}

function uF() {
  var r = document.getElementById('sfR');
  var cta = document.getElementById('sfCta');
  if (!selT.length) {
    r.innerHTML = '<div class="sf-empty">Select one or more to see applicable programs</div>';
    cta.classList.remove('show');
    return;
  }
  var m = Object.values(SD).filter(function(s) {
    return s.tg.some(function(t) { return selT.indexOf(t) !== -1; });
  });
  if (!m.length) {
    r.innerHTML = '<div class="sf-empty">Contact us to discuss requirements.</div>';
    cta.classList.remove('show');
    return;
  }
  r.innerHTML = m.map(function(s) {
    return '<div class="sfr"><div class="sfr-d" style="background:' + s.cl + '"></div><div class="sfr-n">' + s.n + '</div><div class="sfr-t">' + s.t + '</div></div>';
  }).join('');
  cta.classList.add('show');
}

function prefill() {
  var m = Object.values(SD).filter(function(s) {
    return s.tg.some(function(t) { return selT.indexOf(t) !== -1; });
  });
  var n = m.map(function(s) { return s.n; }).join(', ');
  setTimeout(function() {
    // Skip to step 2 with context
    iqIntent = 'Scope finder inquiry';
    iqPrograms = m.map(function(s) { return s.n; });
    for (var i = 0; i < 3; i++) {
      document.getElementById('iqs' + i).style.display = i === 2 ? 'block' : 'none';
      var d = document.getElementById('iqd' + i);
      d.classList.toggle('act', i === 2);
      d.classList.toggle('done', i < 2);
    }
    document.getElementById('msgF').value = 'Interested in: ' + n + '. Profile: ' + selT.join(', ') + '.';
  }, 400);
}


// === GUIDED INQUIRY ===

var iqIntent = '', iqPrograms = [];

function pickIq(btn, val) {
  btn.parentElement.querySelectorAll('.iq-opt').forEach(function(b) { b.classList.remove('on'); });
  btn.classList.add('on');
  iqIntent = val;
  document.getElementById('iqIntentField').value = val;
  if (val === 'Inspection') {
    iqPrograms = ['CPCSC'];
    document.getElementById('iqProgramsField').value = 'CPCSC';
    setTimeout(function() { nextIq(2); }, 250);
  } else {
    setTimeout(function() { nextIq(1); }, 250);
  }
}

function togIqM(btn) {
  btn.classList.toggle('on');
  iqPrograms = [];
  btn.parentElement.querySelectorAll('.iq-opt.on').forEach(function(b) { iqPrograms.push(b.dataset.v); });
  document.getElementById('iqNext1').style.display = iqPrograms.length ? 'inline-flex' : 'none';
  document.getElementById('iqProgramsField').value = iqPrograms.join(', ');
}

function nextIq(step) {
  for (var i = 0; i < 3; i++) {
    document.getElementById('iqs' + i).style.display = i === step ? 'block' : 'none';
    var d = document.getElementById('iqd' + i);
    d.classList.toggle('act', i === step);
    d.classList.toggle('done', i < step);
  }
  if (step === 2 && iqPrograms.length) {
    var existing = document.getElementById('msgF').value;
    if (!existing) document.getElementById('msgF').value = iqIntent + '. Programs: ' + iqPrograms.join(', ') + '.';
  }
}


// === PROGRAM ACCORDIONS ===

function tP(id) {
  var el = document.getElementById(id);
  var wasOpen = el.classList.contains('open');
  document.querySelectorAll('.pg').forEach(function(p) {
    p.classList.remove('open');
    p.querySelector('.pg-body').style.maxHeight = '0';
  });
  if (!wasOpen) {
    el.classList.add('open');
    el.querySelector('.pg-body').style.maxHeight = '1200px';
  }
}


// === REFERENCE LIBRARY ===

var curCat = 'all';

function sC(btn) {
  document.querySelectorAll('.ref-cat').forEach(function(b) { b.classList.remove('on'); });
  btn.classList.add('on');
  curCat = btn.dataset.cat;
  fR();
}

function fR() {
  var q = document.getElementById('refS').value.toLowerCase().trim();
  var cards = document.querySelectorAll('.ref-card');
  var labels = document.querySelectorAll('.ref-group-label');
  var isSearching = q || curCat !== 'all';
  var grid = document.getElementById('refG');
  var more = document.getElementById('refMore');
  var v = 0;
  cards.forEach(function(c) {
    var mc = curCat === 'all' || c.dataset.cat === curCat;
    var ms = !q || c.dataset.q.indexOf(q) !== -1 || c.querySelector('h4').textContent.toLowerCase().indexOf(q) !== -1;
    if (mc && ms) {
      c.classList.remove('hidden');
      if (isSearching) c.style.display = '';
      v++;
    } else {
      c.classList.add('hidden');
    }
  });
  labels.forEach(function(l) {
    if (isSearching) { l.style.display = 'none'; }
    else { l.style.display = ''; }
  });
  document.getElementById('refE').style.display = v ? 'none' : 'block';
  if (isSearching) {
    grid.classList.add('expanded');
    document.getElementById('refMoreTxt').textContent = 'Collapse library';
  }
}

function togRef() {
  var grid = document.getElementById('refG');
  var expanded = grid.classList.toggle('expanded');
  document.getElementById('refMoreTxt').textContent = expanded ? 'Collapse library' : 'Expand library';
}


// === CHATBOT VISUAL CONFIRMATION ===

function flashChat() {
  var fab = document.getElementById('chFab');
  fab.style.transform = 'scale(1.15)';
  fab.style.boxShadow = '0 0 0 4px rgba(13,148,136,.3)';
  setTimeout(function() { fab.style.transform = ''; fab.style.boxShadow = ''; }, 600);
}

function chatAsk(q) {
  var w = document.getElementById('chW');
  var fab = document.getElementById('chFab');
  if (!w.classList.contains('op')) { w.classList.add('op'); fab.classList.add('op'); }
  flashChat();
  document.getElementById('chIn').value = q;
  sM();
}


// === PROCESS STEPPER (crossfade) ===

var STEPS = {
  cert: [
    { t: 'Inquiry and Eligibility', d: 'Initial discussion to understand your organization, scope, and objectives. We screen eligibility against program rules and help you understand what to expect.', n: 'Typical duration: 1-2 weeks. No commitment required.' },
    { t: 'Application and Scope', d: 'Formal application. Scope definition and confirmation. Audit team assigned with competency verification and conflict-of-interest screening.', n: 'Contract and scope agreed before any assessment activities begin.' },
    { t: 'Stage 1 -- Readiness Review', d: 'Documentation and management system review. Gap identification before formal audit. Scope boundaries and audit planning confirmed.', n: 'Identifies readiness issues early. Reduces risk of major findings at Stage 2.' },
    { t: 'Stage 2 -- Assessment', d: 'On-site or remote assessment of implementation effectiveness. Evidence-based evaluation against every applicable requirement. Findings documented and classified.', n: 'The core assessment. Auditors verify what is documented is implemented and effective.' },
    { t: 'Independent Certification Decision', d: 'Decision made by qualified personnel who did not conduct the audit. Structural separation between assessment and decision ensures objectivity.', n: 'This is non-negotiable. The decision-maker is always independent of the audit team.' },
    { t: 'Surveillance and Recertification', d: 'Annual surveillance maintains certification. Full recertification at three years. Continuous conformity, not a point-in-time check.', n: 'Surveillance covers a subset each year. Full scope covered across the cycle.' }
  ],
  insp: [
    { t: 'Inquiry and Eligibility', d: 'Initial contact to determine inspection scope, applicable CPCSC requirements, and eligibility. We explain the inspection process and what evidence will be required.', n: 'Typical duration: 1-2 weeks. No commitment required at this stage.' },
    { t: 'Application and Contract', d: 'Formal application with scope details. Contract defines inspection parameters, applicable scheme rules, and reporting obligations. Inspector assignment with competency and impartiality checks.', n: 'Inspection scope and contract finalized before any on-site activities.' },
    { t: 'Inspection Planning', d: 'Inspection plan developed covering locations, processes, and evidence requirements. Sampling strategy defined per scheme rules. Client notified of schedule and preparation requirements.', n: 'Planning ensures efficient and thorough coverage of all applicable requirements.' },
    { t: 'On-site Inspection', d: 'Physical verification of controls, processes, and security measures against CPCSC requirements. Evidence collected through observation, documentation review, and interviews with key personnel.', n: 'Inspections are evidence-based. Findings are documented and classified on-site.' },
    { t: 'Inspection Report', d: 'Formal report detailing findings, non-conformities, and observations. Report issued to client with classification of each finding and required corrective actions where applicable.', n: 'Reports follow ISO/IEC 17020 requirements for content, accuracy, and traceability.' },
    { t: 'Decision and Ongoing Monitoring', d: 'Independent review of inspection results. Decision on conformity status. Ongoing monitoring schedule established per scheme rules with periodic re-inspection.', n: 'Decision-maker is independent of the inspector. Re-inspection frequency set by scheme requirements.' }
  ]
};

var curStep = { cert: 0, insp: 0 };
var curLc = 'cert';

function swLc(mode) {
  if (mode === curLc) return;
  curLc = mode;
  document.querySelectorAll('#process .lc-tab').forEach(function(t) {
    t.classList.toggle('act', t.dataset.lc === mode);
  });
  document.getElementById('lcCert').style.display = mode === 'cert' ? 'block' : 'none';
  document.getElementById('lcInsp').style.display = mode === 'insp' ? 'block' : 'none';
}

function swGv(mode) {
  document.querySelectorAll('#governance .lc-tab').forEach(function(t) {
    t.classList.toggle('act', t.dataset.gv === mode);
  });
  document.getElementById('gvCert').style.display = mode === 'cert' ? 'block' : 'none';
  document.getElementById('gvInsp').style.display = mode === 'insp' ? 'block' : 'none';
}

function sS(i, mode) {
  mode = mode || 'cert';
  if (i === curStep[mode]) return;
  curStep[mode] = i;
  var container = mode === 'cert' ? document.getElementById('stepper') : document.getElementById('stepperInsp');
  container.querySelectorAll('.step').forEach(function(s, j) {
    s.classList.toggle('act', j === i);
  });
  var tId = mode === 'cert' ? 'sdT' : 'sdTi';
  var dId = mode === 'cert' ? 'sdD' : 'sdDi';
  var nId = mode === 'cert' ? 'sdN' : 'sdNi';
  var iId = mode === 'cert' ? 'sdI' : 'sdIi';
  var inner = document.getElementById(iId);
  inner.classList.add('fading');
  setTimeout(function() {
    document.getElementById(tId).textContent = STEPS[mode][i].t;
    document.getElementById(dId).textContent = STEPS[mode][i].d;
    document.getElementById(nId).textContent = STEPS[mode][i].n;
    inner.classList.remove('fading');
  }, 200);
}


// === ADVISOR FLOW ===

var advState = { initiative: '', industry: '', dept: '' };

function advPick(step, btn) {
  var val = btn.textContent;
  btn.classList.add('picked');

  // Disable siblings
  var sibs = btn.parentElement.querySelectorAll('.adv-o');
  sibs.forEach(function(s) { if (s !== btn) s.style.display = 'none'; });

  if (step === 0) {
    advState.initiative = val;
    setTimeout(function() {
      document.getElementById('advS1').style.display = '';
      scrollAdv();
    }, 250);
  } else if (step === 1) {
    advState.industry = val;
    setTimeout(function() {
      document.getElementById('advS2').style.display = '';
      scrollAdv();
    }, 250);
  } else if (step === 2) {
    advState.dept = val;
    setTimeout(function() {
      showAdvResult();
      scrollAdv();
    }, 250);
  }
}

function scrollAdv() {
  var ms = document.getElementById('chMs');
  setTimeout(function() { ms.scrollTop = ms.scrollHeight; }, 80);
}

function showAdvResult() {
  var r = document.getElementById('advResult');
  var rec = buildAdvRec(advState);
  r.innerHTML = rec;
  r.style.display = '';
}

function buildAdvRec(s) {
  var programs = [];
  var path = [];
  var context = '';
  var ind = s.industry.toLowerCase();
  var init = s.initiative.toLowerCase();
  var dept = s.dept.toLowerCase();

  // Program logic based on industry + initiative
  if (ind.indexOf('defence') !== -1 || ind.indexOf('aerospace') !== -1) {
    programs.push('CPCSC (inspection, required)');
    programs.push('ISO/IEC 27001 (certification)');
    programs.push('PBMM (Protected B environments)');
    context = 'Defence supply chain organizations require CPCSC inspection under ISO/IEC 17020 and ISO 27001 certification for information security. PBMM applies for Protected B data.';
  } else if (ind.indexOf('ai') !== -1 || init.indexOf('ai governance') !== -1) {
    programs.push('ISO/IEC 42001 (AI management, certification)');
    programs.push('ISO/IEC 27001 (information security foundation)');
    context = 'AI-focused organizations benefit from ISO 42001 for AI governance and lifecycle management, built on an ISO 27001 information security foundation. Aligned with anticipated AIDA requirements.';
  } else if (ind.indexOf('government') !== -1) {
    programs.push('CyberSecure Canada (certification)');
    programs.push('ISO/IEC 27001 (certification)');
    if (init.indexOf('procurement') !== -1) programs.push('PBMM (if handling Protected B)');
    context = 'Government suppliers are expected to demonstrate cybersecurity through CyberSecure Canada or ISO 27001 + PBMM. CyberSecure is an accessible starting point.';
  } else if (ind.indexOf('financial') !== -1) {
    programs.push('ISO/IEC 27001 (certification)');
    programs.push('PCI DSS (if payment processing)');
    programs.push('SWIFT CSP (if SWIFT-connected)');
    context = 'Financial services organizations typically need ISO 27001 as a foundation, supplemented by sector-specific requirements like PCI DSS or SWIFT CSP.';
  } else if (ind.indexOf('healthcare') !== -1) {
    programs.push('ISO/IEC 27001 (certification)');
    programs.push('ISO/IEC 27701 (privacy extension)');
    context = 'Healthcare organizations handling personal health information need ISO 27001 for security with 27701 for privacy management, mapping to PIPEDA and provincial health privacy laws.';
  } else if (ind.indexOf('energy') !== -1) {
    programs.push('ISO/IEC 27001 (certification)');
    programs.push('IEC 62443 (industrial control systems)');
    programs.push('NERC CIP (if bulk electric)');
    context = 'Energy and utility organizations combine ISO 27001 with IEC 62443 for industrial control system security and NERC CIP for regulatory compliance.';
  } else if (ind.indexOf('manufacturing') !== -1) {
    programs.push('ISO/IEC 27001 (certification)');
    programs.push('IEC 62443 (industrial systems)');
    context = 'Manufacturing organizations need ISO 27001 for information security and IEC 62443 for industrial automation and control system security.';
  } else if (ind.indexOf('telecom') !== -1) {
    programs.push('ISO/IEC 27001 (certification)');
    programs.push('ISO/IEC 27701 (privacy, subscriber data)');
    context = 'Telecommunications providers need ISO 27001 for infrastructure security and 27701 for subscriber data privacy management.';
  } else {
    // SaaS / Cloud / Other tech
    programs.push('ISO/IEC 27001 (certification)');
    if (init.indexOf('ai') !== -1) programs.push('ISO/IEC 42001 (AI management)');
    if (init.indexOf('regulatory') !== -1 || init.indexOf('procurement') !== -1) programs.push('CyberSecure Canada');
    context = 'Technology organizations typically start with ISO 27001 for information security management, adding scopes based on regulatory requirements and market expectations.';
  }

  // Add initiative-specific nuance
  if (init.indexOf('switching') !== -1) {
    context += ' Transferring from another certification body follows a streamlined process — existing certification evidence is considered.';
  } else if (init.indexOf('adding a scope') !== -1) {
    context += ' Adding a scope to an existing certification can often be assessed during surveillance, reducing additional audit time.';
  } else if (init.indexOf('security posture') !== -1) {
    context += ' A gap assessment against the target standard helps identify readiness and prioritize effort before formal certification.';
  }

  // Build path based on dept
  if (dept.indexOf('ciso') !== -1 || dept.indexOf('security') !== -1) {
    path = ['Scope the management system boundaries and controls', 'Risk assessment and treatment plan alignment', 'Stage 1 readiness review with your security team', 'Stage 2 assessment of implementation', 'Independent certification decision'];
  } else if (dept.indexOf('cto') !== -1 || dept.indexOf('engineering') !== -1) {
    path = ['Map technical architecture to certification scope', 'Identify control implementation across engineering systems', 'Stage 1 documentation and readiness review', 'Stage 2 assessment of technical controls', 'Independent certification decision'];
  } else if (dept.indexOf('compliance') !== -1 || dept.indexOf('legal') !== -1) {
    path = ['Regulatory mapping to applicable standards', 'Gap analysis against target certification requirements', 'Stage 1 documentation completeness review', 'Stage 2 conformity assessment', 'Independent certification decision'];
  } else if (dept.indexOf('ceo') !== -1 || dept.indexOf('executive') !== -1) {
    path = ['Executive briefing on scope, timeline, and investment', 'Internal team alignment and readiness preparation', 'Stage 1 readiness review', 'Stage 2 full assessment', 'Independent certification decision and market positioning'];
  } else if (dept.indexOf('procurement') !== -1 || dept.indexOf('ops') !== -1) {
    path = ['Identify procurement or contractual certification requirements', 'Scope certification to satisfy supply chain obligations', 'Stage 1 readiness review', 'Stage 2 implementation assessment', 'Independent certification decision'];
  } else {
    path = ['Scope and eligibility assessment', 'Readiness and gap identification', 'Stage 1 documentation review', 'Stage 2 implementation assessment', 'Independent certification decision'];
  }

  // Build HTML
  var h = '<div class="adv-res-title">Recommended pathway</div>';
  h += '<div class="adv-rec">' + context + '</div>';
  h += '<div class="adv-rec"><strong>Applicable programs:</strong><br>' + programs.join('<br>') + '</div>';
  h += '<div class="adv-path">';
  for (var i = 0; i < path.length; i++) {
    h += '<div class="adv-path-item"><span class="adv-path-num">' + (i + 1) + '</span>' + path[i] + '</div>';
  }
  h += '</div>';
  h += '<a href="#contact" class="adv-cta" onclick="prefillAdv()">Start an inquiry</a>';
  h += '<br><button class="adv-restart" onclick="resetAdv()">Start over</button>';
  h += '<div style="font-size:9.5px;color:var(--ink4);margin-top:8px;font-style:italic">Informational only. Not a conformity assessment decision.</div>';
  return h;
}

function prefillAdv() {
  var msg = document.getElementById('msgF');
  if (msg) {
    msg.value = 'Initiative: ' + advState.initiative + '\nIndustry: ' + advState.industry + '\nDepartment: ' + advState.dept;
  }
  tC(); // close chatbot
}

function resetAdv() {
  advState = { initiative: '', industry: '', dept: '' };
  document.getElementById('advS0').style.display = '';
  document.getElementById('advS1').style.display = 'none';
  document.getElementById('advS2').style.display = 'none';
  document.getElementById('advResult').style.display = 'none';

  // Reset all buttons
  document.querySelectorAll('.adv-o').forEach(function(b) {
    b.classList.remove('picked');
    b.style.display = '';
  });

  // Reset step 0 display
  var opts0 = document.getElementById('advS0').querySelector('.adv-opts');
  if (opts0) opts0.querySelectorAll('.adv-o').forEach(function(b) { b.style.display = ''; });

  scrollAdv();
}


// === CHATBOT ===

function tC() {
  document.getElementById('chW').classList.toggle('op');
  document.getElementById('chFab').classList.toggle('op');
}

function aQ(q) {
  document.getElementById('chIn').value = q;
  sM();
}

var KB = [
  // ISO 42001
  {
    k: ['42001', 'ai management', 'ai certif', 'ai governance cert', 'ai standard'],
    a: 'ISO/IEC 42001:2023 is the international standard for AI Management Systems. It defines requirements for governance, risk management, lifecycle controls, responsible AI practices, and monitoring for organizations developing, providing, or using AI. It is the first certifiable standard specifically for AI management.',
    f: ['Evidence for 42001?', 'AIDA / AIMS and 42001', 'Certification timeline']
  },
  // ISO 27001
  {
    k: ['27001', 'isms', 'information security management', 'infosec cert'],
    a: 'ISO/IEC 27001:2022 defines requirements for an ISMS. Risk-based approach with Annex A controls across organizational, people, physical, and technological domains. Three-year certification cycle: Stage 1 readiness, Stage 2 assessment, annual surveillance, recertification.',
    f: ['ISO 27001 vs SOC 2', 'Related standards', 'Evidence required']
  },
  // CyberSecure Canada
  {
    k: ['cybersecure', 'cyber secure', 'cybersecure canada'],
    a: 'CyberSecure Canada is a Government of Canada certification program for SMEs. Validates baseline cybersecurity across thirteen control areas including incident response, access control, patching, malware protection, and awareness. Certified by SCC-accredited bodies.',
    f: ['CyberSecure vs 27001', '13 control areas', 'Timeline']
  },
  // CPCSC / Defence Procurement
  {
    k: ['cpcsc', 'defence supply', 'defense supply', 'defence contract', 'defence procurement', 'defense procurement'],
    a: 'The Canadian Program for Cyber Security Certification ensures defence supply chain organizations implement defined cybersecurity practices. AICT performs inspection under SCC IBAP accreditation per ISO/IEC 17020. Defence procurement maps to CPCSC + ISO/IEC 27001 + PBMM (for Protected B environments). Status: Required. CPCSC inspection is the regulated component.',
    f: ['Inspection vs certification', 'PBMM', 'Defence requirements']
  },
  // PIPEDA
  {
    k: ['pipeda', 'private sector privacy', 'privacy law canada', 'canadian privacy'],
    a: 'PIPEDA governs private-sector commercial activities federally. Core principles: consent, safeguards, breach notification, accountability. Applies where no substantially similar provincial law exists. Maps to ISO/IEC 27701 + ISO/IEC 27001 + ISO/IEC 27018 for privacy management, information security, and cloud PII protection.',
    f: ['Provincial privacy', 'ISO 27701', 'BC PIPA vs PIPEDA']
  },
  // AIDA
  {
    k: ['aida', 'aims', 'bill c-27', 'artificial intelligence and data act', 'ai regulation canada', 'companion regulation'],
    a: 'AIDA (Artificial Intelligence and Data Act) is proposed Canadian legislation under Bill C-27 to regulate high-impact AI systems with governance, risk management, documentation, and monitoring obligations. Not yet enacted. Maps to ISO/IEC 42001 + ISO/IEC 27001 (foundation). Status: Recommended. ISO/IEC 42001 provides a certifiable framework aligned with anticipated AIDA requirements.',
    f: ['42001 certification', 'EU AI Act', 'High-impact AI']
  },
  // SOC 2 vs ISO
  {
    k: ['soc 2', 'soc2', 'vs soc'],
    a: 'SOC 2 produces an attestation report (not certification) based on Trust Services Criteria, issued by CPA firms. ISO 27001 produces formal certification by an accredited CAB. SOC 2 is primarily North American; ISO 27001 is international. Different purposes -- many organizations pursue both.',
    f: ['Which should I choose?', 'ISO 27001 process', 'CyberSecure starting point']
  },
  // Certification process
  {
    k: ['certification process', 'how does cert', 'how certification', 'steps', 'stage 1', 'stage 2'],
    a: 'Certification lifecycle under ISO/IEC 17021-1: (1) Inquiry and eligibility, (2) Application and scope confirmation, (3) Stage 1 readiness review, (4) Stage 2 assessment of implementation, (5) Independent certification decision by personnel who did not audit, (6) Annual surveillance and three-year recertification. For inspection-based programs like CPCSC, a separate lifecycle applies under ISO/IEC 17020.',
    f: ['Inspection process', 'Stage 1 vs Stage 2', 'Evidence needed']
  },
  // Provincial privacy
  {
    k: ['provincial', 'pipa', 'law 25', 'quebec', 'alberta privacy', 'bc privacy', 'foippa'],
    a: 'BC PIPA, Alberta PIPA, and Quebec Law 25 each maintain private-sector privacy regimes substantially similar to PIPEDA. They apply for intra-provincial commercial activities. Law 25 adds enhanced breach rules and privacy impact assessment requirements. Maps to ISO/IEC 27701 + ISO/IEC 27001 + ISO/IEC 27018 + ISO/IEC 27017.',
    f: ['BC PIPA vs PIPEDA', 'Law 25 details', 'ISO 27701']
  },
  // About AICT
  {
    k: ['what does aict', 'about aict', 'who are you', 'what do you do', 'what programs'],
    a: 'AICT Global Services is an independent conformity assessment body accredited by the Standards Council of Canada. We perform assessment, inspection, and certification focused exclusively on technology. Our accredited scope includes ISO/IEC 27001, ISO/IEC 42001, CyberSecure Canada, and CPCSC. AICT does not provide consulting, implementation, or advisory services.',
    f: ['Programs detail', 'Governance', 'Start an inquiry']
  },
  // NIST
  {
    k: ['nist', 'csf', 'cybersecurity framework'],
    a: 'NIST CSF organizes outcomes into Identify, Protect, Detect, Respond, Recover. Voluntary framework. Maps significantly to ISO 27001 controls. Referenced by CyberSecure Canada and CPCSC.',
    f: ['NIST vs ISO 27001', 'CIS Controls', 'Which framework?']
  },
  // Timelines
  {
    k: ['how long', 'timeline', 'how quickly'],
    a: 'Timelines depend on readiness and scope. Stage 1 can be scheduled within weeks. End-to-end: 2-6 months for most technology organizations. Preparation is typically the largest variable.',
    f: ['Start an inquiry', 'What to prepare', 'Process overview']
  },
  // Independence / impartiality
  {
    k: ['independence', 'impartial', 'no consulting', 'conflict'],
    a: 'AICT maintains structural independence between assessment and certification decisions. The person making a certification decision is never the person who conducted the audit. A two-year cooling-off period applies for prior consulting relationships. AICT does not provide consulting, implementation, or advisory services -- this is a structural requirement of our accreditation.',
    f: ['Governance', 'Complaints process', 'Accreditation']
  },
  // Evidence / documentation
  {
    k: ['evidence', 'documentation', 'what do i need', 'prepare', 'readiness'],
    a: 'Varies by standard. ISO 27001: security policies, risk assessments, treatment plans, asset inventories, access controls, incident records, internal audits. ISO 42001: AI governance policies, AI risk assessments, lifecycle docs, monitoring. CyberSecure: 13 control domains.',
    f: ['27001 evidence', '42001 evidence', 'Start an inquiry']
  },
  // Accreditation / SCC
  {
    k: ['accredit', 'scc', 'standards council', 'trust chain', 'iaf', 'ilac'],
    a: 'Accredited by SCC under MSAP (ISO 27001, 42001 certification) and IBAP (CPCSC inspection). CyberSecure in scope. Through IAF/ILAC multilateral recognition, certifications carry international standing.',
    f: ['What is SCC?', 'International recognition', 'Programs']
  },
  // Which framework to choose
  {
    k: ['which framework', 'which standard', 'recommend', 'choose', 'what should'],
    a: 'Depends on context. Government supplier: CyberSecure Canada or ISO 27001 + PBMM. Defence: CPCSC required. Global customers: ISO 27001. AI systems: ISO 42001. Financial: PCI DSS or SWIFT CSP. Automotive: TISAX. Energy: NERC CIP + IEC 62443. Critical infrastructure: IEC 62443. Many pursue multiple through integrated audits.',
    f: ['Start an inquiry', 'Regulatory landscape', 'Integrated audits']
  },
  // EU AI Act
  {
    k: ['eu ai act', 'european', 'eu regulation'],
    a: 'EU AI Act: risk-based regulation with prohibited, high-risk, limited, minimal categories. Applies in EU but key international reference. ISO 42001 aligns with governance expectations for high-risk systems.',
    f: ['42001 details', 'AIDA / AIMS', 'OECD AI Principles']
  },
  // Inspection vs certification
  {
    k: ['inspection', '17020', 'difference inspection certification', 'assessment vs'],
    a: 'Certification (ISO/IEC 17021-1) formally determines management system conformity through a structured audit lifecycle: inquiry, application, Stage 1 readiness, Stage 2 assessment, independent decision, and surveillance. Inspection (ISO/IEC 17020) verifies specific controls, environments, and security measures through on-site evaluation: inquiry, application, planning, on-site inspection, report, and independent decision. AICT performs certification (ISO 27001, 42001, CyberSecure Canada) and inspection (CPCSC). Both require structural independence between assessment and decision functions.',
    f: ['Inspection process', 'Certification process', 'CPCSC']
  },
  // Inspection process
  {
    k: ['inspection process', 'how inspection', 'inspection lifecycle', 'inspection steps', 'cpcsc process'],
    a: 'Inspection lifecycle under ISO/IEC 17020: (1) Inquiry and eligibility screening, (2) Application and contract with inspector assignment, (3) Inspection planning covering locations, processes, and evidence requirements, (4) On-site inspection with physical verification of controls against CPCSC requirements, (5) Inspection report with findings and required corrective actions, (6) Independent decision on conformity status with ongoing monitoring schedule. Inspection reports are issued directly to clients and are not listed in the certificate register.',
    f: ['CPCSC', 'Inspection vs certification', 'Defence procurement']
  },
  // Cloud standards
  {
    k: ['cloud', '27017', '27018', 'saas security', 'cloud data hosting'],
    a: 'ISO 27017: cloud security controls. ISO 27018: cloud PII protection. Both extend 27002 and are auditable within a 27001 scope. Cloud / SaaS data hosting for Government of Canada maps to ISO/IEC 27001 + ISO/IEC 27017 + ISO/IEC 27018 + PBMM. Status: Expected. Essential for SaaS and cloud-dependent organizations.',
    f: ['27001 certification', '27701 privacy', 'PBMM']
  },

  // === EXPANDED KB (from Q&A Library / Deep Spec) ===

  // Conformity Assessment Body
  {
    k: ['conformity assessment', 'cab', 'certification body', 'what is a cab', 'assessment body'],
    a: 'A Conformity Assessment Body (CAB) performs conformity assessment services such as testing, inspection, or certification. CABs operate under accreditation from a national body (in Canada, SCC) which verifies competence, impartiality, and consistent operation. AICT is a CAB accredited for both management system certification (ISO/IEC 17021-1) and inspection (ISO/IEC 17020).',
    f: ['What is SCC?', 'How does accreditation work?', 'AICT programs']
  },
  // CyberSecure 13 control areas
  {
    k: ['13 control', 'control areas', 'cybersecure controls', 'baseline controls'],
    a: 'CyberSecure Canada covers 13 control areas: (1) Incident response plan, (2) Patching OS and applications, (3) Enable security software, (4) Securely configure devices, (5) Strong user authentication, (6) Employee awareness training, (7) Backup and encrypt data, (8) Secure mobility, (9) Perimeter security, (10) Secure cloud and outsourced IT, (11) Secure websites, (12) Access control and authorization, (13) Secure portable media.',
    f: ['CyberSecure vs ISO 27001', 'How to get certified', 'Who needs CyberSecure?']
  },
  // AI governance definition
  {
    k: ['ai governance', 'what is ai governance', 'govern ai', 'responsible ai'],
    a: 'AI governance refers to the policies, processes, and structures an organization uses to manage AI systems responsibly. It encompasses risk management, accountability, transparency, fairness, data governance, lifecycle management, and monitoring. ISO/IEC 42001 provides a certifiable management system framework for establishing AI governance.',
    f: ['ISO 42001 certification', 'AIDA / AIMS requirements', 'EU AI Act']
  },
  // International AI frameworks
  {
    k: ['international ai', 'oecd ai', 'global ai', 'ai frameworks', 'ai principles'],
    a: 'Key international AI governance instruments include: OECD AI Principles (adopted by 40+ countries), EU AI Act (risk-based regulation), NIST AI Risk Management Framework (Govern, Map, Measure, Manage), UNESCO Recommendation on Ethics of AI, and ISO/IEC 42001 (first certifiable AI management system standard). Canada\'s proposed AIDA / AIMS draws on many of these.',
    f: ['EU AI Act details', 'ISO 42001', 'AIDA / AIMS (Canada)']
  },
  // ISO 27001 evidence requirements (expanded)
  {
    k: ['27001 evidence', '27001 documentation', 'isms evidence', 'isms documentation', 'what auditors look for'],
    a: 'ISO 27001 auditors evaluate: information security policy, risk assessment methodology and results, risk treatment plan and Statement of Applicability, asset inventory, access control procedures, incident management records, business continuity plans, internal audit reports, management review minutes, competence records, monitoring and measurement records, and corrective action records.',
    f: ['Certification process', 'ISO 42001 evidence', 'Timeline']
  },
  // Complaints and appeals
  {
    k: ['complaint', 'appeal', 'file a complaint', 'dispute', 'disagree'],
    a: 'Any person or organization may file a complaint about AICT or a certified client. Complaints are acknowledged within 5 business days, investigated independently, and resolved within 30 business days. Appeals of certification decisions must be filed within 30 calendar days and are reviewed by individuals not involved in the original decision. Escalation to SCC is available.',
    f: ['Governance details', 'Independence', 'Contact AICT']
  },
  // Integrated audits
  {
    k: ['integrated', 'multiple certif', 'combined audit', 'joint audit'],
    a: 'Organizations pursuing multiple certifications (e.g., ISO 27001 + ISO 42001) can benefit from integrated audits. Common management system elements are assessed once, reducing audit time and cost. AICT can discuss integrated audit approaches during the inquiry phase.',
    f: ['Start an inquiry', 'ISO 27001', 'ISO 42001']
  },
  // 27701 / Privacy
  {
    k: ['27701', 'privacy management', 'pims', 'privacy extension', 'gdpr iso'],
    a: 'ISO/IEC 27701 extends ISO 27001 with privacy information management requirements. It maps to PIPEDA, GDPR, and other privacy regulations. Adds PII controller and processor controls, privacy risk assessment, and data subject rights processes. Requires an existing ISO 27001 ISMS as foundation.',
    f: ['PIPEDA requirements', 'ISO 27001', 'Provincial privacy laws']
  },
  // 27002 & 27005
  {
    k: ['27002', '27005', 'information security controls', 'risk management guidance', 'control guidance'],
    a: 'ISO/IEC 27002 provides implementation guidance for the controls referenced in ISO 27001 Annex A. ISO/IEC 27005 provides guidance on information security risk management processes. Both are supporting standards — not independently certifiable — but essential references when building and auditing an ISMS.',
    f: ['ISO 27001 certification', 'Evidence required', 'Risk assessment']
  },
  // 22301 & 20000-1
  {
    k: ['22301', '20000', 'business continuity', 'bcms', 'it service management', 'itsm', 'service management'],
    a: 'ISO 22301 defines requirements for a Business Continuity Management System (BCMS) — planning, response, and recovery from disruptions. ISO/IEC 20000-1 defines requirements for an IT Service Management System (SMS). Both are certifiable management system standards that complement ISO 27001 for technology organizations seeking comprehensive operational resilience.',
    f: ['ISO 27001', 'Integrated audits', 'Start an inquiry']
  },
  // CIS Controls & COBIT
  {
    k: ['cis controls', 'cis', 'cobit', 'it governance framework', 'prioritized controls'],
    a: 'CIS Critical Security Controls are a prioritized set of cybersecurity actions organized by implementation maturity. COBIT is an IT governance and management framework. Both are voluntary reference frameworks — not certifiable — but map to ISO 27001 controls and are useful for benchmarking security posture and IT governance maturity.',
    f: ['NIST CSF', 'ISO 27001', 'Which framework?']
  },
  // Privacy Act (federal public sector)
  {
    k: ['privacy act', 'federal privacy', 'public sector privacy', 'government privacy'],
    a: 'The Privacy Act governs how federal government institutions collect, use, disclose, and retain personal information. It applies to public-sector bodies, not private-sector organizations (which fall under PIPEDA). It provides individuals with rights of access and correction. Organizations working with federal government data should understand both the Privacy Act and PIPEDA obligations.',
    f: ['PIPEDA', 'Provincial privacy', 'ISO 27701']
  },
  // NIST AI RMF (specific entry)
  {
    k: ['ai rmf', 'nist ai', 'ai risk management framework', 'govern map measure manage'],
    a: 'The NIST AI Risk Management Framework organizes AI risk governance into four functions: Govern, Map, Measure, and Manage. It is a voluntary framework widely referenced alongside ISO/IEC 42001 and the OECD AI Principles. Useful for organizations building AI governance programs, especially those seeking ISO 42001 certification.',
    f: ['ISO 42001', 'OECD AI Principles', 'AIDA']
  },

  // === REGULATORY LANDSCAPE ADDITIONS ===

  // Government Procurement
  {
    k: ['government procurement', 'govt procurement', 'government supplier', 'supplier security', 'gov supplier'],
    a: 'Government procurement increasingly expects supplier cybersecurity validation. Maps to CyberSecure Canada or ISO/IEC 27001 + PBMM. Status: Expected. CyberSecure Canada certification is the primary assessment pathway for government suppliers.',
    f: ['CyberSecure Canada', 'PBMM', 'ISO 27001']
  },
  // Critical Infrastructure
  {
    k: ['critical infrastructure', 'industrial control', 'ot security', 'operational technology', 'scada'],
    a: 'Critical infrastructure protection maps to IEC 62443 + ISO/IEC 27001 + ISO 22301. Status: Expected. IEC 62443 addresses industrial automation and control system security. ISO 22301 provides business continuity. Together they form a comprehensive operational technology security posture.',
    f: ['IEC 62443', 'ISO 22301', 'Energy / Utilities']
  },
  // Energy / Utilities
  {
    k: ['energy', 'utilities', 'bulk electric', 'power grid', 'nerc cip', 'nerc'],
    a: 'Energy and utilities face bulk electric system cybersecurity obligations. Maps to NERC CIP + IEC 62443 + ISO/IEC 27019 + ISO/IEC 27001. Status: Required. NERC CIP compliance is mandatory for bulk electric system operators. IEC 62443 addresses industrial control systems. ISO 27019 extends ISO 27001 for energy utility process control.',
    f: ['IEC 62443', 'ISO 27019', 'Critical infrastructure']
  },
  // Payment Processing / PCI DSS
  {
    k: ['pci', 'pci dss', 'payment', 'card data', 'payment processing', 'credit card', 'cardholder'],
    a: 'Payment processing requires compliance with PCI DSS (Payment Card Industry Data Security Standard). Maps to PCI DSS + ISO/IEC 27001. Status: Required. Mandated by card networks and acquiring banks for any organization that stores, processes, or transmits cardholder data. ISO 27001 provides the broader information security management system.',
    f: ['ISO 27001', 'SWIFT CSP', 'Financial services']
  },
  // SWIFT CSP
  {
    k: ['swift', 'swift csp', 'swift customer security', 'financial messaging', 'financial network'],
    a: 'Organizations connected to the SWIFT financial messaging network must comply with the SWIFT Customer Security Programme (CSP). Maps to SWIFT CSP + ISO/IEC 27001. Status: Required. SWIFT CSP mandates specific security controls for institutions using SWIFT infrastructure. ISO 27001 provides the broader management system framework.',
    f: ['PCI DSS', 'ISO 27001', 'Financial services']
  },
  // Automotive / TISAX
  {
    k: ['tisax', 'automotive', 'vda isa', 'automotive supply', 'oem supplier'],
    a: 'Automotive OEM suppliers face cybersecurity requirements through TISAX (Trusted Information Security Assessment Exchange), based on VDA ISA. Maps to TISAX + ISO/IEC 27001. Status: Required. TISAX is mandated by major automotive manufacturers for suppliers handling sensitive design, prototype, or production data.',
    f: ['ISO 27001', 'IEC 62443', 'Manufacturing']
  },
  // PBMM
  {
    k: ['pbmm', 'protected b', 'medium integrity', 'medium availability', 'government cloud'],
    a: 'PBMM (Protected B, Medium Integrity, Medium Availability) is a Canadian government security control profile for cloud services and IT infrastructure handling Protected B information. Required for defence and government cloud environments. Often paired with ISO/IEC 27001 certification and CyberSecure Canada.',
    f: ['Government procurement', 'Defence procurement', 'Cloud standards']
  },
  // IEC 62443
  {
    k: ['62443', 'iec 62443', 'industrial automation', 'iacs', 'ics security'],
    a: 'IEC 62443 is a series of standards for industrial automation and control system (IACS) security. Covers product development, system integration, and operational requirements. Applicable to critical infrastructure, manufacturing, energy, and automotive. Assessment-based — not a traditional management system certification.',
    f: ['Critical infrastructure', 'Energy / Utilities', 'ISO 27001']
  },
  // ISO 27019
  {
    k: ['27019', 'energy utility', 'process control', 'energy sector controls'],
    a: 'ISO/IEC 27019 extends ISO 27001 with information security controls specific to the energy utility industry, including process control systems for generation, transmission, and distribution. Used alongside NERC CIP and IEC 62443 for comprehensive energy sector security.',
    f: ['Energy / Utilities', 'IEC 62443', 'ISO 27001']
  },
  // Common Criteria
  {
    k: ['common criteria', '15408', 'product evaluation', 'eal', 'evaluation assurance'],
    a: 'Common Criteria (ISO/IEC 15408) is an international framework for evaluating IT product security. Products are evaluated against Protection Profiles at defined Evaluation Assurance Levels (EAL). Required for defence and government procurement of security products. Evaluation is product-specific, not organizational.',
    f: ['Defence procurement', 'FIPS 140-3', 'Government procurement']
  },
  // FIPS 140-3
  {
    k: ['fips', 'fips 140', 'cryptographic', 'cryptographic module', 'cmvp'],
    a: 'FIPS 140-3 is the standard for cryptographic module validation, administered through CMVP (Cryptographic Module Validation Program). Required for cryptographic modules used in federal government and defence environments. Validates the design and implementation of cryptographic algorithms, key management, and physical security.',
    f: ['Defence procurement', 'Common Criteria', 'Government procurement']
  },
  // Regulatory landscape overview
  {
    k: ['regulatory landscape', 'landscape', 'regulation overview', 'all regulations', 'master list'],
    a: 'The Canadian technology regulatory landscape includes: PIPEDA/Provincial Privacy (maps to 27701+27001+27018), AIDA (maps to 42001+27001, recommended), Defence Procurement (CPCSC+27001+PBMM, required), Government Procurement (CyberSecure or 27001+PBMM, expected), Cloud/SaaS (27001+27017+27018+PBMM, expected), Critical Infrastructure (IEC 62443+27001+22301, expected), Energy (NERC CIP+IEC 62443+27019+27001, required), Payment Processing (PCI DSS+27001, required), Financial Network (SWIFT CSP+27001, required), Automotive (TISAX+27001, required).',
    f: ['Which framework?', 'Start an inquiry', 'Programs']
  }
];

function fKB(q) {
  var l = q.toLowerCase();
  var best = null;
  var bs = 0;
  for (var i = 0; i < KB.length; i++) {
    var item = KB[i];
    var sc = 0;
    for (var j = 0; j < item.k.length; j++) {
      var key = item.k[j];
      if (l.indexOf(key) !== -1) {
        var s = key.length;
        if (s > sc) sc = s;
      }
    }
    if (sc > bs) {
      bs = sc;
      best = item;
    }
  }

  // Multi-signal compound query detection
  if (!best || bs < 4) {
    var sig = [];
    if (l.match(/saas|cloud|software/)) sig.push('saas');
    if (l.match(/ai |artificial|machine learn|ml /)) sig.push('ai');
    if (l.match(/defence|defense|military|supply chain/)) sig.push('def');
    if (l.match(/privacy|personal data|pii/)) sig.push('priv');
    if (l.match(/government|govt|public sector|procurement/)) sig.push('govt');
    if (l.match(/sme|small|medium|startup/)) sig.push('sme');
    if (l.match(/health|hospital|medical|patient|clinical/)) sig.push('health');
    if (l.match(/iot|hardware|embedded|sensor|device|connected/)) sig.push('iot');
    if (l.match(/manufactur|industrial|factory|production|plant/)) sig.push('mfg');
    if (l.match(/telecom|telco|isp|network operator|carrier/)) sig.push('telco');
    if (l.match(/energy|utilit|power|electric|oil|gas|pipeline/)) sig.push('energy');
    if (l.match(/financ|bank|payment|card data|pci|swift/)) sig.push('fin');
    if (l.match(/auto|vehicle|oem|tisax/)) sig.push('auto');
    if (l.match(/critical infra|scada|ot |operational tech/)) sig.push('crit');
    if (l.match(/quebec|qc|law 25|loi 25/)) sig.push('qc');
    if (l.match(/british columbia|bc|vancouver/)) sig.push('bc');
    if (l.match(/alberta|ab|calgary|edmonton/)) sig.push('ab');

    if (sig.length >= 2) {
      var p = [];
      if (sig.indexOf('saas') !== -1) p.push('SaaS/Cloud: ISO 27001 + 27017/27018 + PBMM for government cloud hosting.');
      if (sig.indexOf('ai') !== -1) p.push('AI systems: ISO 42001 + ISO 27001 foundation. Aligned with proposed AIDA.');
      if (sig.indexOf('def') !== -1) p.push('Defence supply chain: CPCSC inspection required + ISO 27001 + PBMM for Protected B environments.');
      if (sig.indexOf('priv') !== -1) p.push('Personal data: ISO 27701 + 27001 + 27018 maps to PIPEDA and provincial privacy.');
      if (sig.indexOf('govt') !== -1) p.push('Government supplier: CyberSecure Canada or ISO 27001 + PBMM. Status: Expected.');
      if (sig.indexOf('sme') !== -1) p.push('As an SME, CyberSecure Canada is an accessible starting point with a clear path to ISO 27001.');
      if (sig.indexOf('health') !== -1) p.push('Health data adds provincial health information act obligations. ISO 27001 with 27701 privacy extension addresses both security and privacy.');
      if (sig.indexOf('iot') !== -1) p.push('Hardware/IoT: ISO 27001 + IEC 62443 for industrial systems, TISAX if automotive supply chain.');
      if (sig.indexOf('mfg') !== -1) p.push('Manufacturing: ISO 27001 + IEC 62443 for industrial control systems, TISAX if automotive supply chain.');
      if (sig.indexOf('telco') !== -1) p.push('Telecommunications: ISO 27001 + 27701 for subscriber data privacy, 27017/18 for cloud infrastructure.');
      if (sig.indexOf('energy') !== -1) p.push('Energy/Utilities: NERC CIP required + IEC 62443 + ISO 27019 + ISO 27001.');
      if (sig.indexOf('fin') !== -1) p.push('Financial services: PCI DSS required for payment processing. SWIFT CSP required for SWIFT-connected institutions. ISO 27001 as foundation.');
      if (sig.indexOf('auto') !== -1) p.push('Automotive supply chain: TISAX required by OEMs + ISO 27001 for broader information security.');
      if (sig.indexOf('crit') !== -1) p.push('Critical infrastructure: IEC 62443 + ISO 27001 + ISO 22301 for operational technology protection.');
      if (sig.indexOf('qc') !== -1) p.push('In Quebec, Law 25 applies with enhanced privacy governance, breach rules, and mandatory privacy impact assessments.');
      if (sig.indexOf('bc') !== -1) p.push('In BC, PIPA governs private-sector privacy. FOIPPA applies if working with public-sector data.');
      if (sig.indexOf('ab') !== -1) p.push('In Alberta, PIPA governs private-sector privacy alongside federal PIPEDA for cross-provincial activities.');
      return { a: p.join(' ') + ' Contact us to map your specific requirements and build a certification roadmap.', f: ['Start inquiry', 'Programs', 'Process'] };
    }
  }

  return best;
}

function sM() {
  var inp = document.getElementById('chIn');
  var q = inp.value.trim();
  if (!q) return;
  var ms = document.getElementById('chMs');

  // User message
  var um = document.createElement('div');
  um.className = 'ch-m ch-mu';
  um.textContent = q;
  ms.appendChild(um);
  inp.value = '';

  // Typing indicator
  var tp = document.createElement('div');
  tp.className = 'ch-m ch-mb';
  tp.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  ms.appendChild(tp);
  ms.scrollTop = ms.scrollHeight;

  setTimeout(function() {
    ms.removeChild(tp);
    var r = fKB(q);
    var bm = document.createElement('div');
    bm.className = 'ch-m ch-mb';

    if (r) {
      var h = r.a;
      h += '<div style="font-size:10px;color:var(--ink4);margin-top:6px;font-style:italic">Informational only. Not legal advice or a conformity assessment decision.</div>';
      if (r.f && r.f.length) {
        h += '<div class="ch-sg">';
        r.f.forEach(function(f) {
          h += '<button class="ch-s" onclick="aQ(this.textContent)">' + f + '</button>';
        });
        h += '</div>';
      }
      bm.innerHTML = h;
    } else {
      bm.innerHTML = 'I can answer questions about Canadian technology regulations, ISO standards, cybersecurity programs, and certification.<div class="ch-sg"><button class="ch-s" onclick="aQ(this.textContent)">What does AICT do?</button><button class="ch-s" onclick="aQ(this.textContent)">Which standard?</button><button class="ch-s" onclick="aQ(this.textContent)">Certification process</button></div>';
    }
    ms.appendChild(bm);
    ms.scrollTop = ms.scrollHeight;
  }, 450 + Math.random() * 350);
}




// === CERTIFICATE REGISTER ===

var certDb = [
  { org: 'Demo Organization Ltd.', std: 'ISO/IEC 27001:2022', scope: 'Information security management for cloud services and supporting infrastructure.', cert: 'AICT-27001-2026-001', status: 'active', issued: '2026-01-15', expiry: '2029-01-14' },
  { org: 'Example AI Corp.', std: 'ISO/IEC 42001:2023', scope: 'AI management system for development and deployment of machine learning products.', cert: 'AICT-42001-2026-001', status: 'active', issued: '2026-02-01', expiry: '2029-01-31' },
  { org: 'Sample Tech Inc.', std: 'CyberSecure Canada', scope: 'Baseline cybersecurity controls for managed IT services.', cert: 'AICT-CSC-2026-001', status: 'active', issued: '2025-11-01', expiry: '2026-10-31' }
];

function runVfy() {
  var q = document.getElementById('vfyQ').value.toLowerCase().trim();
  var el = document.getElementById('vfyRes');
  if (!q) { el.innerHTML = '<div class="vfy-empty">Enter a search term to query the certificate register.</div>'; return; }
  var hits = certDb.filter(function(c) {
    return c.org.toLowerCase().indexOf(q) !== -1 || c.std.toLowerCase().indexOf(q) !== -1 || c.cert.toLowerCase().indexOf(q) !== -1 || c.scope.toLowerCase().indexOf(q) !== -1;
  });
  if (!hits.length) {
    el.innerHTML = '<div class="vfy-empty">No certificates found matching "' + q + '". Records are added on issuance. Contact <a href="mailto:info@aictglobalservices.com" style="color:var(--teal)">info@aictglobalservices.com</a> to verify.</div>';
    return;
  }
  var h = '<table class="vfy-table"><thead><tr><th>Organization</th><th>Standard</th><th>Certificate No.</th><th>Status</th><th>Issued</th><th>Expiry</th></tr></thead><tbody>';
  hits.forEach(function(c) {
    var s = c.status === 'active' ? '<span class="vfy-stat vfy-stat-a">Active</span>' : c.status === 'suspended' ? '<span class="vfy-stat vfy-stat-s">Suspended</span>' : '<span class="vfy-stat vfy-stat-w">Withdrawn</span>';
    h += '<tr><td><strong>' + c.org + '</strong><div style="font-size:11px;color:var(--ink4);font-family:var(--m);margin-top:3px">' + c.scope + '</div></td><td style="font-family:var(--m);font-size:11.5px">' + c.std + '</td><td style="font-family:var(--m);font-size:11.5px">' + c.cert + '</td><td>' + s + '</td><td style="font-family:var(--m);font-size:11.5px">' + c.issued + '</td><td style="font-family:var(--m);font-size:11.5px">' + c.expiry + '</td></tr>';
  });
  h += '</tbody></table>';
  el.innerHTML = h;
}


// === SCROLL SPY ===

var sects = document.querySelectorAll('section[id]');
var navLk = document.querySelectorAll('.nv a[data-s]');

function uNav() {
  var cur = '';
  var sy = window.scrollY + 120;
  sects.forEach(function(s) {
    if (sy >= s.offsetTop) cur = s.id;
  });
  navLk.forEach(function(a) {
    a.classList.toggle('act', a.dataset.s === cur);
  });
}

window.addEventListener('scroll', uNav, { passive: true });
uNav();


// === SCROLL REVEAL ===

var ob = new IntersectionObserver(function(entries) {
  entries.forEach(function(x) {
    if (x.isIntersecting) {
      x.target.classList.add('vis');
      x.target.style.opacity = '1';
      x.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.06 });

document.querySelectorAll('.rv').forEach(function(el) {
  ob.observe(el);
});

document.querySelectorAll('.pg:not(.open), .gov-cell, .ref-card, .insp-card, .cm-card, .doc-card').forEach(function(el, i) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(6px)';
  el.style.transition = 'opacity .35s var(--ease) ' + Math.min(i * 35, 280) + 'ms, transform .35s var(--ease) ' + Math.min(i * 35, 280) + 'ms';
  ob.observe(el);
});


// === SECTION IN-VIEW (heading animations) ===

var secOb = new IntersectionObserver(function(entries) {
  entries.forEach(function(x) {
    if (x.isIntersecting) {
      x.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(function(s) {
  secOb.observe(s);
});


// === DOCUMENT MODAL ===

function openDocModal(title, file, desc) {
  document.getElementById('docModalTitle').innerHTML = title;
  document.getElementById('docModalDesc').textContent = desc;
  document.getElementById('docModalDl').href = file;
  document.getElementById('docModalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDocModal() {
  document.getElementById('docModalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDocModal();
});
