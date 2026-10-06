function formatIST(date) {
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace("T", " ");
}

const date = new Date()

console.log(formatIST(date))