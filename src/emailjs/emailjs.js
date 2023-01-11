import emailjs from "@emailjs/browser";

export const sendMeetingLink = (meetinlink, email) => {
  let templateParams = {
    to_email: email,
    meeting_link: meetinlink,
  };

  return emailjs.send(
    "service_lfmmz8k",
    "template_6ggk1mh",
    templateParams,
    "user_FR6AulWQMZry87FBzhKNu"
  );
};
