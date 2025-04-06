# Dynamic Portfolio Website

A modern, dynamic portfolio website built with React that supports multiple user profiles. This project allows developers to showcase their work, skills, and experience through a beautifully designed interface.

## 🌟 Features

- **Multi-Profile Support**: Easily manage multiple portfolio profiles through a single application
- **Dynamic Content**: All content is loaded from a centralized data.json file for easy updates
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean and professional design with smooth transitions
- **Profile Status**: Active/Inactive profile management with automatic redirection
- **Error Handling**: Comprehensive error handling with a custom 404 page
- **Easy Navigation**: Intuitive menu structure with organized content sections

### 📱 Pages
- **Home**: Landing page with profile introduction
- **About**: Detailed background information and personal story
- **Resume**: Professional experience, education, and skills
- **Projects**: Showcase of professional and personal projects
- **Contact**: Contact information and social media links

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/my-portfolio.git
cd my-portfolio
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## 📁 Project Structure

```
my-portfolio/
├── public/
├── src/
│   ├── assets/
│   │   └── images/        # Project and profile images
│   ├── components/
│   │   └── Layout/        # Layout components
│   ├── context/
│   │   └── ProfileContext.js  # Profile management
│   ├── data/
│   │   └── data.json      # Centralized data store
│   ├── pages/             # Page components
│   └── App.js            # Main application component
└── package.json
```

## 🔧 Configuration

### Profile Configuration
To add or modify profiles, edit the `src/data/data.json` file:

```json
{
  "profiles": {
    "username": {
      "status": "active",
      "personalInfo": {
        "fullName": "",
        "position": "",
        // ... other personal info
      },
      // ... other profile sections
    }
  }
}
```

## 🎨 Customization

### Styling
- Global styles are in `src/App.css`
- Component-specific styles are in their respective CSS files
- Bootstrap classes are available for quick styling

### Adding New Features
1. Create new components in the appropriate directory
2. Update the routing in `ProfileLayout.js`
3. Add corresponding data structure in `data.json`

## 📝 Development Notes

### Recent Updates
- Added multi-profile support
- Implemented dynamic data loading
- Added profile status management
- Created custom 404 page
- Improved error handling
- Enhanced responsive design

### Planned Features
- Dark/Light theme toggle
- Blog section
- Portfolio filters
- Animation enhancements
- SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Bootstrap team for the responsive design components
- All contributors who have helped shape this project

## 📞 Contact

For any questions or suggestions, please reach out through:
- GitHub Issues
- Email: [marotiuppe891@gmail.com](mailto:marotiuppe891@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/maroti-u-448324199](https://www.linkedin.com/in/maroti-u-448324199)

---
Built with ❤️ using React and Bootstrap
