const formatDateTime = (dateString?: string) => {
  if (dateString) {
    const date = new Date(dateString).toLocaleDateString("fr-FR");
    const time = new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${date} à ${time}`;
  }
};

export default formatDateTime;

// UTILISATION

// date: formatDateTime(notif.createdTime)