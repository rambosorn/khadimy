import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="section container" style={{ textAlign: 'center' }}>
            <h1 className="section-title">404 - Page Not Found</h1>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );
};
export default NotFound;
