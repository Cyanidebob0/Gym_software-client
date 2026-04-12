// Mock data for Gym Management System — single gym, max 500 members

const d = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
};

export const TODAY = d(0);

export const PLANS = [
    { id: 'p1', name: '1 Month',  duration: 30,  price: 999,  isActive: true },
    { id: 'p2', name: '3 Months', duration: 90,  price: 2699, isActive: true },
    { id: 'p3', name: '6 Months', duration: 180, price: 4999, isActive: true },
    { id: 'p4', name: '12 Months',duration: 365, price: 8999, isActive: true },
    { id: 'p5', name: 'Student 1M',duration: 30, price: 699,  isActive: false },
];

export const MEMBERS = [
    { id: 'm1',  name: 'Arjun Sharma',    phone: '9876543210', email: 'arjun@gmail.com',   address: 'Jayanagar, Bangalore',     govIdType: 'Aadhaar',  govIdNumber: '1234 5678 9012', planId: 'p3', planName: '6 Months',  status: 'active',        joinDate: d(-60),  expiryDate: d(120) },
    { id: 'm2',  name: 'Priya Nair',      phone: '9876543211', email: 'priya@gmail.com',   address: 'HSR Layout, Bangalore',     govIdType: 'Aadhaar',  govIdNumber: '2345 6789 0123', planId: 'p1', planName: '1 Month',   status: 'expiring_soon', joinDate: d(-25),  expiryDate: d(5)   },
    { id: 'm3',  name: 'Rahul Verma',     phone: '9876543212', email: 'rahul@gmail.com',   address: 'Koramangala, Bangalore',    govIdType: 'PAN',      govIdNumber: 'ABCDE1234F',     planId: 'p2', planName: '3 Months',  status: 'active',        joinDate: d(-45),  expiryDate: d(45)  },
    { id: 'm4',  name: 'Sneha Kulkarni',  phone: '9876543213', email: 'sneha@gmail.com',   address: 'Indiranagar, Bangalore',    govIdType: 'Aadhaar',  govIdNumber: '3456 7890 1234', planId: 'p4', planName: '12 Months', status: 'active',        joinDate: d(-90),  expiryDate: d(275) },
    { id: 'm5',  name: 'Kiran Reddy',     phone: '9876543214', email: 'kiran@gmail.com',   address: 'Whitefield, Bangalore',     govIdType: 'Voter ID', govIdNumber: 'VTR123456',      planId: 'p1', planName: '1 Month',   status: 'expired',       joinDate: d(-45),  expiryDate: d(-15) },
    { id: 'm6',  name: 'Ananya Singh',    phone: '9876543215', email: 'ananya@gmail.com',  address: 'BTM Layout, Bangalore',     govIdType: 'Aadhaar',  govIdNumber: '4567 8901 2345', planId: 'p2', planName: '3 Months',  status: 'expiring_soon', joinDate: d(-84),  expiryDate: d(6)   },
    { id: 'm7',  name: 'Vikram Patel',    phone: '9876543216', email: 'vikram@gmail.com',  address: 'Electronic City, Bangalore',govIdType: 'PAN',      govIdNumber: 'FGHIJ5678K',     planId: 'p3', planName: '6 Months',  status: 'active',        joinDate: d(-30),  expiryDate: d(150) },
    { id: 'm8',  name: 'Deepa Menon',     phone: '9876543217', email: 'deepa@gmail.com',   address: 'Marathahalli, Bangalore',   govIdType: 'Aadhaar',  govIdNumber: '5678 9012 3456', planId: 'p1', planName: '1 Month',   status: 'expired',       joinDate: d(-60),  expiryDate: d(-30) },
    { id: 'm9',  name: 'Suresh Kumar',    phone: '9876543218', email: 'suresh@gmail.com',  address: 'Rajajinagar, Bangalore',    govIdType: 'Aadhaar',  govIdNumber: '6789 0123 4567', planId: 'p4', planName: '12 Months', status: 'active',        joinDate: d(-180), expiryDate: d(185) },
    { id: 'm10', name: 'Meera Iyer',      phone: '9876543219', email: 'meera@gmail.com',   address: 'JP Nagar, Bangalore',       govIdType: 'PAN',      govIdNumber: 'LMNOP9012Q',     planId: 'p2', planName: '3 Months',  status: 'blocked',       joinDate: d(-100), expiryDate: d(10)  },
    { id: 'm11', name: 'Rohit Agarwal',   phone: '9876543220', email: 'rohit@gmail.com',   address: 'Hebbal, Bangalore',         govIdType: 'Aadhaar',  govIdNumber: '7890 1234 5678', planId: 'p3', planName: '6 Months',  status: 'active',        joinDate: d(-15),  expiryDate: d(165) },
    { id: 'm12', name: 'Kavitha Rao',     phone: '9876543221', email: 'kavitha@gmail.com', address: 'Yelahanka, Bangalore',      govIdType: 'Voter ID', govIdNumber: 'VTR234567',      planId: 'p1', planName: '1 Month',   status: 'expiring_soon', joinDate: d(-27),  expiryDate: d(3)   },
    { id: 'm13', name: 'Aditya Joshi',    phone: '9876543222', email: 'aditya@gmail.com',  address: 'Malleshwaram, Bangalore',   govIdType: 'Aadhaar',  govIdNumber: '8901 2345 6789', planId: 'p2', planName: '3 Months',  status: 'active',        joinDate: d(-20),  expiryDate: d(70)  },
    { id: 'm14', name: 'Pooja Desai',     phone: '9876543223', email: 'pooja@gmail.com',   address: 'Banashankari, Bangalore',   govIdType: 'PAN',      govIdNumber: 'RSTUV3456W',     planId: 'p4', planName: '12 Months', status: 'active',        joinDate: d(-5),   expiryDate: d(360) },
    { id: 'm15', name: 'Nikhil Bhat',     phone: '9876543224', email: 'nikhil@gmail.com',  address: 'Sadashivanagar, Bangalore', govIdType: 'Aadhaar',  govIdNumber: '9012 3456 7890', planId: 'p1', planName: '1 Month',   status: 'expired',       joinDate: d(-40),  expiryDate: d(-10) },
];

export const ATTENDANCE = [
    // Today — 5 checked in, 2 still present (no checkout)
    { id: 'a001', memberId: 'm1',  memberName: 'Arjun Sharma',   date: TODAY,  checkIn: '06:15', checkOut: '07:45' },
    { id: 'a002', memberId: 'm3',  memberName: 'Rahul Verma',    date: TODAY,  checkIn: '07:10', checkOut: null    },
    { id: 'a003', memberId: 'm7',  memberName: 'Vikram Patel',   date: TODAY,  checkIn: '07:30', checkOut: '09:00' },
    { id: 'a004', memberId: 'm4',  memberName: 'Sneha Kulkarni', date: TODAY,  checkIn: '08:00', checkOut: null    },
    { id: 'a005', memberId: 'm11', memberName: 'Rohit Agarwal',  date: TODAY,  checkIn: '09:15', checkOut: '10:30' },
    // Yesterday
    { id: 'a006', memberId: 'm1',  memberName: 'Arjun Sharma',   date: d(-1),  checkIn: '06:20', checkOut: '07:50' },
    { id: 'a007', memberId: 'm9',  memberName: 'Suresh Kumar',   date: d(-1),  checkIn: '07:00', checkOut: '08:30' },
    { id: 'a008', memberId: 'm13', memberName: 'Aditya Joshi',   date: d(-1),  checkIn: '08:30', checkOut: '10:00' },
    { id: 'a009', memberId: 'm3',  memberName: 'Rahul Verma',    date: d(-1),  checkIn: '07:15', checkOut: '08:45' },
    { id: 'a010', memberId: 'm14', memberName: 'Pooja Desai',    date: d(-1),  checkIn: '09:00', checkOut: '10:15' },
    { id: 'a011', memberId: 'm7',  memberName: 'Vikram Patel',   date: d(-1),  checkIn: '07:45', checkOut: '09:15' },
    // 2 days ago
    { id: 'a012', memberId: 'm4',  memberName: 'Sneha Kulkarni', date: d(-2),  checkIn: '06:30', checkOut: '08:00' },
    { id: 'a013', memberId: 'm11', memberName: 'Rohit Agarwal',  date: d(-2),  checkIn: '07:00', checkOut: '08:30' },
    { id: 'a014', memberId: 'm1',  memberName: 'Arjun Sharma',   date: d(-2),  checkIn: '06:10', checkOut: '07:40' },
    { id: 'a015', memberId: 'm9',  memberName: 'Suresh Kumar',   date: d(-2),  checkIn: '08:00', checkOut: '09:30' },
    { id: 'a016', memberId: 'm13', memberName: 'Aditya Joshi',   date: d(-2),  checkIn: '09:30', checkOut: '11:00' },
    { id: 'a017', memberId: 'm3',  memberName: 'Rahul Verma',    date: d(-2),  checkIn: '07:00', checkOut: '08:30' },
    { id: 'a018', memberId: 'm14', memberName: 'Pooja Desai',    date: d(-2),  checkIn: '10:00', checkOut: '11:30' },
    // 3 days ago
    { id: 'a019', memberId: 'm1',  memberName: 'Arjun Sharma',   date: d(-3),  checkIn: '06:00', checkOut: '07:30' },
    { id: 'a020', memberId: 'm7',  memberName: 'Vikram Patel',   date: d(-3),  checkIn: '07:30', checkOut: '09:00' },
    { id: 'a021', memberId: 'm4',  memberName: 'Sneha Kulkarni', date: d(-3),  checkIn: '08:15', checkOut: '09:45' },
    { id: 'a022', memberId: 'm9',  memberName: 'Suresh Kumar',   date: d(-3),  checkIn: '07:00', checkOut: '08:30' },
];

export const PAYMENTS = [
    { id: 'pay1',  memberId: 'm1',  memberName: 'Arjun Sharma',   planId: 'p3', planName: '6 Months',  amount: 4999, mode: 'offline', method: 'cash',   status: 'completed', date: d(-60),  invoiceId: 'INV-001' },
    { id: 'pay2',  memberId: 'm2',  memberName: 'Priya Nair',     planId: 'p1', planName: '1 Month',   amount: 999,  mode: 'online',  method: 'online',  status: 'completed', date: d(-25),  invoiceId: 'INV-002' },
    { id: 'pay3',  memberId: 'm3',  memberName: 'Rahul Verma',    planId: 'p2', planName: '3 Months',  amount: 2699, mode: 'offline', method: 'upi',    status: 'completed', date: d(-45),  invoiceId: 'INV-003' },
    { id: 'pay4',  memberId: 'm4',  memberName: 'Sneha Kulkarni', planId: 'p4', planName: '12 Months', amount: 8999, mode: 'online',  method: 'online',  status: 'completed', date: d(-90),  invoiceId: 'INV-004' },
    { id: 'pay5',  memberId: 'm5',  memberName: 'Kiran Reddy',    planId: 'p1', planName: '1 Month',   amount: 999,  mode: 'offline', method: 'cash',   status: 'completed', date: d(-45),  invoiceId: 'INV-005' },
    { id: 'pay6',  memberId: 'm6',  memberName: 'Ananya Singh',   planId: 'p2', planName: '3 Months',  amount: 2699, mode: 'online',  method: 'online',  status: 'completed', date: d(-84),  invoiceId: 'INV-006' },
    { id: 'pay7',  memberId: 'm7',  memberName: 'Vikram Patel',   planId: 'p3', planName: '6 Months',  amount: 4999, mode: 'offline', method: 'card',   status: 'completed', date: d(-30),  invoiceId: 'INV-007' },
    { id: 'pay8',  memberId: 'm8',  memberName: 'Deepa Menon',    planId: 'p1', planName: '1 Month',   amount: 999,  mode: 'online',  method: 'online',  status: 'refunded',  date: d(-60),  invoiceId: 'INV-008' },
    { id: 'pay9',  memberId: 'm9',  memberName: 'Suresh Kumar',   planId: 'p4', planName: '12 Months', amount: 8999, mode: 'offline', method: 'upi',    status: 'completed', date: d(-180), invoiceId: 'INV-009' },
    { id: 'pay10', memberId: 'm11', memberName: 'Rohit Agarwal',  planId: 'p3', planName: '6 Months',  amount: 4999, mode: 'online',  method: 'online',  status: 'completed', date: d(-15),  invoiceId: 'INV-010' },
    { id: 'pay11', memberId: 'm12', memberName: 'Kavitha Rao',    planId: 'p1', planName: '1 Month',   amount: 999,  mode: 'offline', method: 'cash',   status: 'completed', date: d(-27),  invoiceId: 'INV-011' },
    { id: 'pay12', memberId: 'm13', memberName: 'Aditya Joshi',   planId: 'p2', planName: '3 Months',  amount: 2699, mode: 'offline', method: 'upi',    status: 'completed', date: d(-20),  invoiceId: 'INV-012' },
    { id: 'pay13', memberId: 'm14', memberName: 'Pooja Desai',    planId: 'p4', planName: '12 Months', amount: 8999, mode: 'online',  method: 'online',  status: 'completed', date: d(-5),   invoiceId: 'INV-013' },
];

export const REFUNDS = [
    { id: 'ref1', memberId: 'm8',  memberName: 'Deepa Menon',  paymentId: 'pay8', amount: 999,  status: 'approved', reason: 'Medical emergency, unable to continue',          date: d(-50), resolvedDate: d(-48) },
    { id: 'ref2', memberId: 'm5',  memberName: 'Kiran Reddy',  paymentId: 'pay5', amount: 500,  status: 'pending',  reason: 'Partial refund requested due to relocation',      date: d(-10), resolvedDate: null   },
    { id: 'ref3', memberId: 'm3',  memberName: 'Rahul Verma',  paymentId: 'pay3', amount: 2699, status: 'rejected', reason: 'Plan already utilized for over 2 months',         date: d(-20), resolvedDate: d(-18) },
];

export const BROADCASTS = [
    { id: 'b1', title: 'Holiday Notice',   message: 'The gym will be closed on 15th August for Independence Day. Enjoy the holiday!', target: 'all',      sentAt: d(-5), sentBy: 'Admin' },
    { id: 'b2', title: 'Renewal Reminder', message: 'Your membership is expiring soon. Renew now to keep your fitness streak going!',  target: 'expiring', sentAt: d(-2), sentBy: 'Admin' },
    { id: 'b3', title: 'New Equipment',    message: 'We have added 4 new treadmills and a cable crossover machine. Come try them!',    target: 'active',   sentAt: d(-1), sentBy: 'Admin' },
];

export const SETTINGS = {
    gymName:              'Sweat Zone',
    gymAddress:           'MG Road, Bangalore',
    gymPhone:             '9876500000',
    expiryReminderDays:   7,
    smsReminders:         false,
    onlineRegistration:   true,
    refundsEnabled:       true,
    gracePeriodDays:      3,
};

// Chart data — last 6 months
export const MONTHLY_REVENUE = [
    { label: 'Oct', value: 38500 },
    { label: 'Nov', value: 42000 },
    { label: 'Dec', value: 35000 },
    { label: 'Jan', value: 48000 },
    { label: 'Feb', value: 41500 },
    { label: 'Mar', value: 45000 },
];

export const ATTENDANCE_TREND = [
    { label: 'Mon', value: 28 },
    { label: 'Tue', value: 35 },
    { label: 'Wed', value: 31 },
    { label: 'Thu', value: 38 },
    { label: 'Fri', value: 42 },
    { label: 'Sat', value: 55 },
    { label: 'Sun', value: 20 },
];

export const MEMBER_GROWTH = [
    { label: 'Oct', value: 52 },
    { label: 'Nov', value: 58 },
    { label: 'Dec', value: 61 },
    { label: 'Jan', value: 67 },
    { label: 'Feb', value: 71 },
    { label: 'Mar', value: 75 },
];
