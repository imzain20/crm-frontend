import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./import.module.scss";
import upload from "../../assets/svg/Upload.svg";
import GreyUpload from "../../assets/svg/Upload Big.svg";
import Papa from "papaparse";
import LeftArrow from "../../assets/svg/Arrowleft.svg";
import { useNavigate } from "react-router-dom";
import ContactAdded from "../../assets/Contact added icon.svg";
import CloseIcon from "../../assets/Close icon.svg";
import { useUserState } from "../../redux/userSlice";
import { useGetFormByIdQuery } from "../../redux/api";
import { useUploadCustomerSheetMutation } from "../../redux/crmApis";
import { useCrmContext } from "../../context/CRMcontext";
interface CSVRow {
  [key: string]: string;
}

export default function ImportContact() {
  const navigate = useNavigate();
  const userState = useUserState();
  const { mainContactType } = useCrmContext();
  const { data: individualData, refetch: IndividualDataRefetch } =
    useGetFormByIdQuery({
      token: userState.token,
      formName:
        mainContactType === "Customer"
          ? "IndividualCustomerForm"
          : "IndividualSupplierForm",
    });
  const { data: businessData, refetch: businessDataRefetch } =
    useGetFormByIdQuery({
      token: userState.token,
      formName:
        mainContactType === "Customer"
          ? "BusinessCustomerForm"
          : "BusinessSupplierForm",
    });
  const [checkboxState, setcheckBoxStates] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [uploadSheet] = useUploadCustomerSheetMutation();
  useEffect(() => {
    IndividualDataRefetch();
    businessDataRefetch();
  }, []);
  const [modalShow, setModalShow] = useState(true);
  const [CreatemodalShow, setCreateModalShow] = useState(false);

  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const renderPreview = (values: any) => {
    return values
      .slice(0, 3)
      .map((value: any, index: any) => <p key={index}>{value}</p>);
  };
  const handleCreateModal = () => {
    setModalShow(false);
    navigate(-1);
  };
  const handleSubmit = async () => {
    let newArray: any[] = [];
    checkboxState.forEach((singleState: any) => {
      selectedOptions.forEach((option: any) => {
        if (option.key === singleState) {
          const columnData: any[] = [];
          csvData.forEach((row) => {
            if (row[singleState] !== undefined && row[singleState] !== "") {
              columnData.push({ fieldId: option.id, value: row[singleState] });
            }
          });
          newArray.push([...columnData]);
        }
      });
      newArray.push({}); // Add an empty object for the next row
    });

    // Filter out empty objects
    newArray = newArray.filter((obj) => Object.keys(obj).length !== 0);

    console.log(JSON.stringify(newArray)); // newArray contains the desired structure without empty objects
    const concatenatedArray = mergeArrayOfArrays(newArray);
    console.log(concatenatedArray);
    const response: any = await uploadSheet({
      bodyData: {
        formName: "IndividualContactForm",
        data: concatenatedArray,
      },
      token: userState.token,
    });
    if (response?.data?.status === 200) {
      setCreateModalShow(true);
    }
  };
  function mergeArrayOfArrays(arrays: any) {
    let mergedArray = [];

    // Determine the maximum length among all inner arrays
    let maxLength = Math.max(...arrays.map((arr: any) => arr.length));

    // Merge elements from all inner arrays
    for (let i = 0; i < maxLength; i++) {
      let innerArray = [];
      for (let j = 0; j < arrays.length; j++) {
        if (i < arrays[j].length) {
          innerArray.push(arrays[j][i]);
        } else {
          innerArray.push(null);
        }
      }
      mergedArray.push(innerArray);
    }

    return mergedArray;
  }
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setSelectedFile={setCsvData}
      />
      <ImportModal show={CreatemodalShow} onHide={() => handleCreateModal()} />
      {csvData.length !== 0 && (
        <>
          <div className={styles.header}>
            <div className={styles.heading}>
              <img onClick={() => navigate(-1)} src={LeftArrow} alt="arrow" />
              <h3>Add Contacts</h3>
            </div>
            <p className={styles.description}>
              Here you can import contacts from a CSV file
            </p>
          </div>
          <div className={styles.bodyContainer}>
            <table className={styles.customTable}>
              <thead className={styles.Head}>
                <th className={styles.headerText}>Column header from file</th>
                <th className={styles.headerText}>Preview information</th>
                <th className={styles.headerText}>Cinqd ERP property</th>
              </thead>
              <tbody>
                {Object.keys(csvData[0]).map((key) => (
                  <tr key={key}>
                    <td
                      className={styles.tableDataText}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
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
                          marginRight: "20px",
                        }}
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            setcheckBoxStates((prevState: any) => [
                              ...prevState,
                              key,
                            ]);
                          } else if (e.target.checked === false) {
                            setcheckBoxStates((prevState: any) =>
                              prevState.filter((state: string) => state !== key)
                            );
                          }
                        }}
                      />
                      <p>{key}</p>
                    </td>
                    <td className={styles.tableDataText}>
                      {renderPreview(csvData.map((row) => row[key]))}
                    </td>
                    <td className={styles.tableDataText}>
                      <select
                        className={`form-select ${styles.inputStyle}`}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const filteredArray = selectedOptions.filter(
                            (option: any) => {
                              return option.key !== key;
                            }
                          );
                          filteredArray.push({ id: selectedValue, key: key });
                          setSelectedOptions([...filteredArray]);
                        }}
                      >
                        <option selected disabled={true}>
                          Choose
                        </option>
                        {individualData?.data?.formFields?.map((field: any) => (
                          <option key={field._id} value={field._id}>
                            {field.fieldName}
                          </option>
                        ))}
                        {businessData?.data?.formFields?.map((field: any) => (
                          <option key={field._id} value={field._id}>
                            {field.fieldName}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button
              className={styles.createButton}
              onClick={() => {
                handleSubmit();
              }}
            >
              Create
            </button>
          </div>
        </>
      )}
    </>
  );
}

function MyVerticallyCenteredModal(props: any) {
  function handleFileChange(event: any) {
    let selectedFile = event.target.files[0];
    Papa.parse(selectedFile, {
      header: true,
      complete: (results: any) => {
        props.setSelectedFile(results.data);
      },
    });
    props.onHide();
  }
  return (
    <Modal {...props} centered>
      <h4 style={{ paddingLeft: "20px", paddingTop: "20px" }}>Import CSV</h4>
      <Modal.Body>
        <div className={styles.mainContent}>
          <img
            style={{
              height: "80px",
              width: "80px",
            }}
            src={GreyUpload}
            alt="Upload svg"
          />
          <p>Drag and drop CSV</p>
          <div className="custom-file-upload">
            <label htmlFor="attachment">
              <img src={upload} alt="Upload svg" /> {"Attachment"}
            </label>
            <input
              type="file"
              id="attachment"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ImportModal(props: any) {
  return (
    <Modal {...props} centered>
      <img
        style={{ width: "40px", height: "40px", alignSelf: "flex-end" }}
        src={CloseIcon}
        alt="Close"
        onClick={props.onHide}
      />
      <Modal.Body>
        <div className={styles.mainContentCreateModal}>
          <img src={ContactAdded} alt="Icon" />
          <p>Contacts have been successfully added</p>
        </div>
      </Modal.Body>
    </Modal>
  );
}
