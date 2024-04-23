import { useNavigate } from "react-router-dom";
import styles from "./view.module.scss";
import LeftArrow from "../../assets/svg/Arrowleft.svg";
import { useState } from "react";
import RenderTabs from "../../components/TabsComponent/RenderTabs";
import InformationComponent from "./components/InformationComponent";
import ConnectionsTable from "./components/ConnectionsComponent";
import ServicesTable from "./components/ServicesComponent";
import WorkComponent from "./components/WorkComponent";
import EmailComponent from "./components/EmailComponent";
import History from "./components/HistoryComponent";
import FormsTable from "./components/formComponent";
import BillingComponent from "./components/BillingComponent";
import { useCreateCommentMutation } from "../../redux/crmApis";
import { useCrmContext } from "../../context/CRMcontext";
import { useUserState } from "../../redux/userSlice";
import { toast } from "react-toastify";
import CompanyHouse from "./components/CompanyHouse";
import FilesComponent from "./components/filesComponent";
export default function ViewContact() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Information");
  const userState = useUserState();
  const [comment, setComment] = useState("");
  const [createComment] = useCreateCommentMutation();
  const { contactId } = useCrmContext();
  const handleSubmit = async () => {
    const result: any = await createComment({
      bodyData: {
        contactId: contactId,
        description: comment,
        createdBy: userState.user._id,
      },
      token: userState.token,
    });
    console.log(result?.data?.status);
    if (result?.data?.status == "200") {
      toast.success("Comment Created Successfully!", {
        position: "top-right",
      });
    }
  };
  const Tabs: any = [
    "Information",
    "Connections",
    "Company House",
    "Services",
    "Work",
    "Emails",
    "Biling",
    "Forms",
    "Files",
    "History",
  ];
  return (
    <>
      <div className={styles.header}>
        <div className={styles.heading}>
          <img onClick={() => navigate(-1)} src={LeftArrow} alt="arrow" />
          <h3>Company name</h3>
          <div className={styles.contactStatus}>
            <p>{"Status"}</p>
          </div>
        </div>
      </div>
      <div className={styles.bodyContainer}>
        <RenderTabs
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          Tabs={Tabs}
        />
        {activeTab === "Work" && <WorkComponent />}
        {activeTab === "Information" && <InformationComponent />}
        {activeTab === "Connections" && <ConnectionsTable />}
        {activeTab === "Services" && <ServicesTable />}
        {activeTab === "Emails" && <EmailComponent />}
        {activeTab === "History" && <History />}
        {activeTab === "Forms" && <FormsTable />}
        {activeTab === "Biling" && <BillingComponent />}
        {activeTab === "Company House" && <CompanyHouse />}
        {activeTab === "Files" && <FilesComponent />}
      </div>
      <div className={`form-group`}>
        <textarea
          className={`form-control ${styles.textArea}`}
          placeholder="Enter Comments Here"
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
      </div>
      <div>
        <button className={styles.CommentButton} onClick={handleSubmit}>
          Comment
        </button>
      </div>
    </>
  );
}