// src/components/Sidebar.jsx
import { useState } from "react";

// 📁 IMAGE PLACEMENT INSTRUCTIONS:
// Place the following images in:  public/assets/images/
//   → my-avatar.png   (used as the sidebar avatar)

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={`sidebar${expanded ? " active" : ""}`} data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <img
            src="/assets/images/my-avatar.png"
            alt="Emmanuel Pascua"
            width="80"
            height="80"
          />
        </figure>

        <div className="info-content">
          <h1 className="name" title="Emmanuel Pascua">
            Emmanuel Pascua
          </h1>
          <p className="title">Web Developer</p>
        </div>

        <button
          className="info_more-btn"
          data-sidebar-btn
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span>Show Contacts</span>
          <ion-icon name="chevron-down"></ion-icon>
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a
                href="mailto:emmanuelrpascua@gmail.com"
                className="contact-link"
              >
                emmanuelpascua@gmail.com
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="phone-portrait-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+639951163875" className="contact-link">
                +63 995 116 3875
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="calendar-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthday</p>
              <time dateTime="2004-12-22">December 22, 2004</time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="location-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>Agoo, La Union</address>
            </div>
          </li>
        </ul>

        <div className="separator"></div>

        <ul className="social-list">
          <li className="social-item">
            <a href="#" className="social-link">
              <ion-icon name="logo-facebook"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link">
              <ion-icon name="logo-twitter"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link">
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
