import { useEffect, useState } from "react";
import RenderTabs from "../../../components/TabsComponent/RenderTabs";
import styles from "./companyhouse.module.scss";
import { useUserState } from "../../../redux/userSlice";
import axios from "axios";
import { useCrmContext } from "../../../context/CRMcontext";
export default function CompanyHouse() {
  const tabs = ["Overview", "Filing History", "People", "Charges"];
  const userState = useUserState();
  const { contactId } = useCrmContext();
  const [activeTab, setActiveTab] = useState("Overview");
  const [field, setField] = useState<any>();
  const [OverViewdata, setOverViewData] = useState<any>();
  const [FilingData, setFilingData] = useState<any>();
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
        const filteredObject = res.data.data.filter(
          (obj: any) => obj.fieldName === "Company Registration Number (CRN)"
        );
        const crn = filteredObject[0]?.value;
        axios
          .get(`https://backend-b.cinqd.com/setup/get-business-by-CRN/${crn}`, {
            headers: {
              "auth-token": userState.token,
            },
          })
          .then((res) => {
            setOverViewData(res.data.data);
          })
          .catch((e) => {
            console.log(e);
          });
        axios
          .get(
            `https://backend-b.cinqd.com/setup/get-business-by-CRN/company/${crn}/filing-history`,
            {
              headers: {
                "auth-token": userState.token,
              },
            }
          )
          .then((res: any) => {
            setFilingData(res.data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <div>
      <RenderTabs
        Tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "Overview" && <Overview data={OverViewdata} />}
      {activeTab === "Filing History" && <FilingHistory data={FilingData} />}
      {activeTab === "People" && <People />}
      {activeTab === "Charges" && <Charges />}
    </div>
  );
}

function Overview(props: any) {
  const { data } = props;
  const formatDate = (dateString: any) => {
    const options: any = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };
  return (
    <div>
      <div className={styles.Section}>
        <div className={styles.SubSection}>
          <p className={styles.overviewlabel}>Registered Office Address</p>
          <p className={styles.overviewvalue}>
            {data?.registered_office_address?.address_line_1},
            {data?.registered_office_address?.address_line_2},
            {data?.registered_office_address?.locality},
            {data?.registered_office_address?.country},
            {data?.registered_office_address?.postal_code}
          </p>
        </div>
        <div className={styles.SubSectionRow}>
          <div>
            <p className={styles.overviewlabel}>Company Status</p>
            <p className={styles.overviewvalue}>{data?.company_status}</p>
          </div>
          <div>
            <p className={styles.overviewlabel}>Incorporated On</p>
            <p className={styles.overviewvalue}>
              {formatDate(data?.date_of_creation)}
            </p>
          </div>
        </div>
      </div>
      <hr style={{ margin: 0 }} />
      <div className={styles.Section}>
        <p className={styles.HeaderText}>Accounts</p>
        <div className={styles.SubSectionRow}>
          <div>
            <p className={styles.overviewlabel}>Next accounts made up to</p>
            <p className={styles.overviewvalue}>
              {formatDate(data?.accounts?.next_accounts?.period_end_on)}
            </p>
          </div>
          <div>
            <p className={styles.overviewlabel}>Due by</p>
            <p className={styles.overviewvalue}>
              {formatDate(data?.accounts?.next_accounts?.due_on)}
            </p>
          </div>
          <div>
            <p className={styles.overviewlabel}>Last accounts made up to</p>
            <p className={styles.overviewvalue}>
              {formatDate(data?.confirmation_statement?.last_made_up_to)}
            </p>
          </div>
        </div>
      </div>
      <hr style={{ margin: 0 }} />
      <div className={styles.Section}>
        <p className={styles.HeaderText}>Name of Business (SIC)</p>
        <div>
          <p className={styles.overviewlabel}>Nature of Business</p>
          <p className={styles.overviewvalue}>
            {data?.sic_codes?.map((sicCode: string, index: number) => (
              <span key={index}>
                {sicCode}
                {index !== data?.sic_codes.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
function FilingHistory(props: any) {
  const { data } = props;
  console.log(data);
  return <div>CompanyHouse</div>;
}
function People() {
  return <div>CompanyHouse</div>;
}

function Charges() {
  return <div>CompanyHouse</div>;
}
