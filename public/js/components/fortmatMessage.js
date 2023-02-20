const moment = require('moment');

function FormatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('MMM/DD/YYYY h:mm a')
    };
}

module.exports = FormatMessage;