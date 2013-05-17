var http = require('https');

var calendar = {
  id: 'YOUR_ID_HERE%40group.calendar.google.com',
  token: null /* PUT YOUR PRIVATE TOKEN HERE */
};

var url = ['https://www.google.com/calendar/feeds/' + calendar.id + '/'];
url.push(calendar.token ? 'private-' + calendar.token : 'public');
url.push('/full?alt=json&orderby=starttime&sortorder=ascending&singleevents=true&futureevents=true&max-results=10');
url = url.join('');
function fetchCalendarData() {
  http.get(url, function(res) {
    if (res.statusCode == 200) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        body = JSON.parse(body);
        var feed = body.feed;
        if (feed) {
          var data = {
            title: feed.title['$t'],
            entries: []
          };
          for (var i in feed.entry) {
            var e = feed.entry[i];
            data.entries.push({
              title: e.title['$t'],
              when: e['gd$when']
            });
          }
          send_event('gcal', data);
        }
      });
    } else {
      console.log('Google Calendar status code: ' + res.statusCode);
    }
  }).on('error', function(err) {
    console.log('Error reading from Google Calendar: ', err);
  });
}

setInterval(fetchCalendarData, 15 * 60 * 1000);
fetchCalendarData();
