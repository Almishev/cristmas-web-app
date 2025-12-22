# 🎅 Santa's Workshop Dashboard

React SPA за управление на работилницата на Дядо Коледа: играчки, елфи, поръчки и доставки.

## 🚀 Инсталация и стартиране

1. Инсталирай зависимостите:
```bash
npm install
```

2. Настрой Firebase:
   
   **Стъпка 1: Вземи Firebase Credentials**
   - Отиди в [Firebase Console](https://console.firebase.google.com/)
   - Избери проекта **"Santa's Workshop"**
   - Кликни на ⚙️ (Settings) → **Project settings**
   - Скролни до секцията **"Your apps"**
   - Ако нямаш web app, кликни `</>` (Add app) → избери **Web**
   - Копирай конфигурацията от `firebaseConfig`
   
   **Стъпка 2: Създай .env файл**
   - Създай `.env` файл в root директорията
   - Попълни с твоите Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=AIza... (от firebaseConfig.apiKey)
   VITE_FIREBASE_AUTH_DOMAIN=santa-s-workshop-96a2e.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=santa-s-workshop-96a2e
   VITE_FIREBASE_STORAGE_BUCKET=santa-s-workshop-96a2e.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```
   
   **Стъпка 3: Активирай Firestore Database**
   - В Firebase Console → **Firestore Database** (ляво меню)
   - Кликни **"Create database"**
   - Избери **"Start in test mode"** (за development)
   - Избери локация (например: `europe-west`)
   - Кликни **"Enable"**
   
   **Стъпка 4: Създай колекциите**
   - Създай колекции: `toys`, `orders`, `elves`
   - Виж детайлни инструкции в `FIREBASE_SETUP.md`

3. Стартирай development сървъра:
```bash
npm run dev
```

4. Build за production:
```bash
npm run build
```

## 📋 Firebase Firestore Структура

Създай следните колекции в Firestore:

### Колекция: `toys`
```
{
  name: string,
  category: string,
  difficulty: "Easy" | "Medium" | "Hard",
  inStock: boolean
}
```

### Колекция: `orders`
```
{
  childName: string,
  country: string,
  toyId: string,
  priority: "Low" | "Normal" | "High",
  status: "Pending" | "Packed" | "Shipped",
  createdAt: timestamp
}
```

### Колекция: `elves`
```
{
  name: string,
  role: string,
  energy: number (0-100)
}
```

## ✨ Функционалности

### Home Page
- Summary карти: Total Toys, Pending Orders, Active Elves
- Countdown to Christmas widget
- Workshop Notice Board

### Toys Module
- Списък с филтриране по категория и наличност
- Сортиране по име или трудност
- Детайли за всяка играчка
- Toggle stock (optimistic update)

### Orders Module
- Списък с филтриране по статус (Pending/Packed/Shipped/All)
- Форма за създаване на нова поръчка с валидация

### Elves Module
- Списък с елфи и тяхната енергия
- Профил на елф с Boost Energy функция
- Nested route за tasks

## 🛠️ Технологии

- **React 19** - UI библиотека
- **Vite** - Build tool
- **React Router** - Навигация
- **Tailwind CSS** - Стилизация
- **Firebase Firestore** - База данни
- **Custom Hooks** - useLocalStorage, useCountdown
- **Context API** - State management

## 📦 State Management

Използва се ръчно управление на state с:
- **DataContext** - за споделен state (toys, orders, elves)
- **ThemeContext** - за тема (light/dark mode)
- **useEffect** - за зареждане на данни от Firebase

## 🎨 Features

- ✅ Dark/Light theme с localStorage
- ✅ Responsive design
- ✅ Error Boundary
- ✅ Form validation
- ✅ Optimistic UI updates
- ✅ Loading states
- ✅ Countdown to Christmas

## 📝 Забележки

- Firebase credentials трябва да се попълнят в `.env` файл
- `.env` файлът не се комитва в git (добавен е в .gitignore)
- За production build, не забравяй да настроиш Firebase security rules
