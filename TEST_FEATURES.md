# Feature Testing Checklist

## ✅ Test Each Feature One by One

### 1. **Order Status Display** 📦
**Location**: `/orders` (Buyer view)

**Expected**:
- Each order shows icon (Clock/Package/Truck/Check/X)
- Shows status label (Pending/Processing/Shipped/Delivered/Cancelled)
- Shows "Next: [status]" for non-final statuses

**Test Steps**:
1. Login as buyer
2. Go to "My Orders" page
3. Check each order card shows:
   - Icon for current status
   - Status badge with label
   - "Next: Processing/Shipped/Delivered" text

**Files**: `OrdersPage.jsx` - `getStatusIcon()` function

---

### 2. **Order Filtering** 🔍
**Location**: `/seller/dashboard` → Orders tab

**Expected**:
- Dropdown to filter by status (All/Pending/Processing/Shipped/Delivered/Cancelled)
- Dropdown to sort (Newest/Oldest/Highest Value/Lowest Value)
- Date range pickers (Start and End date)
- Clear Filters button

**Test Steps**:
1. Login as seller
2. Go to Seller Dashboard
3. Click "Orders" tab
4. See filter section above orders table
5. Select "Delivered" status → see only delivered orders
6. Select "Highest Value" sort → see orders sorted by amount DESC
7. Pick date range → see only orders in that range
8. Click "Clear Filters" → see all orders

**Files**: `SellerDashboard.jsx` - lines 410-490

---

### 3. **Message Customer (Seller)** 💬
**Location**: `/seller/dashboard` → Orders tab

**Expected**:
- Message icon button appears for delivered/shipped orders
- Clicking sends initial message
- Redirects to `/messages`
- Conversation appears in list

**Test Steps**:
1. Login as seller
2. Go to Seller Dashboard → Orders tab
3. Find a delivered or shipped order
4. Click message icon button
5. See toast "Conversation started!"
6. Redirected to /messages
7. See conversation with customer name
8. Click conversation → see initial message

**Files**: 
- `SellerDashboard.jsx` - `handleMessageCustomer()`
- Backend: `combinedController.js` - `sendMessage()`

---

### 4. **Message Seller (Buyer)** 💬
**Location**: `/orders` (Buyer view)

**Expected**:
- "Message Seller" button appears for delivered/shipped orders
- Clicking initiates conversation
- Redirects to `/messages`

**Test Steps**:
1. Login as buyer
2. Go to "My Orders"
3. Find a delivered or shipped order
4. Click "Message Seller" button
5. Redirected to /messages
6. See conversation with seller name

**Files**:
- `OrdersPage.jsx` - `handleMessageSeller()`

---

### 5. **Conversation List** 📝
**Location**: `/messages`

**Expected**:
- Shows list of conversations on left panel
- Each conversation shows:
  - User avatar (first letter)
  - User name
  - Last message preview
- Clicking conversation loads messages on right

**Test Steps**:
1. Login (any role)
2. Go to /messages
3. See conversations list on left
4. Each shows name properly (not undefined)
5. Click conversation
6. Messages load on right panel

**Files**:
- `MessagingPage.jsx`
- Backend: `combinedController.js` - `getConversations()`

---

### 6. **Send/Receive Messages** ✉️
**Location**: `/messages`

**Expected**:
- Can type message in input at bottom
- Click send or press Enter
- Message appears on right (sent)
- Other user sees it on left (received)

**Test Steps**:
1. Open conversation
2. Type message in input
3. Click Send button
4. Message appears on right side (blue)
5. Login as other user
6. Open same conversation
7. See message on left side (gray)

**Files**:
- `MessagingPage.jsx` - `handleSendMessage()`
- Backend: `combinedController.js` - `sendMessage()`, `getMessages()`

---

## 🔧 Common Issues & Fixes

### Issue: Conversations list is empty
**Fix**: Check backend console for errors. Ensure:
- Messages exist in database
- `getConversations()` returns proper user data
- Frontend displays `conv.name` not `conv.otherUser.name`

### Issue: "Message Seller" button doesn't appear
**Fix**: Check:
- Order status is 'delivered' or 'shipped'
- OrdersPage.jsx has proper condition
- product.seller is populated in order

### Issue: Order filtering doesn't work
**Fix**: Check:
- `orderFilter`, `orderSort`, `dateRange` state exists
- Filter logic in SellerDashboard.jsx lines 456-490
- Date comparisons use new Date()

### Issue: Order status icons not showing
**Fix**: Check:
- Icons imported from '../components/icons'
- `getStatusIcon()` returns {icon, label, next}
- XCircleIcon exists in icons/index.jsx

---

## 📝 Quick Test Script

```bash
# Terminal 1 - Backend
cd D:\projects\SmartShop\backend
npm start

# Terminal 2 - Frontend
cd D:\projects\SmartShop\frontend
npm start

# Open browser: http://localhost:3000
# Test each feature above
```

---

## ✅ Verification Checklist

After testing, mark each:

- [ ] 1. Order Status Display works
- [ ] 2. Order Filtering works (status/date/sort)
- [ ] 3. Seller can message customer from dashboard
- [ ] 4. Buyer can message seller from orders
- [ ] 5. Conversation list shows proper names
- [ ] 6. Messages send/receive correctly

**All features must work for all user roles (Buyer/Seller/Admin)**
