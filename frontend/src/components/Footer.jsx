import "./Footer.css"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>About SportsHub</h4>
            <p>Your ultimate destination for live scores, blogs, and sports streaming.</p>
          </div>

          <div className="footer-section">
            <h4>Sports</h4>
            <ul>
              <li>
                <a href="#">Cricket</a>
              </li>
              <li>
                <a href="#">Football</a>
              </li>
              <li>
                <a href="#">Tennis</a>
              </li>
              <li>
                <a href="#">PUBG</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li>
                <a href="#">Blogs</a>
              </li>
              <li>
                <a href="#">Teams</a>
              </li>
              <li>
                <a href="#">Players</a>
              </li>
              <li>
                <a href="#">Forum</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} SportsHub. All rights reserved.</p>
          <div className="social-links">
            <a href="#">Twitter</a>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
