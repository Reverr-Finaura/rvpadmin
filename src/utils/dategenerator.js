export const dateGenerator = () => {
  const date = new Date();
  const newDate = date.toLocaleString("en-US", {
    day: "numeric",
    year: "numeric",
    month: "long",
  });

  return newDate;
};
