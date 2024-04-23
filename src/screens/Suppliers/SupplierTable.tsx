import Search from "../../assets/svg/Search.svg";
import Filter from "../../assets/svg/Filter.svg";
import ManageColumns from "../../assets/svg/Managecolumns.svg";
import useMobile from "../../bootstrap-ui-kit/hooks/useMobile";
import sortingArrows from "../../assets/svg/Sort arrows.svg";
import "./service-table.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserState } from "../../redux/userSlice";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useCrmContext } from "../../context/CRMcontext";
import axios from "axios";

const Table = () => {
  const userState = useUserState();
  const [data, setdata] = useState<any>();
  const { setContactType, setContactId, setMainContactType } = useCrmContext();
  const navigate = useNavigate();
  const isMobile = useMobile();
  useEffect(() => {
    axios
      .get("https://backend-d.cinqd.com/customer/get-supplier-data", {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => {
        setdata(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className="bg-white d-flex align-items-center buttonsRow">
        <input
          className="form-check-input mt-0"
          type="checkbox"
          value=""
          aria-label="Checkbox for following text input"
          style={{
            cursor: "pointer",
            boxShadow: "none",
            outline: "none",
            width: "20px",
            height: "20px",
          }}
        />
        <div className=" d-flex gap-1 ">
          <div>
            <img className="btn" src={Search} alt="Search"></img>
            <img className="btn" src={Filter} alt="Filter"></img>
            {!isMobile && (
              <img className="btn" src={ManageColumns} alt="Manage"></img>
            )}
          </div>
          {isMobile ? (
            <button
              className="btn"
              onClick={() => {}}
              style={{
                color: "#228dff",
                fontSize: 35,
                fontWeight: "50",
                cursor: "pointer",
                boxShadow: "none",
                outline: "none",
              }}
            >
              <span className="me-1">+</span>
            </button>
          ) : (
            <div className="CreateButtonsRow">
              <button
                className="btn btn-outline-primary mx-2 px-3 py-2 customButton"
                onClick={() => {
                  navigate("/CRM/import-contacts");
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 15.2044L4 18.8925C4 19.4514 4.21071 19.9875 4.58579 20.3827C4.96086 20.778 5.46957 21 6 21H18C18.5304 21 19.0391 20.778 19.4142 20.3827C19.7893 19.9875 20 19.4514 20 18.8925V15.2044M12.0011 3V14.9425M12.0011 14.9425L16.5725 10.3793M12.0011 14.9425L7.42969 10.3793"
                    stroke="#228DFF"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {"Import"}
              </button>
              <DropdownButton className="customButton" title={"Add Contact"}>
                <Dropdown.Item
                  onClick={() => {
                    setContactType("Individual");
                    setMainContactType("Supplier");
                    navigate("/CRM/create-contact");
                  }}
                  eventKey="1"
                >
                  Indvidual Contact
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setContactType("Business");
                    setMainContactType("Supplier");
                    navigate("/CRM/create-contact");
                  }}
                  eventKey="2"
                >
                  Business Contact
                </Dropdown.Item>
              </DropdownButton>
            </div>
          )}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th className="headerText"></th>
            <th className="headerText" scope="col">
              Customer <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className="headerText" scope="col">
              Contact Name
            </th>
            <th className="headerText" scope="col">
              Contact Status
            </th>
            <th className="headerText" scope="col">
              Contact Type <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className="headerText" scope="col">
              Location <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className="headerText" scope="col">
              Email
            </th>
            <th className="headerText" scope="col">
              Phone Number
            </th>
            <th className="headerText" scope="col">
              Contact Owner <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((item: any, index: number) => (
            <tr key={index}>
              <td style={{ paddingLeft: "20px" }}>
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  value=""
                  aria-label="Checkbox for following text input"
                  style={{
                    cursor: "pointer",
                    boxShadow: "none",
                    outline: "none",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </td>
              <td
                className="tableDataText"
                onClick={() => {
                  setContactId(item[0].contactId);
                  navigate("/CRM/view-contact");
                }}
              >
                {
                  item.find((value: any) => value.fieldName === "Company Name")
                    ?.value
                }
              </td>
              <td className="tableDataText">
                {
                  item.find((value: any) => value.fieldName === "First Name")
                    ?.value
                }{" "}
                {
                  item.find((value: any) => value.fieldName === "Last Name")
                    ?.value
                }
              </td>
              <td className="tableDataText">
                {
                  item.find(
                    (value: any) => value.fieldName === "Contact Status"
                  )?.value
                }
              </td>
              <td className="tableDataText">
                {
                  item.find((value: any) => value.fieldName === "Contact Type")
                    ?.value
                }
              </td>
              <td className="tableDataText">
                {
                  item.find((value: any) => value.fieldName === "Location")
                    ?.value
                }
              </td>
              <td className="tableDataText">
                {item.find((value: any) => value.fieldName === "email")?.value}
              </td>
              <td className="tableDataText">
                {
                  item.find((value: any) => value.fieldName === "Phone number")
                    ?.value
                }
              </td>
              <td className="tableDataText">
                {
                  item.find((value: any) => value.fieldName === "Contact owner")
                    ?.value
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;