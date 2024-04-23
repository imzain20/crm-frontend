import { useEffect, useState } from "react";
import { useUserState } from "../../redux/userSlice";
import RenderForm from "./RenderForm";
import styles from "./contact.module.scss";
import LeftArrow from "../../assets/svg/Arrowleft.svg";
import Attachments from "./Attachments";
import { useNavigate } from "react-router-dom";
import RenderTabs from "../../components/TabsComponent/RenderTabs";
import {
  useAddMultipleAttachmentsMutation,
  useSubmitFormMutation,
} from "../../redux/crmApis";
import { toast } from "react-toastify";
import { useCrmContext } from "../../context/CRMcontext";
import axios from "axios";

const CreateContactScreen = () => {
  const navigate = useNavigate();
  const userState = useUserState();
  const [activeTab, setActiveTab] = useState("GeneralInfomation");
  const [FieldData, setFieldData] = useState<any[]>([]);
  const [Attachment, setAttachments] = useState<any[]>([]);
  const Tabs: any = ["GeneralInfomation", "Attachments"];
  const { contactType, mainContactType } = useCrmContext();
  const [createCustomer] = useSubmitFormMutation();
  const [data, setData] = useState<any>();
  const [addMultipleFiles] = useAddMultipleAttachmentsMutation();
  useEffect(() => {
    const formName =
      mainContactType === "Customer" && contactType === "Individual"
        ? "IndividualCustomerForm"
        : contactType === "Business"
        ? "BusinessCustomerForm"
        : mainContactType === "Supplier" && contactType === "Individual"
        ? "IndividualSupplierForm"
        : "BusinessSupplierForm";
    axios
      .get(`https://backend-c.cinqd.com/form/get-form-by-name/${formName}`, {
        headers: {
          "auth-token": userState.token,
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const handleSubmit = async () => {
    const response: any = await createCustomer({
      bodyData: {
        formName:
          mainContactType === "Customer" && contactType === "Individual"
            ? "IndividualCustomerForm"
            : contactType === "Business"
            ? "BusinessCustomerForm"
            : mainContactType === "Supplier" && contactType === "Individual"
            ? "IndividualSupplierForm"
            : "BusinessSupplierForm",
        attachments: Attachment,
        data: FieldData,
      },
      token: userState.token,
    });
    if (response?.data?.status === 200) {
      const contact = response?.data?.data;
      const files: any[] = [];
      const promises: Promise<any>[] = [];

      Attachment.forEach((file: any) => {
        const bodyData = new FormData();
        bodyData.append("file", file);
        promises.push(
          axios
            .post(
              "https://backend-d.cinqd.com/customer/upload-files",
              bodyData,
              {
                headers: {
                  "auth-token": userState.token,
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res: any) => {
              const reqData = {
                name: file.name,
                createdBy: userState.user.userName,
                contactId: contact,
                type: file.type,
                path: res.data?.data,
              };
              files.push(reqData);
            })
        );
      });
      Promise.all(promises)
        .then(() => {
          console.log(files);
          return addMultipleFiles({
            bodyData: { files: files },
            token: userState.token,
            id: contact,
          });
        })
        .then((result: any) => {
          if (result?.data?.status === 200) {
            toast.success("Customer Created Successfully!", {
              position: "top-right",
            });
            navigate(-1);
          }
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error occurred:", error);
        });
    }
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.heading}>
          <img onClick={() => navigate(-1)} src={LeftArrow} alt="arrow" />
          <h3>Create Contact</h3>
        </div>
        <p className={styles.description}>
          Here you can create individual contacts and can add them to contacts
          list
        </p>
      </div>
      <div className={styles.bodyContainer}>
        <RenderTabs
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          Tabs={Tabs}
        />
        {activeTab === "GeneralInfomation" && (
          <RenderForm
            formfields={data?.formFields}
            setFieldData={setFieldData}
            fieldData={FieldData}
          />
        )}
        {activeTab === "Attachments" && (
          <Attachments
            setAttachment={setAttachments}
            attachments={Attachment}
          />
        )}
      </div>
      <div>
        <button className={styles.createButton} onClick={handleSubmit}>
          Create
        </button>
      </div>
    </>
  );
};

export default CreateContactScreen;