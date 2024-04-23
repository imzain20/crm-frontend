import { useEffect, useState } from "react";
import { useCrmContext } from "../../../context/CRMcontext";
import { useUserState } from "../../../redux/userSlice";
import styles from "./Information.module.scss";
import axios from "axios";

export default function InformationComponent() {
  const { contactId } = useCrmContext();
  const userState = useUserState();
  const [data, setdata] = useState<any>();
  useEffect(() => {
    axios
      .get(
        `https://backend-d.cinqd.com/customer/get-customer-data-by-id/${contactId}`,
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      )
      .then((res) => {
        setdata(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div
      style={{
        overflowY: "scroll",
        maxHeight: "100%",
        scrollbarWidth: "none",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      {data?.data?.map((field: any) => {
        if (field?.fieldType === "input" || field.fieldType === "dropdown") {
          return (
            <div className={styles.field} key={field.id}>
              <p className={styles.labelStyle}>{field?.fieldName}:</p>
              <p className={styles.textStyle}>{field.value}</p>
            </div>
          );
        } else if (field?.fieldType === "text") {
          console.log(field);
          return (
            <div className={styles.field} key={field.id}>
              <p className={styles.headingStyle}>{field?.optionalData?.text}</p>
            </div>
          );
        }
      })}
    </div>
  );
}
