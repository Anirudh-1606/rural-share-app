# 🔧 Network Troubleshooting Guide

## 🚨 **Problem:** Sign Up/Sign In Failing with Network Errors

### 📋 **Quick Fix Checklist:**

1. **✅ Is your backend server running?**
   ```bash
   # Make sure this is running in another terminal
   npm run start:dev
   # or
   node server.js
   ```

2. **✅ Are you using the correct IP address?**
   - **Android Emulator:** Use `http://10.0.2.2:3000` (already configured)
   - **iOS Simulator:** Use your computer's IP (e.g., `http://192.168.1.100:3000`)
   - **Physical Device:** Use your computer's IP

3. **✅ Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

4. **✅ Update configuration if needed:**
   - Edit `app/config/api.ts`
   - Change the IP addresses to match your network

---

## 🔍 **Step-by-Step Debugging:**

### **Step 1: Check Backend Server**
```bash
# In your backend project directory
npm run start:dev
```
You should see:
```
Server running on http://localhost:3000
```

### **Step 2: Test API Manually**
```bash
# Test if your backend is accessible
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","role":"individual"}'
```

### **Step 3: Check Network Configuration**
Open `app/config/api.ts` and verify:
- Android emulator: `http://10.0.2.2:3000`
- iOS simulator: `http://YOUR_IP:3000`
- Physical device: `http://YOUR_IP:3000`

### **Step 4: Check Firewall**
- **Windows:** Allow Node.js through Windows Firewall
- **Mac:** System Preferences > Security & Privacy > Firewall
- **Linux:** Check iptables rules

---

## 🎯 **Platform-Specific Solutions:**

### **🤖 Android Emulator (Default)**
```javascript
// In app/config/api.ts
android: 'http://10.0.2.2:3000',
```

### **📱 iOS Simulator**
```javascript
// In app/config/api.ts
ios: 'http://192.168.1.100:3000', // Replace with your actual IP
```

### **📱 Physical Device**
```javascript
// In app/config/api.ts
device: 'http://192.168.1.100:3000', // Replace with your actual IP
```

---

## 🔍 **How to Find Your IP Address:**

### **Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

### **Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address under your active network interface.

### **Alternative (All platforms):**
```bash
# Node.js way
node -e "console.log(require('os').networkInterfaces())"
```

---

## 📊 **Common Error Messages:**

### **"Network request failed"**
- Backend server not running
- Wrong IP address
- Firewall blocking connection

### **"Connection refused"**
- Backend server not running on port 3000
- Firewall blocking port 3000

### **"Timeout"**
- Network connectivity issue
- Wrong IP address
- Firewall blocking

---

## 🚀 **Quick Test:**

1. **Start backend server:**
   ```bash
   npm run start:dev
   ```

2. **Test from computer:**
   ```bash
   curl http://localhost:3000/api/auth/register
   ```

3. **Test from emulator (if using 10.0.2.2):**
   ```bash
   curl http://10.0.2.2:3000/api/auth/register
   ```

4. **Check app logs:**
   - Look for console messages starting with 📡, ✅, or ❌

---

## 🎯 **Final Steps:**

1. **Restart Metro bundler:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Rebuild app:**
   ```bash
   npx react-native run-android
   ```

3. **Check console logs** for detailed error messages

---

## 🆘 **Still Having Issues?**

If you're still having problems:

1. **Check the console logs** in your React Native debugger
2. **Verify your backend API** is working with curl/Postman
3. **Try a different IP configuration** in `app/config/api.ts`
4. **Check if your antivirus/firewall** is blocking the connection

---

**Remember:** The most common issue is using `localhost` instead of the correct IP address for mobile development! 🎯 