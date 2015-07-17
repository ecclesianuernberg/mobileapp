
function get_menuelist(id,listid){
    //Anhand des Status, Spracheinstellung usw. wird das Menü angezeigt.
    var tmp = [];
    tmp[0] = {};
    jQuery.ajax({
        url: "http://www.die-duerrs-im-web.de/ecclesiapp/source.php",
        data: {request:"menu"},
        dataType: "json"
    }).done(function(menu){register_menu(id,listid,menu);});
    return tmp;
}
function register_menu(id,listid,menu_items)
{
    for(var i = 0; i < menu_items.length; i++)
    {
        var item = menu_items[i];
        jQuery("<li><a href='"+item.subpage+"'>"+item.name+"</a></li>").appendTo(listid);
    }
    jQuery( "body>[data-role='panel']" ).panel();
    jQuery( "body > [data-role='panel'] [data-role='listview']" ).listview();
}
function show_menu(id,listid)
{
    get_menuelist(id,listid);
}