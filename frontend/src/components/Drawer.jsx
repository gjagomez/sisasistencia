import { X } from 'lucide-react';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, title, children, footer, size = 'default', preventClose = false }) => {
  const handleOverlayClick = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'active' : ''} ${preventClose ? 'prevent-close' : ''}`}
        onClick={handleOverlayClick}
      ></div>

      {/* Drawer */}
      <div className={`drawer ${size === 'large' ? 'drawer-large' : ''} ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>{title}</h2>
          {!preventClose && (
            <button className="drawer-close" onClick={onClose}>
              <X size={24} />
            </button>
          )}
        </div>

        <div className="drawer-body">
          {children}
        </div>

        {footer && (
          <div className="drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default Drawer;
