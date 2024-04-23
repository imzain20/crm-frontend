import "./fileUploader.css";
import upload from "../../assets/svg/Upload.svg";
import GreyUpload from "../../assets/svg/Upload Big.svg";
import CloseIcon from "../../assets/Close icon.svg";
import DocIcon from "../../assets/Document icon.svg";
import styles from "./Attachment.module.scss";
import { useState } from "react";
interface RenderFormProps {
  setAttachment: any;
  attachments?: any[];
}
const Attachments: React.FC<RenderFormProps> = ({
  setAttachment,
  attachments,
}) => {
  const [files, setfiles] = useState<any>([]);
  function handleFileChange(event: any) {
    let selectedFile = event.target.files[0];
    setfiles([...files, selectedFile]);
    setAttachment([...files, selectedFile]);
  }
  const handleRemove = (file: any) => {
    setfiles(
      files.filter((item: any) => {
        console.log(item.name, file.name);
        return item.name !== file.name;
      })
    );
    setAttachment(
      files.filter((item: any) => {
        console.log(item.name, file.name);
        return item.name !== file.name;
      })
    );
  };

  return (
    <div>
      <div className={styles.mainContent}>
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
      {files?.map((file: any) => {
        return (
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
                <p className={styles.fileText}>{file.name}</p>
                <p className={styles.fileText}>
                  {(parseFloat(file.size) / 1024 / 1024).toFixed(2) + " MBs"}
                </p>
              </div>
            </div>
            <img
              onClick={() => {
                handleRemove(file);
              }}
              src={CloseIcon}
              alt="Close Icon"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Attachments;
