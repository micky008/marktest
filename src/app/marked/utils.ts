/**
 * Helpers
 */


export class Helpers {
  public static escape(html, encode?) {
    return html
      .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  public static unescape(html) {
    return html.replace(/&([#\w]+);/g, function (_, n) {
      n = n.toLowerCase();
      if (n === 'colon') {
        return ':';
      }
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }
      return '';
    })
  }

  public static replace (regexp : RegExp, opt = '') : Function {
   let regex = regexp.source
    return function self (name:string, val: any) {
      if (!name) return new RegExp(regex, opt)
      val = val.source || val
      /* eslint-disable no-useless-escape */
      val = val.replace(/(^|[^\[])\^/g, '$1')
      /* eslint-ensable no-useless-escape */
      regex = regex.replace(name, val)
      return self
    }
  }


  


}