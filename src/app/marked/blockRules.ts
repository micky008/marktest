/**
 * Block-Level Rules
 */
/* eslint-disable no-useless-escape */
import { Helpers } from './utils'

export class Normal {

  protected block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: null,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: null,
    // DOTO(@Jocs) need to support multiple line in setext heading?
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    tasklist: /^( *)([*+-] \[(?:X|x|\s)\]) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1(?:[*+-] \[(?:X|x|\s)\]))\n*|\s*$)/,
    orderlist: /^( *)(\d+\.) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1\d+\. )\n*|\s*$)/,
    bulletlist: /^( *)([*+-]) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1[*+-] )\n*|\s*$)/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ {0,3}\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    table: null,
    paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
    text: /^[^\n]+/,
    frontmatter: /^---\n([\s\S]+?)---(?:\n+|$)/,
    multiplemath: /^\$\$\n([\s\S]+?)\n\$\$(?:\n+|$)/,
    checkbox: /^\[([ x])\] +/,
    bullet: /(?:[*+-] \[(?:X|x|\s)\]|[*+-]|\d+\.)/,
    item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
    _tag: '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b',
  }


  private static blk: Normal = null;

  public static getInstance() {
    if (Normal.blk == null) {
      Normal.blk = new Normal();
    }
    return Normal.blk;
  }


  protected constructor() {

    this.block.item = Helpers.replace(this.block.item, 'gm')(/bull/g, this.block.bullet)();
    ['tasklist', 'orderlist', 'bulletlist'].forEach(list => {
      this.block[list] = Helpers.replace(this.block[list])('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + this.block.def + ')')();
    });


    this.block.blockquote = Helpers.replace(this.block.blockquote)('def', this.block.def)()

    this.block.html = Helpers.replace(this.block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, this.block._tag)()
    this.block.paragraph = Helpers.replace(this.block.paragraph)('hr', this.block.hr)('heading', this.block.heading)('lheading', this.block.lheading)('blockquote', this.block.blockquote)('tag', '<' + this.block._tag)('def', this.block.def)()

  }

public getRules(){
  return this.block;
}

}
/**
  * GFM Block Grammar
  */

export class Gfm extends Normal {


  private static blkGfm: Gfm = null;

  public static getInstance() {
    if (Gfm.blkGfm == null) {
      Gfm.blkGfm = new Gfm();
    }
    return Gfm.blkGfm;
  }

  protected constructor() {
    super();
    this.block.fences = /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/;
    this.block.paragraph = /^/;
    this.block.heading = /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/;
    this.block.paragraph = Helpers.replace(this.block.paragraph)('(?!', '(?!' +
      this.block.fences.source.replace('\\1', '\\2') + '|' +
      this.block.tasklist.source.replace('\\1', '\\5') + '|' +
      this.block.orderlist.source.replace('\\1', '\\7') + '|' +
      this.block.bulletlist.source.replace('\\1', '\\9') + '|')()
  }

}


export class Tables extends Gfm {

  private static blkTab: Gfm = null;

  public static getInstance() {
    if (Tables.blkTab == null) {
      Tables.blkTab = new Tables();
    }
    return Tables.blkTab;
  }

  protected constructor() {
    super();
    this.block.nptable = /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/;
    this.block.table = /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/;
  }

}
/* eslint-ensable no-useless-escape */
