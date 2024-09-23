// components/SideMenu.js
import Image from 'next/image';
import Link from 'next/link';

const SideMenu = () => {
  return (
    <section className="side-menu">
      {/* User Profile */}
      <div className="side-menu__user-profile">
        <Link href="https://github.com/leocosta1" target="_blank" className="side-menu__user-avatar">
          <Image src="/assets/default-user.png" alt="User Picture" width={24} height={24} />
        </Link>
        <div className="side-menu__user-info">
          <Link href="https://github.com/leocosta1" target="_blank">leocosta1</Link>
          <span>Leonardo Costa</span>
        </div>
        <button className="side-menu__user-button">Switch</button>
      </div>
      {/* Suggestions Section */}
      <div className="side-menu__suggestions-section">
        <div className="side-menu__suggestions-header">
          <h2>Suggestions for You</h2>
          <button>See All</button>
        </div>
        <div className="side-menu__suggestions-content">
          {/* Repeat for each suggestion */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="side-menu__suggestion">
              <Link href="#" className="side-menu__suggestion-avatar">
                <Image src="/assets/default-user.png" alt="User Picture" width={24} height={24} />
              </Link>
              <div className="side-menu__suggestion-info">
                <Link href="#">usernick{16 + index}</Link>
                <span>Followed by user1 and {index === 0 ? "9 others" : `${index + 1} others`}</span>
              </div>
              <button className="side-menu__suggestion-button">Follow</button>
            </div>
          ))}
        </div>
      </div>
      {/* Footer Links */}
      <div className="side-menu__footer">
        <div className="side-menu__footer-links">
          <ul className="side-menu__footer-list">
            {/* Add footer links */}
            {["About", "Help", "Press", "API", "Jobs", "Privacy", "Terms", "Locations", "Top Accounts", "Hashtag", "Language"].map(link => (
              <li key={link} className="side-menu__footer-item">
                <Link className="side-menu__footer-link" href="#">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
        <span className="side-menu__footer-copyright">&copy; 2021 Instagram from Facebook</span>
      </div>
    </section>
  );
};

export default SideMenu;
