import styles from "./files.module.scss";
import Search from "../../../assets/svg/Search.svg";
import Filter from "../../../assets/svg/Filter.svg";
import sortingArrows from "../../../assets/svg/Sort arrows.svg";
import upload from "../../../assets/svg/Upload.svg";
import DocIcon from "../../../assets/Document icon.svg";
import GreyUpload from "../../../assets/svg/Upload Big.svg";
import CloseIcon from "../../../assets/Close icon.svg";
import PlusIcon from "../../../assets/svg/+-/plus.svg";
import ImageIcon from "../../../assets/Image icon.svg";
import FolderIcon from "../../../assets/Folder icon.svg";
import BackButton from "../../../assets/svg/Arrowleft.svg";
import { Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useUserState } from "../../../redux/userSlice";
import { useCrmContext } from "../../../context/CRMcontext";
import axios from "axios";
import {
  useCreateFolderMutation,
  useEditFolderMutation,
} from "../../../redux/crmApis";
import { toast } from "react-toastify";
export default function FilesComponent() {
  const [data, setData] = useState<any[]>([]);
  const [folderShow, setFolderShow] = useState(false);
  const [fileShow, setFileShow] = useState(false);
  const userState = useUserState();
  const { contactId } = useCrmContext();
  const [folderView, setFolderView] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any>();
  const handleViewFileClick = async (file: any) => {
    try {
      const response = await axios.get(file.path, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: file.type });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        console.error("Failed to fetch File");
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };
  useEffect(() => {
    axios
      .get(`https://backend-d.cinqd.com/file/get-data/${contactId}`, {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => setData(res.data.data))
      .catch((e) => console.log(e));
  }, []);
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className={styles.buttonsRow}>
        <div className={`"bg-white d-flex align-items-center"`}>
          <img className="btn" src={Search} alt="Search"></img>
          <img className="btn" src={Filter} alt="Filter"></img>
        </div>
        <DropdownButton className={styles.customButton} title={"Create"}>
          <Dropdown.Item
            onClick={() => {
              setFolderShow(true);
            }}
            eventKey="1"
          >
            Folder
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setFileShow(true);
            }}
            eventKey="2"
          >
            File
          </Dropdown.Item>
        </DropdownButton>
      </div>
      {folderView ? (
        <FolderView folderId={selectedFolder} setFolderView={setFolderView} />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th
                className={styles.headerText}
                scope="col"
                style={{ paddingLeft: "20px" }}
              >
                Name <img src={sortingArrows} alt="Sorting Arrows" />
              </th>
              <th className={styles.headerText} scope="col">
                Description
              </th>

              <th className={styles.headerText} scope="col">
                Created by
                <img src={sortingArrows} alt="Sorting Arrows" />
              </th>
              <th className={styles.headerText} scope="col">
                Created at
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
                      marginRight: "16px",
                      verticalAlign: "middle",
                    }}
                  />
                  <img
                    src={
                      item.type === "folder"
                        ? FolderIcon
                        : item.type === "application/pdf"
                        ? DocIcon
                        : item.type === "image/jpeg"
                        ? ImageIcon
                        : undefined
                    }
                    alt="Content Icon"
                    style={{ marginRight: "8px" }}
                  />
                  {item.name}
                </td>
                <td className={styles.tableDataText}>{item.description}</td>
                <td className={styles.tableDataText}>{item.createdBy}</td>
                <td className={styles.tableDataText}>
                  {formatDate(item.createdAt)}
                </td>
                <td
                  className={styles.ViewButton}
                  onClick={() => {
                    if (item.type === "folder") {
                      setFolderView(true);
                      setSelectedFolder(item._id);
                    } else {
                      handleViewFileClick(item);
                    }
                  }}
                >
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <CreateFileModal show={fileShow} onHide={() => setFileShow(false)} />
      <CreateFolderModal
        show={folderShow}
        onHide={() => setFolderShow(false)}
        setShow={() => {
          setFolderShow(!folderShow);
        }}
      />
    </div>
  );
}
const CreateFileModal = (props: any) => {
  const userState = useUserState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<any>();
  const { contactId } = useCrmContext();
  function handleFileChange(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }
  const handleSubmit = () => {
    const bodyData = new FormData();
    bodyData.append("name", name);
    bodyData.append("description", description);
    bodyData.append("createdBy", userState.user.userName);
    bodyData.append("contactId", contactId);
    bodyData.append("type", file.type);
    bodyData.append("file", file);
    axios
      .post(`https://backend-d.cinqd.com/file/create-file`, bodyData, {
        headers: {
          "auth-token": userState.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => props.onHide())
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Modal dialogClassName={styles.modalCustom} {...props} centered>
      <div className={styles.modalHeader}>
        <p className={styles.heading}>Create File</p>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.leftSection}>
          <div className={styles.field}>
            <label htmlFor="input" className={styles.labelStyle}>
              Name
            </label>
            <input
              id="input"
              type="text"
              className={`form-control ${styles.inputStyle}`}
              placeholder={"Enter Here"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="input" className={styles.labelStyle}>
              Description
            </label>
            <textarea
              className={`form-control ${styles.textArea}`}
              placeholder="Enter Here"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.uploader}>
            <img
              style={{
                height: "80px",
                width: "80px",
                marginTop: "24px",
                marginBottom: "24px",
              }}
              src={GreyUpload}
              alt="Upload svg"
            />
            <p>Drag and drop file</p>
            <div className="custom-file-upload">
              <label htmlFor="attachment">
                <img src={upload} alt="Upload svg" /> {"Attachment"}
              </label>
              <input type="file" id="attachment" onChange={handleFileChange} />
            </div>
          </div>

          {file && (
            <div className={styles.fileRow}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={DocIcon} alt="Doc Icon" className={styles.docIcon} />

                <div>
                  <p className={styles.fileText}>{file?.name}</p>
                  <p className={styles.fileText}>
                    {(parseFloat(file?.size) / 1024 / 1024).toFixed(2) + " MBs"}
                  </p>
                </div>
              </div>
              <img
                onClick={() => {
                  setFile(undefined);
                }}
                src={CloseIcon}
                alt="Close Icon"
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.footerButtons}>
        <button onClick={props.onHide} className={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={handleSubmit} className={styles.SaveButton}>
          Save
        </button>
      </div>
    </Modal>
  );
};
const CreateFolderModal = (props: any) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [showSelectFiles, setShowSelectFiles] = useState(false);
  const [createfolder] = useCreateFolderMutation();
  const userState = useUserState();
  const { contactId } = useCrmContext();
  const handleCreateFolder = async () => {
    const fileIds = files?.map((file: any) => file._id);
    const data: any = await createfolder({
      bodyData: {
        name: name,
        description: description,
        createdBy: userState.user.userName,
        contactId: contactId,
        files: fileIds,
      },
      token: userState.token,
    });
    console.log(data?.data);
  };
  const handleRemove = (file: any) => {
    setFiles(
      files.filter((item: any) => {
        return item._id !== file._id;
      })
    );
  };
  return (
    <>
      <Modal dialogClassName={styles.modalCustom} {...props} centered>
        <div className={styles.modalHeader}>
          <p className={styles.heading}>Create folder</p>
          <p className={styles.subHeading}>General Information</p>
        </div>
        <div className={styles.FolderModalBody}>
          <div className={styles.FolderField}>
            <label htmlFor="input" className={styles.labelStyle}>
              Name
            </label>
            <input
              id="input"
              type="text"
              className={`form-control ${styles.inputStyle}`}
              placeholder={"Enter Here"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className={styles.folderTextArea}>
            <label htmlFor="input" className={styles.labelStyle}>
              Description
            </label>
            <textarea
              className={`form-control ${styles.folderTextArea}`}
              placeholder="Enter Here"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <p className={styles.FilesHeading}>Files and Folders</p>
          <div className={styles.folderTextArea}>
            <p className={styles.description}>
              Here you can select folders and files so they can be added to the
              folder
            </p>
            <div className={styles.SelectedFileField}>
              {files.map((file: any) => {
                return (
                  <p className={styles.selectedFile}>
                    <img
                      src={
                        file.type === "folder"
                          ? FolderIcon
                          : file.type === "application/pdf"
                          ? DocIcon
                          : file.type === "image/jpeg"
                          ? ImageIcon
                          : undefined
                      }
                      alt="file icon"
                    />
                    {file.name}
                    <img
                      src={CloseIcon}
                      alt="remove field"
                      onClick={() => handleRemove(file)}
                    />
                  </p>
                );
              })}
            </div>

            <button
              className={`${styles.customFileButton}`}
              onClick={() => {
                setShowSelectFiles(true);
              }}
            >
              <img src={PlusIcon} alt="plus icon" />
              File
            </button>
          </div>
        </div>
        <div className={styles.footerButtons}>
          <button onClick={props.onHide} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleCreateFolder} className={styles.SaveButton}>
            Save
          </button>
        </div>
      </Modal>
      <SelectFilesModal
        show={showSelectFiles}
        onHide={() => {
          setShowSelectFiles(false);
        }}
        setFolderShow={props?.setShow}
        setfiles={setFiles}
        files={files}
      />
    </>
  );
};

const SelectFilesModal = (props: any) => {
  const [data, setData] = useState<any[]>([]);
  const userState = useUserState();
  const { contactId } = useCrmContext();
  useEffect(() => {
    axios
      .get(`https://backend-d.cinqd.com/file/get-data/${contactId}`, {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => {
        const tempfiles = res.data?.data?.filter(
          (file: any) =>
            !props.files.some((propFile: any) => propFile._id === file._id)
        );
        console.log(tempfiles);
        setData(tempfiles);
      })
      .catch((e) => console.log(e));
  }, []);
  const [checkboxState, setcheckBoxStates] = useState<any>([]);
  const handleSelectedFiles = () => {
    props?.setfiles(checkboxState);
    props?.onHide();
  };
  return (
    <Modal dialogClassName={styles.modalCustom} {...props} centered>
      <div className={styles.modalHeader}>
        <p className={styles.heading}>Choose folders and files</p>
      </div>
      <div className={styles.SelectionModalBody}>
        <div className={styles.ModalButtonsRow}>
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
          <div className={`"bg-white d-flex align-items-center"`}>
            <img className="btn" src={Search} alt="Search"></img>
            <img className="btn" src={Filter} alt="Filter"></img>
          </div>
        </div>
        {data?.map((item) => {
          return (
            <div className={styles.dataRow}>
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
                  marginRight: "16px",
                }}
                onChange={(e) => {
                  if (e.target.checked === true) {
                    setcheckBoxStates((prevState: any) => [...prevState, item]);
                  } else if (e.target.checked === false) {
                    setcheckBoxStates((prevState: any) =>
                      prevState.filter((state: any) => state._id !== item._id)
                    );
                  }
                }}
              />
              <img
                src={
                  item.type === "folder"
                    ? FolderIcon
                    : item.type === "application/pdf"
                    ? DocIcon
                    : item.type === "image/jpeg"
                    ? ImageIcon
                    : undefined
                }
                alt="content icon"
                style={{ marginRight: "8px" }}
              />
              <p className={styles.FileName}>{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.CustomModalFooter}>
        <button onClick={handleSelectedFiles} className={styles.SaveButton}>
          Add
        </button>
      </div>
    </Modal>
  );
};

const FolderView = (props: any) => {
  const userState = useUserState();
  const [data, setData] = useState<any>();
  const [folderShow, setFolderShow] = useState(false);
  useEffect(() => {
    axios
      .get(
        `https://backend-d.cinqd.com/folder/get-folder-by-id/${props.folderId}`,
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      )
      .then((res) => setData(res.data.data))
      .catch((e) => console.log(e));
  }, []);
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  return (
    <div>
      <div className={styles.FolderbuttonsRow}>
        <div className={styles.LeftButtons}>
          <img
            src={BackButton}
            alt="back button"
            onClick={() => props?.setFolderView(false)}
          />
          <p className={styles.folderName}>{data?.name}</p>
        </div>
        <button
          className={styles.EditButton}
          onClick={() => setFolderShow(true)}
        >
          Edit
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th
              className={styles.headerText}
              scope="col"
              style={{ paddingLeft: "20px" }}
            >
              Name <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Description
            </th>

            <th className={styles.headerText} scope="col">
              Created by
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
            <th className={styles.headerText} scope="col">
              Created at
              <img src={sortingArrows} alt="Sorting Arrows" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.files?.map((item: any, index: number) => (
            <tr key={index}>
              <td
                className={styles.tableDataText}
                style={{ paddingLeft: "20px" }}
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
                    marginRight: "16px",
                  }}
                />
                <img
                  src={
                    item.type === "folder"
                      ? FolderIcon
                      : item.type === "application/pdf"
                      ? DocIcon
                      : item.type === "image/jpeg"
                      ? ImageIcon
                      : undefined
                  }
                  alt="Content Icon"
                  style={{ marginRight: "8px" }}
                />
                {item.name}
              </td>
              <td className={styles.tableDataText}>{item.description}</td>
              <td className={styles.tableDataText}>{item.createdBy}</td>
              <td className={styles.tableDataText}>
                {formatDate(item.createdAt)}
              </td>
              <td className={styles.ViewButton}>View</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditFolderModal
        show={folderShow}
        onHide={() => setFolderShow(false)}
        folder={data}
      />
    </div>
  );
};
const EditFolderModal = (props: any) => {
  const [name, setName] = useState(props?.folder?.name);
  const [description, setDescription] = useState(props?.folder?.description);
  const [files, setFiles] = useState(props?.folder?.files);
  const [showSelectFiles, setShowSelectFiles] = useState(false);
  const [editFolder] = useEditFolderMutation();
  const userState = useUserState();
  const { contactId } = useCrmContext();
  const handleCreateFolder = async () => {
    const fileIds = files?.map((file: any) => file._id);
    const data: any = await editFolder({
      bodyData: {
        name: name,
        description: description,
        createdBy: userState.user.userName,
        contactId: contactId,
        files: fileIds,
      },
      token: userState.token,
      id: contactId,
    });
    if (data.data.status === 200) {
      toast.success("Folder updated Successfully!", {
        position: "top-right",
      });
      props.onHide();
    }
  };
  const handleRemove = (file: any) => {
    setFiles(
      files.filter((item: any) => {
        return item._id !== file._id;
      })
    );
  };
  return (
    <>
      <Modal dialogClassName={styles.modalCustom} {...props} centered>
        <div className={styles.modalHeader}>
          <p className={styles.heading}>Edit folder</p>
          <p className={styles.subHeading}>General Information</p>
        </div>
        <div className={styles.FolderModalBody}>
          <div className={styles.FolderField}>
            <label htmlFor="input" className={styles.labelStyle}>
              Name
            </label>
            <input
              id="input"
              type="text"
              value={name}
              className={`form-control ${styles.inputStyle}`}
              placeholder={"Enter Here"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className={styles.folderTextArea}>
            <label htmlFor="input" className={styles.labelStyle}>
              Description
            </label>
            <textarea
              className={`form-control ${styles.folderTextArea}`}
              placeholder="Enter Here"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <p className={styles.FilesHeading}>Files and Folders</p>
          <div className={styles.folderTextArea}>
            <p className={styles.description}>
              Here you can select folders and files so they can be added to the
              folder
            </p>
            <div className={styles.SelectedFileField}>
              {files.map((file: any) => {
                return (
                  <p className={styles.selectedFile}>
                    <img
                      src={
                        file.type === "folder"
                          ? FolderIcon
                          : file.type === "application/pdf"
                          ? DocIcon
                          : file.type === "image/jpeg"
                          ? ImageIcon
                          : undefined
                      }
                      alt="file icon"
                    />
                    {file.name}
                    <img
                      src={CloseIcon}
                      alt="remove field"
                      onClick={() => handleRemove(file)}
                    />
                  </p>
                );
              })}
            </div>

            <button
              className={`${styles.customFileButton}`}
              onClick={() => {
                setShowSelectFiles(true);
              }}
            >
              <img src={PlusIcon} alt="plus icon" />
              File
            </button>
          </div>
        </div>
        <div className={styles.footerButtons}>
          <button onClick={props.onHide} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleCreateFolder} className={styles.SaveButton}>
            Save
          </button>
        </div>
      </Modal>
      <SelectFilesModal
        show={showSelectFiles}
        onHide={() => {
          setShowSelectFiles(false);
        }}
        setFolderShow={props?.setShow}
        setfiles={setFiles}
        files={files}
      />
    </>
  );
};
