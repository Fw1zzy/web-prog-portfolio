
import ServiceList from "../components/ServiceList";
import TicTacToe from "../components/TicTacToe";


const resources = [
  {
    href: "https://developer.mozilla.org",
    label: "MDN Web Docs",
    desc: "Comprehensive documentation for web technologies including HTML, CSS, and JavaScript",
  },
  {
    href: "https://stackoverflow.com",
    label: "Stack Overflow",
    desc: "Q&A community for programmers with millions of coding solutions",
  },
  {
    href: "https://www.smashingmagazine.com",
    label: "Smashing Magazine",
    desc: "Professional resource for web designers and developers with articles and tutorials",
  },
  {
    href: "https://css-tricks.com",
    label: "CSS-Tricks",
    desc: "Daily articles about CSS, HTML, JavaScript, and web design techniques",
  },
  {
    href: "https://github.com",
    label: "GitHub",
    desc: "Platform for version control and collaboration for software development projects",
  },
];

const extLinks = [
  { href: "https://www.w3.org", label: "W3C - World Wide Web Consortium" },
  {
    href: "https://web.dev",
    label: "Web.dev by Google - Modern Web Development",
  },
  {
    href: "https://a11yproject.com",
    label: "The A11Y Project - Web Accessibility",
  },
];

const galleryItems = [
  { file: "avatar-2.png", caption: "Working on a project" },
  { file: "avatar-3.png", caption: "At a tech conference" },
  { file: "avatar-4.png", caption: "Team collaboration" },
];

function About() {
  return (
    <article className="about" data-page="about">
      <header>
        <h2 className="h2 article-title">About</h2>
      </header>

      {/* ── Bio ──────────────────────────────────────────────────────── */}
      <section className="about-text">
        <p>
          I'm a Web Developer from La Union, Philippines, working in web
          development and design. I enjoy turning complex problems into simple,
          beautiful and intuitive designs.
        </p>
        <p>
          My job is to build your website so that it is functional and
          user-friendly but at the same time attractive. Moreover, I add a
          personal touch to your product and make sure that it is eye-catching
          and easy to use. My aim is to bring across your message and identity
          in the most creative way.
        </p>
      </section>

      {/* ── Tic Tac Toe ──────────────────────────────────────────────── */}
      <TicTacToe />

      {/* ── Services ─────────────────────────────────────────────────── */}
      <ServiceList />

      {/* ── Resources Table ──────────────────────────────────────────── */}
      <section className="resources">
        <h3 className="h3 section-title">Useful Resources</h3>
        <table className="resources-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.href}>
                <td>
                  <a href={r.href} target="_blank" rel="noopener">
                    {r.label}
                  </a>
                </td>
                <td>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── External Links ───────────────────────────────────────────── */}
      <section className="external-links">
        <h3 className="h3 section-title">Recommended Reading</h3>
        <ul className="links-list">
          {extLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener">
                <ion-icon name="link-outline"></ion-icon>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

    </article>
  );
}

export default About;
