from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)


def generate_password(length, use_uppercase, use_lowercase, use_digits, use_symbols):
    """Build a character pool based on user options, then generate a password."""
    character_pool = ""

    if use_uppercase:
        character_pool += string.ascii_uppercase   # A-Z
    if use_lowercase:
        character_pool += string.ascii_lowercase   # a-z
    if use_digits:
        character_pool += string.digits            # 0-9
    if use_symbols:
        character_pool += string.punctuation       # !@#$%^&* etc.

    # If no character type was selected, fall back to lowercase letters
    if not character_pool:
        character_pool = string.ascii_lowercase

    # random.choices picks `length` characters (with replacement) from the pool
    password = "".join(random.choices(character_pool, k=length))
    return password


def calculate_strength(password):
    """Return a simple strength label based on length and character variety."""
    has_upper   = any(c.isupper()       for c in password)
    has_lower   = any(c.islower()       for c in password)
    has_digit   = any(c.isdigit()       for c in password)
    has_symbol  = any(c in string.punctuation for c in password)

    variety = sum([has_upper, has_lower, has_digit, has_symbol])
    length  = len(password)

    if length >= 16 and variety == 4:
        return "Strong"
    elif length >= 12 and variety >= 3:
        return "Medium"
    else:
        return "Weak"


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    """
    Accept JSON from the frontend, generate a password, and return JSON.

    Expected JSON body:
        {
            "length":      16,
            "uppercase":   true,
            "lowercase":   true,
            "digits":      true,
            "symbols":     false
        }
    """
    data = request.get_json()

    # --- Read & validate options sent from the browser ---
    length        = int(data.get("length", 12))
    use_uppercase = bool(data.get("uppercase", True))
    use_lowercase = bool(data.get("lowercase", True))
    use_digits    = bool(data.get("digits", True))
    use_symbols   = bool(data.get("symbols", False))

    # Clamp length to a sensible range
    length = max(4, min(length, 64))

    password = generate_password(length, use_uppercase, use_lowercase, use_digits, use_symbols)
    strength = calculate_strength(password)

    return jsonify({"password": password, "strength": strength})


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # debug=True reloads the server automatically when you edit app.py
    app.run(debug=True)
