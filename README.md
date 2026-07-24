<p align="center">
  <img src="public/assets/barengin_logows.png" width="360" alt="Barengin logo">
</p>

<p align="center">
  <strong>Travel together. Shop together. Split the bill together.</strong>
</p>

<p align="center">
  A social travel app for joining group trips, planning outings with friends,
  ordering personal-shopping (jastip) items, chatting, and splitting shared costs.
</p>

<p align="center">
  <a href="#-what-is-barengin">About</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-connecting-services">Services</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white" alt="Laravel 12">
  <img src="https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white" alt="PHP 8.2+">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Inertia.js-2-9553E9?logo=inertia&logoColor=white" alt="Inertia 2">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind 4">
</p>

---

## 🧭 What is Barengin?

The name comes from the Indonesian word *bareng*, meaning *together*. That's the whole idea: doing
things with other people instead of alone. Barengin puts four of those things in one app:

- **Trip Bareng** for booking a seat on a guided group trip.
- **Pergi Bareng** for starting or joining a casual outing, tracking everyone live on a map, and splitting the bill.
- **Jastip** for asking a traveller to buy something for you, or posting a request to get a quote.
- **Forum** for sharing trips, tagging places, and following people.

You also get real-time chat, an in-app wallet, ratings and a leaderboard, three languages
(English, Indonesian, Malay), and an admin area to run it all.

---

## 💻 Tech Stack

Barengin is a single Laravel app that serves a React front-end through Inertia, so there's no
separate API to run. Just this one project.

<table border="1" cellpadding="8" cellspacing="0">
  <tr><th align="left">Area</th><th align="left">What we use</th></tr>
  <tr><td>Backend</td><td>Laravel 12 (PHP 8.2+)</td></tr>
  <tr><td>Frontend</td><td>React 19 + Inertia.js 2</td></tr>
  <tr><td>Styling</td><td>Tailwind CSS 4</td></tr>
  <tr><td>Build tool</td><td>Vite 7</td></tr>
  <tr><td>Database</td><td>MySQL / MariaDB (or SQLite for a quick start)</td></tr>
  <tr><td>Auth</td><td>Laravel Sanctum + Google sign-in</td></tr>
  <tr><td>Payments</td><td>Midtrans</td></tr>
  <tr><td>Real-time</td><td>Pusher (falls back to polling)</td></tr>
  <tr><td>Maps</td><td>Leaflet + OpenStreetMap</td></tr>
</table>

---

## ✨ Features

- **Trip Bareng** with seat booking, checkout, and post-trip ratings.
- **Pergi Bareng** outings with join requests, a live map that's shared to the group chat at departure, and a built-in split bill.
- **Jastip** with a product catalog, custom requests and quotes, cart, checkout, and order tracking.
- **Forum** with posts, images, tags, location tagging, comments, likes, and follows.
- **Chat** for people and groups, with live notifications and a leaderboard.
- **Admin area** with dashboards and analytics, plus tools to manage users, the catalog, requests, messages, and languages.

---

## 🚀 Getting Started

### You'll need

- **PHP 8.2+** and **Composer**
- **Node.js 20+** and **npm**
- **MySQL 8+ / MariaDB 10.4+** (or SQLite)

### Steps

**1. Clone and install**

```bash
git clone <your-repo-url> barengin-app
cd barengin-app
composer install
npm install
```

**2. Create your `.env` file**

```bash
cp .env.example .env
php artisan key:generate
```

**3. Connect a database.** Open `.env` and fill in your details:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barengin
DB_USERNAME=root
DB_PASSWORD=
```

> In a hurry? Leave `DB_CONNECTION=sqlite` and skip this step. The app runs on a local file, no database server needed.

**4. Build the database and demo data**

```bash
php artisan migrate --seed
php artisan storage:link
```

**5. Start everything** (server, queue, logs, and Vite in one command)

```bash
composer run dev
```

Open **http://localhost:8000** and you're in. 🎉

### Log in as a demo user

The seeder creates ready-to-use accounts. Password for all of them is `password123`.

<table border="1" cellpadding="8" cellspacing="0">
  <tr><th align="left">Role</th><th align="left">Email</th></tr>
  <tr><td>Admin</td><td>admin@barengin.com</td></tr>
  <tr><td>Guider (trip host)</td><td>budi@barengin.com</td></tr>
  <tr><td>Regular user</td><td>lili@gmail.com</td></tr>
</table>

That's all you need to explore the app. Payments, Google login, real-time chat, and maps need a
little extra setup, covered next. Add only the ones you want.

---

## 🔌 Connecting Services

Every service here is optional. Come back to a section when you want that feature working.

### 💳 Payments (Midtrans)

Used for trip and jastip checkout, and wallet top-ups.

1. Create an account at [dashboard.midtrans.com](https://dashboard.midtrans.com).
2. Switch to **Sandbox** mode so you can test without real money.
3. Open **Settings → Access Keys** and copy your **Server Key** and **Client Key**.
4. Add them to `.env`:
   ```env
   MIDTRANS_SERVER_KEY=your-server-key
   MIDTRANS_CLIENT_KEY=your-client-key
   MIDTRANS_IS_PRODUCTION=false
   ```
5. In **Settings → Configuration**, set the **Payment Notification URL** to
   `http://your-domain/midtrans/notification`.

### 🔑 Google sign-in

Lets people log in with one click.

1. Open the [Google Cloud Console](https://console.cloud.google.com) and create a project.
2. Go to **APIs & Services → Credentials**, then **Create Credentials → OAuth client ID**.
3. Choose **Web application** as the type.
4. Add `http://localhost:8000/auth/google/callback` under **Authorized redirect URIs**.
5. Copy the ID and secret into `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   ```

### 💬 Real-time chat (Pusher)

Chat works without this, it just checks for new messages every few seconds instead of instantly.

1. Sign up at [pusher.com/channels](https://pusher.com/channels) and create a **Channels** app.
2. Pick a cluster near you (for example `ap1` for Southeast Asia).
3. From the app's **App Keys** tab, copy the values into `.env`:
   ```env
   BROADCAST_CONNECTION=pusher
   PUSHER_APP_ID=your-app-id
   PUSHER_APP_KEY=your-app-key
   PUSHER_APP_SECRET=your-app-secret
   PUSHER_APP_CLUSTER=ap1

   VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
   VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
   ```
4. Restart `composer run dev` so the front-end picks up the new keys.

### 🗺️ Location search (Nominatim)

Powers the "search for a place" boxes. It uses free OpenStreetMap data and needs no key. For
production, just add a contact email to stay within their usage policy:

```env
NOMINATIM_EMAIL=you@example.com
NOMINATIM_USER_AGENT=Barengin/1.0
```

---

## 🧩 Other Services (no setup needed)

Barengin also uses a few free services for maps and images. These need no keys, they're listed here
just so you know what's talking to the outside world.

<table border="1" cellpadding="8" cellspacing="0">
  <tr><th align="left">Service</th><th align="left">What it's for</th></tr>
  <tr><td>BigDataCloud</td><td>Turns your GPS location into a city name</td></tr>
  <tr><td>OSRM</td><td>Draws the driving route on the live map</td></tr>
  <tr><td>OpenStreetMap tiles</td><td>The map background you see</td></tr>
  <tr><td>Unsplash / Pravatar</td><td>Placeholder photos and avatars</td></tr>
</table>

---

## ⏰ Background Jobs

Some features run on a timer (live tracking, pick-up cards, notifications). Locally you don't have
to do anything, `composer run dev` runs the queue for you. On a real server, run Laravel's scheduler
every minute and keep a queue worker alive:

```bash
* * * * * cd /path/to/barengin-app && php artisan schedule:run >> /dev/null 2>&1
```

```bash
php artisan queue:work --tries=1
```

---

## 🗂️ Where Things Live

```
app/
├── Http/Controllers/   # Web and admin logic (Trip, PergiBareng, Jastip, Chat, Forum...)
├── Http/Middleware/    # Roles, locale, streaks, last-seen...
├── Models/             # Eloquent models
└── Console/Commands/   # Scheduled tasks
resources/js/
├── Pages/              # React pages, one folder per feature
└── i18n/               # en.json / id.json / ms.json
routes/
├── web.php             # App routes
└── console.php         # The schedule
database/
├── migrations/         # Schema
└── seeders/            # Demo users, trips, catalog, forum posts...
```

---

## 🧪 Testing

```bash
composer test          # run the test suite
./vendor/bin/pint      # format code
```

---

## 📄 License

Built on the Laravel framework, which is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).

---

<p align="center">Made with ❤️ for doing things <em>bareng-bareng</em>.</p>
