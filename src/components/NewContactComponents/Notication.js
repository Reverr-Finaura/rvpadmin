import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { database } from "../../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import moment from "moment";

const Notication = ({ handleClose }) => {
  const [notifydata, setNotifyData] = useState([]);
  let dummy = "ashutoshagent@gmail.com";
  const Agentref = collection(database, "Agents");
  useEffect(() => {
    const agentQuery = query(Agentref, where("email", "==", dummy));
    const unsubscribe = onSnapshot(agentQuery, (snapshot) => {
      var msgs = [];
      snapshot.forEach((doc) => {
        msgs = doc.data().notification;
        setNotifyData(msgs);
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={style.notificationbox}>
      <div className={style.notificationheader}>
        <h2>Notification</h2>
        <button onClick={handleClose}>Close</button>
      </div>
      <div className={style.notificationlist}>
        {notifydata.map((notify) => {
          const date = new Date(
            notify.timestamp.seconds * 1000 + notify.timestamp.nanoseconds / 1e6
          ).toString();
          return (
            <div className={style.notifybox}>
              <p className={style.info}>{notify.text}</p>
              <p className={style.info}>{moment(date).format("LLL")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notication;
