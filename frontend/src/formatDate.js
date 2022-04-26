export const formatDate = (string) => {
    
    var newDateOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit"
    }

    if (string === "") {
        return "-";
    } else {
        let date = new Date(string);
        var month = date.toLocaleString("en-GB", newDateOptions);
        return month;
    }
};