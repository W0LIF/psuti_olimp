# API Endpoints Reference

**Base URL:** `https://psuti-olimp.onrender.com`

---

## 🔐 Authentication Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}

Response 201:
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe"
}

Response 400:
{
  "detail": "Email already registered"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": ""
}

Response 200:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}

Response 401:
{
  "detail": "Invalid credentials"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <access_token>

Response 200:
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe"
}
```

---

## 📁 Category Endpoints

### Get All Categories
```
GET /categories/
Authorization: Bearer <access_token>

Response 200:
[
  {
    "id": 1,
    "name": "Еда",
    "icon": "🍔",
    "is_default": true,
    "user_id": 1
  },
  ...
]
```

### Create Category
```
POST /categories/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Кино",
  "icon": "🎬",
  "is_default": false
}

Response 201:
{
  "id": 7,
  "name": "Кино",
  "icon": "🎬",
  "is_default": false,
  "user_id": 1
}
```

### Delete Category
```
DELETE /categories/{category_id}
Authorization: Bearer <access_token>

Response 200:
{
  "ok": true
}

Response 400:
{
  "detail": "Cannot delete default category or category not found"
}
```

---

## 💰 Transaction Endpoints

### Create Transaction
```
POST /transactions/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 500.50,
  "type": "expense",
  "date": "2026-04-22",
  "comment": "Обед",
  "category_id": 1
}

Response 201:
{
  "id": 42,
  "amount": 500.50,
  "type": "expense",
  "date": "2026-04-22",
  "comment": "Обед",
  "category_id": 1,
  "user_id": 1
}
```

### Get Transactions
```
GET /transactions/?start_date=2026-04-01&end_date=2026-04-30&category_id=1
Authorization: Bearer <access_token>

Response 200:
[
  {
    "id": 1,
    "amount": 500.50,
    "type": "expense",
    "date": "2026-04-22",
    "comment": "Обед",
    "category_id": 1,
    "user_id": 1
  },
  ...
]
```

### Delete Transaction
```
DELETE /transactions/{transaction_id}
Authorization: Bearer <access_token>

Response 200:
{
  "ok": true
}
```

---

## 📊 Budget Endpoints

### Create Budget
```
POST /budgets/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "month": 4,
  "year": 2026,
  "category_id": null,
  "limit_amount": 10000
}

Response 201:
{
  "id": 1,
  "month": 4,
  "year": 2026,
  "category_id": null,
  "limit_amount": 10000,
  "user_id": 1
}

Response 400:
{
  "detail": "Budget already exists for this period"
}
```

### Get Budget Progress
```
GET /budgets/progress
Authorization: Bearer <access_token>

Response 200:
[
  {
    "budget_id": 1,
    "category_id": 1,
    "limit": 5000,
    "spent": 3200.75,
    "percent": 64.01,
    "status": "ok"
  },
  {
    "budget_id": 2,
    "category_id": 2,
    "limit": 2000,
    "spent": 2150,
    "percent": 107.5,
    "status": "exceeded"
  }
]
```

Status Values: `ok` (< 80%), `warning` (80-100%), `exceeded` (> 100%)

---

## 📈 Statistics Endpoints

### Get Dashboard Stats
```
GET /stats/dashboard
Authorization: Bearer <access_token>

Response 200:
{
  "balance": 1800,
  "total_income": 5000,
  "total_expense": 3200,
  "category_breakdown": [
    {
      "category": "Еда",
      "icon": "🍔",
      "amount": 1200
    },
    {
      "category": "Транспорт",
      "icon": "🚌",
      "amount": 800
    },
    ...
  ]
}
```

---

## ❤️ Health Check

### Check API Status
```
GET /health

Response 200:
{
  "status": "ok",
  "timestamp": "2026-04-22T10:30:45.123456"
}
```

---

## 🔄 Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid token"
}
```

### 400 Bad Request
```json
{
  "detail": "Description of what went wrong"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "amount"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt"
    }
  ]
}
```

---

## 📝 Notes

1. All requests require `Authorization: Bearer <access_token>` header (except /auth/register, /auth/login, /health)
2. All timestamps are in ISO 8601 format
3. All amounts are in the smallest currency unit or as floats
4. Dates are in YYYY-MM-DD format
5. CORS is enabled - requests can be made from any origin

---

## 🧪 Testing with cURL

```bash
# Register
curl -X POST https://psuti-olimp.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","full_name":"Test User"}'

# Login
curl -X POST https://psuti-olimp.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get categories (replace TOKEN with your access_token)
curl -X GET https://psuti-olimp.onrender.com/categories/ \
  -H "Authorization: Bearer TOKEN"

# Create transaction
curl -X POST https://psuti-olimp.onrender.com/transactions/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"type":"expense","date":"2026-04-22","category_id":1}'
```
