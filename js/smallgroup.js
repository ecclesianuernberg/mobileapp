function show_small_groups(div) {
    div = $("#small_groups_posts");
    for (var i = 0; i < small_groups.length; i++) {
        var small_group = small_groups[i];
        console.log(small_group);
        /*
        Small_groups Karten:
        Aufbau:
        Bild falls vorhanden
        daneben Informationen
        */
        var card = $("<div class='small_group' id='small_group_" + i + "'>");
        console.log(small_group.avatar);
        if (typeof (small_group.avatar) != "undefined" && small_group.avatar != "" && small_group.avatar != null) {
            $("<div><img src='https://meine.ecclesianuernberg.de/static/uploaded_images/" + small_group.avatar + ".jpg'>" + small_group.name + "</div>").appendTo(card);
        }
        else {
            $("<div>" + small_group.name + "</div>").appendTo(card);
        }
        var table = $("<table>");
        table.appendTo(card);
        if (typeof (small_group.description) != "undefined" && small_group.description != "") {
            table.append("<tr><td>Was?</td><td>" + small_group.description + "</td></tr>");
        }
        if (typeof (small_group.zielgruppe) != "undefined" && small_group.zielgruppe != "") {
            table.append("<tr><td>Wer?</td><td>" + small_group.zielgruppe + "</td></tr>");
        }
        if (typeof (small_group.treffzeit) != "undefined" && small_group.treffzeit != "") {
            table.append("<tr><td>Wann?</td><td>" + small_group.treffzeit + "</td></tr>");
        }
        if (typeof (small_group.treffpunkt) != "undefined" && small_group.treffpunkt != "") {
            table.append("<tr><td>Wo?</td><td>" + small_group.treffpunkt + "</td></tr>");
        }
        card.appendTo(div);
    }
    
}
var small_groups;
function get_small_groups(div) {
    jQuery.ajax({
        url: "http://www.die-duerrs-im-web.de/ecclesiapp/kalender_test.php?small_group=1",
        data: { request: "small_group" },
        dataType: "json"
    }).done(function (data) { small_groups = data; show_small_groups(); });
}