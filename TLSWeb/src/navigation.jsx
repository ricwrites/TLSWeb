import { useNavigate } from "react-router-dom";

export const NavButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="NavButs">
      <button onClick={() => navigate("/")}>About Us</button>
      <button onClick={() => navigate("/calendar")}>School Calendar</button>
      <button onClick={() => navigate("/events")}>Events</button>
      <button onClick={() => navigate("/newsletter")}>Newsletter</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};
