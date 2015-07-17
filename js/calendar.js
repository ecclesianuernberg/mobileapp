
function event_calendar(div, url) {
    this.div = div;
    if(typeof(url) == "undefined"){
        this._url = "http://www.die-duerrs-im-web.de/ecclesiapp/kalender_test.php"
    }else{
        this._url = url;
    }
    this._next_calendar_token = "";//Token für Google API, "sichert" den Stand der angezeigten Events
    this._calendar_event_array = [];
    this.showCalendar();
    this.akt_calendar_date = div.data("jqm-calendar").settings.date;
    this.first_loaded_date = new Date(this.akt_calendar_date.getFullYear(), this.akt_calendar_date.getMonth(), -8, 0, 0, 0, 0);;
    this.last_loaded_date = "";
    this.request = false;
    this._get_events(this.first_loaded_date);
}
event_calendar.prototype._get_events = function (timeMin, timeMax) {
    if (this.request == false) {
        this.request = true;
        calendar_instance = this;
        jQuery.ajax({
            url: this._url,
            data: {
                request: "events", timeMin: timeMin, timeMax: timeMax
            },
            dataType: "json"
        }).done(function (server_events) { calendar_instance.request = false; calendar_instance._parse_events(server_events); });
    }
}
event_calendar.prototype._parse_events = function (server_events) {
    var eventkeys = Object.keys(server_events.events);
    if (eventkeys.length == 1) {
        this.last_loaded_date = new Date(8640000000000000);//es gibt keine aktuelleren Events
        return;
    }
    for (var i = 0; i < eventkeys.length; i++) {
        event = server_events.events[eventkeys[i]];
        if (this._id_not_known(eventkeys[i]) && event.begin != null) {
            //Speichern der Server-Events
            this._calendar_event_array.push({
                "id": eventkeys[i],
                "summary": event.summary,
                "begin": new Date(event.begin),
                "end": new Date(event.end),
                "url": typeof (event.eventpage) != "undefined" ? "#eventpage" : event.url
            });
            //Überschreiben wenn Event älter als die gespeicherten Events sind
            if (new Date(event.begin) > this.last_loaded_date) {
                this.last_loaded_date = new Date(event.begin);
            }
            if (new Date(event.begin) < this.first_loaded_date) {
                this.first_loaded_date = new Date(event.begin);
            }
        }
    }
    //Events wurden gespeichert, jetzt überprüfen ob der Monat + 1 Woche bereits komplett geladen wurde
    this.div.trigger('refresh');
}
event_calendar.prototype._id_not_known = function (id) {
    for (var i = 0; i < this._calendar_event_array.length; i++) {
        if (this._calendar_event_array[i].id == id) {
            return false;
        }
    }
    return true;
}
event_calendar.prototype.showCalendar = function () {
    var self = this;
    this.div.jqmCalendar({
        events: this._calendar_event_array,
        months: ["Januar","Februar","M&auml;rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
        days: ["So","Mo","Di","Mi","Do","Fr","Sa"],
        startOfWeek: 1
    });
    this.div.bind("change", function (event, data) {
        var begin = new Date(data.getFullYear(), data.getMonth(), -8, 0, 0, 0, 0);
        var end = new Date(data.getFullYear(), data.getMonth(), 38, 23, 59, 59, 0);
        if (end > self.last_loaded_date) {
            self._get_events(self.last_loaded_date);
        } else {
            if (begin < self.first_loaded_date) {
                self._get_events(begin,self.first_loaded_date);
                self.first_loaded_date = begin;
            }
        }
    });
}