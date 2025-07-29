import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"

export const Appbar = ({ value }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const firstLetter = value ? value.charAt(0).toUpperCase() : "";

  return (
    <div className="shadow h-14 flex justify-between items-center px-4">
      <div className="font-extrabold text-blue-600 text-3xl">
       <Link to="/dashboard">Paytm</Link>
      </div>

      <div className="flex items-center gap-4">
        <div>Hello {value}</div>
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-400 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Sign Out
        </button>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center text-xl font-bold">
          <div className="flex flex-col justify-center h-full">
            {firstLetter}
          </div>
        </div>
      </div>
    </div>
  );
};