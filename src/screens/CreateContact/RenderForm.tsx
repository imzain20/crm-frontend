import React, { useEffect } from "react";
import styles from "./renderform.module.scss";
import { useGetLookupbyIdQuery } from "../../redux/api";
import { useUserState } from "../../redux/userSlice";
interface FormData {
  userId: string;
  value: string;
  userName: string;
}

interface Coordinates {
  top?: string;
  left?: string;
}

interface FormField {
  fieldName: string;
  fieldType: string;
  data: FormData[];
  coordinates?: Coordinates;
  styles?: object;
  optionalData?: any;
  fieldReference?: string;
  formFilter?: any[]; // Adjust the type according to your requirements
  isMandatory?: boolean;
  isReadOnly?: boolean;
  IsRestricted?: boolean;
  allowedAccess?: any[]; // Adjust the type according to your requirements
  _id: any;
}

interface RenderFormProps {
  formfields: FormField[];
  setFieldData: any;
  fieldData: any[];
}

const RenderForm: React.FC<RenderFormProps> = ({
  formfields,
  setFieldData,
  fieldData,
}) => {
  const handleChange = (
    fieldId: any,
    value: any,
    fieldType: string,
    fieldName: string
  ) => {
    // Assuming setFieldData accepts a function to update the state
    setFieldData((prevData: any[] = []) => {
      // Find the index of the field data with the given fieldId
      const dataIndex = prevData.findIndex((item) => item.fieldId === fieldId);
      // If the field data with the given fieldId exists, update its value
      if (dataIndex !== -1) {
        return prevData.map((item, index) => {
          if (index === dataIndex) {
            return {
              ...item,
              value: value,
            };
          }
          return item;
        });
      }
      // If the field data with the given fieldId doesn't exist, create a new one
      return [
        ...prevData,
        {
          fieldId: fieldId,
          value: value,
          fieldType: fieldType,
          fieldName: fieldName,
        },
      ];
    });
  };

  const handleFieldChange =
    (fieldId: any, fieldType: string, fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      handleChange(fieldId, value, fieldType, fieldName);
    };
  return (
    <div style={{ marginTop: "24px" }}>
      {formfields?.map((field) => {
        if (field?.fieldType === "input") {
          return (
            <div className={styles.field} key={field._id}>
              <label htmlFor="input" className={styles.labelStyle}>
                {field?.fieldName}
              </label>
              <input
                id="input"
                type="text"
                value={
                  fieldData.find((item) => item.fieldName === field.fieldName)
                    ?.value || ""
                }
                className={`form-control ${styles.inputStyle}`}
                style={field?.styles}
                placeholder="Enter Here"
                onChange={handleFieldChange(
                  field._id,
                  "input",
                  field.fieldName
                )}
              />
            </div>
          );
        } else if (field?.fieldType === "text") {
          return (
            <div className={styles.field} key={field._id}>
              <p style={field.styles}>{field?.optionalData?.text}</p>
            </div>
          );
        } else if (field?.fieldType === "dropdown") {
          return (
            <Dropdown
              key={field._id}
              field={field}
              setFieldData={(value: any) =>
                handleChange(field._id, value, "dropdown", field.fieldType)
              }
              handleFieldChange={handleFieldChange(
                field._id,
                "dropdown",
                field.fieldName
              )}
            />
          );
        }
      })}
    </div>
  );
};

export default RenderForm;

const Dropdown = (props: any) => {
  const { field, handleFieldChange } = props;
  const userState = useUserState();
  const { data, refetch } = useGetLookupbyIdQuery({
    id: field?.optionalData?.lookup,
    token: userState.token,
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className={styles.field}>
      <label htmlFor="drop-down" className={styles.labelStyle}>
        {field.fieldName}
      </label>
      <select
        className={`form-select ${styles.inputStyle}`}
        id="drop-down"
        aria-label="Default select example"
        value={field.value}
        onChange={handleFieldChange}
      >
        <option selected>Open this select menu</option>
        {data?.data?.options?.map((option: any) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};