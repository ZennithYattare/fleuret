export const formatDate = (string) => {
    if (string === "") {
        return "-";
    } else {
        let date = new Date(string);
        var month = date.toLocaleString("default", { month: "short" });
        return month + ". " + date.getDate() + ", " + date.getFullYear();
    }
};