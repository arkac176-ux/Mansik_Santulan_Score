(() => {
    "use strict";

    // Backend API
   const API_URL = "https://mansik-santulan-score-4-n6qh.onrender.com/predict";

    // Form elements
    const form = document.getElementById("predict-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const resetBtn = document.getElementById("reset-btn");
    const errorRetryBtn = document.getElementById("error-retry-btn");

    // UI states
    const stateIdle = document.getElementById("state-idle");
    const stateLoading = document.getElementById("state-loading");
    const stateResult = document.getElementById("state-result");
    const stateError = document.getElementById("state-error");

    // Result elements
    const scoreNumber = document.getElementById("score-number");
    const scoreProgress = document.getElementById("score-progress");
    const scoreBand = document.getElementById("score-band");
    const scoreContext = document.getElementById("score-context");
    const errorCopy = document.getElementById("error-copy");

    // ----------------------------------
    // Collect Form Data
    // ----------------------------------

    function collectPayload() {
        const fd = new FormData(form);

        function getNumber(name) {
            const value = fd.get(name);

            if (value === null || value.trim() === "") {
                return NaN;
            }

            return Number(value);
        }

        return {
            Age: getNumber("Age"),

            Gender: fd.get("Gender") || "",

            Academic_Level: fd.get("Academic_Level") || "",

            Grouped_country: (fd.get("Grouped_country") || "").trim(),

            Avg_Daily_Usage_Hours:
                getNumber("Avg_Daily_Usage_Hours"),

            Daily_Unlocks:
                getNumber("Daily_Unlocks"),

            Most_Used_Platform:
                fd.get("Most_Used_Platform") || "",

            Purpose_Of_Use:
                fd.get("Purpose_Of_Use") || "",

            Study_Hours:
                getNumber("Study_Hours"),

            Physical_Activity_Hours:
                getNumber("Physical_Activity_Hours"),

            Sleep_Hours_Per_Night:
                getNumber("Sleep_Hours_Per_Night"),

            Stress_Level:
                fd.get("Stress_Level") || ""
        };
    }

    // ----------------------------------
    // Field Error Handling
    // ----------------------------------

    function setFieldError(input, message) {
        if (!input) return;

        const field = input.closest(".field");

        if (field) {
            field.classList.add("field-error");

            const errorMsg = field.querySelector(".error-msg");

            if (errorMsg) {
                errorMsg.textContent = message;
            }
        }
    }

    function clearFieldError(input) {
        if (!input) return;

        const field = input.closest(".field");

        if (field) {
            field.classList.remove("field-error");

            const errorMsg = field.querySelector(".error-msg");

            if (errorMsg) {
                errorMsg.textContent = "";
            }
        }
    }

    function clearAllErrors() {
        form.querySelectorAll(".field").forEach(field => {
            field.classList.remove("field-error");
        });

        form.querySelectorAll(".error-msg").forEach(msg => {
            msg.textContent = "";
        });
    }

    // ----------------------------------
    // Validation
    // ----------------------------------

    function validate(payload) {
        const errors = [];

        const numericFields = [
            ["Age", 1, 100],
            ["Avg_Daily_Usage_Hours", 0, 24],
            ["Daily_Unlocks", 0, Infinity],
            ["Study_Hours", 0, 24],
            ["Physical_Activity_Hours", 0, 24],
            ["Sleep_Hours_Per_Night", 0, 24]
        ];

        numericFields.forEach(([name, min, max]) => {
            const input = document.getElementById(name);
            const value = payload[name];

            if (!Number.isFinite(value)) {
                errors.push([input, "Please enter a valid number."]);
            } else if (value < min || value > max) {
                errors.push([
                    input,
                    `Value must be between ${min} and ${max}.`
                ]);
            }
        });

        const requiredFields = [
            "Gender",
            "Academic_Level",
            "Grouped_country",
            "Most_Used_Platform",
            "Purpose_Of_Use",
            "Stress_Level"
        ];

        requiredFields.forEach(name => {
            const input = document.getElementById(name);

            if (!payload[name]) {
                errors.push([input, "This field is required."]);
            }
        });

        return errors;
    }

    // ----------------------------------
    // UI State Management
    // ----------------------------------

    function showState(state) {
        const states = [
            stateIdle,
            stateLoading,
            stateResult,
            stateError
        ];

        states.forEach(element => {
            if (element) {
                element.hidden = true;
            }
        });

        const selectedStates = {
            idle: stateIdle,
            loading: stateLoading,
            result: stateResult,
            error: stateError
        };

        if (selectedStates[state]) {
            selectedStates[state].hidden = false;
        }
    }

    function setSubmitting(isSubmitting) {
        submitBtn.disabled = isSubmitting;

        if (btnText) {
            btnText.textContent = isSubmitting
                ? "Analyzing..."
                : "Generate Prediction";
        }
    }

    // ----------------------------------
    // Display Prediction Result
    // ----------------------------------

    function renderResult(score) {

        const clampedScore = Math.max(0, Math.min(10, score));

        scoreNumber.textContent = score.toFixed(2);

        if (clampedScore < 4) {
            scoreBand.textContent = "Lower Score";

            scoreContext.textContent =
                "The model predicted a relatively lower score. This is not a medical diagnosis.";

        } else if (clampedScore < 7) {
            scoreBand.textContent = "Moderate Score";

            scoreContext.textContent =
                "The model predicted a moderate score. This is not a medical diagnosis.";

        } else {
            scoreBand.textContent = "Higher Score";

            scoreContext.textContent =
                "The model predicted a relatively higher score. This is not a medical diagnosis.";
        }

        // Update progress bar
        scoreProgress.style.width = "0%";

        requestAnimationFrame(() => {
            scoreProgress.style.width =
                `${(clampedScore / 10) * 100}%`;
        });

        showState("result");
    }

    // ----------------------------------
    // Display Errors
    // ----------------------------------

    function renderError(message) {
        errorCopy.textContent = message;

        showState("error");
    }

    // ----------------------------------
    // Submit Form
    // ----------------------------------

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        clearAllErrors();

        const payload = collectPayload();

        const errors = validate(payload);

        if (errors.length > 0) {

            errors.forEach(([input, message]) => {
                setFieldError(input, message);
            });

            errors[0][0]?.focus();

            return;
        }

        setSubmitting(true);

        showState("loading");

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const data = await response.json();

            if (!response.ok) {

                renderError(
                    data.detail
                        ? JSON.stringify(data.detail)
                        : `Server Error: ${response.status}`
                );

                return;
            }

            const score = data.predicted_mental_health_score;

            if (
                typeof score !== "number" ||
                !Number.isFinite(score)
            ) {

                renderError(
                    "The server did not return a valid prediction score."
                );

                return;
            }

            renderResult(score);

        } catch (error) {

            console.error("API Error:", error);

            renderError(
                "Cannot connect to the server. Please check whether FastAPI is running."
            );

        } finally {

            setSubmitting(false);

        }

    });

    // ----------------------------------
    // Clear Errors While Editing
    // ----------------------------------

    form.querySelectorAll("input, select").forEach(element => {

        element.addEventListener("input", () => {
            clearFieldError(element);
        });

        element.addEventListener("change", () => {
            clearFieldError(element);
        });

    });

    // ----------------------------------
    // Reset Form
    // ----------------------------------

    resetBtn.addEventListener("click", () => {

        form.reset();

        clearAllErrors();

        scoreProgress.style.width = "0%";

        showState("idle");

    });

    // ----------------------------------
    // Retry After Error
    // ----------------------------------

    errorRetryBtn.addEventListener("click", () => {

        showState("idle");

    });

})();