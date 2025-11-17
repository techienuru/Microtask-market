# API Examples

Collection of curl commands to test the Micro-Task Market API.

## Authentication

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "08012345678",
    "password": "Password123",
    "role": "worker",
    "lga": "Lafia",
    "neighbourhood": "New Market"
  }'
```

### 2. Request OTP

```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test@example.com"}'
```

### 3. Verify OTP & Login

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "identifier": "test@example.com",
    "otp": "123456"
  }'
```

### 4. Login with Password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "identifier": "aunty.z@example.com",
    "password": "password123",
    "rememberMe": true
  }'
```

### 5. Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

## Admin

### 6. Seed Database

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "X-Admin-Key: admin-seed-key-for-demo"
```

## Tasks

### 7. Create Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Clean market stall",
    "description": "Need help cleaning after market hours",
    "pay": 1500,
    "location": "Lafia New Market",
    "dateTime": "2025-01-20T16:00:00Z",
    "mode": "single",
    "proofRequired": true,
    "category": "cleaning"
  }'
```

### 8. Reserve Task

```bash
curl -X POST http://localhost:3000/api/tasks/TASK_ID/reserve \
  -b cookies.txt
```

### 9. Apply for Task

```bash
curl -X POST http://localhost:3000/api/tasks/TASK_ID/apply \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"note": "I have experience with this type of work"}'
```

### 10. Upload Task Proof

```bash
curl -X POST http://localhost:3000/api/tasks/TASK_ID/proof \
  -b cookies.txt \
  -F "type=photo" \
  -F "beforeImage=@before.jpg" \
  -F "afterImage=@after.jpg"
```

## Payments

### 11. Create Escrow

```bash
curl -X POST http://localhost:3000/api/payments/escrow/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "taskId": "TASK_ID",
    "amount": 5000,
    "proofImageUrl": "/uploads/transfer-proof.jpg"
  }'
```

### 12. Release Escrow

```bash
curl -X POST http://localhost:3000/api/payments/escrow/ESCROW_ID/release \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"recipientId": "USER_ID"}'
```

## Notes

- Replace `TASK_ID`, `ESCROW_ID`, `USER_ID` with actual IDs from responses
- Use `-c cookies.txt` to save cookies and `-b cookies.txt` to send them
- For file uploads, ensure the files exist in your current directory
- The admin seed key is set in your `.env` file as `ADMIN_SEED_KEY`
