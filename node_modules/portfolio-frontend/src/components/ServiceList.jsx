// Placeholder stubs are removed. Icons load from public/assets/images/

const services = [
  {
    icon: "/assets/images/icon-design.svg",
    alt: "design icon",
    title: "Web Design",
    text: "The most modern and high-quality design made at a professional level.",
  },
  {
    icon: "/assets/images/icon-dev.svg",
    alt: "Web development icon",
    title: "Web Development",
    text: "High-quality development of sites at the professional level.",
  },
  {
    icon: "/assets/images/icon-app.svg",
    alt: "mobile app icon",
    title: "Mobile Apps",
    text: "Professional development of applications for iOS and Android.",
  },
  {
    icon: "/assets/images/icon-photo.svg",
    alt: "camera icon",
    title: "Photography",
    text: "I make high-quality photos of any category at a professional level.",
  },
];

function ServiceList() {
  return (
    <section className="service">
      <h3 className="h3 service-title">What I'm Doing</h3>
      <ul className="service-list">
        {services.map((svc) => (
          <li key={svc.title} className="service-item">
            <div className="service-icon-box">
              <img
                src={svc.icon}
                alt={svc.alt}
                width="40"
                height="40"
                loading="lazy"
              />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">{svc.title}</h4>
              <p className="service-item-text">{svc.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ServiceList;
