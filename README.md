# 🛒 HomeGrocery

A smart, mobile-friendly grocery list app built with React. Plan your shopping with ease — browse routine items, add custom ones, and download your list as a PNG image to take to the store.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Google Sign-In** | Secure login with your Google account |
| 🏠 **Routine Items** | Browse a pre-built list of common grocery items by category |
| 🔍 **Search & Filter** | Search items by name or filter by category |
| ➕ **Custom Items** | Add any item not in the routine list with name, quantity, unit & note |
| 📋 **My List** | View all your added items in one place |
| 🗑️ **Delete / Clear** | Remove individual items or clear the entire list |
| 📥 **Download as PNG** | Save your grocery list as a PNG image to share or print |
| 💾 **Auto-Save** | Your list is saved automatically in the browser (localStorage) |
| 📱 **Mobile-Friendly** | Fully responsive with a clean dark-mode design |

---

## 📸 App Screens

| Screen | What you see |
|---|---|
| **Login** | Google sign-in screen |
| **Home Tab** 🏠 | Grid of routine grocery items with category filters |
| **Add Items Tab** ➕ | Form to add a custom grocery item |
| **My List Tab** 📋 | Your full grocery list with download & clear options |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sainadh656/Home-GrorecyList.git

# 2. Go into the project folder
cd Home-GrorecyList

# 3. Install dependencies
npm install

# 4. Start the app
npm start
```

The app will open automatically at **http://localhost:3000**

---

## 🗂️ Project Structure

```
homegrocery/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx  # Google Sign-In screen
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── HomeTab.jsx      # Routine grocery items grid
│   │   ├── AddItemsTab.jsx  # Custom item form
│   │   ├── MyListTab.jsx    # Full grocery list + download
│   │   └── Toast.jsx        # Notification popups
│   ├── App.jsx              # Main app & state management
│   ├── data.js              # Items data, categories & helpers
│   └── index.js             # React entry point
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Create React App** | Project setup & build tooling |
| **html2canvas** | Export grocery list as PNG image |
| **localStorage** | Persist the grocery list in the browser |
| **Vanilla CSS** | Custom dark-mode styling |

---

## 📖 How to Use

1. **Sign in** with your Google account
2. Go to the **Home** tab — tap any item to add it to your list
   - Adjust quantity and unit before adding
3. Go to **Add Items** tab to add a custom grocery item
4. Go to **My List** tab to see everything you've added
   - Tap the 🗑️ icon to remove an item
   - Click **Download PNG** to save your list as an image
   - Click **Clear All** to start fresh

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the app in development mode |
| `npm run build` | Build the app for production |
| `npm test` | Run tests |

---

## 🙌 Author

Made by **Sainadh** — [github.com/sainadh656](https://github.com/sainadh656)
