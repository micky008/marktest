import { Helpers } from './utils'
/**
 * Inline-Level Grammar
 */
/* eslint-disable no-useless-escape */

export class InlineRules {

  protected inline = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: null,
    tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[(inside)\]\(href\)/,
    reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: null,
    text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
    _inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
    _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/
  }


  private static il: InlineRules = null;

  public static getInstance() {
    if (InlineRules.il == null) {
      InlineRules.il = new InlineRules();
    }
    return InlineRules.il;
  }

  protected constructor() {
    this.inline.link = Helpers.replace(this.inline.link)('inside', this.inline._inside)('href', this.inline._href)();
    this.inline.reflink = Helpers.replace(this.inline.reflink)('inside', this.inline._inside)();
  }

  public getInline() {
    return this.inline;
  }

}


export class Pedantic extends InlineRules {
  private static ped: Pedantic = null;

  public static getInstance() {
    if (Pedantic.ped == null) {
      Pedantic.ped = new Pedantic();
    }
    return Pedantic.ped;
  }

  protected constructor() {
    super();
    this.inline.strong = /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/;
    this.inline.em = /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/;
  }

}


/**
 * GFM Inline Grammar
 */

export class GfmIR extends InlineRules {
  private static gfmIr: GfmIR = null;

  public static getInstance() {
    if (GfmIR.gfmIr == null) {
      GfmIR.gfmIr = new GfmIR();
    }
    return GfmIR.gfmIr;
  }

  protected constructor() {
    super();
    this.inline.escape = Helpers.replace(this.inline.escape)('])', '~|])')();
    this.inline.url = /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/;
    this.inline.del = /^~~(?=\S)([\s\S]*?\S)~~/;
    this.inline.text = Helpers.replace(this.inline.text)(']|', '~]|')('|', '|https?://|')();
  }

}

/**
 * GFM + Line Breaks Inline Grammar
 */
export class Breaks extends GfmIR {
  private static brks: Breaks = null;

  public static getInstance() {
    if (Breaks.brks == null) {
      Breaks.brks = new Breaks();
    }
    return Breaks.brks;
  }

  protected constructor() {
    super();
    this.inline.br = Helpers.replace(this.inline.br)('{2,}', '*')();
    this.inline.text = Helpers.replace(this.inline.text)('{2,}', '*')();
  }

}
/* eslint-ensable no-useless-escape */
