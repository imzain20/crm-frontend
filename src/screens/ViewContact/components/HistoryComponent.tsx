import React, { useEffect, useState } from "react";
import { Accordion, Modal } from "react-bootstrap";
import Search from "../../../assets/svg/Search.svg";
import Filter from "../../../assets/svg/Filter.svg";
import styles from "./history.module.scss";
import CloseIcon from "../../../assets/Close icon.svg";
import PlaceHolder from "../../../assets/png/soleProp_icon.png";
import {
  useCreateReplyMutation,
  useGetCommentsQuery,
} from "../../../redux/crmApis";
import { useUserState } from "../../../redux/userSlice";
import { useCrmContext } from "../../../context/CRMcontext";
import { toast } from "react-toastify";
import axios from "axios";
interface Comment {
  createdBy: any;
  description: string;
  createdAt: string;
  updatedAt: string;
  contactId: string;
  replies: any[];
  _id: string;
}

const HistoryComponent: React.FC = () => {
  const userState = useUserState();
  const { contactId } = useCrmContext();
  const [comments, setComments] = useState<{
    [year: string]: { [month: string]: { [date: string]: Comment[] } };
  }>({});
  const [modalshow, setModalShow] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any>();
  const { data, refetch } = useGetCommentsQuery({
    token: userState.token,
    id: contactId,
  });
  useEffect(() => {
    if (data && data.data) {
      const fetchedComments: Comment[] = [...data.data];
      fetchedComments.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const groupedComments = groupComments(fetchedComments);

      setComments(groupedComments);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, []);
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const formatDateTime = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(date).toLocaleTimeString("en-US", options);
  };
  const groupComments = (comments: Comment[]) => {
    const grouped: {
      [year: string]: { [month: string]: { [date: string]: Comment[] } };
    } = {};
    comments?.forEach((comment) => {
      const createdAt = new Date(comment.createdAt);
      const year = createdAt.getFullYear().toString();
      const month = createdAt.toLocaleString("default", { month: "long" });
      const dayMonthYear = formatDate(comment.createdAt);

      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = {};
      }
      if (!grouped[year][month][dayMonthYear]) {
        grouped[year][month][dayMonthYear] = [];
      }

      grouped[year][month][dayMonthYear].push(comment);
    });
    return grouped;
  };

  return (
    <div className="d-flex bg-white py-2 CustomTable">
      <div className={styles.buttonsRow}>
        <div className={`"bg-white d-flex align-items-center"`}>
          <img className="btn" src={Search} alt="Search"></img>
          <img className="btn" src={Filter} alt="Filter"></img>
        </div>
        <div style={{ marginLeft: "40px" }}>
          <button className={`${styles.customButton} " mx-2 px-3 py-2"`}>
            {"Export"}
          </button>
        </div>
      </div>
      <Accordion id="HistoryMainAccordion" defaultActiveKey="0">
        {Object.entries(comments).map(([year, months]) => (
          <Accordion.Item
            eventKey={year}
            style={{
              border: "unset",
            }}
          >
            <Accordion.Header style={{ border: "unset" }}>
              <div className={styles.customAccordionHeader}>
                <p className={styles.YearHeader}> {year}</p>
                <p className={styles.customDivider}></p>
              </div>
            </Accordion.Header>
            <Accordion.Body
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingRight: 0,
              }}
            >
              {Object.entries(months).map(([month, dates]) => (
                <Accordion defaultActiveKey="1">
                  <Accordion.Item
                    eventKey={month}
                    style={{
                      border: "unset",
                    }}
                  >
                    <Accordion.Header style={{ border: "unset" }}>
                      <div className={styles.customAccordionHeader}>
                        <p className={styles.MonthHeader}>
                          {month} {year}
                        </p>
                        <p className={styles.customDivider}></p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body
                      style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingRight: 0,
                      }}
                    >
                      {Object.entries(dates).map(([date, comments]) => (
                        <Accordion defaultActiveKey="2">
                          <Accordion.Item
                            eventKey={date}
                            style={{
                              border: "unset",
                            }}
                          >
                            <Accordion.Header style={{ border: "unset" }}>
                              <div className={styles.customAccordionHeader}>
                                <p className={styles.DateHeader}>{date}</p>
                                <p className={styles.customDivider}></p>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body
                              style={{
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingRight: 0,
                              }}
                            >
                              {comments.map((comment) => (
                                <div className={styles.CommentRow}>
                                  <p className={styles.TimeText}>
                                    {formatDateTime(comment.createdAt)}
                                  </p>
                                  <div className={styles.CommentContent}>
                                    <p className={styles.description}>
                                      {comment.description}
                                    </p>
                                    <div className={styles.createdBy}>
                                      <p className={styles.TimeText}>by</p>
                                      <p className={styles.createdByValue}>
                                        {comment?.createdBy?.userName}
                                      </p>
                                    </div>
                                    <div
                                      className={styles.commentLengthRow}
                                      onClick={() => {
                                        setSelectedComment(comment);
                                        setModalShow(true);
                                      }}
                                    >
                                      <p className={styles.CommentLength}>
                                        Comments({comment.replies.length})
                                      </p>
                                      <p className={styles.AddComment}>
                                        + Add Comment
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <CommentModal
        show={modalshow}
        onHide={() => setModalShow(false)}
        comment={selectedComment}
      />
    </div>
  );
};

export default HistoryComponent;

const CommentModal = (props: any) => {
  const userState = useUserState();
  const formatDate = (date: string) => {
    console.log(date);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const formatDateTime = (date: string) => {
    console.log(date);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(date).toLocaleTimeString("en-US", options);
  };
  const [comment, setComment] = useState<Comment>();
  useEffect(() => {
    setComment(props?.comment);
  }, [props]);
  console.log(comment);
  const [createComment] = useCreateReplyMutation();
  const { contactId } = useCrmContext();
  const [description, setDescription] = useState("");
  const handleSubmit = async () => {
    const result: any = await createComment({
      bodyData: {
        contactId: contactId,
        description: description,
        createdBy: userState.user.userName,
        createdAt: new Date().toISOString(),
      },
      id: props?.comment?._id,
      token: userState.token,
    });
    if (result?.data?.status == "200") {
      toast.success("Reply Created Successfully!", {
        position: "top-right",
      });
      const data = await axios.get(
        `https://backend-d.cinqd.com/comments/get-comment-by-id/${comment?._id}`,
        {
          headers: {
            "auth-token": userState.token,
          },
        }
      );
      setComment(data?.data?.data);
    }
  };
  return (
    <Modal dialogClassName={styles.modalCustom} {...props} centered>
      <Modal.Header>
        <div className={styles.modalHeader}>
          <p className={styles.ModalTitle}>{comment?.description}</p>
          <img
            style={{ width: "40px", height: "40px", alignSelf: "flex-end" }}
            src={CloseIcon}
            alt="Close"
            onClick={props.onHide}
          />
        </div>
      </Modal.Header>
      {comment?.replies?.length !== 0 &&
        comment?.replies?.map((item: Comment) => {
          return (
            <div className={styles.comment}>
              <img
                src={PlaceHolder}
                alt="Avatar"
                className={`${styles.customavatar} avatar`}
              />
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <p className={styles.createdByName}>{item.createdBy}</p>
                  <p className={styles.createdAtDate}>
                    {formatDate(item?.createdAt)}
                  </p>
                  <p className={styles.createdAtTime}>
                    {formatDateTime(item?.createdAt)}
                  </p>
                </div>
                <p className={styles.commentDescription}>{item?.description}</p>
              </div>
            </div>
          );
        })}
      <Modal.Footer style={{ padding: 0 }}>
        <div className={styles.footerRow}>
          <img
            src={PlaceHolder}
            alt="Avatar"
            className={`${styles.CommentAvatar} avatar`}
          />
          <div className={styles.field}>
            <input
              id="input"
              type="text"
              className={`form-control ${styles.inputStyle}`}
              placeholder={"Enter Here"}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className={`${styles.customButton}`} onClick={handleSubmit}>
            {"Comment"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
