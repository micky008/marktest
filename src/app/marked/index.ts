import { Renderer } from './renderer'
import { Lexer } from './lexer'
import { Parser } from './parser'
import { Helpers } from './utils'

const defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer(),
  xhtml: false,
  disableInline: false
}
/**
 * Marked
 */

export class Marked {

  public marked(src: any, opt: any = {}) {
    try {
      opt = Object.assign({}, defaults, opt);
      return new Parser(opt).parse(new Lexer(opt).lex(src));
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/marktext/marktext/issues.'
      if (opt.silent) {
        return '<p>An error occurred:</p><pre>' +
          Helpers.escape(e.message + '') +
          '</pre>';
      }
      throw e;
    }
  };
};
