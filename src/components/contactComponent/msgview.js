import React, { useEffect, useRef } from "react";
import { database } from "../../firebase/firebase";
import "./contactComp.css";
import "react-toggle/style.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import moment from "moment";

const MsgView = ({
  currMessages,
  setCurrMessages,
  setSelectedData,
  selectedData,
}) => {
  // const Messagesref = collection(database, "WhatsappMessages");
  const ref = useRef(null);
  useEffect(() => {
    if (currMessages && currMessages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [currMessages]);

  useEffect(() => {
    const messageQuery = query(
      collection(database, "WhatsappMessages"),
      where("number", "==", selectedData.id)
    );
    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      var msgs = [];
      snapshot.forEach((doc) => {
        msgs = doc.data().messages;
        setSelectedData({ ...doc.data(), id: doc.id });
      });
      setCurrMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedData.id, setCurrMessages, setSelectedData]);

  return (
    <div className='messagelist'>
      {currMessages &&
        currMessages.length !== 0 &&
        currMessages.map((item, index) => {
          const date =
            new Date(
              item.date.seconds * 1000 + item.date.nanoseconds / 1e6
            ).toString() ||
            new Date(
              item.date._seconds * 1000 + item.date._nanoseconds / 1e6
            ).toString();
          return (
            <div ref={ref} key={index}>
              {item.usermessage === null ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div
                    className='message'
                    style={{ backgroundColor: "rgba(255, 255, 0, 0.05)" }}
                  >
                    {item.message &&
                      item.message.text &&
                      item.message.text.body && (
                        <p style={{ padding: "5px", margin: 0 }}>
                          {item?.message?.text?.body}
                        </p>
                      )}

                    {item.message && item.message.template && (
                      <div className='template'>
                        <h5>Template Name :-</h5>
                        <p style={{ padding: "5px", margin: 0 }}>
                          {item?.message?.template?.name}
                        </p>
                      </div>
                    )}
                    <p
                      style={{
                        padding: "5px",
                        margin: 0,
                        fontSize: "12px",
                        color: "green",
                      }}
                    >
                      {moment(date).format("LLL")}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div className='message'>
                      <p style={{ padding: "5px", margin: 0 }}>
                        {item.usermessage}
                      </p>
                    </div>
                  </div>
                  {item.message &&
                    item.message.text &&
                    item.message.text.body && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                        }}
                      >
                        <div
                          className='message'
                          style={{
                            backgroundColor: "rgba(255, 255, 0, 0.05)",
                          }}
                        >
                          <p style={{ padding: "5px", margin: 0 }}>
                            {item.message.text.body}
                          </p>
                          <p
                            style={{
                              padding: "5px",
                              margin: 0,
                              fontSize: "12px",
                              color: "green",
                            }}
                          >
                            {moment(date).format("LLL")}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MsgView;
