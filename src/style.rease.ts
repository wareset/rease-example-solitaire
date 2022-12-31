import css from 'rease/css'

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

export const style = css`

* {
  box-sizing: border-box;
}

html {
  min-height: 100vh;
  background-image: radial-gradient(transparent, rgba(0,0,0,0.5));
  background-color: #3d3d3d;
  touch-action: pan-y;
  /* overscroll-behavior: contain; */
  /* background-size: cover / contain; */
}

body {
  margin: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  /* touch-action: pan-y; */
  /* touch-action: none; */
  /* overflow-scrolling: touch; */
  /* overscroll-behavior: contain; */
  /* min-height: 999px; */
}

body::-webkit-scrollbar {
  width: 10px;
}
body::-webkit-scrollbar-thumb {
  background-color: #666;
}

$root {
  & {
    width: 100%;
    color: #fff;
    padding-top: ${BTNS_SIZE}em;

    &.landscape {
      padding-top: 0;
      padding-left: ${BTNS_SIZE}em;
    }
  }
}

$game {
  &  {
    min-height: 100vh;
    touch-action: none;

    width: 100%;
    padding: 1%;
    margin: auto;

    & > table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse; // separate

      & > tr > td {
        padding: 1%;
        vertical-align: top;
      }
    }
  }
}

$btns {
  & {
    touch-action: none;

    top: 0;
    left: 0;
    width: 100%;
    height: ${BTNS_SIZE}em;
    position: fixed;

    .landscape & {
      width: ${BTNS_SIZE}em;
      height: 100%;
    }
  }
}

$btn {
  & {
    width: ${BTNS_SIZE / 1.5}em;
    height: ${BTNS_SIZE / 1.5}em;
    vertical-align: top;
    margin: 0.5em;
    padding: 0.5em;
    position: relative;
    display: inline-block;
    outline: none;
    text-decoration: none;
    border-radius: 50%;
    background-color: #fff;
    transition: background-color 0.25s;

    /* &:hover {
      background-color: #b81817;
    } */

    &.disabled {
      opacity: 0.125;
      cursor: not-allowed;
      background-color: #ccc;
    }
    
    & > div {
      width: 100%;
      height: 100%;
      opacity: 0.75;
      background-size: contain;
      background-repeat: no-repeat;

      &.reset {
        background-image: ${CSS_SVG_RESET};
      }
      &.retake {
        background-image: ${CSS_SVG_CLOCKWISE};
      }
      &.undo {
        background-image: ${CSS_SVG_LEFT};
      }
      &.redo {
        background-image: ${CSS_SVG_RIGHT};
      }
      &.info {
        background-image: ${CSS_SVG_INFO};
      }
    }

    /* &:hover > div {
      opacity: 1;
    } */
  }
}

/* $hover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(255,255,255,0.125);
} */

$card_box {
  & {
    width: 100%;
    position: relative;
    overflow: visible;

    &::before {
      background-color: rgba(255,255,255,0.03125);
      box-shadow: inset 0 0 0 1px #3e3e3e;
    }

  }
}

$fixer {
  width: 100%;
  padding-bottom: 180%;
}

$card {
  & {
    width: 100%;
    overflow: visible;
    position: relative;
    background-position: 0.77% 29.58%;

    &::before {
      // 444 624 // 7416 3371
      background-size: 1685% 542%;
      background-position: inherit;
      background-image: ${CSS_URL_CARD};

      box-shadow: inset 0 0 0 1px #fff;
    }
  }

  & + & {
    margin-top: -140%;
  }
}

$card_box, $card {
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 0;
    border-radius: 4.2%/3%;
    padding-bottom: 140%;
  }
}

$card_box > $card {
  & {
    margin-top: -140%;
  }
}

$card > $card {
  & {
    margin-top: -122.5%;
  }
}

$card.view > $card {
  & {
    margin-top: -105%;
  }
}



$popup {
  & {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    position: fixed;
    background-color: rgb(0, 0, 0, 0.9375);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    &.show {
      display: block;
    }
  }
}

$win {
  & {
    &::before {
      content: '';
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 150px;
      height: 210px;
      margin: auto;
      display: block;
      position: absolute;
      border-radius: 4.2%/3%;
      background-size: 1685% 542%;
      background-position: 0.77% 2.9%;
      background-image: ${CSS_URL_CARD};
    }

    & > div {
      width: 100%;
      bottom: 50%;
      position: absolute;

      font-size: 24px;
      font-weight: 900;
      text-align: center;
      /* font-family: monospace; */
      color: #b81817;

      text-shadow: 1px 1px #fff, -1px -1px #fff;
    }
  }
}

$info {
  & > div {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 1em;
    width: 320px;
    height: 320px;
    position: absolute;
    color: #3d3d3d;
    background: #fff;
    overflow: auto;
    font-size: 0.875em;

    hr {
      border: none;
      border-bottom: 1px solid #ccc;
    }

    h4 {
      margin: 0;
    }

    & $btn {
      margin: 0;
    }
  }
}

`
