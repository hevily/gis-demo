/**
 * Created by BHXZ on 2017/7/9.
 */
var vectorLayer=null;
var vectorSource=null;
var markers = null;
var map=null;
const l_lat = 66370.5018725;
const l_lng = 71578.43156138462;
$(function () {
    //GIS构建地图
    GisEvent();

})

//GIS构建地图
function GisEvent() {

    $('#map').unbind().bind('mousewheel',function(){
        return false;
    });

    /**
     * Create an overlay to anchor the popup to the map.
     */

    var controls = new Array();

    var mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        coordinateFormat: ol.coordinate.createStringXY(5),//保留5位小数
        undefinedHTML: ' '
    });
    controls.push(mousePositionControl);

    //复位控件
    var zoomToExtentControl = new ol.control.ZoomToExtent({
        extent: [-7800000.40459,-17685864.40459, -18571955.55842, -17571955.55842]
    });

    controls.push(zoomToExtentControl);
    var view = new ol.View({

        projection:"EPSG:3857", //投影，默认的投影是球墨卡托（EPSG：3857),以米为单位
        center: ol.proj.transform([-118.34, -82.8], "EPSG:4326","EPSG:3857"),
        zoom: 5, //默认级别
        minZoom: 5, //可用的缩放级别
        maxZoom: 8,//可用的缩放级别
        // extent:[-16505864.40459,-18255864.40459, -12571955.55842, -15571955.55842], //左 下 右 上
        extent:[-17685864.40459,-19685864.40459, -10571955.55842, -15571955.55842],
    });
    map = new ol.Map({

        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: '../tile/{z}/{x}/{-y}.png',
                })
            })
        ],
        target: 'map',
        controls: ol.control.defaults({
            attribution: false,
        }).extend(controls),
        view: view
    });

   // markers = markerBlock();
   // map.addLayer(markers);


    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /**
     * Add a click handler to the map to render the popup.
     */

    var overlay = new ol.Overlay({
        element: container,
        positioning: 'bottom-center',
        autoPan: true,
        autoPanAnimation: {
            duration: 250   //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度.
        },
        stopEvent: false
    });
}



    /*map.on('click',function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });
        if(feature !== undefined){
            var lstr = '';
            var coordinate = evt.coordinate;
            $.getJSON('http://'+location.host+'/Gis/Index/getMarkerJson',{'id':feature.getProperties().id}, function (data){
                if(data !== ''){
                    lstr += '<div id="infoWindow">';
                    lstr += '所属舰队&nbsp:&nbsp&nbsp<span>' + data.fleet_name + '</span><br/>';
                    lstr += '所属基地&nbsp:&nbsp&nbsp<span>' + data.base_name + '</span><br/>';
                    lstr += '所属船名&nbsp:&nbsp&nbsp<span>' + data.ship_name + '</span><br/>';
                    lstr += "<hr/>";
                    lstr += "<div class='popup-url'><a data-id='file' onclick='ModuleMap(this)' href='#'>档案详情</a><a data-id='assess' onclick='ModuleMap(this)' class='evaluation' href='#'>能力评估</a></div> "
                    lstr += "</div>";

                    content.innerHTML = lstr;
                    overlay.setPosition(coordinate);
                    map.addOverlay(overlay);

                    closer.onclick = function() {
                        overlay.setPosition(undefined);
                        closer.blur();
                        return false;
                    };
                }
                evt.stopPropagation();
                evt.preventDefault();
            });
        }
    })

}

function markerBlock(){


    //准备图层
    if(!sinadot_isValidObject(vectorLayer)){

        vectorLayer = new ol.layer.Vector();
    }


    //准备资源
    if(!sinadot_isValidObject(vectorSource)){

        vectorSource = new ol.source.Vector();
    }

    //添加marker
    $.getJSON('http://'+location.host+'/Gis/Index/getGisJson', function(data){

        var iconFeatureArray= vectorSource.getFeatures();

        if(iconFeatureArray.length>0){

            for(var i=0;i<iconFeatureArray.length;i++){

                vectorSource.removeFeature(iconFeatureArray[i]);
            }

        }

        if(data.length>0){

            for(var i=0; i<data.length;i++){
                var coordinate = [data[i].lat,data[i].lng];
                // var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                //     coordinate, 'EPSG:3857', 'EPSG:4326'));
                coordinate = millerXY(coordinate);

                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
                    id:data[i].id,
                });

                iconFeatureArray[i]=iconFeature;

                var iconStyle = new ol.style.Style({

                    image:new ol.style.Icon({
                       src:'http://'+location.host+'/static/js/gis/popup.png'
                    }),
                    // image: new ol.style.Circle({
                    //     radius:10,
                    //     opacity: 0.5,
                    //     stroke: new ol.style.Stroke({
                    //         color: 'rgba(255,255,255,0.8)'
                    //     }),
                    //     fill: new ol.style.Fill({
                    //         color: 'rgba(67,142,219,0.8)'
                    //     })
                    // }),

                    zIndex: 100000

                });


                iconFeature.setStyle(iconStyle);

                vectorSource.addFeature(iconFeature);

            }

            vectorLayer.setSource(vectorSource);

        }
    });

    return vectorLayer;

}
**/

/**
 * 气泡的跳转
 */
 
 /*
function ModuleMap(obj) {
    var fleet_name = $(obj).parent().parent().find('span').first().html();
    var base_name = $(obj).parent().parent().find('span').eq('1').html();
    var ship_name = $(obj).parent().parent().find('span').last().html();
    var type = $(obj).attr('data-id');

    localStorage.setItem('fleet_name',fleet_name);
    localStorage.setItem('base_name',base_name);
    localStorage.setItem('ship_name',ship_name);

    if(type === 'file'){
        var url="/knowledge/file/index.html";
        var m_id = 118;
        loadModule(url,m_id);
    }else if (type === 'assess'){
        var url="/assess/assess/index.html";
        var m_id = 45;
        loadModule(url,m_id);
    }


}

function loadModule(url,m_id) {
    var body_height = document.body.clientHeight;
    var menubar_height = $(".menubar",top.document).outerHeight(true);
    var height = body_height - menubar_height;

    $("#menu li a",top.document).removeClass('active');
    $("#menu li ",top.document).removeClass('active');

    $("#menu li a[m_id="+m_id+"]",top.document).parent().parent().siblings('a').addClass('active');
    $("#menu li a[m_id="+m_id+"]",top.document).addClass('active');

    $('#main-container',top.document).height(height);

    $('#center_frame',top.document).attr('height',height+5);
    $('#center_frame',top.document).attr('src',url);

    $('#main',top.document).removeClass('center-layout').addClass('main-layout');
    $('#main-container',top.document).show();
}
*/
/**
 * zuo biao de zhuan huan
 * */
 
 /*
function millerXY(ll) {
    var x =  -20027724.40317 + ll[0] * l_lat  ;
    var y =  -20003264.55412 + ll[1] * l_lng  ;
    var result = [x,y];
    return result;
}

*/

