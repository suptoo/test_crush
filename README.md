# BACB-Compliant Fieldwork Tracking System

## 🎯 Overview
# 🎯 BACB Fieldwork Hours Tracker

A comprehensive cloud-based web application for tracking and managing BACB (Behavior Analyst Certification Board) supervised fieldwork hours with authentication and month-by-month tracking. This system is specifically designed for behavior analysts pursuing BCBA certification.

## 📊 Features

### 1. **BACB-Compliant Tracking**
- **Unrestricted Hours**: Direct client interaction and behavior-analytic activities
- **Restricted Hours**: Indirect activities (max 40% of unrestricted, cap at 800 hours)
- **Supervision Hours**: Required supervision meetings (minimum 5% of total hours)
- Automatic validation of BACB requirements
- Monthly maximum tracking (130 hours/month)

### 2. **Interactive Dashboard** (`index.html`)
- Real-time visualization of hours across multiple chart types:
  - 📈 Line Chart - Time series tracking
  - 📊 Stacked Bar Chart - Daily hours by category
  - 🥧 Pie Chart - Hour distribution
  - 🍩 Doughnut Chart - Category breakdown
  - 🎯 Radar Chart - Category comparison
  - 📉 Area Chart - Cumulative hours
  - 🗺️ Heatmap - Activity visualization
  - 📆 Calendar View - Monthly overview
  - 📋 Detailed Data Table

### 3. **Automated Form Generation** (`compliance.html`)
- **Monthly Verification Forms**: Pre-filled forms ready for supervisor signatures
- **Final Experience Verification**: Cumulative summary for BACB submission
- Professional formatting matching BACB standards
- Print-ready with proper page breaks
- Export to PDF capability

### 4. **Multi-Supervisor Support**
- Track hours with multiple supervisors
- Different settings and supervision types
- Comprehensive activity descriptions

### 5. **Secure Data Management**
- Export data as JSON for backup
- Import previously logged hours
- Bulk entry capability
- Delete/edit individual entries

### 6. **Progress Tracking & Alerts**
- Real-time compliance checking
- Visual progress bars showing completion percentage
- Color-coded requirement cards:
  - 🟢 Green = Requirement met
  - 🟡 Yellow = Warning/approaching limit
  - 🔴 Red = Requirement not met or exceeded
- Supervision percentage monitoring
- Monthly maximum tracking

### 7. **Audit-Ready Records**
- Complete, organized logs of all activities
- Time stamps and detailed descriptions
- Supervisor verification sections
- BACB-compliant formatting
- Export options for record-keeping

## � Quick Start (Setup Instructions)

### Step 1: Set Up Supabase Database

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/pydjyurvukyhfyojrhpu

2. **Create Database Schema**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Open the file `supabase_schema.sql` in this project
   - Copy the entire content and paste it into the SQL Editor
   - Click "Run" to execute the query
   - Wait for confirmation message

3. **Verify Table Creation**
   - Click "Table Editor" in the left sidebar
   - You should see a table named `fieldwork_hours`
   - Click on it to verify columns: date, unrestricted, restricted, supervision, etc.

### Step 2: Enable Email Authentication

1. **Configure Auth Settings**
   - In Supabase Dashboard, click "Authentication" → "Settings"
   - Under "Email Auth", ensure it's enabled
   - Configure email templates if desired (optional)

2. **Set Site URL (for production)**
   - Still in Auth Settings
   - Set "Site URL" to your deployed URL (e.g., Netlify or Vercel URL)
   - For local testing, leave as `http://localhost:3000`

### Step 3: Run the Application Locally

1. **Open the project folder**
   ```powershell
   cd C:\Users\Hp\new_site
   ```

2. **Start a local server** (choose one method):
   
   **Option A: Using Python**
   ```powershell
   python -m http.server 8000
   ```
   Then open: http://localhost:8000/login.html
   
   **Option B: Using Node.js (if you have it)**
   ```powershell
   npx http-server -p 8000
   ```
   Then open: http://localhost:8000/login.html
   
   **Option C: Using VS Code Live Server Extension**
   - Right-click `login.html` → "Open with Live Server"

3. **Create Your Account**
   - You'll see the login page
   - Click "Sign Up" tab
   - Enter your details:
     - Full Name
     - Email
     - Password (minimum 6 characters)
   - Click "Sign Up"
   - You'll be automatically logged in and redirected to the dashboard

### Step 4: Start Using the App

1. **View Your Dashboard**
   - You'll see the main dashboard with October 2025 selected by default
   - Statistics cards show: Total Hours, Unrestricted, Restricted, Supervision
   - Interactive chart shows daily breakdown
   - Calendar view shows all days of the month

2. **Add Your First Entry**
   - Click the "➕ Add New Entry" button
   - Fill in the form:
     - Date: Select the day you worked
     - Time: e.g., "9:00 AM - 5:00 PM"
     - Unrestricted Hours: e.g., 5
     - Restricted Hours: e.g., 2
     - Supervision Hours: e.g., 1
     - Descriptions: Add details about activities
   - Click "Save Entry"
   - Your entry will appear immediately in the chart and calendar

3. **Navigate Between Months**
   - Use the dropdown menu to select different months (2024-2026)
   - Or use "◀ Previous" and "Next ▶" buttons
   - Data is saved per user per month

4. **View Day Details**
   - Click any day in the calendar with data (green/yellow/blue boxes)
   - Or click any bar in the chart
   - A modal will show complete breakdown with descriptions

5. **Track BACB Compliance**
   - The dashboard automatically calculates supervision percentage
   - Must be ≥ 5% to meet BACB requirements (shown in green)
   - Red warning appears if below 5%
   - Maximum 130 hours per month allowed by BACB

6. **Access Compliance Reports** (Coming Soon)
   - Click "Compliance Reports" button
   - Generate monthly verification forms
   - Print-ready BACB compliant documentation

##  Files Overview

### Core Application Files
- **`login.html`** - Authentication page with sign up and login forms ⭐ START HERE
- **`dashboard.html`** - Main cloud-connected dashboard (replaces old index.html)
- **`dashboard.js`** - Core application logic with Supabase integration
- **`styles.css`** - Complete styling with dark theme, animations, and responsive design

### Database & Setup
- **`supabase_schema.sql`** - Database schema to run in Supabase SQL Editor
- **`README.md`** - This file with setup instructions

### Legacy Files (for reference)
- `index.html` - Old local-only dashboard (replaced by dashboard.html)
- `app.js` - Old hardcoded data logic (replaced by dashboard.js)
- `compliance.html` - BACB forms generator (will be integrated soon)
- `extracted_output.json` - Sample October 2024 data from Word doc
- `extract_doc.py` - Python script to extract data from Word documents

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Charts**: Chart.js 4.4.0 (Interactive bar charts)
- **Hosting**: Local or deploy to Netlify/Vercel
- **Data Extraction**: Python with python-docx library

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Each user can only see their own data
- **Secure Authentication**: Supabase handles password hashing and sessions
- **HIPAA Consideration**: Do NOT enter client names or PHI in descriptions
- **Data Ownership**: Your data is stored in your Supabase project
- **Backup Recommended**: Export data regularly for safety

## 📊 BACB Requirements Reference

### Supervised Fieldwork Requirements:
- ✅ **Total Hours**: 2000 hours required
- ✅ **Supervision**: Minimum 5% of total hours
- ✅ **Duration**: Must span 12-24 months minimum
- ✅ **Monthly Maximum**: 130 hours per month maximum
- ✅ **Restricted Hours**: Maximum 40% of unrestricted hours
- ✅ **Documentation**: Monthly verification forms required

### Categories Explained:
1. **Unrestricted Hours**: Direct client contact activities
   - Assessment
   - Behavior intervention implementation
   - Direct observation and data collection
   - Parent/caregiver training

2. **Restricted Hours**: Indirect activities (max 40% of unrestricted)
   - Program development
   - Data analysis
   - Research
   - Report writing

3. **Supervision Hours**: Supervised activities
   - Case reviews
   - Skill development
   - Performance feedback
   - Professional development

## 🚨 Troubleshooting

### "Data not loading" or "Showing 0 hours"
1. Check browser console for errors (F12)
2. Verify you completed Step 1 (Supabase schema setup)
3. Make sure you're logged in
4. Try refreshing the page
5. Check that Supabase project is active

### "Authentication error"
1. Check Supabase email auth is enabled
2. Verify email/password requirements
3. Check browser console for specific error
4. Try signing out and back in

### "Can't add entries"
1. Make sure you ran the SQL schema (Step 1)
2. Check that RLS policies are enabled
3. Verify you're logged in with correct user
4. Check browser console for errors

### "Month selector not working"
1. Make sure you selected a month from the dropdown
2. Try using Previous/Next buttons instead
3. Refresh the page and try again

## 🎯 Future Enhancements

- [ ] Edit/Delete existing entries
- [ ] Generate BACB compliance reports as PDF
- [ ] Data visualization with more chart types
- [ ] Export to CSV/Excel
- [ ] Mobile app version
- [ ] Email reminders for monthly tracking
- [ ] Multi-supervisor support
- [ ] Dark/Light theme toggle
- [ ] Data backup to Google Drive

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review the Supabase dashboard for database errors
3. Check browser console (F12) for JavaScript errors
4. Verify all setup steps were completed

## 📄 License

This project is for personal use in BACB fieldwork tracking. Ensure compliance with your supervisor's requirements and BACB guidelines.

---

**🎉 You're all set! Start tracking your fieldwork hours and stay BACB compliant!**
1. Open `index.html` in your web browser
2. Your October 2024 hours are already loaded!
3. Explore different visualizations
4. Filter by date range or time period

### Generate BACB Forms:
1. Click "📋 BACB Forms & Compliance" button
2. View your compliance status
3. Print or download monthly verification forms
4. Review cumulative progress toward 2000 hours

### Add New Entries:
1. Use the "Add New Fieldwork Entry" form at the bottom
2. Enter date, time range, and hours by category
3. Add detailed descriptions of activities
4. Click "Add Entry"

### Export Your Data:
1. Click "💾 Export Data" to download JSON backup
2. Keep regular backups for safety
3. Import data anytime with "📤 Upload Data"

## 📊 Your October 2024 Summary

**From your Word document:**
- **Total Days**: 23 working days
- **Total Hours**: 90.0 hours
- **Unrestricted**: 60.0 hours
- **Restricted**: 20.0 hours  
- **Supervision**: 10.0 hours
- **Supervision %**: 11.1% ✓ (Exceeds 5% requirement)
- **Activities**: School-based ABA services including behavior planning, data collection, student support, and supervision sessions

## 📋 BACB Requirements Checklist

- ✅ **Total Hours**: 2000 hours required (90/2000 = 4.5% complete)
- ✅ **Supervision**: Minimum 5% (Currently 11.1% ✓)
- ✅ **Duration**: 12-24 months minimum (Started Oct 2024)
- ✅ **Monthly Max**: 130 hours/month (October: 90 hours ✓)
- ✅ **Restricted Hours**: Max 40% of unrestricted (Currently 33.3% ✓)
- ⏳ **Time Remaining**: ~21 months at current pace

## 🎨 Features Breakdown

### Dashboard Statistics Cards:
1. **Total Hours**: Running total with supervision percentage
2. **Unrestricted Hours**: Direct client contact hours
3. **Restricted Hours**: Indirect activity hours
4. **Supervision Hours**: Supervised contact hours

### Control Panel:
- Date range picker for filtering
- Daily/Weekly/Monthly aggregation
- Chart type selector
- Real-time refresh
- Data import/export

### Data Table Features:
- Color-coded hour categories
- Time stamps for each entry
- Detailed activity descriptions
- Search functionality
- Individual entry deletion

## 🔮 Future Enhancements (Phase 2)

### Planned Features:
1. **Supabase Integration**: Cloud-based data storage and sync
2. **Multi-User Support**: Separate accounts for multiple supervisees
3. **Supervisor Dashboard**: Allow supervisors to review and approve hours
4. **Mobile App**: iOS/Android apps for on-the-go logging
5. **Email Notifications**: Reminders for supervision meetings
6. **Automated Alerts**: Warnings when approaching limits
7. **Video Tutorials**: Built-in help and FAQ system
8. **Chat Support**: Real-time assistance
9. **Custom Reports**: Generate specialized reports
10. **Goal Setting**: Set and track monthly hour goals

### Database Schema (Supabase):
```sql
-- Users table
users (
  id, email, name, role, supervisor_id
)

-- Hours entries table
fieldwork_hours (
  id, user_id, date, unrestricted, restricted, 
  supervision, descriptions, supervisor_verified, timestamps
)

-- Supervisors table
supervisors (
  id, name, bacb_cert_number, settings
)

-- Verification forms table
verification_forms (
  id, user_id, month, year, supervisor_signature, 
  submission_date
)
```

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charting**: Chart.js 4.4.0
- **Data Visualization**: D3.js v7
- **Date Picker**: Flatpickr
- **Data Format**: JSON
- **Python**: docx library for Word document extraction

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- 📱 Mobile browsers supported

## 💾 Data Backup

**Important**: Regularly backup your data!
1. Click "💾 Export Data" weekly
2. Save JSON file to cloud storage (Google Drive, Dropbox, etc.)
3. Keep multiple backup copies
4. Export before making bulk changes

## 📞 Support

For questions about:
- **BACB Requirements**: Visit [bacb.com](https://www.bacb.com)
- **Technical Issues**: Check browser console for errors
- **Feature Requests**: Document in issues log

## 🎓 BACB Resources

- [BACB Official Website](https://www.bacb.com)
- [Experience Standards](https://www.bacb.com/experience-standards/)
- [Supervision Requirements](https://www.bacb.com/supervision/)
- [BACB Forms](https://www.bacb.com/forms/)

## 📄 License

This project is designed for personal use in BACB fieldwork tracking.

---

**Last Updated**: November 7, 2025  
**Version**: 1.0.0  
**Data Source**: October_Hours_Final_90 (1).docx

## 🎉 Your Journey

You're on your way to BCBA certification! With 90 hours completed in October 2024, you have:
- ✅ Established a strong supervision percentage (11.1%)
- ✅ Stayed well under monthly maximum
- ✅ Balanced unrestricted and restricted activities
- 🎯 ~1,910 hours remaining
- 🎯 At current pace: ~21 months to completion

**Keep up the great work!** 🚀
