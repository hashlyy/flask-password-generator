# 🔐 Password Generator — Flask Beginner Project

A clean, beginner-friendly Flask app that generates strong passwords
with a live UI. Great for learning how Flask, HTML, CSS, and JavaScript
connect together.

---

## Project Structure

```
password_generator/
│
├── app.py                  ← Flask application (routes + logic)
├── requirements.txt        ← Python dependencies
│
├── templates/
│   └── index.html          ← Jinja2 HTML template (served by Flask)
│
└── static/
    ├── css/
    │   └── style.css       ← All visual styles
    └── js/
        └── main.js         ← Frontend behaviour (fetch, copy, slider)
```

### Why this structure?

| Folder / file | Purpose |
|---|---|
| `app.py` | Single source of truth for the server. Routes, helper functions, and the entry point live here. |
| `templates/` | Flask looks here automatically for HTML files rendered with `render_template()`. |
| `static/` | Flask serves every file in here at `/static/<path>`. CSS and JS never change per-request, so they live here, not in `templates/`. |

---

## Quick Start

```bash
# 1. Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 2. Install Flask
pip install -r requirements.txt

# 3. Run the development server
python app.py
```

Open your browser at **http://127.0.0.1:5000**

---

## How it works (request flow)

```
Browser                         Flask (app.py)
  │                                  │
  │  GET /                           │
  │ ──────────────────────────────►  │  render_template("index.html")
  │ ◄──────────────────────────────  │  ← HTML + links to CSS/JS
  │                                  │
  │  (user clicks "Generate")        │
  │                                  │
  │  POST /generate  {options JSON}  │
  │ ──────────────────────────────►  │  generate_password(...)
  │ ◄──────────────────────────────  │  ← {password, strength} JSON
  │                                  │
  │  JS updates the DOM              │
```

---

## Concepts practised

- **Flask routes** — `@app.route` for GET and POST
- **Jinja2 templates** — `render_template`, `url_for`
- **Static files** — CSS and JS served from `static/`
- **`fetch` API** — POST JSON from the browser, read the response
- **Python `string` module** — building character pools
- **CSS custom properties** — design tokens / theming
- **Accessibility basics** — `aria-label`, `aria-live`, `fieldset/legend`
