/* eslint-disable */
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  _s as _s22,
  _$ as _$1
} from 'rease';


// @ts-ignore
import cards_jpg from './img/cards2048.jpg'
// const CSS_URL_CARD = `url("data:image/svg+xml;utf8, ${cards_svg}")` // 876104
const CSS_URL_CARD = `url("data:image/jpg;base64,${cards_jpg}")` // 326236

// @ts-ignore
import svg_reset from './svg/arrow-down-up.svg'
const CSS_SVG_RESET = `url("data:image/svg+xml;utf8,${svg_reset}")`

// @ts-ignore
import svg_clockwise from './svg/arrow-clockwise.svg'
const CSS_SVG_CLOCKWISE = `url("data:image/svg+xml;utf8,${svg_clockwise}")`

// @ts-ignore
import svg_left from './svg/arrow-left.svg'
const CSS_SVG_LEFT = `url("data:image/svg+xml;utf8,${svg_left}")`

// @ts-ignore
import svg_right from './svg/arrow-right.svg'
const CSS_SVG_RIGHT = `url("data:image/svg+xml;utf8,${svg_right}")`

// @ts-ignore
import svg_info from './svg/info-lg.svg'
const CSS_SVG_INFO = `url("data:image/svg+xml;utf8,${svg_info}")`

const BTNS_SIZE = 3

export const style = {
  id: "mppzelkow",
  _: (_p0, _s0) => (/*r2.$*/_$1([(CSS_URL_CARD), (CSS_SVG_INFO), (CSS_SVG_RIGHT), (CSS_SVG_LEFT), (CSS_SVG_CLOCKWISE), (CSS_SVG_RESET), (BTNS_SIZE / 1.5), (BTNS_SIZE)], (_$0) => ("*{"+_p0[0]+"border-box}html{"+_p0[1]+"radial-gradient(transparent,rgba(0,0,0,0.5));"+_p0[2]+"#3d3d3d}body{"+_p0[3]+"0;"+_p0[4]+"hidden;"+_p0[5]+"scroll}body::-webkit-scrollbar{"+_p0[6]+"10px}body::-webkit-scrollbar-thumb{"+_p0[2]+"#666}."+_s0+0+"{"+_p0[6]+"100%;"+_p0[7]+"#fff;"+_p0[8]+(_$0[7])+"em}."+_s0+0+".landscape{"+_p0[8]+"0;"+_p0[9]+(_$0[7])+"em}."+_s0+1+"{"+_p0[10]+"100vh;"+_p0[11]+"none;"+_p0[6]+"100%;"+_p0[12]+"1%;"+_p0[3]+"auto}."+_s0+1+">table{"+_p0[6]+"100%;"+_p0[13]+"fixed;"+_p0[14]+"collapse}."+_s0+1+">table>tr>td{"+_p0[12]+"1%;"+_p0[15]+"top}."+_s0+2+"{"+_p0[11]+"none;"+_p0[16]+"0;"+_p0[17]+"0;"+_p0[6]+"100%;"+_p0[18]+(_$0[7])+"em;"+_p0[19]+"fixed}.landscape ."+_s0+2+"{"+_p0[6]+(_$0[7])+"em;"+_p0[18]+"100%}."+_s0+3+"{"+_p0[6]+(_$0[6])+"em;"+_p0[18]+(_$0[6])+"em;"+_p0[15]+"top;"+_p0[3]+"0.5em;"+_p0[12]+"0.5em;"+_p0[19]+"relative;"+_p0[20]+"inline-block;"+_p0[21]+"none;"+_p0[22]+"none;"+_p0[23]+"50%;"+_p0[2]+"#fff;"+_p0[24]+"background-color 0.25s}."+_s0+3+".disabled{"+_p0[25]+"0.125;"+_p0[26]+"not-allowed;"+_p0[2]+"#ccc}."+_s0+3+">div{"+_p0[6]+"100%;"+_p0[18]+"100%;"+_p0[25]+"0.75;"+_p0[27]+"contain;"+_p0[28]+"no-repeat}."+_s0+3+">div.reset{"+_p0[1]+(_$0[5])+"}."+_s0+3+">div.retake{"+_p0[1]+(_$0[4])+"}."+_s0+3+">div.undo{"+_p0[1]+(_$0[3])+"}."+_s0+3+">div.redo{"+_p0[1]+(_$0[2])+"}."+_s0+3+">div.info{"+_p0[1]+(_$0[1])+"}."+_s0+4+"{"+_p0[6]+"100%;"+_p0[19]+"relative;"+_p0[29]+"visible}."+_s0+4+"::before{"+_p0[2]+"rgba(255,255,255,0.03125);"+_p0[30]+"inset 0 0 0 1px #3e3e3e}."+_s0+5+"{"+_p0[6]+"100%;"+_p0[31]+"180%}."+_s0+6+"{"+_p0[6]+"100%;"+_p0[29]+"visible;"+_p0[19]+"relative;"+_p0[32]+"0.77% 29.58%}."+_s0+6+"::before{"+_p0[27]+"1685% 542%;"+_p0[32]+"inherit;"+_p0[1]+(_$0[0])+";"+_p0[30]+"inset 0 0 0 1px #fff}."+_s0+6+"+."+_s0+6+"{"+_p0[33]+"-140%}."+_s0+4+"::before,."+_s0+6+"::before{"+_p0[34]+"'';"+_p0[20]+"block;"+_p0[6]+"100%;"+_p0[18]+"0;"+_p0[23]+"4.2%/3%;"+_p0[31]+"140%}."+_s0+4+">."+_s0+6+"{"+_p0[33]+"-140%}."+_s0+6+">."+_s0+6+"{"+_p0[33]+"-125%}."+_s0+6+".view>."+_s0+6+"{"+_p0[33]+"-105%}."+_s0+7+"{"+_p0[16]+"0;"+_p0[17]+"0;"+_p0[35]+"0;"+_p0[36]+"0;"+_p0[20]+"none;"+_p0[19]+"fixed;"+_p0[2]+"rgb(0,0,0,0.9375);"+_p0[37]+"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}."+_s0+7+".show{"+_p0[20]+"block}."+_s0+8+"::before{"+_p0[34]+"'';"+_p0[16]+"0;"+_p0[17]+"0;"+_p0[35]+"0;"+_p0[36]+"0;"+_p0[6]+"150px;"+_p0[18]+"210px;"+_p0[3]+"auto;"+_p0[20]+"block;"+_p0[19]+"absolute;"+_p0[23]+"4.2%/3%;"+_p0[27]+"1685% 542%;"+_p0[32]+"0.77% 2.9%;"+_p0[1]+(_$0[0])+"}."+_s0+8+">div{"+_p0[6]+"100%;"+_p0[36]+"50%;"+_p0[19]+"absolute;"+_p0[38]+"24px;"+_p0[39]+"900;"+_p0[40]+"center;"+_p0[7]+"#b81817;"+_p0[41]+"1px 1px #fff,-1px -1px #fff}."+_s0+9+">div{"+_p0[16]+"0;"+_p0[17]+"0;"+_p0[35]+"0;"+_p0[36]+"0;"+_p0[3]+"auto;"+_p0[12]+"1em;"+_p0[6]+"320px;"+_p0[18]+"320px;"+_p0[19]+"absolute;"+_p0[7]+"#3d3d3d;"+_p0[42]+"#fff;"+_p0[29]+"auto;"+_p0[38]+"0.875em}."+_s0+9+">div hr{"+_p0[43]+"none;"+_p0[44]+"1px solid #ccc}."+_s0+9+">div h4{"+_p0[3]+"0}."+_s0+9+">div ."+_s0+3+"{"+_p0[3]+"0}"))),
  on() {
    _s22(
      this,
      ["root","game","btns","btn","card_box","fixer","card","popup","win","info"],
      ["box-sizing","background-image","background-color","margin","overflow-x","overflow-y","width","color","padding-top","padding-left","min-height","touch-action","padding","table-layout","border-collapse","vertical-align","top","left","height","position","display","outline","text-decoration","border-radius","transition","opacity","cursor","background-size","background-repeat","overflow","box-shadow","padding-bottom","background-position","margin-top","content","right","bottom","font-family","font-size","font-weight","text-align","text-shadow","background","border","border-bottom"]
    )
  }
}
