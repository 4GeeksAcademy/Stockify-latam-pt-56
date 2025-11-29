import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ScrollToTop = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
};

ScrollToTop.propTypes = {
    children: PropTypes.any
};

export default ScrollToTop;



// import { useEffect, useRef } from "react";
// import PropTypes from "prop-types";

// // This component allows the scroll to go to the beginning when changing the view,
// // otherwise it would remain in the position of the previous view. 
// // Investigate more about this React behavior :D 

// const ScrollToTop = ({ location, children }) => {
//     const prevLocation = useRef(location);

//     useEffect(() => {
//         if (location !== prevLocation.current) {
//             window.scrollTo(0, 0);
//         }
//         prevLocation.current = location;
//     }, [location]);

//     return children;
// };

// export default ScrollToTop;

// ScrollToTop.propTypes = {
//     location: PropTypes.object,
//     children: PropTypes.any
// };