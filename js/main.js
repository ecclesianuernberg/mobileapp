function getUser()
{
    //Speicherüberprüfung, wenn nicht Lokal, Abfrage starten.
    if (1) {
        return con_checkID();
    }
}
function server_checkID()
{
    //Beispiel Nutzer
    //TODO: Ajax-Call, mit Verschlüsselten Login und einmaliger Übertragung der Benutzerrechte. (Pro Verwendung mit Inet-Anschluss)
    var tmp = {};
    tmp.name = "Jonas";
    tmp.nachname = "Dürr";
    tmp.id = 2524;
    tmp.debug = 1;
    tmp.status = 2; //1 = Freund, 2 = Bruder, 3 = Leiter
    return tmp;
}
function get_posts(div)
{
    jQuery.ajax({
        url: "http://www.die-duerrs-im-web.de/ecclesiapp/source.php",
        data: {request:"mainpage"},
        dataType: "json"
    }).done(function(posts){show_posts(div,posts)});
}
function show_posts(div,posts)
{
    if (typeof(posts) == "undefined") {
        get_posts(div);
    }else{
        var html_posts = "";
        for(var i = 0; i < posts.length; i++){
            //titel, msg, picture
            var post = posts[i];
            console.log(post);
            html_posts = "<div data-role='collapsible' data-collapsed='false' data-collapsed-icon='carat-d' data-expanded-icon='carat-u'><h4>"+post.titel+"</h4><p>"+post.msg+"</p><img src='http://www.die-duerrs-im-web.de/ecclesiapp/posts/"+post.picture+"' class='picture'></div>";
            jQuery(html_posts).appendTo(div);
            jQuery(div[0].lastChild).collapsible();
        }
    }
}
function get_sermons(serien_div,predigt_table)
{
    console.log(predigt_table);
    jQuery.ajax({
        url: "http://www.die-duerrs-im-web.de/ecclesiapp/source.php",
        data: {request:"sermons"},
        dataType: "json"
    }).done(function(posts){show_sermons(serien_div,predigt_table,posts)});
}
var min_sermon_icon_size = 150;
function show_sermons(serien_div,predigt_table,posts)
{
    if (typeof(posts) == "undefined") {
        get_sermons(serien_div,predigt_table);
    }else{
        var sermons_list = "";
        for(var i = 0;typeof(posts[i]) != "undefined";i++){
            //Seriensicht
            sermons_list = "";
            sermons_list += "<a class='sermon_list_element' href=''>";
            sermons_list += "<img class='sermon_pic' src='http://www.die-duerrs-im-web.de/ecclesiapp/sermons/"+posts[i].series_image+"'><div>";
            sermons_list += posts[i].series_titel+"";
            sermons_list += "</div></a>";
            sermons_list = $(sermons_list);
            $(sermons_list).appendTo(serien_div);
            sermons_list.data(posts[i]);
            sermons_list.on("click",function(event){show_series_view($(this).data());});
            //Predigtsicht
            /*
             *Jede Serienelement wird der Tabelle hinzugefügt
             */
            append_series_parts(predigt_table,posts[i].series_parts,posts[i].series_titel);
        }
    }
}
function append_series_parts(table,series_parts,series_titel)
{
    var sermon_entry = "";
    for(var z = 0; typeof(series_parts[z]) != "undefined"; z++){
        var sermon = series_parts[z];
        var nr = z + 1;
        sermon_date = sermon.date ? sermon.date : "";
        sermon_pastor = sermon.pastor ? sermon.pastor : "";
        sermon_titel = sermon.titel ? sermon.titel + " Teil " + nr : series_titel + " Teil " + nr;
        sermon_entry += "<tr>";
        sermon_entry += "<th>"+sermon_date+"</th>";
        sermon_entry += "<td>"+sermon_titel+"</td>";
        sermon_entry += "<td>"+sermon_pastor+"</td>";
        sermon_entry += "<td><a href='#'>Download</a></td>"
        sermon_entry += "</tr>"
    }
    table.append(sermon_entry);
}
function show_series_view(post)
{
    //Bearbeiten der Predigtserien-seite
    $("#series_titel").html(post.series_titel);
    var series_parts = post.series_parts;
    $("#series_table_body").html("");
    console.log(post.series_titel);
    append_series_parts($("#series_table_body"),series_parts,post.series_titel)
    $.mobile.changePage("#seriespage_content");
}
function convert_date_string(date_string,time_string)
{
    //date_array [0] = Tag, [1] = Monat, [2] = Jahr
    var date_array = date_string.split(".");
    if (typeof(time_string) == "undefined") {
        return new Date(date_array[2],date_array[1],date_array[0]);
    }else{
        //time array [0] = Stunde [1] = Minute
        var time_array = time_string.split(":");    
        return new Date(date_array[2],date_array[1],date_array[0],time_array[0],time_array[1],0);
    }
}
function testfunc() {
    //testdiv
    PushManager();
}
function PushManager() {
    //Test ob schon eine ID vergeben wurde
    if (!window.localStorage['gcmid']) {
        pushNotification = window.plugins.pushNotification;
        pushNotification.register(successHandler, errorHandler, { "senderID": "71004315558", "ecb": "onNotificationGCM" });
    } else {
        alert(window.localStorage['gcmid']);
    }
}
var pushNotification;
function successHandler(result) {
    alert('Callback Success! Result = ' + result);
}
function errorHandler(error) {
    alert(error);
}
function onNotificationGCM(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                register_id(e.regid);
            }
            break;
 
        case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
        case 'error':
            alert('GCM error = '+e.msg);
            break;
 
        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}
function register_id(sid) {
    window.localStorage['gcmid'] = sid;
    jQuery.ajax({
        url: "http://www.die-duerrs-im-web.de/ecclesiapp/kalender_test.php",
        data: { "id": sid },
        dataType: "json",
        success: function (data) {
            alert(data)
        },
        failure: function (data) {
            window.localStorage['gcmid'] = null;
            alert(data)
        }
    });
}