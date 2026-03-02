# 🌾 RecolteCheck

تطبيق بسيط لتتبع المحاصيل الزراعية — يشتغل على Android و iOS مع مزامنة سحابية عبر Firebase.

---

## A) الشاشات المطلوبة (9 شاشات فقط)

| # | الشاشة | المسار | الوصف |
|---|--------|--------|-------|
| 1 | تسجيل الدخول | `(auth)/login` | إدخال البريد + كلمة المرور |
| 2 | إنشاء حساب | `(auth)/register` | تسجيل فلاح جديد (اسم، هاتف، إيميل، كلمة مرور) |
| 3 | قائمة القطع الأرضية | `(tabs)/index` | الصفحة الرئيسية — عرض جميع القطع + زر إضافة |
| 4 | الملف الشخصي | `(tabs)/profile` | عرض وتعديل البيانات الشخصية + تسجيل الخروج |
| 5 | إضافة قطعة أرضية | `parcelle/add` | نموذج إدخال: اسم، مساحة، زراعات، فترة الحصاد |
| 6 | تفاصيل القطعة | `parcelle/[id]` | عرض معلومات القطعة + قائمة المناطق + تعديل/حذف |
| 7 | تعديل القطعة | `parcelle/edit/[id]` | تعديل بيانات القطعة |
| 8 | إضافة منطقة | `zone/add` | إضافة منطقة داخل قطعة (اسم + مساحة) |
| 9 | تفاصيل المنطقة | `zone/[id]` | عرض المنطقة + سجل المحاصيل + زر إضافة محصول |
| 10 | إضافة محصول | `recolte/add` | تسجيل محصول جديد (نوع، وزن، ملاحظات) |

---

## B) نموذج بيانات Firestore

```
users/{userId}
├── nom: string              // الاسم العائلي
├── prenom: string           // الاسم الشخصي
├── telephone: string        // رقم الهاتف
├── email: string            // البريد الإلكتروني
├── createdAt: timestamp
│
└── parcelles/{parcelleId}
    ├── nom: string              // اسم القطعة
    ├── surface: number          // المساحة بالهكتار
    ├── cultures: string[]       // قائمة الزراعات
    ├── periodeRecolte: string   // فترة الحصاد
    ├── createdAt: timestamp
    │
    └── zones/{zoneId}
        ├── nom: string          // اسم المنطقة
        ├── surface: number      // مساحة المنطقة
        ├── createdAt: timestamp
        │
        └── recoltes/{recolteId}
            ├── culture: string      // نوع المحصول
            ├── poids: number        // الوزن بالكيلوغرام
            ├── date: timestamp      // تاريخ الحصاد
            ├── notes: string        // ملاحظات
            └── createdAt: timestamp
```

**العلاقات:**
- `parcelles` → مجموعة فرعية داخل `users/{userId}`
- `zones` → مجموعة فرعية داخل `parcelles/{parcelleId}`
- `recoltes` → مجموعة فرعية داخل `zones/{zoneId}`
- كل البيانات مرتبطة بالفلاح عبر `userId`

---

## C) إعداد Firebase Auth

1. **إنشاء مشروع Firebase:**
   - اذهب إلى [Firebase Console](https://console.firebase.google.com)
   - أنشئ مشروع جديد باسم `RecolteCheck`

2. **تفعيل Authentication:**
   - في القائمة الجانبية: `Build` → `Authentication`
   - اضغط `Get Started`
   - فعّل `Email/Password` كطريقة تسجيل دخول

3. **إضافة تطبيق Android:**
   - في إعدادات المشروع → `Add app` → Android
   - اسم الحزمة: `com.recoltecheck.app`
   - حمّل `google-services.json` وضعه في `android/app/`

4. **إضافة تطبيق iOS:**
   - في إعدادات المشروع → `Add app` → iOS
   - Bundle ID: `com.recoltecheck.app`
   - حمّل `GoogleService-Info.plist` وضعه في `ios/`

5. **تفعيل Firestore:**
   - في القائمة: `Build` → `Firestore Database`
   - اضغط `Create database`
   - اختر الموقع الأقرب (`europe-west1` مثلاً)
   - ابدأ في وضع Production

6. **نشر قواعد الأمان:**
   - انسخ محتوى `firestore.rules` وألصقه في Firestore → Rules

---

## D) قواعد أمان Firestore

الملف: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // كل فلاح يقدر يوصل غير للبيانات ديالو
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // منع الوصول لأي مسار آخر
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**الشرح:**
- `request.auth != null` → لازم يكون المستخدم مسجل دخوله
- `request.auth.uid == userId` → المستخدم يقدر يوصل غير للبيانات ديالو
- `{document=**}` → القاعدة تطبق على كل المجموعات الفرعية (parcelles, zones, recoltes)

---

## E) خطة التنفيذ (Milestones)

### المرحلة 1: المصادقة (Auth) ✅
- إعداد Firebase في المشروع (تثبيت `@react-native-firebase/*`)
- إضافة `AuthContext` لإدارة حالة المصادقة
- شاشة تسجيل الدخول (`login.tsx`)
- شاشة إنشاء الحساب (`register.tsx`)
- توجيه تلقائي بين Auth و Tabs حسب حالة المستخدم

### المرحلة 2: الملف الشخصي (Profile CRUD) ✅
- شاشة الملف الشخصي (`profile.tsx`)
- قراءة بيانات المستخدم من Firestore
- تعديل وحفظ البيانات الشخصية
- زر تسجيل الخروج

### المرحلة 3: القطع الأرضية (Parcelles CRUD) ✅
- قائمة القطع الأرضية في الصفحة الرئيسية
- شاشة إضافة قطعة (`parcelle/add.tsx`)
- شاشة تفاصيل القطعة (`parcelle/[id].tsx`)
- شاشة تعديل القطعة (`parcelle/edit/[id].tsx`)
- حذف القطعة
- الاستماع للتغييرات في الوقت الحقيقي (real-time sync)

### المرحلة 4: الزراعات لكل قطعة (Cultures) ✅
- حقل `cultures: string[]` في القطعة
- إدخال الزراعات كقائمة مفصولة بفاصلة
- عرض الزراعات كشارات (chips) في قائمة القطع وتفاصيلها

### المرحلة 5: المناطق لكل قطعة (Zones) ✅
- قائمة المناطق داخل شاشة تفاصيل القطعة
- شاشة إضافة منطقة (`zone/add.tsx`)
- حذف المنطقة
- المزامنة في الوقت الحقيقي

### المرحلة 6: المحاصيل لكل منطقة مع السجل (Récoltes + History) ✅
- شاشة تفاصيل المنطقة (`zone/[id].tsx`) مع سجل المحاصيل
- شاشة إضافة محصول (`recolte/add.tsx`)
- حذف المحصول
- عرض إجمالي الإنتاج لكل منطقة
- ترتيب حسب التاريخ (الأحدث أولاً)

### المرحلة 7: المزامنة السحابية (Cloud Sync) ✅
- جميع البيانات تُخزن في Firestore تلقائياً
- استخدام `onSnapshot` للمزامنة اللحظية
- البيانات متاحة على أي جهاز بعد تسجيل الدخول

---

## F) مقتطفات توضيحية

### مثال: الاستماع للتغييرات في الوقت الحقيقي
```typescript
// services/firestoreService.ts
export function subscribeParcelles(userId: string, callback: (parcelles: Parcelle[]) => void) {
  return parcellesRef(userId).orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    const items: Parcelle[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Parcelle);
    });
    callback(items);
  });
}
```

### مثال: التحقق من المصادقة والتوجيه التلقائي
```typescript
// app/_layout.tsx
useEffect(() => {
  if (loading) return;
  const inAuthGroup = segments[0] === '(auth)';
  if (!user && !inAuthGroup) {
    router.replace('/(auth)/login');
  } else if (user && inAuthGroup) {
    router.replace('/(tabs)');
  }
}, [user, loading, segments]);
```

---

## التشغيل

```bash
# تثبيت الحزم
npm install

# تشغيل على Android
npx expo run:android

# تشغيل على iOS
npx expo run:ios
```

> **ملاحظة:** يجب وضع `google-services.json` في `android/app/` و `GoogleService-Info.plist` في `ios/` قبل التشغيل.

---

## الافتراضات (Assumptions)

1. **طريقة المصادقة:** البريد الإلكتروني + كلمة المرور فقط (أبسط طريقة)
2. **وزن المحاصيل:** بالكيلوغرام (كغ) كوحدة واحدة
3. **المساحة:** بالهكتار كوحدة واحدة
4. **تاريخ المحصول:** يُسجل تلقائياً عند الإضافة (التاريخ الحالي)
5. **الزراعات (cultures):** تُدخل كنص مفصول بفاصلة (أبسط من قائمة ديناميكية)
6. **اللغة:** الواجهة بالعربية (MSA مع بعض الدارجة في التعليقات)

---

## التحقق من المتطلبات (Verification Against Requirements)

| # | المتطلب | الحالة | الموقع |
|---|---------|--------|--------|
| 1 | المصادقة عبر Firebase Auth | ✅ | `context/AuthContext.tsx` + `app/(auth)/login.tsx` + `app/(auth)/register.tsx` |
| 2 | نوع ملف شخصي واحد: "فلاح" | ✅ | لا يوجد نظام أدوار — كل مستخدم هو فلاح تلقائياً |
| 3 | إدارة المعلومات الشخصية | ✅ | `app/(tabs)/profile.tsx` + `services/firestoreService.ts` (getUserProfile, saveUserProfile) |
| 4 | إدارة القطع الأرضية (مساحة، زراعات، فترة حصاد، أوزان) | ✅ | `app/parcelle/*` + `services/firestoreService.ts` (Parcelle CRUD) — الأوزان تُسجل في المحاصيل لكل منطقة |
| 5 | تتبع المحاصيل بالمناطق + سجل | ✅ | `app/zone/[id].tsx` + `app/recolte/add.tsx` + `services/firestoreService.ts` (subscribeRecoltes) |
| 6 | مزامنة البيانات عبر السحابة | ✅ | Firestore `onSnapshot` في جميع الشاشات — المزامنة لحظية |
| 7 | يعمل على Android و iOS | ✅ | React Native + Expo + `@react-native-firebase/*` — منصة واحدة لكلا النظامين |

---

## Stack التقني

- **React Native** (Expo SDK 54) + **Expo Router** v6
- **Firebase Auth** (Email/Password)
- **Cloud Firestore** (Real-time sync)
- **TypeScript**
