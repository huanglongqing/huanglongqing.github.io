webpackJsonp([6],{BRgg:function(t,e,s){"use strict";e.b=function(){var t=n()({},o.b,{uin:0,needNewCode:1,platform:"h5"});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",t,o.c)},e.a=function(t){var e=n()({},o.b,{topid:t,needNewCode:1,uin:0,tpl:3,page:"detail",type:"top",platform:"h5"});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",e,o.c)};var i=s("woOf"),n=s.n(i),a=s("Gak4"),o=s("T452")},Kjo5:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("Dd8w"),n=s.n(i),a=s("qwAB"),o=s("y/jF"),c=s("BRgg"),r=s("T452"),l=s("F4+m"),p=s("NYxO"),u={mixins:[l.b],created:function(){this._getTopList()},data:function(){return{topList:[]}},methods:n()({handlePlaylist:function(t){var e=t.length>0?"50px":"";this.$refs.rank.style.bottom=e,this.$refs.toplist.refresh()},selectItem:function(t){this.$router.push({path:"/rank/"+t.id}),this.setTopList(t)},_getTopList:function(){var t=this;Object(c.b)().then(function(e){e.code===r.a&&(t.topList=e.data.topList)})}},Object(p.d)({setTopList:"SET_TOP_LIST"})),watch:{topList:function(){var t=this;setTimeout(function(){t.$Lazyload.lazyLoadHandler()},20)}},components:{Scroll:a.a,Loading:o.a}},f={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"rank",staticClass:"rank"},[s("scroll",{ref:"toplist",staticClass:"toplist",attrs:{data:t.topList}},[s("ul",t._l(t.topList,function(e,i){return s("li",{key:i,staticClass:"item",on:{click:function(s){return t.selectItem(e)}}},[s("div",{staticClass:"icon"},[s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"item.picUrl"}],attrs:{width:"100",height:"100"}})]),t._v(" "),s("ul",{staticClass:"songlist"},t._l(e.songList,function(e,i){return s("li",{key:i,staticClass:"song"},[s("span",[t._v(t._s(i+1))]),t._v(" "),s("span",[t._v(t._s(e.songname)+"-"+t._s(e.singername))])])}),0)])}),0),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.topList.length,expression:"!topList.length"}],staticClass:"loading-container"},[s("loading")],1)]),t._v(" "),s("router-view")],1)},staticRenderFns:[]};var d=s("VU/8")(u,f,!1,function(t){s("om4N")},"data-v-c8781e96",null);e.default=d.exports},om4N:function(t,e){}});
//# sourceMappingURL=6.62be4620017173b263c8.js.map