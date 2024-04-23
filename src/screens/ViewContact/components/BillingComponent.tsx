import React, { useState } from "react";
import RenderTabs from "../../../components/TabsComponent/RenderTabs";
import styles from "./biling.module.scss";
import Search from "../../../assets/svg/Search.svg";
import Filter from "../../../assets/svg/Filter.svg";
import sortingArrows from "../../../assets/svg/Sort arrows.svg";
import { Modal } from "react-bootstrap";
import CloseIcon from "../../../assets/Close icon.svg";
export default function BillingComponent() {
  const tabs = ["Billing Schedule", "Invoices", "Payment Method"];
  const [activeTab, setActiveTab] = useState("Billing Schedule");

  return (
    <div>
      <RenderTabs
        Tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "Billing Schedule" && <BillingSchedule />}
      {activeTab === "Invoices" && <Invoices />}
      {activeTab === "Payment Method" && <PaymentMethod />}
    </div>
  );
}
const BillingSchedule = () => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>();
  const handleCreateModal = () => {
    setModalShow(false);
  };
  const dummyData = [
    {
      billingOn: "2024-04-01",
      proposalName: "Proposal X",
      serviceName: "Service A",
      billingFrequency: "Monthly",
      totalValue: "$1000",
    },
    {
      billingOn: "2024-04-05",
      proposalName: "Proposal Y",
      serviceName: "Service B",
      billingFrequency: "Quarterly",
      totalValue: "$2500",
    },
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
              {"Billing on"}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Proposal Name <img src={sortingArrows} alt="Sorting Arrows" />
            </th>

            <th className={styles.headerText} scope="col">
              Service name
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Billing frequency
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Total Value
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
                onClick={() => {
                  setSelectedItem(item);
                  setModalShow(true);
                }}
              >
                {item.billingOn}
              </td>
              <td className={styles.tableDataText}>
                <p>{item.proposalName}</p>
              </td>
              <td className={styles.tableDataText}>{item.serviceName}</td>
              <td className={styles.tableDataText}>{item.billingFrequency}</td>
              <td className={styles.tableDataText}>{item.totalValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ViewBillingModal
        show={modalShow}
        onHide={() => handleCreateModal()}
        item={selectedItem}
      />
    </div>
  );
};

const Invoices = () => {
  const dummyData = [
    {
      invoiceID: "INV001",
      amount: "$500",
      date: "2024-04-05",
    },
    {
      invoiceID: "INV002",
      amount: "$750",
      date: "2024-04-10",
    },
    {
      invoiceID: "INV003",
      amount: "$1000",
      date: "2024-04-15",
    },
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
              {"Invoice ID"}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Amount
            </th>

            <th className={styles.headerText} scope="col">
              Date
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
                {item.invoiceID}
              </td>
              <td className={styles.tableDataText}>{item.amount}</td>
              <td className={styles.tableDataText}>{item.date}</td>
              <td className={styles.EditButton}>Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaymentMethod = () => {
  const dummyData = [
    {
      typeOfPayment: "Credit Card",
      accountNumberOrIBAN: "XXXX-XXXX-XXXX-1234",
      accountTitle: "John Doe",
    },
    {
      typeOfPayment: "Bank Transfer",
      accountNumberOrIBAN: "GB12 NWBK 1234 5678 9012 34",
      accountTitle: "Jane Smith",
    },
    {
      typeOfPayment: "PayPal",
      accountNumberOrIBAN: "paypal@example.com",
      accountTitle: "Alex Johnson",
    },
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
              {"Type of payment"}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Account number/IBAN{" "}
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>

            <th className={styles.headerText} scope="col">
              Account title
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
                {item.typeOfPayment}
              </td>
              <td className={styles.tableDataText}>
                {item.accountNumberOrIBAN}
              </td>
              <td className={styles.tableDataText}>{item.accountTitle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ViewBillingModal = (props: any) => {
  const data = [
    {
      serviceName: "Service A",
      billingFrequency: "Monthly",
      price: "$100",
      tax: "VAT 10%",
      quantity: 2,
    },
    {
      serviceName: "Service B",
      billingFrequency: "Quarterly",
      price: "$150",
      tax: "VAT 15%",
      quantity: 1,
    },
    {
      serviceName: "Service C",
      billingFrequency: "Annually",
      price: "$500",
      tax: "VAT 50%",
      quantity: 3,
    },
    // Add more objects as needed
  ];
  const { item } = props;
  return (
    <Modal dialogClassName={styles.modalCustom} {...props} centered>
      <div>
        <div className={styles.headerRow}>
          <p className={styles.modalheader}>{"Billing Information"}</p>
          <img
            style={{ width: "40px", height: "40px", alignSelf: "flex-end" }}
            src={CloseIcon}
            alt="Close"
            onClick={props.onHide}
          />
        </div>
        <p className={styles.subHeader}>
          {item?.billingOn}
          {item?.proposalName}
        </p>
        <div className={styles.SubheaderRow}>
          <div className={styles.column}>
            <p className={styles.subHeaderLabel}>Scheduled On:</p>
            <p className={styles.subHeaderValue}>{item?.billingOn}</p>
          </div>
          <div className={styles.column}>
            <p className={styles.subHeaderLabel}>Billing is done:</p>
            <p className={styles.subHeaderValue}>Automatically</p>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table className="table" style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th
                  className={styles.headerText}
                  scope="col"
                  style={{ paddingLeft: "32px" }}
                >
                  {"Service Name"}
                </th>
                <th className={styles.headerText} scope="col">
                  Billing Frequency
                </th>
                <th className={styles.headerText} scope="col">
                  Price
                </th>
                <th className={styles.headerText} scope="col">
                  Tax
                </th>
                <th className={styles.headerText} scope="col">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: any, index: number) => (
                <tr key={index}>
                  <td
                    className={styles.tableDataText}
                    style={{ paddingLeft: "32px" }}
                  >
                    {item.serviceName}
                  </td>
                  <td className={styles.tableDataText}>
                    {item.billingFrequency}
                  </td>
                  <td className={styles.tableDataText}>{item.Price}</td>
                  <td className={styles.tableDataText}>{item.tax}</td>
                  <td className={styles.tableDataText}>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.TotalRow}>
          <p className={styles.TotalText}>Total</p>
          <p className={styles.TotalText}>{"$ 2000"}</p>
        </div>
      </div>
    </Modal>
  );
};
