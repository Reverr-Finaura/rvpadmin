import React, { useEffect, useRef } from "react";
import { database } from "../../firebase/firebase";
import "./contactComp.css";
import "react-toggle/style.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const MsgView = ({
  currMessages,
  setCurrMessages,
  setSelectedData,
  selectedData,
}) => {
  console.log(currMessages);
  const Messagesref = collection(database, "WhatsappMessages");
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
      Messagesref,
      where("number", "==", selectedData.id)
    );
    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      // console.log("new msg", );
      var msgs = [];
      snapshot.forEach((doc) => {
        console.log(doc.data());
        msgs = doc.data().messages;

        setSelectedData({ ...doc.data(), id: doc.id });
      });
      // console.log("msg",msgs)
      setCurrMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='messagelist'>
      {currMessages &&
        currMessages.length !== 0 &&
        currMessages.map((item, index) => {
          return (
            <div ref={ref} key={index}>
              {item.usermessage === null ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div className='message' style={{ backgroundColor: "grey" }}>
                    {item.message &&
                      item.message.text &&
                      item.message.text.body && (
                        <p>{item?.message?.text?.body}</p>
                      )}

                    {item.message && item.message.template && (
                      <div className='template'>
                        <h5>Template Name :-</h5>
                        <p>{item?.message?.template?.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div className='message'>
                      <p>{item.usermessage}</p>
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
                          style={{ backgroundColor: "grey" }}
                        >
                          <p>{item.message.text.body}</p>
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MsgView;
