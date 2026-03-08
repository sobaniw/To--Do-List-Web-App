
# 📝 To-Do List Web App

A beautiful, responsive, and feature-rich To-Do List web application with user authentication. Built with HTML, CSS, and JavaScript, with data persistence using Local Storage.

## 🎥 Project Demo

Watch the complete project demonstration:

[![To-Do List Web App Demo](https://img.youtube.com/vi/j8nWTwx-42A/maxresdefault.jpg)](https://youtu.be/j8nWTwx-42A)

**[Click here to watch the full video](https://youtu.be/j8nWTwx-42A)**

---

## ✨ Features

### 🔐 Authentication
- **User Registration (Sign Up)** - Create a new account with username, email, and password
- **User Login** - Authenticate with email and password
- **Secure Sign Out** - Safely logout from your account
- **Form Validation** - Email format validation, password confirmation, and minimum length requirements
- **User Feedback** - Clear error and success messages for all authentication actions

### ✅ To-Do List Management
- **Add Tasks** - Create new tasks with a simple input field
- **Mark as Completed** - Check off finished tasks
- **Delete Tasks** - Remove tasks from your list
- **Task Display** - Clean and organized task list view
- **Empty State** - User-friendly message when no tasks exist

### 💾 Data Persistence
- **Local Storage** - All tasks persist across page refreshes
- **Per-User Tasks** - Each user has their own personalized task list
- **Auto-Save** - Tasks are automatically saved whenever changes are made

### 🎨 User Interface
- **Modern Design** - Gradient background with card-based layout
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Transitions and fade effects for better UX
- **Accessible** - Clean and intuitive interface for all users
- **Hover Effects** - Interactive feedback on buttons and task items

## 📁 File Structure

```
To--Do-List-Web-App/
├── index.html          # HTML structure
├── style.css           # CSS styling and responsive design
├── script.js           # JavaScript functionality and logic
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required - runs completely in the browser

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sobaniw/To--Do-List-Web-App.git
   cd To--Do-List-Web-App
   ```

2. **Open in browser:**
   - Double-click `index.html` file, or
   - Right-click `index.html` → Open with → Your preferred browser, or
   - Use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **That's it!** No installation needed. The app is ready to use.

## 📖 How to Use

### First Time Users

1. **Sign Up:**
   - Click on the Sign Up form
   - Enter a username, email, and password
   - Confirm your password
   - Click "Sign Up"
   - You'll see a success message, then can login

2. **Login:**
   - Enter your registered email
   - Enter your password
   - Click "Login"
   - You'll be taken to your To-Do List dashboard

### Using the To-Do List

1. **Add a Task:**
   - Type your task in the input field
   - Click "Add" button or press Enter
   - Your task will appear in the list

2. **Complete a Task:**
   - Check the checkbox next to a task
   - The task will appear struck-through and faded
   - Uncheck to mark as incomplete

3. **Delete a Task:**
   - Click the "Delete" button on any task
   - The task will be removed from your list

4. **Sign Out:**
   - Click "Sign Out" button in the top right
   - You'll be logged out and returned to the login page

## 🎯 Key Features Explained

### Authentication System
- User credentials are stored in browser's Local Storage
- Each user's tasks are stored separately using a unique user ID
- Passwords are basic hashed (not cryptographically secure - use a backend for production)

### Task Management
- Tasks have unique IDs based on timestamp
- Each task tracks completion status
- Tasks are displayed in the order they were created
- All changes are instantly saved to Local Storage

### Responsive Design
- Mobile-first approach
- Flexbox layout for flexibility
- Media queries for different screen sizes
- Touch-friendly buttons and inputs

## 💻 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, gradients, animations, media queries
- **JavaScript (Vanilla)** - No dependencies, pure JavaScript
- **Local Storage API** - Client-side data persistence

## 🔒 Data Storage

All data is stored locally in your browser:

- **User Accounts:** Stored in `localStorage['users']`
- **Current User:** Stored in `localStorage['currentUser']`
- **User Tasks:** Stored in `localStorage['tasks_{userId}']`

⚠️ **Note:** Data is stored only in your browser. Clearing browser data will delete all stored information.

## 🎨 Customization

### Change Color Scheme
Edit the gradient colors in `style.css`:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Change Primary Color
Find and replace color codes in `style.css`:
- `#667eea` - Primary color
- `#764ba2` - Secondary color
- `#ff6b6b` - Delete button color

### Modify Layout
- Change `max-width` in `.container` class
- Adjust padding and margins
- Modify font sizes in media queries

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## ⚙️ Installation Methods

### Method 1: Direct Download
1. Download the ZIP file from GitHub
2. Extract the files
3. Open `index.html` in your browser

### Method 2: Git Clone
```bash
git clone https://github.com/sobaniw/To--Do-List-Web-App.git
cd To--Do-List-Web-App
```

### Method 3: GitHub Pages (Optional)
1. Go to repository settings
2. Enable GitHub Pages
3. Select main branch as source
4. Access via `https://sobaniw.github.io/To--Do-List-Web-App/`

## 📝 Sample Credentials (After Creating Account)

Once you create your account, you can use:
- **Email:** your-email@example.com
- **Password:** your-secure-password

## 🐛 Known Limitations

- Local Storage has a 5-10MB limit per domain
- Data is not synced across different browsers or devices
- Password hashing is basic (not secure for production)
- No backend verification or database

## 🚀 Future Enhancements

Potential improvements for future versions:
- [ ] Backend API integration
- [ ] Secure password hashing (bcrypt)
- [ ] User profile management
- [ ] Task categories/tags
- [ ] Task due dates and reminders
- [ ] Dark mode toggle
- [ ] Export tasks as PDF
- [ ] Collaborative task sharing
- [ ] Cloud synchronization
- [ ] Progressive Web App (PWA) support

## 📋 Project Requirements Met

✅ User Registration (Sign Up)  
✅ User Login  
✅ User Sign Out  
✅ Add new tasks  
✅ Mark tasks as completed  
✅ Delete tasks  
✅ Display task list  
✅ Clean and simple UI design  
✅ CSS styling  
✅ JavaScript DOM manipulation  
✅ Local Storage persistence  

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Sobaniw**
- GitHub: [@sobaniw](https://github.com/sobaniw)
- YouTube: [Project Demo](https://youtu.be/j8nWTwx-42A)

## 🙏 Acknowledgments

- Inspired by classic to-do list applications
- Built with vanilla JavaScript (no frameworks or dependencies)
- UI/UX design principles from modern web standards

## 📞 Support

If you have any questions or issues:
1. Check the [FAQ](#faq) section
2. Open an issue on GitHub
3. Contact via GitHub profile

## 🔧 Troubleshooting

### Tasks not saving?
- Check if Local Storage is enabled in your browser
- Try clearing browser cache and reload

### Can't login after signing up?
- Verify you entered the correct email and password
- Check that passwords match exactly (case-sensitive)

### Forgot your password?
- Currently, there's no recovery option
- Clear Local Storage and create a new account

---

Made with ❤️ by [Sobaniw](https://github.com/sobaniw)

**Happy Task Managing! 🎉**
