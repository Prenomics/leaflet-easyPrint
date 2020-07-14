import{Control as t,DomUtil as e,DomEvent as i}from"leaflet";const n=require("dom-to-image"),a=require("file-saver");t.EasyPrint=t.extend({options:{title:"Print map",position:"topleft",sizeModes:["Current"],filename:"map",exportOnly:!1,hidden:!1,tileWait:500,hideControlContainer:!0,hideClasses:[],customWindowTitle:window.document.title,spinnerBgCOlor:"#0DC5C1",customSpinnerClass:"epLoader",defaultSizeTitles:{Current:"Current Size",A4Landscape:"A4 Landscape",A4Portrait:"A4 Portrait"}},onAdd:function(){this.mapContainer=this._map.getContainer(),this.options.sizeModes=this.options.sizeModes.map((function(t){return"Current"===t?{name:this.options.defaultSizeTitles.Current,className:"CurrentSize"}:"A4Landscape"===t?{height:this._a4PageSize.height,width:this._a4PageSize.width,name:this.options.defaultSizeTitles.A4Landscape,className:"A4Landscape page"}:"A4Portrait"===t?{height:this._a4PageSize.width,width:this._a4PageSize.height,name:this.options.defaultSizeTitles.A4Portrait,className:"A4Portrait page"}:t}),this);var t=e.create("div","leaflet-control-easyPrint leaflet-bar leaflet-control");if(!this.options.hidden){i.addListener(t,"mouseover",this._togglePageSizeButtons,this),i.addListener(t,"mouseout",this._togglePageSizeButtons,this);var n="leaflet-control-easyPrint-button";this.options.exportOnly&&(n+="-export"),this.link=e.create("a",n,t),this.link.id="leafletEasyPrint",this.link.title=this.options.title,this.holder=e.create("ul","easyPrintHolder",t),this.options.sizeModes.forEach((function(t){var n=e.create("li","easyPrintSizeMode",this.holder);n.title=t.name;e.create("a",t.className,n);i.addListener(n,"click",this.printMap,this)}),this),i.disableClickPropagation(t)}return t},printMap:function(t,e){e&&(this.options.filename=e),this.options.exportOnly||(this._page=window.open("","_blank","toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10, top=10, width=200, height=250, visible=none"),this._page.document.write(this._createSpinner(this.options.customWindowTitle,this.options.customSpinnerClass,this.options.spinnerBgCOlor))),this.originalState={mapWidth:this.mapContainer.style.width,widthWasAuto:!1,widthWasPercentage:!1,mapHeight:this.mapContainer.style.height,zoom:this._map.getZoom(),center:this._map.getCenter()},"auto"===this.originalState.mapWidth?(this.originalState.mapWidth=this._map.getSize().x+"px",this.originalState.widthWasAuto=!0):this.originalState.mapWidth.includes("%")&&(this.originalState.percentageWidth=this.originalState.mapWidth,this.originalState.widthWasPercentage=!0,this.originalState.mapWidth=this._map.getSize().x+"px"),this._map.fire("easyPrint-start",{event:t}),this.options.hidden||this._togglePageSizeButtons({type:null}),this.options.hideControlContainer&&this._toggleControls(),this.options.hideClasses&&this._toggleClasses(this.options.hideClasses);var i="string"!=typeof t?t.target.className:t;if("CurrentSize"===i)return this._printOpertion(i);this.outerContainer=this._createOuterContainer(this.mapContainer),this.originalState.widthWasAuto&&(this.outerContainer.style.width=this.originalState.mapWidth),this._createImagePlaceholder(i)},_createImagePlaceholder:function(t){var e=this;n.toPng(this.mapContainer,{width:parseInt(this.originalState.mapWidth.replace("px")),height:parseInt(this.originalState.mapHeight.replace("px"))}).then((function(i){e.blankDiv=document.createElement("div");var n=e.blankDiv;e.outerContainer.parentElement.insertBefore(n,e.outerContainer),n.className="epHolder",n.style.backgroundImage='url("'+i+'")',n.style.position="absolute",n.style.zIndex=1011,n.style.display="initial",n.style.width=e.originalState.mapWidth,n.style.height=e.originalState.mapHeight,e._resizeAndPrintMap(t)})).catch((function(t){console.error("oops, something went wrong!",t)}))},_resizeAndPrintMap:function(t){this.outerContainer.style.opacity=0;var e=this.options.sizeModes.filter((function(e){return e.className.indexOf(t)>-1}));e=e[0],this.mapContainer.style.width=e.width+"px",this.mapContainer.style.height=e.height+"px",this.mapContainer.style.width>this.mapContainer.style.height?this.orientation="portrait":this.orientation="landscape",this._map.setView(this.originalState.center),this._map.setZoom(this.originalState.zoom),this._map.invalidateSize(),this.options.tileLayer?this._pausePrint(t):this._printOpertion(t)},_pausePrint:function(t){var e=this,i=setInterval((function(){e.options.tileLayer.isLoading()||(clearInterval(i),e._printOpertion(t))}),e.options.tileWait)},_printOpertion:function(t){var e=this,i=this.mapContainer.style.width;(this.originalState.widthWasAuto&&"CurrentSize"===t||this.originalState.widthWasPercentage&&"CurrentSize"===t)&&(i=this.originalState.mapWidth),n.toPng(e.mapContainer,{width:parseInt(i),height:parseInt(e.mapContainer.style.height.replace("px"))}).then((function(t){var i=e._dataURItoBlob(t);e.options.exportOnly?a.saveAs(i,e.options.filename+".png"):e._sendToBrowserPrint(t,e.orientation),e._toggleControls(!0),e._toggleClasses(e.options.hideClasses,!0),e.outerContainer&&(e.originalState.widthWasAuto?e.mapContainer.style.width="auto":e.originalState.widthWasPercentage?e.mapContainer.style.width=e.originalState.percentageWidth:e.mapContainer.style.width=e.originalState.mapWidth,e.mapContainer.style.height=e.originalState.mapHeight,e._removeOuterContainer(e.mapContainer,e.outerContainer,e.blankDiv),e._map.invalidateSize(),e._map.setView(e.originalState.center),e._map.setZoom(e.originalState.zoom)),e._map.fire("easyPrint-finished")})).catch((function(t){console.error("Print operation failed",t)}))},_sendToBrowserPrint:function(t,e){this._page.resizeTo(600,800);var i=this._createNewWindow(t,e,this);this._page.document.body.innerHTML="",this._page.document.write(i),this._page.document.close()},_createSpinner:function(t,e,i){return"<html><head><title>"+t+"</title></head><body><style>\n      body{\n        background: "+i+";\n      }\n      .epLoader,\n      .epLoader:before,\n      .epLoader:after {\n        border-radius: 50%;\n      }\n      .epLoader {\n        color: #ffffff;\n        font-size: 11px;\n        text-indent: -99999em;\n        margin: 55px auto;\n        position: relative;\n        width: 10em;\n        height: 10em;\n        box-shadow: inset 0 0 0 1em;\n        -webkit-transform: translateZ(0);\n        -ms-transform: translateZ(0);\n        transform: translateZ(0);\n      }\n      .epLoader:before,\n      .epLoader:after {\n        position: absolute;\n        content: '';\n      }\n      .epLoader:before {\n        width: 5.2em;\n        height: 10.2em;\n        background: #0dc5c1;\n        border-radius: 10.2em 0 0 10.2em;\n        top: -0.1em;\n        left: -0.1em;\n        -webkit-transform-origin: 5.2em 5.1em;\n        transform-origin: 5.2em 5.1em;\n        -webkit-animation: load2 2s infinite ease 1.5s;\n        animation: load2 2s infinite ease 1.5s;\n      }\n      .epLoader:after {\n        width: 5.2em;\n        height: 10.2em;\n        background: #0dc5c1;\n        border-radius: 0 10.2em 10.2em 0;\n        top: -0.1em;\n        left: 5.1em;\n        -webkit-transform-origin: 0px 5.1em;\n        transform-origin: 0px 5.1em;\n        -webkit-animation: load2 2s infinite ease;\n        animation: load2 2s infinite ease;\n      }\n      @-webkit-keyframes load2 {\n        0% {\n          -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n        }\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes load2 {\n        0% {\n          -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n        }\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      </style>\n    <div class=\""+e+'">Loading...</div></body></html>'},_createNewWindow:function(t,e){return"<html><head>\n        <style>@media print {\n          img { max-width: 98%!important; max-height: 98%!important; }\n          @page { size: "+e+";}}\n        </style>\n        <script>function step1(){\n        setTimeout('step2()', 10);}\n        function step2(){window.print();window.close()}\n        <\/script></head><body onload='step1()'>\n        <img alt=\""+t+'" src="'+t+'" style="display:block; margin:auto;"></body></html>'},_createOuterContainer:function(t){var e=document.createElement("div");return t.parentNode.insertBefore(e,t),t.parentNode.removeChild(t),e.appendChild(t),e.style.width=t.style.width,e.style.height=t.style.height,e.style.display="inline-block",e.style.overflow="hidden",e},_removeOuterContainer:function(t,e,i){e.parentNode&&(e.parentNode.insertBefore(t,e),e.parentNode.removeChild(i),e.parentNode.removeChild(e))},_dataURItoBlob:function(t){for(var e=atob(t.split(",")[1]),i=t.split(",")[0].split(":")[1].split(";")[0],n=new ArrayBuffer(e.length),a=new DataView(n),o=0;o<e.length;o++)a.setUint8(o,e.charCodeAt(o));return new Blob([n],{type:i})},_togglePageSizeButtons:function(t){var e=this.holder.style,i=this.link.style;"mouseover"===t.type?(e.display="block",i.borderTopRightRadius="0",i.borderBottomRightRadius="0"):(e.display="none",i.borderTopRightRadius="2px",i.borderBottomRightRadius="2px")},_toggleControls:function(t){var e=document.getElementsByClassName("leaflet-control-container")[0];if(t)return e.style.display="block";e.style.display="none"},_toggleClasses:function(t,e){t.forEach((function(t){var i=document.getElementsByClassName(t)[0];if(e)return i.style.display="block";i.style.display="none"}))},_a4PageSize:{height:715,width:1045}});const o=function(e){return new t.EasyPrint(e)};export{o as easyPrint};
//# sourceMappingURL=bundle.js.map
