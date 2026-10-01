(function () {
  'use strict';

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Appointment form
  var form = document.getElementById('appointment-form');
  if (!form) return;

  var dateInput = document.getElementById('date');
  if (dateInput) {
    var today = new Date();
    var iso = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', iso);
  }

  // Preselect service from the URL, e.g. appointment.html?service=Teeth%20Whitening
  var params = new URLSearchParams(window.location.search);
  var preset = params.get('service');
  var select = document.getElementById('service');
  if (preset && select) {
    Array.prototype.forEach.call(select.options, function (opt) {
      if (opt.value.toLowerCase() === preset.toLowerCase()) select.value = opt.value;
    });
  }

  function setError(input, message) {
    var err = document.getElementById(input.id + '-error');
    if (err) err.textContent = message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function validate(input) {
    var value = input.value.trim();
    var message = '';
    if (input.hasAttribute('required') && !value) {
      message = 'This field is required.';
    } else if (input.id === 'phone' && value && !/^[0-9+()\-\s]{7,20}$/.test(value)) {
      message = 'Please enter a valid phone number.';
    } else if (input.id === 'email' && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      message = 'Please enter a valid email address.';
    }
    setError(input, message);
    return !message;
  }

  var fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(function (f) {
    f.addEventListener('blur', function () { validate(f); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var firstBad = null;
    fields.forEach(function (f) {
      if (!validate(f)) {
        ok = false;
        if (!firstBad) firstBad = f;
      }
    });

    var success = document.getElementById('form-success');
    if (!ok) {
      if (success) success.classList.remove('show');
      if (firstBad) firstBad.focus();
      return;
    }

    var name = document.getElementById('name').value.trim();
    var service = document.getElementById('service').value;
    var date = document.getElementById('date').value;
    if (success) {
      success.textContent = 'Thank you, ' + name + '! Your request for "' + service +
        '" on ' + date + ' has been received. Our team will call you shortly to confirm.';
      success.classList.add('show');
      success.focus();
    }
    // NOTE: static hosting has no backend. Connect this form to a service
    // such as Formspree to receive submissions by email.
    form.reset();
  });
})();
