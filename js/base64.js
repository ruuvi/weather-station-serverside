function base64_decode (s)
{
  var hasNode = (typeof process !== 'undefined' && process.versions && process.versions.node),
      hasTypedArray = (typeof Uint8Array !== 'undefined');
  if (hasNode && require('fs').existsSync(__dirname + '/../build/Release/base91encdec.node')) {
     module.exports = require(__dirname + '/../build/Release/base91encdec.node');
     return;
  }

  console.log("base64 decoding");
  //An array of the base 64 characters is necessary for encoding, such as:
  var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var base64pad = ".";

  //And decoding will require the inverse list (swap the indices for the values), such as:
  var base64inv = {}; 
  for (var i = 0; i < base64chars.length; i++) 
  { 
  base64inv[base64chars[i]] = i; 
  }
  // remove/ignore any characters not in the base64 characters list
  //  or the pad character -- particularly newlines
  base64escape = s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\\\^\$\|]/g, "\\$&");
  s = s.replace(new RegExp('[^'+base64escape+'=]', 'g'), "");

  // replace any incoming padding with a zero pad (the 'A' character is zero)
  var p = (s.charAt(s.length-1) == 'base64pad' ? 
          (s.charAt(s.length-2) == 'base64pad' ? 'AA' : 'A') : ""); 
  var r = ""; 
  s = s.substr(0, s.length - p.length) + p;

  // increment over the length of this encoded string, four characters at a time
  for (var c = 0; c < s.length; c += 4) {

    // each of these four characters represents a 6-bit index in the base64 characters list
    //  which, when concatenated, will give the 24-bit number for the original 3 characters
    var n = (base64inv[s.charAt(c)] << 18) + (base64inv[s.charAt(c+1)] << 12) +
            (base64inv[s.charAt(c+2)] << 6) + base64inv[s.charAt(c+3)];

    // split the 24-bit number into the original three 8-bit (ASCII) characters
    r += String.fromCharCode((n >>> 16) & 255, (n >>> 8) & 255, n & 255);
  }
   // remove any zero pad that was added to make this a multiple of 24 bits
  r = r.substring(0, r.length - p.length);
  
  if (hasNode)
     ret = new Buffer(r);
  else if (hasTypedArray) {
    ret = new Uint8Array(r.length);
    for (i = 0, len = r.length; i < len; ++i){
      ret[i] = r.charCodeAt(i);
    }
  } else
    ret = r;
  return ret;
          
}
