define(function(require,exports,module){"use strict";function r(r,f){r[f>>5]|=128<<24-f%32,r[(f+64>>9<<4)+15]=f;for(var o=Array(80),a=1732584193,c=-271733879,h=-1732584194,i=271733878,g=-1009589776,v=0;v<r.length;v+=16){for(var l=a,A=c,s=h,d=i,C=g,y=0;y<80;y++){y<16?o[y]=r[v+y]:o[y]=u(o[y-3]^o[y-8]^o[y-14]^o[y-16],1);var b=e(e(u(a,5),n(y,c,h,i)),e(e(g,o[y]),t(y)));g=i,i=h,h=u(c,30),c=a,a=b}a=e(a,l),c=e(c,A),h=e(h,s),i=e(i,d),g=e(g,C)}return Array(a,c,h,i,g)}function n(r,n,t,e){return r<20?n&t|~n&e:r<40?n^t^e:r<60?n&t|n&e|t&e:n^t^e}function t(r){return r<20?1518500249:r<40?1859775393:r<60?-1894007588:-899497514}function e(r,n){var t=(65535&r)+(65535&n),e=(r>>16)+(n>>16)+(t>>16);return e<<16|65535&t}function u(r,n){return r<<n|r>>>32-n}function f(r){for(var n=Array(),t=(1<<g)-1,e=0;e<r.length*g;e+=g)n[e>>5]|=(r.charCodeAt(e/g)&t)<<32-g-e%32;return n}function o(r){for(var n="",t=(1<<g)-1,e=0;e<32*r.length;e+=g)n+=String.fromCharCode(r[e>>5]>>>32-g-e%32&t);return n}function a(r){for(var n=h?"0123456789ABCDEF":"0123456789abcdef",t="",e=0;e<4*r.length;e++)t+=n.charAt(r[e>>2]>>8*(3-e%4)+4&15)+n.charAt(r[e>>2]>>8*(3-e%4)&15);return t}function c(r){for(var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="",e=0;e<4*r.length;e+=3)for(var u=(r[e>>2]>>8*(3-e%4)&255)<<16|(r[e+1>>2]>>8*(3-(e+1)%4)&255)<<8|r[e+2>>2]>>8*(3-(e+2)%4)&255,f=0;f<4;f++)t+=8*e+6*f>32*r.length?i:n.charAt(u>>6*(3-f)&63);return t}var h=0,i="",g=8;exports.hex_sha1=function(n){return a(r(f(n),n.length*g))},exports.b64_sha1=function(n){return c(r(f(n),n.length*g))},exports.str_sha1=function(n){return o(r(f(n),n.length*g))}});