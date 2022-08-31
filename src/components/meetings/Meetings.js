import React from "react";
import { Pen, Steam, Trash } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { keyGen } from "../../utils/keyGen";
import { useDispatch } from "react-redux";
import { setDealMeetings } from "../../redux/createDealSlice";

const Meetings = () => {
  const [isAddMeetings, setIsAddMeetings] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDesc, setMeetingDesc] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [meetings, setMeetings] = useState("");
  const [selectedData, setSelectedData] = useState("");

  const dispatch = useDispatch();

  const onAddMeetingsHandler = () => {
    setIsAddMeetings(false);
    let newKey = keyGen();
    setMeetings([
      {
        id: newKey,
        interestedUser: [],
        meetingDetails: {
          date: meetingDate,
          time: meetingTime,
          description: meetingDesc,
          meetingLink: meetingLink,
        },
      },
      ...meetings,
    ]);
    setMeetingDate("");
    setMeetingTime("");
    setMeetingDesc("");
    setMeetingLink("");
  };

  const onSaveChangesHandler = () => {
    setMeetings([
      ...meetings,
      {
        id: selectedData.id,
        interestedUser: [],
        meetingDetails: {
          date: meetingDate,
          time: meetingTime,
          description: meetingDesc,
          meetingLink: meetingLink,
        },
      },
    ]);
    setIsAddMeetings(false);
    setIsEditable(false);
    setSelectedData("");
    setMeetingDate("");
    setMeetingTime("");
    setMeetingDesc("");
    setMeetingLink("");
  };

  const onEditClickHandler = (data) => {
    setMeetings(meetings.filter((filteredData) => filteredData.id !== data.id));
    setIsAddMeetings(true);
    setSelectedData(data);
    setMeetingDate(() => data.meetingDetails.meetingDate);
    setMeetingTime(() => data.meetingDetails.meetingTime);
    setMeetingDesc(() => data.meetingDetails.meetingDesc);
    setMeetingLink(() => data.meetingDetails.meetingLink);
    setIsEditable(true);
  };

  const onDeleteClickHandler = (data) => {
    setMeetings(meetings.filter((filteredData) => filteredData.id !== data.id));
  };

  useEffect(() => {
    dispatch(setDealMeetings(meetings));
  }, [meetings]);

  console.log(meetings);

  return (
    <form>
      <fieldset>
        <legend>Meeting Details</legend>
        {meetings.length
          ? meetings.map((data) => {
              console.log(data);
              return (
                <>
                  <h5 key={data.id} style={{ margin: 0 }}>
                    • {data.meetingDetails.date} {data.meetingDetails.time}
                    <Trash onClick={() => onDeleteClickHandler(data)} />
                    <Pen onClick={() => onEditClickHandler(data)} />
                  </h5>
                </>
              );
            })
          : null}
        {isAddMeetings ? (
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
            {isEditable ? (
              <button onClick={onSaveChangesHandler}>Save Changes</button>
            ) : (
              <button onClick={onAddMeetingsHandler}>Add</button>
            )}
          </>
        ) : (
          <button onClick={() => setIsAddMeetings(true)}>
            Schedule Meeting
          </button>
        )}
      </fieldset>
    </form>
  );
};

export default Meetings;
