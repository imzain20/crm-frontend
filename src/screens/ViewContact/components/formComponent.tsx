import Search from "../../../assets/svg/Search.svg";
import Filter from "../../../assets/svg/Filter.svg";
import sortingArrows from "../../../assets/svg/Sort arrows.svg";
import styles from "./form.module.scss";
import { useState } from "react";
import FormIcon from "../../../assets/formIcon.svg";

const FormsTable = () => {
  const dummyData = [
    {
      formName: "Form A",
      contactName: "John Doe",
      filledOutBy: "Alice",
      sentOutOn: "2024-04-15",
      completedOn: "2024-04-16",
    },
    {
      formName: "Form B",
      contactName: "Jane Smith",
      filledOutBy: "Bob",
      sentOutOn: "2024-04-12",
      completedOn: "2024-04-14",
    },
    {
      formName: "Form C",
      contactName: "Alex Johnson",
      filledOutBy: "Charlie",
      sentOutOn: "2024-04-10",
      completedOn: "2024-04-13",
    },
    // Add more objects as needed
  ];

  const [data] = useState<any[]>(dummyData);
  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className={styles.buttonsRow}>
        <div className={`"bg-white d-flex align-items-center"`}>
          <img className="btn" src={Search} alt="Search"></img>
          <img className="btn" src={Filter} alt="Filter"></img>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th
              className={styles.headerText}
              scope="col"
              style={{ paddingLeft: "20px" }}
            >
              Form Name <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Contact Name <img src={sortingArrows} alt="Sorting Arrows" />
            </th>

            <th className={styles.headerText} scope="col">
              Filled out by
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Sent out on
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Completed On
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
                  style={{ marginRight: "16px" }}
                  src={FormIcon}
                  alt="form Icon"
                />
                {item.formName}
              </td>
              <td className={styles.tableDataText}>{item.contactName}</td>
              <td className={styles.tableDataText}>{item.filledOutBy}</td>
              <td className={styles.tableDataText}>{item.sentOutOn}</td>
              <td className={styles.tableDataText}>{item.completedOn}</td>
              <td className={styles.EditButton}>View</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsTable;
