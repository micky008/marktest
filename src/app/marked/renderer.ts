import { Helpers } from './utils'
/**
 * Renderer
 */

export class Renderer {

  options: any;

  constructor(options = {}) {
    this.options = options
  }

  public frontmatter(text) {
    return `<pre class="front-matter">\n${text}</pre>\n`
  }

  public multiplemath(text) {
    return `<pre class="multiple-math">\n${text}</pre>\n`
  }

  public code(code, lang, escaped, codeBlockStyle) {
    if (this.options.highlight) {
      let out = this.options.highlight(code, lang)
      if (out !== null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    let className = codeBlockStyle === 'fenced' ? 'fenced-code-block' : 'indented-code-block';
    className = lang ? `${className} ${this.options.langPrefix}${Helpers.escape(lang, true)}` : className;

    return '<pre><code class="' +
      className +
      '">' +
      (escaped ? code : Helpers.escape(code, true)) +
      '\n</code></pre>\n';
  }

  public blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }

  public html(html) {
    return html;
  }

  public heading(text, level, raw, headingStyle) {
    return '<h' +
      level +
      ' id="' +
      this.options.headerPrefix +
      raw.toLowerCase().replace(/[^\w]+/g, '-') +
      '" class="' +
      headingStyle +
      '">' +
      text +
      '</h' +
      level +
      '>\n';
  }

  public hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  }

  public list(body, ordered, start, taskList) {
    const type = ordered ? 'ol' : 'ul';
    const classes = !ordered ? (taskList ? ' class="task-list"' : ' class="bullet-list"') : ' class="order-list"';
    const startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + classes + startatt + '>\n' + body + '</' + type + '>\n';
  }

  public listitem(text, checked, listItemType, bulletListItemMarker, loose) {
    let classes
    switch (listItemType) {
      case 'order':
        classes = ' class="order-list-item';
        break;
      case 'task':
        classes = ' class="task-list-item';
        break;
      case 'bullet':
        classes = ' class="bullet-list-item';
        break;
      default:
        throw new Error('Invalid state');
    }

    // "tight-list-item" is only used to remove <p> padding
    classes += loose ? ` loose-list-item"` : ` tight-list-item"`;

    if (checked === undefined) {
      return '<li ' + classes + ' data-marker="' + bulletListItemMarker + '">' + text + '</li>\n';
    }

    return '<li ' + classes + ' data-marker="' + bulletListItemMarker + '">' +
      '<input type="checkbox" class="task-list-item-checkbox"' +
      (checked ? ' checked' : '') +
      '> ' +
      text +
      '</li>\n';
  }

  public paragraph(text) {
    return '<p>' + text + '</p>\n';
  }

  public table(header, body) {
    return '<table>\n' +
      '<thead>\n' +
      header +
      '</thead>\n' +
      '<tbody>\n' +
      body +
      '</tbody>\n' +
      '</table>\n';
  }

  public tablerow(content) {
    return '<tr>\n' + content + '</tr>\n';
  }

  public tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align   ?'<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  }

  // span level renderer
  public strong(text) {
    return '<strong>' + text + '</strong>';
  }

  public em(text) {
    return '<em>' + text + '</em>'
  }

  public codespan(text) {
    return '<code>' + text + '</code>'
  }

  public br() {
    return this.options.xhtml ? '<br/>' : '<br>'
  }

  public del(text) {
    return '<del>' + text + '</del>'
  }

  public link(href, title, text) {
    if (this.options.sanitize) {
      let prot
      try {
        prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return '';
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
        return '';
      }
    }
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  }

  public image(href, title, text) {
    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  }

  public text(text) {
    return text;
  }

}
