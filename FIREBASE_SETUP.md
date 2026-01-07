# הוראות הגדרת Firebase

## שלב 1: יצירת פרויקט Firebase

1. היכנס ל-[Firebase Console](https://console.firebase.google.com/)
2. לחץ על **"Create a project"** (צור פרויקט)
3. תן שם לפרויקט (לדוגמה: "homework-tracker")
4. לחץ **Continue**
5. בשלב Google Analytics - אפשר לבטל (לא חובה) ולחץ **Create Project**
6. חכה שהפרויקט ייווצר ולחץ **Continue**

## שלב 2: הוספת אפליקציית Web

1. במסך הראשי של הפרויקט, לחץ על האייקון של **Web** (`</>`)
2. תן שם לאפליקציה (לדוגמה: "homework-tracker-web")
3. **אין צורך** לסמן Firebase Hosting (לא חובה)
4. לחץ **Register app**
5. **חשוב!** תראה קוד כזה:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **העתק את הערכים האלה** - תצטרך להוסיף אותם לקובץ `src/firebase.ts`
7. לחץ **Continue to console**

## שלב 3: יצירת בסיס נתונים Firestore

1. בתפריט השמאלי, לחץ על **Build** → **Firestore Database**
2. לחץ **Create database**
3. בחר **Start in test mode** (זה מאפשר קריאה וכתיבה חופשית)
4. לחץ **Next**
5. בחר מיקום (לדוגמה: `europe-west1` לאירופה)
6. לחץ **Enable**

## שלב 4: יצירת אינדקסים

Firebase צריך אינדקס כדי לסנן ולמיין נתונים. כשתריץ את האתר בפעם הראשונה:

1. פתח את Developer Tools בדפדפן (F12)
2. בלשונית Console תראה שגיאה עם לינק ליצירת אינדקס
3. לחץ על הלינק ואשר את יצירת האינדקס
4. חזור על זה לכל אינדקס שחסר

## שלב 5: עדכון הקוד

פתח את הקובץ `src/firebase.ts` והחלף את הערכים:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← החלף בערך שלך
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## שלב 6: הפעלת האתר

```bash
cd /Users/rotemitzhak/Developer/homework-tracker
npm run dev
```

## זהו! 🎉

הנתונים יסונכרנו אוטומטית בין כל המכשירים.

---

## פתרון בעיות

### "Missing or insufficient permissions"
וודא שבחרת "test mode" בשלב יצירת בסיס הנתונים.

### שגיאת אינדקס
לחץ על הלינק בשגיאה בקונסול ליצירת האינדקס החסר.
