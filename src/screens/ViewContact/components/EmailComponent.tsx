import React, { useState } from "react";
import RenderTabs from "../../../components/TabsComponent/RenderTabs";
import styles from "./email.module.scss";
import Search from "../../../assets/svg/Search.svg";
import Filter from "../../../assets/svg/Filter.svg";
import sortingArrows from "../../../assets/svg/Sort arrows.svg";
import ReceivedIcon from "../../../assets/Received.svg";
import SentIcon from "../../../assets/Sent.svg";
export default function EmailComponent() {
  const tabs = ["All", "Sent", "Incoming"];
  const [activeTab, setActiveTab] = useState("All");
  return (
    <div>
      <RenderTabs
        Tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "All" && <AllComponent />}
      {activeTab === "Sent" && <SentComponent />}
      {activeTab === "Incoming" && <IncomingComponent />}
    </div>
  );
}
const AllComponent = () => {
  const dummyData = [
    {
      id: 1,
      subject: "Project Gamma",
      message: "Sed do eiusmod tempor incididunt",
      date: "2024-04-30",
      userName: "Alice Johnson",
      status: "sent",
    },
    {
      id: 2,
      subject: "Project Gamma",
      message: "Sed do eiusmod tempor incididunt",
      date: "2024-04-30",
      userName: "Alice Johnson",
      status: "incoming",
    },
    {
      id: 3,
      subject: "Project Gamma",
      message: "Sed do eiusmod tempor incididunt",
      date: "2024-04-30",
      userName: "Alice Johnson",
      status: "sent",
    },
    // Add more objects as needed
  ];
  const data = dummyData;
  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className={styles.buttonsRow}>
        <div className={`"bg-white d-flex align-items-center"`}>
          <img className="btn" src={Search} alt="Search"></img>
          <img className="btn" src={Filter} alt="Filter"></img>
        </div>
      </div>
      <table className="table" style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            <th
              className={styles.headerText}
              scope="col"
              style={{ paddingLeft: "20px" }}
            >
              {"Subject"}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Message
            </th>

            <th className={styles.headerText} scope="col">
              Date
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Username
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any, index: number) => (
            <tr key={index}>
              <td
                className={styles.tableDataText}
                style={{ paddingLeft: "20px" }}
              >
                <img
                  src={item.status === "incoming" ? ReceivedIcon : SentIcon}
                  alt="incoming icon"
                  style={{ marginRight: "8px" }}
                />{" "}
                {item.subject}
              </td>
              <td className={styles.tableDataText}>
                <p>{item.message}</p>
              </td>
              <td className={styles.tableDataText}>{item.date}</td>
              <td className={styles.tableDataText}>{item.userName}</td>
              <td className={styles.customButtomRow}>
                <button className={`${styles.customButton} " mx-2 px-3 py-2"`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      marginRight: "5px",
                    }}
                  >
                    <path
                      d="M11.9998 4.7998L11.9998 19.1998M19.1998 11.9998L4.7998 11.9998"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                  {"New task"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SentComponent = () => {
  const dummyData = [
    {
      id: 1,
      subject: "Project Gamma",
      message: "Sed do eiusmod tempor incididunt",
      date: "2024-04-30",
      userName: "Alice Johnson",
      status: "sent",
    },
    {
      id: 3,
      subject: "Project Gamma",
      message: "Sed do eiusmod tempor incididunt",
      date: "2024-04-30",
      userName: "Alice Johnson",
      status: "sent",
    },
    // Add more objects as needed
  ];
  const data = dummyData;
  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className={styles.buttonsRow}>
        <div className={`"bg-white d-flex align-items-center"`}>
          <img className="btn" src={Search} alt="Search"></img>
          <img className="btn" src={Filter} alt="Filter"></img>
        </div>
      </div>
      <table className="table" style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            <th
              className={styles.headerText}
              scope="col"
              style={{ paddingLeft: "20px" }}
            >
              {"Subject"}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Message
            </th>

            <th className={styles.headerText} scope="col">
              Date
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Username
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any, index: number) => (
            <tr key={index}>
              <td
                className={styles.tableDataText}
                style={{ paddingLeft: "20px" }}
              >
                <img
                  src={item.status === "incoming" ? ReceivedIcon : SentIcon}
                  alt="incoming icon"
                  style={{ marginRight: "8px" }}
                />{" "}
                {item.subject}
              </td>
              <td className={styles.tableDataText}>{item.message}</td>
              <td className={styles.tableDataText}>{item.date}</td>
              <td className={styles.tableDataText}>{item.userName}</td>
              <td className={styles.customButtomRow}>
                <button className={`${styles.customButton} " mx-2 px-3 py-2"`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      marginRight: "5px",
                    }}
                  >
                    <path
                      d="M11.9998 4.7998L11.9998 19.1998M19.1998 11.9998L4.7998 11.9998"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                  {"New task"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const IncomingComponent = () => {
  const dummyData = [
    {
      id: 2,
      subject: "Project Gamma",
      message: "Sed do eiusmod tempor incididunt",
      date: "2024-04-30",
      userName: "Alice Johnson",
      status: "incoming",
    },

    // Add more objects as needed
  ];
  const data = dummyData;
  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className={styles.buttonsRow}>
        <div className={`"bg-white d-flex align-items-center"`}>
          <img className="btn" src={Search} alt="Search"></img>
          <img className="btn" src={Filter} alt="Filter"></img>
        </div>
      </div>
      <table className="table" style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            <th
              className={styles.headerText}
              scope="col"
              style={{ paddingLeft: "20px" }}
            >
              {"Subject"}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Message
            </th>

            <th className={styles.headerText} scope="col">
              Date
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Username
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any, index: number) => (
            <tr key={index}>
              <td
                className={styles.tableDataText}
                style={{ paddingLeft: "20px" }}
              >
                <img
                  src={item.status === "incoming" ? ReceivedIcon : SentIcon}
                  alt="incoming icon"
                  style={{ marginRight: "8px" }}
                />
                {item.subject}
              </td>
              <td className={styles.tableDataText}>{item.message}</td>
              <td className={styles.tableDataText}>{item.date}</td>
              <td className={styles.tableDataText}>{item.userName}</td>
              <td className={styles.customButtomRow}>
                <button className={`${styles.customButton} " mx-2 px-3 py-2"`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      marginRight: "5px",
                    }}
                  >
                    <path
                      d="M11.9998 4.7998L11.9998 19.1998M19.1998 11.9998L4.7998 11.9998"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                  {"New task"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};