# 🔥 Firebase Setup Guide

## Стъпка 1: Вземи Firebase Credentials

1. Отиди в [Firebase Console](https://console.firebase.google.com/)
2. Избери проекта **"Santa's Workshop"**
3. Кликни на иконата ⚙️ (Settings) → **Project settings**
4. Скролни надолу до секцията **"Your apps"**
5. Ако нямаш web app, кликни на иконата `</>` (Add app) и избери **Web**
6. Копирай конфигурацията - ще видиш нещо като:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "santa-s-workshop-96a2e.firebaseapp.com",
  projectId: "santa-s-workshop-96a2e",
  storageBucket: "santa-s-workshop-96a2e.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Стъпка 2: Попълни .env файла

Отвори `.env` файла в root директорията и попълни стойностите:

```env
VITE_FIREBASE_API_KEY=AIza... (от firebaseConfig.apiKey)
VITE_FIREBASE_AUTH_DOMAIN=santa-s-workshop-96a2e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=santa-s-workshop-96a2e
VITE_FIREBASE_STORAGE_BUCKET=santa-s-workshop-96a2e.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Стъпка 3: Активирай Firestore Database

1. В Firebase Console, отиди в **Firestore Database** (от лявото меню)
2. Кликни на **"Create database"**
3. Избери **"Start in test mode"** (за development)
4. Избери локация (например: `europe-west` или `us-central`)
5. Кликни **"Enable"**

## Стъпка 4: Създай колекциите и данните

След като Firestore е активиран, създай следните колекции:

### Колекция: `toys`

1. Кликни **"Start collection"**
2. Collection ID: `toys`
3. Document ID: `toy1` (или използвай Auto-ID)
4. Добави полетата:
   - `name` (string): "Teddy Bear"
   - `category` (string): "Plush"
   - `difficulty` (string): "Easy"
   - `inStock` (boolean): true
5. Кликни **"Save"**
6. Повтори за останалите играчки (виж `firestore-sample-data.json`)

### Колекция: `orders`

1. Кликни **"Start collection"**
2. Collection ID: `orders`
3. Document ID: `order1`
4. Добави полетата:
   - `childName` (string): "Alice"
   - `country` (string): "USA"
   - `toyId` (string): "toy1"
   - `priority` (string): "High"
   - `status` (string): "Pending"
   - `createdAt` (timestamp): използвай "Add field" → Timestamp → Now
5. Кликни **"Save"**

### Колекция: `elves`

1. Кликни **"Start collection"**
2. Collection ID: `elves`
3. Document ID: `elf1`
4. Добави полетата:
   - `name` (string): "Buddy"
   - `role` (string): "Toy Maker"
   - `energy` (number): 85
5. Кликни **"Save"**

**💡 Съвет:** Можеш да използваш данните от `firestore-sample-data.json` файла като референция.

## Стъпка 5: Рестартирай Development Server

След като попълниш `.env` файла:

```bash
# Спри текущия сървър (Ctrl+C)
# Рестартирай го
npm run dev
```

## Стъпка 6: Проверка

Отвори приложението в браузъра. Ако всичко е настроено правилно:
- Данните трябва да се зареждат от Firebase
- Няма да виждаш "Loading..." безкрайно
- Ще видиш данните от Firestore колекциите

## ⚠️ Важно за Security Rules

За production, не забравяй да настроиш Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

За сега, test mode е достатъчно за development.

