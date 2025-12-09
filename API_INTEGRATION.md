# API Integration Summary

This document describes the integration between the ANM_PORTAL frontend and the Asha-Ehr-Backend.

## Configuration

### Environment Variables

Create a `.env.local` file in the `ANM_PORTAL` directory with:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

**Important:** 
- Use `NEXT_PUBLIC_BACKEND_URL` (matches previous project structure)
- Do NOT include a trailing slash in the URL
- Replace `https://your-backend.onrender.com` with your actual Render backend URL
- The backend URL should be the base URL where your backend API is hosted
- Fallback: `BACKEND_URL` is also supported for server-side only usage

## API Endpoint Mapping

### Authentication
- **Frontend:** `POST /api/auth/login`
- **Backend:** `POST /auth/login`
- **Request Body:** `{ phone, password }` (also accepts `mobile` for compatibility)
- **Response:** `{ token, name, role, phone }`

### Families
- **Frontend:** `GET /api/family/list` or `GET /api/phc/families`
- **Backend:** `GET /families/list`
- **Response:** `{ families: [...] }`

- **Frontend:** `POST /api/phc/families` or `POST /api/phc/families/add`
- **Backend:** `POST /families/create`
- **Request Body:** `{ area_id, address_line, landmark }`

- **Frontend:** `GET /api/phc/families/[id]`
- **Backend:** `GET /families/:id/full`
- **Response:** `{ family, members, health_records }`

### Members
- **Backend:** `POST /families/add/members`
- **Request Body:** `{ family_id, name, gender, age, relation, phone, adhar_number }`

- **Backend:** `GET /families/byFamily/:family_id`
- **Response:** `{ family_id, members: [...] }`

### Tasks
- **Frontend:** `GET /api/tasks/list` or `GET /api/phc/tasks`
- **Backend:** `GET /tasks/list`
- **Response:** `{ tasks: [...] }`

- **Frontend:** `POST /api/phc/tasks` or `POST /api/phc/tasks/add`
- **Backend:** `POST /tasks/create`
- **Request Body:** `{ asha_worker_id, family_id, member_id, task_type, title, description, due_date, data_json }`

- **Frontend:** `PUT /api/phc/tasks/[id]`
- **Backend:** `PUT /tasks/:task_id` or `PATCH /tasks/:task_id`
- **Request Body:** `{ status, description, due_date, data_json }`

### PHC Areas
- **Frontend:** `GET /api/phc/areas`
- **Backend:** `GET /phcs/areas/list`
- **Response:** `{ areas: [...] }`

- **Frontend:** `POST /api/phc/areas`
- **Backend:** `POST /phcs/areas/create`
- **Request Body:** `{ area_name }`

### Health Records
- **Frontend:** `GET /api/anc/list` → Backend: `GET /health/list` (filtered by visit_type='anc')
- **Frontend:** `GET /api/pnc/list` → Backend: `GET /health/list` (filtered by visit_type='pnc')
- **Frontend:** `GET /api/tb/list` → Backend: `GET /health/list` (filtered by visit_type='tb')
- **Frontend:** `GET /api/ncd/list` → Backend: `GET /health/list` (filtered by visit_type='ncd')
- **Frontend:** `GET /api/immunization/list` → Backend: `GET /health/list` (filtered by visit_type='immunization')
- **Frontend:** `GET /api/general/list` → Backend: `GET /health/list` (general visits)
- **Frontend:** `GET /api/high-risk/list` → Backend: `GET /health/list` (aggregates high-risk cases)

- **Backend:** `POST /health/add`
- **Request Body:** `{ member_id, task_id, visit_type, data_json }`

- **Backend:** `GET /health/member/:member_id`
- **Response:** `{ member_id, records: [...] }`

- **Backend:** `GET /health/byfamily/:family_id`
- **Response:** `{ family_id, records: [...] }`

- **Backend:** `GET /health/list`
- **Response:** `{ records: [...] }`

## Authentication

All backend endpoints (except `/auth/login`) require authentication via Bearer token:

```
Authorization: Bearer <token>
```

The token is obtained from the login endpoint and should be stored in the frontend (typically in localStorage or cookies) and sent with each request.

## Changes Made

### Frontend (ANM_PORTAL)

1. **Created Utility Files**
   - `utils/backendConfig.js` - Centralized backend configuration and endpoint definitions
   - `utils/backendHelper.js` - Server-side helper utilities (matches previous project structure)
   - `utils/api.js` - Updated to use NEXT_PUBLIC_BACKEND_URL

2. **Updated API Routes**
   - `/api/auth/login` - Now uses backend authentication
   - `/api/family/list` - Proxies to backend
   - `/api/phc/families/*` - All family routes updated
   - `/api/phc/areas/*` - Area routes updated
   - `/api/tasks/*` - Task routes updated
   - `/api/phc/tasks/*` - PHC task routes updated
   - `/api/anc/list` - Now uses backend `/health/list` (filtered)
   - `/api/pnc/list` - Now uses backend `/health/list` (filtered)
   - `/api/tb/list` - Now uses backend `/health/list` (filtered)
   - `/api/ncd/list` - Now uses backend `/health/list` (filtered)
   - `/api/immunization/list` - Now uses backend `/health/list` (filtered)
   - `/api/general/list` - Now uses backend `/health/list` (filtered)
   - `/api/high-risk/list` - Now uses backend `/health/list` (aggregated)
   - `/api/dashboard/summary` - Now calculates real statistics from backend data

### Backend (Asha-Ehr-Backend-)

1. **Added Task Update Route**
   - `PUT /tasks/:task_id` - Update task
   - `PATCH /tasks/:task_id` - Update task (alternative)

## Testing

1. Ensure your backend is running on Render
2. Set the `BACKEND_URL` in `.env.local`
3. Restart your Next.js development server
4. Test login functionality first
5. Verify API calls are being proxied correctly by checking browser network tab

## Notes

- The frontend API routes act as a proxy layer between the frontend and backend
- All authentication tokens are automatically forwarded to the backend
- Error handling is implemented to provide meaningful error messages
- The backend URL is read from environment variables for security
