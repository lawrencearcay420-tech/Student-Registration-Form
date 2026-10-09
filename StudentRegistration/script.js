"use strict";

const form = document.querySelector("#registration-form");
const message = document.querySelector("#form-message");
const agreementRow = document.querySelector(".agreement-row");
const validatedFields = [...form.querySelectorAll("[data-validation]")];

function setFieldError(field, errorText) {
  const errorElement = document.getElementById(field.dataset.errorId);
  errorElement.textContent = errorText;
  field.classList.add("error");
  field.setAttribute("aria-invalid", "true");
}

function clearFieldError(field) {
  const errorElement = document.getElementById(field.dataset.errorId);
  errorElement.textContent = "";
  field.classList.remove("error");
  field.removeAttribute("aria-invalid");
}

function validateField(field) {
  const value = field.type === "checkbox" ? field.checked : field.value.trim();
  const label = field.dataset.label;
  let errorText = "";

  if (field.dataset.validation === "agreement") {
    if (!value) {
      errorText = "Please agree to the registration terms before continuing.";
    }
  } else if (field.dataset.validation === "required" && !value) {
    errorText = `${label} is required.`;
  } else if (field.dataset.validation === "email" && !value) {
    errorText = `${label} is required.`;
  } else if (field.dataset.validation === "email" &&
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errorText = "Enter a valid email address, such as name@example.com.";
  } else if (field.dataset.validation === "phone" && !value) {
    errorText = `${label} is required.`;
  } else if (field.dataset.validation === "phone" && !/^09\d{9}$/.test(value)) {
    errorText = "Enter an 11-digit phone number starting with 09.";
  } else if (field.dataset.validation === "date" && !value) {
    errorText = `${label} is required.`;
  } else if (field.dataset.validation === "date") {
    const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!dateParts) {
      errorText = "Enter the date as YYYY-MM-DD.";
    } else {
      const year = Number(dateParts[1]);
      const month = Number(dateParts[2]);
      const day = Number(dateParts[3]);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (birthDate.getFullYear() !== year ||
          birthDate.getMonth() !== month - 1 ||
          birthDate.getDate() !== day) {
        errorText = "Enter a valid calendar date.";
      } else if (birthDate > today) {
        errorText = "Date of birth cannot be in the future.";
      }
    }
  } else if (field.dataset.validation === "password" && !value) {
    errorText = `${label} is required.`;
  } else if (field.dataset.validation === "password" && value.length < 8) {
    errorText = "Password must be at least 8 characters long.";
  } else if (field.dataset.validation === "confirm-password" && !value) {
    errorText = `${label} is required.`;
  } else if (field.dataset.validation === "confirm-password" &&
             field.value !== form.elements.password.value) {
    errorText = "Passwords do not match.";
  }

  if (errorText) {
    setFieldError(field, errorText);
    return false;
  }

  clearFieldError(field);
  return true;
}

function clearMessage() {
  message.textContent = "";
  message.classList.remove("success", "failure");
}

validatedFields.forEach((field) => {
  const eventName = field.type === "checkbox" || field.tagName === "SELECT" ||
    field.type === "date" ? "change" : "input";

  field.addEventListener(eventName, () => {
    clearMessage();

    if (field.type === "checkbox") {
      agreementRow.classList.toggle("agreed", field.checked);
    }

    if (field.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }

    if (field.id === "password" &&
        form.elements.confirmPassword.getAttribute("aria-invalid") === "true") {
      validateField(form.elements.confirmPassword);
    }
  });
});

form.addEventListener("submit", function(event) {
  event.preventDefault();
  clearMessage();

  validatedFields.forEach((field) => {
    if (field.type !== "password" && field.type !== "checkbox") {
      field.value = field.value.trim();
    }
  });

  const isValid = validatedFields.map(validateField).every(Boolean);
  if (!isValid) {
    const firstInvalidField = form.querySelector('[aria-invalid="true"]');
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    return;
  }

  message.textContent = "Registration successful! Your information has been validated.";
  message.classList.add("success");
});

form.addEventListener("reset", () => {
  validatedFields.forEach(clearFieldError);
  clearMessage();
  agreementRow.classList.remove("agreed");
});
