// src/components/ThemeToggle.jsx

function ThemeToggle({ darkMode, onToggle }) {
  return (
    <div className="theme-toggle-wrapper">
      <input
        type="checkbox"
        id="themeToggle"
        className="theme-toggle-checkbox"
        checked={darkMode}
        onChange={onToggle}
      />
      <label htmlFor="themeToggle" className="theme-toggle-label">
        <ion-icon name="sunny-outline" className="sun-icon"></ion-icon>
        <ion-icon name="moon-outline" className="moon-icon"></ion-icon>
        <span className="toggle-slider"></span>
      </label>
    </div>
  )
}

export default ThemeToggle
