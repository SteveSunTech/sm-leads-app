const someDaysLater = (days) => {
  const today = new Date();
  today.setDate(today.getDate() + Number(days));
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
};

module.exports = someDaysLater(days);
