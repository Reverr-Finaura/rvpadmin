import React from "react";
import { Pen, Steam, Trash } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { keyGen } from "../../utils/keyGen";
import { useDispatch, useSelector } from "react-redux";
import { setDealMeetings } from "../../redux/createDealSlice";
import { sendMeetingLink } from "../../emailjs/emailjs";
import {
  getUserFromDatabase,
  updateInvestorDetailsInDatabase,
  updateUserInDatabse,
} from "../../firebase/firebase";

const Meetings = (props) => {
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDesc, setMeetingDesc] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingDetails, setMeetingDetails] = useState(props.meetings);
  const [isScheduleMeeting, setIsScheduleMeeting] = useState(false);

  const dispatch = useDispatch();
  const selectedDeal = useSelector((state) => state.investorDeals.selectedDeal);
  const { interestedUsers, id, dealDetails } = selectedDeal;
  const { name } = dealDetails;

  const onScheduleMeetingHandler = async () => {
    setIsScheduleMeeting(false);
    setMeetingDetails({
      date: meetingDate,
      time: meetingTime,
      description: meetingDesc,
      meetingLink: meetingLink,
    });

    await updateInvestorDetailsInDatabase(id, {
      ...selectedDeal,
      meetingDetails,
    });

    for (let i = 0; i < interestedUsers.length; i++) {
      const results = await getUserFromDatabase(interestedUsers[i]);
      const { email, calls } = results;
      // await sendMeetingLink(meetingLink, email);
      await updateUserInDatabse(interestedUsers[i], {
        ...results,
        calls: [
          ...calls,
          {
            meetingDate,
            meetingTime,
            meetingDesc,
            meetingLink,
            dealUid: id,
            dealName: name,
          },
        ],
      });
    }
    setMeetingDate("");
    setMeetingTime("");
    setMeetingDesc("");
    setMeetingLink("");
  };

  useEffect(() => {
    dispatch(setDealMeetings(meetingDetails));
  }, [meetingDetails]);

  return (
    <form>
      <fieldset>
        <legend>Meeting Details</legend>
        {isScheduleMeeting ? (
          <>
            <label for="meeting-date">
              <b>Meeting Date:</b>
            </label>
            <input
              id="meeting-date"
              type="date"
              onChange={(e) => setMeetingDate(e.target.value)}
              placeholder="Enter meeting date"
            />
            <br />
            <label for="meeting-time">
              <b>Meeting Time:</b>
            </label>
            <input
              id="meeting-time"
              type="time"
              onChange={(e) => setMeetingTime(e.target.value)}
            />
            <textarea
              rows="5"
              onChange={(e) => setMeetingDesc(e.target.value)}
              placeholder="Meeting Description"
            />
            <input
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Meeting Link"
            />

            <button onClick={onScheduleMeetingHandler}>Schedule Meeting</button>
          </>
        ) : (
          <button onClick={() => setIsScheduleMeeting(true)}>
            Schedule Meeting
          </button>
        )}
      </fieldset>
    </form>
  );
};

export default Meetings;
