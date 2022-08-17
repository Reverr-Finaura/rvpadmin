export const dateGenerator = () => {
  const date = new Date();
  const newDate = date.toLocaleString("en-US", {
    day: "numeric",
    year: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return newDate;
};
