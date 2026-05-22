# Teapetti — Frontend Documentation

> Campus Coffee Shop · College Students Union · v1.0

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Design System](#3-design-system)
4. [Routing](#4-routing)
5. [State Management](#5-state-management)
6. [Components](#6-components)
7. [User Pages](#7-user-pages)
8. [Admin Pages](#8-admin-pages)
9. [API Integration](#9-api-integration)
10. [Environment & Scripts](#10-environment--scripts)

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **React 18** (Vite) | Fast HMR, component-based, large ecosystem |
| Routing | **React Router v6** | Nested routes, protected route support |
| Styling | **Tailwind CSS** | Utility-first, consistent design tokens |
| State | **Zustand** | Lightweight global state, no boilerplate |
| Data Fetching | **TanStack Query (React Query)** | Caching, loading/error states, refetch |
| HTTP Client | **Axios** | Interceptors for auth token injection |
| Tables | **TanStack Table** | Headless, sortable/filterable tables |
| Excel | **SheetJS (xlsx)** | Import/export `.xlsx` files in the browser |
| Icons | **Lucide React** | Consistent, minimal icon set |
| Notifications | **React Hot Toast** | Minimal toast notifications |

---

## 2. Project Structure

```
src/
├── assets/              # Static images, fonts, logo
│   └── logo.svg
│
├── components/          # Reusable UI components
│   ├── layout/
│   │   ├── UserNavbar.jsx
│   │   ├── AdminNavbar.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── InputField.jsx
│   │   ├── MenuItemCard.jsx
│   │   ├── StudentCard.jsx
│   │   ├── SaleItemBox.jsx
│   │   └── GradientBlob.jsx
│   └── tables/
│       ├── StudentTable.jsx
│       └── HistoryTable.jsx
│
├── pages/
│   ├── user/
│   │   ├── Home.jsx
│   │   ├── Students.jsx
│   │   ├── Classes.jsx
│   │   ├── ClassDetail.jsx
│   │   └── Menu.jsx
│   └── admin/
│       ├── Login.jsx
│       ├── AdminHome.jsx
│       ├── AdminStudents.jsx
│       ├── Sale.jsx
│       └── MenuManagement.jsx
│
├── store/               # Zustand stores
│   ├── authStore.js
│   ├── saleStore.js
│   └── menuStore.js
│
├── hooks/               # Custom React hooks
│   ├── useStudentLookup.js
│   ├── useClassStudents.js
│   └── useMenuItems.js
│
├── api/                 # Axios API layer
│   ├── axiosInstance.js
│   ├── students.js
│   ├── sales.js
│   ├── menu.js
│   └── auth.js
│
├── utils/
│   ├── excelUtils.js    # SheetJS import/export helpers
│   └── formatters.js    # Currency, date formatters
│
├── router.jsx           # Route definitions
├── App.jsx
└── main.jsx
```

---

## 3. Design System

### 3.1 Tailwind Config (`tailwind.config.js`)

```js
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:  '#E07B1A',   // orange accent
          light:    '#FFF3E0',   // peach background
          mid:      '#F5C77E',   // amber
          dark:     '#1A1A1A',   // near-black text
          danger:   '#E53935',   // red for delete/discard
          success:  '#388E3C',   // green for save
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(224,123,26,0.10)',
        blob: '0 0 120px 60px rgba(245,199,126,0.35)',
      }
    }
  }
}
```

### 3.2 CSS Variables (`index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --c-primary:  #E07B1A;
  --c-light:    #FFF3E0;
  --c-mid:      #F5C77E;
  --c-dark:     #1A1A1A;
  --c-danger:   #E53935;
  --c-success:  #388E3C;
}

body {
  background-color: var(--c-light);
  color: var(--c-dark);
  font-family: 'Plus Jakarta Sans', sans-serif;
}
```

### 3.3 Core UI Components

#### `Button.jsx`
```jsx
// variants: 'primary' | 'danger' | 'success' | 'ghost'
// sizes:    'sm' | 'md' | 'lg'
const variants = {
  primary: 'bg-brand-primary text-white hover:bg-orange-600',
  danger:  'bg-brand-danger  text-white hover:bg-red-700',
  success: 'bg-brand-success text-white hover:bg-green-700',
  ghost:   'bg-white border border-brand-primary text-brand-primary hover:bg-brand-light',
}

export default function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button
      className={`${variants[variant]} rounded-pill font-semibold transition-all ${sizeMap[size]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### `Badge.jsx`
```jsx
// Used for class codes, price labels, admission number chips
export default function Badge({ children, color = 'primary' }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-bold tracking-wide">
      {children}
    </span>
  )
}
```

#### `GradientBlob.jsx`
```jsx
// Decorative background blob — positioned absolute inside a relative container
export default function GradientBlob({ className = '' }) {
  return (
    <div
      className={`absolute rounded-full bg-brand-mid opacity-40 blur-3xl pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
```

#### `MenuItemCard.jsx`
```jsx
export default function MenuItemCard({ item, action, actionLabel }) {
  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-[12px]" />
      <div className="p-3">
        <p className="font-semibold text-sm">{item.name}</p>
        {action && (
          <Button variant={actionLabel === 'Remove' ? 'danger' : 'success'} size="sm" onClick={action}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

## 4. Routing

### `router.jsx`

```jsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// User pages
import Home         from './pages/user/Home'
import Students     from './pages/user/Students'
import Classes      from './pages/user/Classes'
import ClassDetail  from './pages/user/ClassDetail'
import Menu         from './pages/user/Menu'

// Admin pages
import Login           from './pages/admin/Login'
import AdminHome       from './pages/admin/AdminHome'
import AdminStudents   from './pages/admin/AdminStudents'
import Sale            from './pages/admin/Sale'
import MenuManagement  from './pages/admin/MenuManagement'

function ProtectedRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/admin/login" replace />
}

export const router = createBrowserRouter([
  // ── User routes ──────────────────────────────────────
  { path: '/',                 element: <Home /> },
  { path: '/students',         element: <Students /> },
  { path: '/classes',          element: <Classes /> },
  { path: '/classes/:code',    element: <ClassDetail /> },
  { path: '/menu',             element: <Menu /> },

  // ── Admin routes ─────────────────────────────────────
  { path: '/admin/login',    element: <Login /> },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminHome /></ProtectedRoute>
  },
  {
    path: '/admin/students',
    element: <ProtectedRoute><AdminStudents /></ProtectedRoute>
  },
  {
    path: '/admin/sale',
    element: <ProtectedRoute><Sale /></ProtectedRoute>
  },
  {
    path: '/admin/menu',
    element: <ProtectedRoute><MenuManagement /></ProtectedRoute>
  },
])
```

---

## 5. State Management

### 5.1 Auth Store (`store/authStore.js`)

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist(
  (set) => ({
    token: null,
    admin: null,
    login:  (token, admin) => set({ token, admin }),
    logout: () => set({ token: null, admin: null }),
  }),
  { name: 'Teapetti-auth' }
))
```

### 5.2 Sale Store (`store/saleStore.js`)

```js
// Holds the in-progress sale cart — ephemeral, not persisted
import { create } from 'zustand'

export const useSaleStore = create((set, get) => ({
  student:   null,   // currently looked-up student object
  cartItems: [],     // [{ id, name, price }]

  setStudent: (student) => set({ student, cartItems: [] }),
  clearStudent: () => set({ student: null, cartItems: [] }),

  addItem: (item) => set(s => ({
    cartItems: [...s.cartItems, { ...item, uid: crypto.randomUUID() }]
  })),

  removeItem: (uid) => set(s => ({
    cartItems: s.cartItems.filter(i => i.uid !== uid)
  })),

  cartTotal: () => get().cartItems.reduce((sum, i) => sum + i.price, 0),

  discard: () => set({ cartItems: [] }),
}))
```

### 5.3 Menu Store (`store/menuStore.js`)

```js
import { create } from 'zustand'

export const useMenuStore = create((set) => ({
  available: [],
  selected:  [],

  setItems: (available, selected) => set({ available, selected }),

  moveToSelected: (itemId) => set(s => {
    const item = s.available.find(i => i.id === itemId)
    return {
      available: s.available.filter(i => i.id !== itemId),
      selected:  [...s.selected, item],
    }
  }),

  moveToAvailable: (itemId) => set(s => {
    const item = s.selected.find(i => i.id === itemId)
    return {
      selected:  s.selected.filter(i => i.id !== itemId),
      available: [...s.available, item],
    }
  }),
}))
```

---

## 6. Components

### 6.1 Shared Layout

#### `UserNavbar.jsx`
```jsx
// Links: Home | Students | Classes | Menu
// Active link gets: className="bg-brand-primary text-white rounded-pill px-4 py-1"
```

#### `AdminNavbar.jsx`
```jsx
// Links: Home | Students | Sale | Menu
// Same active-link style as UserNavbar
// Shows admin name on right with logout icon
```

#### `Footer.jsx`
```jsx
// Thin top border (brand-mid), logo wordmark left, minimal text
```

### 6.2 `StudentCard.jsx`

Used on both the **User Students** page and the **Admin Sale** page.

```jsx
// Props: student, showHistory (bool), showSaleButtons (bool)
// When showHistory=true  → renders HistoryTable below
// When showSaleButtons=true → renders Coffee/Snack buttons + cart
```

### 6.3 `SaleItemBox.jsx`

One box per item added to the cart on the Sale page.

```jsx
export default function SaleItemBox({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-card px-4 py-3 shadow-card">
      <span className="font-semibold">{item.name}</span>
      <span className="text-brand-primary font-bold">₹{item.price}</span>
      <button onClick={() => onRemove(item.uid)}
        className="text-brand-danger hover:opacity-70">
        ✕
      </button>
    </div>
  )
}
```

### 6.4 `HistoryTable.jsx`

```jsx
// Columns: Date | Item columns (Coffee/Tea/Snack counts) | Total
// Compact, small font, thin borders
// Receives: rows = [{ date, coffee, tea, snack5, snack10, snack15, total }]
```

---

## 7. User Pages

### 7.1 `Home.jsx`

```
Layout (single column, full-width sections):

┌─────────────────────────────────────────────────────┐
│ UserNavbar                                          │
├─────────────────────────────────────────────────────┤
│ HERO SECTION                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │ Headline + CTAs      │  │  Coffee cup image    │ │
│  │ GradientBlob behind  │  │                      │ │
│  └──────────────────────┘  └──────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ Marquee strip (scrolling text)                      │
├─────────────────────────────────────────────────────┤
│ TODAY'S MENU                                        │
│  [card] [card] [card] [card]                        │
│  [card] [card] [card] [card]                        │
├─────────────────────────────────────────────────────┤
│ Footer                                              │
└─────────────────────────────────────────────────────┘
```

**Key implementation notes:**
- Hero headline uses `font-display` (Syne), two words in black, one word in `text-brand-primary`
- Marquee: CSS `@keyframes marquee` infinite horizontal scroll; duplicate text node to seamlessly loop
- CTA buttons: `Search` → `navigate('/students')`, `Menu` → smooth scroll to `#menu` anchor
- Menu cards fetched via `useMenuItems()` hook (only `isActive: true` items)

### 7.2 `Students.jsx`

```
States: idle → loading → result | error

IDLE:
┌─────────────────────────────────┐
│       GradientBlob (bg)         │
│   "Search Students" heading     │
│   [  admission number  ] 🔍     │
└─────────────────────────────────┘

RESULT:
┌──────────────────────────────────────────┐
│ [3702 | 8A]              [avatar square] │
│  Student Name                            │
│  ₹305    Months▼    -₹200               │
│ ─────────────────────────────────────── │
│ History Table                            │
└──────────────────────────────────────────┘
```

**Behaviour:**
- On form submit → `GET /api/students/lookup?admNo=xxxx`
- `Months` dropdown filters history rows client-side (last 1 / 3 / 6 / all months)
- Negative balance displayed in `text-brand-danger`
- Invalid admNo → inline error below input field

### 7.3 `Classes.jsx`

```
Classes grid:
[ 1A ] [ 1B ] [ 2A ] [ 2B ] [ 3  ]
[ 4A ] [ 4B ] [ 5  ] [ 6A ] [ 6B ]
[ 7A ] [ 7B ]

Each tile: large bold text, thin underline accent, cursor-pointer
On click: navigate(`/classes/${code}`)
```

### 7.4 `ClassDetail.jsx`

```jsx
// Reads :code from useParams()
// Fetches: GET /api/students?class=7A
// Renders StudentTable with columns: Roll No | Name | Adm. No | Class | Balance
// Back button → navigate('/classes')
```

### 7.5 `Menu.jsx`

```
┌─────────────────────────────────────────────┐
│  "Today's Menu" heading                     │
│  [card][card][card][card]                   │
│  [card][card][card][card]                   │
└─────────────────────────────────────────────┘
```

- Same cards as Home page menu section
- No action buttons on cards (user-facing, read-only)

---

## 8. Admin Pages

### 8.1 `Login.jsx`

```
Centred card (~380px wide):
┌─────────────────────┐
│     Teapetti logo      │
│  [  username      ] │
│  [  password      ] │
│  [Del]       [Login]│
└─────────────────────┘
```

**Behaviour:**
- `POST /api/auth/login` with `{ username, password }`
- On success: store token via `authStore.login()`, navigate to `/admin`
- On failure: red inline error `"Invalid credentials"`
- `Del` button clears both fields

### 8.2 `AdminHome.jsx`

```
"Admin Features" heading + 4 feature cards in 2×2 grid:
┌──────────┐  ┌──────────┐
│ Students │  │   Sale   │
└──────────┘  └──────────┘
┌──────────┐  ┌──────────┐
│   Menu   │  │  (open)  │
└──────────┘  └──────────┘
```

Each card: icon + label, click → navigate to route.

### 8.3 `AdminStudents.jsx`

```
┌─────────────────────────────────────────────────────┐
│ "Students"     [Import Excel] [Export Excel] [+Add] │
├──────┬─────────────────┬───────┬─────────┬──────────┤
│ Roll │ Name            │Balance│ Class   │ Actions  │
├──────┼─────────────────┼───────┼─────────┼──────────┤
│ ...  │ ...             │ ...   │ ...     │ ✏️ 🗑️    │
└──────┴─────────────────┴───────┴─────────┴──────────┘
```

**Add / Edit Modal fields:** Name · Admission No · Class · Initial Balance  
**Delete:** Confirmation dialog before `DELETE /api/students/:id`

**Excel Import flow:**
```js
// utils/excelUtils.js
import * as XLSX from 'xlsx'

export function parseStudentExcel(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const wb = XLSX.read(e.target.result, { type: 'binary' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      // Expected columns: Admission No | Name | Class | Balance
      resolve(XLSX.utils.sheet_to_json(ws))
    }
    reader.readAsBinaryString(file)
  })
}

export function exportStudentsExcel(students) {
  const ws = XLSX.utils.json_to_sheet(students.map(s => ({
    'Admission No': s.admissionNumber,
    'Name':         s.name,
    'Class':        s.class,
    'Balance':      s.balance,
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Students')
  XLSX.writeFile(wb, 'Teapetti_students.xlsx')
}
```

### 8.4 `Sale.jsx` ⭐

This is the most critical page. Below is the complete UI flow and state logic.

```
┌──────────────────────────────────────────────────────┐
│ STEP 1 — Student Lookup                              │
│  [ admission number input ]  🔍                      │
├──────────────────────────────────────────────────────┤
│ STEP 2 — Student Card (appears after lookup)         │
│  [3702 | 7A]                     [avatar]            │
│  Student Name                                        │
│                                                      │
│  [Coffee ₹10] [Snack ₹10] [Snack ₹15] [Snack ₹5]   │
├──────────────────────────────────────────────────────┤
│ STEP 3 — Bought section                              │
│  ┌───────────────────────────────────┐               │
│  │ Coffee               ₹10      ✕  │               │
│  └───────────────────────────────────┘               │
│  ┌───────────────────────────────────┐               │
│  │ Snack (₹15)          ₹15      ✕  │               │
│  └───────────────────────────────────┘               │
│                                                      │
│  Total: ₹25                                         │
│                   [Discard]   [Save]                 │
└──────────────────────────────────────────────────────┘
```

**Implementation:**
```jsx
const SALE_ITEMS = [
  { name: 'Coffee',      price: 10 },
  { name: 'Snack',       price: 10 },
  { name: 'Snack',       price: 15 },
  { name: 'Snack',       price: 5  },
]

function Sale() {
  const { student, cartItems, setStudent, addItem, removeItem,
          cartTotal, discard } = useSaleStore()

  const handleSave = async () => {
    await api.sales.create({
      studentId: student.admissionNumber,
      items: cartItems.map(({ name, price }) => ({ name, price })),
      total: cartTotal(),
    })
    toast.success('Sale saved!')
    discard()
  }

  return ( /* JSX */ )
}
```

### 8.5 `MenuManagement.jsx`

```
┌─────────────────────────────────────────────────────────┐
│ "Menu"                                                  │
│         Available              │        Selected        │
│  [card][card][card]            │  [card][card][card]    │
│  [card][card][card]            │  [card][card]          │
│   ↑ each has [Add] button      │   ↑ each has [Remove]  │
└─────────────────────────────────────────────────────────┘
```

**Behaviour:**
- On mount: fetch all items → split into `available` / `selected` via `menuStore`
- `Add` click → `menuStore.moveToSelected(id)` + `PATCH /api/menu/:id { isActive: true }`
- `Remove` click → `menuStore.moveToAvailable(id)` + `PATCH /api/menu/:id { isActive: false }`
- Optimistic UI — store updates instantly, API call in background
- On API error → revert the store change + show error toast

---

## 9. API Integration

### `api/axiosInstance.js`

```js
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

### API Modules

```js
// api/students.js
export const students = {
  getAll:   ()           => api.get('/students'),
  getByClass: (cls)      => api.get(`/students?class=${cls}`),
  lookup:   (admNo)      => api.get(`/students/lookup?admNo=${admNo}`),
  create:   (data)       => api.post('/students', data),
  update:   (id, data)   => api.put(`/students/${id}`, data),
  delete:   (id)         => api.delete(`/students/${id}`),
  import:   (rows)       => api.post('/students/import', { rows }),
}

// api/sales.js
export const sales = {
  create: (data) => api.post('/sales', data),
}

// api/menu.js
export const menu = {
  getAll:      ()           => api.get('/menu'),
  toggleActive: (id, flag)  => api.patch(`/menu/${id}`, { isActive: flag }),
}

// api/auth.js
export const auth = {
  login:  (creds) => api.post('/auth/login', creds),
  logout: ()      => api.post('/auth/logout'),
}
```

---

## 10. Environment & Scripts

### `.env`
```
VITE_API_URL=http://localhost:5000/api
```

### `package.json` scripts
```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview",
    "lint":    "eslint src --ext .jsx,.js"
  }
}
```

### Install
```bash
npm create vite@latest Teapetti-frontend -- --template react
cd Teapetti-frontend
npm install react-router-dom zustand @tanstack/react-query axios \
            @tanstack/react-table lucide-react react-hot-toast xlsx \
            tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

> **Teapetti Frontend** · React 18 + Vite · Tailwind CSS · Zustand
