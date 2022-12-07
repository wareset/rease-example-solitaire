/* eslint-disable */
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  _t as _t3,
  _E as _E9,
  _x as _x2,
  _l as _l21,
  _C as _C7,
  _$ as _$1,
  _w as _w16,
  _S as _S11,
  _i as _i13
} from 'rease';


import { TypeReaseContext } from 'rease'
import type { TypeReaseSubject } from 'rease'
import { createReaseApp, listen, subject } from 'rease'

import debounce from 'debounce-safe'

import { style } from './style.rease'
import { CARDS, TypeCard } from './lib/cards'
import { shuffle, spliceFromNum, last } from './lib/utils'

const cardBGPosition = (card: TypeCard): string =>
  `background-position:${card.ox}% ${card.oy}%;`

const create_cards = (
  CARDS: TypeCard[],
  key: number,
  $update: TypeReaseSubject<any>,
  final: boolean
): void => {
  let card!: TypeCard
  const $view = subject<boolean>()

  ;(
      _w16(/*r2.$*/_$1([$update], (_$0) => (_$0[0] && (card = CARDS[key]) &&
        (card.cards = CARDS, card.final = final,
        $view.set(card.view = card.view || key === CARDS.length - 1)), card)))(() => {
        if (card) {
              _E9("div", { id: card.id, class: style.$card, "class-view": /*r1.$*/$view, style: /*r2.$*/_$1([$view], (_$0) => (_$0[0] && cardBGPosition(card))) })(
      _i13(/*r2.$*/_$1([$update], (_$0) => (_$0[0] && key + 1 < CARDS.length)))(() => { create_cards(CARDS, key + 1, $update, final) })
    )

        }
      })

  )
}

const create_box_for_finals = (
  CARDS: TypeCard[],
  $update: TypeReaseSubject<any>,
  final: boolean
): void => {
    _w16(/*r2.$*/_$1([$update], (_$0) => (_$0[0] && last(CARDS))))((card0) => {
    if (card0) {
      const card1 = last(CARDS, 1)
      if (card1) {     _E9("div", { class: style.$card, style: cardBGPosition(card1) })()
 }
      create_cards(CARDS, CARDS.length - 1, $update, final)
    }
  })

}

function set_card_in_cards_finals(
  card: TypeCard, cards: TypeCard[], cards_final: TypeCard[], update: Function,
  UNDO_LIST: (() => void)[], REDO_LIST: (() => void)[]
): boolean {
  let res = false
  let cardLast: TypeCard
  if (!cards_final.length && !card.value ||
    (cardLast = last(cards_final)!) &&
    cardLast.value + 1 === card.value &&
    cardLast.color === card.color &&
    cardLast.suit === card.suit) {
    res = true

    let lastIsView: boolean
    const next = (): void => {
      cards_final.push(cards.pop()!)
      if (cards.length) lastIsView = last(cards)!.view
      UNDO_LIST.push(prev)
    }
    const prev = (): void => {
      if (!lastIsView) cards.forEach((v) => { v.view = false })
      cards.push(cards_final.pop()!)
      REDO_LIST.push(next)
    }
    REDO_LIST.length = 0
    next()
    update()
  }
  return res
}

function set_card_in_cards_places(
  card: TypeCard, cards: TypeCard[], cards_final: TypeCard[], update: Function,
  UNDO_LIST: (() => void)[], REDO_LIST: (() => void)[]
): boolean {
  let res = false
  let cardLast: TypeCard
  if (!cards_final.length && card.value === 12 ||
    (cardLast = last(cards_final)!) &&
    cardLast.value === card.value + 1 &&
    cardLast.color !== card.color) {
    res = true

    let lastIsView: boolean
    const next = (): void => {
      const cardsIdx = cards.indexOf(card)
      if (cardsIdx > -1) {
        cards_final.push(...cards.splice(cardsIdx, cards.length))
        if (cards.length) lastIsView = last(cards)!.view
      }
      UNDO_LIST.push(prev)
    }
    const prev = (): void => {
      const cardsIdx = cards_final.indexOf(card)
      if (cardsIdx > -1) {
        if (!lastIsView) cards.forEach((v) => { v.view = false })
        cards.push(...cards_final.splice(cardsIdx, cards_final.length))
      }
      REDO_LIST.push(next)
    }
    REDO_LIST.length = 0
    next()
    update()
  }
  return res
}

function CardBox(
  this: TypeReaseContext,
): void {
    _E9("td")(
    _E9("div", { class: style.$card_box }, this.use)(
      _S11()()
    )
  )

}

const TITLES = {
  reset : 'Shuffle and retake',
  retake: 'Just retake',
  undo  : 'Undo',
  redo  : 'Redo',
  info  : 'About',
  
}

createReaseApp(document.body, function(this: TypeReaseContext) {
  style.on()

  /*
    <CHECK_DIRECTION
  */
  const $maxWidth = subject('')
  const $isLandscape = subject(false)
  const direction = (): void => {
    const isLandscape = innerWidth > innerHeight
    $isLandscape.set(isLandscape)
    $maxWidth.set(isLandscape ? innerHeight * 1.25 + 'px' : '')
  }
  direction(), listen(window, 'resize', debounce(direction, 150))
  /*
    /CHECK_DIRECTION
  */

  const $isWin = subject(false)
  const $isInfo = subject(false)

  const $update = subject({})
  const update = (): void => {
    $update.set({})

    if (CARDS_BOXES_PLACES.every((ctx) =>
      !ctx.pub.CARDS.length || ctx.pub.CARDS[0].view)) { $isWin.set(true) }
  }

  /*
    <CONTAINER_FOR_MOVE_CARDS
  */
  let dragged: null | { node: HTMLElement, card: TypeCard }
  const draggedReset = (): void => {
    if (dragged) {
      dragged.node.style.zIndex = ''
      dragged.node.style.transform = ''
      dragged = null
    }
  }
  const draggedMove = debounce((offset: { x: number, y: number }): void => {
    if (dragged) {
      dragged.node.style.transform = `translate(${offset.x}px,${offset.y}px)`
    }
  })
  /*
    /CONTAINER_FOR_MOVE_CARDS
  */

  /*
    <CARDS_LISTS
  */
  let UNDO_LIST!: (() => void)[], REDO_LIST!: (() => void)[]
  let CARDS_LIST: TypeCard[], CARDS_OBJ: { [key: string]: TypeCard }
  let CARDS_CLOSED: TypeCard[], CARDS_OPENED: TypeCard[]
  let CARDS_BOXES: TypeReaseContext[]
  let CARDS_BOXES_FINALS: TypeReaseContext[]
  let CARDS_BOXES_PLACES: TypeReaseContext[]
  const use_set_card_boxes = (CARDS: TypeCard[], box: TypeReaseContext[]) =>
    (ctx: any): void => { ctx.pub.CARDS = CARDS, box.push(ctx), CARDS_BOXES.push(ctx) }

  const $newgame = subject({})
  const new_game = (isShuffle: boolean): void => {
    draggedReset()
    isShuffle && shuffle(CARDS)
    UNDO_LIST = [], REDO_LIST = []
    CARDS_LIST = CARDS.slice(), CARDS_OBJ = {}
    for (let card: TypeCard, i = CARDS_LIST.length; i-- > 0;) {
      card = CARDS_LIST[i], card.view = card.final = false
      CARDS_OBJ[card.id = 'card-' + i] = card, card.cards = []
    }
    CARDS_CLOSED = CARDS_LIST, CARDS_OPENED = []
    CARDS_BOXES = [], CARDS_BOXES_FINALS = [], CARDS_BOXES_PLACES = []

    $newgame.set({})
  }
  new_game(true)

  /*
    /CARDS_LISTS
  */
  
  /*
    <FIX_CLICK_AFTER_MOVE
  */
  // let isAllowClick = true
  // const allowClick = debounce((): void => { isAllowClick = true })
  // const disallowClick = (): void => { isAllowClick = false, allowClick() }
  /*
    /FIX_CLICK_AFTER_MOVE
  */

  ;(
      _E9("div", { class: /*r2.$*/_$1([$isLandscape], (_$0) => ([style.$root, _$0[0] && 'landscape'])) })(
    _E9("div", { class: style.$btns })(
      _E9("a", { href: "#", class: style.$btn, title: TITLES.reset }, [_l21('click-prevent', debounce(() => { new_game(true) }, 150, true))])(
        _E9("div", { class: "reset" })()
      ),
      _E9("a", { href: "#", class: style.$btn, title: TITLES.retake }, [_l21('click-prevent', debounce(() => { new_game(false) }, 150, true))])(
        _E9("div", { class: "retake" })()
      ),
      _E9("a", { href: "#", class: style.$btn, title: TITLES.undo, "class-disabled": /*r2.$*/_$1([$update, $newgame], (_$0) => (_$0[1] && _$0[0] && !UNDO_LIST.length)) }, [_l21('click-prevent-stop', debounce(() => {
            if (UNDO_LIST.length) UNDO_LIST.pop()!(), update()
          }, 150, true))])(
        _E9("div", { class: "undo" })()
      ),
      _E9("a", { href: "#", class: style.$btn, title: TITLES.redo, "class-disabled": /*r2.$*/_$1([$update, $newgame], (_$0) => (_$0[1] && _$0[0] && !REDO_LIST.length)) }, [_l21('click-prevent', debounce(() => {
            if (REDO_LIST.length) REDO_LIST.pop()!(), update()
          }, 150, true))])(
        _E9("div", { class: "redo" })()
      ),
      _E9("a", { href: "#", class: style.$btn, title: TITLES.info }, [_l21('click-prevent', debounce(() => { $isInfo.set(true) }, 150, true))])(
        _E9("div", { class: "info" })()
      )
    ),
    _E9("div", { class: style.$game, "style-max-width": /*r1.$*/$maxWidth })(
      _w16(/*r1.$*/$newgame)(() => {
                  _E9("table", {}, [_l21('taptrack-05-capture', (e) => {
              switch (e.step) {
                case 'start': {
                  draggedReset()
                  // @ts-ignore
                  let id = e.target.id
      
                  if (id in CARDS_OBJ) {
                    let node = e.target as any
                    for (;node; node = node.children[0]) {
                      id = node.id
                      if (id in CARDS_OBJ && CARDS_OBJ[id].view) {
                        node.style.zIndex = '2'
                        dragged = { node, card: CARDS_OBJ[id] }
                        break
                      }
                    }
                  }
                  break
                }
                case 'move': {
                  draggedMove(e.offset)
                  break
                }
                case 'end': {
                  if (dragged) {
                    // disallowClick()
                    const { node, card } = dragged
                    const cards = card.cards
      
                    const { top, left, right, bottom } = node.getBoundingClientRect()
      
                    const variants: [number, boolean, TypeCard[]][] = []
      
                    let x1: number, y1: number
                    let rect_final: DOMRect, cards_final_temp: TypeCard[]
                    for (let ctx: any, i = CARDS_BOXES.length; i-- > 0;) {
                      ctx = CARDS_BOXES[i]
                      cards_final_temp = ctx.pub.CARDS
                      if (cards_final_temp !== cards) {
                        rect_final = ctx.node.getBoundingClientRect()
      
                        x1 = left < rect_final.left
                          ? right - rect_final.left : rect_final.right - left
                        y1 = top < rect_final.top
                          ? bottom - rect_final.top : rect_final.bottom - top
      
                        if (x1 > 0 && y1 > 0) {
                          variants.push([x1 * y1, i < 4, cards_final_temp])
                        }
                      }
                    }
      
                    variants.sort((a, b) => a[0] - b[0])
      
                    let item: typeof variants[number]
                    const isLast = card === last(cards)
                    for (let i = variants.length; i-- > 0;) {
                      item = variants[i]
                      if (item[1]) {
                        if (isLast && set_card_in_cards_finals(
                          card, cards, item[2], update, UNDO_LIST, REDO_LIST
                        )) {
                          break
                        }
                      } else {
                        // eslint-disable-next-line no-lonely-if
                        if (set_card_in_cards_places(
                          card, cards, item[2], update, UNDO_LIST, REDO_LIST
                        )) {
                          break
                        }
                      }
                    }
                  }
                  draggedReset()
                  break
                }
                default:
              }
            }), _l21('tapend', ((e) => {
              // if (isAllowClick) {
              // @ts-ignore
              const id = e.target.id
    
              if (id in CARDS_OBJ) {
                const card = CARDS_OBJ[id], cards = card.cards
                if (card.view && card === last(cards) && !card.final) {
                  for (let l = CARDS_BOXES_FINALS.length, i = 0; i < l; i++) {
                    if (set_card_in_cards_finals(
                      card, cards, CARDS_BOXES_FINALS[i].pub.CARDS, update, UNDO_LIST, REDO_LIST
                    )) break
                  }
                }
              }
              // }
            }))])(
          _E9("tr")(
            _C7(CardBox, {}, [_l21('tapend-stop', debounce(() => {
                if (CARDS_CLOSED.length) {
                  const next = (): void => {
                    CARDS_OPENED.push(CARDS_CLOSED.pop()!)
                    UNDO_LIST.push(prev)
                  }
                  const prev = (): void => {
                    CARDS_CLOSED.push(CARDS_OPENED.pop()!)
                    REDO_LIST.push(next)
                  }
                  REDO_LIST.length = 0
                  next()
                } else if (CARDS_OPENED.length) {
                  const next = (): void => {
                    CARDS_CLOSED.push(...CARDS_OPENED.splice(0, CARDS_OPENED.length).reverse())
                    UNDO_LIST.push(prev)
                  }
                  const prev = (): void => {
                    CARDS_OPENED.push(...CARDS_CLOSED.splice(0, CARDS_CLOSED.length).reverse())
                    REDO_LIST.push(next)
                  }
                  REDO_LIST.length = 0
                  next()
                } else {
                  return
                }
                update()
              }, 150, true))])([
              [, () => { _E9("div", { class: /*r2.$*/_$1([$update], (_$0) => (_$0[0] && CARDS_CLOSED.length > 0 && style.$card)) })() }]
            ]),
            _C7(CardBox)([
              [, () => { create_box_for_finals(CARDS_OPENED, $update, false) }]
            ]),
            _E9("td")(
              _E9("div", { class: style.$fixer })()
            ),
            [
                  [],
                  [],
                  [],
                  [],
                ].forEach((CARDS) => {
                                _C7(CardBox, {}, [use_set_card_boxes(CARDS, CARDS_BOXES_FINALS)])([
                [, () => { create_box_for_finals(CARDS, $update, true) }]
              ])

                })
          ),
          _E9("tr")(
            [
                  spliceFromNum(CARDS_LIST, 1),
                  spliceFromNum(CARDS_LIST, 2),
                  spliceFromNum(CARDS_LIST, 3),
                  spliceFromNum(CARDS_LIST, 4),
                  spliceFromNum(CARDS_LIST, 5),
                  spliceFromNum(CARDS_LIST, 6),
                  spliceFromNum(CARDS_LIST, 7),
                ].forEach((CARDS) => {
                                _C7(CardBox, {}, [use_set_card_boxes(CARDS, CARDS_BOXES_PLACES)])([
                [, () => { create_cards(CARDS, 0, $update, false) }]
              ])

                })
          )
        )

        })
    )
  )

  )

  ;(
      _E9("div", { class: [style.$popup, style.$win], "class-show": /*r1.$*/$isWin }, [_l21('tapend', () => { new_game(true), $isWin.set(false) })])(
    _E9("div")(
      _t3("YOU WIN")
    )
  )

  )

  ;(
      _E9("div", { class: [style.$popup, style.$info], "class-show": /*r1.$*/$isInfo }, [_l21('tapend', debounce(() => { $isInfo.set(false) }))])(
    _E9("div")(
      _E9("h4")(
        _t3("Interface:")
      ),
      _E9("table")(
        _E9("tr")(
          _E9("td")(
            _E9("div", { class: style.$btn })(
              _E9("div", { class: "reset" })()
            )
          ),
          _E9("td")(
            _t3("- "),
            _x2(TITLES.reset)
          )
        ),
        _E9("tr")(
          _E9("td")(
            _E9("div", { class: style.$btn })(
              _E9("div", { class: "retake" })()
            )
          ),
          _E9("td")(
            _t3("- "),
            _x2(TITLES.retake)
          )
        ),
        _E9("tr")(
          _E9("td")(
            _E9("div", { class: style.$btn })(
              _E9("div", { class: "undo" })()
            )
          ),
          _E9("td")(
            _t3("- "),
            _x2(TITLES.undo)
          )
        ),
        _E9("tr")(
          _E9("td")(
            _E9("div", { class: style.$btn })(
              _E9("div", { class: "redo" })()
            )
          ),
          _E9("td")(
            _t3("- "),
            _x2(TITLES.redo)
          )
        )
      ),
      _E9("hr")(),
      _E9("h4")(
        _t3("Homepage:")
      ),
      _E9("a", { href: "https://github.com/wareset/rease-example-solitaire", target: "_blank" })(
        _t3("Rease example: Solitaire")
      ),
      _E9("br")(),
      _E9("br")(),
      _E9("h4")(
        _t3("Texture:")
      ),
      _E9("a", { href: "https://www.freepik.com/free-vector/deck-gangsta-playing-cards_8083771.htm", target: "_blank" })(
        _t3("Deck of gangsta playing cards")
      ),
      _E9("br")(),
      _t3("and"),
      _E9("br")(),
      _E9("a", { href: "https://www.freepik.com", target: "_blank" })(
        _t3("designed by Dgim-Studio - Freepik.com")
      )
    )
  )

  )
})
