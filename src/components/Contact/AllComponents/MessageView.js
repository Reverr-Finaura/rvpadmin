import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { database } from "../../../firebase/firebase";
import style from "./chat.module.css";
import moment from "moment";
import checkIcon from "../../../utils/Image/check.png";

const MessageView = ({
  currMessages,
  setCurrMessages,
  setSelectedData,
  selectedData,
}) => {
  const ref = useRef(null);
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    const documentRef = doc(database, "WhatsappMessages", selectedData.id);
    const unsubscribe = onSnapshot(documentRef, (doc) => {
      if (!doc.exists()) {
        console.warn("Document not found for the selected data ID.");
        return;
      }
      const messages = doc.data().messages;
      setSelectedData({ ...doc.data(), id: doc.id });
      const groupedMessages = messages.reduce((accumulator, item) => {
        const maindate =
          item.date && item.date.seconds
            ? new Date(item.date.seconds * 1000 + item.date.nanoseconds / 1e6)
            : item.date && item.date._seconds
            ? new Date(item.date._seconds * 1000 + item.date._nanoseconds / 1e6)
            : null;

        if (maindate) {
          const existingGroup = accumulator.find(
            (group) => group.maindate === maindate
          );
          if (existingGroup) {
            existingGroup.messages.push(item);
          } else {
            accumulator.push({ maindate, messages: [item] });
          }
        }
        return accumulator;
      }, []);
      setCurrMessages(messages);
      setAllMessages(groupedMessages);
    });

    return () => unsubscribe();
  }, [selectedData.id, setCurrMessages, setSelectedData]);

  useEffect(() => {
    if (currMessages && currMessages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [currMessages]);
  return (
    <div className={style.allMessagebody}>
      {allMessages &&
        allMessages.length !== 0 &&
        allMessages.map((chat, index) => {
          return (
            <div ref={ref} key={index}>
              <div className={style.groupMessageContainer}>
                <div className={style.groupedMessagesMaindate}>
                  <p>
                    {chat.maindate === new Date()
                      ? "Today"
                      : `${moment(chat.maindate).format("ll")}`}
                  </p>
                </div>
                <React.Fragment>
                  {chat.messages &&
                    chat.messages.length !== 0 &&
                    chat.messages.map((item, index) => {
                      const date =
                        new Date(
                          item.date.seconds * 1000 + item.date.nanoseconds / 1e6
                        ).toString() ||
                        new Date(
                          item.date._seconds * 1000 +
                            item.date._nanoseconds / 1e6
                        ).toString();
                      return (
                        <React.Fragment key={index}>
                          {item.usermessage === null ? (
                            <div className={style.senderMessageBox}>
                              <div className={style.messagebox}>
                                <div className={style.messageboxcontent}>
                                  {item.message &&
                                    item.message.text &&
                                    item.message.text.body && (
                                      <p>{item?.message?.text?.body}</p>
                                    )}

                                  {item.message && item.message.template && (
                                    <div className={style.templatebox}>
                                      <h6>Template Name :-</h6>
                                      <p>{item?.message?.template?.name}</p>
                                    </div>
                                  )}
                                </div>
                                <div className={style.timeandDate}>
                                  <p style={{ textAlign: "end" }}>
                                    {moment(date).format("LT")}
                                  </p>
                                  <div className={style.sendBox}>
                                    <img src={checkIcon} alt='' />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className={style.recevierbox}>
                                <div className={style.recevierMessageBox}>
                                  <div className={style.recevierboxcontent}>
                                    <p>{item.usermessage}</p>
                                  </div>
                                  <div className={style.timeandDate}>
                                    <p>{moment(date).format("LT")}</p>
                                  </div>
                                </div>
                              </div>
                              {item.message &&
                                item.message.text &&
                                item.message.text.body && (
                                  <div className={style.senderMessageBox}>
                                    <div className={style.messagebox}>
                                      <div className={style.messageboxcontent}>
                                        <p>{item.message.text.body}</p>
                                      </div>
                                      <div className={style.timeandDate}>
                                        <p style={{ textAlign: "end" }}>
                                          {moment(date).format("LT")}
                                        </p>
                                        <div className={style.sendBox}>
                                          <img src={checkIcon} alt='' />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MessageView;
