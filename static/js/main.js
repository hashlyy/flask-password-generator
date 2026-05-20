/**
 * main.js — Password Generator frontend logic
 *
 * Responsibilities:
 *   1. Sync the length slider with its numeric display label.
 *   2. Collect user options and POST them to Flask's /generate route.
 *   3. Render the returned password and strength badge.
 *   4. Copy the password to the clipboard on demand.
 *
 * No frameworks — plain, beginner-friendly vanilla JS.
 */

// ── DOM references ──────────────────────────────────────────────────────────
//
// We grab each element once at the top rather than querying the DOM
// repeatedly inside event handlers — a small but good habit.

const lengthSlider      = document.getElementById("length-slider");
const lengthDisplay     = document.getElementById("length-display");

const optUppercase      = document.getElementById("opt-uppercase");
const optLowercase      = document.getElementById("opt-lowercase");
const optDigits         = document.getElementById("opt-digits");
const optSymbols        = document.getElementById("opt-symbols");

const btnGenerate       = document.getElementById("btn-generate");

const resultPlaceholder = document.getElementById("result-placeholder");
const resultRow         = document.getElementById("result-row");
const passwordOutput    = document.getElementById("password-output");
const btnCopy           = document.getElementById("btn-copy");

const strengthRow       = document.getElementById("strength-row");
const strengthBadge     = document.getElementById("strength-badge");

const copyMsg           = document.getElementById("copy-msg");


// ── 1. Length slider ────────────────────────────────────────────────────────

// Update the displayed number whenever the slider moves.
lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});


// ── 2. Generate password ────────────────────────────────────────────────────

btnGenerate.addEventListener("click", async () => {

    // Build the payload from current UI state.
    const payload = {
        length:    parseInt(lengthSlider.value, 10),
        uppercase: optUppercase.checked,
        lowercase: optLowercase.checked,
        digits:    optDigits.checked,
        symbols:   optSymbols.checked,
    };

    // Disable the button while we wait for the server so users can't
    // accidentally fire multiple requests.
    btnGenerate.disabled    = true;
    btnGenerate.textContent = "Generating…";

    try {
        // fetch() sends an HTTP request.
        // "/generate" is a relative URL → it hits our Flask route.
        const response = await fetch("/generate", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
        });

        // Parse the JSON body that Flask returns.
        const data = await response.json();

        // ── 3. Render result ──────────────────────────────────────────────
        showResult(data.password, data.strength);

    } catch (error) {
        // Network / server error — show a simple message in the output area.
        console.error("Request failed:", error);
        passwordOutput.textContent = "Error — check the console.";
    } finally {
        // Re-enable the button regardless of success or failure.
        btnGenerate.disabled    = false;
        btnGenerate.textContent = "Generate Password";
    }
});


/**
 * showResult
 * Displays the generated password and its strength label.
 *
 * @param {string} password  - The generated password string.
 * @param {string} strength  - "Weak" | "Medium" | "Strong"
 */
function showResult(password, strength) {
    // Hide the placeholder text and show the actual result elements.
    resultPlaceholder.classList.add("hidden");
    resultRow.classList.remove("hidden");
    strengthRow.classList.remove("hidden");

    // Populate the password display.
    passwordOutput.textContent = password;

    // Set the strength badge text and colour class.
    // First remove any previously applied class, then add the new one.
    strengthBadge.className        = "badge " + strength.toLowerCase();
    strengthBadge.textContent      = strength;

    // Hide the "Copied!" confirmation message in case it was still showing.
    copyMsg.classList.add("hidden");
}


// ── 4. Copy to clipboard ────────────────────────────────────────────────────

btnCopy.addEventListener("click", async () => {
    const password = passwordOutput.textContent;
    if (!password) return;                // Nothing to copy yet.

    try {
        // The Clipboard API is the modern way to write to the clipboard.
        await navigator.clipboard.writeText(password);
        showCopyConfirmation();
    } catch (err) {
        // Older browsers may not support the Clipboard API.
        // Fall back to the legacy execCommand approach.
        legacyCopy(password);
    }
});

/** Show "✅ Copied!" and hide it again after 2 seconds. */
function showCopyConfirmation() {
    copyMsg.classList.remove("hidden");
    setTimeout(() => copyMsg.classList.add("hidden"), 2000);
}

/** Fallback copy method using a temporary <textarea>. */
function legacyCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // Move off-screen so it doesn't flash visibly.
    textarea.style.position = "fixed";
    textarea.style.top      = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showCopyConfirmation();
}
