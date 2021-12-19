/*! For license information please see script.js.LICENSE.txt */
(()=>{"use strict";var e={733:(e,t,n)=>{n.r(t),n.d(t,{Properties:()=>r,VariableDescriptor:()=>o,bootstrapExtra:()=>J,findLayerBoundaries:()=>p,findLayersBoundaries:()=>u,getAllVariables:()=>i,getLayersMap:()=>l,initDoors:()=>q,initPropertiesTemplates:()=>L,initVariableActionLayer:()=>F});class r{constructor(e){this.properties=null!=e?e:[]}get(e){const t=this.properties.filter((t=>t.name===e)).map((e=>e.value));if(t.length>1)throw new Error('Expected only one property to be named "'+e+'"');if(0!==t.length)return t[0]}getString(e){return this.getByType(e,"string")}getNumber(e){return this.getByType(e,"number")}getBoolean(e){return this.getByType(e,"boolean")}getByType(e,t){const n=this.get(e);if(void 0!==n){if(typeof n!==t)throw new Error('Expected property "'+e+'" to have type "'+t+'"');return n}}mustGetString(e){return this.mustGetByType(e,"string")}mustGetNumber(e){return this.mustGetByType(e,"number")}mustGetBoolean(e){return this.mustGetByType(e,"boolean")}mustGetByType(e,t){const n=this.get(e);if(void 0===n)throw new Error('Property "'+e+'" is missing');if(typeof n!==t)throw new Error('Expected property "'+e+'" to have type "'+t+'"');return n}getType(e){const t=this.properties.filter((t=>t.name===e)).map((e=>e.type));if(t.length>1)throw new Error('Expected only one property to be named "'+e+'"');if(0!==t.length)return t[0]}}class o{constructor(e){this.name=e.name,this.x=e.x,this.y=e.y,this.properties=new r(e.properties)}get isReadable(){const e=this.properties.getString("readableBy");return!e||WA.player.tags.includes(e)}get isWritable(){const e=this.properties.getString("writableBy");return!e||WA.player.tags.includes(e)}}async function i(){const e=await WA.room.getTiledMap(),t=new Map;return s(e.layers,t),t}function s(e,t){for(const n of e)if("objectgroup"===n.type)for(const e of n.objects)"variable"===e.type&&t.set(e.name,new o(e));else"group"===n.type&&s(n.layers,t)}let a;async function l(){return void 0===a&&(a=async function(){return function(e){const t=new Map;return c(e.layers,"",t),t}(await WA.room.getTiledMap())}()),a}function c(e,t,n){for(const r of e)"group"===r.type?c(r.layers,t+r.name+"/",n):(r.name=t+r.name,n.set(r.name,r))}function p(e){let t=1/0,n=1/0,r=0,o=0;const i=e.data;if("string"==typeof i)throw new Error("Unsupported tile layer data stored as string instead of CSV");for(let s=0;s<e.height;s++)for(let a=0;a<e.width;a++)0!==i[a+s*e.width]&&(t=Math.min(t,a),o=Math.max(o,a),n=Math.min(n,s),r=Math.max(r,s));return{top:n,left:t,right:o+1,bottom:r+1}}function u(e){let t=1/0,n=1/0,r=0,o=0;for(const i of e){const e=p(i);e.left<t&&(t=e.left),e.top<n&&(n=e.top),e.right>o&&(o=e.right),e.bottom>r&&(r=e.bottom)}return{top:n,left:t,right:o,bottom:r}}var g=Object.prototype.toString,h=Array.isArray||function(e){return"[object Array]"===g.call(e)};function f(e){return"function"==typeof e}function d(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function y(e,t){return null!=e&&"object"==typeof e&&t in e}var m=RegExp.prototype.test,v=/\S/;var b={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},w=/\s*/,A=/\s+/,W=/\s*=/,S=/\s*\}/,C=/#|\^|\/|>|\{|&|=|!/;function E(e){this.string=e,this.tail=e,this.pos=0}function x(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function T(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}E.prototype.eos=function(){return""===this.tail},E.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},E.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},x.prototype.push=function(e){return new x(e,this)},x.prototype.lookup=function(e){var t,n,r,o=this.cache;if(o.hasOwnProperty(e))t=o[e];else{for(var i,s,a,l=this,c=!1;l;){if(e.indexOf(".")>0)for(i=l.view,s=e.split("."),a=0;null!=i&&a<s.length;)a===s.length-1&&(c=y(i,s[a])||(n=i,r=s[a],null!=n&&"object"!=typeof n&&n.hasOwnProperty&&n.hasOwnProperty(r))),i=i[s[a++]];else i=l.view[e],c=y(l.view,e);if(c){t=i;break}l=l.parent}o[e]=t}return f(t)&&(t=t.call(this.view)),t},T.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},T.prototype.parse=function(e,t){var n=this.templateCache,r=e+":"+(t||M.tags).join(":"),o=void 0!==n,i=o?n.get(r):void 0;return null==i&&(i=function(e,t){if(!e)return[];var n,r,o,i,s=!1,a=[],l=[],c=[],p=!1,u=!1,g="",f=0;function y(){if(p&&!u)for(;c.length;)delete l[c.pop()];else c=[];p=!1,u=!1}function b(e){if("string"==typeof e&&(e=e.split(A,2)),!h(e)||2!==e.length)throw new Error("Invalid tags: "+e);n=new RegExp(d(e[0])+"\\s*"),r=new RegExp("\\s*"+d(e[1])),o=new RegExp("\\s*"+d("}"+e[1]))}b(t||M.tags);for(var x,T,k,P,V,L,B=new E(e);!B.eos();){if(x=B.pos,k=B.scanUntil(n))for(var G=0,U=k.length;G<U;++G)i=P=k.charAt(G),function(e,t){return m.call(e,t)}(v,i)?(u=!0,s=!0,g+=" "):(c.push(l.length),g+=P),l.push(["text",P,x,x+1]),x+=1,"\n"===P&&(y(),g="",f=0,s=!1);if(!B.scan(n))break;if(p=!0,T=B.scan(C)||"name",B.scan(w),"="===T?(k=B.scanUntil(W),B.scan(W),B.scanUntil(r)):"{"===T?(k=B.scanUntil(o),B.scan(S),B.scanUntil(r),T="&"):k=B.scanUntil(r),!B.scan(r))throw new Error("Unclosed tag at "+B.pos);if(V=">"==T?[T,k,x,B.pos,g,f,s]:[T,k,x,B.pos],f++,l.push(V),"#"===T||"^"===T)a.push(V);else if("/"===T){if(!(L=a.pop()))throw new Error('Unopened section "'+k+'" at '+x);if(L[1]!==k)throw new Error('Unclosed section "'+L[1]+'" at '+x)}else"name"===T||"{"===T||"&"===T?u=!0:"="===T&&b(k)}if(y(),L=a.pop())throw new Error('Unclosed section "'+L[1]+'" at '+B.pos);return function(e){for(var t,n=[],r=n,o=[],i=0,s=e.length;i<s;++i)switch((t=e[i])[0]){case"#":case"^":r.push(t),o.push(t),r=t[4]=[];break;case"/":o.pop()[5]=t[2],r=o.length>0?o[o.length-1][4]:n;break;default:r.push(t)}return n}(function(e){for(var t,n,r=[],o=0,i=e.length;o<i;++o)(t=e[o])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(r.push(t),n=t));return r}(l))}(e,t),o&&n.set(r,i)),i},T.prototype.render=function(e,t,n,r){var o=this.getConfigTags(r),i=this.parse(e,o),s=t instanceof x?t:new x(t,void 0);return this.renderTokens(i,s,n,e,r)},T.prototype.renderTokens=function(e,t,n,r,o){for(var i,s,a,l="",c=0,p=e.length;c<p;++c)a=void 0,"#"===(s=(i=e[c])[0])?a=this.renderSection(i,t,n,r,o):"^"===s?a=this.renderInverted(i,t,n,r,o):">"===s?a=this.renderPartial(i,t,n,o):"&"===s?a=this.unescapedValue(i,t):"name"===s?a=this.escapedValue(i,t,o):"text"===s&&(a=this.rawValue(i)),void 0!==a&&(l+=a);return l},T.prototype.renderSection=function(e,t,n,r,o){var i=this,s="",a=t.lookup(e[1]);if(a){if(h(a))for(var l=0,c=a.length;l<c;++l)s+=this.renderTokens(e[4],t.push(a[l]),n,r,o);else if("object"==typeof a||"string"==typeof a||"number"==typeof a)s+=this.renderTokens(e[4],t.push(a),n,r,o);else if(f(a)){if("string"!=typeof r)throw new Error("Cannot use higher-order sections without the original template");null!=(a=a.call(t.view,r.slice(e[3],e[5]),(function(e){return i.render(e,t,n,o)})))&&(s+=a)}else s+=this.renderTokens(e[4],t,n,r,o);return s}},T.prototype.renderInverted=function(e,t,n,r,o){var i=t.lookup(e[1]);if(!i||h(i)&&0===i.length)return this.renderTokens(e[4],t,n,r,o)},T.prototype.indentPartial=function(e,t,n){for(var r=t.replace(/[^ \t]/g,""),o=e.split("\n"),i=0;i<o.length;i++)o[i].length&&(i>0||!n)&&(o[i]=r+o[i]);return o.join("\n")},T.prototype.renderPartial=function(e,t,n,r){if(n){var o=this.getConfigTags(r),i=f(n)?n(e[1]):n[e[1]];if(null!=i){var s=e[6],a=e[5],l=e[4],c=i;0==a&&l&&(c=this.indentPartial(i,l,s));var p=this.parse(c,o);return this.renderTokens(p,t,n,c,r)}}},T.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},T.prototype.escapedValue=function(e,t,n){var r=this.getConfigEscape(n)||M.escape,o=t.lookup(e[1]);if(null!=o)return"number"==typeof o&&r===M.escape?String(o):r(o)},T.prototype.rawValue=function(e){return e[1]},T.prototype.getConfigTags=function(e){return h(e)?e:e&&"object"==typeof e?e.tags:void 0},T.prototype.getConfigEscape=function(e){return e&&"object"==typeof e&&!h(e)?e.escape:void 0};var M={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){k.templateCache=e},get templateCache(){return k.templateCache}},k=new T;M.clearCache=function(){return k.clearCache()},M.parse=function(e,t){return k.parse(e,t)},M.render=function(e,t,n,r){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+(h(o=e)?"array":typeof o)+'" was given as the first argument for mustache#render(template, view, partials)');var o;return k.render(e,t,n,r)},M.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,(function(e){return b[e]}))},M.Scanner=E,M.Context=x,M.Writer=T;const P=M;class V{constructor(e,t){this.template=e,this.state=t,this.ast=P.parse(e)}getValue(){return void 0===this.value&&(this.value=P.render(this.template,this.state)),this.value}onChange(e){const t=[];for(const n of this.getUsedVariables().values())t.push(this.state.onVariableChange(n).subscribe((()=>{const t=P.render(this.template,this.state);t!==this.value&&(this.value=t,e(this.value))})));return{unsubscribe:()=>{for(const e of t)e.unsubscribe()}}}isPureString(){return 0===this.ast.length||1===this.ast.length&&"text"===this.ast[0][0]}getUsedVariables(){const e=new Set;return this.recursiveGetUsedVariables(this.ast,e),e}recursiveGetUsedVariables(e,t){for(const n of e){const e=n[0],r=n[1],o=n[4];["name","&","#","^"].includes(e)&&t.add(r),void 0!==o&&"string"!=typeof o&&this.recursiveGetUsedVariables(o,t)}}}async function L(){var e;const t=await l();for(const[n,r]of t.entries()){const t=null!==(e=r.properties)&&void 0!==e?e:[];for(const e of t){if("int"===e.type||"bool"===e.type||"object"===e.type||"string"!=typeof e.value)continue;const t=new V(e.value,WA.state);if(t.isPureString())continue;const r=t.getValue();B(n,e.name,r),t.onChange((t=>{B(n,e.name,t)}))}}}function B(e,t,n){WA.room.setProperty(e,t,n),"visible"===t&&(n?WA.room.showLayer(e):WA.room.hideLayer(e))}const G="https://unpkg.com/@workadventure/scripting-api-extra@1.1.1/dist";let U,j,O=0,R=0;function Z(e){if(WA.state[e.name]){let t=e.properties.mustGetString("openLayer");for(const e of t.split("\n"))WA.room.showLayer(e);t=e.properties.mustGetString("closeLayer");for(const e of t.split("\n"))WA.room.hideLayer(e)}else{let t=e.properties.mustGetString("openLayer");for(const e of t.split("\n"))WA.room.hideLayer(e);t=e.properties.mustGetString("closeLayer");for(const e of t.split("\n"))WA.room.showLayer(e)}}function z(e){return e.map((e=>U.get(e))).filter((e=>"tilelayer"===(null==e?void 0:e.type)))}function H(e){const t=u(z(e)),n=32*((t.right-t.left)/2+t.left),r=32*((t.bottom-t.top)/2+t.top);return Math.sqrt(Math.pow(O-n,2)+Math.pow(R-r,2))}function I(e){WA.state.onVariableChange(e.name).subscribe((()=>{WA.state[e.name]?function(e){const t=e.properties.getString("openSound"),n=e.properties.getNumber("soundRadius");let r=1;if(n){const t=H(e.properties.mustGetString("openLayer").split("\n"));if(t>n)return;r=1-t/n}t&&WA.sound.loadSound(t).play({volume:r})}(e):function(e){const t=e.properties.getString("closeSound"),n=e.properties.getNumber("soundRadius");let r=1;if(n){const t=H(e.properties.mustGetString("closeLayer").split("\n"));if(t>n)return;r=1-t/n}t&&WA.sound.loadSound(t).play({volume:r})}(e),Z(e)})),Z(e)}function N(e,t,n,r){const o=e.name;let i,s,a=!1;const l=n.getString("zone");if(!l)throw new Error('Missing "zone" property on doorstep layer "'+o+'"');const c=n.getString("tag");let p=!0;c&&!WA.player.tags.includes(c)&&(p=!1);const g=!!c;function h(){var e;i&&i.remove(),i=WA.ui.displayActionMessage({message:null!==(e=n.getString("closeTriggerMessage"))&&void 0!==e?e:"Press SPACE to close the door",callback:()=>{WA.state[t.name]=!1,f()}})}function f(){var e;i&&i.remove(),i=WA.ui.displayActionMessage({message:null!==(e=n.getString("openTriggerMessage"))&&void 0!==e?e:"Press SPACE to open the door",callback:()=>{WA.state[t.name]=!0,h()}})}function d(){s&&(WA.room.website.delete(s.name),s=void 0)}WA.room.onEnterZone(l,(()=>{a=!0,n.getBoolean("autoOpen")&&p?WA.state[t.name]=!0:WA.state[t.name]||(!g||p)&&g||!n.getString("code")&&!n.getString("codeVariable")?p&&(WA.state[t.name]?h():f()):function(e){const n=u(z(t.properties.mustGetString("closeLayer").split("\n")));s=WA.room.website.create({name:"doorKeypad"+e,url:r+"/keypad.html#"+encodeURIComponent(e),position:{x:32*n.right,y:32*n.top,width:96,height:128},allowApi:!0})}(o)})),WA.room.onLeaveZone(l,(()=>{a=!1,n.getBoolean("autoClose")&&(WA.state[t.name]=!1),i&&i.remove(),d()})),WA.state.onVariableChange(t.name).subscribe((()=>{a&&(n.getBoolean("autoClose")||!0!==WA.state[t.name]||h(),s&&!0===WA.state[t.name]&&d(),n.getBoolean("autoOpen")||!1!==WA.state[t.name]||f())}))}function _(e){void 0===WA.state[e.name]&&(WA.state[e.name]=0),WA.state.onVariableChange(e.name).subscribe((()=>{WA.state[e.name]&&function(e){const t=e.properties.mustGetString("bellSound"),n=e.properties.getNumber("soundRadius");let r=1;if(n){const t=Math.sqrt(Math.pow(e.x-O,2)+Math.pow(e.y-R,2));if(t>n)return;r=1-t/n}WA.sound.loadSound(t).play({volume:r})}(e)}))}function D(e,t){let n;const r=t.mustGetString("zone"),o=t.getString("bellPopup");WA.room.onEnterZone(r,(()=>{var r;o?n=WA.ui.openPopup(o,"",[{label:null!==(r=t.getString("bellButtonText"))&&void 0!==r?r:"Ring",callback:()=>{WA.state[e]=WA.state[e]+1}}]):WA.state[e]=WA.state[e]+1})),WA.room.onLeaveZone(r,(()=>{n&&(n.close(),n=void 0)}))}async function q(e){e=null!=e?e:G;const t=await i();U=await l();for(const e of t.values())e.properties.get("door")&&I(e),e.properties.get("bell")&&_(e);for(const n of U.values()){const o=new r(n.properties),i=o.getString("doorVariable");if(i&&"tilelayer"===n.type){const r=t.get(i);if(void 0===r)throw new Error('Cannot find variable "'+i+'" referred in the "doorVariable" property of layer "'+n.name+'"');N(n,r,o,e)}const s=o.getString("bellVariable");s&&D(s,o)}WA.player.onPlayerMove((e=>{O=e.x,R=e.y}))}function F(e){const t=e.getString("bindVariable");if(t){const n=e.getString("zone");if(!n)throw new Error('A layer with a "bindVariable" property must ALSO have a "zone" property.');!function(e,t,n,r,o,i){i&&!WA.player.tags.includes(i)||(void 0!==n&&WA.room.onEnterZone(t,(()=>{o||(WA.state[e]=n)})),void 0!==r&&WA.room.onLeaveZone(t,(()=>{WA.state[e]=r})))}(t,n,e.get("enterValue"),e.get("leaveValue"),e.getString("triggerMessage"),e.getString("tag"))}}function $(e,t){let n;const r=t.getString("zone");if(!r)throw new Error('Missing "zone" property');const o=t.getString("openConfigAdminTag");let i=!0;function s(){WA.nav.closeCoWebSite()}o&&!WA.player.tags.includes(o)&&(i=!1),WA.room.onEnterZone(r,(()=>{const r=t.getString("openConfigTrigger");var o;i&&(r&&"onaction"===r?(n&&n.remove(),n=WA.ui.displayActionMessage({message:null!==(o=t.getString("openConfigTriggerMessage"))&&void 0!==o?o:"Press SPACE or touch here to configure",callback:()=>K(e)})):K(e))})),WA.room.onLeaveZone(r,(()=>{n?(n.remove(),s()):s()}))}function K(e){const t=e?"#"+e:"";WA.nav.openCoWebSite(G+"/configuration.html"+t,!0)}function J(){return WA.onInit().then((()=>{q().catch((e=>console.error(e))),async function(){const e=await l();for(const t of e.values())F(new r(t.properties))}().catch((e=>console.error(e))),async function(e){const t=await WA.room.getTiledMap();e=null!=e?e:G,j=await l();const n=t.layers.find((e=>"configuration"===e.name));if(n){const t=new r(n.properties).getString("tag");t&&!WA.player.tags.includes(t)||WA.ui.registerMenuCommand("Configure the room",(()=>{WA.nav.openCoWebSite(e+"/configuration.html",!0)}));for(const e of j.values()){const t=new r(e.properties),n=t.getString("openConfig");n&&"tilelayer"===e.type&&$(n,t)}}}().catch((e=>console.error(e))),L().catch((e=>console.error(e)))}))}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},console.log("Hello world!"),(0,n(733).bootstrapExtra)(),WA.onInit().then((()=>{console.log("Player name: ",WA.player.name)})),WA.player.onPlayerMove(console.log),WA.chat.sendChatMessage("Hallo zur Startrek Vorlesung! Tobe dich aus und habe Spaß an unserer Map! Bei verschlossenen Türen einfach mal die Aliens fragen :) ","easter-egg-team"),WA.room.onEnterLayer("alienZone").subscribe((()=>{WA.ui.openPopup("alienPopup","Der Code lautet 12345 ! ",[{label:"Close",className:"primary",callback:e=>{e.close()}}])})),WA.room.onLeaveLayer("alienZone").subscribe((()=>{close()})),WA.room.onEnterLayer("HanSolozone").subscribe((()=>{WA.ui.openPopup("HanSolo","Han Solo ist eine fiktive Figur aus der Star Wars- Reihe von George Lucas . Han Solo ist ein rücksichtsloser Schmuggler mit einem sarkastischen Witz und wird von  Harrison Ford gespielt.",[{label:"Close",className:"primary",callback:e=>{e.close()}}])})),WA.room.onLeaveLayer("HanSoloZone").subscribe((()=>{close()}))})();
//# sourceMappingURL=script.js.map