import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand">FlyNow</span>
          <span className="footer-copyright">
            © 2024 FlyNow. Premium Discovery. All rights reserved.
          </span>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Partner with Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
