import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../layout/Logout";
//import '../../Apper.css'

const Sidebar = () => {
  const { error, loading, user } = useSelector((state) => state.auth);

  return (
    <div className="sidebar-wrapper">
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <div className="navbar-brand">
              <img
                src="/images/logo2.png"
                alt="FlueretPH/TK"
                width="180px"
                height="50px"
              />
            </div>
          </li>
          <li>
            <Link to="/admin/dashboard">
              <i className="fa fa-tachometer"></i>Dashboard
            </Link>
          </li>

          <li>
            <a
              href="#productSubmenu"
              data-bs-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa-brands fa-product-hunt"></i>Product
            </a>
            <ul className="collapse list-unstyled" id="productSubmenu">
              <li>
                <Link to="/admin/products/all">
                  <i className="fa fa-clipboard"></i>All
                </Link>
              </li>

              <li>
                <Link to="/admin/new/product">
                  <i className="fa fa-plus"></i>Create
                </Link>
              </li>

              <li>
                <Link to="/admin/products/archived">
                  <i className="fa fa-book"></i>Archived
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="#stocksSubmenu"
              data-bs-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-list-alt"></i> Stocks
            </Link>
            <ul className="collapse list-unstyled" id="stocksSubmenu">
              <li>
                <Link to="/admin/new/stock">
                  <i className="fa fa-plus"></i>Create
                </Link>
              </li>

              <li>
                <Link to="/admin/stocks">
                  <i className="fa fa-clipboard"></i>All
                </Link>
              </li>

              <li>
                <Link to="/admin/stocks/archived">
                  <i className="fa fa-book"></i>Archived
                </Link>
              </li>

              <li>
                <Link to="/admin/stocks/sold">
                  <i className="fa fa-book"></i>Sold
                </Link>
              </li>

              <li>
                <Link to="/admin/stocks/expired">
                  <i className="fa fa-book"></i>Expired
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/admin/orders">
              <i className="fa fa-cart-shopping"></i>Orders
            </Link>
          </li>

          {user.role === "Admin" ? (
            <li>
              <Link
                to="#usersSubmenu"
                data-bs-toggle="collapse"
                aria-expanded="false"
                className="dropdown-toggle"
              >
                <i className="fa fa-users"></i>Users
              </Link>
              <ul className="collapse list-unstyled" id="usersSubmenu">
                <li>
                  <Link to="/admin/users">
                    <i className="fa fa-clipboard"></i>All
                  </Link>
                </li>
                <li>
                  <Link to="/admin/new/user">
                    <i className="fa-solid fa-user-plus"></i>Create
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users/archived">
                    <i className="fa fa-book"></i>Archived
                  </Link>
                </li>
              </ul>
            </li>
          ) : (
            ""
          )}

          <hr></hr>

          <li>
            <Logout />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
