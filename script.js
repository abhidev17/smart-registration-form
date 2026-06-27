/**
 * SMART REGISTRATION FORM — script.js
 * Vanilla JS · ES6+ · Fully commented for learning
 *
 * Concepts demonstrated:
 *  Variables, Functions, Arrow functions, Event Listeners,
 *  Form Validation, Regular Expressions, DOM Manipulation,
 *  Local Storage, Arrays, Objects, Conditionals, Template Literals
 */

'use strict';

/* ============================================================
   1. UTILITY HELPERS
   ============================================================ */

/** Select a single element */
const $ = (selector) => document.querySelector(selector);

/** Select multiple elements */
const $$ = (selector) => document.querySelectorAll(selector);

/** Show a validation error beneath a field */
function showError(id, message) {
  const el = $(`#${id}-error`);
  const ok = $(`#${id}-ok`);
  const input = $(`#${id}`);
  if (el) el.textContent = message;
  if (ok) ok.textContent = '';
  if (input) { input.classList.add('invalid'); input.classList.remove('valid'); }
}

/** Show a success message beneath a field */
function showSuccess(id, message = 'Looks good!') {
  const el = $(`#${id}-error`);
  const ok = $(`#${id}-ok`);
  const input = $(`#${id}`);
  if (el) el.textContent = '';
  if (ok) ok.textContent = message;
  if (input) { input.classList.add('valid'); input.classList.remove('invalid'); }
}

/** Clear both error and success messages */
function clearFeedback(id) {
  const el = $(`#${id}-error`);
  const ok = $(`#${id}-ok`);
  const input = $(`#${id}`);
  if (el) el.textContent = '';
  if (ok) ok.textContent = '';
  if (input) { input.classList.remove('valid', 'invalid'); }
}

/* ============================================================
   2. DARK / LIGHT MODE TOGGLE
   ============================================================ */

const themeToggle = $('#themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

// Load saved preference from LocalStorage
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  applyTheme(isDark ? 'light' : 'dark');
});

function applyTheme(mode) {
  document.body.classList.toggle('dark-mode', mode === 'dark');
  document.body.classList.toggle('light-mode', mode !== 'dark');
  themeIcon.textContent = mode === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem('theme', mode);
}

/* ============================================================
   3. FORM ELEMENTS — cache references
   ============================================================ */

const form        = $('#regForm');
const submitBtn   = $('#submitBtn');
const btnText     = submitBtn.querySelector('.btn-text');
const btnSpinner  = submitBtn.querySelector('.btn-spinner');
const resetBtn    = $('#resetBtn');

/* ============================================================
   4. REAL-TIME VALIDATION
   ============================================================ */

// --- 4a. FULL NAME ---
const fullNameInput = $('#fullName');

fullNameInput.addEventListener('input', () => validateFullName());

function validateFullName() {
  const val = fullNameInput.value.trim();
  if (!val) { showError('fullName', 'Full name is required.'); return false; }
  if (val.length < 2) { showError('fullName', 'Name must be at least 2 characters.'); return false; }
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(val)) { showError('fullName', 'Name contains invalid characters.'); return false; }
  showSuccess('fullName', 'Name accepted!');
  updatePreview();
  return true;
}

// --- 4b. USERNAME ---
const usernameInput = $('#username');

usernameInput.addEventListener('input', () => validateUsername());

function validateUsername() {
  const val = usernameInput.value.trim();
  if (!val) { showError('username', 'Username is required.'); return false; }
  if (val.length < 4) { showError('username', 'Username must be at least 4 characters.'); return false; }
  if (!/^[a-zA-Z0-9_.-]+$/.test(val)) { showError('username', 'Only letters, numbers, underscores, dots and hyphens allowed.'); return false; }
  showSuccess('username', 'Username available!');
  updatePreview();
  return true;
}

// --- 4c. EMAIL ---
const emailInput = $('#email');

emailInput.addEventListener('input', () => validateEmail());

// Standard email regex (RFC-5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateEmail() {
  const val = emailInput.value.trim();
  if (!val) { showError('email', 'Email address is required.'); return false; }
  if (!EMAIL_REGEX.test(val)) { showError('email', 'Please enter a valid email address.'); return false; }
  showSuccess('email', 'Email looks good!');
  updatePreview();
  return true;
}

// --- 4d. PHONE ---
const phoneInput = $('#phone');

phoneInput.addEventListener('input', () => validatePhone());

// Accept formats: +1 (555) 000-0000 / 0712345678 / +44 7700 900000 etc.
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

function validatePhone() {
  const val = phoneInput.value.trim();
  if (!val) { showError('phone', 'Phone number is required.'); return false; }
  if (!PHONE_REGEX.test(val)) { showError('phone', 'Enter a valid phone number (7–20 digits).'); return false; }
  showSuccess('phone', 'Phone number accepted!');
  updatePreview();
  return true;
}

// --- 4e. DATE OF BIRTH + AGE ---
const dobInput = $('#dob');
const ageInput = $('#age');

dobInput.addEventListener('change', () => { validateDob(); updatePreview(); });

function calculateAge(dateString) {
  if (!dateString) return null;
  const today = new Date();
  const birth  = new Date(dateString);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function validateDob() {
  const val = dobInput.value;
  if (!val) { showError('dob', 'Date of birth is required.'); ageInput.value = ''; return false; }
  const age = calculateAge(val);
  ageInput.value = age;
  if (age < 18)  { showError('dob', `You must be at least 18 years old (current: ${age}).`); return false; }
  if (age > 120) { showError('dob', 'Please enter a valid date of birth.'); return false; }
  showSuccess('dob', `Age ${age} — eligible!`);
  return true;
}

// --- 4f. GENDER ---
const genderRadios = $$('input[name="gender"]');

genderRadios.forEach(r => r.addEventListener('change', () => validateGender()));

function validateGender() {
  const selected = $('input[name="gender"]:checked');
  if (!selected) { showError('gender', 'Please select your gender.'); return false; }
  const okEl = $('#gender-ok');
  const errEl = $('#gender-error');
  if (errEl) errEl.textContent = '';
  if (okEl) okEl.textContent = '✓ Preference noted!';
  return true;
}

// --- 4g. PROFILE PICTURE ---
const avatarInput   = $('#avatar');
const avatarPreview = $('#avatarPreview');
const avatarDropzone = $('#avatarDropzone');

avatarInput.addEventListener('change', () => validateAvatar());
setupDragDrop(avatarDropzone, avatarInput, handleAvatarFile);

function validateAvatar() {
  handleAvatarFile(avatarInput.files[0]);
}

function handleAvatarFile(file) {
  if (!file) return;
  const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.type)) {
    showError('avatar', 'Only PNG, JPG, GIF or WEBP files allowed.');
    avatarPreview.hidden = true;
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    showError('avatar', 'Image must be under 5 MB.');
    avatarPreview.hidden = true;
    return false;
  }
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.src = e.target.result;
    avatarPreview.hidden = false;
    // Update preview card avatar
    const previewAvatar = $('#previewAvatar');
    const placeholder   = $('#previewAvatarPlaceholder');
    previewAvatar.src = e.target.result;
    previewAvatar.hidden = false;
    placeholder.hidden = true;
  };
  reader.readAsDataURL(file);
  showSuccess('avatar', `${file.name} uploaded!`);
  return true;
}

// --- 4h. COUNTRY ---
const countrySelect = $('#country');
countrySelect.addEventListener('change', () => validateCountry());

function validateCountry() {
  if (!countrySelect.value) { showError('country', 'Please select your country.'); return false; }
  showSuccess('country', 'Country selected!');
  updatePreview();
  return true;
}

// --- 4i. CITY ---
const cityInput = $('#city');
cityInput.addEventListener('input', () => validateCity());

function validateCity() {
  const val = cityInput.value.trim();
  if (!val) { showError('city', 'City is required.'); return false; }
  showSuccess('city', '');
  updatePreview();
  return true;
}

// --- 4j. ZIP ---
const zipInput = $('#zip');
zipInput.addEventListener('input', () => validateZip());

// Allow 3–10 alphanumeric+space+dash characters (covers most global postal codes)
const ZIP_REGEX = /^[A-Za-z0-9\s\-]{3,10}$/;

function validateZip() {
  const val = zipInput.value.trim();
  if (!val) { showError('zip', 'ZIP / Postal code is required.'); return false; }
  if (!ZIP_REGEX.test(val)) { showError('zip', 'Enter a valid postal code (3–10 characters).'); return false; }
  showSuccess('zip', '');
  return true;
}

// --- 4k. PASSWORD STRENGTH ---
const passwordInput = $('#password');
const strengthBar   = $('#strengthBar');
const strengthText  = $('#password-strength-text');
const togglePassword = $('#togglePassword');

passwordInput.addEventListener('input', () => { validatePassword(); checkPasswordMatch(); });

function validatePassword() {
  const val = passwordInput.value;
  if (!val) { showError('password', 'Password is required.'); updateStrength(0); return false; }

  // Calculate strength score (0–4)
  let score = 0;
  if (val.length >= 8)                     score++; // length
  if (/[A-Z]/.test(val))                   score++; // uppercase
  if (/[0-9]/.test(val))                   score++; // number
  if (/[^A-Za-z0-9]/.test(val))            score++; // special char

  updateStrength(score);

  if (val.length < 8) { showError('password', 'Password must be at least 8 characters.'); return false; }
  if (score < 2) { showError('password', 'Too weak — add uppercase letters, numbers or symbols.'); return false; }

  showSuccess('password', score === 4 ? 'Strong password!' : 'Acceptable password.');
  return true;
}

function updateStrength(score) {
  // Map score → width + color + label
  const levels = [
    { width: '0%',   color: 'transparent',  label: '' },
    { width: '25%',  color: '#ef4444',       label: 'Weak' },
    { width: '50%',  color: '#f59e0b',       label: 'Fair' },
    { width: '75%',  color: '#3b82f6',       label: 'Good' },
    { width: '100%', color: '#22c55e',       label: 'Strong 🔒' },
  ];
  const lvl = levels[score];
  strengthBar.style.width     = lvl.width;
  strengthBar.style.background = lvl.color;
  strengthText.textContent     = lvl.label;
  strengthText.style.color     = lvl.color;
}

// Password visibility toggle
togglePassword.addEventListener('click', () => toggleVis(passwordInput, togglePassword));

// --- 4l. CONFIRM PASSWORD ---
const confirmPwInput  = $('#confirmPassword');
const toggleConfirmPw = $('#toggleConfirmPassword');

confirmPwInput.addEventListener('input', () => checkPasswordMatch());
toggleConfirmPw.addEventListener('click', () => toggleVis(confirmPwInput, toggleConfirmPw));

function checkPasswordMatch() {
  const val  = confirmPwInput.value;
  const pass = passwordInput.value;
  if (!val) { showError('confirmPassword', 'Please confirm your password.'); return false; }
  if (val !== pass) { showError('confirmPassword', 'Passwords do not match.'); return false; }
  showSuccess('confirmPassword', 'Passwords match!');
  return true;
}

function toggleVis(input, btn) {
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? '🙈' : '👁️';
  btn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
  btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
}

// --- 4m. SECURITY QUESTION & ANSWER ---
const secQuestionSelect = $('#secQuestion');
const secAnswerInput    = $('#secAnswer');

secQuestionSelect.addEventListener('change', () => validateSecQuestion());
secAnswerInput.addEventListener('input', () => validateSecAnswer());

function validateSecQuestion() {
  if (!secQuestionSelect.value) { showError('secQuestion', 'Please choose a security question.'); return false; }
  showSuccess('secQuestion', '');
  return true;
}

function validateSecAnswer() {
  const val = secAnswerInput.value.trim();
  if (!val) { showError('secAnswer', 'Security answer is required.'); return false; }
  if (val.length < 2) { showError('secAnswer', 'Answer must be at least 2 characters.'); return false; }
  showSuccess('secAnswer', '');
  return true;
}

// --- 4n. EXPERIENCE LEVEL ---
const experienceSelect = $('#experience');
experienceSelect.addEventListener('change', () => validateExperience());

function validateExperience() {
  if (!experienceSelect.value) { showError('experience', 'Please select your experience level.'); return false; }
  showSuccess('experience', '');
  updatePreview();
  return true;
}

// --- 4o. PORTFOLIO URL ---
const portfolioInput = $('#portfolio');
portfolioInput.addEventListener('input', () => validatePortfolio());

const URL_REGEX = /^https?:\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

function validatePortfolio() {
  const val = portfolioInput.value.trim();
  if (!val) { clearFeedback('portfolio'); return true; } // optional field
  if (!URL_REGEX.test(val)) { showError('portfolio', 'Enter a valid URL starting with http:// or https://.'); return false; }
  showSuccess('portfolio', 'URL looks valid!');
  updatePreview();
  return true;
}

// --- 4p. RESUME UPLOAD ---
const resumeInput = $('#resume');
const resumeChosen = $('#resumeChosen');
const resumeDropzone = $('#resumeDropzone');

resumeInput.addEventListener('change', () => validateResume());
setupDragDrop(resumeDropzone, resumeInput, handleResumeFile);

function validateResume() {
  handleResumeFile(resumeInput.files[0]);
}

function handleResumeFile(file) {
  if (!file) return;
  if (file.type !== 'application/pdf') {
    showError('resume', 'Only PDF files are accepted.');
    return false;
  }
  if (file.size > 10 * 1024 * 1024) {
    showError('resume', 'Resume must be under 10 MB.');
    return false;
  }
  resumeChosen.textContent = `📎 ${file.name}`;
  resumeChosen.hidden = false;
  showSuccess('resume', 'Resume uploaded!');
  return true;
}

// --- 4q. BIO with character counter ---
const bioTextarea = $('#bio');
const bioCounter  = $('#bioCounter');

bioTextarea.addEventListener('input', () => {
  validateBio();
  updatePreview();
});

function validateBio() {
  const val = bioTextarea.value;
  const len = val.length;
  const max = 300;

  bioCounter.textContent = `${len} / ${max}`;
  bioCounter.classList.toggle('near-limit', len > 240 && len < max);
  bioCounter.classList.toggle('at-limit', len >= max);

  if (!val.trim()) { showError('bio', 'A short bio is required.'); return false; }
  showSuccess('bio', '');
  return true;
}

// --- 4r. TERMS ---
const termsCheck = $('#terms');
termsCheck.addEventListener('change', () => validateTerms());

function validateTerms() {
  if (!termsCheck.checked) { showError('terms', 'You must accept the Terms & Conditions.'); return false; }
  const errEl = $('#terms-error');
  const okEl  = $('#terms-ok');
  if (errEl) errEl.textContent = '';
  if (okEl)  okEl.textContent  = '✓ Accepted';
  return true;
}

/* ============================================================
   5. LIVE PREFERENCE INPUTS (color, range, skills)
   ============================================================ */

// Color picker
const favColorInput = $('#favColor');
const favColorVal   = $('#favColor-label-val');

favColorInput.addEventListener('input', () => {
  favColorVal.textContent = favColorInput.value;
  $('#previewColorBar').style.background = favColorInput.value;
});

// Range / satisfaction slider
const satisfactionInput = $('#satisfaction');
const satisfactionValEl = $('#satisfactionVal');

satisfactionInput.addEventListener('input', () => {
  const val = satisfactionInput.value;
  satisfactionValEl.textContent = val;
  satisfactionInput.setAttribute('aria-valuenow', val);
  updateSatisfactionDots(parseInt(val, 10));
  updatePreview();
});

function updateSatisfactionDots(val) {
  const container = $('#satisfactionDots');
  container.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const dot = document.createElement('div');
    dot.className = `s-dot${i <= val ? ' active' : ''}`;
    container.appendChild(dot);
  }
  $('#previewSatisfaction').textContent = `${val}/10`;
}
updateSatisfactionDots(5); // init dots

// Skills checkboxes
const skillCheckboxes = $$('input[name="skills"]');
skillCheckboxes.forEach(cb => cb.addEventListener('change', updatePreview));

/* ============================================================
   6. RANGE SLIDER GRADIENT UPDATE
   ============================================================ */

satisfactionInput.addEventListener('input', updateRangeTrack);

function updateRangeTrack() {
  const min = +satisfactionInput.min;
  const max = +satisfactionInput.max;
  const val = +satisfactionInput.value;
  const pct = ((val - min) / (max - min)) * 100;
  satisfactionInput.style.setProperty('--pct', `${pct}%`);
}
updateRangeTrack(); // initialise

/* ============================================================
   7. DRAG & DROP HELPER
   ============================================================ */

function setupDragDrop(zone, input, handler) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a fake FileList by updating input (where possible)
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handler(file);
    }
  });
}

/* ============================================================
   8. LIVE PREVIEW CARD UPDATE
   ============================================================ */

function updatePreview() {
  // Name
  const name = $('#fullName').value.trim();
  $('#previewName').textContent = name || 'Your Name';

  // Username
  const uname = $('#username').value.trim();
  $('#previewUsername').textContent = uname ? `@${uname}` : '@username';

  // Email
  $('#previewEmail').textContent = $('#email').value.trim() || '—';

  // Phone
  $('#previewPhone').textContent = $('#phone').value.trim() || '—';

  // DOB + age
  const dob = $('#dob').value;
  const age  = dob ? `${dob} (age ${calculateAge(dob)})` : '—';
  $('#previewDob').textContent = age;

  // Location
  const city    = $('#city').value.trim();
  const country = countrySelect.options[countrySelect.selectedIndex]?.text;
  const loc = [city, country !== '— Select country —' ? country : ''].filter(Boolean).join(', ');
  $('#previewLocation').textContent = loc || '—';

  // Experience
  const exp = experienceSelect.options[experienceSelect.selectedIndex]?.text;
  $('#previewExperience').textContent = (exp && exp !== '— Select level —') ? exp : '—';

  // Portfolio
  const portfolio = $('#portfolio').value.trim();
  $('#previewPortfolio').textContent = portfolio || '—';

  // Bio
  const bio = $('#bio').value.trim();
  const bioEl = $('#previewBio');
  bioEl.innerHTML = bio ? bio : '<em>No bio yet…</em>';

  // Skills
  const selected = [...$$('input[name="skills"]:checked')].map(c => c.value.toUpperCase());
  const skillsEl = $('#previewSkills');
  skillsEl.innerHTML = selected.map(s => `<span class="skill-tag">${s}</span>`).join('');
}

/* ============================================================
   9. PROGRESS BAR
   ============================================================ */

// Define all required fields for progress tracking
const REQUIRED_IDS = [
  'fullName', 'username', 'email', 'phone', 'dob', 'country',
  'city', 'zip', 'password', 'confirmPassword',
  'secQuestion', 'secAnswer', 'experience', 'bio', 'terms'
];

function updateProgress() {
  let filled = 0;

  REQUIRED_IDS.forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    if (el.type === 'checkbox') { if (el.checked) filled++; }
    else if (el.tagName === 'SELECT') { if (el.value) filled++; }
    else { if (el.value.trim()) filled++; }
  });

  // Also check gender radio
  if ($('input[name="gender"]:checked')) filled++;

  const total = REQUIRED_IDS.length + 1; // +1 for gender
  const pct = Math.round((filled / total) * 100);

  const bar   = $('#progressBar');
  const label = $('#progressLabel');
  const wrapper = $('#progressWrapper');

  bar.style.width = `${pct}%`;
  label.textContent = `${pct}% Complete`;
  wrapper.setAttribute('aria-valuenow', pct);
}

// Attach progress update to all inputs in the form
form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);

/* ============================================================
   10. FORM RESET
   ============================================================ */

resetBtn.addEventListener('click', () => {
  if (!confirm('Are you sure you want to reset all form fields?')) return;
  form.reset();

  // Clear all validation states
  $$('.field-input').forEach(el => el.classList.remove('valid', 'invalid'));
  $$('.field-error, .field-ok').forEach(el => el.textContent = '');

  // Reset strength meter
  updateStrength(0);

  // Reset previews
  ageInput.value = '';
  $('#avatarPreview').hidden = true;
  $('#previewAvatar').hidden = true;
  $('#previewAvatarPlaceholder').hidden = false;
  $('#resumeChosen').hidden = true;
  bioCounter.textContent = '0 / 300';
  bioCounter.classList.remove('near-limit', 'at-limit');
  satisfactionValEl.textContent = '5';
  updateSatisfactionDots(5);
  favColorVal.textContent = '#6366f1';
  $('#previewColorBar').style.background = '#6366f1';

  // Reset preview card
  updatePreview();
  updateProgress();
  updateRangeTrack();
});

/* ============================================================
   11. FORM SUBMISSION
   ============================================================ */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Run all validators and collect results
  const validations = [
    validateFullName(),
    validateUsername(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validateGender(),
    validateCountry(),
    validateCity(),
    validateZip(),
    validatePassword(),
    checkPasswordMatch(),
    validateSecQuestion(),
    validateSecAnswer(),
    validateExperience(),
    validatePortfolio(),
    validateBio(),
    validateTerms(),
  ];

  // Check at least one field exists — if all pass, submit
  const allValid = validations.every(v => v !== false);

  if (!allValid) {
    // Scroll to the first error
    const firstError = form.querySelector('.field-error:not(:empty), .field-input.invalid');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Simulate async submission with loading spinner
  submitBtn.disabled = true;
  btnText.textContent = 'Creating account…';
  btnSpinner.hidden = false;

  setTimeout(() => {
    btnSpinner.hidden = true;
    btnText.textContent = 'Create Account';
    submitBtn.disabled = false;

    // Collect form data
    const data = collectFormData();

    // Save to LocalStorage
    localStorage.setItem('registrationData', JSON.stringify(data));

    // Show success modal
    showSuccessModal(data);
  }, 1800);
});

/* ============================================================
   12. COLLECT FORM DATA → OBJECT
   ============================================================ */

function collectFormData() {
  const skills = [...$$('input[name="skills"]:checked')].map(c => c.value);
  const gender = $('input[name="gender"]:checked')?.value || '—';

  return {
    fullName:     $('#fullName').value.trim(),
    username:     $('#username').value.trim(),
    email:        $('#email').value.trim(),
    phone:        $('#phone').value.trim(),
    dob:          $('#dob').value,
    age:          ageInput.value,
    gender,
    country:      countrySelect.options[countrySelect.selectedIndex]?.text || '—',
    state:        $('#state').value.trim(),
    city:         $('#city').value.trim(),
    zip:          $('#zip').value.trim(),
    address:      $('#address').value.trim(),
    secQuestion:  secQuestionSelect.options[secQuestionSelect.selectedIndex]?.text || '—',
    skills:       skills.join(', ') || 'None',
    experience:   experienceSelect.options[experienceSelect.selectedIndex]?.text || '—',
    favColor:     favColorInput.value,
    prefTime:     $('#prefTime').value || '—',
    prefDate:     $('#prefDate').value || '—',
    portfolio:    $('#portfolio').value.trim() || '—',
    satisfaction: satisfactionInput.value + '/10',
    bio:          $('#bio').value.trim(),
    submittedAt:  new Date().toLocaleString(),
  };
}

/* ============================================================
   13. SUCCESS MODAL
   ============================================================ */

const modalOverlay = $('#modalOverlay');
const modalClose   = $('#modalClose');
const modalNewReg  = $('#modalNewReg');

function showSuccessModal(data) {
  const modalData = $('#modalData');

  // Render data as key-value pairs (exclude password/security fields)
  const displayFields = [
    ['Full Name', data.fullName],
    ['Username', data.username],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Date of Birth', data.dob],
    ['Age', data.age],
    ['Gender', data.gender],
    ['Country', data.country],
    ['City', data.city],
    ['ZIP', data.zip],
    ['Experience', data.experience],
    ['Skills', data.skills],
    ['Favorite Color', data.favColor],
    ['Portfolio', data.portfolio],
    ['Satisfaction', data.satisfaction],
    ['Submitted At', data.submittedAt],
  ];

  modalData.innerHTML = displayFields
    .map(([key, val]) => `
      <div class="modal-data-item">
        <span class="modal-data-key">${key}</span>
        <span class="modal-data-val">${val || '—'}</span>
      </div>
    `).join('');

  modalOverlay.hidden = false;
  modalClose.focus(); // accessibility: move focus into modal
}

// Close modal
modalClose.addEventListener('click', closeModal);
modalNewReg.addEventListener('click', () => {
  closeModal();
  resetBtn.click();
});

// Close on backdrop click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});

function closeModal() {
  modalOverlay.hidden = true;
  submitBtn.focus(); // return focus to submit button
}

/* ============================================================
   14. INITIALISATION
   ============================================================ */

// Initialise color bar
$('#previewColorBar').style.background = favColorInput.value;

// Fill DOB max = today (can't be born in the future)
const today = new Date().toISOString().split('T')[0];
dobInput.max = today;

// Update progress once on load
updateProgress();