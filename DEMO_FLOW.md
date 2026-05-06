# Air Cargo Management System - Demo Flow Guide

## Live Demo URL
- Frontend: _(will be updated after deployment)_
- Public Tracking: _(will be updated after deployment)_

---

## Demo Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | admin@aircargo.com   |
| Password | admin123             |

---

## Step-by-Step Flow

### 1. Login Page

**URL:** `/login`

1. Open the application URL
2. You will see the AirCargo login page
3. Enter the demo credentials above
4. Click **"Sign In"**
5. You will be redirected to the Dashboard

**What to notice:**
- Clean, professional login UI
- Error handling (try wrong password to see error message)
- Option to "Create Account" for new admin registration

---

### 2. Dashboard

**URL:** `/` (after login)

After login, you land on the Dashboard page showing:

| Section | What it shows |
|---------|---------------|
| Total Shipments | Count of all shipments in the system |
| Active Shipments | Shipments not yet delivered |
| Delivered | Successfully delivered shipments |
| Customers | Total registered customers |
| Recent Shipments | Last 5 shipments with status badges |
| Status Breakdown | Count per status (Booked, Accepted, In Transit, Arrived, Delivered) |

**What to notice:**
- Real-time statistics from the database
- Color-coded status badges
- Clean card-based layout

---

### 3. Shipments Management

**URL:** `/shipments`

#### 3.1 View All Shipments

1. Click **"Shipments"** in the left sidebar
2. You will see a table with all shipments showing:
   - AWB Number (unique tracking ID)
   - Route (Origin → Destination)
   - Customer name
   - Weight (kg)
   - Status (color-coded badge)
   - Booked Date
   - Action buttons (View, Delete)

**What to notice:**
- Search bar: type "Dubai" or "AWB-20260503" to filter
- Status dropdown filter: select "IN_TRANSIT" to see only in-transit shipments
- Pagination at the bottom

#### 3.2 Create New Shipment

1. Click the **"+ New Shipment"** button (top right)
2. Fill in the form:
   - **Origin**: e.g., "Mumbai (BOM)"
   - **Destination**: e.g., "London (LHR)"
   - **Weight**: e.g., "350"
   - **Length/Width/Height**: optional dimensions
   - **Customer**: select from dropdown (pre-populated from customer list)
   - **Estimated Delivery**: pick a future date
   - **Description**: e.g., "Electronics shipment"
3. Click **"Create Shipment"**
4. You will be redirected to the shipments list with the new shipment visible

**What to notice:**
- AWB number is auto-generated (format: AWB-YYYYMMDD-XXXX)
- Customer dropdown is populated from the Customers module
- Validation on required fields

#### 3.3 View & Edit Shipment

1. Click the **eye icon** on any shipment row
2. You will see the shipment detail page with:
   - Left side: Shipment form (editable)
   - Right side: Status update panel + Status timeline

**What to notice:**
- All fields are pre-filled and editable
- "Save Changes" button to update shipment details

#### 3.4 Update Shipment Status

On the shipment detail page (right panel):

1. Select a new status from the dropdown (e.g., "ACCEPTED" → "IN_TRANSIT")
2. Enter **Location**: e.g., "Frankfurt Hub"
3. Enter **Notes**: e.g., "Cleared customs, loaded on flight LH490"
4. Click **"Update Status"**
5. The Status Timeline below will immediately show the new entry

**Status Flow:**
```
BOOKED → ACCEPTED → IN_TRANSIT → ARRIVED → DELIVERED
```

**What to notice:**
- Timeline shows all status changes with timestamps
- Each entry shows location and notes
- Most recent status appears at the top
- Status badge on the shipment updates in real-time

---

### 4. Customer Management

**URL:** `/customers`

#### 4.1 View All Customers

1. Click **"Customers"** in the left sidebar
2. You will see a table showing:
   - Name
   - Email
   - Company
   - Phone
   - Number of shipments
   - Action buttons

**What to notice:**
- Search bar to find customers by name, email, or company
- Shipment count shows how many shipments each customer has

#### 4.2 Create New Customer

1. Click **"+ New Customer"** button
2. Fill in the form:
   - **Name**: e.g., "James Wilson" (required)
   - **Email**: e.g., "james@logistics.com" (required, must be unique)
   - **Phone**: e.g., "+44-20-7946-0958"
   - **Company**: e.g., "Wilson Freight Ltd"
   - **Address**: e.g., "10 Fleet Street, London, UK"
3. Click **"Create Customer"**
4. You will be redirected to the customer list

#### 4.3 Edit Customer

1. Click the **eye icon** on any customer row
2. Modify any field
3. Click **"Save Changes"**

---

### 5. Public Shipment Tracking

**URL:** `/track`

This page is accessible **without login** — designed for end customers to track their shipments.

1. Click **"Track Shipment"** in the sidebar (or go directly to `/track`)
2. Enter an AWB number: `AWB-20260503-1002`
3. Click **"Track"**
4. You will see:
   - Shipment summary (AWB, origin, destination, weight, status)
   - Shipper information
   - Booked date and estimated delivery
   - Full tracking history timeline with dates, locations, and notes

**Try these AWB numbers:**

| AWB Number | Status | Route |
|------------|--------|-------|
| AWB-20260501-1001 | DELIVERED | New York → London |
| AWB-20260503-1002 | IN_TRANSIT | Berlin → Dubai |
| AWB-20260505-1003 | ACCEPTED | Tokyo → Los Angeles |
| AWB-20260504-1004 | IN_TRANSIT | Dubai → Singapore |
| AWB-20260507-1005 | BOOKED | Sydney → Hong Kong |
| AWB-20260502-1006 | ARRIVED | London → New York |

**What to notice:**
- No login required for tracking
- Clean, customer-facing UI
- Visual timeline with status progression
- Error message for invalid AWB numbers

---

### 6. Logout

1. Look at the bottom-left corner of the sidebar
2. You will see the logged-in user's name and email
3. Click the **logout icon** (door/arrow icon)
4. You will be redirected to the login page

---

## Complete Test Scenario (End-to-End)

Follow this sequence to test the full flow:

1. **Login** with admin credentials
2. **Create a Customer**: "Test Client" / test@client.com / "Test Corp"
3. **Create a Shipment**: Origin "Paris (CDG)" → Destination "New York (JFK)", Weight 200kg, select "Test Client" as customer
4. **Note the AWB number** that was auto-generated
5. **Open the shipment**, update status to "ACCEPTED" with location "Paris CDG Hub"
6. **Update again** to "IN_TRANSIT" with notes "Loaded on AF001"
7. **Check Dashboard** — stats should reflect the new shipment
8. **Go to Track page** — enter the AWB number from step 4
9. **Verify** the tracking shows the full timeline (BOOKED → ACCEPTED → IN_TRANSIT)
10. **Logout** and try tracking again (should work without login)

---

## Key Features Demonstrated

| Feature | Where to find |
|---------|--------------|
| JWT Authentication | Login/Logout flow |
| Role-based access | All pages except /track require login |
| CRUD Operations | Shipments + Customers pages |
| Auto-generated IDs | AWB numbers on new shipments |
| Real-time updates | Status timeline, dashboard stats |
| Search & Filter | Shipments (status + text), Customers (text) |
| Pagination | Shipments and Customers lists |
| Public-facing page | /track page (no auth needed) |
| Responsive design | Try resizing the browser window |
| Professional UI | Consistent design with Tailwind CSS |

---

## Technical Highlights for Client

- **Clean Architecture**: Modular backend (NestJS) with separate modules per feature
- **Type Safety**: Full TypeScript across frontend and backend
- **Database**: PostgreSQL with Prisma ORM (migrations, seeding)
- **API Design**: RESTful with validation, pagination, filtering
- **Security**: JWT tokens, password hashing (bcrypt), CORS protection
- **Scalable**: Ready to add features like notifications, reports, multi-role access
