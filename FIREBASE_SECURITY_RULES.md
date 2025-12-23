# 🔒 Firebase Security Rules Setup

## Стъпка 1: Активирай Email/Password Authentication

1. Отиди в [Firebase Console](https://console.firebase.google.com/)
2. Избери проекта **"Santa's Workshop"**
3. От лявото меню, кликни на **"Authentication"**
4. Кликни на таба **"Sign-in method"**
5. Кликни на **"Email/Password"**
6. Активирай **"Email/Password"** (Enable)
7. Кликни **"Save"**

---

## Стъпка 2: Създай първия Admin потребител

### Вариант 1: Чрез Firebase Console

1. В **Authentication** → **Users** tab
2. Кликни **"Add user"**
3. Въведи email и password
4. Кликни **"Add user"**

### Вариант 2: Чрез приложението

1. Регистрирай се чрез приложението (`/register`)
2. По подразбиране ще получиш роля `user`

---

## Стъпка 3: Направи потребител Admin

1. Отиди в **Firestore Database** → **Data** tab
2. Създай колекция `users` (ако не съществува)
3. Създай документ с ID = `uid` на потребителя (можеш да намериш uid в Authentication → Users)
4. Добави поле:
   - `role` (string): `admin`
   - `email` (string): email на потребителя
   - `createdAt` (timestamp): текуща дата

**Пример:**
```
Collection: users
Document ID: [uid на потребителя]
Fields:
  - role: "admin"
  - email: "admin@example.com"
  - createdAt: [timestamp]
```

---

## Стъпка 4: Настрой Firestore Security Rules

1. Отиди в **Firestore Database** → **Rules** tab
2. Замени правилата с:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data, admins can read all
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      // Users can create their own document during registration
      allow create: if isAuthenticated() && request.auth.uid == userId;
      // Users can update their own data, admins can update all
      allow update: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      // Only admins can delete
      allow delete: if isAdmin();
    }
    
    // Toys collection
    match /toys/{toyId} {
      // Everyone can read (public information - no authentication required)
      allow read: if true;
      // Everyone can create (no authentication required)
      allow create: if true;
      // Only admins can update and delete
      allow update, delete: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      // Everyone can read orders (public information)
      allow read: if true;
      // Everyone can create orders (no authentication required)
      allow create: if true;
      // Only admins can update and delete
      allow update, delete: if isAdmin();
    }
    
    // Elves collection
    match /elves/{elfId} {
      // Everyone can read (public information - no authentication required)
      allow read: if true;
      // Only admins can create, update, and delete
      allow create, update, delete: if isAdmin();
    }
  }
}
```

3. Кликни **"Publish"**

---

## Стъпка 5: Тествай

1. Регистрирай се като обикновен потребител
2. Провери че можеш да:
   - ✅ Създаваш toys
   - ✅ Виждаш toys
   - ❌ НЕ можеш да edit/delete toys
   - ✅ Виждаш orders (но не можеш да създаваш/edit/delete)
   - ❌ НЕ можеш да достъпиш /elves

3. Влез като admin потребител
4. Провери че можеш да:
   - ✅ Създаваш toys
   - ✅ Edit/Delete toys
   - ✅ Създаваш/Edit/Delete orders
   - ✅ Достъпиш /elves и да правиш всичко там

---

## Важно

- Всички потребители трябва да са аутентикирани (логирани) за да достъпят приложението
- Ролята се съхранява в Firestore колекцията `users`
- По подразбиране новите потребители получават роля `user`
- Само админите могат да променят ролите на други потребители

---

## Структура на данните

### Users Collection
```
users/{userId}
  - role: "admin" | "user"
  - email: string
  - createdAt: timestamp
```

---

## Troubleshooting

### Проблем: "Permission denied"
**Решение:** Провери дали:
- Потребителят е аутентикиран (логиран)
- Ролята е правилно зададена в Firestore
- Security Rules са публикувани

### Проблем: Не мога да стана admin
**Решение:** 
- Провери дали имаш достъп до Firebase Console
- Създай/обнови документа в `users` колекцията с правилния `uid`
- Уверете се че полето `role` е точно `admin` (case-sensitive)

